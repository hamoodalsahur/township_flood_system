# Township Flood System

A flood-awareness prototype we're building for the Sime Darby Property University Hackathon, using Bandar Bukit Raja as our case study.

The idea is simple: give residents a clearer picture of possible road disruptions, while giving township management a place to review reports and follow up on incidents.

**Where we're at:** we've built the basic app, a test database, an interactive network map, a five-stage flood simulation, a road-connection checker and a demo reporting page. We're still using **fictional locations and simulated conditions**, not live flood data or actual road directions.

## Try it on your computer

You'll need Node.js, npm and Git. Open the project folder in VS Code and run:

```powershell
# Do this once, unless you already have a .env file
Copy-Item .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm test
npm run typecheck
npm run build
npm run dev
```

Visit these pages after the server starts:

- `http://localhost:3000` — project homepage
- `http://localhost:3000/resident` — resident view, map, simulation and sample report form
- `http://localhost:3000/management` — management view and demo report review
- `http://localhost:3000/api/zones` — sample township zones
- `http://localhost:3000/api/roads` — sample road network

If `.env` already exists, check its settings instead of overwriting it.

## What we've built so far

| Part | What it does |
| --- | --- |
| Database | Saves our sample township zones, roads and test reports |
| Interactive map | Lets us click a zone or road and read its details |
| Flood simulation | Walks through five fictional stages of changing rain, water storage and road conditions |
| Network checker | Shows whether two junctions are connected in our test graph, **not** whether travelling is safe |
| Resident reports | Lets us submit fictional incident reports for testing |
| Management reviews | Lets us mark demo reports as corroborated or rejected, without automatically closing any roads |

## What we're working toward

Next, we'll tighten operator access and add a proper history of changes. Then we can improve the analytics and start replacing the fictional map with geographic information we can actually verify.


## V2 research — local AI and evaluation

The geographic hazard research workspace includes distinct category icons, persistent fictional reports, optional private photos with separately approved map display, and an operator queue. The optional AI button uses **local Ollama** by default (`nomic-embed-text`) for *semantic similarity suggestions*, not automatic verification or closures.

A new labelled **fictional** benchmark can be run with `npm run ai:evaluate` after installing and starting the Ollama model. Operators can record whether suggested fictional pairs describe the same or different events; their choices are audited and kept separate from report corroboration. See [AI evaluation and human-feedback guide](docs/v2-ai-evaluation-guide.md).

**Back up SQLite before `npm run db:push` when adopting this milestone**; it adds a new `AiPairDecision` table. Preserve your locally imported `public/data/bbr-roads.geojson`. Do not use the prototype for actual travel or hazard decisions.

## Project notes

- [Development roadmap](docs/roadmap.md)
- [Architecture and current scope](docs/architecture.md)
- [Where our map data comes from](docs/source-register.md)
- [How we're handling data carefully](docs/data-integrity.md)
- [Development progress](docs/progress.md)
- Setup guides: [database](docs/phase1a-setup.md), [map](docs/phase1b-setup.md), [simulation](docs/phase2-setup.md), [network checks](docs/phase3-setup.md), [reports](docs/phase4-setup.md)

## Important note

**This is a hackathon demo, not a live warning or navigation system.** Our current map is schematic, the flood readings are invented test values, and the operator review page does not have authentication yet. Don't use it for real-world safety decisions, enter personal details into the demo, or publish the report-changing APIs as a production service.

We keep our work in feature branches and review changes through pull requests. Source material and the original v2.0 project brief guide the work, but we verify location details before treating them as facts.

## Local demo operator access

Report review now requires a private local `DEMO_OPERATOR_KEY`, and successful reviews appear in a simple audit history. See [operator demo setup](docs/operator-demo.md). This is not production authentication; scenario-changing APIs still need proper protection before deployment.

## Improved local controls

The management page now has a single development-only operator key input. Residents can view the simulation but cannot advance it from their portal. Scenario updates, reviews and audit reads check the key on the server. See [operator demo notes](docs/operator-demo.md).

## Management demo login

Open `/management` and sign in with the private local `DEMO_OPERATOR_KEY` from your `.env` file. The dashboard appears after the key is checked, and **Log out** hides it again. This is a simple local demonstration, not a production account system. See [the login guide](docs/operator-demo.md).
