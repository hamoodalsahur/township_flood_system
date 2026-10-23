# Management final UI — browser acceptance (fictional academic prototype)

**Branch:** `feature/management-final-ui-polish`. Draft PR; not approved for merging.

## Scope
- Responsive operator sidebar and quieter management headings across six routes.
- Data-backed Overview counts, recently received reports and review queue (no invented health/traffic KPIs).
- Incidents: searchable left report list, focused right review details, automatic photo preview for the authenticated operator, simple Similar reports button and human-only decision controls.
- Maps: geographic incident map prominent, reference data/markers remain available, secondary legends and technical controls tucked into optional disclosures. Separate schematic flood simulation is available on expansion.
- Evidence: operator-only attached-photo browser plus advanced inventory/consistency diagnostics.
- AI & Research: original authored evaluation remains available but optional/collapsed. Research exports remain.
- System & Audit: essential read-only checks remain visible, technical diagnostics and audit history are expandable.
- Historical schematic/incident-group workflows are not deleted; they are kept available under Advanced sections.

## Photo privacy (critical)
The operator-only `GET /api/v2/hazards/:id/evidence/private` endpoint still requires the existing `x-demo-operator-key` header. Authenticated operators can see an attached fictional sample automatically when selecting a report, using a temporary browser object URL that is revoked on selection change or unmount. Only separately approved images can be fetched through the existing public-approved endpoint and shown in the resident mobile app. The shorter checkbox text **Also show this photo in the resident app after approval** must remain unchecked unless an operator explicitly permits publication after checking for identifying content. Rejecting a report never publishes its photo. No new public access to unreviewed private photos.

## Suggested local workflow
Use the **website** VS Code window only: `C:\Users\ahmad\township_flood_system`. The separate Expo mobile project is not changed.

Before switching, inspect `git status --short` and protect the local SQLite DB, associated WAL/SHM sidecars if present, `.env` files, and especially `public/data/bbr-roads.geojson` outside Git. Stop the Next.js server before copying SQLite, and **do not reset, seed, migrate or import**. If local modifications would be overwritten by the branch switch, do not force checkout; first review and preserve them.

Then, after safe branch switch, run `npm test`, `npm run typecheck`, `npm run build`, and `npm run dev`. No package installation or schema migration should be needed to test this UI-only change.

## Manual browser checks
1. Sign in to Management with the existing local demo operator password. Move through all six sidebar links, verify selected navigation and logout. Refresh should require another sign-in.
2. Overview: counts, newest fictional reports and review queue match the existing local records. Do not show invented activity metrics. Use quick actions to navigate.
3. Incidents: category, search, status filter and sort work. Open multiple reports; descriptions, reported coordinates and correct review status show in the right panel.
4. Attached photo: selecting an unreviewed report **automatically** shows the image to the signed-in operator, without an extra View private button. Selecting another report or leaving releases temporary URLs; no photo on reports without attachments. Approved sample photo works after refresh.
5. Human review: enter 8+ characters of explanation; approve/reject with existing server checks. The optional resident-photo visibility checkbox remains off by default; without it an unreviewed image is not made public. Only turn it on with a non-identifying fictional sample. Verify resident mobile Map and Reports never expose unapproved images.
6. Similar reports: optional button returns results or clear error, and cannot create an incident, approve, reject or change roads automatically. No rule-based priority banner appears.
7. Maps: BBR road data and fictional incident markers remain; filters and details work; expand optional simulation and advanced OSM controls, then collapse them.
8. Evidence: selected attached photo opens for operator only. Verify list and details; navigate to report review. Inventory and consistency checks remain in advanced panels.
9. AI & Research: open optional evaluation, verify original metrics and research export. The UI must not claim fabricated production-grade AI accuracy.
10. System & Audit: inspect local data quality, read-only source diagnostics and operator audit history.
11. Disconnect the backend briefly and restore: error messages appear rather than stale actionable review data; retry works. Test narrow browser widths and keyboard navigation.
12. Re-run CI on the final head and review diff before **explicit user approval**. Do not merge this draft PR automatically.

## Not production-ready
This remains a fictional, local academic demo. Operator key authentication is not a deployable account system; OSM roads are unverified and must not be used to assert real conditions or safe routes. No actual incidents, emergencies or real identifying images should be used for the test.

## Final acceptance update — October 23, 2026

Operator confirmed browser presentation of the management redesign and a successful PC↔iPhone fictional-report workflow (submitted image, human review, private photo not shown to residents, separately approved photo shown, rejected incident handling). Additional map count correction was implemented on this PR after that test:

- Management map now defaults to submitted reports, excluding rejected submissions.
- Four authored fictional map examples are preserved but **opt-in**, under **Include 4 built-in examples**.
- The count distinguishes visible map pins and submitted records; category filters may make the visible number smaller.
- Added `tests/management-map-marker-count.test.ts`; CI must pass at the PR head.
- This final map correction was reported as visually accepted, but no automatic merge occurred.

**Release gate:** review and approve merging PR #85 explicitly. Mobile work is on a separate stacked branch `feature/m4-map-incident-first`; its PR #12 targets `feature/m4-evidence-integrated-foundation`, **not `main`**. Consolidate mobile features separately, verifying the full 31-commit diff and local project-specific assets. Do not force-delete untracked lockfiles or edit existing SQLite/GeoJSON files while switching branches.
