# V2.14 private sample photo status, no new publication workflow

The **existing** human report review now labels attached sample photo state beside each compact fictional report row and within its selected details. It distinguishes no attachment, private unreviewed, kept private, approved for public demo, and unexpected status. Importantly, "kept private" does not automatically mean its associated report was rejected.

`GET /api/v2/evidence-states` is development-operator-key-only, `Cache-Control: private, no-store`. It selects only `reportId` and `status` from the existing SQLite evidence relation, and only for non-rejected simulation reports already represented in the review queue. It **never queries or returns** photo bytes, image URLs, report descriptions, coordinates, reviewer notes or secrets. If status cannot be fetched, the UI shows a clear unavailable state and **disables the separate photo-publication choice** rather than assuming no photo or public consent. A missing evidence row is accurately labelled "No photo attached".

The original private photo inspection endpoint, existing operator decisions, required reasons and approval checkbox remain. Only `private_unreviewed` can offer the existing separate public-demo sample approval check. Other states remain read-only. No automatic decisions, media uploads, revocations, new DB models, seeds, resets, migrations or GeoJSON imports.

## Acceptance
Visit `/management/incidents`, select an unverified fictional report without photo and one with an existing private sample. Compare labels, disabled/enabled checkbox, and explicit separate public-demo photo controls. Approve only fictional/sample data with no identifying content. Confirm the private viewing remains gated and no images are returned by `/api/v2/evidence-states`; unauthorized GET returns HTTP 403. Existing metadata-only Evidence page works.
