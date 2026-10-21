# V2.4B — Offline AI evaluation and human comparison feedback

This milestone provides a **reproducible, synthetic** local benchmark for Ollama embeddings and a persistent human-review record for potential incident pairs. It is research tooling, not a live incident-identification or travel-advisory service.

## What is added

1. `npm run ai:evaluate`: uses the locally running Ollama `nomic-embed-text` embedding model to compare 42 pre-labelled, **entirely fictional** report pairs. There are 21 intended same-event and 21 different-event pairs, with English, Malay, and mixed-language cases spanning all seven hazard categories. It uses batches of 20 to reduce GPU load.
2. A synthetic benchmark prints true positives (TP), false positives (FP), true negatives (TN), false negatives (FN), precision, recall, F1 and accuracy for exploratory cosine-similarity thresholds. The 0.78 threshold currently used by the live demo is explicitly highlighted with false-positive and false-negative case IDs. The CLI additionally prints embedding time and exploratory category and Malay-containing versus English-only language slices. It reserves 14 pre-selected synthetic examples as a holdout, chooses a threshold using the other 28 labelled examples, then reports the held-out outcome separately.
3. In `/management`, operators can open **Run AI comparison**, then label a suggested fictional pair as **same fictional event** or **different events**, with an 8–400-character explanation. Human decisions are stored separately and updated when a reviewer revisits a pair. A corresponding audit entry records each decision.
4. The operator-only queue now shows previously rejected fictional reports and the previous review reason. These still do **not** appear on the public map. A summary shows recent counts of human pair decisions, *not* accuracy metrics.
5. No model may independently verify a report, publish a photo, change a road state or initiate real-world routing.

## Local setup and safety

- Keep your existing Ollama server working; `ollama list` should show `nomic-embed-text`. The benchmark always uses local Ollama, even if a cloud provider is selected for the app.
- Before switching Git branches, **back up** any locally imported `public/data/bbr-roads.geojson` and the SQLite file configured by `DATABASE_URL`. Preserve your `.env`. Do not run `db:seed` or `geo:import` just to test this milestone.
- This branch **adds `AiPairDecision`**. After switching, run `npm install`, `npm run db:generate`, and `npm run db:push` on your backed-up local SQLite database.
- Run `npm test`, `npm run typecheck`, `npm run build`. Start the dev server with `npm run dev`. From another terminal, with Ollama running, use `npm run ai:evaluate` to obtain real model numbers on your machine. CI tests synthetic fixtures and metric maths but cannot test a real running Ollama server.

## Manual checks

1. Confirm public resident hazard pins, reports, category icons and approved photos behave as before.
2. Create two similar fictional reports near one another within a short time. Select one from local management, click **Run AI comparison**, and inspect its possible matches.
3. Add an explanation and label a suggested pair **same fictional event**. Rerun the comparison and confirm the previous judgement is shown.
4. Label a second candidate **different events** and verify summary counts. A reversed pair order must update the same canonical decision, not duplicate it.
5. Reject another fictional report and refresh the operator queue. Its history should still appear there; it must not appear in the public resident feed.
6. Confirm operator-only endpoints refuse requests without the local demo key and none of the comparisons modify the road status.
7. Run `npm run ai:evaluate`. Review metrics **and** mistaken case IDs. Low performance on Malay descriptions is plausible and is a finding, not a reason to hide results.

## Reading the numbers

- **Precision** = TP / (TP + FP): of model-predicted matches, how many had positive synthetic labels?
- **Recall** = TP / (TP + FN): of intended same-event pairs, how many were retrieved?
- **F1** = harmonic mean of precision and recall.
- **Accuracy** = (TP + TN) / all pairs.
- A **cosine similarity score is not a calibrated probability**, even if displayed as a percentage.
- Although this script now reports a small pre-declared holdout (14 pairs) after calibrating on 28 examples, its holdout is still synthetic and drawn from the same hand-written dataset. Neither that result nor selecting a threshold is proof of real-world model quality. For an academic claim, recruit independent reviewers, obtain geographically independent cases with separate labels, assess regional Malay/English expressions, measure latency, and evaluate geographic/temporal filtering separately.
- Human judgements collected only for proposed matches are subject to **selection bias**. Their count is not a measured precision score and does not replace the labelled benchmark.

## Security/privacy limitations

This remains a local synthetic prototype, not a production citizen-facing reporting service. The operator key is a development-only control that fails closed outside development. Real deployment needs proper authentication, anti-abuse limits, evidence moderation and revocation, audit access policy, data retention and incident verification processes.

The database table stores report IDs, reviewer label and explanation. Reports and media remain separate from review feedback. Images do not enter the embedding model or evaluation script. No personal information should be submitted to these demo fields.
