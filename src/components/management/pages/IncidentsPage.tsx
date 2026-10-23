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
  <section id="report-review" aria-label="Report review and submitted photos" className="scroll-mt-28"><V2HazardManager operatorKey={operatorKey}/></section>
  <details className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">
    <summary className="cursor-pointer text-base font-bold text-slate-800">Incident grouping and lifecycle <span className="ml-2 text-xs font-normal text-slate-500">Advanced workflow</span></summary>
    <section id="incident-groups" aria-label="Incident grouping" className="mt-4"><IncidentManager operatorKey={operatorKey}/></section>
  </details>
  <details className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
   <summary className="cursor-pointer font-semibold text-slate-900">Historical simulator reports</summary>
   <p className="mt-2 text-sm leading-6 text-slate-600">Separate from the geographic report workflow. Retained for the original fictional road-network demonstration.</p>
   <ReportWorkspace view="management" operatorKey={operatorKey}/>
  </details>
 </>;
}
