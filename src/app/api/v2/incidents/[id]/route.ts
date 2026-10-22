import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {canTransitionIncident,validateIncidentLink,validateIncidentUpdate,type IncidentStatus} from "@/lib/v2-incident-rules";
export const dynamic="force-dynamic";
type Context={params:Promise<{id:string}>};
export async function PATCH(request:Request,context:Context){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Development operator access required"},{status:403});
 try{
  const {id}=await context.params;const update=validateIncidentUpdate(await request.json());
  const result=await prisma.$transaction(async tx=>{
   const incident=await tx.demoIncident.findUnique({where:{id}});
   if(!incident||incident.sourceMode!=="simulation")return {status:404,error:"Incident not found"};
   if(!canTransitionIncident(incident.status as IncidentStatus,update.status))return {status:409,error:"Invalid lifecycle transition"};
   const saved=await tx.demoIncident.update({where:{id},data:{status:update.status,reviewNote:update.note,possibleRoad:update.possibleRoad}});
   await tx.auditEntry.create({data:{action:"v2_demo_incident_updated",subjectId:id,actor:"LOCAL_DEMO_OPERATOR",sourceMode:"simulation",
    detail:"Status "+incident.status+" -> "+saved.status+"; possible fictional road reference: "+(saved.possibleRoad||"none")+"; reason: "+update.note}});
   return {status:200,incident:saved};
  });
  if("error" in result)return NextResponse.json({error:result.error},{status:result.status});
  return NextResponse.json({...result,disclaimer:"Incident state is fictional management workflow only; no road status was changed."});
 }catch(e){return NextResponse.json({error:e instanceof Error&&/Invalid|reason|Possible/.test(e.message)?e.message:"Could not update incident"},{status:400});}
}
export async function POST(request:Request,context:Context){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Development operator access required"},{status:403});
 try{
  const {id}=await context.params, data=validateIncidentLink(await request.json());
  const result=await prisma.$transaction(async tx=>{
   const incident=await tx.demoIncident.findUnique({where:{id}});
   if(!incident||incident.sourceMode!=="simulation")return {status:404,error:"Incident not found"};
   if(incident.status==="resolved")return {status:409,error:"Resolved incidents cannot receive reports"};
   const report=await tx.hazardReport.findUnique({where:{id:data.reportId},include:{incidentLink:true}});
   if(!report||report.sourceMode!=="simulation")return {status:404,error:"Report not found"};
   if(report.reviewState==="rejected"||report.incidentLink)return {status:409,error:"Rejected or already grouped report"};
   if(report.category!==incident.category)return {status:409,error:"Different hazard categories require separate incident groups"};
   const link=await tx.incidentReportLink.create({data:{incidentId:id,reportId:report.id}});
   await tx.auditEntry.create({data:{action:"v2_demo_incident_report_linked",subjectId:id,actor:"LOCAL_DEMO_OPERATOR",sourceMode:"simulation",
    detail:"Linked report "+report.id+"; operator reason: "+data.note}});
   return {status:201,link};
  });
  if("error" in result)return NextResponse.json({error:result.error},{status:result.status});
  return NextResponse.json({...result,disclaimer:"Human-approved grouping only; never confirmation of geographic road closure."},{status:201});
 }catch(e){return NextResponse.json({error:e instanceof Error&&/Invalid|reason/.test(e.message)?e.message:"Could not link report"},{status:400});}
}
