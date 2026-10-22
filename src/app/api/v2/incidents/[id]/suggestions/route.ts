import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {analyseWithEmbeddings} from "@/lib/v2-ai-triage";
export const dynamic="force-dynamic";
/** Read-only AI candidate analysis; no grouping or state changes. */
export async function POST(request:Request,context:{params:Promise<{id:string}>}){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Development operator access required"},{status:403});
 try{
  const {id}=await context.params;
  const incident=await prisma.demoIncident.findUnique({where:{id},include:{reports:{orderBy:{linkedAt:"asc"},take:1,include:{report:true}}}});
  if(!incident||incident.sourceMode!=="simulation")return NextResponse.json({error:"Incident not found"},{status:404});
  if(incident.status==="resolved")return NextResponse.json({error:"Resolved incidents cannot receive candidates"},{status:409});
  const anchor=incident.reports[0]?.report;
  if(!anchor)return NextResponse.json({error:"Incident has no reference report"},{status:409});
  const possible=await prisma.hazardReport.findMany({where:{sourceMode:"simulation",category:incident.category,reviewState:{not:"rejected"},incidentLink:{is:null}},
   orderBy:{createdAt:"desc"},take:100,select:{id:true,category:true,description:true,latitude:true,longitude:true,createdAt:true,reviewState:true}});
  const analysis=await analyseWithEmbeddings(anchor,possible);
  const candidates=analysis.matches.map(match=>({
   ...match,description:possible.find(r=>r.id===match.id)?.description||"",reviewState:possible.find(r=>r.id===match.id)?.reviewState||"unverified"
  }));
  return NextResponse.json({provider:analysis.provider,model:analysis.model,analysed:analysis.analysed,candidates,
   disclaimer:"AI suggestion only, not a verified duplicate or road impact. An operator must justify and explicitly link any report."},
   {headers:{"Cache-Control":"no-store"}});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"AI suggestion failed"},{status:502});}
}
