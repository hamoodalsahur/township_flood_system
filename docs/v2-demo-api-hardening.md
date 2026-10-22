# Development demo intake boundary

The V2 geographic report creation and private evidence upload endpoints are intended for locally authored fictional demonstrations, not public production intake. Prior to this change they were available without authentication if the Next.js app was deployed publicly.

This change makes both `POST /api/v2/hazards` and `POST /api/v2/hazards/[id]/evidence` **fail closed when `NODE_ENV` is not `development`**, returning HTTP 403. Small Content-Length preflight limits reduce accidental oversized payloads (the actual field validators remain the primary payload checks). This is **not complete authentication, rate limiting or production security**. No public production submissions are supported.

The operator incident APIs still require the separate local-development operator key; approved photo read endpoints preserve their explicit publication checks.

## Local validation
No new Prisma migration. Keep your existing SQLite database and local modified BBR GeoJSON. With `npm run dev`, submit a **fictional** geographic hazard report, attach a sample image, verify private image visibility rules, and ensure management review is unchanged. A production deployment must not be used for live public intake. CI tests cover the environment guard and preflight limits.

Follow-up production requirements: authenticated public accounts and operator roles, session protection, server-side image type inspection/transcoding, quotas, rate limiting, retention/revocation policy, and deployment/security review.
