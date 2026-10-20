import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COORDINATE_SYSTEM, DATA_MODE } from "@/lib/demo-network";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await prisma.townshipZone.findMany({
      orderBy: { id: "asc" },
      include: { source: true },
    });
    return NextResponse.json({
      dataMode: DATA_MODE,
      coordinateSystem: COORDINATE_SYSTEM,
      disclaimer: "SCHEMATIC DEMONSTRATION ONLY — shapes are not actual BBR geographic coordinates or official boundaries.",
      zones: records.map(zone => ({
        id: zone.id,
        name: zone.name,
        description: zone.description,
        boundary: JSON.parse(zone.boundaryJson) as number[][],
        coordinateSystem: zone.coordinateSystem,
        provenance: {
          classification: zone.source.classification,
          verificationStatus: zone.source.verificationStatus,
          sourceName: zone.source.name,
        },
        riskLevel: "unknown",
      })),
    });
  } catch (error) {
    console.error("GET /api/zones failed:", error);
    return NextResponse.json(
      { error: "Unable to load local demo zones. Run the database setup and seed commands." },
      { status: 500 }
    );
  }
}
