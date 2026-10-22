"use client";
import {useState} from "react";
type Candidate={id:string;name:string;highway:string;sourceUrl:string;distanceMetres:number;verification:string};
type Result={candidates:Candidate[];reportLocations:number;roadFeaturesScanned:number;disclaimer:string};
export default function IncidentRoadCandidates({id,operatorKey}:{id:string;operatorKey:string}){
 const [data,setData]=useState<Result|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function inspect(){
  setBusy(true);setError("");
  try{
   const res=await fetch("/api/v2/incidents/"+id+"/road-candidates",{headers:{"x-demo-operator-key":operatorKey},cache:"no-store"});
   const payload=await res.json() as Result&{error?:string};
   if(!res.ok)throw Error(payload.error||"Road comparison unavailable");
   setData(payload);
  }catch(e){setError(e instanceof Error?e.message:"Road comparison failed");}
  finally{setBusy(false);}
 }
 return <section className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
  <div className="flex flex-wrap items-center justify-between gap-2">
   <div><p className="text-xs font-bold text-amber-950">Possible nearby mapped roads · unverified</p><p className="mt-1 text-xs text-amber-900">Read-only geometry research; does not update road conditions.</p></div>
   <button type="button" disabled={busy} onClick={()=>void inspect()} className="rounded-lg border border-amber-400 bg-white px-3 py-2 text-xs font-bold text-amber-950 disabled:opacity-50">{busy?"Checking…":"Inspect nearby road lines"}</button>
  </div>
  {error?<p role="alert" className="mt-2 text-xs text-rose-900">{error}</p>:null}
  {data?<div className="mt-3 space-y-2">
   <p className="text-xs font-semibold text-amber-950">Compared {data.reportLocations} fictional report locations against {data.roadFeaturesScanned} locally imported OSM road lines.</p>
   {data.candidates.length===0?<p className="text-xs">No mapped road lines found within 150 m of the available report points.</p>:null}
   <ul className="space-y-2">{data.candidates.map(road=><li key={road.id} className="rounded-lg border border-amber-200 bg-white p-2 text-xs">
    <strong>{road.name}</strong> · {road.highway.replaceAll("_"," ")} · approximately {road.distanceMetres} m from a report
    <p className="mt-1"><a href={road.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-800 underline">View original OSM way</a> · {road.id} · unverified geometry</p>
   </li>)}</ul>
   <p className="text-xs leading-5 text-amber-950">{data.disclaimer}</p>
  </div>:null}
 </section>;
}
