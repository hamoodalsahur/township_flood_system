import {test} from "node:test";
import assert from "node:assert/strict";
import {candidateRoads,segmentDistanceMetres,sourceReviewForRoad} from "../src/lib/v2-road-candidates";
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

test("candidate source notes preserve raw tags without claiming access or safe routing",()=>{
 const candidate=line("osm-way-7",[[101.43,3.08],[101.431,3.08]]);
 candidate.properties.oneway="-1";
 candidate.properties.access="private";
 candidate.properties.bridge="yes";
 candidate.properties.layer="1";
 const result=candidateRoads([101.43,3.08],[candidate]);
 assert.equal(result[0].sourceReview.oneway,"-1");
 assert.equal(result[0].sourceReview.access,"private");
 assert.equal(result[0].sourceReview.bridge,"yes");
 assert.equal(result[0].sourceReview.originalNodeIdsPresent,false);
 assert.match(result[0].sourceReview.reviewNotes.join(" "),/not a confirmed navigable direction/);
 assert.match(result[0].sourceReview.reviewNotes.join(" "),/do not prove a traversable junction/);
});
test("missing access tags and original node IDs explicitly remain unknown",()=>{
 const input=line("osm-way-8",[[101.43,3.08],[101.431,3.08]]);
 const x=sourceReviewForRoad(input);
 assert.equal(x.access,null);assert.equal(x.motorVehicle,null);
 assert.equal(x.originalNodeIdsPresent,false);
 assert.match(x.reviewNotes.join(" "),/access is unknown/);
 input.properties.osmNodeIds=[1,2];
 const y=sourceReviewForRoad(input);
 assert.equal(y.originalNodeIdsPresent,true);
});
