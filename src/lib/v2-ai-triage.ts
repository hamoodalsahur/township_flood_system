import {embedDescriptions} from "./v2-embedding-provider";
import {rankSemanticMatches} from "./v2-semantic-similarity";
export type InputReport={id:string;description:string;category:string;latitude:number;longitude:number;createdAt:Date;reviewState:string};
export async function analyseWithEmbeddings(target:InputReport, comparisons:InputReport[]) {
 const eligible=comparisons.filter(other=>{
  if(other.id===target.id||other.reviewState==="rejected")return false;
  if(Math.abs(other.createdAt.getTime()-target.createdAt.getTime())>48*60*60*1000)return false;
  const x=(other.longitude-target.longitude)*111_000*Math.cos(target.latitude*Math.PI/180);
  const y=(other.latitude-target.latitude)*111_000;
  return Math.hypot(x,y)<=500;
 }).slice(0,24);
 if(eligible.length===0)return {provider:"none",model:"not_called",matches:[],analysed:0,disclaimer:"No nearby fictional reports to compare. No model request was made."};
 const records=[target,...eligible];
 const input=records.map(r=>r.category.replaceAll("_"," ")+". "+r.description.slice(0,400));
 const {provider,model,vectors}=await embedDescriptions(input);
 const matches=rankSemanticMatches(records.map(r=>r.id),vectors);
 return {provider,model,analysed:eligible.length,
  matches:matches.map(m=>({id:m.id,similarity:Number(m.similarity.toFixed(3)),category:eligible.find(r=>r.id===m.id)?.category||"unknown"})),
  disclaimer:"Model similarity is a suggestion, not an incident confirmation or safety probability. Human verification is required."};
}
