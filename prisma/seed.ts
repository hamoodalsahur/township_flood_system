import { PrismaClient } from "@prisma/client";
import {
  COORDINATE_SYSTEM,
  DATA_MODE,
  DATA_SOURCE_ID,
  DEFAULT_ROAD_STATUS,
  demoEdgeLength,
  demoNodes,
  demoRoads,
  demoZones,
  validateDemoNetwork,
} from "../src/lib/demo-network";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  validateDemoNetwork();
  await prisma.dataSource.upsert({
    where: { id: DATA_SOURCE_ID },
    update: {},
    create: {
      id: DATA_SOURCE_ID,
      name: "Synthetic connected township graph (demonstration only)",
      classification: "illustrative",
      verificationStatus: "not_real_geography",
      notes: "All geometry is schematic_xy, NOT latitude/longitude. Names do not assert real BBR road positions or safe travel.",
    },
  });

  for (const zone of demoZones) {
    await prisma.townshipZone.upsert({
      where: { id: zone.id },
      update: {},
      create: {
        id: zone.id,
        name: zone.name,
        description: zone.description,
        coordinateSystem: COORDINATE_SYSTEM,
        boundaryJson: JSON.stringify(zone.boundary),
        sourceId: DATA_SOURCE_ID,
      },
    });
  }

  for (const node of demoNodes) {
    await prisma.graphNode.upsert({
      where: { id: node.id },
      update: {},
      create: { ...node, sourceId: DATA_SOURCE_ID },
    });
  }

  for (const road of demoRoads) {
    await prisma.roadSegment.upsert({
      where: { id: road.id },
      update: {},
      create: {
        ...road,
        lengthUnits: demoEdgeLength(road.fromNodeId, road.toNodeId),
        currentStatus: DEFAULT_ROAD_STATUS,
        sourceMode: DATA_MODE,
        sourceId: DATA_SOURCE_ID,
      },
    });
  }

  const [zones, nodes, roads] = await Promise.all([
    prisma.townshipZone.count(),
    prisma.graphNode.count(),
    prisma.roadSegment.count(),
  ]);
  console.log(`Demo data seeded. Database totals: ${zones} zones, ${nodes} nodes, ${roads} roads.`);
  console.log("SIMULATION / SCHEMATIC DATA ONLY: none of the road positions or statuses are live or verified.");
}

main()
  .catch(error => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
