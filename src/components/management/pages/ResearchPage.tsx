"use client";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import AiEvaluationWorkbench from "@/components/management/AiEvaluationWorkbench";
import ResearchExport from "@/components/management/ResearchExport";

export default function ResearchPage(){
 const operatorKey=useManagementOperatorKey();
 return <>
  <ManagementSectionHeading section="research"/>
  <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 text-sm text-violet-950">
   <strong>AI supports your review.</strong> Suggestions are optional; operators make every decision.
  </div>
  <ResearchExport operatorKey={operatorKey}/>
  <details className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
    <summary className="cursor-pointer text-base font-semibold text-slate-800">AI model evaluation <span className="ml-2 text-xs font-normal text-slate-500">Optional research tools</span></summary>
    <AiEvaluationWorkbench operatorKey={operatorKey}/>
  </details>
 </>;
}
