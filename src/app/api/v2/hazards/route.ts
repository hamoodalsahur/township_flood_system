import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateHazardSubmission } from "@/lib/v2-hazard-validation";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const records = await prisma.hazardReport.findMany({ orderBy:{createdAt:"desc"}, take:100,
      select:{id:true,category:true,description:true,longitude:true,latitude:true,impact:true,reviewState:true,createdAt:true,sourceMode:true} });
    return NextResponse.json({mode:"simulation", reports:records.filter(x=>x.sourceMode==="simulation"&&x.reviewState!=="rejected"), disclaimer:"FICTIONAL geographic report examples. Not verified road conditions or real travel advice."});
  } catch {
    return NextResponse.json({error:"Demo hazard database unavailable. Run npm run db:push."},{status:500});
  }
}
export async function POST(request:Request) {
  try {
    const body: unknown = await request.json();
    const data=validateHazardSubmission(body);
    const record=await prisma.hazardReport.create({data:{category:data.category,description:data.description,longitude:data.coordinates[0],latitude:data.coordinates[1],impact:data.impact,sourceMode:"simulation",reviewState:"unverified"}});
    return NextResponse.json({report:record,disclaimer:"Fictional report recorded. It does not change any road status."},{status:201});
  } catch(error) {
    if(error instanceof SyntaxError || error instanceof Error&&/Invalid|Choose|Description|Select/.test(error.message))
      return NextResponse.json({error:error.message},{status:400});
    return NextResponse.json({error:"Could not save demo hazard report."},{status:500});
  }
}
