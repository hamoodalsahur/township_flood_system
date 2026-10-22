# V2.10 operator-only fictional activity overview

The operator-only `GET /api/v2/operator-audit-summary` provides a **read-only, metadata-only** aggregate of local simulation audit events. It complements rather than replaces the existing **Demo review history** view.

The endpoint selects `action` and `createdAt` only from `AuditEntry` rows marked `sourceMode=simulation`. It does not select `actor`, `subjectId`, `detail`, review reasons, report text, image contents or credentials. The response presents event-family counts (incident management, geographic hazard review, other scenario/road demo, other), last 24 hours and 7 days, and invalid/future timestamp counters. Counts use the server clock and complete local rows, not a capped sample.

This is **not** proof of full logging, operator identity, procedural compliance, authentication, road safety or real incident activity. No database writes, migrations, seeding, scripts, geo imports, evidence status updates or AI approval automation. Access requires the existing development-only operator key, and responses are private/no-store.

## Local acceptance
On the combined V2.10 branch, open `/management` and click **Inspect demo activity**. Check sensible count values against fictional local actions and confirm private audit details are absent from the aggregate panel. Then verify **Load review history** still works as before. Unauthenticated `GET /api/v2/operator-audit-summary` must return 403. No action on this panel should modify database records.
