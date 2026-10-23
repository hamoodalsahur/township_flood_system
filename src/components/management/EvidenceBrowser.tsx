"use client";
import {useEffect,useState} from "react";
import type {PrivatePhotoState} from "@/lib/v214-evidence-state";

type Report={id:string;category:string;description:string;reviewState:string;createdAt:string;hasApprovedPhoto:boolean;latitude:number;longitude:number};
type States=Record<string,PrivatePhotoState>;
const stateLabel=(state:PrivatePhotoState)=>state==="approved_public_demo"?"Approved image":state==="private_unreviewed"?"Awaiting review":state==="private_rejected"?"Not published":"Needs checking";

export default function EvidenceBrowser({operatorKey}:{operatorKey:string}){
 const [reports,setReports]=useState<Report[]>([]);
 const [states,setStates]=useState<States>({});
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [reloadVersion,setReloadVersion]=useState(0);
 const [photoUrl,setPhotoUrl]=useState("");
 const [photoBusy,setPhotoBusy]=useState(false);
 const [photoError,setPhotoError]=useState("");
 useEffect(()=>{
  let active=true;
  setLoading(true);setError("");setReports([]);setStates({});
  void Promise.all([
   fetch("/api/v2/hazards",{cache:"no-store"}),
   fetch("/api/v2/evidence-states",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"})
  ]).then(async([feed,photos])=>{
   if(!feed.ok||!photos.ok)throw Error("Could not load photo review records.");
   const a=await feed.json() as {reports?:Report[]};
   const b=await photos.json() as {states?:States};
   if(!Array.isArray(a.reports)||!b.states)throw Error("Photo review data is incomplete.");
   if(!active)return;
   const visible=a.reports.filter(r=>b.states?.[r.id] && b.states[r.id]!=="none")
     .sort((l,r)=>Date.parse(r.createdAt)-Date.parse(l.createdAt));
   setReports(visible);setStates(b.states);
   setSelectedId(current=>visible.some(r=>r.id===current)?current:visible[0]?.id??null);
  }).catch(e=>{if(active)setError(e instanceof Error?e.message:"Photo review unavailable.");})
    .finally(()=>{if(active)setLoading(false);});
  return ()=>{active=false;};
 },[operatorKey,reloadVersion]);
 const selected=reports.find(r=>r.id===selectedId);
 const state=selected?states[selected.id]:undefined;
 const approved=selected?.reviewState==="corroborated" && state==="approved_public_demo";
 useEffect(()=>{
  let active=true;
  let objectUrl="";
  setPhotoUrl("");setPhotoError("");
  if(!selectedId || !state || state==="unknown" || approved)return;
  setPhotoBusy(true);
  void fetch("/api/v2/hazards/"+encodeURIComponent(selectedId)+"/evidence/private",
   {headers:{"x-demo-operator-key":operatorKey},cache:"no-store"})
   .then(async response=>{
    if(!response.ok)throw Error("This attached photo could not be opened.");
    const blob=await response.blob();
    if(!active)return;
    objectUrl=URL.createObjectURL(blob);
    setPhotoUrl(objectUrl);
   }).catch(e=>{if(active)setPhotoError(e instanceof Error?e.message:"Photo unavailable.");})
   .finally(()=>{if(active)setPhotoBusy(false);});
  return ()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl);};
 },[selectedId,state,approved,operatorKey]);
 return <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.35fr)]" aria-label="Photo evidence browser">
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
   <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-5">
    <div><h2 className="text-lg font-bold">Submitted photos</h2><p className="mt-1 text-xs text-slate-500">Attached to visible fictional reports</p></div>
    <button type="button" disabled={loading} onClick={()=>setReloadVersion(v=>v+1)}
      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-50">Refresh</button>
   </div>
   {error&&<p role="alert" className="p-5 text-sm text-rose-800">{error}</p>}
   {loading&&<p className="p-5 text-sm text-slate-500">Loading evidence…</p>}
   {!loading&&!error&&reports.length===0&&<p className="p-5 text-sm text-slate-500">No attached photos in the current report feed.</p>}
   <ul className="max-h-[650px] divide-y divide-slate-100 overflow-y-auto">
    {!loading&&!error&&reports.map(r=><li key={r.id}>
     <button type="button" onClick={()=>setSelectedId(r.id)} aria-pressed={selectedId===r.id}
      className={"w-full p-4 text-left hover:bg-slate-50 "+(selectedId===r.id?"bg-teal-50 ring-1 ring-inset ring-teal-200":"")}>
      <p className="text-sm font-semibold capitalize text-slate-900">{r.category.replaceAll("_"," ")}</p>
      <p className="mt-1 line-clamp-2 text-xs text-slate-600">{r.description}</p>
      <p className="mt-2 text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()} · {stateLabel(states[r.id])}</p>
     </button>
    </li>)}
   </ul>
  </div>
  <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
   <h2 className="text-lg font-bold">Photo details</h2>
   {selected ? <>
    <p className="mt-2 text-sm text-slate-600">{selected.description}</p>
    <p className="mt-2 text-xs text-slate-500">Reference: {selected.id}</p>
    {state==="unknown" || state==="approved_public_demo"&&!approved
     ? <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">Photo metadata needs checking before it can be displayed.</p>
     : approved ? <img src={"/api/v2/hazards/"+encodeURIComponent(selected.id)+"/evidence/approved"}
       alt="Approved fictional photo evidence" className="mt-4 max-h-80 w-full rounded-xl bg-slate-50 object-contain"/>
     : photoUrl ? <img src={photoUrl} alt="Attached fictional photo for operator review"
       className="mt-4 max-h-80 w-full rounded-xl bg-slate-50 object-contain"/>
     : photoBusy ? <p role="status" className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">Loading attached photo…</p>
     : photoError ? <p role="alert" className="mt-4 text-sm text-rose-800">{photoError}</p>
     : <p className="mt-4 text-sm text-slate-600">Select a report to view its attached photo.</p>}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
     <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{state&&stateLabel(state)}</span>
     <a href="/management/incidents#report-review" className="rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700">Open report review</a>
    </div>
   </> : <p className="mt-4 text-sm text-slate-500">Select an attached photo to view its details.</p>}
  </div>
 </section>;
}
