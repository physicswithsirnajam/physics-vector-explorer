# V145 — Grade XI Unit 7: source-anchored first-topic learning introduction and source inventory

## Verified prerequisite and original catalog state

PR **#244/V144** was merged with **2/2 latest-head checks green** on 24 November 2026. The local-only classroom security foundation now covers admin-provisioned teacher roles, draft classes, independently assigned rosters, and read-only teacher-specific views; **none are activated in production**.

The existing Grade XI course catalogue contains **14 unit records**. Units 1–5 are marked available, Unit 6 is a provisional public practice preview, and **Unit 7 Physics of Solids remains planned** with **zero published MCQ questions**, **zero resourceIds**, two existing public simulation mappings and two supplementary concept-video records under the existing legacy resources directory. The full Grade XI original public provisional bank still contains **2,250 MCQs across Units 1–6 (275/206/220/640/349/560)**.

The owner's priority is **rapidly preparing Units 7–10 for examinations beginning 7 December**, then launching Grade IX. The next useful step is a small *actual public educational contribution* to Unit 7 while protecting all future scored assessments from premature publication.

## User's existing teacher-prepared Unit 7 resources identified

The following prior Library resources were directly located and opened during this PR preparation, **not** merely inferred from earlier conversations. They are previously drafted student/teacher files; they have **not** been imported or republished through this PR.

| Original teacher-prepared resource | Count / coverage | Release status |
|---|---:|---|
| `Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.pdf` and student-practice edition | 80 original teacher-developed MCQs, NBF pp. 113–116, FBISE P-11-B-22 | Requires original-content/item-by-item verification before import |
| `Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx` and student-practice edition | 80 teacher-developed MCQs, deformation in solids, NBF pp. 116–122 | Requires source/key validation and explicit SLO mapping |
| `Grade11_Unit7_Topic7.1_PartB_SLO_QA_Solved.pdf` and questions-only edition | 48 SLO-based questions; Topic 7.1 | Prepared; needs portal formatting and teacher QC |
| `Grade11_Unit7_Topic7.2_PartB_SLO_QA_Solved.pdf` and questions-only edition | 56 SLO-based questions; Topic 7.2 | Prepared; needs portal formatting and teacher QC |
| `Grade11_Unit7_EndOfUnit_11ShortQuestions_Student_Practice.pdf` with solved edition | 11 textbook-numbered short questions; pp. 125–126 | Prepared; requires individual check |
| `Grade11_Unit7_EndOfUnit_8Comprehensive_Student_Practice.pdf` with solved edition | 8 textbook-numbered extended questions; p. 126 | Prepared; requires individual check |
| `Grade11_Unit7_EndOfUnit_5NumericalProblems_Solved.pdf` | 5 original-textbook numerical problems; p. 126 | Prepared; check mathematical/printed-hint discrepancies before student release |
| `Grade11_Unit7_Topic7.3_PartC_Derivations_Formulae.pdf` | Elastic potential energy, NBF pp. 122–124 | Prepared; requires comparison and teacher signoff |
| Grade XI formative-SLO cross-reference and other topic-specific Unit 7 documents | Unit 7 has no separately designated formative theory SLO in the supplied teacher cross-reference | Confirm directly against official assessment framework for final publication |

**Important numerical quality watch items from the user's already prepared solved document:** The Unit 7 numerical 7.1 solution identifies an additional *shear modulus* assumption that is not supplied by the printed Young's modulus alone. Numerical 7.3 notes that its printed brass modulus and printed answer hints apparently do not agree. These are **source-authored review findings, not corrections approved against original NBF printed source pages**. Do not silently replace the given values or reproduce potentially false certainty in the student MCQ bank; bring these to teacher review when importing numerical practice.

The uploaded 292-page NBF PDF has visibly garbled machine-extracted text around Unit 7 (likely page-image/watermark parsing); the teacher-prepared notes provide a useful **secondary** source outline. The current PR therefore **does not claim a complete line-by-line verification against the original scanned textbook or official framework**. Original page images must still be visually checked before assessment release.

## Student-visible improvement

Add `portal/unit-07-learning-intro-v145.html`, styled in the established dark-navy/gold Physics with Sir Najam identity with the **existing unchanged official logo** and the global V140 unit-aware resource drawer.

The page contains:

