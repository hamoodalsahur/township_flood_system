import {cosineSimilarity} from "./v2-semantic-similarity";
import type {EvaluationCase} from "./v2-evaluation-cases";

export const THRESHOLDS=[0.65,0.7,0.75,0.78,0.8,0.85,0.9] as const;
export type BenchmarkMetrics={threshold:number;tp:number;fp:number;fn:number;tn:number;precision:number|null;recall:number|null;f1:number|null;accuracy:number;pairCount:number};
export type ErrorExample={leftId:string;rightId:string;leftDescription:string;rightDescription:string;similarity:number;languages:string;categories:string};
export type LanguageRecall={label:"English–English"|"Malay–Malay"|"English–Malay";positivePairs:number;detectedPairs:number;recall:number|null};

const round=(value:number)=>Math.round(value*1000)/1000;
function validate(cases:readonly EvaluationCase[],vectors:readonly (readonly number[])[]) {
 if(cases.length!==vectors.length||cases.length<2)throw Error("Missing evaluation vectors");
 if(new Set(cases.map(c=>c.id)).size!==cases.length)throw Error("Duplicate evaluation case ID");
 if(new Set(cases.map(c=>c.split)).size!==1)throw Error("Evaluation splits must remain separate");
}
export function evaluateEmbeddings(cases:readonly EvaluationCase[],vectors:readonly (readonly number[])[],threshold:number):BenchmarkMetrics{
 validate(cases,vectors);
 if(!Number.isFinite(threshold)||threshold< -1||threshold>1)throw Error("Invalid similarity threshold");
 let tp=0,fp=0,fn=0,tn=0;
 for(let i=0;i<cases.length;i++)for(let j=i+1;j<cases.length;j++){
  const actual=cases[i].group===cases[j].group;
  const predicted=cosineSimilarity(vectors[i],vectors[j])>=threshold;
  if(actual&&predicted)tp++;else if(actual)fn++;else if(predicted)fp++;else tn++;
 }
 const precision=tp+fp?tp/(tp+fp):null,recall=tp+fn?tp/(tp+fn):null;
 const f1=precision!==null&&recall!==null&&precision+recall?2*precision*recall/(precision+recall):null;
 return {threshold,tp,fp,fn,tn,precision:precision===null?null:round(precision),recall:recall===null?null:round(recall),f1:f1===null?null:round(f1),accuracy:round((tp+tn)/(tp+fp+fn+tn)),pairCount:tp+fp+fn+tn};
}
export function evaluateThresholds(cases:readonly EvaluationCase[],vectors:readonly (readonly number[])[]) {
 return THRESHOLDS.map(t=>evaluateEmbeddings(cases,vectors,t));
}
/** Select only on development rows. Ties prefer precision, fewer false positives, then a stricter threshold. */
export function chooseDevelopmentThreshold(rows:readonly BenchmarkMetrics[]):number {
 if(!rows.length)throw Error("No development threshold candidates");
 const sorted=[...rows].sort((a,b)=>
  (b.f1??-1)-(a.f1??-1)||
  (b.precision??-1)-(a.precision??-1)||
  a.fp-b.fp||
  b.threshold-a.threshold
 );
 return sorted[0].f1===null?0.78:sorted[0].threshold;
}
function languageLabel(a:EvaluationCase,b:EvaluationCase):LanguageRecall["label"] {
 if(a.language!==b.language)return "English–Malay";
 return a.language==="en"?"English–English":"Malay–Malay";
}
export function positivePairLanguageRecall(cases:readonly EvaluationCase[],vectors:readonly (readonly number[])[],threshold:number):LanguageRecall[]{
 validate(cases,vectors);
 const rows:LanguageRecall[]=[
  {label:"English–English",positivePairs:0,detectedPairs:0,recall:null},
  {label:"Malay–Malay",positivePairs:0,detectedPairs:0,recall:null},
  {label:"English–Malay",positivePairs:0,detectedPairs:0,recall:null}
 ];
 for(let i=0;i<cases.length;i++)for(let j=i+1;j<cases.length;j++){
  if(cases[i].group!==cases[j].group)continue;
  const row=rows.find(r=>r.label===languageLabel(cases[i],cases[j]))!;
  row.positivePairs++;
  if(cosineSimilarity(vectors[i],vectors[j])>=threshold)row.detectedPairs++;
 }
 return rows.map(r=>({...r,recall:r.positivePairs?round(r.detectedPairs/r.positivePairs):null}));
}
export function diagnosticErrors(cases:readonly EvaluationCase[],vectors:readonly (readonly number[])[],threshold:number,limit=4){
 validate(cases,vectors);
 const fp:ErrorExample[]=[],fn:ErrorExample[]=[];
 for(let i=0;i<cases.length;i++)for(let j=i+1;j<cases.length;j++){
  const similarity=cosineSimilarity(vectors[i],vectors[j]);
  const actual=cases[i].group===cases[j].group;
  const predicted=similarity>=threshold;
  if(actual===predicted)continue;
  const entry={leftId:cases[i].id,rightId:cases[j].id,leftDescription:cases[i].description,rightDescription:cases[j].description,
    similarity:round(similarity),languages:languageLabel(cases[i],cases[j]),categories:cases[i].category+" / "+cases[j].category};
  if(predicted)fp.push(entry);else fn.push(entry);
 }
 // Surface the most confident false matches and the most strongly missed related pairs.
 return {falsePositives:fp.sort((a,b)=>b.similarity-a.similarity).slice(0,limit),
  falseNegatives:fn.sort((a,b)=>a.similarity-b.similarity).slice(0,limit)};
}
