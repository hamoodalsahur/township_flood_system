import type { HazardCategory } from "./demo-hazards";

/** Fixed presentation metadata; never derive HTML from a report submission. */
export const HAZARD_SYMBOLS: Record<HazardCategory, { symbol: string; color: string; label: string }> = {
  flooding: { symbol: "🌊", color: "#0369a1", label: "Flooding" },
  roadworks: { symbol: "🚧", color: "#b45309", label: "Road construction" },
  fallen_tree: { symbol: "🌳", color: "#15803d", label: "Fallen tree" },
  pothole: { symbol: "🕳️", color: "#57534e", label: "Pothole" },
  road_obstruction: { symbol: "⛔", color: "#b91c1c", label: "Blocked road" },
  storm_damage: { symbol: "⛈️", color: "#6d28d9", label: "Storm damage" },
  other: { symbol: "⚠️", color: "#a16207", label: "Other hazard" },
};
