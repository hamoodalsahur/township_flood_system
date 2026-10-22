"use client";
import {useState} from "react";
import type {EvidenceInventory as Metrics} from "@/lib/v2-evidence-inventory";

export default function EvidenceInventory({operatorKey}:{operatorKey:string}){
 const [metrics,setMetrics]=useState<Metrics|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 async function refresh(){
  setBusy(true);setError("");
  try{
   const response=await fetch("/api/v2/evidence-inventory",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"});
   const data=await response.json() as {metrics?:Metrics;error?:string};
   if(!response.ok||!data.metrics)throw Error(data.error||"Evidence inventory unavailable");
   setMetrics(data.metrics);
  }catch(e){setError(e instanceof Error?e.message:"Unable to inspect demo evidence");}
  finally{setBusy(false);}
 }
 const rows=metrics?([
  ["Evidence records",metrics.totalEvidence],
  ["Private · unreviewed",metrics.privateUnreviewed],
  ["Approved for public demo",metrics.approvedPublicDemo],
  ["Kept private · rejected",metrics.privateRejected],
  ["Unrecognised status",metrics.unknownState],
  ["All evidence over 30 days",metrics.overThirtyDays],
  ["Private evidence over 30 days",metrics.privateOverThirtyDays],
  ["Approved evidence over 30 days",metrics.approvedOverThirtyDays]
 ] as const):[];
 return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="Private evidence inventory">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-xs font-bold uppercase text-teal-700">Privacy oversight · demonstration media</p>
   <h2 className="mt-1 text-xl font-bold">Private evidence inventory</h2></div>
   <button type="button" onClick={()=>void refresh()} disabled={busy}
     className="rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50">
     {busy?"Loading…":"Inspect privacy inventory"}</button>
  </div>
  <p className="mt-2 text-sm text-slate-600">Read-only aggregate counts. No photographs, report descriptions, coordinates or private notes are returned. This is not an automatic retention or deletion policy.</p>
  {error?<p role="alert" className="mt-2 text-xs text-rose-800">{error}</p>:null}
  {metrics?<div className="mt-4 space-y-3">
   <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {rows.map(([label,count])=><div key={label} className="rounded-lg bg-slate-50 p-3">
     <p className="text-xs text-slate-600">{label}</p>
     <p className="mt-1 text-xl font-bold">{count}</p>
    </div>)}
   </div>
   <p className="text-xs text-slate-700">Stored image payload size (original decoded bytes): {metrics.storedPayloadBytes.toLocaleString()} bytes. No image content was loaded for this calculation.</p>
   <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-950">{metrics.disclaimer}</p>
  </div>:null}
 </section>;
}
