"use client";
import ManagementSectionHeading from "@/components/management/ManagementSectionHeading";
import {useManagementOperatorKey} from "@/components/management/ManagementShell";
import AiEvaluationWorkbench from "@/components/management/AiEvaluationWorkbench";
import ResearchExport from "@/components/management/ResearchExport";

export default function ResearchPage(){
 const operatorKey=useManagementOperatorKey();
 return <>
  <ManagementSectionHeading section="research"/>
  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
   Optional local AI and authored fictional cases support demonstrations, not validated real-world model performance. Similarity suggestions require manual operator judgement.
  </div>
  <AiEvaluationWorkbench operatorKey={operatorKey}/>
  <ResearchExport operatorKey={operatorKey}/>
 </>;
}
