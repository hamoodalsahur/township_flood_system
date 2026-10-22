"use client";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import IncidentManager from "@/components/management/IncidentManager";
import V2HazardManager from "@/components/management/V2HazardManager";
import ReportWorkspace from "@/components/reports/ReportWorkspace";

export default function IncidentsPage(){
 const operatorKey=useManagementOperatorKey();
 return <>
  <ManagementSectionHeading section="incidents"/>
  <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-950">
   Human review is required before a fictional incident is grouped, rejected or marked resolved. Optional AI candidates cannot perform actions automatically.
  </div>
  <section id="incident-groups" aria-label="Incident grouping" className="scroll-mt-32"><IncidentManager operatorKey={operatorKey}/></section>
  <section id="report-review" aria-label="Report and private photo decisions" className="scroll-mt-32"><V2HazardManager operatorKey={operatorKey}/></section>
  <details className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
   <summary className="cursor-pointer font-semibold text-slate-900">Legacy schematic simulation report queue</summary>
   <p className="mt-2 text-sm leading-6 text-slate-600">Separate from the geographic report workflow. Retained for the original fictional road-network demonstration.</p>
   <ReportWorkspace view="management" operatorKey={operatorKey}/>
  </details>
 </>;
}
