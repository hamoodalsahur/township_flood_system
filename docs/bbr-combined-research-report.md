# One-command geographic research snapshot

Run `npm run geo:inspect-all` to review the currently imported `public/data/bbr-roads.geojson` in one pass. It **does not contact Overpass or overwrite the road file**.

The command creates `reports/bbr-research-summary.json`, a compact report containing:
- Road type counts and geometry quality warnings
- Existing coordinate-based graph group counts
- Selected evidence for repeated vertices
- Retained OSM tag value frequencies
- Candidate shared-coordinate review reasons
- Source-node topology counts, coverage, potential coordinate collisions, and a limited selection of flagged nodes

If source node IDs are missing, the combined report will say so without claiming node-based connectivity. Back up the existing file before running `npm run geo:import` to refresh the study-area extract; the importer also writes a local backup and import-change summary.

**Never interpret these indicators as verified drivable connections, live flood conditions, evacuation routes or safe travel.** They are OpenStreetMap research diagnostics in a bounded geographic window. For full candidate arrays, run the corresponding individual audit commands.
