# Township Flood Intelligence & Road Accessibility System

Sime Darby Property University Hackathon prototype with Bandar Bukit Raja as a research focus.

> **Status:** Phase 1A data foundation. This is **NOT** a live flood warning, road-navigation, evacuation or safety system. Any seeded road or zone geography is an explicitly fictional **SCHEMATIC DEMONSTRATION**, not real BBR mapping.

## What exists today

- Next.js / TypeScript / Tailwind app with landing page, resident and management placeholders.
- SQLite / Prisma schema and an idempotent seed for 4 *illustrative* zones, 8 test nodes and 10 connected road/trail links.
- Provenance/source labels and unknown status defaults (no claimed open or safe roads).
- Read-only JSON endpoints for zones and roads; test checks for graph consistency.

## Quick start on Windows

Prerequisites: Node.js LTS, npm and Git.

```powershell
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

Visit:
- `http://localhost:3000` — project landing page
- `http://localhost:3000/resident` — resident portal placeholder
- `http://localhost:3000/management` — operator dashboard placeholder
- `http://localhost:3000/api/zones` — seeded schematic zones JSON
- `http://localhost:3000/api/roads` — seeded schematic road graph JSON

If the local .env file already exists, check it rather than overwriting it.

## Planned next phases

Source-verified BBR geography, interactive map, flood risk rules, demo scenario controller, report verification, alerts, road connectivity and analytics. **These are not implemented yet.**

## Documentation

- [Phase 1A setup and troubleshooting](docs/phase1a-setup.md)
- [Source and geography register](docs/source-register.md)
- [Roadmap](docs/roadmap.md)
- [Architecture](docs/architecture.md)
- [Data integrity and safety](docs/data-integrity.md)
- [Progress log](docs/progress.md)

## Development rules

Use short-lived branches and pull requests, document local tests and do not commit secrets, personal resident locations, unauthorised imagery or invented live sensor values. The original v2.0 handoff remains planning input; any unverified facts and hypothetical staging sites in it must be reviewed before being represented as authentic records.
