# V2.5: operator-managed fictional incidents

This adds a human-controlled grouping layer above V2 geographic hazard reports. All records and roads are fictional demonstration data. AI similarities are suggestions **only** and do not alter incident groups automatically.

## Schema
- `DemoIncident`: descriptive title, category, management workflow status, operator reason, optional **free-text possible road reference** and timestamps.
- `IncidentReportLink`: joins each fictional hazard report to a single group. Unique `reportId` blocks a report from belonging to multiple incidents.
- Existing `AuditEntry` receives append-only incident creation, linking and status-update records.
- `HazardReport.reviewState` remains separate from `DemoIncident.status`. Corroborating a fictional report or incident does **not** verify a road closure.

## Development workflow
1. Preserve `public/data/bbr-roads.geojson` and **back up `prisma/dev.db`** before any Git switch or schema change.
2. Switch to the PR branch and run `npm install`, `npm run db:generate`, `npm run db:push` and `npm run dev`. **Do not run `npm run db:seed`** with valuable local records.
3. Log into the local `/management` page. Create an incident using an existing fictional report, an 8–100 character title and 8–400 character justification.
4. Link a second fictional report from the *same category* with another justification. A report may be linked only once. Rejected reports cannot be grouped.
5. Save explicit operator incident status: under_review → corroborated → resolved (or under_review → resolved). Resolved groups are read-only; no silent reopening.
6. Optionally describe a **possible** road impact in free text. It does not update any `RoadSegment` or navigation instructions. Review the existing audit history.
7. Verify resident markers, photos, AI comparison, language benchmark and flood simulation still function.

## Security and integrity
- Routes are restricted to the project's existing **local-development-only shared operator key**, not production authentication.
- Groups only use `sourceMode=simulation` reports.
- Database transactions ensure incident updates and audit-entry creation happen together.
- These records never trigger or imply real-time hazard confirmation, road closure, road accessibility, route safety or real-world response dispatch.
- Human decisions in the local demo are not a field-verified incident-response workflow. Future production phases need proper operator accounts/roles, conflict handling, moderation, audit retention and authoritative road-source validation.
