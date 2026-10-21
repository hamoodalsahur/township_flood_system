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
    case "major": return { color: "#b45309", weight: 5, opacity: 0.85 };
    case "local": return { color: "#0f766e", weight: 2.5, opacity: 0.65 };
    case "service": return { color: "#64748b", weight: 1.5, opacity: 0.45 };
    default: return { color: "#64748b", weight: 1.5, opacity: 0.4 };
  }
}
