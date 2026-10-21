/** Model embedding similarity maths; no report can be verified through this module. */
export function cosineSimilarity(a: readonly number[], b: readonly number[]): number {
  if (a.length === 0 || a.length !== b.length) throw new Error("Embedding dimensions differ");
  let dot=0,aa=0,bb=0;
  for(let i=0;i<a.length;i++) {
    if(!Number.isFinite(a[i])||!Number.isFinite(b[i]))throw new Error("Invalid model embedding");
    dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];
  }
  if(aa===0||bb===0)throw new Error("Empty vector");
  return dot/Math.sqrt(aa*bb);
}
export type SemanticCandidate = {id:string;similarity:number};
export function rankSemanticMatches(ids:readonly string[], vectors:readonly (readonly number[])[], threshold=0.78):SemanticCandidate[] {
  if(ids.length!==vectors.length || ids.length<1)throw Error("Missing embeddings");
  const [target,...others]=vectors;
  return others.map((v,i)=>({id:ids[i+1],similarity:cosineSimilarity(target,v)}))
    .filter(row=>row.similarity>=threshold).sort((a,b)=>b.similarity-a.similarity).slice(0,5);
}
