"use client";
import {useEffect,useState} from "react";
import IncidentRoadCandidates from "@/components/management/IncidentRoadCandidates";
import {filterIncidentGroups,incidentStatusCounts} from "@/lib/v212-incident-list";
import {AI_REVIEW_REMINDER,similarityLabel,canManuallyLinkSuggestion} from "@/lib/v214-ai-review-guidance";
type Report={id:string;category:string;description:string;reviewState:string;createdAt:string};
type Incident={id:string;title:string;category:string;status:string;reviewNote:string;possibleRoad:string|null;createdAt:string;reports:{reportId:string;linkedAt:string;report:{category:string;description:string;reviewState:string}}[]};
export default function IncidentManager({operatorKey}:{operatorKey:string}){
 const [incidents,setIncidents]=useState<Incident[]>([]);
 const [selectedIncidentId,setSelectedIncidentId]=useState<string|null>(null);
 const [reports,setReports]=useState<Report[]>([]);
 const [newReport,setNewReport]=useState("");const [title,setTitle]=useState("");const [reason,setReason]=useState("");
 const [notes,setNotes]=useState<Record<string,string>>({}),[roads,setRoads]=useState<Record<string,string>>({}),[statuses,setStatuses]=useState<Record<string,string>>({}),[links,setLinks]=useState<Record<string,string>>({});
 const [error,setError]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(true);
 const [loadError,setLoadError]=useState("");
 const [query,setQuery]=useState("");
 const [statusFilter,setStatusFilter]=useState("all");
 const [categoryFilter,setCategoryFilter]=useState("all");
 const [sort,setSort]=useState<"newest"|"oldest">("newest");
 const [suggestions,setSuggestions]=useState<Record<string,{provider:string;model:string;candidates:{id:string;description:string;similarity:number}[];disclaimer:string}>>({});
 const [suggestBusy,setSuggestBusy]=useState<string|null>(null);
 async function suggest(id:string){
  setSuggestBusy(id);setError("");
  try{
   const response=await fetch("/api/v2/incidents/"+id+"/suggestions",{method:"POST",headers:{"x-demo-operator-key":operatorKey}});
   const data=await response.json() as {provider:string;model:string;candidates:{id:string;description:string;similarity:number}[];disclaimer:string;error?:string};
   if(!response.ok)throw Error(data.error||"AI suggestions unavailable");
   setSuggestions(old=>({...old,[id]:data}));
  }catch(e){setError(e instanceof Error?e.message:"AI unavailable");}
  finally{setSuggestBusy(null);}
 }
 async function reload(){
  setLoading(true);setLoadError("");
  try{
  const [a,b]=await Promise.all([fetch("/api/v2/incidents",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"}),fetch("/api/v2/hazards",{cache:"no-store"})]);
  if(!a.ok||!b.ok)throw Error("Unable to load incident management records");
  const incidentsData=await a.json() as {incidents:Incident[]},reportsData=await b.json() as {reports:Report[]};
  setIncidents(incidentsData.incidents);setReports(reportsData.reports.filter(r=>r.reviewState!=="rejected"));
  setSelectedIncidentId(old=>incidentsData.incidents.some(i=>i.id===old)?old:null);
  }catch(e){
   setLoadError(e instanceof Error?e.message:"Unable to refresh fictional incident records");
  }finally{setLoading(false);}
 }
 useEffect(()=>{void reload();},[operatorKey]);
 const assigned=new Set(incidents.flatMap(i=>i.reports.map(r=>r.reportId)));
 const available=reports.filter(r=>!assigned.has(r.id));
 const counts=incidentStatusCounts(incidents);
 const categories=[...new Set(incidents.map(i=>i.category))].sort();
 const visible=filterIncidentGroups(incidents,{query,status:statusFilter,category:categoryFilter,sort});

 async function request(path:string,method:"POST"|"PATCH"|"DELETE",body:object){
  setBusy(true);setError("");setMessage("");
  try{
   const res=await fetch(path,{method,headers:{"Content-Type":"application/json","x-demo-operator-key":operatorKey},body:JSON.stringify(body)});
   const data=await res.json() as {error?:string};
   if(!res.ok)throw Error(data.error||"Operator action failed");
   setMessage("Fictional incident action recorded in audit history. No road status changed.");
   setSuggestions({});
   await reload();
  }catch(e){setError(e instanceof Error?e.message:"Request failed");}
  finally{setBusy(false);}
 }
 return <section className="mt-6 rounded-2xl border border-teal-200 bg-white p-5" aria-label="Managed fictional incidents">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700">V2.5 · operator-controlled incident management</p><h2 className="mt-1 text-xl font-bold text-slate-900">Managed incident groups</h2></div><button type="button" onClick={()=>void reload().catch(e=>setError(String(e)))} className="rounded-lg border px-3 py-2 text-xs">Refresh</button></div>
  <p className="mt-2 text-sm text-slate-600">Link related fictional reports only after human review. AI suggestions do not automatically group incidents. A suspected road impact is descriptive only and never changes route or road status.</p>
  {error?<p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>:null}
  {message?<p role="status" className="mt-3 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">{message}</p>:null}
  <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
   <summary className="cursor-pointer text-sm font-bold text-teal-900">+ Create a fictional incident group</summary>
   <p className="mt-2 text-xs text-slate-600">Select an ungrouped fictional report and supply the required operator reason. No automatic grouping.</p>
   <label className="mt-3 block text-xs">Starting report
    <select className="mt-1 w-full rounded-lg border bg-white p-2" value={newReport} onChange={e=>setNewReport(e.target.value)}>
     <option value="">Select an ungrouped report</option>{available.map(r=><option key={r.id} value={r.id}>{r.category.replaceAll("_"," ")} · {r.description.slice(0,70)}</option>)}
    </select>
   </label>
   <label className="mt-2 block text-xs">Incident title<input maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Fictional blocked junction" className="mt-1 w-full rounded-lg border p-2"/></label>
   <label className="mt-2 block text-xs">Operator reason<input maxLength={400} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why these report details belong together" className="mt-1 w-full rounded-lg border p-2"/></label>
   <button disabled={busy||!newReport||title.trim().length<8||reason.trim().length<8} onClick={()=>void request("/api/v2/incidents","POST",{reportId:newReport,title,note:reason})} className="mt-3 rounded-lg bg-teal-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">Create incident group</button>
  </details>
  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4" aria-label="Filter fictional incident groups">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="font-semibold text-slate-900">Find incident groups</h3>
      <span className="text-xs font-medium text-slate-500">{visible.length} of {counts.total} fictional groups shown</span>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <label className="col-span-2 text-xs font-medium text-slate-700 lg:col-span-1">Search by title, ID or possible road
        <input type="search" value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Search fictional groups" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"/>
      </label>
      <label className="text-xs font-medium text-slate-700">Review state
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          <option value="under_review">Under review ({counts.underReview})</option>
          <option value="corroborated">Corroborated ({counts.corroborated})</option>
          <option value="resolved">Resolved ({counts.resolved})</option>
        </select>
      </label>
      <label className="text-xs font-medium text-slate-700">Category
        <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="all">All categories</option>{categories.map(c=><option key={c} value={c}>{c.replaceAll("_"," ")}</option>)}
        </select>
      </label>
      <label className="text-xs font-medium text-slate-700">Order
        <select value={sort} onChange={e=>setSort(e.target.value as "newest"|"oldest")} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
        </select>
      </label>
    </div>
    <button type="button" className="mt-3 text-xs font-semibold text-teal-800 underline underline-offset-2" onClick={()=>{setQuery("");setStatusFilter("all");setCategoryFilter("all");setSort("newest");}}>Clear filters</button>
    <p className="mt-2 text-xs text-slate-500">Filtering changes this view only. It does not affect existing incident decisions, roads or audit entries.</p>
  </div>
  <div className="mt-4 space-y-3">
   {incidents.length>0&&visible.length===0?<p role="status" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No fictional incident groups match these filters. Clear filters to see the full list.</p>:null}
   {loading?<p role="status" className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">Loading fictional incident groups…</p>:null}
   {loadError?<div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
     <p>Incident groups could not be refreshed. Previously displayed information may be outdated.</p>
     <p className="mt-1 text-xs">{loadError}</p>
     <button type="button" onClick={()=>void reload()} disabled={loading} className="mt-3 rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold">Retry loading</button>
   </div>:null}
   {!loading&&!loadError&&incidents.length===0?<p className="text-sm text-slate-500">No grouped incidents yet. Create one above using a fictional report.</p>:null}
   <ul className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100" aria-label="Fictional incident groups">
   {!loadError&&visible.map(incident=><li key={incident.id} className={selectedIncidentId===incident.id?"bg-teal-50/40":"bg-white"}>
    <button type="button" onClick={()=>setSelectedIncidentId(id=>id===incident.id?null:incident.id)}
      aria-expanded={selectedIncidentId===incident.id} aria-controls={"incident-details-"+incident.id}
      className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 sm:flex-nowrap">
      <span className="min-w-0 flex-1">
        <strong className="block truncate text-sm text-slate-900">{incident.title}</strong>
        <span className="block text-xs text-slate-500">{incident.category.replaceAll("_"," ")} · {incident.reports.length} linked report(s)</span>
      </span>
      <span className="whitespace-nowrap text-xs text-slate-500">{new Date(incident.createdAt).toLocaleDateString()}</span>
      <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase text-teal-900">{incident.status.replaceAll("_"," ")} · DEMO</span>
      <span className="min-w-12 text-right text-xs font-semibold text-teal-800">{selectedIncidentId===incident.id?"Hide ▲":"View ▼"}</span>
    </button>
    {selectedIncidentId===incident.id?<div id={"incident-details-"+incident.id} className="border-t border-teal-100 bg-white p-4">
    <ul className="mt-2 space-y-2 text-xs text-slate-700">{incident.reports.map(link=><li key={link.reportId} className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
     <span>{link.report.description} <span className="text-slate-500">({link.report.reviewState})</span></span>
     {incident.status!=="resolved"&&incident.reports.length>1?<button type="button" disabled={busy||(notes[incident.id]??"").trim().length<8} onClick={()=>void request("/api/v2/incidents/"+incident.id,"DELETE",{reportId:link.reportId,note:notes[incident.id]})} className="rounded border border-rose-200 px-2 py-1 font-semibold text-rose-800 disabled:opacity-40">Unlink (reason required)</button>:null}
    </li>)}</ul>
    {incident.status!=="resolved"?<div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3">
     <details className="rounded-lg border border-indigo-200 bg-white p-3">
      <summary className="cursor-pointer text-xs font-semibold text-indigo-900">Optional AI similarity · expand to run</summary>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
       <div><p className="text-xs font-bold text-indigo-900">AI suggestions for this incident</p><p className="text-xs text-slate-600">Compares nearby ungrouped fictional reports. Never links automatically.</p></div>
       <button type="button" disabled={suggestBusy!==null||busy} onClick={()=>void suggest(incident.id)} className="rounded-lg bg-indigo-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">{suggestBusy===incident.id?"Comparing…":"Find AI candidates"}</button>
      </div>
      {suggestions[incident.id]?<div className="mt-2 space-y-2 text-xs">
       <p className="font-semibold">Provider: {suggestions[incident.id].provider} · Model: {suggestions[incident.id].model}</p>
       {suggestions[incident.id].candidates.length===0?<p>No strong candidate detected. Manual linking remains possible.</p>:null}
       {suggestions[incident.id].candidates.map(candidate=><div key={candidate.id} className="rounded border p-2">
        <p>{candidate.description} · {similarityLabel(candidate.similarity)}</p>
        <button type="button" disabled={!available.some(r=>r.id===candidate.id)}
         aria-pressed={links[incident.id]===candidate.id}
         onClick={()=>setLinks(old=>({...old,[incident.id]:candidate.id}))}
         className="mt-1 font-semibold text-indigo-800 underline disabled:opacity-50">
         {links[incident.id]===candidate.id?"Selected for manual review ✓":"Select candidate (no automatic link)"}
        </button>
       </div>)}
       <p className="text-slate-600">{suggestions[incident.id].disclaimer}</p>
       <p className="rounded-lg bg-amber-50 p-2 leading-5 text-amber-950">{AI_REVIEW_REMINDER}</p>
      </div>:null}
     </details>
     <label className="block text-xs">Link another report in same category
      <select value={links[incident.id]??""} onChange={e=>setLinks(p=>({...p,[incident.id]:e.target.value}))} className="mt-1 w-full rounded-lg border bg-white p-2"><option value="">Choose ungrouped report</option>{available.filter(r=>r.category===incident.category).map(r=><option key={r.id} value={r.id}>{r.description.slice(0,90)}</option>)}</select>
     </label>
     {links[incident.id]?<p role="status" className="text-xs text-amber-950">Candidate selected for manual review only. An operator reason and separate Link selected report click are still required.</p>:null}
     <label className="block text-xs">Operator justification (required for both linking and status change)<input maxLength={400} value={notes[incident.id]??""} onChange={e=>setNotes(p=>({...p,[incident.id]:e.target.value}))} className="mt-1 w-full rounded-lg border p-2" placeholder="Evidence and decision reasoning"/></label>
     <button className="rounded-lg border border-teal-300 bg-white px-3 py-2 text-xs font-bold disabled:opacity-40" disabled={busy||!canManuallyLinkSuggestion(links[incident.id]??"",available.filter(r=>r.category===incident.category).map(r=>r.id),notes[incident.id]??"")} onClick={()=>void request("/api/v2/incidents/"+incident.id,"POST",{reportId:links[incident.id],note:notes[incident.id]})}>Link selected report</button>
     <label className="block text-xs">Management lifecycle
      <select className="mt-1 w-full rounded-lg border bg-white p-2" value={statuses[incident.id]??incident.status} onChange={e=>setStatuses(p=>({...p,[incident.id]:e.target.value}))}>
       <option value="under_review" disabled={incident.status!=="under_review"}>Under review</option>
       <option value="corroborated">Corroborated fictional incident</option><option value="resolved">Resolved fictional incident</option>
      </select>
     </label>
     <label className="block text-xs">Possible road affected (fictional, free-text, no closure)<input maxLength={120} value={roads[incident.id]??incident.possibleRoad??""} onChange={e=>setRoads(p=>({...p,[incident.id]:e.target.value}))} placeholder="e.g. Demo access road" className="mt-1 w-full rounded-lg border p-2"/></label>
     <button className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40" disabled={busy||(notes[incident.id]??"").trim().length<8} onClick={()=>void request("/api/v2/incidents/"+incident.id,"PATCH",{status:statuses[incident.id]??incident.status,note:notes[incident.id],possibleRoad:roads[incident.id]??incident.possibleRoad??""})}>Save incident decision</button>
    </div>:<p className="mt-2 text-xs text-slate-600">Resolved groups are read-only. This does not establish the road is safe.</p>}
    <IncidentRoadCandidates id={incident.id} operatorKey={operatorKey} />
    <p className="mt-2 text-xs text-slate-500">Possible fictional road reference: {incident.possibleRoad||"Not assessed"} · Last operator reasoning: {incident.reviewNote}</p>
    </div>:null}
   </li>)}
   </ul>
  </div>
 </section>;
}
