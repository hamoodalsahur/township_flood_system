import { NextResponse } from "next/server";
import { canUseDemoOperatorApi } from "@/lib/demo-access";
import { isValidDemoPreset } from "@/lib/demo-showcase";
import { activateScenario } from "@/lib/scenario-service";

export const dynamic = "force-dynamic";

/**
 * Local-development presentation shortcut. Unlike sequential progression, this
 * intentionally switches the *entire fictional scene* to the chosen stage.
 */
export async function POST(request: Request) {
  if (!canUseDemoOperatorApi(request)) {
    return NextResponse.json({ error: "Local demo operator access required." }, { status: 403 });
  }
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("stage" in body) || !isValidDemoPreset(body.stage)) {
      return NextResponse.json({ error: "Choose a synthetic preset stage 1–5." }, { status: 400 });
    }
    const result = await activateScenario(body.stage, { preset: true });
    return NextResponse.json({
      ...result,
      disclaimer: "Explicit fictional scene switch. No live readings, real road closure or actual road reopening.",
    });
  } catch (error) {
    console.error("POST /api/scenarios/preset failed", error);
    return NextResponse.json({ error: "Could not activate the fictional demo preset. Check your local database." }, { status: 500 });
  }
}
