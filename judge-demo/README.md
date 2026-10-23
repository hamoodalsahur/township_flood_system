# Public judge demo (GitHub Pages)

This is a **static, independent browser demo**, not the local Next.js application or the Expo mobile app.

## What judges can do
- Open the website immediately without cloning, npm, Git, QR scanning, or Expo Go.
- View OpenStreetMap background geography around the Bandar Bukit Raja research area.
- Inspect **six explicitly fictional hazard pins**, filter by category and review state.
- Submit an invented report at a selected point and approve/reject that sample in their own browser session.
- Reset everything to the six original scenarios.

## Accurate limitations
- This site uses OpenStreetMap raster map tiles from a third-party CDN. It does **not** bundle the private 1,269-feature BBR road GeoJSON found only on the owner's laptop. If offline, map tiles may be blank.
- Fictional incident data is part of `index.html`. No report is shared between visitors, stored on a server, or sent to management.
- The approve/reject controls demonstrate review behavior but do not perform authenticated operator actions.
- It does not simulate an AI routing engine, automatic road closures, real-time conditions, private photos, or production security.
- Never use this to make travel or emergency decisions.

## Publication
A dedicated workflow `.github/workflows/judge-demo-pages.yml` publishes the contents of `judge-demo/` as the **root** of this repo's GitHub Pages site after it lands on `main`.

1. On GitHub open repository **Settings > Pages > Build and deployment** and select **GitHub Actions**.
2. Go to **Actions > Publish judge demo to GitHub Pages** and run the workflow if no deployment started automatically.
3. Inspect deployment result and verify the actual Pages URL on phone and desktop; it is expected to look like `https://hamoodalsahur.github.io/township_flood_system/` but **this is not a live link until GitHub confirms it**.
4. Test the filters, report submission, review, reset, and mobile layout.

**Do not enable Pages using the branch /docs source alongside this workflow**: the workflow handles deployment.

## Why separate?
Existing Next.js API routes, SQLite, private evidence, and operator review cannot work on GitHub Pages without a hosted backend. This standalone site avoids leaking personal data and preserves the tested local website/mobile workflows.

## Demo walkthrough
1. Explain that all pins are invented and the basemap is a geographic reference.
2. Select a marker to view a sample incident.
3. Switch Pending / Reviewed / Rejected to see the review-state filters.
4. Tap a map point and submit a sample report.
5. Approve or reject the selected sample in the demo, then reset.
6. Show the live local iPhone+management application separately if presenting its real integration.
