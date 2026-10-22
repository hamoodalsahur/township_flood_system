"use client";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import DemoDataQuality from "@/components/management/DemoDataQuality";
import RoadTopologyQuality from "@/components/management/RoadTopologyQuality";
import GeoSourceManifest from "@/components/management/GeoSourceManifest";
import RoadAccessTags from "@/components/management/RoadAccessTags";
import AuditPanel from "@/components/audit/AuditPanel";

export default function SystemPage(){
 const operatorKey=useManagementOperatorKey();
 return <>
  <ManagementSectionHeading section="system"/>
  <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Advanced local-demo checks are read-only. They do not validate live hazards, geographic access, operator identity or production security.</div>
  <DemoDataQuality operatorKey={operatorKey}/>
  <div className="mt-6 space-y-4">
   <details className="rounded-2xl border border-slate-200 bg-white p-4" aria-label="OSM geographic diagnostics">
    <summary className="cursor-pointer font-semibold text-slate-900">Geographic source and OSM diagnostics</summary>
    <p className="mt-2 text-sm text-slate-600">Unverified topology, source fingerprint and access tags. Expand only when you need to inspect geographic research details.</p>
    <RoadTopologyQuality operatorKey={operatorKey}/>
    <GeoSourceManifest operatorKey={operatorKey}/>
    <RoadAccessTags operatorKey={operatorKey}/>
   </details>
   <details className="rounded-2xl border border-slate-200 bg-white p-4" aria-label="Full demonstration audit history">
    <summary className="cursor-pointer font-semibold text-slate-900">Full fictional audit history</summary>
    <p className="mt-2 text-sm text-slate-600">Existing detailed action history is kept separate from the aggregate activity counts shown on Overview.</p>
    <AuditPanel operatorKey={operatorKey}/>
   </details>
  </div>
 </>;
}
