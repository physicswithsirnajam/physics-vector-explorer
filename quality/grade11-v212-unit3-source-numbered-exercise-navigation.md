# V212 · Grade XI Unit 3 source-numbered worked-example and numerical exercise navigation

## What actually exists
Source: latest repo `portal/verified-textbook-index-v103.json` and existing HTML study/numerical pages, plus Unit3 learning catalogue and V103 finder browser test.
- **Three separately numbered worked examples** (3.1, 3.2, 3.5) already linked to `unit-03-study-guide.html` at their anchor IDs. They are **public study adaptations**; the full set of every textbook in-chapter example has **not** been certified complete.
- **Eight numbered numerical exercises** (3.1–3.8) already in `unit-03-numericals.html`; their labels link to existing dynamically rendered question anchors and the existing V103 browser checks validate navigating to at least 3.6.
- The eight numerical source records include **six summative, one formative (3.6), and one supplementary-formative (3.8)**. Preserve distinction; do not represent all eight as board-summative.
- Existing separate teacher-authored descriptive practice paper is **40 marks, Sections B/C**, not an end-of-unit textbook question-number index; do **not** relabel it or claim original NBF short/extended question coverage.
- Original textbook end-of-unit MCQs, short response, comprehensive, assignments and complete example listing still need NBF page-image reconciliation and per-item source mapping.

## Proposed change
- Unit 3 PRACTISE drawer: two prefiltered shortcuts to the **existing** public V103 textbook finder (`?unit=3&kind=textbook-example` and `?unit=3&kind=textbook-numerical`), not duplicate questions.
- Unit 3 PREPARE drawer: concise source-status statement distinguishing the existing teacher practice paper and the unmapped original end-of-unit exercise categories.
- Unit3 learning desk: single finder card, with explicit links, counts, adaptations, and pending source/teacher signoff. Source boundary paragraph distinguishes classroom paper from original textbook end questions.
- Do not modify original 2,250 current Units1–6 MCQ identities, keys or explanations; the 220 Unit3 questions, six+two existing numerical SLO classification, 59 resource catalogue records and unscored Unit7 status all remain unchanged.

## QA
V212 Node/Chromium checks three worked-example anchors and eight numerical record references, catalogue and MCQ invariants, Unit3 stage discovery, 3/8 filtered destination counts, desktop width 1280 and mobile widths 390/320, no horizontal overflow; reruns original V103, V211 and V140 browser tests.

**Scientific and academic caveat:** A green browser CI verifies link functionality, not mathematical accuracy of all source answers or independent teacher approval. Original NBF print-page images for Unit3 are still required before certifying question-to-source fidelity.

## Owner
Leave draft until every current-head Actions check is green. Then inspect five changed files, Ready for review → Merge pull request → Confirm merge. Test Unit3 Learning Desk → Finders and Units & Resources → Unit3 → PRACTISE for Examples/Numericals; inspect source-status note under PREPARE.
