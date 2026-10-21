import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canUseDemoOperatorApi } from "@/lib/demo-access";
import { validateHazardReview } from "@/lib/v2-hazard-validation";

export const dynamic="force-dynamic";
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}) {
  if(!canUseDemoOperatorApi(request)) return NextResponse.json({error:"Local demo operator access required."},{status:403});
  try {
    const {id}=await context.params;
    const decision=validateHazardReview(await request.json());
    const result=await prisma.$transaction(async tx=>{
      const existing=await tx.hazardReport.findUnique({where:{id}});
      if(!existing || existing.sourceMode!=="simulation") return null;
      if(existing.reviewState!=="unverified") return "already-reviewed" as const;
      const row=await tx.hazardReport.update({where:{id},data:{reviewState:decision.decision,reviewNote:decision.note,reviewedAt:new Date()}});
      await tx.auditEntry.create({data:{action:"v2_demo_hazard_review",subjectId:id,actor:"LOCAL_DEMO_OPERATOR",detail:`Decision: ${decision.decision}. ${decision.note}`,sourceMode:"simulation"}});
      return row;
    });
    if(result===null) return NextResponse.json({error:"Report not found."},{status:404});
    if(result==="already-reviewed") return NextResponse.json({error:"Already reviewed."},{status:409});
    return NextResponse.json({report:result,disclaimer:"A fictional report was reviewed; no geographic road was officially closed."});
  } catch(error) {
    if(error instanceof SyntaxError || error instanceof Error&&/Invalid|Choose|Review note/.test(error.message))
      return NextResponse.json({error:error.message},{status:400});
    return NextResponse.json({error:"Could not review demonstration incident."},{status:500});
  }
}
