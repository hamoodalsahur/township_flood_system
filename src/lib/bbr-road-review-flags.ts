import type { RoadFeature } from "./bbr-roads";

export type RoadReviewFlag = { code: "access" | "direction" | "level"; label: string };

export function roadReviewFlags(road: RoadFeature): RoadReviewFlag[] {
  const tags = road.properties;
  const flags: RoadReviewFlag[] = [];
  if (tags.access === "private" || tags.access === "no")
    flags.push({ code: "access", label: "Review recorded access restriction" });
  if (tags.oneway === "yes" || tags.oneway === "-1")
    flags.push({ code: "direction", label: "Review recorded one-way direction" });
  if (tags.bridge === "yes" || tags.tunnel === "yes" || (tags.layer !== undefined && tags.layer !== "0"))
    flags.push({ code: "level", label: "Review bridge, tunnel or road level" });
  return flags;
}
