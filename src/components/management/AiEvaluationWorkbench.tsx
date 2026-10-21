"use client";
import {useState} from "react";
type Row={threshold:number;tp:number;fp:number;fn:number;tn:number;precision:number|null;recall:number|null;f1:number|null;accuracy:number;pairCount:number};
type Result={provider:string;model:string;caseCount:number;metrics:Row[];disclaimer:string};
function pct(v:number|null){return v===null?"N/A":(v*100).toFixed(1)+"%";}
export default function AiEvaluationWorkbench({operatorKey}:{operatorKey:string}){
 const [result,setResult]=useState<Result|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 async function run(){
  setBusy(true);setError("");setResult(null);
  try{
   const response=await fetch("/api/v2/ai-evaluation",{method:"POST",headers:{"x-demo-operator-key":operatorKey}});
   const payload=await response.json() as Result&{error?:string};
   if(!response.ok)throw Error(payload.error||"Evaluation failed");
   setResult(payload);
  }catch(e){setError(e instanceof Error?e.message:"Evaluation unavailable");}
  finally{setBusy(false);}
 }
 return <section className="mt-6 rounded-2xl border border-indigo-200 bg-white p-5" aria-label="AI evaluation workbench">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-xs font-bold uppercase tracking-wider text-indigo-700">V2 · model quality research</p><h2 className="mt-1 text-xl font-bold text-slate-900">AI Evaluation Workbench</h2></div>
   <button type="button" onClick={()=>void run()} disabled={busy} className="rounded-lg bg-indigo-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busy?"Running synthetic benchmark…":"Evaluate local AI model"}</button>
  </div>
  <p className="mt-2 text-sm text-slate-600">Runs 16 fixed fictional descriptions (8 intended related pairs), compares all 120 pairs, then reports precision, recall, F1 and false positives across similarity thresholds. No resident photos or real reports are sent.</p>
  {error?<p role="status" className="mt-3 text-sm text-rose-800">{error}</p>:null}
  {result?<div className="mt-4 space-y-3">
   <p className="text-sm font-semibold text-slate-800">Provider: {result.provider} · Model: {result.model} · {result.caseCount} samples</p>
   <div className="overflow-x-auto"><table className="min-w-full text-left text-xs">
    <thead className="bg-slate-100 text-slate-700"><tr><th className="px-2 py-2">Threshold</th><th className="px-2 py-2">Precision</th><th className="px-2 py-2">Recall</th><th className="px-2 py-2">F1</th><th className="px-2 py-2">False matches</th><th className="px-2 py-2">Missed pairs</th></tr></thead>
    <tbody>{result.metrics.map(row=><tr key={row.threshold} className={row.threshold===0.78?"border-t bg-indigo-50 font-semibold":"border-t"}>
     <td className="px-2 py-2">{row.threshold.toFixed(2)}{row.threshold===0.78?" (current)":" "}</td>
     <td className="px-2 py-2">{pct(row.precision)}</td><td className="px-2 py-2">{pct(row.recall)}</td>
     <td className="px-2 py-2">{pct(row.f1)}</td><td className="px-2 py-2">{row.fp}</td><td className="px-2 py-2">{row.fn}</td>
    </tr>)}</tbody>
   </table></div>
   <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">{result.disclaimer} A high score on this small authored set is not a production safety guarantee.</p>
  </div>:null}
 </section>;
}
