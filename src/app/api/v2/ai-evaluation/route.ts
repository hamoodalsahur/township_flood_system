import {NextResponse} from "next/server";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {embedDescriptions} from "@/lib/v2-embedding-provider";
import {EVALUATION_CASES} from "@/lib/v2-evaluation-cases";
import {evaluateThresholds} from "@/lib/v2-evaluation-metrics";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local demo operator access required"},{status:403});
 try{
  const {provider,model,vectors}=await embedDescriptions(EVALUATION_CASES.map(x=>x.category.replaceAll("_"," ")+". "+x.description));
  const metrics=evaluateThresholds(EVALUATION_CASES,vectors);
  return NextResponse.json({provider,model,caseCount:EVALUATION_CASES.length,positiveGroups:8,metrics,
   disclaimer:"Illustrative fixed synthetic benchmark. Pairwise examples are not independent, labels are authored, and results do not estimate real-world accuracy. No hazards or road statuses are modified."},{headers:{"Cache-Control":"no-store"}});
 }catch(error){
  return NextResponse.json({error:error instanceof Error?error.message:"Could not run evaluation"},{status:502});
 }
}
