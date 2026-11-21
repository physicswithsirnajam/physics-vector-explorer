# V96-D — Student-Facing Google Sites Navigation Retirement and Public-Content Audit

**Context.** This work follows verified merge of PR #137 (V96-C). It is a small, reviewable migration step. Existing MCQ content, grade/assessment permissions, teacher approvals and historical source records are **not** changed.

## Immediately fixed in this PR

1. **Global Units & Resources drawer** (`shared/navigation.js`): replace the prominent obsolete Google Sites shortcut with a **same-site Notes & Concept Videos** link. Global URL validation now accepts links only inside the current portal site/repository base.
2. **Sign-in screen** (`portal/index.html`): replace the outbound historical public-hub link with the native original Notes & Concept Videos page; the Grade XI Student Guide stays.
3. **Simulation library** (`portal/simulations.html`): replace the old-site header navigation with **Unit 6 Learning Desk**; revise the outdated migration notice to point to notes/videos within the portal.
4. **Signed-in Learning Hub** (`portal/learning-hub.js`): its generated navigation no longer whitelists the former Google Sites origin. Source archives do not become authentication or entitlement controls.
5. **Old Notes & Videos library** (`portal/legacy-hssc-resources.html`): preserve 17 historical video-page titles (15 unit pages + 2 general pages) in their existing visible archive cards **as text only**, with **zero links** leading to Google Sites. Retain exactly the original 17 source records and URLs inside `portal/legacy-hssc-resources-v73.json` for provenance. The existing **27 direct YouTube entries / 26 distinct IDs**, **17 original Drive PDF handouts**, and **one external reading** remain unchanged. The Unit10 direct YouTube link known to be a duplicate/wrong-topic entry stays flagged and must not autoplay.

## Security/privacy distinction

A **missing menu link does not restrict an HTML page hosted on public GitHub Pages**. This PR is **link and student-interface hygiene, not backend authorization**. It does not claim that public marking schemes, teacher notes or source verification utilities have become private or unavailable by direct URL.

### Publicly reachable paths requiring separate teacher/admin decisions
- `portal/unit-05-descriptive-teacher.html` — teacher marking rubric and answer guide; confirm whether student viewing is intended. **Do not assign protected-teacher status simply because its filename says teacher.**
- `portal/unit-05-mcq-key.html` and `portal/unit-05-mcq-set-b-key.html` — public answers/keys; determine whether intentionally ungraded practice discussion or meant to be hidden during formal tests.
- `portal/unit-04-discussion-slides.html`, `portal/unit-05-projector-discussion.html` — projector/teacher discussion views; decide appropriate audience and links.
- `portal/unit-04-slo-audit.html`, `portal/unit-05-fbise-audit.html` and `portal/unit-06-figure-verification-v91.html` — audit and source-comparison pages with potentially teacher-facing language; review wording for students without misrepresenting their actual public accessibility.
- `portal/index.html` contains a collapsed historical Unit6 release log with internal version identifiers and reference/verification descriptions. Rewriting it may change earlier source-fidelity checks; address via **a separate teacher-approved wording and navigation PR**, keeping audit evidence in the private/protected admin system if one is later built.

**Important:** If any of these files truly contains non-public student personal data or exam answers that must be withheld, remove the content from public hosting and migrate delivery to authenticated backend controls—not CSS, client-side redirects or hidden drawer links. This PR does not complete that larger security migration.

## Read-only wider audit

The dedicated V96-D test enumerates public HTML in the repository root and portal and generates a CI-only report of any remaining literal **outbound Google Sites hrefs**. The five explicitly migrated student navigation entrypoints must contain **zero** literal `sites.google.com` references. Other HTML findings, if any, are captured as future small migration tasks and are **not automatically edited**, so existing verified study resources are not inadvertently deleted.

## Regression and verification
- `scripts/test_hssc_legacy_resources_v73.cjs` is updated only to expect **17 non-clickable historical title cards** instead of live old-site links. Its other PDF source, page count, original mismatch, search/bookmark and mobile checks remain.
- Original 27 direct curated YouTube entries (V74) and 17+17 historical inventory records still exist. The legacy video cards continue to be accessible as reference titles, but none navigates to the obsolete domain.
- New V96-D browser test checks the public navigation drawer, sign-in landing, simulation library and archival video UI, plus all unchanged resource counts, MCQs and academic-release protections.
- Existing V73 and V74 browser workflows re-run on the new HTML and revised legacy test. Student-visible link retirement does **not** mark any full Unit6 course, assessment, or teacher role as available.

## Next bounded PRs (not included here)
1. Student wording / teacher-only-public-route classification and explicit permission decisions.
2. Actual login-first design, Firestore rules, server-enforced account and class privacy, not merely navigation visibility.
3. Real MCQ report submission/admin inbox and mixed-unit attempt saving, tested independently.

**Decision gate:** Keep the PR a draft until its latest-head workflows are green. Once accepted, review the generated outbound-link inventory before concluding that *all* Google Sites entrypoints have been migrated.
