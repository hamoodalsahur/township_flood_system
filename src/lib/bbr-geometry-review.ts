import { validRoadCollection, type RoadCollection } from "./bbr-roads";

export function reviewRoadGeometry(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const roads = (input as RoadCollection).features;
  const findings = [];
  for (const road of roads) {
    const positions = road.geometry.coordinates.map(([lon, lat]) => lon.toFixed(6) + "," + lat.toFixed(6));
    const repeated = positions.length - new Set(positions).size;
    let consecutive = 0;
    for (let i = 1; i < positions.length; i++) if (positions[i] === positions[i - 1]) consecutive++;
    if (repeated > 0) findings.push({
      id: road.properties.id,
      name: road.properties.name,
      highway: road.properties.highway,
      sourceUrl: road.properties.sourceUrl,
      repeatedCoordinateOccurrences: repeated,
      consecutiveDuplicates: consecutive,
      reviewStatus: "needs_manual_review",
    });
  }
  return {
    roadLinesChecked: roads.length,
    flaggedLines: findings.length,
    findings,
    disclaimer: "Coordinate repetition is a review flag, not proof of invalid geography. Closed loops can legitimately repeat their starting point. No road safety or routing claims.",
  };
}
