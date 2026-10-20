import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COORDINATE_SYSTEM, DATA_MODE } from "@/lib/demo-network";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [roadRecords, nodeRecords] = await Promise.all([
      prisma.roadSegment.findMany({
        orderBy: { id: "asc" },
        include: { source: true },
      }),
      prisma.graphNode.findMany({ orderBy: { id: "asc" } }),
    ]);
    return NextResponse.json({
      dataMode: DATA_MODE,
      coordinateSystem: COORDINATE_SYSTEM,
      disclaimer: "TEST NETWORK — Not real BBR road alignments, road opening status, navigation or safety guidance.",
      nodes: nodeRecords.map(node => ({
        id: node.id,
        label: node.label,
        zoneId: node.zoneId,
        x: node.x,
        y: node.y,
        isGateway: node.isGateway,
      })),
      roads: roadRecords.map(road => ({
        id: road.id,
        label: road.label,
        zoneId: road.zoneId,
        fromNodeId: road.fromNodeId,
        toNodeId: road.toNodeId,
        corridorType: road.corridorType,
        lengthUnits: road.lengthUnits,
        status: road.currentStatus,
        sourceMode: road.sourceMode,
        lastVerifiedAt: road.statusUpdatedAt?.toISOString() ?? null,
        provenance: {
          classification: road.source.classification,
          verificationStatus: road.source.verificationStatus,
          sourceName: road.source.name,
        },
      })),
    });
  } catch (error) {
    console.error("GET /api/roads failed:", error);
    return NextResponse.json(
      { error: "Unable to load local demo road network. Run the database setup and seed commands." },
      { status: 500 }
    );
  }
}
