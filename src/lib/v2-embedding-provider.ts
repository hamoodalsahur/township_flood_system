/** Server-only embedding provider. Ollama default, cloud provider explicitly opt-in. */
export type EmbeddingProvider = "ollama" | "openai";
export function embeddingConfig(env:NodeJS.ProcessEnv=process.env) {
 const provider=env.AI_PROVIDER?.trim()||"ollama";
 if(provider!=="ollama"&&provider!=="openai")throw Error("AI_PROVIDER must be ollama or openai");
 const model=provider==="ollama"?(env.OLLAMA_EMBED_MODEL||"nomic-embed-text"):(env.OPENAI_EMBED_MODEL||"text-embedding-3-small");
 return {provider:provider as EmbeddingProvider,model};
}
function validVectors(value:unknown,count:number):number[][] {
 if(!Array.isArray(value)||value.length!==count)throw Error("Embedding model returned an unexpected result count");
 const parsed=value.map(vector=>{
  if(!Array.isArray(vector)||vector.length===0||vector.length>8192||!vector.every((n:unknown)=>typeof n==="number"&&Number.isFinite(n)))throw Error("Embedding model returned invalid vectors");
  return vector as number[];
 });
 if(parsed.some(vector=>vector.length!==parsed[0].length))throw Error("Inconsistent embedding dimensions");
 return parsed;
}
export async function embedDescriptions(input:string[], env:NodeJS.ProcessEnv=process.env) {
 const cfg=embeddingConfig(env);
 if(input.length<1||input.length>25||input.some(t=>t.length>450))throw Error("Invalid embedding input");
 let response:Response;
 if(cfg.provider==="ollama") {
  // Fixed loopback host by design: prevent accidental SSRF or remote plaintext uploads.
  const base="http://127.0.0.1:11434";
  response=await fetch(base+"/api/embed",{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({model:cfg.model,input,truncate:true}),signal:AbortSignal.timeout(30000)
  });
 } else {
  if(!env.OPENAI_API_KEY)throw Error("OPENAI_API_KEY is required when AI_PROVIDER=openai");
  response=await fetch("https://api.openai.com/v1/embeddings",{
   method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+env.OPENAI_API_KEY},
   body:JSON.stringify({model:cfg.model,input}),signal:AbortSignal.timeout(15000)
  });
 }
 if(!response.ok)throw Error(cfg.provider==="ollama"?"Local Ollama is unavailable or the embedding model is missing. Check ollama list.":"Cloud embedding request failed. Check the private API credentials.");
 const result:unknown=await response.json();
 if(!result||typeof result!=="object")throw Error("Invalid embedding response");
 if(cfg.provider==="ollama") {
  if(!("embeddings" in result))throw Error("Missing local embeddings");
  return {provider:cfg.provider,model:cfg.model,vectors:validVectors(result.embeddings,input.length)};
 }
 if(!("data" in result)||!Array.isArray(result.data))throw Error("Missing cloud embeddings");
 const ordered=[...(result.data as {index:number;embedding:unknown}[])].sort((a,b)=>a.index-b.index);
 if(ordered.some((r,i)=>r.index!==i))throw Error("Unexpected cloud embedding order");
 return {provider:cfg.provider,model:cfg.model,vectors:validVectors(ordered.map(x=>x.embedding),input.length)};
}
