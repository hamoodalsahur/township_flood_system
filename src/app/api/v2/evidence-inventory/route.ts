import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {deriveEvidenceInventory} from "@/lib/v2-evidence-inventory";

export const dynamic="force-dynamic";

/** Metadata-only inventory; never select photo base64 or identifying report data. */
export async function GET(request:Request){
  if(!canUseDemoOperatorApi(request))return NextResponse.json(
    {error:"Local demo operator access required"},
    {status:403,headers:{"Cache-Control":"private, no-store"}}
  );
  try{
    const evidence=await prisma.hazardEvidence.findMany({
      where:{report:{is:{sourceMode:"simulation"}}},
      select:{status:true,bytes:true,createdAt:true}
    });
    return NextResponse.json({
      metrics:deriveEvidenceInventory(evidence),generatedAt:new Date().toISOString()
    },{headers:{"Cache-Control":"private, no-store"}});
  }catch{
    return NextResponse.json(
      {error:"Fictional evidence inventory unavailable"},
      {status:500,headers:{"Cache-Control":"private, no-store"}}
    );
  }
}
