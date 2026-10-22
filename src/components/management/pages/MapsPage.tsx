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
  <section aria-label="Unverified geographic reference" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
   <h2 className="text-lg font-bold text-slate-900">Geographic reference · OSM unverified</h2>
   <p className="mt-1 text-sm text-slate-600">Locally imported BBR road lines are reference geometry only. Not verified routing, safe access or incident confirmation.</p>
   <GeographicReferenceWorkspace/>
  </section>
  <section aria-label="Fictional schematic simulation" className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
   <h2 className="text-lg font-bold">Separate fictional scenario</h2>
   <p className="mt-1 text-sm text-slate-600">A demonstration flood simulation on a schematic network, not real township road status.</p>
   <DemoController operatorKey={operatorKey}/>
   <MapWorkspace variant="management"/>
   <ConnectivityPanel/>
  </section>
 </>;
}
