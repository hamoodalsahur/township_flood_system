# V2.15 blue road hierarchy and fictional reviewed-report vicinity overlays

## Updated map design

All imported OSM reference line categories use blue tones: main ways **#2563eb**, local streets **#60a5fa**, service **#93c5fd**, other **#bfdbfe**. A selected road remains highlighted. Existing hazard marker logos/icons are unchanged. Base map tiles still come from OpenStreetMap and may use their own neutral/orange cartographic colours outside the imported overlay.

## Colored dashed local research sections

For extra context only, corroborated **fictional** report metadata from the existing public report feed may draw a **short dashed coloured segment** near an *unambiguously closest* unverified imported OSM way: caution yellow, partial obstruction orange, suspected closure red. The visual is **not** a verified road condition, routing instruction, traffic sensor, road-impact decision, nor a status update. There is no new stored road-to-incident association. A report's self-declared suspected impact does not independently prove any road is affected, even after a separate human report-level corroboration.

Conservative safeguards:
- Only reports with existing human `reviewState=corroborated` are considered; unresolved and rejected reports never recolor a way.
- Unknown impact, missing/invalid geographic coordinates, lines farther than 25m, duplicated way IDs, nontrivial proximity ties (within 6m), and OSM bridge/tunnel tags are excluded.
- Only a bounded ~60m segment surrounding the closest point is styled; it cannot recolor an entire long road or imply legal access/turn connectivity.
- The overlay can be toggled off. Color legend and tooltip repeatedly label it fictional vicinity, **not** verified obstruction, closure, access or safety.
- No schema migrations, imports, SQLite writes, AI automation, evidence permissions or modifications to the user's local GeoJSON.

## Local acceptance

Back up your existing SQLite, private .env and locally modified GeoJSON before switching to combined PR. In Resident and Maps & Simulation confirm blue major/local/service layers, same old hazard icon designs, and color toggle/legend. Create **only invented reports** around the imported BBR map, optionally manually corroborate a fictional report with a known suspected impact in the operator page. Refresh the map; check whether a nearby unambiguous OSM line displays a bounded dashed demonstration stroke. At ambiguous junctions or distant points, no stroke is expected. The data cannot be used for travel or closure advice.
