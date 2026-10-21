import { HAZARD_CATEGORIES, type HazardCategory } from "./demo-hazards";

export const IMPACT_OPTIONS = ["unknown","caution","partial_obstruction","suspected_closure"] as const;
export type HazardImpact = (typeof IMPACT_OPTIONS)[number];
export type SubmittedHazard = { category: HazardCategory; description: string; coordinates: [number,number]; impact: HazardImpact };
export function validateHazardSubmission(input: unknown): SubmittedHazard {
  if (!input || typeof input !== "object") throw new Error("Invalid hazard report");
  const value = input as Record<string,unknown>;
  if (!HAZARD_CATEGORIES.includes(value.category as HazardCategory)) throw new Error("Choose a valid hazard category");
  if (typeof value.description !== "string" || value.description.trim().length < 8 || value.description.length > 400) throw new Error("Description must be 8–400 characters");
  if (!IMPACT_OPTIONS.includes(value.impact as HazardImpact)) throw new Error("Choose a valid suspected impact");
  if (!Array.isArray(value.coordinates) || value.coordinates.length !== 2 ||
    !value.coordinates.every(v => typeof v === "number" && Number.isFinite(v))) throw new Error("Choose a map location");
  const [lon,lat] = value.coordinates;
  // Research demonstration rectangle, not official township boundary.
  if (lon < 101.40 || lon > 101.47 || lat < 3.06 || lat > 3.11) throw new Error("Select a point inside the demonstration map area");
  return { category: value.category as HazardCategory, description: value.description.trim(), impact: value.impact as HazardImpact, coordinates: [lon,lat] };
}
export function validateHazardReview(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Invalid review");
  const data = input as Record<string,unknown>;
  if (data.decision !== "corroborated" && data.decision !== "rejected") throw new Error("Choose corroborated or rejected");
  if (typeof data.note !== "string" || data.note.trim().length < 8 || data.note.length > 400) throw new Error("Review note must be 8–400 characters");
  return { decision:data.decision as "corroborated"|"rejected", note:data.note.trim() };
}
