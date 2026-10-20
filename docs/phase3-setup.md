# Phase 3 — Road-network connectivity experiment

This is **not navigation** and produces no safe route or vehicle-specific floodwater recommendation. It is a theoretical test on fictional topology.

## Windows PowerShell

Stop the development server and save local changes.

```powershell
git fetch origin
git switch --track origin/feature/phase3-road-accessibility
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm test
npm run typecheck
npm run build
npm run dev
```

If the branch already exists locally, run `git switch feature/phase3-road-accessibility` followed by `git pull origin feature/phase3-road-accessibility`.

Visit `/resident` and `/management`. Select two junctions and click **Check theoretical connection**.

Reset the five-stage demo and test connectivity during Stages 1, 3, 4 and 5. Recheck after each stage.

- Closed links are excluded.
- Links with unverified flooding reports are excluded.
- The fictional walking trail is excluded from the road graph.
- Unknown or at-risk road links are included in *topology only*, but the response flags all such links as uncertain; it does **not** mean those roads are usable.
- There are no safe-staging destinations, travel directions, water-depth clearance thresholds or speed/time outputs.

Data and status changes persist via SQLite. The service is deliberately read-only regarding graph state. It is a demo feature; do not deploy the mutation-enabled scenario API publicly without authentication and demo restrictions.

A generated `package-lock.json` should be committed after local verification if it is still absent.