- Topic **7.1 · Classification of Solids**, NBF pp. **113–116**, summative FBISE SLO **P-11-B-22**.
- Carefully marked teacher-prepared concept orientation: crystalline/polycrystalline/amorphous classification, lattice and unit cells, SC/BCC/FCC structural descriptions, anisotropy, X-ray diffraction, and polymer-vs-polycrystalline distinction.
- A concise scientific comparison table and **four optional self-check questions with collapsible explanatory responses**. These are **not scored** and do not count as original end-of-unit or approved MCQ tests.
- Teacher-prepared content progression to **7.2 Deformation in Solids**, **7.3 Elastic Potential Energy**, and end-of-unit short/comprehensive/numerical exercises, all clearly marked as *awaiting further verification*.
- Existing public enrichment links: **two Unit 7 simulations** and **additional external concept-video references** from the existing portal. Official Physics with Sir Najam YouTube originals remain the primary videos when independently published and verified.
- An explicit statement that the **complete Unit 7 course and scored MCQ bank remain unpublished**, and no official graded assessment is available for Unit 7.

The page does **not** upload/republish the owner's original PDF files, assign made-up answers, introduce new MCQs, enable scored tests, or expose teacher-only QC notes.

## Source-driven public sidebar and catalog

Update only Unit 7's existing catalog record with `learningPreviewHref` and a narrowly scoped `learningPreviewStatus='public-topic-7.1-introduction-only'`, revised truthful summary and student notice. **Keep** `status='planned'`, `assessmentStatus='not-published'`, `questionBankCount=0`, `resourceIds=[]`, simulation mappings, and all 59 global resource entries unchanged.

Extend the existing `comingSoon()` sidebar renderer to show the verified **Unit 7 Topic 7.1 Learning Introduction** alongside the existing public Unit 7 simulations. This is a carefully scoped introductory link **inside the planned-unit group**, not a 7th fully active unit. Opening the sidebar on the Unit 7 introductory page expands the **Next units · 7–10** area and highlights the correct current URL. All other planned units and legacy V140 navigation remain intact.

## QA and academic release safeguards

`scripts/test_grade11_v145_unit7_source_intro_browser.cjs` checks original source counts, 14 unit records, zero Unit 7 bank/graded release, 59 unchanged catalog resources, exact SLO and printed-page labels, all four accessible disclosure questions, no false Unit7 Test Builder link, existing local simulation/video destinations, unit-aware planned group, active-link marker, Escape, 1280px/390px/320px and no horizontal overflow or runtime exceptions.

The test captures **three screenshots of public, answer-free concept orientation**, and a JSON of metadata-only pass/fail status. CI also reruns existing V140 sidebar browser test, V99i 2250 question-ID guard, V94D 560 pending Unit6 teacher-signoff gate, and V118 six-unit readiness/public links. **No Firebase Auth, Security Rules, student data, answer keys or original question-bank JSON/B64 is changed.**

## Next short Unit 7 milestones

1. Review the exact NBF printed pp. 113–126 page images and official FBISE Unit 7 SLO wording; audit the pre-existing Topic 7.1 eighty boxed MCQs **question-by-question** for options, key, explanation, SLO and cognitive level, then import approved items in a separate isolated provisional public practice PR.
2. Audit/import Topic 7.2 eighty MCQs, followed by Topic 7.3 sources; supply student-facing SLO notes, formula cards, solved examples, short/extended responses and original textbook numerical practice.
3. Do not publish the prepared numerical answers before investigating the identified **7.1 modulus assumption** and **7.3 printed-data discrepancy**. No unverified Physics answer should be silently corrected.
4. Complete verified Unit 7 lessons, videos and simulation mapping, then repeat efficient incremental work for **Units 8–10**, before the next Grade IX expansion.
5. Continue teacher backend security work separately; local-only V144 is not yet a deployable live teacher dashboard.

## Owner merge instructions

PR **#245/V145** must remain Draft until every latest-head check passes. Review **six files** (new public introductory HTML, catalog metadata, navigation, new browser test, this note and Actions workflow). **Do not merge** on a red/pending check; fix the same branch. Once green: **Ready for review → Merge pull request → Confirm merge**. After Pages deployment, open the Unit 7 preview from the **Next units · 7–10** sidebar on both desktop and phone; confirm the course is still labelled *planned* and there is **no scored Unit 7 MCQ bank**.
