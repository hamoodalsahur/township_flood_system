import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {inspectDemoQuality} from "@/lib/v2-demo-quality";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local operator access required"},{status:403});
 try{
  const [reports,incidents]=await Promise.all([
   prisma.hazardReport.findMany({where:{sourceMode:"simulation"},select:{id:true,category:true,description:true,longitude:true,latitude:true,reviewState:true,sourceMode:true,incidentLink:{select:{incidentId:true}}}}),
   prisma.demoIncident.findMany({where:{sourceMode:"simulation"},select:{id:true,category:true,status:true,reports:{select:{report:{select:{id:true,category:true,reviewState:true}}}}}})
  ]);
  const issues=inspectDemoQuality(reports,incidents);
  return NextResponse.json({reportCount:reports.length,incidentCount:incidents.length,issueCount:issues.length,issues:issues.slice(0,100),truncated:issues.length>100,
   disclaimer:"Read-only local demo consistency checks; zero detected issues does not validate hazard truth, geographic accuracy or road safety."},{headers:{"Cache-Control":"private, no-store"}});
 }catch{return NextResponse.json({error:"Unable to inspect demo records"},{status:500});}
}
