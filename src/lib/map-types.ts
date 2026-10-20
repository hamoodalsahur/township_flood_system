/** Transport shapes for Phase 1A read-only APIs. All coordinates are schematic XY, not GPS. */
export type Provenance = {
  classification: string;
  verificationStatus: string;
  sourceName: string;
};

export type MapZone = {
  id: string;
  name: string;
  description: string | null;
  boundary: number[][];
  coordinateSystem: string;
  riskLevel: string;
  provenance: Provenance;
};

export type MapNode = {
  id: string;
  label: string;
  zoneId: string;
  x: number;
  y: number;
  isGateway: boolean;
};

export type MapRoad = {
  id: string;
  label: string;
  zoneId: string;
  fromNodeId: string;
  toNodeId: string;
  corridorType: string;
  lengthUnits: number;
  status: string;
  sourceMode: string;
  lastVerifiedAt: string | null;
  provenance: Provenance;
};

export type ZonesResponse = {
  dataMode: string;
  coordinateSystem: string;
  disclaimer: string;
  zones: MapZone[];
};

export type RoadsResponse = {
  dataMode: string;
  coordinateSystem: string;
  disclaimer: string;
  nodes: MapNode[];
  roads: MapRoad[];
};

export const ROAD_STATUS_LABELS: Record<string, string> = {
  no_known_disruption: "No known disruption (not a safety guarantee)",
  at_risk: "At risk",
  reported_flooding_unverified: "Flooding reported — unverified",
  confirmed_closed: "Confirmed closed",
  unknown: "Unknown — no observed road status",
};

export function statusLabel(value: string): string {
  return ROAD_STATUS_LABELS[value] ?? "Unknown — unrecognised status";
}

export function isSchematicMapData(zones: ZonesResponse, roads: RoadsResponse): boolean {
  return (
    zones.dataMode === "simulation" &&
    roads.dataMode === "simulation" &&
    zones.coordinateSystem === "schematic_xy" &&
    roads.coordinateSystem === "schematic_xy" &&
    zones.zones.every(zone => zone.coordinateSystem === "schematic_xy")
  );
}
