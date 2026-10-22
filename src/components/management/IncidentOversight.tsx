"use client";
import {useEffect,useState} from "react";
type Metrics={totalReports:number;unverifiedReports:number;overdueUnverified:number;ungroupedReports:number;groupedReports:number;activeIncidents:number;resolvedIncidents:number;incidentsUnderReview:number;corroboratedIncidents:number;possibleRoadReferences:number;ageingIncidentIds:string[];multiReportIncidents:number};
export default function IncidentOversight({operatorKey}:{operatorKey:string}){
 const [metrics,setMetrics]=useState<Metrics|null>(null),[error,setError]=useState(""),[loading,setLoading]=useState(false);
 async function reload(){
  setLoading(true);setError("");
  try{
   const res=await fetch("/api/v2/incident-oversight",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"});
   const data=await res.json() as {metrics?:Metrics;error?:string};
   if(!res.ok||!data.metrics)throw Error(data.error||"Overview unavailable");
   setMetrics(data.metrics);
  }catch(e){setError(e instanceof Error?e.message:"Overview unavailable");}
  finally{setLoading(false);}
 }
 useEffect(()=>{void reload();},[operatorKey]);
 const figures=metrics?[["Unverified reports",metrics.unverifiedReports],["Over 24h without review",metrics.overdueUnverified],["Ungrouped reports",metrics.ungroupedReports],["Active managed incidents",metrics.activeIncidents],["Resolved incidents",metrics.resolvedIncidents],["Multi-report incidents",metrics.multiReportIncidents],["Unverified road references",metrics.possibleRoadReferences],["Total fictional reports",metrics.totalReports]] as const:[];
 return <section aria-label="Fictional incident oversight" className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase text-teal-800">V2.6 · management visibility</p><h2 className="mt-1 text-xl font-bold">Incident oversight</h2></div><button type="button" disabled={loading} onClick={()=>void reload()} className="rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50">{loading?"Refreshing…":"Refresh overview"}</button></div>
  <p className="mt-2 text-sm text-slate-600">Counts are calculated from fictional local records. They show review workload, not verified road hazards or emergency response priorities.</p>
  {error?<p role="alert" className="mt-2 text-sm text-rose-800">{error}</p>:null}
  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{figures.map(([label,value])=><div key={label} className="rounded-xl border bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-700">{label}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p></div>)}</div>
  {metrics?.ageingIncidentIds.length?<p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">{metrics.ageingIncidentIds.length} under-review incident group(s) are older than 24h. This is a demo review-age indicator, not an emergency warning.</p>:null}
 </section>;
}
