# V2.14 optional AI suggestion workflow

The existing fictional incident-group details now hide their optional AI similarity panel until expanded, reducing clutter. Clicking `Find AI candidates` still explicitly invokes local analysis; nothing runs automatically. Candidate scores clearly say **text similarity, not a verified match or real-world hazard probability**. Selecting a suggestion merely prefills the existing manual report selector, highlights the selection, and reminds the operator to enter independent justification and click `Link selected report` separately. The UI disables manual linking if the candidate is not in the current ungrouped same-category report list or the reason is invalid. Existing backend permission checks, group limits, audit and validation remain authoritative.

No new AI threshold, model, data source, route, database schema, migration, seed/reset, GeoJSON import, private photo access, automated incident decisions or road-state mutations.

## Local acceptance
Select an under-review fictional incident, expand optional AI similarity, run the comparison with a local Ollama model if available. Confirm unavailable Ollama produces a clear existing error rather than linking. Click a suggestion, see the selection notice and verify the separate `Link selected report` button requires a review reason. Verify a manual link is recorded only after explicit operator action. Keep the research workbench and evidence approvals unchanged.
