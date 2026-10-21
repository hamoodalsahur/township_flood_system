# Shared-vertex road audit

Run `npm run geo:vertices` to read the existing local `public/data/bbr-roads.geojson`, report how many OSM way geometries share coordinate vertices, and save `reports/bbr-vertex-audit.json`.

Unlike the earlier **endpoint-only** audit, this check matches *all listed vertices*, including those in the middle of a line. It groups roads when any coordinates match to six decimal places. It does not infer intersections from visually crossing line segments unless the crossing is an explicitly shared vertex.

Counts are **candidate map-data connectivity only**, not validated transport connectivity. Shared coordinates do not prove a vehicle can turn between roads. Bridges, road levels, one-way systems, turn restrictions and access rules are not evaluated. The analysis does not predict flooding or recommend routes. It does not modify the original GeoJSON file or the existing simulated flood graph.

Compare its candidate group count with the earlier endpoint-group count to understand how much endpoint-only matching missed. Neither count establishes real disconnected roads.
