import {NextResponse} from "next/server";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {embedDescriptions} from "@/lib/v2-embedding-provider";
import {evaluationSplit} from "@/lib/v2-evaluation-cases";
import {evaluateEmbeddings,evaluateThresholds,chooseDevelopmentThreshold,positivePairLanguageRecall,diagnosticErrors} from "@/lib/v2-evaluation-metrics";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local demo operator access required"},{status:403});
 try{
  const development=evaluationSplit("development"),holdout=evaluationSplit("holdout");
  // Keep both sets separate during threshold selection. Only authored synthetic test text is embedded.
  const devResult=await embedDescriptions(development.map(c=>c.category.replaceAll("_"," ")+". "+c.description));
  const holdResult=await embedDescriptions(holdout.map(c=>c.category.replaceAll("_"," ")+". "+c.description));
  if(devResult.provider!==holdResult.provider||devResult.model!==holdResult.model)throw Error("Evaluation provider changed between splits");
  const devMetrics=evaluateThresholds(development,devResult.vectors);
  const selectedThreshold=chooseDevelopmentThreshold(devMetrics);
  const heldout=evaluateEmbeddings(holdout,holdResult.vectors,selectedThreshold);
  const baseline=evaluateEmbeddings(holdout,holdResult.vectors,0.78);
  return NextResponse.json({
   datasetVersion:"synthetic-bilingual-v1",testedAt:new Date().toISOString(),provider:devResult.provider,model:devResult.model,
   selection:"Highest development F1, then precision, fewer false matches, stricter threshold. Holdout not used to select threshold.",
   development:{caseCount:development.length,groupCount:12,metrics:devMetrics},
   selectedThreshold,
   holdout:{caseCount:holdout.length,groupCount:12,selected:heldout,baseline,
    languageRecall:positivePairLanguageRecall(holdout,holdResult.vectors,selectedThreshold),
    errors:diagnosticErrors(holdout,holdResult.vectors,selectedThreshold,4)},
   disclaimer:"Small authored fictional corpus only. Correlated pairwise samples, limited locations and synthetic labels; these scores do not estimate real-world safety reliability. This experiment never changes reports, photos, road status or the live matching threshold."
  },{headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }catch(error){
  const message=error instanceof Error?error.message:"Could not run evaluation";
  return NextResponse.json({error:message},{status:502,headers:{"Cache-Control":"no-store"}});
 }
}
