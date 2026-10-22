"use client";
import {useState} from "react";
import type {GeoSourceManifest as Manifest} from "@/lib/v2-geo-source-manifest";

export default function GeoSourceManifest({operatorKey}:{operatorKey:string}){
 const [manifest,setManifest]=useState<Manifest|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 async function inspect(){
  setBusy(true);setError("");
  try{
   const res=await fetch("/api/v2/geo-source-manifest",{
     headers:{"x-demo-operator-key":operatorKey},cache:"no-store"
   });
   const data=await res.json() as {manifest?:Manifest;error?:string};
   if(!res.ok||!data.manifest)throw Error(data.error||"Could not inspect local geographic source");
   setManifest(data.manifest);
  }catch(e){setError(e instanceof Error?e.message:"Geographic source check failed");}
  finally{setBusy(false);}
 }
 const stats=manifest?([
   ["Road lines",manifest.roadLines],
   ["Unique OSM way IDs",manifest.uniqueWayIds],
   ["Duplicate way IDs",manifest.duplicateWayIds],
   ["Coordinate vertices",manifest.coordinateVertices],
   ["Named road lines",manifest.namedWayLines],
   ["Lines with OSM node IDs",manifest.waysWithOsmNodeIds],
   ["Missing node ID sequences",manifest.waysMissingOsmNodeIds],
   ["Tagged one-way",manifest.waysWithOnewayTag],
   ["Tagged access / motor vehicle",manifest.waysWithAccessOrVehicleTag],
   ["Tagged bridge / tunnel",manifest.waysWithBridgeOrTunnelTag]
 ] as const):[];
 return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="Local geography source fingerprint">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div>
    <p className="text-xs font-bold uppercase text-teal-700">Reproducibility · geographic demo</p>
    <h2 className="mt-1 text-xl font-bold">Local GeoJSON source fingerprint</h2>
   </div>
   <button type="button" disabled={busy} onClick={()=>void inspect()}
    className="rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50">
    {busy?"Checking…":"Inspect local source"}</button>
  </div>
  <p className="mt-2 text-sm text-slate-600">A read-only SHA-256 fingerprint helps compare exact local demo file copies; it is not source verification or a road safety certification.</p>
  {error?<p role="alert" className="mt-3 text-xs text-rose-800">{error}</p>:null}
  {manifest?<div className="mt-4 space-y-3">
   <p className="text-xs text-slate-700">Source size: {manifest.sourceBytes.toLocaleString()} bytes</p>
   <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-xs font-semibold">SHA-256 of current local GeoJSON bytes</p>
    <code className="mt-1 block break-all text-xs">{manifest.sha256}</code>
   </div>
   <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
    {stats.map(([label,value])=><div key={label} className="rounded-lg bg-slate-50 p-3">
     <p className="text-xs text-slate-600">{label}</p>
     <p className="mt-1 text-xl font-bold">{value}</p>
    </div>)}
   </div>
   <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-950">{manifest.disclaimer}</p>
  </div>:null}
 </section>;
}
