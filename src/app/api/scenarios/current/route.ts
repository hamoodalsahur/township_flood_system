import { NextResponse } from "next/server";
import { getCurrentScenario } from "@/lib/scenario-service";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const snapshot = await getCurrentScenario();
    return NextResponse.json({ ...snapshot, disclaimer: "SYNTHETIC FLOOD SIMULATION — NOT LIVE CONDITIONS. No real BBR telemetry." });
  } catch (error) {
    console.error("GET /api/scenarios/current failed", error);
    return NextResponse.json({ error: "Unable to load demo scenario. Check local database setup." }, { status: 500 });
  }
}
