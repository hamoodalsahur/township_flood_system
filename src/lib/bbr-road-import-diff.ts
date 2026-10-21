import type { RoadCollection } from "./bbr-roads";

/** Descriptive source snapshot comparison; NOT a road-network accuracy assessment. */
export function compareRoadImports(before: RoadCollection | null, after: RoadCollection) {
  const oldIds = new Set(before?.features.map(way => way.properties.id) ?? []);
  const newIds = new Set(after.features.map(way => way.properties.id));
  const added = [...newIds].filter(id => !oldIds.has(id)).sort();
  const removed = [...oldIds].filter(id => !newIds.has(id)).sort();
  return {
    previousLines: before?.features.length ?? null,
    importedLines: after.features.length,
    linesWithOsmNodes: after.features.filter(way => way.properties.osmNodeIds !== undefined).length,
    addedWayIds: added.length,
    removedWayIds: removed.length,
    addedExamples: added.slice(0, 20),
    removedExamples: removed.slice(0, 20),
    note: "Only OSM way identifiers were compared. Changes may reflect edits to the source map or import timing; counts do not validate road access or safety.",
  };
}
