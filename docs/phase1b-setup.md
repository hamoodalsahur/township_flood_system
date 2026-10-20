# Trying the interactive map

Phase 1B branches from `feature/phase1a-data-foundation` because Phase 1A's PR #4 is awaiting review. This PR must be merged **into Phase 1A**, or the Phase 1A PR must first be merged into `main` and Phase 1B retargeted.

## Run it in VS Code (PowerShell)

Stop the running dev server (`Ctrl+C`) and save your work before switching.

```powershell
git fetch origin
git switch --track origin/feature/phase1b-interactive-map
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm test
npm run typecheck
npm run build
npm run dev
```

If the branch already exists locally, use `git switch feature/phase1b-interactive-map` and `git pull origin feature/phase1b-interactive-map` instead.

`npm install` should produce a `package-lock.json`. Commit that lockfile to the branch once dependency installation succeeds to ensure repeatable installs.

Visit `http://localhost:3000/resident` and `http://localhost:3000/management`.

## Things to check

- Both pages show the same 4 zones, 8 nodes and 10 edges from the local database.
- Map is an interactive Leaflet `CRS.Simple` schematic canvas (not tiled BBR street map).
- Zone/road clicks show a detail panel with verification status and source.
- Map zoom works; feature selection also works from the keyboard-accessible lists.
- No feature is labelled open or safe by default; unknown is prominent.
- No invented official data or emergency route is shown.
- The interface responds with a clear error if the DB is not seeded.
- `npm test`, `npm run typecheck`, `npm run build` pass.

## A note about our map

Leaflet's `CRS.Simple` mode places local coordinates onto a non-geographic grid, so we must **not** add OpenStreetMap tiles or pretend these positions are actual BBR streets. A later sourced GeoJSON/WGS84 implementation can switch to geographic Leaflet with appropriate map attribution and validation.
