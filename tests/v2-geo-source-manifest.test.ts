import {test} from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {summarizeLocalGeoSource} from "../src/lib/v2-geo-source-manifest";
import type {RoadCollection,RoadFeature} from "../src/lib/bbr-roads";

const road=(id:string,name:string,more:Partial<RoadFeature["properties"]>={}):RoadFeature=>({
 type:"Feature",geometry:{type:"LineString",coordinates:[[101.4,3.1],[101.401,3.1]]},
 properties:{id,name,highway:"residential",verification:"osm_unverified",
 sourceUrl:"https://www.openstreetmap.org/way/1",...more}
});
const digest=createHash("sha256").update(Buffer.from("fixture","utf8")).digest("hex");
test("manifest reports source coverage and duplicates but never claims verification",()=>{
 const input:RoadCollection={type:"FeatureCollection",features:[
  road("osm-way-1","Street",{oneway:"yes",osmNodeIds:[1,2]}),
  road("osm-way-1","",{access:"private",bridge:"yes"}),
  road("osm-way-3","Road",{motor_vehicle:"destination"})
 ]};
 const m=summarizeLocalGeoSource(input,digest,7);
 assert.equal(m.roadLines,3);assert.equal(m.uniqueWayIds,2);assert.equal(m.duplicateWayIds,1);
 assert.equal(m.coordinateVertices,6);assert.equal(m.namedWayLines,2);
 assert.equal(m.waysWithOsmNodeIds,1);assert.equal(m.waysMissingOsmNodeIds,2);
 assert.equal(m.waysWithOnewayTag,1);assert.equal(m.waysWithAccessOrVehicleTag,2);
 assert.equal(m.waysWithBridgeOrTunnelTag,1);
 assert.equal(m.sha256,digest);
 assert.match(m.disclaimer,/does not prove OSM origin/);
});
test("empty valid source and invalid digest are handled predictably",()=>{
 const empty:RoadCollection={type:"FeatureCollection",features:[]};
 const m=summarizeLocalGeoSource(empty,digest,0);
 assert.equal(m.roadLines,0);assert.equal(m.duplicateWayIds,0);
 assert.throws(()=>summarizeLocalGeoSource(empty,"bad",0),/Invalid/);
 assert.throws(()=>summarizeLocalGeoSource(empty,digest,-1),/Invalid/);
});
