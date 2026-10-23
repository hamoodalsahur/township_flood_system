"use client";
import Link from "next/link";
import {useCallback,useEffect,useState} from "react";
import {ArrowRight,ClipboardList,MapPinned,Images,BrainCircuit,Settings2} from "lucide-react";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import ReviewAgeQueue from "@/components/management/ReviewAgeQueue";
import OperatorAuditSummary from "@/components/management/OperatorAuditSummary";

type OverviewMetrics={totalReports:number;unverifiedReports:number;activeIncidents:number;resolvedIncidents:number};
type Report={id:string;category:string;description:string;reviewState:string;createdAt:string;hasApprovedPhoto:boolean};
const shortcuts=[
 {href:"/management/incidents",label:"Review reports",icon:ClipboardList},
 {href:"/management/maps",label:"Open map",icon:MapPinned},
 {href:"/management/evidence",label:"Evidence",icon:Images},
 {href:"/management/research",label:"AI & research",icon:BrainCircuit},
 {href:"/management/system",label:"System checks",icon:Settings2}
];
export default function OverviewPage(){
 const operatorKey=useManagementOperatorKey();
 const [metrics,setMetrics]=useState<OverviewMetrics|null>(null);
 const [reports,setReports]=useState<Report[]>([]);
 const [busy,setBusy]=useState(true);
 const [error,setError]=useState("");
 const reload=useCallback(async()=>{
  setBusy(true);setError("");setMetrics(null);setReports([]);
  try{
   const [oversight,feed]=await Promise.all([
    fetch("/api/v2/incident-oversight",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"}),
    fetch("/api/v2/hazards",{cache:"no-store"})
   ]);
   if(!oversight.ok||!feed.ok)throw Error("Could not load the latest overview. Check your local server and try again.");
   const a=await oversight.json() as {metrics?:OverviewMetrics};
   const b=await feed.json() as {reports?:Report[]};
   if(!a.metrics||!Array.isArray(b.reports))throw Error("Overview data was incomplete.");
   setMetrics(a.metrics);
   setReports(b.reports.slice().sort((l,r)=>Date.parse(r.createdAt)-Date.parse(l.createdAt)));
  }catch(e){setError(e instanceof Error?e.message:"Overview is unavailable.");}
  finally{setBusy(false);}
 },[operatorKey]);
 useEffect(()=>{void reload();},[reload]);
 const cards=metrics?[
  ["All reports",metrics.totalReports],
  ["Awaiting review",metrics.unverifiedReports],
  ["Reviewed",Math.max(0,metrics.totalReports-metrics.unverifiedReports)],
  ["Active incident groups",metrics.activeIncidents]
 ] as const:[];
 const queue=reports.filter(r=>r.reviewState==="unverified").slice(0,4);
 return <>
  <ManagementSectionHeading section="overview"/>
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
   <p className="text-sm text-slate-600">Latest fictional reports and operator review workload.</p>
   <button type="button" onClick={()=>void reload()} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">{busy?"Loading…":"Refresh overview"}</button>
  </div>
  {error&&<p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
   {cards.map(([label,count])=><div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-3 text-3xl font-extrabold text-slate-900">{count}</p>
   </div>)}
   {busy&&Array.from({length:4},(_,i)=><div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100"/>)}
  </div>
  {!error&&!busy&&<div className="mt-5 grid items-start gap-5 xl:grid-cols-2">
   <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Recent reports</h2><Link href="/management/incidents#report-review" className="text-sm font-semibold text-teal-800">View all <ArrowRight className="inline" size={15}/></Link></div>
    {reports.length===0?<p className="mt-4 text-sm text-slate-500">No fictional reports yet.</p>:<ul className="mt-3 divide-y divide-slate-100">
     {reports.slice(0,5).map(r=><li key={r.id} className="py-3">
      <p className="font-semibold capitalize text-slate-900">{r.category.replaceAll("_"," ")}</p>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{r.description}</p>
      <p className="mt-1 text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()} · {r.reviewState==="unverified"?"Awaiting review":"Reviewed"}</p>
     </li>)}
    </ul>}
   </section>
   <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Review queue</h2><Link href="/management/incidents#report-review" className="text-sm font-semibold text-teal-800">Open review <ArrowRight className="inline" size={15}/></Link></div>
    {queue.length===0?<p className="mt-4 text-sm text-slate-500">No reports awaiting review.</p>:<ul className="mt-3 divide-y divide-slate-100">
     {queue.map(r=><li key={r.id} className="py-3">
      <div className="flex items-center justify-between gap-2"><strong className="text-sm capitalize text-slate-900">{r.category.replaceAll("_"," ")}</strong><span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">Awaiting review</span></div>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{r.description}</p>
     </li>)}
    </ul>}
   </section>
  </div>}
  <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
   <h2 className="text-lg font-bold">Quick actions</h2>
   <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {shortcuts.map(({href,label,icon:Icon})=><Link key={href} href={href} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-800 hover:border-teal-200 hover:bg-teal-50">
      <span className="flex items-center gap-2"><Icon size={18} className="text-teal-800"/>{label}</span><ArrowRight size={16}/>
    </Link>)}
   </div>
  </section>
  <details className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
   <summary className="cursor-pointer font-semibold text-slate-800">Review-age and activity details <span className="ml-2 text-xs font-normal text-slate-500">Advanced</span></summary>
   <div className="grid items-start gap-4 xl:grid-cols-2"><ReviewAgeQueue operatorKey={operatorKey}/><OperatorAuditSummary operatorKey={operatorKey}/></div>
  </details>
 </>;
}
