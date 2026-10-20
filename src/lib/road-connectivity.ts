/** Hypothetical graph connectivity, NOT navigation, passability or evacuation routing. */
export type EdgeStatus = "unknown" | "no_known_disruption" | "at_risk" | "reported_flooding_unverified" | "confirmed_closed";
export type Edge = { id: string; fromNodeId: string; toNodeId: string; status: string; corridorType: string };
export type GraphNode = { id: string; label: string };
export type ConnectivityResult = {
  connected: boolean;
  nodeIds: string[];
  edgeIds: string[];
  excludedRoadIds: string[];
  uncertainRoadIds: string[];
  explanation: string;
  disclaimer: string;
};

const DISCLAIMER = "Schematic network connectivity only — NOT a safe route, road passability assessment or travel recommendation. Never enter floodwater.";

export function assessConnectivity(nodes: GraphNode[], edges: Edge[], origin: string, destination: string): ConnectivityResult {
  const known = new Set(nodes.map(node => node.id));
  if (!known.has(origin) || !known.has(destination)) throw new Error("Unknown origin or destination node");
  if (origin === destination) throw new Error("Choose two different junctions");
  const allowed = edges.filter(edge => edge.corridorType !== "park_trail" && edge.status !== "confirmed_closed" && edge.status !== "reported_flooding_unverified" && known.has(edge.fromNodeId) && known.has(edge.toNodeId));
  const excludedRoadIds = edges.filter(edge => edge.corridorType === "park_trail" || edge.status === "confirmed_closed" || edge.status === "reported_flooding_unverified").map(edge => edge.id);
  const neighbours = new Map<string, { nodeId: string; edgeId: string; status: string }[]>(nodes.map(node => [node.id, []]));
  for (const edge of allowed) {
    neighbours.get(edge.fromNodeId)?.push({ nodeId: edge.toNodeId, edgeId: edge.id, status: edge.status });
    neighbours.get(edge.toNodeId)?.push({ nodeId: edge.fromNodeId, edgeId: edge.id, status: edge.status });
  }
  const queue = [origin];
  const previous = new Map<string, { nodeId: string; edgeId: string; status: string }>();
  const visited = new Set([origin]);
  for (let index = 0; index < queue.length; index++) {
    const nodeId = queue[index];
    if (nodeId === destination) break;
    for (const next of neighbours.get(nodeId) ?? []) {
      if (visited.has(next.nodeId)) continue;
      visited.add(next.nodeId);
      previous.set(next.nodeId, { nodeId, edgeId: next.edgeId, status: next.status });
      queue.push(next.nodeId);
    }
  }
  if (!visited.has(destination)) return {
    connected: false, nodeIds: [], edgeIds: [], excludedRoadIds, uncertainRoadIds: [],
    explanation: "No connection remains in this simplified network after excluding marked closures, unverified flooding reports and walking trails.", disclaimer: DISCLAIMER,
  };
  const nodeIds = [destination], edgeIds: string[] = [], uncertainRoadIds: string[] = [];
  let node = destination;
  while (node !== origin) {
    const step = previous.get(node);
    if (!step) throw new Error("Broken graph predecessor chain");
    edgeIds.push(step.edgeId);
    if (step.status === "unknown" || step.status === "at_risk") uncertainRoadIds.push(step.edgeId);
    node = step.nodeId;
    nodeIds.push(node);
  }
  nodeIds.reverse();edgeIds.reverse();uncertainRoadIds.reverse();
  return {
    connected: true, nodeIds, edgeIds, excludedRoadIds, uncertainRoadIds,
    explanation: uncertainRoadIds.length ? "A theoretical connection exists, but one or more links have unknown or at-risk conditions. This does NOT establish travel feasibility." : "A theoretical connection exists in the fictional graph. This does NOT establish road safety or travel feasibility.",
    disclaimer: DISCLAIMER,
  };
}
