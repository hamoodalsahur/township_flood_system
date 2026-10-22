import {test} from "node:test";
import assert from "node:assert/strict";
import {summarizeRoadObservations} from "../src/lib/v2-road-observation-summary";
import type {RoadFeature} from "../src/lib/bbr-roads";
const road=(id:string):RoadFeature=>({
  type:"Feature",
  geometry:{type:"LineString",coordinates:[[101.43,3.08],[101.432,3.08]]},
  properties:{id,name:"Fictional context",highway:"residential",sourceUrl:"https://www.openstreetmap.org/way/1",verification:"osm_unverified"}
});
test("counts nearby fictional points without exposing individual coordinates",()=>{
 const summary=summarizeRoadObservations([[101.43,3.08],[101.431,3.0805],[101.45,3.08]], [road("osm-way-1")],"osm-way-1");
 assert.equal(summary.eligibleReportLocations,3);
 assert.equal(summary.nearbyReportLocations,2);
 assert.equal(summary.approximateClosestMetres,0);
 assert.ok((summary.approximateFarthestNearbyMetres??0)>40);
 assert.equal(summary.duplicateOsmWayId,false);
 assert.equal("coordinates" in summary,false);
 assert.match(summary.disclaimer,/no road association/);
});
test("no road match, distant locations and invalid coordinates have safe empty results",()=>{
 const a=summarizeRoadObservations([[101.43,3.08],[Infinity,3.08]],[], "osm-way-9");
 assert.equal(a.eligibleReportLocations,1);
 assert.equal(a.nearbyReportLocations,0);
 assert.equal(a.approximateClosestMetres,null);
 const b=summarizeRoadObservations([[101.45,3.08]],[road("osm-way-9")],"osm-way-9");
 assert.equal(b.nearbyReportLocations,0);
});
test("duplicate source way identifiers are flagged without selecting an ambiguous line",()=>{
 const result=summarizeRoadObservations([[101.43,3.08]],[road("osm-way-1"),road("osm-way-1")],"osm-way-1");
 assert.equal(result.duplicateOsmWayId,true);
 assert.equal(result.nearbyReportLocations,0);
 assert.throws(()=>summarizeRoadObservations([],[], "osm-way-1",-1),RangeError);
});
test("identical locations are not misrepresented as independent corroboration",()=>{
 const result=summarizeRoadObservations([[101.43,3.08],[101.43,3.08]],[road("osm-way-1")],"osm-way-1");
 assert.equal(result.nearbyReportLocations,2);
 assert.match(result.disclaimer,/duplicated/);
});
