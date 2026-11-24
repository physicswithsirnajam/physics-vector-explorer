# V130 — Preserve truthful Unit 6 topic-SLO status after MCQ test submission

**Prerequisite:** PR #229/V129 merged on 24 November 2026, and all **37 of 37** reported latest-head GitHub workflow runs completed successfully. This V130 step is an original-source-backed, narrowly scoped learner-facing accuracy follow-through before the 7 December 2026 Grade XI Physics exam.

## Confirmed source-level problem

V129 corrected the **during-test** Unit 6 MCQ badges to `Topic SLO candidates: ...`, `Provisional topic practice — not item-verified`, and `Item-level SLO not independently verified`. The same quiz's **post-submission** code in `practice-engine/index.html` remained unchanged:

- Each completed-test solution/review row printed `q.sloCodes.join(', ')` directly. All 560 original Unit 6 provisional records have **empty individual `sloCodes`**, with separate source `topicSloCodes`. Review rows therefore contained an empty SLO field even though original topic codes were available.
- The Learning-outcome breakdown displayed Unit 4's topic-level SLO caution but had no corresponding **Unit 6 explanation** for its empty individual mapped-SLO breakdown.
- Overall raw practice percentage and by-unit accuracy were already valid *as self-practice comparisons to the public provisional source keys*, not verified FBISE grades. Those calculations are unchanged.

This is a **UI/academic status wording** issue, not evidence that any specific Physics answer is wrong.

## Proposed narrow correction

In `practice-engine/index.html` only:

1. Reuse V129's existing `practiceSloTag(q)` and `practiceScopeTag(q)` on each completed-test review row. Unit 6 now shows existing **topic-level SLO candidates** and `Provisional topic practice — not item-verified`, never a blank mapped-SLO field or the false `Summative theory` title.
2. Add a short `Unit 6 topic-level SLO caution` under the existing Learning-outcome breakdown. Explain that item-level SLO/cognitive classifications are not independently verified, and no certified Unit6 per-SLO performance analysis is possible. Show this note only when the submitted practice test actually contains one or more `summative-topic-provisional` items. For Unit 2-only and other fully mapped-only sessions, keep it hidden.
3. Preserve **Unit 4's original note and conditions** separately. Leave `sloStats` tally logic and actual total/practice score, source `sloCodes`, original `topicSloCodes`, individual answer review, printable report, feedback control and issue-report copy-only workflow unchanged.

## Actual student journey QA (browser, not merely source scan)

New local Chromium `scripts/test_grade11_v130_unit6_results_review_browser.cjs` runs **four real completed student-practice journeys**: Unit 6 and Unit 2 at desktop 1280px and phone 390px. It clicks Start and Submit, accepts the unanswered-questions confirmation, and inspects the completed Results and question-by-question solutions screen.

Unit6 assertions: four original question references, original source topic candidate codes, explicit provisional classification, visible academic caution, zero invented verified per-item SLO tallies. Unit2 assertions: existing summative labels and SLO tally remain visible, Unit6 caution hidden. Both: no horizontal overflow or JavaScript errors, existing self-practice status, no test/answer data in CI JSON artifact.

**Limitation:** Four submitted-test journeys sample actual source items but cannot certify all 2,250 public MCQ browser layouts or mathematical correctness. Existing V129 nine pre-submit UI journeys and the V128 2,250-item structural check remain independent.

## Integrity and release conditions

- No changes to source question JSON/B64, original stems/options, correct letters, explanations, NBF figures, SLO mappings, item signoffs, student Firebase records, credentials, issue-report delivery, saved grades, logos or printable PDF watermarks.
- Grade XI public provisional MCQ counts remain **275/206/220/640/349/560 = 2,250**.
- All **560** Unit6 individual academic signoffs remain **PENDING**, **65** teacher issue register entries remain recorded, full course `planned`, graded assessment `not-published`.
- Public worked answer keys remain accessible after practice (not confidential teacher authorization), Cloud saving remains only on eligible individual Unit1–2 practice attempts; the reporting button stays **Copy only**.
- V130 CI reruns V129 pre-submit browser smoke, V128 structural/QC scan, V99i signed answer-free IDs, V94D Unit6 nonrelease, and V118 Copy-only/result-saving limits.

## Acceptance

Review PR #230 → four files: **one** practice result UI, **one** new submitted-result Chromium test, this teacher rationale, **one** new V130 Actions workflow. Keep Draft until all latest-head workflows are green. Do not merge on red: share the failed job output, then amend *this branch*. After merge and Pages deploy, launch four-question Unit 6 public practice, submit even if you have unanswered items, and inspect both the Unit6 caution and each review row. Contrast with a Unit2 summative test, which should keep its original per-item SLO and tally.

**Technical green != scientific or FBISE examination signoff.** The next topic should be an owner-original-source comparison for an identified real numerical/answer issue, or a teacher-requested browser scientific notation correction.
