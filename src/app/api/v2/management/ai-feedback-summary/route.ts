import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
export const dynamic="force-dynamic";
export async function GET(request:Request) {
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local operator access required"},{status:403});
 try {
  const rows=await prisma.aiPairDecision.findMany({
   where:{sourceMode:"simulation"},orderBy:{updatedAt:"desc"},take:100,
   select:{leftReportId:true,rightReportId:true,judgement:true,note:true,updatedAt:true}
  });
  return NextResponse.json({
   displayed:rows.length,
   sameEvent:rows.filter(r=>r.judgement==="same_event").length,
   differentEvent:rows.filter(r=>r.judgement==="different_event").length,
   recent:rows.slice(0,5),
   disclaimer:"These are human labels for fictional report pairs, NOT AI accuracy statistics or confirmation of a physical incident."
  },{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Unable to load research review summary"},{status:500});}
}
