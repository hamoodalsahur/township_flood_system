# Management incident oversight (fictional demo)

The new local-development-only `GET /api/v2/incident-oversight` endpoint computes review and grouping counts from the existing SQLite demo records, behind the existing demo operator key.

Metrics include unverified and older-than-24-hours unverified reports, ungrouped non-rejected reports, linked reports, active/resolved incidents, multi-report groups, and groups with free-text possible road references.

These are **not** reliable hazard severity, response priority, road closure, or real-world measurements. An ageing report is simply older than 24h based on server time. Possible road references are unverified descriptions, not confirmed segment impacts. A resolved incident workflow is not a safe-road certificate.

No migrations required. To test: back up your local BBR GeoJSON and SQLite database, switch to the PR branch, run `npm install` and `npm run dev`, log into `/management`, and verify the **Incident oversight** section and its Refresh button. Create/review fictional reports and groups, refresh, and check the counters. Verify existing Ollama, photos and simulation unaffected.
