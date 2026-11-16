# V59 — Import Grade XI Unit 5 original master topic MCQ banks

## Source and exact scope
- User's original Grade11_Physics_Unit5_Student_Master_Pack.docx (Grade XI NBF Work & Energy), same source reflected in saved PDF. Four topic MCQ banks of 80 items each: 56 straight + 24 scenario questions per topic (6 groups of four).
- Source totals: **320 topic MCQs**, **224 straight + 96 scenario** across **24 complete scenario sets**. Original question, four options, key and one-line explanations were extracted from the topic-specific source answer keys and matched structurally to original question rows.
- Three questions require source figures not yet incorporated as independent renderable question assets. HOLD: g11-u05-master-t51-q004, g11-u05-master-t52-q028, g11-u05-master-t52-q029. Do not silently invent or omit the diagrams within these questions.
- Published by V59: 317 newly imported provisional MCQs. Topic 5.1 Work 79; 5.2 Conservative and Non-Conservative Fields 78; 5.3 Kinetic Energy 80; 5.4 Work–Energy Principle 80.
- Of the 317 added: 221 straight and 96 scenario MCQs, with 24 complete four-question original situations.
- Preserve all **32 original V50/V51 public Unit 5 items** and their keys without change. Exact normalized stem+four-options comparison across older 32 and new 317 found **zero** identical items. Near-semantic duplicate review remains an independent teaching QA task.
- Unit 5 total becomes **349** provisional MCQs, **26** scenario sets (original 2 plus new 24).
- Five-unit Test Builder total becomes **990** MCQs: U1 275, U2 206, U3 80, U4 80, U5 349. No original U1–U4 question JSONs modified.

## Academic boundary and source fidelity
- Source topic SLO mapping is: 5.1 P-11-B-30 (Application), 5.2 P-11-B-31 (Understanding), 5.3 P-11-B-29 (Application), 5.4 P-11-B-32 (Application). Topic-to-SLO mapping is not independently verified item-by-item FBISE certification.
- Imported question difficulty is **Unspecified** because no verified per-question difficulty band exists in this master. Do not fabricate Foundation/Standard/Challenge.
- boardEligible=false and academicStatus=teacher-review pending. Source key matching and structural checks alone do not replace independent physics checking.
- Three 80-item assessment papers A/B/C in this master and end-of-unit exercise are *not* imported in this first batch. Compare/deduplicate these in later work. This is public ungraded self-practice, never a secure exam or private teacher-only key.

## Software changes
- New readable JSON: question-bank/grade-11/unit-05-master-topic-v59-317.json with source identity, 317 original question records, three hold IDs, and topic/scenario inventory.
- Extend shared/practice-bank-adapter-v55.js to retain and independently validate the existing 32 and new 317, correct SLO/source provenance and 26 complete sets. Source anomalies must fail closed.
- Update question-bank/manifest.json, portal/learning-catalog.json, Unit 5 Learning Desk, Test Builder, and student guide. Grouped/scenario-only tests preserve complete source situations, and the mixed-unit 5-unit Test Builder still supports all subsets and per-unit reporting.
- No Firebase, Firestore rules, private grades, user login, original logo, existing MCQs or prior user records changed. Cloud save remains Unit 1 or 2 individual self-practice only; Unit 5 and mixed results are printable but not saved to cloud.

## QA and merging
- New scripts/test_unit05_master_import_v59.cjs checks source inventory (320), imported data (317), 24 complete scenarios, 3 source-figure holds, old32 retained, total 990, options, keys and browser Unit5 question counts 20/40/60, 40-question scenario-only quiz, source context, no unauthorized cloud-save, mixed U1+3+5=704, 390px mobile.
- Updated V55/V56/V57/V58 tests preserve all existing Grade XI source and interactive student regression checks while respecting new question counts. New V59 workflow runs them in Chromium and uploads screenshots.
- All new and inherited GitHub Actions on final branch head must pass before merge. Human physics/checkpoint assessment accuracy, book-page and diagram checks remain open and must not be represented as complete.

## Following source imports
1. Unit 3 master Topic 3.1–3.4 straight/scenario banks, dedup against 80 already online and assessment alternatives, preserve source explanations.
2. Unit 4 complete topic banks and revised teacher keys, separate summative theory vs formative/PBA-only and include figures.
3. Unit5 textbook exercises and assessment A/B/C only after independent dedup and diagram recovery.
4. Units1/2 existing master counts 275/206 match online totals but require detailed completeness and scientific QA rather than assuming content identity.
5. Additional Test Builder topic/SLO filters and ongoing student UX improvement.
