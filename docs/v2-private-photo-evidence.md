# V2.2 — Private photo evidence demonstration

This milestone adds a development-only image-evidence proof of concept to persistent geographic hazard reports.

## Resident flow

Choose an example hazard position/category and optionally select a JPEG or PNG image. The client resizes it to at most 640 x 640, draws it onto a fresh Canvas and exports JPEG to remove the original image's embedded metadata. Files larger than 5 MB before processing are rejected. The server restricts processed evidence to 200 KB and checks image header bytes.

The report is submitted first; an optional photo is attached afterward. If image upload fails, the report remains saved and the resident receives a specific partial-success message.

## Management flow

The management panel has a private photo button for every stored fictional report. The photo is retrieved only after the development-only operator-key check; images are not returned in public hazard JSON or map pins.

## Implementation

- New additive Prisma model: `HazardEvidence` (one optional private image per `HazardReport`).
- `POST /api/v2/hazards/:id/evidence` validates processed image and unreviewed simulation report.
- `GET /api/v2/hazards/:id/evidence/private` authenticates using the existing local development key, returns noncacheable media.
- `src/lib/v2-evidence-validation.ts` implements base64 size/MIME/header checks with tests.
- `src/lib/demo-photo-client.ts` processes files on the resident browser.

## Limitations

**For local fictional demos only.** No public photo hosting, production resident accounts, upload moderation, virus scanning, quota enforcement or secure cloud storage is provided. Use nonidentifiable test photos only. A photograph does not verify a real hazard or close a road. Production requires authenticated uploads, request rate limits, stronger validation and re-encoding on the server, image moderation, storage lifecycle/deletion and privacy review.

## Test

Back up SQLite and local OSM GeoJSON. Run `npm install`, `npm run db:generate`, `npm run db:push`, `npm test`, `npm run typecheck`, `npm run build`. In `/resident`, submit a fictional report with an optional photo and confirm map pin persists. In `/management`, sign in and use the private photo inspection button. Ensure public `/api/v2/hazards` response contains no bytes. Try submitting without an image and with an unsupported file. Existing simulation and hazard filters should continue to work.
