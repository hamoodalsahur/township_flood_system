# Operator-only road proximity candidates (research demonstration)

This milestone helps management compare **fictional report coordinates** to line geometry imported from OpenStreetMap (OSM). Each incident exposes a read-only **Inspect nearby road lines** control.

- Uses the local `public/data/bbr-roads.geojson` file. It is deliberately **not** regenerated or overwritten.
- Requires the existing **local-development-only** demo operator key.
- Calculates an approximate point-to-polyline distance for each non-rejected report in a selected fictional incident, then shows up to eight nearby OSM line candidates, each within approximately 150 metres of a report point.
- Includes the OSM way link and category. The road geometry remains marked `osm_unverified`.
- **Does not** create road associations in the database, change network graph connectivity, record a closure, advise on travel, establish real incident location, or approve a hazard.
- No new migration, dependency or seed. If the committed road file is empty, results will be empty; groupmates may not have the same local imported road data.

## Local test
Back up your modified BBR GeoJSON and SQLite database before switching branches. In `/management`, choose a fictional incident with a geographic report and click **Inspect nearby road lines**. Confirm candidate names/distances/OSM source links or the clear no-candidates message. The same real-world street can have more than one OSM way; results are geometry proximity estimates, not verified incident/road relationships. Confirm other incident grouping, private photos, Ollama and simulation still work.

Future work: validate geometry provenance and legal access assumptions, assess data quality and topology, and build independent human-reviewed linkage records before considering any road-impact inference.
