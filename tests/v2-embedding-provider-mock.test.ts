import assert from "node:assert/strict";
import {test} from "node:test";
import {embedDescriptions} from "../src/lib/v2-embedding-provider";

test("Ollama provider talks only to local loopback and reads API embeddings",async()=>{
 const old=globalThis.fetch;
 let calls=0;
 globalThis.fetch=async(input,init)=>{
  calls++;
  assert.equal(String(input),"http://127.0.0.1:11434/api/embed");
  const sent=JSON.parse(String(init?.body)) as {model:string;input:string[]};
  assert.equal(sent.model,"nomic-embed-text");
  assert.deepEqual(sent.input,["fictional flood","fictional pothole"]);
  assert.equal(init?.method,"POST");
  return new Response(JSON.stringify({embeddings:[[1,0],[0,1]]}),{status:200,headers:{"Content-Type":"application/json"}});
 };
 try {
  const result=await embedDescriptions(["fictional flood","fictional pothole"],{
    AI_PROVIDER:"ollama",OLLAMA_EMBED_MODEL:"nomic-embed-text"
  } as unknown as NodeJS.ProcessEnv);
  assert.equal(result.provider,"ollama");
  assert.deepEqual(result.vectors,[[1,0],[0,1]]);
  assert.equal(calls,1);
 }finally{globalThis.fetch=old;}
});

test("malformed local responses fail without creating similarity suggestions",async()=>{
 const old=globalThis.fetch;
 globalThis.fetch=async()=>new Response(JSON.stringify({embeddings:[[1,0],[0]]}),{status:200});
 try {
  await assert.rejects(embedDescriptions(["a","b"],{AI_PROVIDER:"ollama"} as unknown as NodeJS.ProcessEnv),/Inconsistent embedding dimensions/);
 }finally{globalThis.fetch=old;}
});

test("cloud provider is opt-in and never used without credentials",async()=>{
 const old=globalThis.fetch;
 let calls=0;
 globalThis.fetch=async()=>{calls++;throw Error("unexpected request");};
 try {
  await assert.rejects(embedDescriptions(["example"],{AI_PROVIDER:"openai"} as unknown as NodeJS.ProcessEnv),/OPENAI_API_KEY/);
  assert.equal(calls,0);
 }finally{globalThis.fetch=old;}
});
