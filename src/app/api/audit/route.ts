import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canUseDemoOperatorApi } from "@/lib/demo-access";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!canUseDemoOperatorApi(request)) return NextResponse.json({ error: "Local demo operator access required." }, { status: 403 });
  try {
    const entries = await prisma.auditEntry.findMany({ take: 50, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ mode: "simulation", entries, disclaimer: "Local synthetic audit trail, not an official operator record." });
  } catch {
    return NextResponse.json({ error: "Could not load audit history." }, { status: 500 });
  }
}
