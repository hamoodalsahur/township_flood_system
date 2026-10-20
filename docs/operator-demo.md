# Reviewing demo reports and reading the history

The reporting flow now uses a local-development-only key. It's a stepping stone to learning access control, **not** a replacement for real accounts or server-side sessions.

## Set up your local key

Open your existing `.env` and add `DEMO_OPERATOR_KEY` with a **private, randomly generated value of at least 12 characters**. Don't paste the key into chat or commit the actual value to GitHub. Keep `DATABASE_URL` unchanged.

Restart `npm run dev` so the server reads the new environment variable.

At `/resident`, submit a fictional report. At `/management`, enter the demo key to review it, then use **Demo review history** to see the new audit entry. Try entering the wrong key and confirm that reviewing is rejected.

The review update and audit entry are saved together in one database transaction. If the update fails, the history should not claim it happened.

## What this does not secure

- No individual operator accounts or roles.
- No hardened authentication or rate limiting.
- No protection for the old scenario POST endpoints; do not deploy them publicly.
- Demo key is entered in the browser; local development only.
- The report intake endpoint is still open and must be protected against abuse before public deployment.

The server deliberately disables demo-key authorisation when `NODE_ENV` is not `development`. This isn't a deployable management portal yet.

## Updated demo controls

The management view now has one shared operator key input for reviewing reports, reading history and changing the five-stage scenario. The resident scenario is read-only. Both scenario POST endpoints now check the same development-only key; this is still not production-grade authentication.
