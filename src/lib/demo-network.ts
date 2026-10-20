/**
 * Phase 1A TEST NETWORK — deliberately schematic, NOT WGS84/GPS geometry.
 * BBR is the research focus, but no road positions or opening statuses here
 * are claims about actual Bandar Bukit Raja infrastructure.
 */
export const DATA_SOURCE_ID = "SRC-DEMO-SCHEMATIC";
export const COORDINATE_SYSTEM = "schematic_xy" as const;
export const DATA_MODE = "simulation" as const;
export const DEFAULT_ROAD_STATUS = "unknown" as const;

export const demoZones = [
  {
    id: "ZONE-DEMO-SOUTH",
    name: "Residential South — demonstration zone",
    description: "Illustrative neighbourhood; not an official BBR boundary.",
    boundary: [[0, 0], [45, 0], [45, 65], [0, 65], [0, 0]],
  },
  {
    id: "ZONE-DEMO-CENTRAL",
    name: "Central Buffer — demonstration zone",
    description: "Illustrative buffer area; not a mapped wetland outline.",
    boundary: [[45, 0], [65, 0], [65, 65], [45, 65], [45, 0]],
  },
  {
    id: "ZONE-DEMO-EAST",
    name: "Eastern Neighbourhood — demonstration zone",
    description: "Illustrative eastern zone; not an official neighbourhood polygon.",
    boundary: [[65, 0], [100, 0], [100, 65], [65, 65], [65, 0]],
  },
  {
    id: "ZONE-DEMO-NORTH",
    name: "Northern Access — demonstration zone",
    description: "Illustrative northern zone; not a surveyed district boundary.",
    boundary: [[0, 65], [100, 65], [100, 100], [0, 100], [0, 65]],
  },
] as const;

export const demoNodes = [
  { id: "N1", label: "West entrance (demo)", x: 10, y: 35, zoneId: "ZONE-DEMO-SOUTH", isGateway: true },
  { id: "N2", label: "South junction (demo)", x: 30, y: 35, zoneId: "ZONE-DEMO-SOUTH", isGateway: false },
  { id: "N3", label: "Central-west junction (demo)", x: 50, y: 40, zoneId: "ZONE-DEMO-CENTRAL", isGateway: false },
  { id: "N4", label: "Central-east junction (demo)", x: 60, y: 40, zoneId: "ZONE-DEMO-CENTRAL", isGateway: false },
  { id: "N5", label: "East junction (demo)", x: 78, y: 42, zoneId: "ZONE-DEMO-EAST", isGateway: false },
  { id: "N6", label: "East entrance (demo)", x: 93, y: 42, zoneId: "ZONE-DEMO-EAST", isGateway: true },
  { id: "N7", label: "North-west junction (demo)", x: 50, y: 80, zoneId: "ZONE-DEMO-NORTH", isGateway: false },
  { id: "N8", label: "North entrance (demo)", x: 80, y: 80, zoneId: "ZONE-DEMO-NORTH", isGateway: true },
] as const;

export const demoRoads = [
  { id: "RD-DEMO-WEST-GATE", label: "West gateway — illustrative", fromNodeId: "N1", toNodeId: "N2", zoneId: "ZONE-DEMO-SOUTH", corridorType: "ingress_egress_gateway" },
  { id: "RD-DEMO-SOUTH", label: "South connector — illustrative", fromNodeId: "N2", toNodeId: "N3", zoneId: "ZONE-DEMO-SOUTH", corridorType: "internal" },
  { id: "RD-DEMO-TRAIL", label: "Buffer walking trail — illustrative", fromNodeId: "N3", toNodeId: "N4", zoneId: "ZONE-DEMO-CENTRAL", corridorType: "park_trail" },
  { id: "RD-DEMO-EAST", label: "Central-to-east road — illustrative", fromNodeId: "N4", toNodeId: "N5", zoneId: "ZONE-DEMO-CENTRAL", corridorType: "internal" },
  { id: "RD-DEMO-EAST-GATE", label: "East gateway — illustrative", fromNodeId: "N5", toNodeId: "N6", zoneId: "ZONE-DEMO-EAST", corridorType: "ingress_egress_gateway" },
  { id: "RD-DEMO-NORTH-LINK", label: "North-west connector — illustrative", fromNodeId: "N3", toNodeId: "N7", zoneId: "ZONE-DEMO-NORTH", corridorType: "internal" },
  { id: "RD-DEMO-NORTH", label: "Northern spine — illustrative", fromNodeId: "N7", toNodeId: "N8", zoneId: "ZONE-DEMO-NORTH", corridorType: "internal" },
  { id: "RD-DEMO-NORTH-GATE", label: "North gateway — illustrative", fromNodeId: "N8", toNodeId: "N6", zoneId: "ZONE-DEMO-NORTH", corridorType: "ingress_egress_gateway" },
  { id: "RD-DEMO-BYPASS", label: "Central bypass — illustrative", fromNodeId: "N2", toNodeId: "N4", zoneId: "ZONE-DEMO-CENTRAL", corridorType: "internal" },
  { id: "RD-DEMO-SPUR", label: "North-east connector — illustrative", fromNodeId: "N4", toNodeId: "N8", zoneId: "ZONE-DEMO-NORTH", corridorType: "internal" },
] as const;

