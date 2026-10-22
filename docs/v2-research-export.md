# Coursework research export (fictional demo)

Local-development operator-only `GET /api/v2/research-export` returns a CSV snapshot of fictional incident groups and report metadata. It includes record type, IDs, category, management/review state, UTC timestamps, a report's linked incident ID, incident linked-report count and incident title. It **omits resident-authored descriptions, photo contents, locations, private operator reasoning and demo credentials**.

Spreadsheet formula prefixes are neutralised before CSV quoting; this does not mean exports should be treated as trusted external files. Files are generated in memory; export does not update the database or write a permanent file to the server.

This is a local coursework/evaluation feature, not a public data portal. Group titles may still contain operator-authored text, so review exported files before distribution. Never interpret fictional metadata as live road safety data.

Testing: on local `/management`, select **Download research CSV**. Confirm the file opens and displays report/incident status values without free-text report descriptions or evidence. No schema migration. Back up your SQLite database and BBR GeoJSON before switching branches.
