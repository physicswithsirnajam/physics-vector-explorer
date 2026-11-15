# PR #40 · V50 — Grade XI Unit 5: First Original 16-MCQ Summative Practice Pilot

**Physics with Sir Najam · NBF Work and Energy · Scope: source-aligned, ungraded, teacher-review-pending mini-practice**

## Primary academic sources

- **NBF Grade XI Physics**, Unit 5 *Work and Energy*, original printed **pp.77–87**, visually examined from the user's supplied scan, including pp.85–87 chapter exercises.
- **Supplied official FBISE Grade XI Physics HSSC-I Assessment Framework and Model Paper** (National Curriculum 2022–23 / Inclusive Scheme 2024), specifically PDF **page 11**, official framework table **p.5**. It verifies four Unit 5 summative theory outcomes and parent cognitive levels.
- **Official FBISE HSSC-I boxed MCQ layout**, PDF page **30**, with a question column, four A/B/C/D option boxes and separate unfilled A/B/C/D answer circles. This design is retained by default in printed practice, but the mini-practice does not claim to be a whole-grade official paper.

**Scope limitation:** original Unit 5 source-based practice content, **not a verbatim reproduction** of the NBF textbook's exercises and **not** the 80-MCQ HSSC-I full-syllabus examination. Separate practical/PBA source is still needed for PBA determination.

## Practice inventory

- **16 original newly authored MCQs**, worth **0.5 mark each = 8 practice marks**.
- **12 independent** MCQs (Q1–Q12) and **four scenario** MCQs (Q13–Q16) under one complete shared trolley stimulus. This is a mini-practice; the whole-grade official exam has 56 independent and 24 contextual MCQs across six scenarios, but these quotas are **not imposed** on a small Unit 5-only set.
- **4 items per verified summative theory SLO**:
  - **P-11-B-29**: kinetic-energy derivation and its correct application (Application; textbook pp.81–82).
  - **P-11-B-30**: signed work from force–displacement graphs (Application; textbook pp.79–80).
  - **P-11-B-31**: path-independent gravity vs path-dependent dissipative forces (Understanding; textbook p.81).
  - **P-11-B-32**: work–energy theorem with opposition, correct net work and stopping distance (Application; textbook pp.82–83).
- **Key balance: A=4, B=4, C=4, D=4**, while options are arranged so choices are not easily inferred from the question order.

## Question and independent numeric QC map

| Q | Official theory SLO | Answer | Physics verification / expected outcome |
|---|---|---|---|
| 1 | B-29 | C | Wnet=mad, ad=(v²−u²)/2, hence Wnet=½m(v²−u²) |
| 2 | B-29 | A | ½×2×6² = 36 J |
| 3 | B-29 | D | Motion equation rearranges to ad=(v²−u²)/2 |
| 4 | B-30 | B | Linear graph signed trapezoid (2+10)/2 × 4 = 24 J |
| 5 | B-30 | C | Below-axis graph (−3)×5 = −15 J |
| 6 | B-30 | A | Piecewise signed work 8×2 − 4×3 = 4 J |
| 7 | B-31 | D | Conservative gravity does equal work for equal endpoints regardless of path |
| 8 | B-31 | B | Friction −3×2 = −6 J versus −3×5 = −15 J |
| 9 | B-31 | A | Gravity work on closed route returning to same height = 0 J |
| 10 | B-32 | C | ΔK=(18−5)×3 = 39 J |
| 11 | B-32 | B | 2kg start from rest: Wnet=(12−2)×5=50 J; v=√50≈7.07m/s |
| 12 | B-32 | D | Initial K=8 J, friction=8N; stopping displacement = 1m; 3m unreachable |
| 13 | B-29 | B | Shared trolley: initial K=½×2×2² = 4 J |
| 14 | B-30 | D | Shared trolley: Fnet=10−3=7N; area under graph 7×4=28J |
| 15 | B-31 | C | Constant opposing resistance does path-dependent dissipative work |
| 16 | B-32 | A | Shared trolley: Kfinal=4+28=32J, v=√32≈5.66m/s |

