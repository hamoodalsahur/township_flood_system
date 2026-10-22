import {test} from "node:test";
import assert from "node:assert/strict";
import {deriveEvidenceConsistency,type EvidenceReviewMetadata} from "../src/lib/v2-evidence-consistency";

const row=(status:string,reviewState:string,mimeType="image/png",bytes=100):EvidenceReviewMetadata=>({
 status,mimeType,bytes,report:{reviewState}
});

test("expected private and separately approved fictional photo states are not flagged",()=>{
 const x=deriveEvidenceConsistency([
  row("private_unreviewed","unverified"),
  row("private_rejected","rejected"),
  row("private_rejected","corroborated"),
  row("approved_public_demo","corroborated")
 ]);
 assert.equal(x.recordsScanned,4);
 assert.equal(x.totalFlaggedRecords,0);
 assert.match(x.disclaimer,/does not prove image safety/);
});
test("misaligned review/publication metadata produces distinct, aggregate-only flags",()=>{
 const x=deriveEvidenceConsistency([
  row("approved_public_demo","rejected"),
  row("private_unreviewed","corroborated"),
  row("private_rejected","unverified"),
  row("other","unknown","image/gif",250001)
 ]);
 assert.equal(x.approvedWithNonCorroboratedReport,1);
 assert.equal(x.unreviewedPhotoOnReviewedReport,1);
 assert.equal(x.reviewedPhotoOnUnverifiedReport,1);
 assert.equal(x.unexpectedEvidenceStatus,1);
 assert.equal(x.unexpectedReportReviewState,1);
 assert.equal(x.unsupportedDeclaredMimeType,1);
 assert.equal(x.invalidStoredByteCount,1);
 assert.equal(x.totalFlaggedRecords,4);
 assert.equal("base64Data" in x,false);
});
test("a record raising multiple warnings is counted once in flagged record totals",()=>{
 const x=deriveEvidenceConsistency([row("approved_public_demo","bad","image/gif",0)]);
 assert.equal(x.totalFlaggedRecords,1);
 assert.equal(x.approvedWithNonCorroboratedReport,1);
 assert.equal(x.unexpectedReportReviewState,1);
 assert.equal(x.unsupportedDeclaredMimeType,1);
 assert.equal(x.invalidStoredByteCount,1);
});
test("empty dataset returns safe zero counts",()=>{
 const x=deriveEvidenceConsistency([]);
 assert.equal(x.recordsScanned,0);
 assert.equal(x.totalFlaggedRecords,0);
});
