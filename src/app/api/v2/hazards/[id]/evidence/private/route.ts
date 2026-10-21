import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canUseDemoOperatorApi } from "@/lib/demo-access";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{id:string}>}) {
  if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local demo operator access required."},{status:403});
  try {
    const {id}=await context.params;
    const evidence=await prisma.hazardEvidence.findUnique({where:{reportId:id},select:{mimeType:true,base64Data:true,bytes:true,report:{select:{sourceMode:true}}}});
    if(!evidence||evidence.report.sourceMode!=="simulation")return NextResponse.json({error:"No demo evidence"},{status:404});
    return new NextResponse(Uint8Array.from(Buffer.from(evidence.base64Data,"base64")),{
      headers:{"Content-Type":evidence.mimeType,"Content-Length":String(evidence.bytes),"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; sandbox"}
    });
  }catch{return NextResponse.json({error:"Could not read private evidence"},{status:500});}
}
