"use client";
import { useEffect, useRef, useState } from "react";
import {filterReviewReports,reportReviewCounts} from "@/lib/v212-report-review-list";
import { CATEGORY_LABELS, type HazardCategory } from "@/lib/demo-hazards";
import { relatedReports } from "@/lib/v2-related-reports";
import {describePrivatePhotoState,type PrivatePhotoState} from "@/lib/v214-evidence-state";
type RecordItem={id:string;category:string;description:string;impact:string;reviewState:string;createdAt:string;latitude:number;longitude:number};
export default function V2HazardManager({operatorKey}:{operatorKey:string}) {
  const [items,setItems]=useState<RecordItem[]>([]);
  const [photoStates,setPhotoStates]=useState<Record<string,PrivatePhotoState>|null>(null);
  const [selectedReportId,setSelectedReportId]=useState<string|null>(null);
  const [query,setQuery]=useState("");
  const [stateFilter,setStateFilter]=useState("all");
  const [categoryFilter,setCategoryFilter]=useState("all");
  const [order,setOrder]=useState<"needs_review_first"|"newest"|"oldest">("needs_review_first");
  const [loading,setLoading]=useState(true);
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
    setSelectedReportId(current=>current===id?null:id);
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
    setLoading(true);
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
      setSelectedReportId(current=>data.reports.some(item=>item.id===current)?current:null);
    } catch(e){ setMessage(e instanceof Error?e.message:"Unable to load demo reports"); }
    finally{setLoading(false);}
  }
  useEffect(()=>{void reload();},[operatorKey]);
  // Release private browser object URLs when leaving report review. Never store images on other pages.
  useEffect(()=>()=>{Object.values(evidenceUrlsRef.current).forEach(url=>URL.revokeObjectURL(url));},[]);
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
      setMessage("Fictional report reviewed. Sample photo kept private unless separately approved. No official road status changed.");
      window.dispatchEvent(new Event("township-hazards-updated"));
      await reload();
    }catch(e){setMessage(e instanceof Error?e.message:"Could not review");}
    finally{setBusy(false);}
  }
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="Geographic demo report review">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-wider text-teal-700">V2 · fictional incident intake</p><h2 className="mt-1 text-xl font-bold">Geographic hazard report review</h2></div>
      <button type="button" onClick={()=>void reload()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">Refresh reports</button>
    </div>
    <p className="mt-2 text-sm text-slate-600">Separate from the old demonstration flood report queue. A corroborated report is not a verified road closure.</p>
    {message?<p role="status" className="mt-3 text-sm text-teal-800">{message}</p>:null}
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/50 p-4" aria-label="Find fictional report reviews">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Find geographic reports</h3>
        <span className="text-xs text-slate-600">{visibleItems.length} of {counts.total} visible · {counts.unverified} awaiting human review</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <label className="col-span-2 text-xs font-medium text-slate-700 lg:col-span-1">Search descriptions or IDs
          <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search fictional reports" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"/>
        </label>
        <label className="text-xs font-medium text-slate-700">Review state
          <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="all">All visible reports</option>
            <option value="unverified">Unverified ({counts.unverified})</option>
            <option value="corroborated">Corroborated ({counts.corroborated})</option>
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">Category
          <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="all">All categories</option>
            {categories.map(category=><option key={category} value={category}>{CATEGORY_LABELS[category as HazardCategory]??category.replaceAll("_"," ")}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">Order
          <select value={order} onChange={e=>setOrder(e.target.value as "needs_review_first"|"newest"|"oldest")} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="needs_review_first">Unverified first</option>
            <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      <button type="button" onClick={()=>{setQuery("");setStateFilter("all");setCategoryFilter("all");setOrder("needs_review_first");}} className="mt-3 text-xs font-semibold text-teal-800 underline underline-offset-2">Clear filters</button>
      <p className="mt-2 text-xs text-slate-500">The local resident feed excludes rejected reports; these filters only organize the already visible records and never make review decisions.</p>
    </div>
    <div className="mt-4 space-y-3">
      {loading?<p role="status" className="text-sm text-slate-600">Loading fictional geographic reports…</p>:null}
      {!loading&&items.length>0&&visibleItems.length===0?<p role="status" className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No fictional reports match these filters. Clear filters to see all available records.</p>:null}
      {!loading&&items.length===0?<p className="text-sm text-slate-500">No geographic demo reports yet. Submit one from the resident map.</p>:null}
      <ul className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100" aria-label="Fictional geographic reports">
      {visibleItems.map(item=><li key={item.id} className={selectedReportId===item.id?"bg-teal-50/40":"bg-white"}>
        <button type="button" onClick={()=>toggleReport(item.id)} aria-expanded={selectedReportId===item.id}
          aria-controls={"report-details-"+item.id}
          className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 sm:flex-nowrap">
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-sm text-slate-900">{CATEGORY_LABELS[item.category as HazardCategory]??item.category}</strong>
            <span className="block truncate text-xs text-slate-500">{item.description}</span>
          </span>
          <span className="whitespace-nowrap text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
          <span className="hidden whitespace-nowrap text-[11px] font-medium text-slate-500 lg:inline">{photoStates===null?"Photo status unavailable":describePrivatePhotoState(photoStates[item.id]??"none").label}</span>
          <span className={"rounded-full px-2 py-1 text-[11px] font-bold uppercase "+(item.reviewState==="unverified"?"bg-amber-50 text-amber-900":"bg-teal-50 text-teal-900")}>{item.reviewState} · DEMO</span>
          <span className="min-w-12 text-right text-xs font-semibold text-teal-800">{selectedReportId===item.id?"Hide ▲":"View ▼"}</span>
        </button>
        {selectedReportId===item.id?<div id={"report-details-"+item.id} className="border-t border-teal-100 bg-white px-4 py-4 sm:px-5">
        <p className="text-sm leading-6 text-slate-700">{item.description}</p>
        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <p className="font-semibold">Sample photo: {photoStates===null?"Status unavailable":describePrivatePhotoState(photoStates[item.id]??"none").label}</p>
          <p className="mt-1">{photoStates===null?"The private metadata check could not be completed. Photo-publication choices are disabled until refreshed.":describePrivatePhotoState(photoStates[item.id]??"none").explanation}</p>
        </div>
        {item.reviewState==="unverified" ? <p className="mt-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900">Rule-based triage (not AI): {relatedReports(item,items).priority.replaceAll("_"," ")}. Possible related report IDs: {relatedReports(item,items).ids.join(", ")||"none"}. Operator review required.</p> : null}
        {item.reviewState==="unverified"?<div className="mt-2 rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs text-violet-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="font-bold">AI semantic matching · optional</p><p className="mt-1">Compare fictional descriptions with a model. Human review required.</p></div>
            <button type="button" disabled={aiBusy!==null} onClick={()=>void runAiAnalysis(item.id)} className="rounded-lg bg-violet-800 px-3 py-2 font-semibold text-white disabled:opacity-50">{aiBusy===item.id?"Analysing…":"Run AI comparison"}</button>
          </div>
          {aiErrors[item.id]?<p role="status" className="mt-2 text-rose-800">{aiErrors[item.id]}</p>:null}
          {aiResults[item.id]?<div className="mt-3 space-y-1">
            <p className="font-semibold">Provider: {aiResults[item.id].provider} · Model: {aiResults[item.id].model} · compared {aiResults[item.id].analysed} reports</p>
            {aiResults[item.id].matches.length?aiResults[item.id].matches.map(match=><p key={match.id}>Possible match: {match.id} · similarity {(match.similarity*100).toFixed(1)}% · {match.category.replaceAll("_"," ")}</p>):<p>No strong semantic matches found.</p>}
            <p className="mt-2 text-violet-800">{aiResults[item.id].disclaimer}</p>
          </div>:null}
        </div>:null}
        <p className="mt-1 text-xs text-slate-500">Submitted impact: {item.impact.replaceAll("_"," ")} · {new Date(item.createdAt).toLocaleString()}</p>
        <div className="mt-3">
          <button type="button" onClick={()=>void viewEvidence(item.id)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">View attached private photo (if any)</button>
          {evidenceUrls[item.id] ? <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <img src={evidenceUrls[item.id]} alt={"Private demonstration evidence for "+item.category} className="max-h-64 max-w-full rounded object-contain" />
            <p className="mt-2 text-xs text-amber-950">Local operator inspection only. This image is not public, verified, or evidence of real road safety.</p>
            <button type="button" className="mt-2 text-xs font-semibold underline" onClick={()=>{URL.revokeObjectURL(evidenceUrls[item.id]);setEvidenceUrls(old=>{const next={...old};delete next[item.id];evidenceUrlsRef.current=next;return next;});}}>Hide photo</button>
          </div> : null}
        </div>
        {item.reviewState==="unverified"?<div className="mt-3 space-y-2">
          <label className="block text-xs font-semibold">Review reason
            <input value={notes[item.id]??""} onChange={e=>setNotes(old=>({...old,[item.id]:e.target.value}))} maxLength={400} className="mt-1 block w-full rounded-lg border border-slate-300 p-2" placeholder="At least 8 characters" />
          </label>
          <label className="flex items-start gap-2 text-xs text-slate-700"><input type="checkbox" checked={photoStates?.[item.id]==="private_unreviewed"&&publishPhotos[item.id]===true} disabled={photoStates?.[item.id]!=="private_unreviewed"} onChange={e=>setPublishPhotos(prev=>({...prev,[item.id]:e.target.checked}))} /> Separately approve the attached sample photo for public demonstration (only if no identifiable people or private details). Otherwise keep it private.</label>
          <div className="flex gap-2">
            <button type="button" disabled={busy||(notes[item.id]??"").trim().length<8} onClick={()=>void review(item.id,"corroborated")} className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">Corroborate report</button>
            <button type="button" disabled={busy||(notes[item.id]??"").trim().length<8} onClick={()=>void review(item.id,"rejected")} className="rounded-lg border border-slate-300 px-3 py-2 text-xs disabled:opacity-40">Reject report</button>
          </div>
        </div>:null}
        </div>:null}
      </li>)}
      </ul>
    </div>
  </section>;
}
