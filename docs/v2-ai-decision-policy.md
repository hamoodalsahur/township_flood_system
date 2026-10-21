# AI incident assistance — proposed capability and decision policy

> No AI model is implemented as part of this planning document. A deterministic rule engine should never be misrepresented as trained AI.

## Recommended first genuine AI feature: group and triage reports

**Input:** validated text, category, coarse location, event time, source type, optionally moderated image embeddings. **Output:** candidate duplicate cluster, suggested category, attention priority, supporting reasons and `needsHumanReview`.

**Minimum model-backed implementation:** use a text embedding or classification model for semantic matching, combined with deterministic time/road proximity filters. Where images are enabled, vision categorization should only suggest a type. Record model/provider/version, inputs used, model confidence if calibrated, decision time and human overrides. Provide a no-model fallback that simply queues all reports.

**Don't call these AI:** category dropdowns, threshold-based rainfall stages, sorting by submission count, Dijkstra/A* routing, or an if/else ruleset. These are useful deterministic features but not machine learning.

## Instant decision boundaries

| Observation | Automated action permitted | Not automatic |
| --- | --- | --- |
| One unverified resident report | Save privately, moderate, show clearly labelled provisional information if policy permits | Verify incident or road closure |
| Several similar independent reports | Suggest deduplication, raise review priority, surface suspected hazard with evidence caveat | Treat popularity as proof or mark road safely closed |
| Authorized municipal roadworks notice | Publish scheduled notice within authorized permissions and validity | Infer extra unrelated closures |
| Verified/authorized road-impact update | Reflect recorded confirmed impact on public display with source and timestamp | Claim alternative road is safe |
| Expiring / contradictory evidence | Mark stale, request investigation, reduce priority and/or suppress uncertain notices | Automatically declare road safe/open |

AI suggestions should be inspectable, reversible and evaluated. Humans remain accountable for verified/official decisions.

## Evaluation plan

Create a small fictional labelled evaluation set, including duplicate reports, near-duplicate wording, unrelated nearby hazards, misleading images, conflicting locations, spam and out-of-date reports. Measure classification accuracy, duplicate precision/recall, false alert rate, moderation error rate, analyst review time and override frequency. Measure impact on decisions, not just impressive looking scores. Require acceptable false-positive behaviour before any automatic provisional public notice.

## Routing: not synonymous with AI

A shortest-path algorithm can enumerate candidate paths on a **validated** road graph; ML can help prioritise incidents or explain source uncertainty. Initially use the project's fictional graph, label the route as a teaching experiment and never tell residents it is an actual safe route home. For geographic deployment, validate directions, access rules, closures, topology and data freshness first.

## Privacy and abuse controls

Public photo sharing is gated on moderation, image processing, EXIF/GPS removal, consent, removal requests and a clear retention policy. Avoid public display of reporter names/contact information and sensitive identifiable third parties. Limit report rates and image sizes; provide abuse reporting. Optional alerts should use the least precise saved area that meets the purpose, and opt-in instead of tracking home journeys automatically.
