import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseSubmission } from "@/lib/report-validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reports = await prisma.floodReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, roadId: true, category: true, description: true, status: true, reviewNote: true, createdAt: true, reviewedAt: true, sourceMode: true },
    });
    return NextResponse.json({ mode: "simulation", disclaimer: "TEST DATA ONLY — fictional incident reports, not observations from BBR.", reports });
  } catch {
    return NextResponse.json({ error: "Could not load demo reports. Run database setup." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const input = parseSubmission(await request.json());
    const road = await prisma.roadSegment.findFirst({ where: { id: input.roadId, sourceMode: "simulation" } });
    if (!road) return NextResponse.json({ error: "Demo road not found." }, { status: 400 });
    const report = await prisma.floodReport.create({
      data: { ...input, status: "unverified", sourceMode: "simulation" },
      select: { id: true, roadId: true, category: true, description: true, status: true, createdAt: true },
    });
    // Crucial: submitting a report does NOT change a road's operational status.
    return NextResponse.json({ report, disclaimer: "Demo report received. Road status was not changed." }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error && error.message.match(/Invalid report|Select a|Description/)) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: "Could not save demo report." }, { status: 500 });
  }
}
