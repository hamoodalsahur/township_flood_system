# V2.17 incident loading reliability (fictional local demo)

The existing six-page management incident list now distinguishes **loading**, **failed fetch**, **retry**, and genuinely **empty fictional group** states. Previously, a failed load could display a misleading empty list while only a distant error banner indicated failure. A failed refresh now warns that the previously displayed data may be stale and hides management actions until a successful retry. An explicit Retry loading button reuses the existing read-only GET endpoints and the original development operator key. No automated status, incident, report or road updates occur.

No database schema, SQLite writes, migrations, resets, GeoJSON import, permissions or local `.env` changes.

## Acceptance
Temporarily test with your local development server paused/disconnected in the browser (no database deletion). Verify the incident page displays an error/retry rather than pretending there are no groups. Reconnect the server and click Retry loading to restore existing fictional groups. Check manual decisions, private evidence and filtering still work. This branch is **not** merged until local acceptance.
