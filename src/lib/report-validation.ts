export const REPORT_CATEGORIES = ["surface_water", "blocked_drain", "road_obstruction"] as const;
export const REVIEW_DECISIONS = ["corroborated", "rejected"] as const;

export function parseSubmission(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Invalid report");
  const data = value as Record<string, unknown>;
  if (typeof data.roadId !== "string" || !/^RD-DEMO-[A-Z-]+$/.test(data.roadId)) throw new Error("Select a valid demo road");
  if (!REPORT_CATEGORIES.includes(data.category as typeof REPORT_CATEGORIES[number])) throw new Error("Select a report category");
  if (typeof data.description !== "string" || data.description.trim().length < 8 || data.description.length > 400) throw new Error("Description must be 8–400 characters");
  return { roadId: data.roadId, category: data.category as string, description: data.description.trim() };
}

export function parseReview(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Invalid review");
  const data = value as Record<string, unknown>;
  if (!REVIEW_DECISIONS.includes(data.decision as typeof REVIEW_DECISIONS[number])) throw new Error("Choose corroborated or rejected");
  if (typeof data.note !== "string" || data.note.trim().length < 8 || data.note.length > 400) throw new Error("Review note must be 8–400 characters");
  return { status: data.decision as string, reviewNote: data.note.trim() };
}
