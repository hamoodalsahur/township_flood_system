import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateDemoImage } from "@/lib/v2-evidence-validation";
export const dynamic="force-dynamic";
export async function POST(request:Request, context:{params:Promise<{id:string}>}) {
  try {
    const {id}=await context.params;
    const body:unknown=await request.json();
    const image=validateDemoImage(body);
    const report=await prisma.hazardReport.findUnique({where:{id},select:{id:true,sourceMode:true,reviewState:true}});
    if(!report||report.sourceMode!=="simulation") return NextResponse.json({error:"Demo report not found"},{status:404});
    if(report.reviewState!=="unverified") return NextResponse.json({error:"Reviewed reports cannot accept new evidence"},{status:409});
    try{
      await prisma.hazardEvidence.create({data:{reportId:id,...image,status:"private_unreviewed"}});
    } catch(error) {
      // Do not reveal database details; a report accepts one private evidence image.
      return NextResponse.json({error:"Evidence already attached or could not be saved"},{status:409});
    }
    return NextResponse.json({saved:true,disclaimer:"Private demonstration evidence. It is not publicly displayed or proof of a road condition."},{status:201});
  } catch(error) {
    if(error instanceof SyntaxError || error instanceof Error && /Invalid|Choose|Photo|Image/.test(error.message))
      return NextResponse.json({error:error.message},{status:400});
    return NextResponse.json({error:"Could not attach demo evidence"},{status:500});
  }
}
