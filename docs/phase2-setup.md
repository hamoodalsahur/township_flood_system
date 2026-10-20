# Trying the five-stage flood simulation

This phase depends on Phase 1A and Phase 1B; currently the branch descends from `feature/phase1b-interactive-map`.

## Run it in VS Code (PowerShell)

Stop `npm run dev` with Ctrl+C, then:

```powershell
git fetch origin
git switch --track origin/feature/phase2-scenario-risk-engine
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm test
npm run typecheck
npm run build
npm run dev
```

Use `git switch feature/phase2-scenario-risk-engine` and `git pull origin feature/phase2-scenario-risk-engine` if you already have the branch locally.

Open `http://localhost:3000/resident` and `http://localhost:3000/management`. Click **Reset demo** to explicitly start Stage 1, then advance sequentially. The stage and road conditions are persisted in SQLite across pages.

## What you should see

1. Stage 1: rain 2 mm/h, wetland fill 18%, all roads **Unknown** unless leftover records are reset.
2. Stage 2: scripted trail closure (red), west gateway and south connector at risk (amber).
3. Stage 3: west gateway and south connector synthetic reports marked **Unverified** (orange).
4. Stage 4: a **SIMULATED_DEMO_OPERATOR** action records a scripted west-gateway closure (red); not real-world verification.
5. Stage 5: rainfall decreases; west-gateway closure remains red and does not automatically reopen.
6. Check both pages: stage and road statuses stay consistent. Reload one page to verify persistence.
7. All synthetic data clearly labelled `SIMULATION — NOT LIVE CONDITIONS`.
8. The app must not instruct users to drive through floodwater or declare a road safe.

## Endpoints

- `GET /api/scenarios/current` — synthetic stage and explainable risk evaluation.
- `POST /api/scenarios/activate` body `{"stage":2}` — advances exactly one stage (up to 5).
- `POST /api/scenarios/reset` — deliberately resets the *demo only* to Stage 1.
- `GET /api/roads` — returns simulated road statuses as stored in SQLite.

**Limitations:** This is an educational controlled simulation, not hydrological prediction. Stage values and scripted operator decisions are fiction. This phase does not implement identity verification, access controls, real community reports, IoT integrations, or actual road navigation. Do not expose mutation endpoints publicly without proper access control and demo-mode restrictions.

**Pending** owner local test/build verification. A generated `package-lock.json` should be committed with the next reviewed change.
