import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {deriveEvidenceConsistency} from "@/lib/v2-evidence-consistency";

export const dynamic="force-dynamic";

/** Audit metadata only: do not select base64Data, IDs, names, locations or reviewer text. */
export async function GET(request:Request) {
 if(!canUseDemoOperatorApi(request))return NextResponse.json(
  {error:"Local demo operator access required"},
  {status:403,headers:{"Cache-Control":"private, no-store"}}
 );
 try{
  const rows=await prisma.hazardEvidence.findMany({
    where:{report:{is:{sourceMode:"simulation"}}},
    select:{status:true,mimeType:true,bytes:true,report:{select:{reviewState:true}}}
  });
  return NextResponse.json({metrics:deriveEvidenceConsistency(rows)},
   {headers:{"Cache-Control":"private, no-store"}});
 }catch{
  return NextResponse.json(
    {error:"Unable to inspect fictional evidence metadata"},
    {status:500,headers:{"Cache-Control":"private, no-store"}}
  );
 }
}
