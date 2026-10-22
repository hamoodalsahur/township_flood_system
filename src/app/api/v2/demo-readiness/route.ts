import {readFile} from "node:fs/promises";
import path from "node:path";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {canUseDemoOperatorApi} from "@/lib/demo-access";
import {validRoadCollection} from "@/lib/bbr-roads";
import {inspectDemoReadiness} from "@/lib/v2-demo-readiness";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 if(!canUseDemoOperatorApi(request))return NextResponse.json({error:"Local development operator access required"},{status:403});
 let databaseAccessible=false,roadFilePresent=false,roadFeatures:number|null=null;
 try{await prisma.hazardReport.count();databaseAccessible=true;}catch{}
 try{
  const roads:unknown=JSON.parse(await readFile(path.join(process.cwd(),"public","data","bbr-roads.geojson"),"utf8"));
  roadFilePresent=validRoadCollection(roads);
  if(roadFilePresent)roadFeatures=roads.features.length;
 }catch{}
 const checks=inspectDemoReadiness({environment:process.env.NODE_ENV,databaseUrl:process.env.DATABASE_URL,operatorKey:process.env.DEMO_OPERATOR_KEY,provider:process.env.AI_PROVIDER,embedModel:process.env.OLLAMA_EMBED_MODEL,roadFilePresent,roadFeatures,databaseAccessible});
 return NextResponse.json({checks,passed:checks.filter(c=>c.passed).length,total:checks.length,
  disclaimer:"Local coursework demonstration checklist only. An all-green result does not establish deployment security, correct OSM topology, model availability or any verified road conditions."},
  {headers:{"Cache-Control":"private, no-store"}});
}
