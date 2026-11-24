# V126 — Unit 3 40- and 80-MCQ summative practice shortcuts for Grade XI exam revision

## Verified prerequisite
Owner reported PR #225 merged and checked; GitHub confirms it merged into `main` on **24 November 2026** and the recorded pull-request workflow runs all succeeded. This V126 change is another small, isolated revision improvement ahead of the **7 December 2026** Physics examination.

## Existing student resources, not new question content
The Unit 3 Translatory Motion Learning Desk at `portal/unit-03.html` already links these two distinct **public, provisional, Unit 3-only summative** practice pages:

- `portal/unit-03-mcq-practice.html` — original Stage 1 **40-MCQ boxed self-practice**, 28 straight plus 12 scenario questions. Original adapted/source questions have an on-page explanatory practice key; five Unit 3 summative theory SLOs are covered. It is not an official 80-MCQ exam paper.
- `portal/unit-03-mcq-full80.html` — Stage 2 **80-MCQ boxed self-practice**, 56 straight plus 24 complete scenario questions, Section A **count and grouping only**. It is restricted to Unit 3 summative theory SLOs, not a whole-course FBISE examination. The practice explanations are also already on this page.

Both destinations were inspected in the actual repository. Their pages state that content is **provisional pending teacher review**, that the alternatives and solution keys are part of student self-practice, and that browser scores are not saved to My Physics Progress. A public self-check key is not a confidential exam answer key.

The central Test Builder has **220 provisional Unit 3 MCQs**, including **60 formative** momentum questions; its existing filter lets students select **Summative scope** for examination theory preparation. Do not equate the full unfiltered bank to all-summative exam content.

## Exactly one live navigation edit
In `portal/exam-quick-access.html`, under **Unit 3 → Exam-style MCQ practice**, retain the `../build-your-physics-test.html?unit=3` link, make its existing filter requirement clear in text, and append:

1. **Stage 1 — 40 boxed summative MCQs (provisional self-practice)** → `./unit-03-mcq-practice.html`
2. **Stage 2 — 80 boxed summative MCQs (Unit 3 only, not official)** → `./unit-03-mcq-full80.html`

These two existing pages include their own explanatory after-practice keys; no misleading claim of answer-free student access or teacher authentication is made.

The Exam Quick Access verified source-link inventory rises from **52 to 54**. All other unit routes and category filters remain unchanged. Unit 3 remains accessible without sign-in, while no private grade-save capability is added.

## Quality and preservation
- The inherited `scripts/test_grade11_exam_quick_access_v101a.cjs` now checks the **54** exact public resource links, both existing destinations' summative-only and pending-academic-QC warnings, and the three-link Unit 3 MCQ category at **390px** in the real Chromium responsive navigation regression. Original 1280px/320px and Unit4/5/6 validations remain.
- V126 Actions also reruns V119 three Unit6 links, V122 public Unit5 descriptive worked-solutions clarity, V121 original eight public worked-resource fingerprints, V118 six-unit exam-readiness baseline, V94D Unit6 signoff hold, and V99i answer-free **2,250** reporting reference inventory.
- No existing questions, options, answers, explanatory reasoning, scenario groupings, SLOs, mark schemes, source PDFs, public answer files or student activity saving are changed. The standalone 40- and 80-MCQ sheets are **existing** educational practice, not additional questions to add to the central bank.
- Public provisional MCQ reference distribution remains **275/206/220/640/349/560 = 2,250**. **560** Unit6 individual academic signoffs remain **PENDING**, course planned, and formal graded Unit6 assessment **not published**.
- No Firebase, App Check, authentication, user permissions, Copy-only report workflow, print watermark, logo or backend changes.

## Owner acceptance
Review draft PR #226 → **Files changed**: one Unit 3 HTML MCQ links group, the inherited source/Chromium test, one V126 source note and one dedicated Actions workflow. Keep the PR in **Draft** until all *latest-head* checks are green. If any fail, do not merge; share the check log/screenshot. When green, select **Ready for review → Merge pull request → Confirm merge**.

After GitHub Pages updates, open **Exam Quick Access → Unit 3 → MCQ practice**; verify the three entries (Test Builder with summative-filter reminder, 40-MCQ edition, 80-MCQ edition), both destinations open, and no claims of official exam certification.
