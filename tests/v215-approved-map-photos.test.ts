import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
test("map popup only requests the existing approved image endpoint for approved report IDs",()=>{
 const map=readFileSync("src/components/maps/GeographicReferenceMap.tsx","utf8");
 const workspace=readFileSync("src/components/maps/GeographicReferenceWorkspace.tsx","utf8");
 assert.match(map,/<Popup maxWidth=/);
 assert.match(map,/approvedPhotoIds\.includes\(hazard\.id\)/);
 assert.match(map,/\/evidence\/approved/);
 assert.doesNotMatch(map,/\/evidence\/private/);
 assert.match(workspace,/approvedPhotoIds=\{photoApprovedIds\}/);
 assert.match(workspace,/hasApprovedPhoto/);
});
