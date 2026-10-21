import assert from "node:assert/strict";
import {test} from "node:test";
import {cosineSimilarity,rankSemanticMatches} from "../src/lib/v2-semantic-similarity";
test("matching trained-model vector directions rank higher",()=>{
 assert.ok(cosineSimilarity([1,0],[1,0])>cosineSimilarity([1,0],[0,1]));
 assert.deepEqual(rankSemanticMatches(["a","b","c"],[[1,0],[0.99,0.01],[0,1]]).map(x=>x.id),["b"]);
});
test("bad embeddings cannot create a confidence-like score",()=>{
 assert.throws(()=>cosineSimilarity([0],[0]));
 assert.throws(()=>cosineSimilarity([1,2],[1]));
 assert.throws(()=>rankSemanticMatches(["a","b"],[[1]]));
});
