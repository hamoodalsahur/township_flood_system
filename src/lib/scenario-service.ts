import { prisma } from "@/lib/db";
import { getStageSnapshot, roadStatusesForStage, stageChangeReason, type DemoStage, type RoadStatus } from "@/lib/scenario-engine";

export async function getCurrentScenario() {
  const active = await prisma.scenarioRun.findFirst({ orderBy: [{ startedAt: "desc" }, { id: "desc" }] });
  return { ...getStageSnapshot((active?.stage ?? 1) as DemoStage), activatedAt: active?.startedAt.toISOString() ?? null, scenarioRunId: active?.id ?? null, dataMode: "simulation" as const, geometry: "schematic_xy" as const };
}

/**
 * All operations occur in one transaction, so both portals see the same state.
 * Only simulation-labelled records are changed; never intended for production.
 */
export async function activateScenario(stage: DemoStage) {
  const statuses = roadStatusesForStage(stage);
  await prisma.$transaction(async tx => {
    const roads = await tx.roadSegment.findMany({ where: { sourceMode: "simulation" } });
    for (const road of roads) {
      const desired = statuses[road.id] as RoadStatus | undefined;
      if (!desired || desired === road.currentStatus) continue;
      // A confirmed closure cannot be reopened by changing simulated environmental levels.
      if (road.currentStatus === "confirmed_closed" && desired !== "confirmed_closed" && stage !== 1) continue;
      // Returning to stage 1 is an explicit DEMO RESET, never interpreted as inspection/reopening.
      await tx.roadSegment.update({ where: { id: road.id }, data: { currentStatus: desired, statusUpdatedAt: new Date() } });
      await tx.roadStatusEvent.create({
        data: {
          roadId: road.id,
          status: desired,
          sourceMode: "simulation",
          actorId: desired === "confirmed_closed" ? "SIMULATED_DEMO_OPERATOR" : "SCENARIO_CONTROLLER",
          reason: stageChangeReason(stage, road.id, desired),
          observedAt: new Date(),
        },
      });
    }
    await tx.scenarioRun.create({ data: { label: `Stage ${stage} — synthetic demonstration`, stage, sourceMode: "simulation" } });
  });
  return getCurrentScenario();
}
