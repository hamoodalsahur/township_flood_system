import {canAttachReport,validateUnlink} from "@/lib/v2-incident-guardrails";
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

   const report=await tx.hazardReport.findUnique({where:{id:data.reportId},include:{incidentLink:true}});
   if(!report||report.sourceMode!=="simulation")return {status:404,error:"Report not found"};
   const problem=canAttachReport(incident,{...report,linkedIncidentId:report.incidentLink?.incidentId});
   if(problem)return {status:409,error:problem};
   const link=await tx.incidentReportLink.create({data:{incidentId:id,reportId:report.id}});
   await tx.auditEntry.create({data:{action:"v2_demo_incident_report_linked",subjectId:id,actor:"LOCAL_DEMO_OPERATOR",sourceMode:"simulation",
    detail:"Linked report "+report.id+"; operator reason: "+data.note}});
   return {status:201,link};
  });
  if("error" in result)return NextResponse.json({error:result.error},{status:result.status});
  return NextResponse.json({...result,disclaimer:"Human-approved grouping only; never confirmation of geographic road closure."},{status:201});
 }catch(e){return NextResponse.json({error:e instanceof Error&&/Invalid|reason/.test(e.message)?e.message:"Could not link report"},{status:400});}
}

/** Operator correction of a mistaken link, never an AI decision. */
export async function DELETE(request:Request,context:Context){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Development operator access required"},{status:403});
 try{
  const {id}=await context.params;
  const input=validateUnlink(await request.json());
  const outcome=await prisma.$transaction(async tx=>{
   const incident=await tx.demoIncident.findUnique({where:{id}});
   if(!incident||incident.sourceMode!=="simulation")return {status:404,error:"Incident not found"};
   if(incident.status==="resolved")return {status:409,error:"Resolved incidents are read-only"};
   const link=await tx.incidentReportLink.findUnique({where:{reportId:input.reportId}});
   if(!link||link.incidentId!==id)return {status:404,error:"Report not linked to this incident"};
   if(await tx.incidentReportLink.count({where:{incidentId:id}})<=1)return {status:409,error:"Cannot unlink the final report; retain the auditable incident record"};
   await tx.incidentReportLink.delete({where:{id:link.id}});
   await tx.auditEntry.create({data:{action:"v2_demo_incident_report_unlinked",subjectId:id,actor:"LOCAL_DEMO_OPERATOR",sourceMode:"simulation",detail:"Unlinked report "+input.reportId+"; operator reason: "+input.note}});
   return {status:200,unlinked:input.reportId};
  });
  if("error" in outcome)return NextResponse.json({error:outcome.error},{status:outcome.status});
  return NextResponse.json({...outcome,disclaimer:"Demo report unlinked by operator. No road status changed."});
 }catch(e){return NextResponse.json({error:e instanceof Error&&/Invalid|reason/.test(e.message)?e.message:"Could not unlink report"},{status:400});}
}
