/** Pure metadata-only privacy consistency audit for fictional photo evidence.
 * Never loads images, changes publication or performs evidence validation.
 */
export type EvidenceReviewMetadata={
  status:string;
  mimeType:string;
  bytes:number;
  report:{reviewState:string};
};
export type EvidenceConsistencyCounts={
  recordsScanned:number;
  approvedWithNonCorroboratedReport:number;
  unreviewedPhotoOnReviewedReport:number;
  reviewedPhotoOnUnverifiedReport:number;
  unexpectedEvidenceStatus:number;
  unexpectedReportReviewState:number;
  unsupportedDeclaredMimeType:number;
  invalidStoredByteCount:number;
  totalFlaggedRecords:number;
  disclaimer:string;
};
const STATES=["private_unreviewed","private_rejected","approved_public_demo"];
const REVIEWS=["unverified","corroborated","rejected"];
const TYPES=["image/jpeg","image/png"];

/** A single record may cause multiple distinct warnings; totals are NOT additive. */
export function deriveEvidenceConsistency(rows:readonly EvidenceReviewMetadata[]):EvidenceConsistencyCounts{
  const counts:EvidenceConsistencyCounts={
    recordsScanned:rows.length,
    approvedWithNonCorroboratedReport:0,
    unreviewedPhotoOnReviewedReport:0,
    reviewedPhotoOnUnverifiedReport:0,
    unexpectedEvidenceStatus:0,
    unexpectedReportReviewState:0,
    unsupportedDeclaredMimeType:0,
    invalidStoredByteCount:0,
    totalFlaggedRecords:0,
    disclaimer:"Read-only checks of fictional evidence metadata. A zero-warning result does not prove image safety, authenticity, consent or correct publication. No photo bytes are read; no evidence is published, hidden, revoked or deleted."
  };
  for(const row of rows){
    const before=counts.approvedWithNonCorroboratedReport+
      counts.unreviewedPhotoOnReviewedReport+counts.reviewedPhotoOnUnverifiedReport+
      counts.unexpectedEvidenceStatus+counts.unexpectedReportReviewState+
      counts.unsupportedDeclaredMimeType+counts.invalidStoredByteCount;
    const state=row.report.reviewState;
    if(row.status==="approved_public_demo"&&state!=="corroborated")counts.approvedWithNonCorroboratedReport++;
    if(row.status==="private_unreviewed"&&state!=="unverified")counts.unreviewedPhotoOnReviewedReport++;
    if(row.status==="private_rejected"&&state==="unverified")counts.reviewedPhotoOnUnverifiedReport++;
    if(!STATES.includes(row.status))counts.unexpectedEvidenceStatus++;
    if(!REVIEWS.includes(state))counts.unexpectedReportReviewState++;
    if(!TYPES.includes(row.mimeType))counts.unsupportedDeclaredMimeType++;
    if(!Number.isSafeInteger(row.bytes)||row.bytes<1||row.bytes>200000)counts.invalidStoredByteCount++;
    const after=counts.approvedWithNonCorroboratedReport+
      counts.unreviewedPhotoOnReviewedReport+counts.reviewedPhotoOnUnverifiedReport+
      counts.unexpectedEvidenceStatus+counts.unexpectedReportReviewState+
      counts.unsupportedDeclaredMimeType+counts.invalidStoredByteCount;
    if(after>before)counts.totalFlaggedRecords++;
  }
  return counts;
}
