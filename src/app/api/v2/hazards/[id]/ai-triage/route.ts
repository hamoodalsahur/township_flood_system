import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canUseDemoOperatorApi } from "@/lib/demo-access";
import { analyseWithEmbeddings } from "@/lib/v2-ai-triage";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{id:string}>}) {
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Development operator access required"},{status:403});

 try {
  const {id}=await context.params;
  const reports=await prisma.hazardReport.findMany({where:{sourceMode:"simulation"},orderBy:{createdAt:"desc"},take:100,
   select:{id:true,category:true,description:true,longitude:true,latitude:true,createdAt:true,reviewState:true}});
  const target=reports.find(r=>r.id===id);
  if(!target||target.reviewState!=="unverified")return NextResponse.json({error:"Unverified fictional report not found"},{status:404});
  const result=await analyseWithEmbeddings(target,reports);
  return NextResponse.json(result,{headers:{"Cache-Control":"no-store"}});
 } catch(error) {
  return NextResponse.json({error:error instanceof Error ? error.message : "AI analysis failed"},{status:502});
 }
}
