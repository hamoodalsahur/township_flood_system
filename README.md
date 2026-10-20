# Township Flood Intelligence & Road Accessibility System

Prototype for the Sime Darby Property University Hackathon, using Bandar Bukit Raja (BBR) as an illustrative study area.

> **Development status:** Milestone 0 — application foundation. The website is **not** a live flood warning, road-safety, evacuation or navigation service. Any future flood scenarios will be visibly labelled **SIMULATION — NOT LIVE CONDITIONS**.

## Project goal

Translate township flood information into evidence-labelled road-access insights for residents, alongside monitoring and incident-verification workflows for township operators. The concept complements physical flood-mitigation works; it does not replace official warnings or emergency services.

**Primary interfaces:** resident portal and management dashboard.

## Local setup

Prerequisites: Node.js 20.9+ (Node 22 LTS recommended), npm and Git.

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The links lead to `/resident` and `/management`.

Optional checks:

```bash
npm run typecheck
npm run build
```

**This initial commit includes interface scaffolds only**. The maps, database, gateway statuses, risk engine, reports and scenario controls are scheduled for later milestones and are **not yet implemented**.

## Team workflow

- Open a GitHub Issue describing an observable feature and acceptance test.
- Use a feature branch, for example `feature/bbr-map`.
- Keep changes focused; open a pull request with test notes.
- Do not commit API keys, personal data, secret values, research PDFs without permission, or private location coordinates.
- Label all synthetic/historical/official inputs with their actual provenance.

## Documentation

- [Development roadmap](docs/roadmap.md)
- [Architecture and scope](docs/architecture.md)
- [Data integrity and safety](docs/data-integrity.md)
- [Progress log](docs/progress.md)

The comprehensive source brief is maintained separately as *Township Flood Intelligence & Road Accessibility System — Standalone AI Handoff v2.0*. Some detailed geographic and external-data assertions in that brief still require verification before being seeded as factual records.

## Research and official sources

- [Sime Darby Property](https://www.simedarbyproperty.com/)
- [JPS Public InfoBanjir](https://publicinfobanjir.water.gov.my/)
- [METMalaysia](https://www.met.gov.my/)

Research and source links do not imply that this prototype has direct access to live data.
