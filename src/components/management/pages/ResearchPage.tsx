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
  <AiEvaluationWorkbench operatorKey={operatorKey}/>
  <ResearchExport operatorKey={operatorKey}/>
 </>;
}
