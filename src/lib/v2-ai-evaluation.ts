/** Offline synthetic embedding-pair scoring, NOT field-tested incident detection. */
export type ScoredPair={id:string;sameEvent:boolean;score:number};
export const STUDY_THRESHOLDS=[0.65,0.70,0.75,0.78,0.80,0.85,0.90] as const;
export function evaluatePairs(pairs:readonly ScoredPair[],threshold:number) {
 if(!Number.isFinite(threshold)||threshold<-1||threshold>1)throw Error("Invalid similarity threshold");
 let tp=0,fp=0,tn=0,fn=0;
 const falsePositiveIds:string[]=[];const falseNegativeIds:string[]=[];
 for(const p of pairs) {
  if(!Number.isFinite(p.score)||p.score < -1.00001||p.score>1.00001)throw Error("Invalid similarity score");
  const predicted=p.score>=threshold;
  if(predicted&&p.sameEvent)tp++;
  else if(predicted&&!p.sameEvent){fp++;falsePositiveIds.push(p.id);}
  else if(!predicted&&!p.sameEvent)tn++;
  else {fn++;falseNegativeIds.push(p.id);}
 }
 const precision=tp+fp===0?0:tp/(tp+fp);
 const recall=tp+fn===0?0:tp/(tp+fn);
 return {threshold,total:pairs.length,tp,fp,tn,fn,
  precision,recall,f1:precision+recall===0?0:2*precision*recall/(precision+recall),
  accuracy:pairs.length===0?0:(tp+tn)/pairs.length,falsePositiveIds,falseNegativeIds};
}
