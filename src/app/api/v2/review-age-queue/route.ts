import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {deriveReviewAgeQueue} from "@/lib/v2-review-age-queue";

export const dynamic="force-dynamic";

/** Read-only operator queue. Never select descriptions, coordinates or evidence. */
export async function GET(request:Request){
  if(!canUseDemoOperatorApi(request)){
    return NextResponse.json({error:"Local demo operator access required"},{status:403,headers:{"Cache-Control":"private, no-store"}});
  }
  try{
    const [reports,incidents]=await Promise.all([
      prisma.hazardReport.findMany({
        where:{sourceMode:"simulation",reviewState:"unverified"},
        select:{id:true,category:true,reviewState:true,createdAt:true,incidentLink:{select:{incidentId:true}}}
      }),
      prisma.demoIncident.findMany({
        where:{sourceMode:"simulation",status:"under_review"},
        select:{id:true,category:true,status:true,createdAt:true}
      })
    ]);
    const now=new Date();
    return NextResponse.json({summary:deriveReviewAgeQueue(reports,incidents,now),generatedAt:now.toISOString()},
      {headers:{"Cache-Control":"private, no-store"}});
  }catch{
    return NextResponse.json({error:"Fictional review-age queue unavailable"},
      {status:500,headers:{"Cache-Control":"private, no-store"}});
  }
}
