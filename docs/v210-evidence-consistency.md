# V2.10 fictional evidence-publication metadata consistency checks

The **operator-only, read-only** `GET /api/v2/evidence-consistency` endpoint checks minimal metadata for locally stored fictional photo evidence. Its panel is adjacent to Private Evidence Inventory in `/management`.

It counts:
- **Approved for public demo** photo state while the associated fictional report is not corroborated.
- **Private unreviewed** photo state attached to an already reviewed report.
- **Private rejected** photo state attached to an unverified report.
- Unknown evidence/review states, unsupported **declared** MIME type and stored byte counts outside the configured demo size cap.

A record with multiple issues is counted once in the total records with warnings, while each warning category is counted independently. Zero warnings is NOT proof of actual photo safety, image validity, consent or privacy compliance. The feature cannot independently inspect image bytes, signatures, identifiable content or real-world authenticity.

**Privacy and data integrity:** The Prisma query selects only `status`, `mimeType`, `bytes` and its report `reviewState` for simulation records. No image bytes, base64, IDs, user content, coordinates or operator reasoning are selected or returned. It does not approve, publish, revoke or remove photos; existing manual publication gating remains. There are no migrations, data writes, seeding or OSM imports. Local-only development operator key and no-store cache headers apply.

## Combined local test
Stop the dev server and back up existing SQLite, locally edited GeoJSON and private `.env` before branch switching. In `/management`, click **Inspect evidence safeguards**. Check aggregate counters alongside existing **Private evidence inventory** and confirm no photos are displayed by the new panel. Verify existing private-photo review and explicit publication controls still work. Requesting `/api/v2/evidence-consistency` without the operator key should return HTTP 403. Any inconsistent metadata is only a review flag, never an automatic correction. Do not create realistic identifying or sensitive photos for testing.
