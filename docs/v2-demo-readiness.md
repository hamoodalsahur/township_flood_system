# Local demo readiness checklist

Operator-only read-only diagnostics at `GET /api/v2/demo-readiness` and `/management` > **Local demo readiness**.

Checks whether the app runs in development mode, local SQLite is accessible, an appropriately long non-default demo operator key exists, the local imported OSM file is valid, and the Ollama embeddings provider is configured. Secrets are never returned to the browser. The AI check is **configuration only**, not an Ollama connectivity or accuracy test. The topology check is file parsing only, not map accuracy validation.

No database writes, GeoJSON reimport, database seeding, new dependencies or schema migration. To test, back up `prisma/dev.db` and modified `public/data/bbr-roads.geojson`, switch to this PR, run `npm install` and `npm run dev`, sign in to management and click **Check local setup**. Check that values are safe to share in a screenshot; no credentials should appear. No green result indicates that the system is safe for deployment or real navigation.
