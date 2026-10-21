/** Locally evaluate actual Ollama embeddings using reproducible, invented labels. */
import {EVALUATION_PAIRS,MALAY_LANGUAGE_CASE_IDS,HOLDOUT_CASE_IDS} from "../src/lib/v2-evaluation-fixtures";
import {cosineSimilarity} from "../src/lib/v2-semantic-similarity";
import {embedDescriptions} from "../src/lib/v2-embedding-provider";
import {evaluatePairs,selectStudyThreshold,STUDY_THRESHOLDS} from "../src/lib/v2-ai-evaluation";

async function main(){
 const inputs=EVALUATION_PAIRS.flatMap(c=>[
  c.category.replaceAll("_"," ")+". "+c.first,
  c.category.replaceAll("_"," ")+". "+c.second
 ]);
 const vectors:number[][]=[];
 const started=Date.now();
 // Each request has a 25-input hard limit; use sequential batches to avoid GPU overload.
 for(let i=0;i<inputs.length;i+=20){
  const result=await embedDescriptions(inputs.slice(i,i+20),{...process.env,AI_PROVIDER:"ollama"});
  vectors.push(...result.vectors);
  process.stderr.write("Embedded "+vectors.length+"/"+inputs.length+" fictional descriptions with "+result.model+"\n");
 }
 console.log("Embedding time (ms):",Date.now()-started);
 const scores=EVALUATION_PAIRS.map((c,i)=>({
  id:c.id,sameEvent:c.sameEvent,score:cosineSimilarity(vectors[2*i],vectors[2*i+1])
 }));
 console.log("FICTIONAL STUDY — semantic pair matching, NOT verified township conditions");
 console.log("Samples:",scores.length,"Positive labels:",scores.filter(s=>s.sameEvent).length,
  "Negative labels:",scores.filter(s=>!s.sameEvent).length);
 const results=STUDY_THRESHOLDS.map(t=>evaluatePairs(scores,t));
 console.table(results.map(r=>({threshold:r.threshold,tp:r.tp,fp:r.fp,tn:r.tn,fn:r.fn,
  precision:r.precision.toFixed(3),recall:r.recall.toFixed(3),f1:r.f1.toFixed(3),accuracy:r.accuracy.toFixed(3)})));
 const holdoutIds=new Set<string>(HOLDOUT_CASE_IDS);
 const calibration=scores.filter(s=>!holdoutIds.has(s.id));
 const holdout=scores.filter(s=>holdoutIds.has(s.id));
 const selected=selectStudyThreshold(calibration);
 const heldoutMetrics=evaluatePairs(holdout,selected.threshold);
 console.log("Exploratory development/calibration split:",calibration.length,"pairs; held-out set:",holdout.length,"pairs");
 console.log("Threshold selected without using holdout labels:",selected.threshold);
 console.log("HELD-OUT SYNTHETIC RESULT:",{
   tp:heldoutMetrics.tp,fp:heldoutMetrics.fp,tn:heldoutMetrics.tn,fn:heldoutMetrics.fn,
   precision:Number(heldoutMetrics.precision.toFixed(3)),recall:Number(heldoutMetrics.recall.toFixed(3)),
   f1:Number(heldoutMetrics.f1.toFixed(3)),accuracy:Number(heldoutMetrics.accuracy.toFixed(3))
 });
 console.log("Held-out errors:",JSON.stringify({falsePositiveIds:heldoutMetrics.falsePositiveIds,falseNegativeIds:heldoutMetrics.falseNegativeIds}));
 console.log("The live demo still uses its existing 0.78 threshold; the chosen threshold is a research suggestion only.");
 const operating=results.find(r=>r.threshold===0.78);
 if(operating)console.log("Current 0.78 threshold errors:",JSON.stringify({falsePositiveIds:operating.falsePositiveIds,falseNegativeIds:operating.falseNegativeIds}));
 const malayCases=new Set<string>(MALAY_LANGUAGE_CASE_IDS);
 const byGroup=[
  {label:"includes_malay",rows:scores.filter(x=>malayCases.has(x.id))},
  {label:"english_only",rows:scores.filter(x=>!malayCases.has(x.id))}
 ];
 console.log("Language slices at threshold 0.78 (small samples; not population accuracy):");
 console.table(byGroup.map(group=>{
   const r=evaluatePairs(group.rows,0.78);
   return {slice:group.label,pairs:r.total,tp:r.tp,fp:r.fp,tn:r.tn,fn:r.fn,precision:r.precision.toFixed(3),recall:r.recall.toFixed(3),f1:r.f1.toFixed(3)};
 }));
 console.log("Category slices at threshold 0.78:");
 console.table([...new Set(EVALUATION_PAIRS.map(p=>p.category))].map(category=>{
   const ids=new Set(EVALUATION_PAIRS.filter(p=>p.category===category).map(p=>p.id));
   const r=evaluatePairs(scores.filter(s=>ids.has(s.id)),0.78);
   return {category,pairs:r.total,tp:r.tp,fp:r.fp,tn:r.tn,fn:r.fn,f1:r.f1.toFixed(3)};
 }));
 console.log("Do not claim this synthetic benchmark predicts real incidents. More independent data and language evaluation are needed.");
}
main().catch(err=>{console.error("Evaluation failed:",err instanceof Error?err.message:"Unknown error");process.exitCode=1;});
