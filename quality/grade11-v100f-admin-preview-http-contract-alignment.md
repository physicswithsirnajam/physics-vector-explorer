# V100-F — Align synthetic admin review UX with actual private HTTP wire contracts

## Verified baseline

Owner confirmed **PR #192 (V100-E)** merged into main at `b8e2ff9368b6b040382f446e3427b7b14a0e7906`. The downloadable V100-E offline review-desk design uses official unmodified Physics with Sir Najam logo artwork and four entirely fictional reports tied to four approved, metadata-only Grade XI MCQ references. It passed its original desktop, 390px and 320px Chromium tests and contains **no Firebase/API connection, real administrator login or persistent review action**.

The existing local-only backend has three independently protected components: V100-A private queue GET, V100-C reviewed status POST, and V100-B private audit history GET, combined in the successful V100-D local emulator workflow. None of these is a deployed production interface. The owner is deliberately **deferring the domain purchase/migration** and leaves live student issue reporting **Copy only** until genuine App Check/secure service gates are approved.

## Specific UX-contract discrepancy addressed

The V100-E demo originally presented four fictional records under a heading **Total reports**. In the actual V100-A local HTTP schema, a successful queue read returns `{ok,count,reports}` with a fixed maximum of **10 newest reports per request**. It **does not** return a lifetime/total report count, a server-side search/filter result, or a pagination cursor.

Further, the V100-E mock presents a **Report received** item in its timeline. The actual V100-B audit history returns **0 events for New**, 1 event for In Review, and 2 events for Resolved. The report's original `createdAtIso` is metadata from V100-A's **queue record**, not an audit event. It is fine to display both in one timeline as long as the UI does not represent the original queue timestamp as a server-audited action.

Correctness and trust require that the UI remain explicit about these boundaries **before any future endpoint integration**.

## Four-file limited change

1. `scripts/fixtures/grade11-admin-review-preview-v100e.template.html`: change dashboard cards to **Sample reports / Sample new / Sample in review / Sample resolved**; explain that all counts and filters apply only to four demo entries. Explain private queue is capped at **10 newest reports per request** and does not yet support all-time count, pagination or server-side search/filter. Rename timeline to **Activity timeline (creation + audit events)**, identify the first event as `Report created · queue timestamp (not an audit event)`, and clarify that later audited events originate from the separate audit history contract. All actions remain in-memory and no backend/API code added.
2. New `scripts/test_grade11_admin_preview_http_contract_v100f.cjs`: source-derived offline contract QC. Read `ROW_FIELDS` directly from the existing V100-A private HTTP handler, `EVENT_FIELDS` directly from V100-B, fixed queue page size and four-field transition receipt from V100-C. Parse generated V100-E synthetic records and require they have **exactly** nine backend queue fields plus separate `events`, with valid report IDs, source-pinned MCQ identities and correct 0/1/2 audit transitions, chronological timestamps, no private reviewer/student IDs in events and no unapproved status or category. Assert truthful sample-only captions, and that UI displays issue notes as **textContent**, never as executable HTML.
3. `.github/workflows/validate-grade11-admin-review-preview-v100e.yml`: add the new V100-F source-derived test **after offline fixture build and before the preexisting real Playwright Chromium desktop/mobile tests**. Extend PR/main path triggers to include changes to the three backend HTTP contract modules and new test, so schema drift gets caught early.
4. This QA and security-scope document.

## Wire semantics verified by the new check

| Component | Existing real local backend contract | Honest preview representation |
|---|---|---|
| Queue GET (V100-A) | Max **10** newest records per request, envelope `ok,count,reports`; each report has **9 allowlisted fields** including its issue `note` | Four fictional records only, so sample counts and client-side filters must never be called global statistics |
| Review POST (V100-C) | Only `start-review` / `resolve`, response `ok,reportId,status,alreadyApplied`; no note or private reviewer UID | Simulated buttons only, state machine matches backend; no implied actual database update |
| History GET (V100-B) | `ok,reportId,questionId,status,events` with **0–2** events; each event has exactly `action,fromStatus,toStatus,reviewedAtIso` | Timeline may combine **queue createdAtIso** (clearly labeled as not audited) with returned audit events, but not fabricate a history event or leak a student note into it |

## Explicit safety limits

- No change to the live GitHub Pages portal, its login/authentication, published MCQs or answer keys, notes, simulations, Firestore rules, actual Firebase backend, student reports or private Admin UID provisioning.
- The V100-E preview is still generated as a downloadable **offline GitHub Actions artifact**, not a public administrator page. No new HTTP endpoint, API connection, real sign-in, persistent storage or Firebase SDK is introduced.
- The original exact logo bytes and brand colours are unchanged.
- Current App Check web app registration, genuine signed provider attestation and enforcement decisions are **not** changed. Do not activate live student report Send.
- The backend local HTTP handlers are **not** deployed. Source-derived contract checks do not replace real authenticated backend tests; those were exercised by V100-D with local Auth/Firestore emulators.
- A future live dashboard will need new security, privacy, retention, accessibility, pagination/total-count and production API decisions **before** launch. This PR intentionally does not add any feature that cannot currently be justified by existing backend semantics.

## Merge gate

Keep PR in **Draft** until the exact latest-head **V100-E Offline UX Preview + V100-F Contract QC** Actions workflow and **V99-U App Check Reporting Launch Lock** both show **SUCCESS**. V100-E browser screenshots and generated artifact should still be usable after label changes. On green checks, owner may review → **Ready for review → Merge pull request → Confirm merge**.

No Firebase Console, GitHub secret, custom domain, DNS setting, login or local command is needed. The planned domain migration remains postponed until a suitable name is purchased.
