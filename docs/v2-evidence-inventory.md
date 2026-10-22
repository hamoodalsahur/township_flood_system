# V2.8 private evidence inventory (read-only)

This is an operator-only **metadata aggregate** of fictional photo-evidence records in the existing SQLite database. It is not a public media portal and cannot download, share, approve, revoke or delete any photo.

- The `GET /api/v2/evidence-inventory` endpoint uses the existing development-only operator key and returns `Cache-Control: private, no-store`.
- Prisma selects ONLY status, stored byte count and creation timestamp from evidence linked to fictional simulation reports. It never selects `base64Data`, file content, report descriptions, coordinates, review notes, operator keys or individual IDs.
- Counts distinguish private_unreviewed, private_rejected, approved_public_demo and unexpected statuses. A 30-day age marker is a **descriptive research value**, not a retention period or automatic deletion.
- UI is inserted into `/management` beside existing oversight. Privacy inventory is not an authorization replacement. All existing explicit public-photo decisions and incident review remain unchanged.

## Local acceptance

No schema migration, database seed, image edits or GeoJSON importer. Preserve local SQLite / `.env` / GeoJSON, switch to the combined V2.8 test branch and run `npm test`, `npm run typecheck`, `npm run build` and `npm run dev`. In management, select **Inspect privacy inventory** and compare aggregate private/public counts with your existing **fictional** photos. No image thumbnails or per-record IDs should be revealed by the inventory response. Verify the ordinary private photo inspection and publication controls still behave normally. Access to the API without an operator key must be HTTP 403.

A future retention policy, verified storage scanning, true account security and consent-based deletion need separate design and explicit operator controls; this PR does not implement them.
