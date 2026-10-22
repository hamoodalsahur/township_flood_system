# V2.12 · Geographic report-review usability refinement

The existing `/management/incidents#report-review` section retains the original operator-controlled review endpoint and its explicit photo approval checkbox. UI-only improvements:

- Search current visible fictional reports by ID, category or description.
- Filter unverified/corroborated and category; sort unverified-first, newest or oldest.
- Show visible match count and unverified count, loading/empty feedback and Clear filters.
- Collapse individual report details until explicitly opened, reducing scrolling while retaining all manual review reasons, rule-based related-report suggestions, optional Ollama comparison, private photo inspection, and separate photo-publication approval.
- Revoke temporary private image `blob:` URLs on hide and when leaving the page, avoiding retained browser object URLs.
- Replace an unsafe error-message suggestion to run `db:push` with a non-destructive database-connection hint.

**No private image contents or operator keys are persisted to browser storage or URLs.** Existing `GET /api/v2/hazards` deliberately omits rejected reports, so filters cannot reveal rejected details. Backend review validation, grouped-report rejection guard, explicit reason and photo controls, audit history and incident/road status protections remain unmodified. No migrations, seeding, imports or database writes except existing manual reviewed actions.

## Local QA

Back up your SQLite, .env and locally modified BBR GeoJSON, switch to the combined V2.12 test branch, run tests/typecheck/build/dev. In Incidents → Geographic hazard report review, search, change category/status/order, open and close a card, run optional AI comparison, inspect a private sample photo then Hide it, navigate away and back, and confirm re-login and privacy still work. Manually review a fictional report only if desired and verify the existing mandatory justification and separate public-demo approval. Check that no automatic grouping or road status updates occur.
