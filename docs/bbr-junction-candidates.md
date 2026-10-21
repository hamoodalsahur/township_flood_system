# Candidate junction metadata review

Run `npm run geo:junctions` using your existing local road GeoJSON. It checks coordinates shared between two or more OSM way lines (rounded to six decimals), then highlights locations with differing recorded layer values, bridge/tunnel tags or explicit access tags. A JSON report is saved to `reports/bbr-junction-candidates.json`.

**This is not a junction detection or navigation engine.** A coordinate shared by two features does not necessarily represent a traversable connection. A bridge tag on one line does not prove separation at every shared vertex. Conversely, crossing lines without an explicitly shared vertex are not counted here. Missing tags do not establish ground-level roads or unrestricted access.

The tool stores up to 500 flagged locations, reports the total, and marks truncation when necessary. It never edits the GeoJSON, database or simulated flood data. Future work should preserve original OSM node IDs and validate topology separately.
