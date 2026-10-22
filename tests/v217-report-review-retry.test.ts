import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
test("report load failures do not masquerade as empty records or retain actionable stale rows",()=>{
 const src=readFileSync("src/components/management/V2HazardManager.tsx","utf8");
 assert.match(src,/setLoadError\(/);
 assert.match(src,/Retry loading/);
 assert.match(src,/role="alert"/);
 assert.match(src,/!loading&&!loadError&&items\.length===0/);
 assert.match(src,/!loadError&&visibleItems\.map/);
 assert.match(src,/setPhotoStates\(null\)/);
});
