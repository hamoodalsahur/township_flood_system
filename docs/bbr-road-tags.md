# Preserving OSM metadata

The `geo:import` command now retains selected OpenStreetMap way tags if present: `oneway`, `bridge`, `tunnel`, `layer`, `access`, `motor_vehicle`, and `junction`. The map remains a geographic reference, not a validated road-access system.

To test the upgrade, **back up** your local `public/data/bbr-roads.geojson` first. Run `npm run geo:tags` on the existing file (its missing tags are expected), then run `npm run geo:import` if you're comfortable refreshing from the public Overpass service, and run `npm run geo:tags` again. The command writes `reports/bbr-road-tags.json`. Your original file can be restored from your backup if the new import differs unexpectedly.

Missing tags must be treated as **unknown**, not as proof of two-way traffic, unrestricted access, or ground-level crossings. The importer may retrieve a different number of ways on a later date as OSM changes. This work does not implement routing, traffic directions, verified connectivity or flood-safety assessment.

Use proper © OpenStreetMap contributor attribution and respect OpenStreetMap/Overpass usage policies. Avoid repeated rapid queries.
