"use client";
import { useEffect, useRef, useState } from "react";
import {filterReviewReports,reportReviewCounts} from "@/lib/v212-report-review-list";
import { CATEGORY_LABELS, type HazardCategory } from "@/lib/demo-hazards";
import {type PrivatePhotoState} from "@/lib/v214-evidence-state";
import {reviewPhotoPresentation} from "@/lib/v216-review-photo-presentation";
type RecordItem={id:string;category:string;description:string;impact:string;reviewState:string;createdAt:string;latitude:number;longitude:number};
export default function V2HazardManager({operatorKey}:{operatorKey:string}) {
  const [items,setItems]=useState<RecordItem[]>([]);
  const [photoStates,setPhotoStates]=useState<Record<string,PrivatePhotoState>|null>(null);
  const [selectedReportId,setSelectedReportId]=useState<string|null>(null);
  const activeSelectionRef=useRef<string|null>(null);
  const selectedReport=items.find(item=>item.id===selectedReportId);
  const selectedPhotoMode=photoStates===null?"unavailable":reviewPhotoPresentation(
    photoStates[selectedReportId??""]??"none",selectedReport?.reviewState??"unverified"
  );
  const [query,setQuery]=useState("");
  const [stateFilter,setStateFilter]=useState("all");
  const [categoryFilter,setCategoryFilter]=useState("all");
  const [order,setOrder]=useState<"needs_review_first"|"newest"|"oldest">("needs_review_first");
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState("");
  const evidenceUrlsRef=useRef<Record<string,string>>({});
  const counts=reportReviewCounts(items);
  const categories=[...new Set(items.map(i=>i.category))].sort();
  const visibleItems=filterReviewReports(items,{query,reviewState:stateFilter,category:categoryFilter,order});
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [publishPhotos,setPublishPhotos]=useState<Record<string,boolean>>({});
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const [evidenceUrls,setEvidenceUrls]=useState<Record<string,string>>({});
  const [aiResults,setAiResults]=useState<Record<string,{provider:string;model:string;analysed:number;matches:{id:string;similarity:number;category:string}[];disclaimer:string}>>({});
  const [aiErrors,setAiErrors]=useState<Record<string,string>>({});
  const [aiBusy,setAiBusy]=useState<string|null>(null);
  function toggleReport(id:string) {
    // Closing or changing rows immediately releases any private local image preview.
    for(const [key,url] of Object.entries(evidenceUrlsRef.current)){
      URL.revokeObjectURL(url);
      delete evidenceUrlsRef.current[key];
    }
    setEvidenceUrls({});
    const next=selectedReportId===id?null:id;
    activeSelectionRef.current=next;
    setSelectedReportId(next);
  }
  async function runAiAnalysis(id:string) {
    setAiBusy(id);setAiErrors(old=>({...old,[id]:""}));
    try {
      const response=await fetch("/api/v2/hazards/"+id+"/ai-triage",{method:"POST",headers:{"x-demo-operator-key":operatorKey}});
      const result=await response.json() as {error?:string;provider:string;model:string;analysed:number;matches:{id:string;similarity:number;category:string}[];disclaimer:string};
      if(!response.ok)throw Error(result.error??"AI comparison failed");
      setAiResults(old=>({...old,[id]:result}));
    }catch(error){setAiErrors(old=>({...old,[id]:error instanceof Error?error.message:"AI unavailable"}));}
    finally{setAiBusy(null);}
  }
  async function viewEvidence(id:string) {
    setMessage("");
    try {
      const response=await fetch("/api/v2/hazards/"+id+"/evidence/private",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"});
      if(!response.ok)throw Error(response.status===404?"No private photo is attached to this report.":"Could not retrieve private photo.");
      const blob=await response.blob();
      // An operator may have switched reports while the private photo was loading.
      if(activeSelectionRef.current!==id)return;
      const url=URL.createObjectURL(blob);
      setEvidenceUrls(old=>{
        if(old[id])URL.revokeObjectURL(old[id]);
        const updated={...old,[id]:url};
        evidenceUrlsRef.current=updated;
        return updated;
      });
    }catch(error){setMessage(error instanceof Error?error.message:"Could not open evidence");}
  }
  async function reload() {
    setLoading(true);setLoadError("");
    try {
      const [r,photoResponse]=await Promise.all([
        fetch("/api/v2/hazards",{cache:"no-store"}),
        fetch("/api/v2/evidence-states",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"})
      ]);
      if(photoResponse.ok){
        const data=await photoResponse.json() as {states:Record<string,PrivatePhotoState>};
        setPhotoStates(data.states);
      }else setPhotoStates(null);
      if(!r.ok) throw Error("Could not load fictional reports. Verify your existing local SQLite connection; do not reset your database.");
      const data=await r.json() as {reports:RecordItem[]};
      setItems(data.reports);
      setSelectedReportId(current=>{
        const next=data.reports.some(item=>item.id===current)?current:(data.reports.find(item=>item.reviewState==="unverified")?.id??data.reports[0]?.id??null);
        activeSelectionRef.current=next;
        return next;
      });
    } catch(e){setLoadError(e instanceof Error?e.message:"Unable to load fictional reports");setPhotoStates(null);}
    finally{setLoading(false);}
  }
  useEffect(()=>{void reload();},[operatorKey]);
  // Release private browser object URLs when leaving report review. Never store images on other pages.
  useEffect(()=>()=>{
    activeSelectionRef.current=null;
    Object.values(evidenceUrlsRef.current).forEach(url=>URL.revokeObjectURL(url));
  },[]);
  // The authenticated operator can inspect an attached sample automatically.
  // The private endpoint still requires the operator key; public access is unchanged.
  useEffect(()=>{
    if(selectedReportId && selectedPhotoMode==="inspect_private" && !evidenceUrlsRef.current[selectedReportId]){
      void viewEvidence(selectedReportId);
    }
  },[selectedReportId,selectedPhotoMode,photoStates,operatorKey]);

  async function review(id:string,decision:"corroborated"|"rejected") {
    setBusy(true);setMessage("");
    try {
      const response=await fetch(`/api/v2/hazards/${id}/review`,{
        method:"PATCH",headers:{"Content-Type":"application/json","x-demo-operator-key":operatorKey},
        body:JSON.stringify({decision,note:notes[id]??"",publishPhoto:decision==="corroborated"&&photoStates?.[id]==="private_unreviewed"&&publishPhotos[id]===true})
      });
      const result=await response.json() as {error?:string};
      if(!response.ok)throw Error(result.error??"Review failed");
      setPublishPhotos(old=>({...old,[id]:false}));
      if(evidenceUrlsRef.current[id]){
        URL.revokeObjectURL(evidenceUrlsRef.current[id]);
        delete evidenceUrlsRef.current[id];
        setEvidenceUrls(old=>{const next={...old};delete next[id];return next;});
      }
      setMessage("Fictional report reviewed. Sample photo kept private unless separately approved. No official road status changed.");
      window.dispatchEvent(new Event("township-hazards-updated"));
      await reload();
    }catch(e){setMessage(e instanceof Error?e.message:"Could not review");}
    finally{setBusy(false);}
  }
  const hasPhoto=(id:string)=>photoStates!==null && photoStates[id]!==undefined && photoStates[id]!=="none";
  const statusName=(state:string)=>state==="corroborated"?"Reviewed":state==="unverified"?"Awaiting review":"Rejected";
  const categoryName=(name:string)=>CATEGORY_LABELS[name as HazardCategory]??name.replaceAll("_"," ");
  return <section className="mt-5" aria-label="Geographic report review">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Report review</h2>
        <p className="mt-1 text-sm text-slate-500">{counts.unverified} awaiting review · {counts.total} fictional reports</p>
      </div>
      <button type="button" disabled={loading} onClick={()=>void reload()} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Refresh reports</button>
    </div>
    {message && <p role="status" className="mb-4 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-950">{message}</p>}
    {loadError && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
      <p className="font-semibold">Could not load reports. No previous review data is shown as current.</p>
      <p className="mt-1">{loadError}</p>
      <button type="button" onClick={()=>void reload()} className="mt-2 font-semibold underline">Retry</button>
    </div>}
    {loading && <p role="status" className="rounded-xl border bg-white p-5 text-sm text-slate-600">Loading reports…</p>}
    {!loading && !loadError && <div className="grid items-start gap-5 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.35fr)]">
      <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-3 border-b border-slate-100 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold">Incoming reports</h3>
            <span className="text-xs text-slate-500">{visibleItems.length} shown</span>
          </div>
          <label className="block text-xs font-medium text-slate-600">Search reports
            <input type="search" value={query} onChange={e=>setQuery(e.target.value)}
              placeholder="Category, description or ID…" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"/>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-medium text-slate-600">Review status
              <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2 text-sm">
                <option value="all">All statuses</option>
                <option value="unverified">Awaiting review ({counts.unverified})</option>
                <option value="corroborated">Reviewed ({counts.corroborated})</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">Category
              <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2 text-sm">
                <option value="all">All categories</option>
                {categories.map(category=><option key={category} value={category}>{categoryName(category)}</option>)}
              </select>
            </label>
          </div>
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-slate-600">Sort by
              <select value={order} onChange={e=>setOrder(e.target.value as "needs_review_first"|"newest"|"oldest")}
                className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
                <option value="needs_review_first">Needs review</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
            <button type="button" onClick={()=>{setQuery("");setStateFilter("all");setCategoryFilter("all");setOrder("needs_review_first");}}
              className="text-xs font-semibold text-teal-800 hover:underline">Clear filters</button>
          </div>
        </div>
        {visibleItems.length===0 && <p role="status" className="p-5 text-sm text-slate-500">No matching reports.</p>}
        <ul aria-label="Incoming fictional reports" className="max-h-[750px] divide-y divide-slate-100 overflow-y-auto">
          {visibleItems.map(item=><li key={item.id}>
            <button type="button" onClick={()=>toggleReport(item.id)} aria-pressed={selectedReportId===item.id}
              className={"w-full px-4 py-4 text-left transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 "+
                (selectedReportId===item.id?"bg-teal-50 ring-1 ring-inset ring-teal-200":"")}>
              <div className="flex items-start justify-between gap-2">
                <strong className="text-sm text-slate-900">{categoryName(item.category)}</strong>
                <span className={"shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold "+
                  (item.reviewState==="unverified"?"bg-amber-50 text-amber-800":"bg-teal-50 text-teal-800")}>{statusName(item.reviewState)}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <span>{new Date(item.createdAt).toLocaleString()}</span>
                {hasPhoto(item.id)&&<span aria-label="Attached sample photo">Photo attached</span>}
              </div>
            </button>
          </li>)}
        </ul>
      </div>
      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {selectedReport && visibleItems.some(i=>i.id===selectedReport.id) ? <>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{categoryName(selectedReport.category)}</p>
              <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{selectedReport.description}</h3>
              <p className="mt-2 text-xs text-slate-500">{new Date(selectedReport.createdAt).toLocaleString()} · Report {selectedReport.id}</p>
            </div>
            <span className={"rounded-full px-3 py-1.5 text-xs font-semibold "+
              (selectedReport.reviewState==="unverified"?"bg-amber-50 text-amber-900":"bg-teal-50 text-teal-900")}>{statusName(selectedReport.reviewState)}</span>
          </div>
          <div className="mt-5">
            <h4 className="mb-3 text-sm font-bold text-slate-900">Submitted photo</h4>
            {selectedPhotoMode==="approved_inline" && <img
              src={"/api/v2/hazards/"+encodeURIComponent(selectedReport.id)+"/evidence/approved"}
              alt={"Approved fictional sample for "+categoryName(selectedReport.category)}
              className="max-h-80 w-full rounded-xl bg-slate-50 object-contain"/>}
            {selectedPhotoMode==="inspect_private" && (evidenceUrls[selectedReport.id]
              ? <img src={evidenceUrls[selectedReport.id]} alt={"Attached fictional sample for "+categoryName(selectedReport.category)}
                  className="max-h-80 w-full rounded-xl bg-slate-50 object-contain"/>
              : <p role="status" className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Loading attached image for operator review…</p>)}
            {selectedPhotoMode==="none" && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No photo attached.</p>}
            {selectedPhotoMode==="unavailable" && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Photo information could not be verified. Refresh before making a photo visibility decision.</p>}
          </div>
          <div className="mt-5 grid gap-3 border-b border-slate-100 pb-5 text-sm text-slate-700 sm:grid-cols-2">
            <div><span className="block text-xs text-slate-500">Reported impact</span><strong className="font-semibold">{selectedReport.impact.replaceAll("_"," ")}</strong></div>
            <div><span className="block text-xs text-slate-500">Reported location (demo)</span><strong className="font-semibold">{selectedReport.latitude.toFixed(5)}, {selectedReport.longitude.toFixed(5)}</strong></div>
          </div>
          {selectedReport.reviewState==="unverified" && <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-slate-800">Reason for decision
              <textarea value={notes[selectedReport.id]??""} onChange={e=>setNotes(old=>({...old,[selectedReport.id]:e.target.value}))}
                maxLength={400} rows={2} placeholder="Brief reason (at least 8 characters)"
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 p-3 text-sm font-normal"/>
            </label>
            {photoStates?.[selectedReport.id]==="private_unreviewed" && <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 accent-teal-800"
                checked={publishPhotos[selectedReport.id]===true}
                onChange={e=>setPublishPhotos(p=>({...p,[selectedReport.id]:e.target.checked}))}/>
              <span>Also show this photo in the resident app after approval <small className="block text-xs text-slate-500">Only select if it contains no identifiable people or private details.</small></span>
            </label>}
            <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h4 className="text-sm font-semibold text-slate-900">Similar reports</h4><p className="mt-1 text-xs text-slate-600">Optional AI comparison. You make the decision.</p></div>
                <button type="button" disabled={aiBusy!==null} onClick={()=>void runAiAnalysis(selectedReport.id)}
                  className="rounded-lg bg-violet-800 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
                  {aiBusy===selectedReport.id?"Checking…":"Find similar reports"}
                </button>
              </div>
              {aiErrors[selectedReport.id] && <p role="status" className="mt-2 text-xs text-rose-800">{aiErrors[selectedReport.id]}</p>}
              {aiResults[selectedReport.id] && <div className="mt-3 space-y-1 text-xs text-slate-700">
                {aiResults[selectedReport.id].matches.length
                  ? aiResults[selectedReport.id].matches.map(m=><p key={m.id}>Possible match: {m.id} · {(m.similarity*100).toFixed(0)}% similarity</p>)
                  : <p>No strong matches found.</p>}
                <p className="pt-1 text-slate-500">Advisory only; not automatic verification.</p>
              </div>}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" disabled={busy||(notes[selectedReport.id]??"").trim().length<8}
                onClick={()=>void review(selectedReport.id,"corroborated")}
                className="min-h-11 flex-1 rounded-xl bg-teal-800 px-5 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-40">Approve report</button>
              <button type="button" disabled={busy||(notes[selectedReport.id]??"").trim().length<8}
                onClick={()=>void review(selectedReport.id,"rejected")}
                className="min-h-11 flex-1 rounded-xl border border-rose-200 px-5 py-3 text-sm font-bold text-rose-800 hover:bg-rose-50 disabled:opacity-40">Reject report</button>
            </div>
            <p className="text-xs text-slate-500">Approval means a human reviewed a fictional submission; it does not verify any road hazard.</p>
          </div>}
        </> : <div className="py-16 text-center text-sm text-slate-500">Select a report from the list to inspect its details.</div>}
      </div>
    </div>}
  </section>;
}
