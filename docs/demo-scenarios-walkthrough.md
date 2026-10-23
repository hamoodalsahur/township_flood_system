# Presenter walkthrough: fictional flood events

This is a controlled **offline-data simulation** built into the existing SQLite demonstration network. Real OpenStreetMap roads in the geographic reference section are NOT given flood or closure statuses.

## Two-minute live demo

1. Open `/management`, log in using your existing local demo operator key, and choose **Jump to demo scenarios**. The primary geographic map remains at the top for geographic context.
2. Select **Baseline**. The fictional network has no recorded road conditions (status **Unknown** is not proof of an open road). Select **See road changes** to view the schematic map.
3. Select **Heavy rain**: fictional rain 65 mm/h, West Gate and South Road marked *at risk*. The map highlights these road statuses.
4. Select **Flood reports**: fictitious community reports mark West Gate and South Road as *reported flooding, unverified*.
5. Select **Road closure**: a scripted demo operator marks **RD-DEMO-WEST-GATE** as **confirmed closed in this simulation**. The segment turns red, a marker appears, and the summary shows the closed-road count.
6. Select **Recovery**: rainfall drops in the scenario but the *fictional* West Gate closure remains. This demonstrates why a closure should not be automatically cleared just because simulated rain has stopped.
7. Click **Baseline** again to explicitly reset the fictional scene, or use **Next stage** to show a sequential five-stage progression. Click the affected-road button to inspect its selected status.
8. Optionally open `/resident` in another browser tab; its scenario display and schematic map refresh periodically, or use **Refresh data**.

**Important implementation detail:** Selecting an instant preset deliberately switches all synthetic road records to the chosen scenario's template, including clearing prior fictional closures when moving to an earlier scene. Sequential progression retains the prior closure until the explicit baseline reset. These are demonstration control semantics, not a real-world road reopening, verification or emergency response workflow.

## Before presenting

- Keep the OSM GeoJSON and research reports backed up before switching branches.
- Start the local SQLite database as you have been doing; no schema migration or OSM re-import is needed.
- Run `npm test`, `npm run typecheck`, `npm run build` and `npm run dev`.
- Open `/management`, test Baseline → Heavy rain → Road closure → Recovery → Baseline; verify network statuses and the selected road.
- Use the wording **fictional roadway / simulated road closure**. Do not describe the geographic OSM streets as currently closed, flooded, accessible or safe.
