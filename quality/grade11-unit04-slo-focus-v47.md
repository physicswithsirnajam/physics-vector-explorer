# V47 — Unit 4 SLO-Focused Classroom Practice

**Physics with Sir Najam · Grade XI Physics · HSSC-I · PR #37**

**Scope:** one optional teacher-controlled filter for an existing **public, provisional 80-MCQ Unit 4** learning bank. Do not describe it as an official full-syllabus FBISE paper, teacher-secured key, examiner-certified answers or a recorded assessment.

## Purpose

Until V47, teachers could present the **full 80-question timed projector** or its **80 question/80 explicitly revealed solution discussion**. Short lessons on a single learning objective required manually locating each question and jumping through the full bank.

V47 adds `portal/unit-04-slo-focus.html`, a source-derived navigator of **12 summative theory SLOs**. Each card shows its available original question count, split of independent and scenario questions, and a cognitive-level breakdown. Each card links to:

- **Timed student slides:** the existing `unit-04-projector-practice.html?slo=P-11-B-07` style URL, with an SLO-filtered playlist and the same 50-second default, adaptive timing, pause, auto-advance and keyboard controls. Only selected questions and their original four unmarked answer options appear.
- **Post-test teacher discussions:** the existing `unit-04-discussion-slides.html?slo=P-11-B-07` style URL, with that identical selected playlist and the unchanged explicit **Question → Reveal worked solution** gating. Teacher discussion remains **public**, not a restricted service.

The **full 80-MCQ routes without a query string behave exactly as before**, and existing links remain valid.

## Source-based coverage (NOT official board ToS quotas)

| Unit 4 SLO | Original available MCQs | Independent | Scenario |
|---|---:|---:|---:|
| P-11-B-07 | 6 | 5 | 1 |
| P-11-B-08 | 8 | 7 | 1 |
| P-11-B-09 | 8 | 6 | 2 |
| P-11-B-10 | 5 | 3 | 2 |
| P-11-B-14 | 8 | 5 | 3 |
| P-11-B-15 | 8 | 5 | 3 |
| P-11-B-16 | 5 | 4 | 1 |
| P-11-B-17 | 6 | 3 | 3 |
| P-11-B-18 | 8 | 5 | 3 |
| P-11-B-19 | 6 | 4 | 2 |
| P-11-B-20 | 8 | 5 | 3 |
| P-11-B-21 | 4 | 4 | 0 |
| **TOTAL** | **80** | **56** | **24** |

These counts are generated from the original `question-bank/grade-11/unit-04-v39-80-practice.json`; the table is a source snapshot for review, not a hard-coded selection list used by the site. SLOs B-11 (formative) and adjacent B-12/B-13 are explicitly excluded.

## Critical safeguards

- **Original question numbers remain Q1–Q80**, even when a lesson contains only 4–8 items. The additional *focus 1/N* badge identifies the position in the shorter playlist.
- Every selected scenario-based question keeps its **entire shared stimulus**. An SLO filter may legitimately select just one or two questions from a four-question scenario when other questions map to other SLOs; it does not fabricate or omit the context.
- Invalid or unavailable `?slo=` values **do not silently become an 80-question practice session**. Page loading fails clearly and presentation controls stay disabled.
- Jumping to a question **outside the selected SLO** is rejected; SLO-filtered next/previous and final completion never enter an unrelated objective.
- **Student timed page:** still question-only; no correct-option markings, explanation, student answer collection, login or score recording.
- **Teacher discussion page:** only displays original-bank correct option, explanation, SLO, cognitive level and textbook reference after **deliberate Reveal**. Every navigation action to a new or same question resets the answer view.
- The official logo asset, banks, existing saved progress/accounts, Grade XI Units 1–3 and previous 80-mark student/teacher print assets are unchanged.

## Teacher walkthrough

1. Open **Unit 4 Learning Desk → Choose a Unit 4 SLO for Classroom Practice**.
2. Examine the 12 cards; select, for example, B-14 for centripetal-force calculations. Check the displayed count and cognitive mix.
3. Click **Timed student slides**. Confirm SLO badge, original Q-number labels and focused count. Run timed questions with students responding on a separate blank practice sheet. Full scenario contexts must stay visible.
4. After students finish, return to the SLO card and click **Teacher discussions**. Confirm every question starts unmarked, then explicitly reveal each source-bank explanation.
5. Try selecting an original Q-number outside the focused playlist; this should be rejected without switching SLO or exposing a different solution.
6. For full-paper practice or full discussions, use the **two full 80-MCQ links** at the top of the navigator.
7. Academic and physical projector review remains required before classroom approval; CI verifies source fidelity and interaction, **not independent correctness of the provisional physics key**.

## CI acceptance

`.github/workflows/validate-grade11-unit4-slo-focus-v47.yml` runs pinned Chromium on Ubuntu 24.04 and verifies:

- [ ] All 12 SLO cards/24 targeted links and live counts derive from the unchanged original bank.
- [ ] All **12 filtered timed playlists** contain precisely the original matching stems, four answer-option texts and full scenario passages, with no answer reveal.
- [ ] All **12 filtered discussion playlists** show identical question subsets and explicit, source-matching answer/explanation reveals; jumping back hides the key.
- [ ] Missing/invalid SLOs fail clearly; no student grade or response is submitted or persisted.
- [ ] Mobile navigator is within a 390px viewport; full-bank V45 and V46 flows, V43/V44 paper and key print, and earlier V39–V42 academic/resource checks still pass.
- [ ] Unit 4 catalogue has **18 public resources**, still a provisional practice status. Grade XI Unit 3 catalogue remains unchanged.

The CI run uploads desktop and mobile screenshot previews. Teacher must still inspect projector legibility, timing and mathematical explanations.
