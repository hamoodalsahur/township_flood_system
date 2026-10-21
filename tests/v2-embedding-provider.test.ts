import assert from "node:assert/strict";
import {test} from "node:test";
import {embeddingConfig,embedDescriptions} from "../src/lib/v2-embedding-provider";
test("defaults to local Ollama without cloud credentials",()=>{
 assert.deepEqual(embeddingConfig({} as NodeJS.ProcessEnv),{provider:"ollama",model:"nomic-embed-text"});
});
test("cloud provider is explicitly selected",()=>{
 assert.equal(embeddingConfig({AI_PROVIDER:"openai"} as NodeJS.ProcessEnv).model,"text-embedding-3-small");
 assert.throws(()=>embeddingConfig({AI_PROVIDER:"unknown"} as NodeJS.ProcessEnv));
});
test("rejects invalid input without any network request",async()=>{
 await assert.rejects(embedDescriptions([],{} as NodeJS.ProcessEnv));
 await assert.rejects(embedDescriptions(["a".repeat(500)],{} as NodeJS.ProcessEnv));
});
