import {test} from "node:test";
import assert from "node:assert/strict";
import {candidateRoads,segmentDistanceMetres} from "../src/lib/v2-road-candidates";
import type {RoadFeature} from "../src/lib/bbr-roads";
const line=(id:string,coords:[number,number][]):RoadFeature=>({type:"Feature",geometry:{type:"LineString",coordinates:coords},properties:{id,name:"Demo road",highway:"residential",sourceUrl:"https://www.openstreetmap.org/way/1",verification:"osm_unverified"}});
test("distance uses nearest line segment not only endpoints",()=>{
 assert.ok(segmentDistanceMetres([101.43,3.08],[101.429,3.08],[101.431,3.08])<1);
 assert.ok(segmentDistanceMetres([101.43,3.082],[101.429,3.08],[101.431,3.08])>200);
});
test("nearest unverified map candidates are sorted and bounded",()=>{
 const candidates=candidateRoads([101.43,3.08],[line("osm-way-2",[[101.429,3.08],[101.431,3.08]]),line("osm-way-3",[[101.44,3.08],[101.441,3.08]])]);
 assert.equal(candidates.length,1);assert.equal(candidates[0].id,"osm-way-2");
 assert.equal(candidates[0].verification,"osm_unverified");
 assert.deepEqual(candidateRoads([Infinity,3.08],[]),[]);
});
test("zero-length road vertices do not divide by zero",()=>assert.equal(segmentDistanceMetres([101.43,3.08],[101.43,3.08],[101.43,3.08]),0));
