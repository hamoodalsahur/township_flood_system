import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export const dynamic="force-dynamic";
export async function GET(_request:Request,context:{params:Promise<{id:string}>}) {
  try{
    const {id}=await context.params;
    const evidence=await prisma.hazardEvidence.findUnique({where:{reportId:id},select:{mimeType:true,base64Data:true,bytes:true,status:true,report:{select:{sourceMode:true,reviewState:true}}}});
    if(!evidence||evidence.report.sourceMode!=="simulation"||evidence.report.reviewState!=="corroborated"||evidence.status!=="approved_public_demo")return NextResponse.json({error:"No approved demo photo"},{status:404});
    return new NextResponse(Uint8Array.from(Buffer.from(evidence.base64Data,"base64")),{headers:{"Content-Type":evidence.mimeType,"Content-Length":String(evidence.bytes),"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; sandbox"}});
  }catch{return NextResponse.json({error:"Unable to read demo photo"},{status:500});}
}
