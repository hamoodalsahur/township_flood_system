import type { RoadFeature } from "./bbr-roads";

export type RoadCategory = "major" | "local" | "service" | "other";
export type RoadFilter = "all" | RoadCategory;

const major = new Set(["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link"]);
const local = new Set(["residential", "living_street", "unclassified"]);
const service = new Set(["service", "track"]);

export function roadCategory(highway: string): RoadCategory {
  if (major.has(highway)) return "major";
  if (local.has(highway)) return "local";
  if (service.has(highway)) return "service";
  return "other";
}

export function filterRoads(roads: RoadFeature[], category: RoadFilter): RoadFeature[] {
  return category === "all" ? roads : roads.filter(road => roadCategory(road.properties.highway) === category);
}

export function roadStyle(highway: string): { color: string; weight: number; opacity: number } {
  switch (roadCategory(highway)) {
    case "major": return { color: "#2563eb", weight: 5.5, opacity: 0.95 };
    case "local": return { color: "#60a5fa", weight: 3.5, opacity: 0.85 };
    case "service": return { color: "#93c5fd", weight: 2.4, opacity: 0.8 };
    default: return { color: "#bfdbfe", weight: 2, opacity: 0.75 };
  }
}
