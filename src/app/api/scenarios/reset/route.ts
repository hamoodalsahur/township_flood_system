import { canUseDemoOperatorApi } from "@/lib/demo-access";
import { NextResponse } from "next/server";
import { activateScenario } from "@/lib/scenario-service";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!canUseDemoOperatorApi(request)) return NextResponse.json({ error: "Local demo operator access required." }, { status: 403 });
  try {
    const state = await activateScenario(1);
    return NextResponse.json({ ...state, reset: true, disclaimer: "Explicit DEMO RESET ONLY; not a real road reopening or inspection." });
  } catch (error) {
    console.error("POST /api/scenarios/reset failed", error);
    return NextResponse.json({ error: "Demo reset failed. Review database configuration." }, { status: 500 });
  }
}
