import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
export const dynamic="force-dynamic";
/** Operator-only full review queue; public endpoint continues to omit rejected reports. */
export async function GET(request:Request) {
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local operator access required"},{status:403});
 try {
  const reports=await prisma.hazardReport.findMany({
    where:{sourceMode:"simulation"},orderBy:{createdAt:"desc"},take:100,
    select:{id:true,category:true,description:true,longitude:true,latitude:true,impact:true,
      reviewState:true,reviewNote:true,reviewedAt:true,createdAt:true,
      evidence:{select:{status:true}}}
  });
  return NextResponse.json({reports:reports.map(({evidence,...record})=>({...record,hasEvidence:Boolean(evidence),evidenceStatus:evidence?.status??null})),
   disclaimer:"Local fictional operator review queue, including rejected reports. No real-world claims."},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Unable to load operator demo review history"},{status:500});}
}
