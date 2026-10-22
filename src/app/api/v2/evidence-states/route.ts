import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {photoStateFromRecord} from "@/lib/v214-evidence-state";

export const dynamic="force-dynamic";

/** Only metadata for non-rejected fictional reports in the existing local review list.
 * No photo bytes, image URLs, locations, descriptions, notes or credentials.
 */
export async function GET(request:Request){
 const headers={"Cache-Control":"private, no-store"};
 if(!canUseDemoOperatorApi(request))return NextResponse.json(
  {error:"Local demo operator access required"},{status:403,headers}
 );
 try{
  const evidence=await prisma.hazardEvidence.findMany({
   where:{report:{is:{sourceMode:"simulation",reviewState:{not:"rejected"}}}},
   select:{reportId:true,status:true}
  });
  const states=Object.fromEntries(evidence.map(row=>[row.reportId,photoStateFromRecord(row.status)]));
  return NextResponse.json({states},{headers});
 }catch{
  return NextResponse.json({error:"Private demo photo status metadata unavailable"},{status:500,headers});
 }
}
