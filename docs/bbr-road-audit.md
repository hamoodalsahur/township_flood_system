# Road data quality checks

After importing OpenStreetMap lines, run `npm run geo:audit`.

This command reads `public/data/bbr-roads.geojson`, prints basic data checks, and saves `reports/bbr-road-audit.json` on your computer. Your original GeoJSON file and database stay unchanged.

The audit counts road types, unnamed roads, duplicate OSM IDs, repeated coordinates, and zero-length geometries. It also counts groups formed by matching only the first and last coordinate of each line.

**Endpoint-only groups are not actual disconnected roads.** Mapped ways may connect at intermediate points, and this audit does not examine intersections, bridges, direction restrictions or traffic rules. Results are for inspecting source data, never travel or flood-safety decisions.

Keep your imported road data backed up before switching Git branches.
