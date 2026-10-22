"use client";
import {useState} from "react";
import type {RoadTagAudit} from "@/lib/v2-road-access-tags";

export default function RoadAccessTags({operatorKey}:{operatorKey:string}){
  const [metrics,setMetrics]=useState<RoadTagAudit|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function inspect(){
    setBusy(true);setError("");
    try{
      const response=await fetch("/api/v2/road-access-tags",{
        headers:{"x-demo-operator-key":operatorKey},cache:"no-store"
      });
      const data=await response.json() as {metrics?:RoadTagAudit;error?:string};
      if(!response.ok||!data.metrics)throw new Error(data.error||"Unable to inspect OSM access tags");
      setMetrics(data.metrics);
    }catch(cause){
      setError(cause instanceof Error?cause.message:"Could not inspect road tags");
    }finally{setBusy(false);}
  }
  const rows=metrics?([
    ["Imported road lines",metrics.roadLines],
    ["Explicit one-way tags",metrics.explicitlyOneWay],
    ["Reverse one-way tags",metrics.reverseOneWay],
    ["Unrecognised one-way values",metrics.unrecognisedOneway],
    ["Nonstandard access tags",metrics.nonstandardAccess],
    ["Nonstandard motor-vehicle tags",metrics.nonstandardMotorVehicle],
    ["No access/vehicle tag (unknown)",metrics.missingAccessAndMotorVehicle],
    ["Bridge tagged",metrics.bridgeTagged],
    ["Tunnel tagged",metrics.tunnelTagged],
    ["Nonzero layer tags",metrics.nonzeroLayer],
    ["Unparseable layer tags",metrics.invalidLayerTag],
  ] as const):[];
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="OSM access tag review">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-bold uppercase text-teal-700">Geographic research · read-only</p>
        <h2 className="mt-1 text-xl font-bold">OSM access-tag caveats</h2></div>
      <button type="button" disabled={busy} onClick={()=>void inspect()}
        className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-50">
        {busy?"Inspecting…":"Inspect OSM tags"}</button>
    </div>
    <p className="mt-2 text-sm text-slate-600">Counts raw local OSM tags without inferring road access, safety or legal routing.</p>
    {error?<p role="alert" className="mt-3 text-xs text-rose-800">{error}</p>:null}
    {metrics?<div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {rows.map(([label,value])=><div key={label} className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-600">{label}</p>
          <p className="mt-1 text-xl font-bold">{value}</p>
        </div>)}
      </div>
      <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">{metrics.disclaimer}</p>
    </div>:null}
  </section>;
}
