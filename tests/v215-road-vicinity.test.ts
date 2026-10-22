import assert from "node:assert/strict";
import {test} from "node:test";
import {reviewedDemoVicinityStrokes,candidateVicinityColor} from "../src/lib/v215-road-vicinity";
import type {RoadFeature} from "../src/lib/bbr-roads";
const road=(id="osm-way-1",lat=3.08):RoadFeature=>({
 type:"Feature",geometry:{type:"LineString",coordinates:[[101.43,lat],[101.432,lat]]},
 properties:{id,name:"Example",highway:"residential",sourceUrl:"https://www.openstreetmap.org/way/1",verification:"osm_unverified"}
});
const report=(id:string,impact:"caution"|"partial_obstruction"|"suspected_closure"|"unknown",reviewState="corroborated",lat=3.08)=>({
 id,longitude:101.431,latitude:lat,impact,reviewState
});
test("only human-corroborated fictional impacts produce short candidate vicinity strokes",()=>{
 const x=reviewedDemoVicinityStrokes([road()],[
  report("pending","suspected_closure","unverified"),report("rejected","suspected_closure","rejected"),
  report("unknown","unknown"),report("approved","partial_obstruction")
 ]);
 assert.equal(x.length,1);
 assert.equal(x[0].reportId,"approved");
 assert.equal(x[0].impact,"partial_obstruction");
 assert.equal(x[0].wayId,"osm-way-1");
 assert.ok(x[0].points[0][0]>101.43);
 assert.ok(x[0].points[1][0]<101.432);
});
test("suppresses ambiguous duplicate, intersecting/parallel and distant roads",()=>{
 assert.equal(reviewedDemoVicinityStrokes([road("osm-way-1"),road("osm-way-1")],[report("a","caution")]).length,0);
 assert.equal(reviewedDemoVicinityStrokes([road("osm-way-1"),road("osm-way-2")],[report("b","partial_obstruction")]).length,0);
 assert.equal(reviewedDemoVicinityStrokes([road()],[report("c","caution","corroborated",3.082)]).length,0);
});
test("grade-separated ways are excluded from automatic visual proximity guesses",()=>{
 const raised=road();raised.properties.bridge="yes";
 assert.equal(reviewedDemoVicinityStrokes([raised],[report("b","suspected_closure")]).length,0);
});
test("more severe demo overlays are drawn last but never write road status",()=>{
 const a=reviewedDemoVicinityStrokes([road()],[report("r","suspected_closure"),report("y","caution")]);
 assert.deepEqual(a.map(x=>x.impact),["caution","suspected_closure"]);
 assert.equal(candidateVicinityColor("suspected_closure"),"#dc2626");
 assert.equal("currentStatus" in a[0],false);
});
