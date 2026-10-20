import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseReview } from "@/lib/report-validation";
import { canUseDemoOperatorApi } from "@/lib/demo-access";

export const dynamic = "force-dynamic";

// The local demo key is a learning exercise, not production authentication.
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!canUseDemoOperatorApi(request)) return NextResponse.json({ error: "Local demo operator access required." }, { status: 403 });
  try {
    const { id } = await context.params;
    const input = parseReview(await request.json());
    const result = await prisma.$transaction(async tx => {
      const existing = await tx.floodReport.findUnique({ where: { id } });
      if (!existing) return "missing";
      if (existing.status !== "unverified") return "conflict";
      const updated = await tx.floodReport.updateMany({
        where: { id, status: "unverified" },
        data: { ...input, reviewedAt: new Date() },
      });
      if (updated.count !== 1) return "conflict";
      await tx.auditEntry.create({
        data: {
          action: "demo_report_review",
          subjectId: id,
          actor: "LOCAL_DEMO_OPERATOR",
          detail: JSON.stringify({ decision: input.status, note: input.reviewNote, roadId: existing.roadId }),
          sourceMode: "simulation",
        },
      });
      return "updated";
    });
    if (result === "missing") return NextResponse.json({ error: "Report not found." }, { status: 404 });
    if (result === "conflict") return NextResponse.json({ error: "Report already reviewed. Refresh the queue." }, { status: 409 });
    return NextResponse.json({ status: input.status, disclaimer: "Demo review saved with an audit entry. No road status changed." });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error && /Invalid review|Choose corroborated|Review note/.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Demo report review failed", error);
    return NextResponse.json({ error: "Could not review demo report." }, { status: 500 });
  }
}
