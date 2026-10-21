import assert from "node:assert/strict";
import { test } from "node:test";
import { MAX_EVIDENCE_BYTES,validateDemoImage } from "../src/lib/v2-evidence-validation";
const png=Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0]);
test("accepts a size-limited PNG upload",()=>{
 const v=validateDemoImage({mimeType:"image/png",base64Data:png.toString("base64")});
 assert.equal(v.bytes,png.length);
});
test("rejects non-images and forged content type",()=>{
 assert.throws(()=>validateDemoImage({mimeType:"image/jpeg",base64Data:png.toString("base64")}));
 assert.throws(()=>validateDemoImage({mimeType:"image/svg+xml",base64Data:png.toString("base64")}));
 assert.throws(()=>validateDemoImage({mimeType:"image/png",base64Data:"%%%"}));
});
test("limits submitted private image size",()=>{
 const big=Buffer.alloc(MAX_EVIDENCE_BYTES+1);
 big.set(png,0);
 assert.throws(()=>validateDemoImage({mimeType:"image/png",base64Data:big.toString("base64")}));
});
