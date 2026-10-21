import { isDemoStage, type DemoStage } from "./scenario-engine";

/** Instant, fictional scenes. They never refer to real BBR flood observations. */
export const DEMO_PRESETS = [
  { stage: 1, label: "Baseline", subtitle: "Normal example", detail: "Start with low synthetic rainfall and no observed road status. Unknown is not confirmed open.", highlight: "All fictional road statuses return to unknown." },
  { stage: 2, label: "Heavy rain", subtitle: "Storm develops", detail: "Synthetic rainfall rises to 65 mm/h. Gateway and south road appear at risk.", highlight: "West Gate and South Road marked at risk; trail unavailable." },
  { stage: 3, label: "Flood reports", subtitle: "Reports received", detail: "Synthetic rainfall increases to 85 mm/h. Two example roads receive unverified flooding reports.", highlight: "West Gate and South Road show unverified flooding reports." },
  { stage: 4, label: "Road closure", subtitle: "Operator response", detail: "A scripted demo operator marks the fictional West Gate closed.", highlight: "West Gate changes to closed (simulation), East Gate at risk." },
  { stage: 5, label: "Recovery", subtitle: "Rain subsides", detail: "Synthetic rain drops, but the fictional West Gate closure remains in effect pending inspection.", highlight: "West Gate remains closed in the simulated network." },
] as const satisfies ReadonlyArray<{
  stage: DemoStage; label: string; subtitle: string; detail: string; highlight: string;
}>;

export function isValidDemoPreset(value: unknown): value is DemoStage {
  return isDemoStage(value);
}