export function demoEdgeLength(fromNodeId: string, toNodeId: string): number {
  const start = demoNodes.find(node => node.id === fromNodeId);
  const end = demoNodes.find(node => node.id === toNodeId);
  if (!start || !end) throw new Error(`Missing graph node: ${fromNodeId} or ${toNodeId}`);
  return Number(Math.hypot(end.x - start.x, end.y - start.y).toFixed(3));
}

export function validateDemoNetwork(): void {
  if (demoZones.length !== 4 || demoNodes.length !== 8 || demoRoads.length !== 10) {
    throw new Error("Demo seed count mismatch: expected 4 zones, 8 nodes and 10 roads.");
  }
  for (const values of [demoZones, demoNodes, demoRoads]) {
    if (new Set(values.map(record => record.id)).size !== values.length) {
      throw new Error("Duplicate IDs exist in demonstration dataset.");
    }
  }
  const zoneIds = new Set(demoZones.map(zone => zone.id));
  const nodeIds = new Set(demoNodes.map(node => node.id));
  for (const zone of demoZones) {
    if (zone.boundary.length < 4 || JSON.stringify(zone.boundary[0]) !== JSON.stringify(zone.boundary.at(-1))) {
      throw new Error(`Unclosed schematic polygon: ${zone.id}`);
    }
    for (const [x, y] of zone.boundary) {
      if (x < 0 || x > 100 || y < 0 || y > 100) throw new Error(`Out-of-range schematic position in ${zone.id}`);
    }
  }
  for (const node of demoNodes) {
    if (!zoneIds.has(node.zoneId)) throw new Error(`Unknown node zone: ${node.id}`);
    if (node.x < 0 || node.x > 100 || node.y < 0 || node.y > 100) throw new Error(`Invalid node coordinate: ${node.id}`);
  }
  const adjacency = new Map<string, Set<string>>(demoNodes.map(node => [node.id, new Set<string>()]));
  for (const road of demoRoads) {
    if (!zoneIds.has(road.zoneId) || !nodeIds.has(road.fromNodeId) || !nodeIds.has(road.toNodeId)) {
      throw new Error(`Road references unknown zone or nodes: ${road.id}`);
    }
    if (road.fromNodeId === road.toNodeId || demoEdgeLength(road.fromNodeId, road.toNodeId) <= 0) {
      throw new Error(`Invalid edge length: ${road.id}`);
    }
    if (road.corridorType !== "park_trail") {
      adjacency.get(road.fromNodeId)!.add(road.toNodeId);
      adjacency.get(road.toNodeId)!.add(road.fromNodeId);
    }
  }
  // Every node must be connected by non-trail links; park trails are not drivable roads.
  const visited = new Set(["N1"]);
  const queue = ["N1"];
  for (let i = 0; i < queue.length; i++) {
    for (const neighbour of adjacency.get(queue[i]) ?? []) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push(neighbour);
      }
    }
  }
  if (visited.size !== demoNodes.length) throw new Error("Demonstration road graph is disconnected.");
}
