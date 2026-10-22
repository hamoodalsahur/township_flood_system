"use client";
import {useState} from "react";
import type {EvidenceConsistencyCounts} from "@/lib/v2-evidence-consistency";

export default function EvidenceConsistency({operatorKey}:{operatorKey:string}){
 const [metrics,setMetrics]=useState<EvidenceConsistencyCounts|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 async function inspect(){
  setBusy(true);setError("");
  try{
   const response=await fetch("/api/v2/evidence-consistency",{
    headers:{"x-demo-operator-key":operatorKey},cache:"no-store"
   });
   const data=await response.json() as {metrics?:EvidenceConsistencyCounts;error?:string};
   if(!response.ok||!data.metrics)throw Error(data.error||"Evidence audit unavailable");
   setMetrics(data.metrics);
  }catch(e){setError(e instanceof Error?e.message:"Could not check fictional evidence");}
  finally{setBusy(false);}
 }
 const values=metrics?([
  ["Records inspected",metrics.recordsScanned],
  ["Records with warning(s)",metrics.totalFlaggedRecords],
  ["Public-demo status without corroborated report",metrics.approvedWithNonCorroboratedReport],
  ["Private unreviewed photo on already reviewed report",metrics.unreviewedPhotoOnReviewedReport],
  ["Private rejected photo on unverified report",metrics.reviewedPhotoOnUnverifiedReport],
  ["Unknown photo status",metrics.unexpectedEvidenceStatus],
  ["Unknown report review state",metrics.unexpectedReportReviewState],
  ["Unsupported declared image type",metrics.unsupportedDeclaredMimeType],
  ["Invalid stored image byte count",metrics.invalidStoredByteCount]
 ] as const):[];
 return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="Fictional evidence consistency audit">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-xs font-bold uppercase text-teal-700">Evidence privacy · read-only metadata</p>
    <h2 className="mt-1 text-xl font-bold">Fictional photo-publication consistency</h2></div>
   <button type="button" disabled={busy} onClick={()=>void inspect()}
    className="rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50">
    {busy?"Checking…":"Inspect evidence safeguards"}</button>
  </div>
  <p className="mt-2 text-sm text-slate-600">Checks stored fictional review/publication metadata only. It does not open photo contents or change any review, publication or deletion decision.</p>
  {error?<p role="alert" className="mt-3 text-xs text-rose-800">{error}</p>:null}
  {metrics?<div className="mt-4 space-y-3">
   <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{values.map(([label,value])=>
    <div key={label} className="rounded-lg bg-slate-50 p-3">
     <p className="text-xs text-slate-600">{label}</p>
     <p className="mt-1 text-xl font-bold">{value}</p>
    </div>)}</div>
   <p className="text-xs text-slate-600">One record may trigger several counters; do not add warning categories together.</p>
   <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-950">{metrics.disclaimer}</p>
  </div>:null}
 </section>;
}
