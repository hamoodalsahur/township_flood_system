import { NextResponse } from "next/server";
import { activateScenario } from "@/lib/scenario-service";

export const dynamic = "force-dynamic";
export async function POST() {
  try {
    const state = await activateScenario(1);
    return NextResponse.json({ ...state, reset: true, disclaimer: "Explicit DEMO RESET ONLY; not a real road reopening or inspection." });
  } catch (error) {
    console.error("POST /api/scenarios/reset failed", error);
    return NextResponse.json({ error: "Demo reset failed. Review database configuration." }, { status: 500 });
  }
}
