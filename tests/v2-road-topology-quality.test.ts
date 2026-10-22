import {test} from "node:test";
import assert from "node:assert/strict";
import {analyseRoadTopologyQuality} from "../src/lib/v2-road-topology-quality";
import type {RoadCollection,RoadFeature} from "../src/lib/bbr-roads";
const road=(id:string,nodes:number[],coordinates:[number,number][]):RoadFeature=>({type:"Feature",properties:{id,name:"Demo",highway:"residential",sourceUrl:"https://www.openstreetmap.org/way/1",verification:"osm_unverified",osmNodeIds:nodes},geometry:{type:"LineString",coordinates}});
test("shared original node IDs join candidate components",()=>{
 const roads:RoadCollection={type:"FeatureCollection",features:[road("osm-way-1",[1,2],[[101.4,3.1],[101.401,3.1]]),road("osm-way-2",[2,3],[[101.401,3.1],[101.402,3.1]]),road("osm-way-3",[8,9],[[101.45,3.2],[101.46,3.2]])]};
 const result=analyseRoadTopologyQuality(roads);
 assert.equal(result.componentCount,2);assert.equal(result.largestComponentWays,2);assert.equal(result.isolatedWays,1);assert.equal(result.waysMissingNodes,0);
});
test("detects duplicate ways, repeated nodes and zero-length segments",()=>{
 const result=analyseRoadTopologyQuality({type:"FeatureCollection",features:[road("osm-way-1",[1,1],[[101.4,3.1],[101.4,3.1]]),road("osm-way-1",[1,2],[[101.5,3.1],[101.501,3.1]])]});
 assert.equal(result.duplicateWayIds,1);assert.equal(result.repeatedNodePairs,1);assert.equal(result.zeroLengthSegments,1);assert.ok(result.coordinateConflicts>0);
});
test("gracefully notes absent topology",()=>{const r=road("osm-way-1",[1,2],[[101.4,3.1],[101.41,3.1]]);delete r.properties.osmNodeIds;const result=analyseRoadTopologyQuality({type:"FeatureCollection",features:[r]});assert.equal(result.waysMissingNodes,1);assert.equal(result.componentCount,0);});
