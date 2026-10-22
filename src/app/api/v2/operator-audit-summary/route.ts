import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {summarizeDemoAudit} from "@/lib/v2-demo-audit-summary";
export const dynamic="force-dynamic";

/** Read-only aggregate; no private audit details, actors or subject IDs selected. */
export async function GET(request:Request){
 if(!canUseDemoOperatorApi(request))return NextResponse.json(
  {error:"Local demo operator access required"},
  {status:403,headers:{"Cache-Control":"private, no-store"}}
 );
 try{
  const rows=await prisma.auditEntry.findMany({
    where:{sourceMode:"simulation"},
    select:{action:true,createdAt:true}
  });
  return NextResponse.json({metrics:summarizeDemoAudit(rows)},
   {headers:{"Cache-Control":"private, no-store"}});
 }catch{
  return NextResponse.json({error:"Fictional operator activity summary unavailable"},
   {status:500,headers:{"Cache-Control":"private, no-store"}});
 }
}
