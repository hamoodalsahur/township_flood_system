import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
test("approved inline images and private inspection remain explicitly separate",()=>{
 const s=readFileSync("src/components/management/V2HazardManager.tsx","utf8");
 assert.match(s,/selectedPhotoMode==="approved_inline"/);
 assert.match(s,/selectedPhotoMode==="inspect_private"/);
 assert.match(s,/\/evidence\/approved/);
 assert.match(s,/\/evidence\/private/);
 assert.match(s,/View private sample photo/);
 assert.doesNotMatch(s,/View attached private photo \(if any\)/);
 assert.doesNotMatch(s,/This image is not public, verified/);
});
test("private view respects selection and revokes blob URLs",()=>{
 const s=readFileSync("src/components/management/V2HazardManager.tsx","utf8");
 assert.match(s,/activeSelectionRef\.current!==id/);
 assert.match(s,/URL\.revokeObjectURL/);
 assert.match(s,/Photo metadata unavailable or inconsistent/);
});
