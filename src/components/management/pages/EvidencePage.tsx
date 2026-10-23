"use client";
import Link from "next/link";
import {ArrowUpRight,Images} from "lucide-react";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import EvidenceInventory from "@/components/management/EvidenceInventory";
import EvidenceBrowser from "@/components/management/EvidenceBrowser";
import EvidenceConsistency from "@/components/management/EvidenceConsistency";

export default function EvidencePage(){
 const operatorKey=useManagementOperatorKey();
 return <>
  <ManagementSectionHeading section="evidence"/>
  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
   <div className="max-w-2xl">
    <div className="flex items-center gap-2 text-teal-900"><Images size={18} aria-hidden="true"/><h2 className="font-bold">Photo evidence</h2></div>
    <p className="mt-2 text-sm leading-6 text-slate-600">Inspect submitted photos within each report. Only explicitly approved images become visible to residents.</p>
   </div>
   <Link href="/management/incidents#report-review" className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-sm font-bold text-white hover:bg-teal-700">
    Open photo reviews <ArrowUpRight size={16} aria-hidden="true"/>
   </Link>
  </div>
  <EvidenceBrowser operatorKey={operatorKey}/>
  <details className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
    <summary className="cursor-pointer font-semibold text-slate-800">Photo inventory and storage counts <span className="ml-2 text-xs font-normal text-slate-500">Advanced</span></summary>
    <EvidenceInventory operatorKey={operatorKey}/>
  </details>
  <details className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
    <summary className="cursor-pointer font-semibold text-slate-800">Evidence consistency checks <span className="ml-2 text-xs font-normal text-slate-500">Advanced</span></summary>
    <EvidenceConsistency operatorKey={operatorKey}/>
  </details>
 </>;
}
