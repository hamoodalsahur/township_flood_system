import { validRoadCollection } from "./bbr-roads";
import { auditRoads } from "./bbr-road-audit";
import { auditSharedVertices } from "./bbr-vertex-audit";
import { reviewRoadGeometry } from "./bbr-geometry-review";
import { reviewSmallGroups } from "./bbr-small-groups";
import { summarizeRoadTagValues } from "./bbr-tag-values";
import { reviewJunctionCandidates } from "./bbr-junction-candidates";
import { inspectOsmNodeTopology } from "./bbr-osm-topology";

/** One read-only, source-oriented overview of a local OSM research snapshot. */
export function inspectRoadResearchSnapshot(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const baseline = auditRoads(input);
  const vertices = auditSharedVertices(input);
  const geometry = reviewRoadGeometry(input);
  const groups = reviewSmallGroups(input);
  const tagValues = summarizeRoadTagValues(input);
  const junctions = reviewJunctionCandidates(input);
  const nodes = inspectOsmNodeTopology(input);
  const reasonCounts: Record<string, number> = {};
  for (const finding of junctions.findings) {
    for (const reason of finding.reasons) reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1;
  }
  return {
    source: "Locally imported OpenStreetMap study window; geographic reference only",
    roadLines: baseline.total,
    roadCategories: baseline.categories,
    qualityChecks: {
      duplicateOsmIds: baseline.duplicateIds.length,
      zeroLengthLines: baseline.zeroLength.length,
      repeatedVertexLines: geometry.flaggedLines,
      repeatedVertexExamples: geometry.findings.slice(0, 12),
    },
    coordinateResearch: {
      sharedCoordinateLocations: vertices.sharedVertexLocations,
      candidateGroups: groups.candidateGroupCount,
      largestGroupRoadLines: groups.largestGroupSize,
      smallerGroupSizes: groups.smallerGroups.map(group => group.roadLineCount),
    },
    retainedTagValues: tagValues.tags,
    junctionReview: {
      sharedCoordinateLocations: junctions.sharedVertexLocations,
      flaggedLocations: junctions.locationsFlaggedForReview,
      reasonCounts,
      exampleFindings: junctions.findings.slice(0, 12),
      findingsTruncated: junctions.resultsTruncated,
    },
    nodeSourceResearch: {
      ...nodes,
      reviewExamples: nodes.reviewExamples.slice(0, 30),
      coordinateCollisionExamples: nodes.coordinateCollisionExamples.slice(0, 15),
      note: "Combined report only stores selected samples; see geo:node-topology for a larger standalone research report.",
    },
    disclaimer: "Unverified OSM data; no road safety, travel, legal access, routing or flood conditions have been established. This does not alter the fictional scenario graph.",
  };
}
