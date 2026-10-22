# V2 AI Evaluation Workbench — bilingual, split-sample research

## Purpose
Provide **reproducible early-stage model evaluation** for a fictional township reporting prototype. This is a text similarity experiment, not verified hazard recognition, route safety analysis or a production model accuracy claim.

## Model and deployment
Local default: Ollama `nomic-embed-text`, using the same server-only embedding provider as the operator's on-demand AI report comparison. The cloud provider remains explicitly opt-in and may incur costs. The local server is bound to the application machine's loopback Ollama endpoint. No API key, model files or private photographs are stored in the repo.

## Authored dataset and evaluation protocol

Version: `synthetic-bilingual-v1`.

- **48 fictional text descriptions**, each with an author-assigned incident group, hazard category, language (English or Bahasa Melayu), and evaluation split.
- **Development:** 24 descriptions from 12 matching groups. **Held-out:** 24 descriptions from 12 different groups.
- Per split: all 276 unordered report pairs are evaluated: 12 labelled related pairs and 264 labelled unrelated pairs.
- Deliberately challenging unrelated pairs reuse the **same hazard category** but describe separate locations/incidents. Several intended related pairs use English and Malay wording.
- The development set is used to compare thresholds 0.65, 0.70, 0.75, 0.78, 0.80, 0.85, 0.90. Candidate choice: highest development F1, then higher precision, fewer false positives, then stricter threshold.
- **Holdout examples are never used to choose the candidate threshold**. Only after development selection do we report held-out confusion counts, precision, recall, F1, baseline comparison, illustrative false-match/missed-match examples and positive-pair recall by language pairing.
- Both splits use the same configured model name/provider and independent embedding calls. A missing model causes a visible error instead of fabricated results.
- The current **operational** text similarity threshold stays **0.78**, regardless of the recommendation. Changing it requires separate review and evidence.

## Definitions for student report
- TP: related fictional pair predicted related.
- FP: different fictional incidents predicted related.
- FN: related fictional pair not detected.
- TN: different fictional incidents predicted unrelated.
- Precision = TP/(TP+FP), when at least one positive prediction exists.
- Recall = TP/(TP+FN), when labelled positive pairs exist.
- F1 = 2PR/(P+R), when defined and positive.
- Accuracy = (TP+TN)/all pair comparisons. Accuracy is less informative when the set has many more negative pairs.
- A pair has an AI cosine **similarity**, which is *not* the probability that the incidents really match or that a road is blocked.

If denominators are zero, the dashboard reports N/A instead of pretending accuracy is 100%.

## Academic limitations
This is intentionally a **small, synthetic, author-labelled test**, and two sentences per scenario are correlated. The held-out groups reduce within-scenario leakage but **do not eliminate author style leakage or dataset shift**, as all samples were prepared together. The examples do not measure performance on actual community reports, typos, code-switching, weather conditions or adversarial submissions. Pair evaluation also does **not** measure operational end-to-end precision, since the real incident system uses location/time constraints and human decisions. Subgroup language counts are very small: a language recall value is merely descriptive for this authored corpus, not evidence of equitable performance or a general language capability.

Do not report real-world model performance based on these numbers. An academic report should label the method **synthetic, exploratory and not externally validated**. For future rigorous evaluation, gather consented and de-identified field-like samples where appropriate, create an independently authored holdout set, freeze evaluation criteria and separately test clustering and reviewer decisions.

## Reproducibility and export
In local `/management`, open **AI Evaluation Workbench** and select **Evaluate local AI model**. Record dataset version, model/provider, run date and threshold. The **Export metric CSV** action downloads numeric development and held-out metrics to support research tables. It intentionally excludes photos and public reports. No SQLite migration is needed.

Do not start a benchmark while Ollama is unavailable. Keep `AI_PROVIDER=ollama` and `OLLAMA_EMBED_MODEL=nomic-embed-text` for the user's current GPU-capable laptop setup. GitHub CI checks code and deterministic synthetic vectors; it cannot establish results of the user's locally installed model.

## Safety
The evaluation endpoint is protected by the **local-development demo operator key** and has no production authentication, quotas or operator identity assurance. No evaluation action can corroborate reports, publish photos or update road statuses. Use synthetic examples only; production use requires stronger operational security and rigorous accuracy studies.
