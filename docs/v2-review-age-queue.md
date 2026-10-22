# V2.9 fictional review-age queue

Operator-only read-only ageing indicators support **coursework workflow visibility**, never emergency dispatch, road-safety priority or real hazards.

`GET /api/v2/review-age-queue` reads only local fictional unverified report and under-review incident metadata (ID, category, state, created timestamp, grouped boolean). It deliberately does NOT query or return report descriptions, precise coordinates, photos, reviewer notes, possible road text, access credentials or geographic candidates. Requires the development-only demo operator key and returns `Cache-Control: private, no-store`.

The queue sorts by elapsed whole hours, oldest first, with stable ID tie-breaking, displays at most 12 entries, and counts all eligible reports/groups. Buckets: fewer than 24h, 24–72h, and 72h or more. Invalid/future timestamps are counted separately and not treated as overdue. Timestamps depend on the server clock and are **not evidence of real urgency or severity**. The panel provides no status-changing actions.

## Local acceptance

No Prisma migration, database seeding/reset, local GeoJSON import, new account system or Ollama dependency. Back up existing SQLite, GeoJSON and private `.env`, then test the combined branch. On `/management`, click **Inspect review ages**; confirm deterministic counts and oldest entries and that nothing is automatically reviewed or linked. Existing incident management, evidence privacy and older oversight should remain unchanged. Unauthorized requests to the API should return 403.

**Known limitation:** Demonstration records may have synthetic timestamps; thresholds are illustrative only. No scheduler or action reminders are created.
