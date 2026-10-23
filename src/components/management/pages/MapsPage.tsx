"use client";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import GeographicReferenceWorkspace from "@/components/maps/GeographicReferenceWorkspace";
import DemoController from "@/components/scenarios/DemoController";
import MapWorkspace from "@/components/maps/MapWorkspace";
import ConnectivityPanel from "@/components/network/ConnectivityPanel";

export default function MapsPage(){
 const operatorKey=useManagementOperatorKey();
 return <>
  <ManagementSectionHeading section="maps"/>
  <section aria-label="Interactive incident map"><GeographicReferenceWorkspace/></section>
  <details className="mt-6 rounded-2xl border border-slate-200 bg-white p-5" aria-label="Optional flood simulation">
   <summary className="cursor-pointer text-lg font-bold text-slate-900">Flood impact simulation <span className="ml-2 text-xs font-normal text-slate-500">Optional fictional scenario</span></summary>
   <p className="mt-3 text-sm text-slate-600">Explore the separate schematic flood model. It cannot verify real travel conditions.</p>
   <DemoController operatorKey={operatorKey}/>
   <MapWorkspace variant="management"/>
   <ConnectivityPanel/>
  </details>
 </>;
}
