import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assessConnectivity } from "@/lib/road-connectivity";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || !("origin" in body) || !("destination" in body) ||
        typeof body.origin !== "string" || typeof body.destination !== "string") {
      return NextResponse.json({ error: "Supply origin and destination node IDs." }, { status: 400 });
    }
    const [nodes, roads] = await Promise.all([
      prisma.graphNode.findMany({ select: { id: true, label: true } }),
      prisma.roadSegment.findMany({ select: { id: true, fromNodeId: true, toNodeId: true, currentStatus: true, corridorType: true } }),
    ]);
    const result = assessConnectivity(nodes, roads.map(r => ({
      id: r.id, fromNodeId: r.fromNodeId, toNodeId: r.toNodeId, status: r.currentStatus, corridorType: r.corridorType,
    })), body.origin, body.destination);
    return NextResponse.json({ mode: "simulation", coordinateSystem: "schematic_xy", ...result });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    if (error instanceof Error && /Unknown origin|different junctions/.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/network/assess failed", error);
    return NextResponse.json({ error: "Network assessment could not be completed." }, { status: 500 });
  }
}
