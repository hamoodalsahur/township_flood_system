import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {canonicalReportPair,pairEligibleForFeedback,validateAiPairFeedback} from "@/lib/v2-ai-feedback";
export const dynamic="force-dynamic";
type Params={params:Promise<{id:string}>};
export async function GET(request:Request,context:Params) {
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local operator access required"},{status:403});
 try {
  const {id}=await context.params;
  const report=await prisma.hazardReport.findUnique({where:{id},select:{sourceMode:true}});
  if(!report||report.sourceMode!=="simulation")return NextResponse.json({error:"Report not found"},{status:404});
  const decisions=await prisma.aiPairDecision.findMany({
   where:{sourceMode:"simulation",OR:[{leftReportId:id},{rightReportId:id}]},
   orderBy:{updatedAt:"desc"},take:50,
   select:{leftReportId:true,rightReportId:true,judgement:true,note:true,updatedAt:true}
  });
  return NextResponse.json({decisions:decisions.map(d=>({candidateId:d.leftReportId===id?d.rightReportId:d.leftReportId,judgement:d.judgement,note:d.note,updatedAt:d.updatedAt}))},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Could not retrieve local feedback"},{status:500});}
}
export async function POST(request:Request,context:Params) {
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local operator access required"},{status:403});
 try {
  const {id}=await context.params;
  const {candidateId,judgement,note}=validateAiPairFeedback(await request.json());
  const [leftReportId,rightReportId]=canonicalReportPair(id,candidateId);
  const reports=await prisma.hazardReport.findMany({where:{id:{in:[id,candidateId]},sourceMode:"simulation"},
   select:{id:true,reviewState:true,longitude:true,latitude:true,createdAt:true}});
  if(reports.length!==2||!pairEligibleForFeedback(reports[0],reports[1]))
   return NextResponse.json({error:"Two nearby, non-rejected fictional reports are required"},{status:400});
  const result=await prisma.$transaction(async tx=>{
   const decision=await tx.aiPairDecision.upsert({
    where:{leftReportId_rightReportId:{leftReportId,rightReportId}},
    create:{leftReportId,rightReportId,judgement,note,sourceMode:"simulation"},
    update:{judgement,note}
   });
   await tx.auditEntry.create({data:{action:"v2_ai_pair_feedback",subjectId:leftReportId,actor:"LOCAL_DEMO_OPERATOR",
    detail:JSON.stringify({leftReportId,rightReportId,judgement,note}),sourceMode:"simulation"}});
   return decision;
  });
  return NextResponse.json({saved:true,judgement:result.judgement,disclaimer:"Human label for fictional research only; report and road states did not change."},{headers:{"Cache-Control":"no-store"}});
 } catch(error) {
  if(error instanceof SyntaxError||error instanceof Error&&/Invalid|Choose|Review note/.test(error.message))
   return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({error:"Could not save operator comparison feedback"},{status:500});
 }
}
