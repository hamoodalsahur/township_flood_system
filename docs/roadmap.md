# Development roadmap

All work follows the research-informed v2.0 project brief, with corrections and verification recorded before making external claims.

| Phase | Milestone | Acceptance gate |
| --- | --- | --- |
| 0 | Repo, Next.js shell, README, issue-based workflow | Both scaffold pages load; production build and typecheck pass |
| 1 | Local BBR geography, SQLite/Prisma, map, dual-interface layout | Seeded zones/roads read from DB; roads and sources displayed clearly |
| 2 | Rules-based flood engine, scenario controls, simulated 4R buffer | Deterministic stage changes; every synthetic record clearly labelled |
| 3 | Road graph connectivity and gateway disruption analysis | Verified closures block connectivity; no flooded crossing recommended |
| 4 | Resident reports, operator verification, alerts and audit log | A report stays unverified until reviewed; status changes traceable |
| 5 | Hotspot ranking, historical analytics, integration/e2e tests | Complete scenario with documented observed vs simulated information |
| 6 | Deployment and hackathon handoff | Reproducible release, test notes, working demo, source provenance |

## Team development rules

1. Develop on feature branches, with concise pull requests linked to issues.
2. Each feature needs an acceptance condition and a reproducible test.
3. Never commit API secrets, addresses of individual reporters or unauthorised imagery.
4. Do not present the demo as live infrastructure, emergency routing or validated ML.
5. Verify all road geometries, labels, access restrictions and official station claims before they are labelled factual.

## Suggested issue order

- [ ] Verify BBR zones, road connectivity and candidate data-source licensing.
- [ ] Build seeded road graph and map with provenance labels.
- [ ] Define status/event schema and operator closure workflow.
- [ ] Implement deterministic flood scenario and risk explanation.
- [ ] Add report submission and verification.
- [ ] Add connectivity analysis without promising passability.
- [ ] Add dashboard analytics, checks and reproducible demo instructions.
