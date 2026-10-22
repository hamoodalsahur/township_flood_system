"use client";
import {useEffect,useState} from "react";
type Report={id:string;category:string;description:string;reviewState:string;createdAt:string};
type Incident={id:string;title:string;category:string;status:string;reviewNote:string;possibleRoad:string|null;createdAt:string;reports:{reportId:string;linkedAt:string;report:{category:string;description:string;reviewState:string}}[]};
export default function IncidentManager({operatorKey}:{operatorKey:string}){
 const [incidents,setIncidents]=useState<Incident[]>([]);
 const [reports,setReports]=useState<Report[]>([]);
 const [newReport,setNewReport]=useState("");const [title,setTitle]=useState("");const [reason,setReason]=useState("");
 const [notes,setNotes]=useState<Record<string,string>>({}),[roads,setRoads]=useState<Record<string,string>>({}),[statuses,setStatuses]=useState<Record<string,string>>({}),[links,setLinks]=useState<Record<string,string>>({});
 const [error,setError]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
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
  const [a,b]=await Promise.all([fetch("/api/v2/incidents",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"}),fetch("/api/v2/hazards",{cache:"no-store"})]);
  if(!a.ok||!b.ok)throw Error("Unable to load incident management records");
  const incidentsData=await a.json() as {incidents:Incident[]},reportsData=await b.json() as {reports:Report[]};
  setIncidents(incidentsData.incidents);setReports(reportsData.reports.filter(r=>r.reviewState!=="rejected"));
 }
 useEffect(()=>{void reload().catch(e=>setError(e instanceof Error?e.message:"Load failed"));},[operatorKey]);
 const assigned=new Set(incidents.flatMap(i=>i.reports.map(r=>r.reportId)));
 const available=reports.filter(r=>!assigned.has(r.id));
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
  <div className="mt-4 rounded-xl bg-slate-50 p-4">
   <h3 className="text-sm font-bold">Create a fictional incident from a report</h3>
   <label className="mt-3 block text-xs">Starting report
    <select className="mt-1 w-full rounded-lg border bg-white p-2" value={newReport} onChange={e=>setNewReport(e.target.value)}>
     <option value="">Select an ungrouped report</option>{available.map(r=><option key={r.id} value={r.id}>{r.category.replaceAll("_"," ")} · {r.description.slice(0,70)}</option>)}
    </select>
   </label>
   <label className="mt-2 block text-xs">Incident title<input maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Fictional blocked junction" className="mt-1 w-full rounded-lg border p-2"/></label>
   <label className="mt-2 block text-xs">Operator reason<input maxLength={400} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why these report details belong together" className="mt-1 w-full rounded-lg border p-2"/></label>
   <button disabled={busy||!newReport||title.trim().length<8||reason.trim().length<8} onClick={()=>void request("/api/v2/incidents","POST",{reportId:newReport,title,note:reason})} className="mt-3 rounded-lg bg-teal-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">Create incident group</button>
  </div>
  <div className="mt-4 space-y-4">
   {incidents.length===0?<p className="text-sm text-slate-500">No grouped incidents yet. Create one above using a fictional report.</p>:null}
   {incidents.map(incident=><article key={incident.id} className="rounded-xl border border-slate-200 p-4">
    <div className="flex flex-wrap justify-between gap-2"><h3 className="font-bold">{incident.title}</h3><span className="text-xs font-semibold uppercase text-teal-800">{incident.status.replaceAll("_"," ")} · DEMO</span></div>
    <p className="mt-1 text-xs text-slate-600">{incident.category.replaceAll("_"," ")} · {incident.reports.length} linked report(s) · {new Date(incident.createdAt).toLocaleString()}</p>
    <ul className="mt-2 space-y-2 text-xs text-slate-700">{incident.reports.map(link=><li key={link.reportId} className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
     <span>{link.report.description} <span className="text-slate-500">({link.report.reviewState})</span></span>
     {incident.status!=="resolved"&&incident.reports.length>1?<button type="button" disabled={busy||(notes[incident.id]??"").trim().length<8} onClick={()=>void request("/api/v2/incidents/"+incident.id,"DELETE",{reportId:link.reportId,note:notes[incident.id]})} className="rounded border border-rose-200 px-2 py-1 font-semibold text-rose-800 disabled:opacity-40">Unlink (reason required)</button>:null}
    </li>)}</ul>
    {incident.status!=="resolved"?<div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3">
     <div className="rounded-lg border border-indigo-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
       <div><p className="text-xs font-bold text-indigo-900">AI suggestions for this incident</p><p className="text-xs text-slate-600">Compares nearby ungrouped fictional reports. Never links automatically.</p></div>
       <button type="button" disabled={suggestBusy!==null||busy} onClick={()=>void suggest(incident.id)} className="rounded-lg bg-indigo-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">{suggestBusy===incident.id?"Comparing…":"Find AI candidates"}</button>
      </div>
      {suggestions[incident.id]?<div className="mt-2 space-y-2 text-xs">
       <p className="font-semibold">Provider: {suggestions[incident.id].provider} · Model: {suggestions[incident.id].model}</p>
       {suggestions[incident.id].candidates.length===0?<p>No strong candidate detected. Manual linking remains possible.</p>:null}
       {suggestions[incident.id].candidates.map(candidate=><div key={candidate.id} className="rounded border p-2">
        <p>{candidate.description} · similarity {(candidate.similarity*100).toFixed(1)}%</p>
        <button type="button" onClick={()=>setLinks(old=>({...old,[incident.id]:candidate.id}))} className="mt-1 font-semibold text-indigo-800 underline">Select for manual linking</button>
       </div>)}
       <p className="text-slate-600">{suggestions[incident.id].disclaimer}</p>
      </div>:null}
     </div>
     <label className="block text-xs">Link another report in same category
      <select value={links[incident.id]??""} onChange={e=>setLinks(p=>({...p,[incident.id]:e.target.value}))} className="mt-1 w-full rounded-lg border bg-white p-2"><option value="">Choose ungrouped report</option>{available.filter(r=>r.category===incident.category).map(r=><option key={r.id} value={r.id}>{r.description.slice(0,90)}</option>)}</select>
     </label>
     <label className="block text-xs">Operator justification (required for both linking and status change)<input maxLength={400} value={notes[incident.id]??""} onChange={e=>setNotes(p=>({...p,[incident.id]:e.target.value}))} className="mt-1 w-full rounded-lg border p-2" placeholder="Evidence and decision reasoning"/></label>
     <button className="rounded-lg border border-teal-300 bg-white px-3 py-2 text-xs font-bold disabled:opacity-40" disabled={busy||!links[incident.id]||(notes[incident.id]??"").trim().length<8} onClick={()=>void request("/api/v2/incidents/"+incident.id,"POST",{reportId:links[incident.id],note:notes[incident.id]})}>Link selected report</button>
     <label className="block text-xs">Management lifecycle
      <select className="mt-1 w-full rounded-lg border bg-white p-2" value={statuses[incident.id]??incident.status} onChange={e=>setStatuses(p=>({...p,[incident.id]:e.target.value}))}>
       <option value="under_review" disabled={incident.status!=="under_review"}>Under review</option>
       <option value="corroborated">Corroborated fictional incident</option><option value="resolved">Resolved fictional incident</option>
      </select>
     </label>
     <label className="block text-xs">Possible road affected (fictional, free-text, no closure)<input maxLength={120} value={roads[incident.id]??incident.possibleRoad??""} onChange={e=>setRoads(p=>({...p,[incident.id]:e.target.value}))} placeholder="e.g. Demo access road" className="mt-1 w-full rounded-lg border p-2"/></label>
     <button className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40" disabled={busy||(notes[incident.id]??"").trim().length<8} onClick={()=>void request("/api/v2/incidents/"+incident.id,"PATCH",{status:statuses[incident.id]??incident.status,note:notes[incident.id],possibleRoad:roads[incident.id]??incident.possibleRoad??""})}>Save incident decision</button>
    </div>:<p className="mt-2 text-xs text-slate-600">Resolved groups are read-only. This does not establish the road is safe.</p>}
    <p className="mt-2 text-xs text-slate-500">Possible fictional road reference: {incident.possibleRoad||"Not assessed"} · Last operator reasoning: {incident.reviewNote}</p>
   </article>)}
  </div>
 </section>;
}
