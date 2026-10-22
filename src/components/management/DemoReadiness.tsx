"use client";
import {useState} from "react";
type Check={id:string;label:string;passed:boolean;detail:string};
export default function DemoReadiness({operatorKey}:{operatorKey:string}){
 const [checks,setChecks]=useState<Check[]>([]),[error,setError]=useState(""),[busy,setBusy]=useState(false),[loaded,setLoaded]=useState(false);
 async function run(){
  setBusy(true);setError("");
  try{
   const res=await fetch("/api/v2/demo-readiness",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"});
   const body=await res.json() as {checks?:Check[];error?:string};
   if(!res.ok||!body.checks)throw Error(body.error||"Readiness checks unavailable");
   setChecks(body.checks);setLoaded(true);
  }catch(e){setError(e instanceof Error?e.message:"Checks failed");}finally{setBusy(false);}
 }
 return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="Local demo readiness">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase text-teal-700">Team demonstration preparation</p><h2 className="mt-1 text-xl font-bold">Local demo readiness</h2></div><button type="button" disabled={busy} onClick={()=>void run()} className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{busy?"Checking…":"Check local setup"}</button></div>
  <p className="mt-2 text-sm text-slate-600">Check database availability, local mode, operator key, geographic file and AI provider configuration. The endpoint does not reveal secret values.</p>
  {error?<p role="alert" className="mt-2 text-xs text-rose-700">{error}</p>:null}
  {loaded?<div className="mt-4 space-y-2">{checks.map(check=><div key={check.id} className="rounded-lg border p-3 text-xs"><p className={check.passed?"font-bold text-teal-800":"font-bold text-amber-800"}>{check.passed?"PASS":"CHECK"} · {check.label}</p><p className="mt-1 text-slate-600">{check.detail}</p></div>)}
   <p className="text-xs text-amber-800">Configuration-only demo diagnostics. Passing checks do not establish real road safety, production security or an actively running AI model.</p>
  </div>:null}
 </section>;
}
