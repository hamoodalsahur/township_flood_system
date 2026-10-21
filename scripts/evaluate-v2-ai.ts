/** Locally evaluate actual Ollama embeddings using reproducible, invented labels. */
import {EVALUATION_PAIRS} from "../src/lib/v2-evaluation-fixtures";
import {cosineSimilarity} from "../src/lib/v2-semantic-similarity";
import {embedDescriptions} from "../src/lib/v2-embedding-provider";
import {evaluatePairs,STUDY_THRESHOLDS} from "../src/lib/v2-ai-evaluation";

async function main(){
 const inputs=EVALUATION_PAIRS.flatMap(c=>[
  c.category.replaceAll("_"," ")+". "+c.first,
  c.category.replaceAll("_"," ")+". "+c.second
 ]);
 const vectors:number[][]=[];
 // Each request has a 25-input hard limit; use sequential batches to avoid GPU overload.
 for(let i=0;i<inputs.length;i+=20){
  const result=await embedDescriptions(inputs.slice(i,i+20),{...process.env,AI_PROVIDER:"ollama"});
  vectors.push(...result.vectors);
  process.stderr.write("Embedded "+vectors.length+"/"+inputs.length+" fictional descriptions with "+result.model+"\n");
 }
 const scores=EVALUATION_PAIRS.map((c,i)=>({
  id:c.id,sameEvent:c.sameEvent,score:cosineSimilarity(vectors[2*i],vectors[2*i+1])
 }));
 console.log("FICTIONAL STUDY — semantic pair matching, NOT verified township conditions");
 console.log("Samples:",scores.length,"Positive labels:",scores.filter(s=>s.sameEvent).length,
  "Negative labels:",scores.filter(s=>!s.sameEvent).length);
 const results=STUDY_THRESHOLDS.map(t=>evaluatePairs(scores,t));
 console.table(results.map(r=>({threshold:r.threshold,tp:r.tp,fp:r.fp,tn:r.tn,fn:r.fn,
  precision:r.precision.toFixed(3),recall:r.recall.toFixed(3),f1:r.f1.toFixed(3),accuracy:r.accuracy.toFixed(3)})));
 const operating=results.find(r=>r.threshold===0.78);
 if(operating)console.log("Current 0.78 threshold errors:",JSON.stringify({falsePositiveIds:operating.falsePositiveIds,falseNegativeIds:operating.falseNegativeIds}));
 console.log("Do not claim this synthetic benchmark predicts real incidents. More independent data and language evaluation are needed.");
}
main().catch(err=>{console.error("Evaluation failed:",err instanceof Error?err.message:"Unknown error");process.exitCode=1;});
