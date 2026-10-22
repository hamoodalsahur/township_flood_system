import {test} from "node:test";
import assert from "node:assert/strict";
import {analyseRoadAccessTags} from "../src/lib/v2-road-access-tags";
import type {RoadCollection,RoadFeature} from "../src/lib/bbr-roads";

const road=(id:number,tags:Partial<RoadFeature["properties"]>={}):RoadFeature=>({
  type:"Feature",geometry:{type:"LineString",coordinates:[[101.4,3.1],[101.401,3.101]]},
  properties:{id:`osm-way-${id}`,name:"Unverified demo line",highway:"residential",
    sourceUrl:`https://www.openstreetmap.org/way/${id}`,verification:"osm_unverified",...tags}
});
const collection=(features:RoadFeature[]):RoadCollection=>({type:"FeatureCollection",features});

test("flags reverse oneway, access caveats and vertical tags without making routing claims",()=>{
 const x=analyseRoadAccessTags(collection([
  road(1,{oneway:"-1",access:"private",motor_vehicle:"destination",bridge:"yes",layer:"1"}),
  road(2,{oneway:"yes",tunnel:"yes",layer:"-1"}),
  road(3,{oneway:"no",access:"yes",motor_vehicle:"yes",bridge:"no",layer:"0"})
 ]));
 assert.equal(x.roadLines,3);
 assert.equal(x.explicitlyOneWay,2);assert.equal(x.reverseOneWay,1);
 assert.equal(x.nonstandardAccess,1);assert.equal(x.nonstandardMotorVehicle,1);
 assert.equal(x.missingAccessAndMotorVehicle,1);
 assert.equal(x.bridgeTagged,1);assert.equal(x.tunnelTagged,1);assert.equal(x.nonzeroLayer,2);
 assert.match(x.disclaimer,/not proof of access/);
});
test("distinguishes missing, unfamiliar and invalid OSM tags",()=>{
 const x=analyseRoadAccessTags(collection([road(4),road(5,{oneway:"reversible",layer:"underground",access:"permissive"})]));
 assert.equal(x.unrecognisedOneway,1);
 assert.equal(x.invalidLayerTag,1);
 assert.equal(x.missingAccessAndMotorVehicle,1);
 assert.equal(x.nonstandardAccess,1);
});
test("empty road collection returns only zero observations",()=>{
 const x=analyseRoadAccessTags(collection([]));
 assert.equal(x.roadLines,0);
 assert.equal(x.explicitlyOneWay,0);
 assert.equal(x.missingAccessAndMotorVehicle,0);
});
