# V116 — Teacher-approved Topic 6.5 Bernoulli Q55/Q56 safe practice overlay

**Explicit teacher authorization received 23 November 2026 after PR #215/V115 teacher review.** Treat the original Q55 and Q56 differently from their proposed clarified practice forms, keep original source answer letters **B/B**, prevent originals from being selected in every live quiz/Test Builder, and leave the entire Unit 6 academic review and exam certification pending. The original teacher-review PR merge by itself had not authorized student updates; the owner subsequently expressly approved them.

## Original bank and approved scientific meaning

The **80-question** `question-bank/grade-11/unit-06-topic-65-v84-80-source.json` archive remains **byte-for-byte unchanged** with Git blob SHA `f5a7dd0a29d5e90842c0ef557071aebc10a70baf`. It retains original Q55 (`XI-U06-T65-MCQ-0055`) and Q56 (`XI-U06-T65-MCQ-0056`), including the originally abbreviated problem statements and original B/B keys. Previous V95-C2S source-audit and original prepared-master context remain reproducible. The exact clarified stems and explanations are from the completed, now expressly authorized V115 teacher-only proposal file.

| Prepared-source record | Separate public practice ID | Clarified physical interpretation | Original option and answer |
|---|---|---|---|
| **Q55** | `XI-U06-T65-MCQ-0055-V116` | Ideal horizontal flow along same streamline to a **local stagnation point**, velocity 4 → 0 m/s; density 1000 kg/m³; negligible losses | **B — 8 kPa rise** |
| **Q56** | `XI-U06-T65-MCQ-0056-V116` | A **very large reservoir** with negligible local starting velocity supplying a horizontal downstream duct at 10 m/s, same-elevation lossless streamline, no assumed atmospheric free-jet outlet | **B — 50 kPa** |

The new questions maintain the **exact original four A/B/C/D option texts and correct letters**, with revised stems and explanations only. The source B/B values are valid **in these explicitly stated idealized models**. Q55's local stagnation does not imply zero flow through an entire pipe. Q56's reservoir speed need not equal zero across a finite pipe inlet, and the duct pressure is not asserted as an atmospheric free-jet exit. This is a scientific-clarity correction **for provisional learning use**, not individual FBISE Summative/SLO/K/U/A or exam certification.

**Independent physics:** Q55 has `ΔP = ½ρ(4²−0²) = 8000 Pa = 8 kPa`. Q56 has `P₂ ≈ 100000 Pa + ½ρ(0²−10²) = 50000 Pa = 50 kPa`. Original private NBF/teacher source scans are not republished.

## Chained, independently versioned overlays — no silent rewriting

- **V111 Topic 6.4**, four corrected/clarified practice items (Q28/Q51/Q52/Q67), remains unchanged.
- **V114 Topic 6.5**, three clarified Q61/Q67/Q78 practice items, remains unchanged at source blob SHA `701ac8e6daa4c2d7fdfc60671c3d8219626dd061`.
- **New V116 Topic 6.5** overlay, `question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json`, holds exactly two Q55/Q56 replacements with `-V116` identifiers. The original source and all original historical keys remain inspectable by instructors.

The shared `applyUnit6Topic65StagnationPracticeOverlay` helper is invoked **only after** validated original V84 and V114 transformation. It enforces the original B/B letters, exact source stems, approved four options, the required local stagnation/reservoir wording, previous V114 IDs, a unique 80-item Topic 6.5 practice set, `boardEligible:false`, `sloCodes:[]`, `cognitiveLevel:'Unspecified'`, and all public-self-practice-only flags. It **rejects** missing, tampered or incorrectly ordered overlays and won't fall back to ambiguous originals.

All four public student entrypoints use both protections and cache-busted V116 adapters:

1. `portal/unit-06-topic-65-preview.html` — topic-level 80-item quiz; source → V114 → V116, then only the corrected practice set.
2. `portal/unit-06-balanced-mcq-v95c1.html` — seven-topic 28/35/42/56-item balanced quiz; uses V111 Topic 6.4, then Topic 6.5 V114 → V116.
3. `build-your-physics-test.html` — central shared adapter yields 560 provisional Unit 6 MCQs.
4. `practice-engine/index.html` — same 560-item safe central pool.

All **five** ambiguous original Topic 6.5 practice IDs (Q55, Q56, Q61, Q67, Q78) are excluded from quizzes; their public raw source archive still exists for provenance. No new student items are added to counts.

## Public question-reference reports

The metadata-only allowlist is extended for **only** the exact V116 overlay filename. The signed `server/review-manifests/grade11-approved-public-review-refs-v99i.json` is regenerated: exactly two reporting IDs now end in `-V116`, the three existing `-V114` IDs remain unchanged, the four `V111` source-related IDs remain unchanged, and the **2,250 total** Grade XI public-reference inventory remains intact. No question stems, answer keys or user data are exposed in this ID-only catalog. The full course remains planned.

## Official-academic and print nonrelease locks

- Original Topic 6.5 source **80**, Unit 6 practice **560** and total Grade XI public references **2,250**, including **136 independent scenario questions and no invented shared-stimulus groups**, remain unchanged.
- **All 560 individual teacher-approval queue entries stay PENDING**, including original printed source verification, scientific-key certification, independent FBISE summative/formative SLO mapping, cognitive level and teacher signoff. Teacher approval of *provisional wording* does not award them board eligibility.
- `portal/learning-catalog.json`: Unit 6 remains `planned`, graded assessment `not-published`; original V94D formal `releaseApproved:false`.
- Existing V112 native exponent/superscript display and universal printed-PDF repeated diagonal **Physics with Sir Najam** watermark remain unchanged. The V116 CI checks the watermark on **every actual browser-generated A4 PDF page even with background graphics OFF**.
- No private scans, source-bank rewrite, new Firebase rules, App Check enforcement, personal student records, official certificates, logo, payment or grading change.

## Regression and owner verification after all latest-head CI green

GitHub Actions exercises the exact original V84 Git SHA, full V115 teacher proposal, source B/B keys, independent science, all five blocked Topic 6.5 originals, the four V111 and three V114 earlier fixes, every user-facing quiz entrypoint, 560/2,250 stable counts, report-reference signature, all PENDING course flags, 1280/390/320px real Chromium, actual all-80 Topic 6.5 self-practice and **multi-page PDF**, missing-overlay fail-closed tests, plus V111/V114/V112 full regressions, V84/V95-C2S original audits, V98Q mixed-unit scored quiz, V95-C1 balanced and V79–V89 historical central QA.

After merging, allow GitHub Pages deployment to complete. Open **Unit 6 Topic 6.5 Practice**, choose **All Questions**, finish and accept the unanswered-answer QA confirmation, then verify **Q55 and Q56 show “V116 clarified variant”**, Q61/Q67/Q78 still show **V114**, all keys unchanged and the review-PDF watermark repeats across pages. Verify the balanced Unit 6 quiz and central Test Builder still serve 560. The next teacher-review work concerns remaining Topic 6.5 scope/classification notes and subsequently Topic 6.6/6.7, before any official individual-item FBISE certification.
