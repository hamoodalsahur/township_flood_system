# Inspecting retained OSM tag values

Run `npm run geo:tag-values` after your local road import. The script reads `public/data/bbr-roads.geojson` without modifying it and writes `reports/bbr-tag-values.json`.

The earlier `geo:tags` command counts *how many lines contain each tag*. This tool shows **which values** occur, such as `oneway=yes`, `oneway=no` or `access=private`, along with missing-field counts.

Do not interpret missing fields as proof of open access or two-way traffic. Tags may be incomplete or out of date and are not independently verified. The analysis is not route planning, driving guidance or a flood-safety assessment.

Retain your local GeoJSON backup when switching branches. This command makes no requests to Overpass and needs no new packages.
