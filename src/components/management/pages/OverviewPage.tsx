"use client";
import Link from "next/link";
import {ArrowRight,ClipboardList,MapPinned,ShieldCheck} from "lucide-react";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import IncidentOversight from "@/components/management/IncidentOversight";
import ReviewAgeQueue from "@/components/management/ReviewAgeQueue";
import OperatorAuditSummary from "@/components/management/OperatorAuditSummary";
const shortcuts=[
 {href:"/management/incidents",label:"Review fictional incidents",icon:ClipboardList},
 {href:"/management/maps",label:"Open maps & simulation",icon:MapPinned},
 {href:"/management/evidence",label:"Inspect photo safeguards",icon:ShieldCheck}
];
export default function OverviewPage(){
 const operatorKey=useManagementOperatorKey();
 return <>
  <ManagementSectionHeading section="overview" eyebrow="Management overview · fictional reporting"/>
  <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-900 to-slate-800 p-6 text-white sm:p-8">
   <h2 className="text-xl font-bold sm:text-2xl">Your operator workspace</h2>
   <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">Review fictional incident reports, inspect unverified map context, and keep every decision human-controlled. These are local demonstration records, not live road conditions.</p>
   <div className="mt-5 flex flex-wrap gap-2">{shortcuts.map(({href,label,icon:Icon})=><Link key={href} href={href} className="inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-teal-900 hover:bg-white">
     <Icon size={15} aria-hidden="true"/>{label}<ArrowRight size={14} aria-hidden="true"/>
   </Link>)}</div>
  </div>
  <IncidentOversight operatorKey={operatorKey}/>
  <div className="grid items-start gap-4 xl:grid-cols-2">
   <ReviewAgeQueue operatorKey={operatorKey}/>
   <OperatorAuditSummary operatorKey={operatorKey}/>
  </div>
 </>;
}
