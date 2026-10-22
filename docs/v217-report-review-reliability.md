# V2.17 fictional report review reliability

The existing compact geographic report-review list now distinguishes **loading**, **failed refresh**, **retry**, and **genuinely empty** fictional reports. A failed feed refresh shows an accessible error and an explicit Retry loading control. Existing potentially stale report rows and their management controls are hidden until a successful reload; the metadata-only photo status is cleared so no stale public-demo eligibility is suggested.

There are no new mutation endpoints, database schema changes, seeding, resets, GeoJSON imports, operator permission changes, public photo exposures or automatic AI/road decisions. This is display-only reliability work.

## Local test
In `/management/incidents`, check the normal geographic report list and filters. Temporarily disconnect the dev server using browser network throttling/offline controls, click Refresh reports, and verify an error with Retry loading rather than a misleading 'no reports' message. Restore connectivity and click Retry loading; previously stored fictional records should return. Verify manually approved images and private sample handling still respect their existing server-side permission gates.
