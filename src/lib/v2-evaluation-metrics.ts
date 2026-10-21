import {cosineSimilarity} from "./v2-semantic-similarity";
import type {EvaluationCase} from "./v2-evaluation-cases";
export type BenchmarkMetrics={threshold:number;tp:number;fp:number;fn:number;tn:number;precision:number|null;recall:number|null;f1:number|null;accuracy:number;pairCount:number};
function rounded(value:number){return Math.round(value*1000)/1000;}
export function evaluateEmbeddings(cases:readonly EvaluationCase[],vectors:readonly (readonly number[])[],threshold:number):BenchmarkMetrics{
 if(cases.length!==vectors.length||cases.length<2)throw Error("Missing evaluation vectors");
 if(!Number.isFinite(threshold)||threshold< -1||threshold>1)throw Error("Invalid similarity threshold");
 let tp=0,fp=0,fn=0,tn=0;
 for(let i=0;i<cases.length;i++)for(let j=i+1;j<cases.length;j++){
  const actual=cases[i].group===cases[j].group;
  const predicted=cosineSimilarity(vectors[i],vectors[j])>=threshold;
  if(actual&&predicted)tp++;else if(actual)fn++;else if(predicted)fp++;else tn++;
 }
 const precision=tp+fp?tp/(tp+fp):null,recall=tp+fn?tp/(tp+fn):null;
 const f1=precision!==null&&recall!==null&&precision+recall?2*precision*recall/(precision+recall):null;
 return {threshold,tp,fp,fn,tn,precision:precision===null?null:rounded(precision),recall:recall===null?null:rounded(recall),f1:f1===null?null:rounded(f1),accuracy:rounded((tp+tn)/(tp+fp+fn+tn)),pairCount:tp+fp+fn+tn};
}
export function evaluateThresholds(cases:readonly EvaluationCase[],vectors:readonly (readonly number[])[]) {
 return [0.65,0.7,0.75,0.78,0.8,0.85,0.9].map(t=>evaluateEmbeddings(cases,vectors,t));
}
