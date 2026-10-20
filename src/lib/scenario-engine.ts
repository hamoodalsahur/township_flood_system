/**
 * Educational scenario data only. Numeric values are deliberately invented test
 * inputs, NOT records, forecasts, JPS readings, or measurements from BBR.
 */
export type DemoStage = 1 | 2 | 3 | 4 | 5;
export type RiskTier = "low" | "moderate" | "high";
export type StageSnapshot = {
  stage: DemoStage;
  title: string;
  rPhase: string;
  rainMmHr: number;
  wetlandFillPercent: number;
  tide: "normal" | "high" | "receding";
  overallRisk: RiskTier;
  narrative: string;
  riskExplanation: string;
};
export type RoadStatus = "unknown" | "at_risk" | "reported_flooding_unverified" | "confirmed_closed";

const scenarios: Record<DemoStage, Omit<StageSnapshot,"overallRisk"|"riskExplanation">> = {
  1: { stage: 1, title: "Normal baseline", rPhase: "Normal", rainMmHr: 2, wetlandFillPercent: 18, tide: "normal", narrative: "Dry-weather demonstration baseline. All road observations remain unknown; unknown does not mean open." },
  2: { stage: 2, title: "Heavy rain: reroute & retain", rPhase: "Reroute / Retain", rainMmHr: 65, wetlandFillPercent: 68, tide: "normal", narrative: "Simulated stormwater diversion and rising wetland storage; a demonstration trail restriction is recorded." },
  3: { stage: 3, title: "Overflow risk & reports", rPhase: "Retain / Overflow risk", rainMmHr: 85, wetlandFillPercent: 92, tide: "high", narrative: "Schematic road reports become unverified flooding observations; these are not verified closures." },
  4: { stage: 4, title: "Simulated operator response", rPhase: "Respond", rainMmHr: 85, wetlandFillPercent: 95, tide: "high", narrative: "A scripted DEMO OPERATOR confirms one fictional gateway closure. This is not a real emergency instruction." },
  5: { stage: 5, title: "Restore & release", rPhase: "Restore / Release", rainMmHr: 5, wetlandFillPercent: 54, tide: "receding", narrative: "Rain and retained water drop, but the simulated confirmed road closure stays closed pending separate simulated inspection." },
};

export function isDemoStage(value: unknown): value is DemoStage {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function assessRisk(rainMmHr: number, wetlandFillPercent: number, tide: StageSnapshot["tide"]): { risk: RiskTier; explanation: string } {
  if (!Number.isFinite(rainMmHr) || !Number.isFinite(wetlandFillPercent) || rainMmHr < 0 || wetlandFillPercent < 0 || wetlandFillPercent > 100) {
    throw new Error("Invalid demonstration sensor input");
  }
  const reasons: string[] = [];
  let score = 0;
  if (rainMmHr >= 60) { score += 2; reasons.push("heavy simulated rain"); }
  else if (rainMmHr >= 20) { score += 1; reasons.push("elevated simulated rain"); }
  if (wetlandFillPercent >= 90) { score += 2; reasons.push("simulated wetland storage near capacity"); }
  else if (wetlandFillPercent >= 65) { score += 1; reasons.push("simulated retention level elevated"); }
  if (tide === "high") { score += 1; reasons.push("simulated high tide"); }
  const risk: RiskTier = score >= 4 ? "high" : score >= 2 ? "moderate" : "low";
  return { risk, explanation: reasons.length ? reasons.join("; ") : "no elevated signals in the synthetic example" };
}

export function getStageSnapshot(stage: DemoStage): StageSnapshot {
  const inputs = scenarios[stage];
  const { risk, explanation } = assessRisk(inputs.rainMmHr, inputs.wetlandFillPercent, inputs.tide);
  return { ...inputs, overallRisk: risk, riskExplanation: explanation };
}

export const SIMULATED_ROAD_IDS = [
  "RD-DEMO-WEST-GATE", "RD-DEMO-SOUTH", "RD-DEMO-TRAIL", "RD-DEMO-EAST",
  "RD-DEMO-EAST-GATE", "RD-DEMO-NORTH-LINK", "RD-DEMO-NORTH",
  "RD-DEMO-NORTH-GATE", "RD-DEMO-BYPASS", "RD-DEMO-SPUR",
] as const;

export function roadStatusesForStage(stage: DemoStage): Record<string, RoadStatus> {
  const values: Record<string, RoadStatus> = Object.fromEntries(SIMULATED_ROAD_IDS.map(id => [id, "unknown"]));
  if (stage >= 2) {
    values["RD-DEMO-TRAIL"] = "confirmed_closed";
    values["RD-DEMO-WEST-GATE"] = "at_risk";
    values["RD-DEMO-SOUTH"] = "at_risk";
  }
  if (stage >= 3) {
    values["RD-DEMO-WEST-GATE"] = "reported_flooding_unverified";
    values["RD-DEMO-SOUTH"] = "reported_flooding_unverified";
  }
  if (stage >= 4) {
    values["RD-DEMO-WEST-GATE"] = "confirmed_closed";
    values["RD-DEMO-EAST-GATE"] = "at_risk";
  }
  if (stage === 5) {
    values["RD-DEMO-SOUTH"] = "unknown";
    values["RD-DEMO-EAST-GATE"] = "unknown";
  }
  return values;
}

export function stageChangeReason(stage: DemoStage, roadId: string, newStatus: RoadStatus): string {
  if (newStatus === "confirmed_closed") {
    return `SIMULATED OPERATOR ACTION in controlled stage ${stage}: scripted demo closure, NOT a verified real-road closure (${roadId}).`;
  }
  if (newStatus === "reported_flooding_unverified") return "Synthetic community report — explicitly unverified.";
  if (newStatus === "at_risk") return "Demonstration risk assessment only, not a verified road condition.";
  return stage === 5 ? "Synthetic observation expired; status unknown. No automatic road reopening." : "Demonstration baseline; no known live observations.";
}
