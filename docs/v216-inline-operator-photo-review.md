# V2.16 — concise photo handling inside operator report review

Opening a report in `/management/incidents` now automatically shows an attached **public-demo-approved** sample image within the same selected report details. No separate View private photo click is needed for approved images. The original map marker popup approved photo remains unchanged.

Privacy details:
- Only the existing public `/api/v2/hazards/[id]/evidence/approved` endpoint is used for approved samples, after metadata indicates `approved_public_demo` and the report has `corroborated` review state. The endpoint itself enforces both conditions independently.
- Existing private/awaiting-review or private/rejected samples are never fetched automatically. A deliberate operator-only View private sample photo click still uses the existing key-protected private endpoint.
- No-photo records show a compact badge and no wasted photo button. Unavailable or inconsistent metadata disables automatic images and publication options.
- Private image blob URLs are revoked on switching report, after a successful review, and on leaving the page; private responses finishing after a report selection change are discarded.
- Repeated large status/warning panels and incorrect not-public text for already approved public-demo images have been removed. Caption explicitly labels approved photo a **fictional sample, not road-safety evidence**.

No SQLite schema, permission, evidence moderation, upload, audit, approval, automatic road decision or source import changes. Test on the combined integration branch: select approved, private, absent-photo and metadata-failure demo report states; approved photo should appear immediately and private should still require deliberate click. Verify original map-popup behavior is unchanged.
