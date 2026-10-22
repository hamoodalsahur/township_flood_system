"use client";
import Link from "next/link";
import {ArrowUpRight,LockKeyhole} from "lucide-react";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import EvidenceInventory from "@/components/management/EvidenceInventory";
import EvidenceConsistency from "@/components/management/EvidenceConsistency";

export default function EvidencePage(){
 const operatorKey=useManagementOperatorKey();
 return <>
  <ManagementSectionHeading section="evidence"/>
  <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
   <div className="max-w-2xl">
    <div className="flex items-center gap-2 text-amber-950"><LockKeyhole size={18} aria-hidden="true"/><h2 className="font-bold">Private by default</h2></div>
    <p className="mt-2 text-sm leading-6 text-amber-950">Sample photos remain private until separately approved by an operator during fictional report review. This page shows aggregate metadata only, not photo bytes, thumbnails, report descriptions or approval controls.</p>
   </div>
   <Link href="/management/incidents#report-review" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-amber-950 ring-1 ring-amber-200 hover:bg-amber-100">
    Review a report's private photo <ArrowUpRight size={16} aria-hidden="true"/>
   </Link>
  </div>
  <EvidenceInventory operatorKey={operatorKey}/>
  <EvidenceConsistency operatorKey={operatorKey}/>
 </>;
}
