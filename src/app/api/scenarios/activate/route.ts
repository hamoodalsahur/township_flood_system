import { canUseDemoOperatorApi } from "@/lib/demo-access";
import { NextResponse } from "next/server";
import { activateScenario, getCurrentScenario } from "@/lib/scenario-service";
import { isDemoStage } from "@/lib/scenario-engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!canUseDemoOperatorApi(request)) return NextResponse.json({ error: "Local demo operator access required." }, { status: 403 });
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || !("stage" in body) || !isDemoStage(body.stage)) {
      return NextResponse.json({ error: "Expected JSON: { stage: 1|2|3|4|5 }" }, { status: 400 });
    }
    const requestedStage = body.stage;
    const current = await getCurrentScenario();
    // Only sequential progression avoids bypassing scripted demo verification history.
    if (requestedStage !== current.stage + 1) {
      return NextResponse.json({ error: "Advance one stage at a time. Use Reset to start a new demonstration." }, { status: 409 });
    }
    const result = await activateScenario(requestedStage);
    return NextResponse.json({ ...result, disclaimer: "Controlled synthetic demo, not live flood data." });
  } catch (error) {
    console.error("POST /api/scenarios/activate failed", error);
    return NextResponse.json({ error: "Scenario activation failed. Review database configuration." }, { status: 500 });
  }
}
