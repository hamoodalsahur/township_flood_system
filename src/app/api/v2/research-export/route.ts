import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {generateDemoResearchCsv} from "@/lib/v2-research-export";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local demo operator access required"},{status:403});
 try{
  const [incidents,reports]=await Promise.all([
   prisma.demoIncident.findMany({where:{sourceMode:"simulation"},select:{id:true,title:true,category:true,status:true,createdAt:true,updatedAt:true,reports:{select:{reportId:true}}},orderBy:{id:"asc"}}),
   prisma.hazardReport.findMany({where:{sourceMode:"simulation"},select:{id:true,category:true,reviewState:true,createdAt:true,incidentLink:{select:{incidentId:true}}},orderBy:{id:"asc"}})
  ]);
  const csv=generateDemoResearchCsv(incidents,reports);
  return new Response(csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":'attachment; filename="fictional-incident-research.csv"',"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }catch{return NextResponse.json({error:"Could not export fictional research metadata"},{status:500,headers:{"Cache-Control":"no-store"}});}
}
