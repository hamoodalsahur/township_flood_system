import {rankSemanticMatches} from "./v2-semantic-similarity";
export type InputReport={id:string;description:string;category:string;latitude:number;longitude:number;createdAt:Date;reviewState:string};
export async function analyseWithEmbeddings(target:InputReport, comparisons:InputReport[]) {
 const key=process.env.OPENAI_API_KEY;
 if(!key)throw new Error("AI analysis is not configured. Add a private OPENAI_API_KEY to your local .env.");
 // Model input only: fictional descriptions and category labels. No photos, coordinates or keys leave this server.
 const eligible=comparisons.filter(other=>{
   if(other.id===target.id||other.reviewState==="rejected")return false;
   if(Math.abs(other.createdAt.getTime()-target.createdAt.getTime())>48*60*60*1000)return false;
   const x=(other.longitude-target.longitude)*111_000*Math.cos(target.latitude*Math.PI/180);
   const y=(other.latitude-target.latitude)*111_000;
   return Math.hypot(x,y)<=500;
 }).slice(0,24);
 const records=[target,...eligible];
 if(records.length===1)return {model:"text-embedding-3-small",matches:[],analysed:0,disclaimer:"Only one nearby fictional report; no AI comparison was needed."};
 const response=await fetch("https://api.openai.com/v1/embeddings",{
   method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
   body:JSON.stringify({model:"text-embedding-3-small",input:records.map(r=>`${r.category.replaceAll("_"," ")}. ${r.description.slice(0,400)}`)}),
   signal:AbortSignal.timeout(12000)
 });
 if(!response.ok)throw new Error("Model request failed. Check the private AI key, account access and connection.");
 const body:unknown=await response.json();
 if(!body||typeof body!=="object"||!("data" in body)||!Array.isArray(body.data))throw new Error("Unexpected model response");
 const data=body.data as {index:number;embedding:number[]}[];
 if(data.length!==records.length)throw new Error("Model returned incomplete embeddings");
 const sorted=[...data].sort((a,b)=>a.index-b.index);
 const vectors=sorted.map((row,i)=>{if(row.index!==i||!Array.isArray(row.embedding))throw Error("Unexpected embedding order");return row.embedding;});
 const ranked=rankSemanticMatches(records.map(r=>r.id),vectors);
 return {model:"text-embedding-3-small",analysed:eligible.length,
   matches:ranked.map(match=>({id:match.id,similarity:Number(match.similarity.toFixed(3)),category:eligible.find(r=>r.id===match.id)?.category??"unknown"})),
   disclaimer:"Semantic similarity is an AI suggestion, not incident verification, road closure or a calibrated safety probability."};
}
