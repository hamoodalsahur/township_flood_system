# V2.10 road candidate research observations (local fictional demo)

Existing operator-only `GET /api/v2/incidents/[id]/road-candidates` now returns **aggregate nearby fictional report-location counts** alongside the original approximate point-to-road candidate distances, provenance and caveats.

- Each returned road candidate includes `observationSummary` indicating how many eligible fictional incident report locations fall within 150 m of that specific unverified OSM line. The approximate nearest/farthest distance among matching locations is displayed.
- A duplicate OSM way ID in the source suppresses this extra summary's matches and raises an explicit flag: ambiguous identity must not be silently resolved.
- Reports can be duplicated, mislocated, correlated, fictional or drawn from the same event. **Multiple nearby points do not independently corroborate a road condition or establish that the road is affected.**
- The API returns no individual report coordinates or free-text reports via the new observation summary. The preexisting private operator API still reads local report locations server-side.
- No changes to road status, incident links, report review, private evidence, AI suggestions or OSM files. No Prisma migrations, seeding or imports.
- Operator authentication remains development-only; not appropriate as production identity management.

## Local acceptance

On the combined V2.10 branch, open `/management`, sign in, choose a fictional incident with geographic reports and click **Inspect nearby road lines**. Verify OSM candidates show observation counts/distances, caveats and source URLs (or the ordinary no-candidate state). Verify counts do not trigger any review, closure, route or linkage. Check existing manual incident actions, private evidence and QA dashboards still work.

This remains unverified academic demonstration research—not travel advice or operational validation.
