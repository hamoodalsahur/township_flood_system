# V2.12 · Incident group list refinement (fictional demo)

The dedicated `/management/incidents` page retains the original operator-only `IncidentManager` and provides **client-side** search, review-state filters, category filters, age ordering and visible result counts. Search matches incident title, local ID, category or possible **fictional free-text** road reference. Empty matches are explained; Clear filters restores the full list. Existing report group cards show an at-a-glance title, status, category, linked count and timestamp; open their details to view reports, manual linking, life-cycle actions, AI suggestions and read-only OSM candidates.

No new API, database schema, migrations, DB writes, seeds, GeoJSON imports or evidence permissions. Search is display-only and never records a decision; operator justifications, manual link/unlink restrictions, lifecycle validation, privacy rules and audit logging remain unchanged.

## Local QA
Open `/management/incidents`. Search for a fictional incident title or ID, filter by status/category and check ordering, zero-results feedback, and Clear filters. Expand groups and verify AI suggestions do not act automatically; manually link/unlink only using fictional reports and existing justification rules. Confirm resolved groups remain read-only, and original OSM source warnings and road status protections remain. Refresh and check newly recorded actions appear in the right filter. Preserve existing local SQLite, GeoJSON, and `.env`.

These are UI workflow changes, not a severity score or verified road hazard search.
