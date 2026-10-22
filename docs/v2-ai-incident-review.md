# V2.5 extension: AI-assisted incident review and corrections

## Scope
Build on V2.5 operator-managed fictional incident groups. Human operators can request read-only Ollama suggestions for ungrouped reports in the incident's category. Results use the existing 500m/48h candidate window and embedding similarity threshold, and are **not** a probability of the same event.

## Workflow
1. Run Ollama locally with `nomic-embed-text` and start the Next.js development app with your existing `.env`.
2. In `/management`, find a non-resolved incident group and click **Find AI candidates**.
3. Review the candidate's actual fictional description; **Select for manual linking** only pre-fills the report dropdown.
4. Provide an operator reason of at least eight characters and click **Link selected report**. No model action can create a link without this step.
5. For a mistaken link, enter a correction reason, then click **Unlink** on the linked report. A group must retain at least one report, and resolved groups remain read-only.
6. The system rejects contradictory actions, including attempting to reject a report currently assigned to an incident. Unlink first, with a recorded reason.
7. The existing audit history records linking, unlinking, and incident updates.

## Safety and testing
This does **not** change road status, route advice, review corroboration, photos, operator permissions, or the operational 0.78 AI threshold. No real hazard or user data is used in automated tests. All access is still protected only by the project's **local development** operator key; not production-grade authentication.

Regression checks: `npm test`, `npm run typecheck`, `npm run build`. No Prisma schema changes for this extension, so **do not seed or reset the existing database**. Back up your local modified BBR GeoJSON and SQLite DB before switching branches.
