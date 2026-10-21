import { validRoadCollection, type RoadCollection } from "./bbr-roads";

export const ROAD_METADATA_KEYS = ["oneway", "bridge", "tunnel", "layer", "access", "motor_vehicle", "junction"] as const;

export function auditRoadTags(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const roads = (input as RoadCollection).features;
  const present: Record<string, number> = {};
  for (const field of ROAD_METADATA_KEYS) {
    present[field] = roads.filter(road => typeof road.properties[field] === "string").length;
  }
  return {
    roadLines: roads.length,
    tagCounts: present,
    disclaimer: "Tag counts measure fields retained in this GeoJSON file, not verified real road restrictions. Missing values mean unknown, not unrestricted. No safe travel or routing claims.",
  };
}
