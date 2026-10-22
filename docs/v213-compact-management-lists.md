# V2.13 compact incident and report lists

Short selectable list rows replace the large default cards from V2.12. Each report/incident row shows type, a brief preview, status and date, and clicking it displays the entire existing review workflow inline. Only one detail row is expanded per list. Creating a fictional incident group is also tucked into an expandable form.

For reports, private photo object URLs are revoked when switching/closing rows; operator reasons, explicit sample-photo public-demo approval, optional advisory AI and audit decisions remain unchanged. Incident rows retain manual link/unlink, status changes, operator justifications, OSM road candidates and related context. Search, filter and sort remain available for both lists.

UI only; no API, schema migration, seed/reset, geo import or real-world road-safety claims. User should test keyboard selection, single expanded item, private photo hiding on switch, report review and group management, and all six navigation pages. Protect existing SQLite, locally modified GeoJSON and private .env.
