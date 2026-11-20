# V91 — Unit 6 six-held-MCQ original source figure verification desk

## Purpose, scope and evidence gate
V90 PR #80 is confirmed merged into `main`, with a four-figure **original concept-study gallery**, not textbook reproductions. V90 preserved all six figure holds, and Grade XI central Test Builder remains at **2,244 provisional public MCQs**: 1,690 Units 1–5; 554 active Unit 6 source MCQs from 560 originals; six previously held items.

V91 provides a **browser-only source comparison worksheet** so a teacher can examine each archived MCQ against NBF **original printed textbook Figures 6.2 (p.90), 6.3 (p.92), 6.5(c) (p.94), and 6.6 (p.95)**, then copy a recommendation and specific observations into our review conversation. It must not be mistaken for automatic release or official staff authorization. The printed textbook's **actual figure pixels have not been directly visually checked** by our tooling, because the public ~55 MB source PDF exceeded the PDF screenshot service's file-size limit, and local download access is unavailable. We verified relevant PDF text-extraction descriptions and physics only. No claim of teacher signoff has been made.

### Exact six archival records (source key only, not certified board key)

| Source item | Original figure | Source key | Status in V91 |
|---|---|---|---|
| XI-U06-T61-MCQ-0011 | 6.2 bottom pressure on cylinder | C | HELD |
| XI-U06-T62-MCQ-0026 | 6.3 geese V formation | D | HELD |
| XI-U06-T62-MCQ-0064 | 6.5(c) horizontal paratrooper-speed graph | A | HELD |
| XI-U06-T62-MCQ-0072 | 6.3 geese V formation | D | HELD |
| XI-U06-T63-MCQ-0024 | 6.6(a)/(b) streamline/turbulent comparison | B | HELD |
| XI-U06-T63-MCQ-0080 | 6.6(a)/(b) streamline/turbulent comparison | B | HELD |

Original archived `grade-11/unit-06-topic-61-v76-80-source.json`, `...topic-62-v78-80-source.json` and `...topic-63-v80-80-source.json` remain **untouched**. The dynamic worksheet loads each of these directly and fails closed if any original held ID, source bank metadata, answer letter, item-level SLO / cognitive guard or `active:false` status deviates. It does not edit, duplicate or reconstruct the source text or A–D options.

## Browser workflow
- New public page `portal/unit-06-figure-verification-v91.html` and script `portal/unit-06-figure-verification-v91.js`, linked from the Learning Hub and V90 gallery.
- Present six source questions grouped under four figure references, original question stems and A–D options, plus **collapsible teacher-study answer letters and explanations**.
- For each question provide three **explicit manual checks**: actual original printed figure viewed, orientation/labels/axes verified against stem, and original source answer independently supported.
- Review recommendation is **Not reviewed**, **Keep held**, or **Candidate for separate teacher signoff (still held)**. Last option is rejected unless all three checkboxes are checked and specific notes contain >=15 characters. This is a **UI completeness gate**, not a scientific or teacher approval.
- Build copyable plain-text local record covering all six source questions, original keys, check statuses and notes; one copy-to-clipboard button and print function. `window.print()` is a local browser action. Closing the page discards the record; there is **no `localStorage`, `sessionStorage`, IndexedDB, Firebase, Firestore, school cloud grade, reviewer identity collection or external network request**. Public static source banks remain public as before.
- No front-end button publishes source edits, merges GitHub, certifies per-question FBISE SLOs, or changes active flags.

## V91 invariants
Unit6 = **79 + 77 + 78 + 80 + 80 + 80 + 80 = 554 active** from 560 source originals, six held, 133 individually situation-labelled, zero genuine shared-stimulus groups, Unit6 whole-course status still `planned`, and Grade XI total **2,244**. `boardEligible:false`, `sloCodes:[]`, cognitive `Unspecified` and `stimulusSetId:null` for held items. No private original source textbook, diagram photograph, master owner PDF/DOCX, authentication, payment, grades or student history exposed.

## Merge checklist
**Do not merge PR until all checks on its latest head are green.** Dedicated CI validates original held source keys, 6 records, 24 A–D options, local-only controls, incomplete checklist cannot mark a candidate, evidence-rich recommendation remains HELD, copy record behavior, 390px mobile viewport, no third-party requests, and regressions from V89/V90. After merge, manually use the Learning Hub link and submit a copied evidence record only once the **printed book figures** have actually been examined.

## V92 decision
A later V92 change may unlock **only individually signed-off items**, and must:
1. Compare **actual textbook artwork**, not V90 redraw alone.
2. Validate stem/answer alignment and any necessary corrections explicitly; do not alter original source archival text silently.
3. Add source-locked public caption/accessible figure context where the original stem references an illustration, or keep the item held if image context is unavailable.
4. Recompute each individual topic preview's active count, central totals, prior holds and regression tests. Never fabricate common-stimulus groups or board-certified item-level SLO/cognitive tags.
