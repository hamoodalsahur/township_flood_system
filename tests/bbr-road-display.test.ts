import assert from "node:assert/strict";
import { test } from "node:test";
import { roadCategory, filterRoads, roadStyle } from "../src/lib/bbr-road-display";
import type { RoadFeature } from "../src/lib/bbr-roads";

function road(highway: string): RoadFeature {
  return { type: "Feature", geometry: { type: "LineString", coordinates: [[101.43, 3.08], [101.44, 3.09]] }, properties: { id: "osm-way-123", name: "Test", highway, sourceUrl: "https://www.openstreetmap.org/way/123", verification: "osm_unverified" } };
}
test("classifies major, local, service and other OSM ways", () => {
  assert.equal(roadCategory("primary"), "major");
  assert.equal(roadCategory("residential"), "local");
  assert.equal(roadCategory("service"), "service");
  assert.equal(roadCategory("road"), "other");
});
test("filters road features without editing the source list", () => {
  const source = [road("primary"), road("residential"), road("service")];
  assert.equal(filterRoads(source, "all").length, 3);
  assert.equal(filterRoads(source, "major").length, 1);
  assert.equal(source.length, 3);
});
test("major roads display more prominently than service roads", () => {
  assert.ok(roadStyle("primary").weight > roadStyle("service").weight);
});

test("all unverified OSM categories use distinguishable blue hues, not road safety colours",()=>{
 const m=roadStyle("primary"),l=roadStyle("residential"),s=roadStyle("service"),o=roadStyle("road");
 assert.deepEqual([m.color,l.color,s.color,o.color],["#2563eb","#60a5fa","#93c5fd","#bfdbfe"]);
 assert.ok(m.weight>l.weight&&l.weight>s.weight);
});

test("blue major lines are lighter and slimmer at default viewing scale while minor lines are untouched",()=>{
 const major=roadStyle("primary");
 assert.equal(major.color,"#2563eb");
 assert.equal(major.weight,3.8);
 assert.equal(major.opacity,0.58);
 assert.deepEqual(roadStyle("residential"),{color:"#60a5fa",weight:3.5,opacity:0.85});
 assert.deepEqual(roadStyle("service"),{color:"#93c5fd",weight:2.4,opacity:0.8});
});
