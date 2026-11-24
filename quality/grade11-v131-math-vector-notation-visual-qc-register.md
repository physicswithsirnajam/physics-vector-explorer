# V131 — Grade XI scientific notation and vector-symbol visual-QC candidate register

## Why this is the next step

PR **#230/V130** was merged and reviewed on **24 November 2026**, with **38/38** latest-head GitHub Actions checks successful. It made Unit 6 provisional SLO status consistent in both quiz and submitted-test review. The earlier **V128** read-only 2,250-item scan identified **zero** duplicate options / replacement glyphs / square-box placeholders / unresolved template tokens in original public sources. That was useful but too narrow to exclude problems with rendered vector arrows, TeX syntax, exponent notation and HTML/MathML.

The teacher previously observed **boxes instead of vector-arrow notation above letters** in a student-facing Physics resource. Such problems require a different kind of inspection from whether the answer A/B/C/D exists. A source string may be valid text but render unreadably in some fonts/browsers, and a diagram may need actual browser/page inspection. This new step does **not** assert it has identified a specific broken question.

## Scope — read-only and answer-free

New `scripts/audit_grade11_math_notation_v131.cjs` locally loads the same **trusted original checked-in V55 public Grade XI MCQ adapter** and matches each of the **2,250** original published *provisional practice* MCQs to the original signed answer-free V99i source catalog:

| Unit | Original public MCQ count |
|---|---:|
| 1 | 275 |
| 2 | 206 |
| 3 | 220 |
| 4 | 640 |
| 5 | 349 |
| 6 | 560 |
| **Total** | **2,250** |

It reviews available source fields for **stems, option texts, explanations, stimulus and their optional safe rich-text counterparts**. Source fields are scanned **in memory only**. It records potential visual-QC *candidates* when it encounters:
- literal LaTeX command forms, such as backslash-vector, fraction, square-root or Greek-letter commands;
- raw TeX/math delimiters, especially where a plain-text viewer might show them literally;
- Unicode **combining vector arrow** (U+20D7), combining overline (U+0305) and related overhead arrows, which need font/positioning validation;
- raw HTML math-like elements, encoded mathematical HTML entities, and ASCII caret-power notation that should be visually checked against the intended formatter.

**These are advisory patterns, not proof of a defect.** Some superscripts are already rendered properly by V112, and correct HTML/MathML may be present by design. Conversely, zero warnings would not prove that every font, figure, mobile page, vector arrow or correct answer looks right. No item is automatically approved or “corrected.”

The CI artifact **`qa-artifacts/grade11-v131-math-notation-triage/review-queue.json`** reports **only** unit, stable source question ID, original source question number, detection code and field location, with aggregate counts. It intentionally excludes **original stems, A–D option text, source answer letters, explanations, student reports and personally identifying information**. Actual candidate counts must come from the first successful CI run, not from guesses.

## What the teacher should do with a flagged item

Start with **Unit 2 Vectors** and any flagged vector-arrow item, then select representative flagged cases from Units 3–6: **(a)** inspect the original source/student notes and figures privately, **(b)** reproduce the public quiz on desktop and mobile, **(c)** inspect printed/PDF results, **(d)** distinguish an actual lost symbol from harmless source notation, and **(e)** decide whether the change is compulsory or optional, with an original-preserving explanation/overlay if needed.

Record: *source ID, problem, original source comparison, whether compulsory, whether the source should remain intact, and a verified browser regression*. Only then propose an isolated render/figure fix on another PR. Never invent missing book diagrams, reinterpret the NBF source, silently change answer keys, or claim all 2,250 original MCQs have undergone scientific answer validation.

The existing **V129 nine real-browser pre-submit samples** and **V130 four submitted-result journeys** already cover some other rendering behavior, but not every question or browser. This V131 audit helps prioritize the next *specific* visual browser review.

## Safeguards

- **No student-facing HTML, CSS, quiz app, navigation, logo, watermark or PDF source changes.**
- No question bank JSON/B64, original figure, answer letter, explanation, SLO classification, grade, Firebase/Auth/App Check permission, teacher report intake or student records are changed or exported.
- Unit 6's **560 individual academic signoffs remain PENDING**, full course `planned`, formal graded assessment `not-published`. Original 65-topic teacher issue register remains.
- Report intake remains **Copy only**, not an enabled teacher inbox. Original question banks remain **provisional public self-practice**, not a secure school examination.
- The local adapter uses a **trusted checked-in repository script only**, with allowlisted local source paths; Node `vm` must **never** be treated as a security sandbox for untrusted code.
- Test with synthetic mathematical strings and a normal text example, verify exact source IDs and counts, verify artifact schema contains no original item content, and hash-check protected source files before and after the scan. Run existing V128/V99i/V94D/V118 safety gates.

## Review and acceptance

Draft PR **#231 / V131** should contain four *nonproduction* files: audit script, regression test, this teacher report, new GitHub Actions workflow. Wait until every latest-head workflow passes. If any check fails, do **not** merge; amend this same branch. After green CI, merge and retrieve the **V131 Math Notation Triage** artifact from the Actions run. Review the top candidate IDs to choose the next focused scientifically verified, browser-visible correction.

**Quality principle:** automated source integrity identifies what to inspect; it does not replace Physics teaching judgment or visual checks of rendered notation.
