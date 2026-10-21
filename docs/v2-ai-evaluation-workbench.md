# AI Evaluation Workbench — prototype benchmark

This module measures embedding similarity on a fixed, wholly fictional dataset. It never reads resident photos or actual reports.

## Content and ground truth

- 16 hand-written fictional descriptions, grouped into eight intended related-report pairs.
- Every unordered pair is evaluated: 120 comparisons, including 8 intended positives and 112 intended negatives.
- The local Ollama `nomic-embed-text` provider is default; OpenAI remains explicitly optional and separately billed.
- Thresholds: 0.65, 0.70, 0.75, 0.78 (current prototype setting), 0.80, 0.85, 0.90.
- Confusion counts: true positives, false positives, false negatives, true negatives; precision, recall, F1, accuracy.

## Cautions

This is **not** a trained classifier or validated production incident detection system. The pair labels were created for this research demonstration. Samples in the same group share phrasing and are not independent, so scores may be optimistic. Some negatives are easier than genuine neighbouring similar incidents. Pairwise class imbalance makes raw accuracy particularly misleading. No road statuses, review decisions, or report records are changed.

A missing/failed model results in an explicit error, not a fabricated metric. Threshold testing is exploratory: choosing a threshold on this same evaluation set would overfit. Next research milestone should expand to separate development and held-out synthetic sets and compare categories, language (Malay/English) and false-positive costs.

## Run

From `/management`, use **Evaluate local AI model** after logging into the local-demo operator view. Have Ollama running with `nomic-embed-text` installed. The 16 synthetic sentences are sent to the locally configured model. No database schema updates required; no network connection needed with Ollama after model download.

Run `npm test`, `npm run typecheck` and `npm run build`. The local model itself is **not tested by CI**. Preserve the existing BBR GeoJSON and SQLite data when switching Git branches.
