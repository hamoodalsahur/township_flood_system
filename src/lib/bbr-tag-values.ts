import { validRoadCollection, type RoadCollection } from "./bbr-roads";
import { ROAD_METADATA_KEYS } from "./bbr-tag-audit";

/** Frequency table of retained OSM attributes; no travel or road-access inference. */
export function summarizeRoadTagValues(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const roads = (input as RoadCollection).features;
  const tags: Record<string, { present: number; missing: number; values: Record<string, number> }> = {};
  for (const key of ROAD_METADATA_KEYS) {
    const values: Record<string, number> = {};
    let present = 0;
    for (const road of roads) {
      const value = road.properties[key];
      if (typeof value !== "string") continue;
      present++;
      values[value] = (values[value] ?? 0) + 1;
    }
    tags[key] = { present, missing: roads.length - present, values };
  }
  return {
    roadLines: roads.length,
    tags,
    disclaimer: "This counts OSM tag values, not validated traffic rules. Missing does not mean no restriction. Road intersections, legal access and flood conditions are not verified.",
  };
}
