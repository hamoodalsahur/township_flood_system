# Trying the demo reporting page

This branch builds on Phase 3. It adds stored fictional report submissions and a demo review queue. **Operator review is not authenticated. Never expose the mutation endpoints publicly as production functionality.**

## Run it in VS Code (PowerShell)
Stop the dev server, then run:

```powershell
git fetch origin
git switch --track origin/feature/phase4-community-reports
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm test
npm run typecheck
npm run build
npm run dev
```

If the branch exists locally already, switch to it and pull instead.

## Give it a try
1. At /resident, find **Submit a demonstration report** and select a fictional road and category.
2. Enter a fictional observation of at least 8 characters; do not enter real names, addresses, pictures or personal data.
3. Submit. The report should display as **unverified**, without closing any road.
4. At /management, find the review queue, enter a review note and select **Corroborate** or **Reject**.
5. Refresh the resident page: the report review state should be updated. Road colours should not change from this action.
6. Invalid short descriptions or notes should be rejected.

**Design choice:** Reporting is separate from operational closure. Later work will add real authentication, audit logs, controlled operator closures and reset semantics. The Phase 2 scenario controller is still public demo functionality and must not be deployed unprotected.

## Core code to study
- `prisma/schema.prisma`: where report data is stored.
- `src/app/api/reports/route.ts`: GET list and POST new report.
- `src/app/api/reports/[id]/route.ts`: PATCH review decision, guarded against repeat reviews.
- `src/components/reports/ReportWorkspace.tsx`: resident form and demo review interface.
- `src/lib/report-validation.ts`: validates external input before it touches the database.
