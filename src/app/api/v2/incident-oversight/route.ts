import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {deriveOversight} from "@/lib/v2-oversight-metrics";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local demo operator access required"},{status:403});
 try {
  const [reports,incidents]=await Promise.all([
   prisma.hazardReport.findMany({where:{sourceMode:"simulation"},select:{id:true,reviewState:true,createdAt:true,incidentLink:{select:{incidentId:true}}}}),
   prisma.demoIncident.findMany({where:{sourceMode:"simulation"},select:{id:true,status:true,createdAt:true,possibleRoad:true,reports:{select:{reportId:true}}}})
  ]);
  return NextResponse.json({metrics:deriveOversight(reports,incidents),generatedAt:new Date().toISOString(),
   disclaimer:"Demo-only descriptive oversight. Ageing is measured against the local server clock; no dispatch service or verified road impacts."},{headers:{"Cache-Control":"private, no-store"}});
 } catch {return NextResponse.json({error:"Oversight information unavailable"},{status:500});}
}
