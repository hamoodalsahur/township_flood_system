# V2.18 teammate quickstart — safe local fictional demo

This guide assumes a **new clone on a teammate's machine**, not the project owner's existing working directory or populated SQLite database. Never copy the owner's `.env`, `prisma/dev.db`, private photos, API keys or personal data.

1. Install Node.js, npm and Git. Clone the project and open its root in VS Code.
2. Run `npm install` and `npm run db:generate`.
3. Create your **own private local** `.env` from `.env.example` and choose a **new random** development operator key. Do not commit or share it. Ensure any database path points to a teammate-owned **disposable new** SQLite file.
4. Only for a **brand-new empty disposable teammate database**, follow the repository's database setup guide; `db:push` and `db:seed` are **never** appropriate for the owner's existing database. If unsure whether a DB contains data, stop and ask the project owner rather than resetting it.
5. Run `npm test`, `npm run typecheck`, `npm run build`, then `npm run dev`.
6. Visit `http://localhost:3000/resident` and `http://localhost:3000/management`. Use made-up locations and synthetic descriptions only; any example photo must contain no identifiable people or private details.
7. The imported OSM BBR road GeoJSON is an unverified geographic context source; a teammate's map may differ from the project owner's locally modified dataset. Never replace/import the owner's source without permission.
8. Do not deploy publicly; the simple local-demo operator key is not production authentication.

See [V2.18 walkthrough](v218-demo-readiness-playbook.md), [operator setup](operator-demo.md), [architecture](architecture.md) and [data-integrity](data-integrity.md). A teammate should document exact Node version, tests, project revision and any differences observed before demo sign-off.