For every numerical item, the automated test **recomputes the arithmetic independently** and checks that the keyed option text agrees with the calculation. For reasoning-based concepts and distractors, final human teacher review is still required; numerical correctness alone does not establish examiner certification.

## Student vs teacher boundary

**Student resource:** `portal/unit-05-mcq-practice.html`, powered **only** by `question-bank/grade-11/unit-05-v50-16-student.json`. The student JSON contains **no correctOptionId, workedSteps or explanation fields**. It displays the 16 original stems/options in the official-style ten-column boxed layout and 64 initially blank answer bubbles. Learners can select a circle on-screen; these choices live only in JavaScript memory and disappear on reload. Student can print/save an A4 landscape copy. No grading, answer checking, account writes or data transmission.

**Teacher resource:** `portal/unit-05-mcq-key.html` and separately stored `question-bank/grade-11/unit-05-v50-16-teacher-key.json`. The teacher page must be opened **after practice** and requires explicit **Reveal teacher solutions**; all keyed answer text and three-step reasoning is rendered only at that point. **Hide solutions removes answer-bearing DOM nodes.** The teacher page is **PUBLIC** and the source JSON can be fetched directly; this is a presentation separation, **NOT password security or an access-control barrier**.

## Existing resources and metadata

- The Unit 5 public catalogue grows **from four to six resources**; questionBankCount becomes **16**, assessmentStatus becomes `provisional-ungraded-16-mcq-mini-practice-teacher-review-pending`.
- Source/FBISE theory audit remains verified. Practical/PBA separate list and newer online framework status remain unverified; the official paper remains a **full-grade** multi-unit 80-mark assessment format.
- **No** full Unit 5 80-MCQ paper, formal 7×4/2×6 descriptive paper, scannable OMR, protected exam, recorded student scores or board-certified solutions are published. 16 questions are a classroom pilot, not final school-grade assessment.
- Unit 4's 18 learning resources, 80 original MCQs, 80-mark combined paper and all its timed/projector/discussion tools are not modified. Earlier units and exact official logo image remain unaltered.

## Automated and teacher acceptance

Dedicated V50 Playwright/Chromium CI checks:

- [ ] 16 question texts and all 64 original options exactly match the student bank, with **zero answers** fetched or visible in the student browser.
- [ ] All four official SLOs have four items; correct options exactly match manual independent expectations and letter balance A/B/C/D=4 each.
- [ ] Single original context and all four scenario questions appear together, with original Q13–Q16 numbers.
- [ ] Every numeric option/key agreement recomputed independently, correct units and stopping-distance reachability.
- [ ] Digital answer bubbles can mark, change, clear and update progress without any storage or grade writes.
- [ ] Print media hides navigation/controls, fits boxed table to A4 landscape; on 390px phones, the boxed table scrolls **locally** without widening the whole page.
- [ ] Teacher page starts with **zero answers in DOM**, reveals all 16 and matches every original stem, keyed correct option, explanatory step, SLO, cognitive level, printed page, then removes all solutions when hidden.
- [ ] Full prior V48 live physics lab and V49 source audit plus existing Unit 4 source tests pass.
- [ ] Screenshot artifacts available for review.

**Manual teacher signoff still needed:** calculate all numericals without using the answer key, review every distractor for exactly one defensibly correct answer, confirm B-31 Understanding-level suitability and B-29 derivation focus, check scenario wording and correct significant figures, compare with NBF pp.77–87 and official FBISE p.11, and physically inspect A4 print and laptop/projector/mobile layout.

## Natural next PR

After successful teacher review of this pilot: extend Unit 5 source-checked MCQ coverage in batches and build short/extended response practice, keeping the student question sheet and public post-practice solutions separate; scale toward official-style whole-grade assessment only with sufficient summative SLO coverage.
