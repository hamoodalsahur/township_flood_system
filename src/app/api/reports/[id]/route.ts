import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseReview } from "@/lib/report-validation";

export const dynamic = "force-dynamic";

// WARNING: this endpoint is an OPEN SIMULATION ONLY. No real operator authentication exists.
// Do not deploy with public access until authentication, authorization and audit controls are implemented.
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const input = parseReview(await request.json());
    const existing = await prisma.floodReport.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Report not found" }, { status: 404 });
    if (existing.status !== "unverified") return NextResponse.json({ error: "Report already reviewed" }, { status: 409 });
    const result = await prisma.floodReport.updateMany({
      where: { id, status: "unverified" },
      data: { ...input, reviewedAt: new Date() },
    });
    if (result.count !== 1) return NextResponse.json({ error: "Report changed; refresh the queue" }, { status: 409 });
    return NextResponse.json({ status: input.status, disclaimer: "DEMO REVIEW ONLY. No road closure was issued." });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error && error.message.match(/Invalid review|Choose corroborated|Review note/)) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: "Could not review demo report" }, { status: 500 });
  }
}
