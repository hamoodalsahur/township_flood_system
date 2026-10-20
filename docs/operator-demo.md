# Logging in to the local management demo

We kept the management login simple: a password field, a login button and a logout button. It reuses the development-only operator key check already in our project, so we didn't add new user accounts or a separate login API.

## Try it

Keep a private `DEMO_OPERATOR_KEY` (at least 12 characters) in your local `.env` and restart the dev server after editing that file. Never commit or share the actual key.

Open `http://localhost:3000/management`. Before logging in, only the login screen is displayed. Enter your `DEMO_OPERATOR_KEY` and click **Log in**. The dashboard will appear. Click **Log out** to return to the login screen.

The key stays in React state only. Refreshing the page also returns you to the login screen.

## What this does and doesn't protect

- The screen stays hidden until the server confirms the correct demo key.
- Report-review actions, audit-history reads and scenario changes still require that key on their server endpoints.
- Other read-only demo APIs remain available, so this **isn't full server-side authentication** or a private data system.
- The check works only in local `NODE_ENV=development`; it deliberately refuses production use.
- No user accounts, sessions, cookies, registration or reset-password feature are included.

Keep it local. Before any public launch we'll need proper authentication, permissions and separate management-data access rules.
