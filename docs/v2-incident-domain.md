# V2 domain model and interaction rules — planning specification

> Design discussion only. No Prisma migration has been applied.

## Hazard categories and severity

**Primary categories:** `flooding`, `roadworks`, `fallen_tree`, `pothole`, `road_obstruction`, `landslide_or_storm_damage`, `other`.

Category answers **what happened**. **Impact** answers **how travel may be affected**; do not infer a closure from category alone.

Suggested impact enum: `unknown`, `caution`, `partial_obstruction`, `suspected_closure`, `confirmed_closed`. The last state requires an authorized source/reviewer. For public views, include explicit `source`, `reviewStatus`, `observedAt`, `updatedAt` and `expiresAt`; avoid falsely comforting `open` claims.

## Proposed entities

| Entity | Key fields / purpose |
| --- | --- |
| `HazardReport` | `id, category, description, observedAt, submittedAt, reporterRef?, lat?, lon?, roadRef?, submittedImpact, sourceMode, reviewStatus` |
| `Incident` | `id, canonicalCategory, title, summary, status, firstObservedAt, lastUpdatedAt, expiresAt?, location?, sourceMode` |
| `IncidentReportLink` | Associate many reports to one incident, retaining provenance and dedup decisions |
| `IncidentEvidence` | `reportId, storageKey, mimeType, moderationStatus, redactionState, uploadedAt`; private originals and public-safe derivatives only |
| `IncidentRoadImpact` | `incidentId, roadRef, impactType, confirmationSource?, validFrom?, validUntil?, reviewState` |
| `TownshipNotice` | Planned construction or verified management notice with `authority, startAt, endAt, affectedRoads` |
| `AiAssessment` | `reportId/incidentId, task, modelVersion, recommendedCategory, possibleDuplicateIds, priority, confidence?, explanation, reviewedBy?` |
| `DecisionLog` | Immutable actor, decision, reason, previous/new state, timestamp and source for each review/merge/closure action |
| `Subscription` (future) | Opt-in area-based alerts; store the minimum location information required, not default home-address tracking |

All entities must include consistent scope/provenance fields. The current v1 `FloodReport` and simulated `RoadSegment` remain separate during migration.

## Proposed report and incident lifecycle

**Report:** `submitted` → `pending_moderation` → `visible_unverified` / `hidden` / `rejected`; later `superseded` or `expired`. A report's visible status is not road verification.

**Incident:** `candidate` → `under_review` → `verified` / `dismissed`; then `resolved` or `expired`. Operator action or trusted designated authority is required for `verified`.

**Road impact:** `unknown` → `caution` or `partial_obstruction` for clearly labelled provisional notices; `confirmed_closed` only after authorized verification; `expired` does not mean automatically safe/open. Record every transition.

**Example:** two residents upload photos of the same fictional fallen tree. The intake creates two reports. Duplicate analysis links them to one candidate incident. Management reviews it and records a validated impact on fictional Road A. Resident map shows one incident pin with two source reports, the moderation/review label and time.

## UI journeys

**Resident:** open geographic research map → filter hazard category/severity/status → select a marker → inspect summary and permitted photos → choose `Report hazard` → select category and impact → select a point with confirmation → optional photo and details → submit → follow status.

**Management:** dashboard triage queue → group related reports and source evidence → inspect road/location matching → publish provisional notice or review verified impact → assign owner/expiry → record resolution or reject → audit trail.

**Township-generated notice:** authorized manager creates scheduled roadworks with dates and affected segments, then publish as a verified municipal notice; do not require crowd reports to establish it.

**Future route awareness:** resident chooses a destination or saved zone explicitly → app checks whether a vetted candidate path overlaps incident-affected segments → only after spatial/road verification does it display possible alternatives with source freshness and unresolved risk. Initial implementation stays on the synthetic graph and does not generate real-world travel instructions.

## Acceptance tests that prevent misleading behaviour

- Ten copied reports from one source must not be treated as ten independent confirmations.
- A single image-model prediction must not close a road.
- A `pothole` report may have impact `caution` and a `fallen_tree` report may have impact `unknown`; category never implies severity.
- A construction notice has schedule/time validity and source authority.
- A stale report becomes stale or needs re-verification, not `road safely open`.
- All public photos must be sanitized, reviewed, size-limited, and stripped of metadata; ability to hide/remove.
- A location outside geographic research coverage is labelled unmatched, not snapped to an arbitrary road.
- Real/geographic and schematic/simulation identifiers cannot be accidentally mixed in API queries or joins.
- Unauthenticated user or AI cannot confirm incidents, publish official closures or access unpublished media.
