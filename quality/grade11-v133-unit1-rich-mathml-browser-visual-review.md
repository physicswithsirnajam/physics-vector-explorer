# V133 — Unit 1 actual MathML and scientific-power appearance: teacher screenshot evidence

## Verified prerequisite and source selection

PR **#232/V132** was merged on 24 November 2026 and its **two latest-head GitHub Actions workflows passed**. V132 collected six public question-only Unit 2 combining-arrow screenshots and verified that the original U+20D7 reached the browser DOM. That did not automatically certify every vector glyph or the remaining 67 V131 Unit 2 candidate questions.

I inspected the **actual V131 artifact**: Unit 1 has **217 flagged review candidates**, largely because its original `stemHtml`, `option.html`, and `explanationHtml` contain explicit, intentional rich MathML. This does **not** mean that 217 questions have problems. In fact, the existence of rich markup is often necessary for faithful mathematical presentation. V133 therefore tests **rendering**, not the incorrect premise that `<math>` text in the source is a defect.

The original public `question-bank/grade-11/unit-01.json` contains **275** existing MCQs. Four specifically verified source IDs provide a representative, deliberately mixed technical sample:

| Original public question ID | Original number | Assessment classification (unchanged) | Rendering to inspect |
|---|---:|---|---|
| `XI-U01-MCQ-0003` | 3 | **Formative** | Inline MathML Greek rho and volume/density expression in question |
| `XI-U01-MCQ-0005` | 5 | **Formative** | Block MathML and exponent `l²` in original option D |
| `XI-U01-MCQ-0019` | 19 | **Summative theory** | Inline MathML SI units with positive/negative powers in question |
| `XI-U01-MCQ-0024` | 24 | **Summative theory** | Dimensional formula with negative exponent in original option B |

**Critical safeguard:** these two original formative questions are inspected ONLY for rendering quality, not presented as summative exam-eligible. The test uses `scope=all` expressly to include both categories. A student preparing for theory exam summative revision should still choose `Summative` in the Test Builder. No original SLO is changed.

## Exact deliverable

`scripts/test_grade11_v133_unit1_mathml_browser.cjs` uses the **actual original public practice engine** and its current source adapter, hosted on an ephemeral read-only local server, and navigates using immutable public question IDs rather than guessed JSON/list positions (the lesson from V132). Test all four question-only cases at **1280px desktop, 390px phone, and 320px narrow phone**, producing **12 screenshot PNGs** plus an answer-free review-summary JSON artifact.

At each sample, require the original source ID, original assessment classification, visible question and four nonempty choices, visible DOM `<math>` roots, expected `<msup>` nodes where original sources contain exponents, a nonempty computed CSS box, no obvious replacement/square placeholder, no horizontal overflow or JS exception, and **no revealed answer or worked solution on screenshot**.

**The MathML DOM being present does not prove typography is visibly good.** Screenshots must be inspected for legibility, superscript placement, clipped formulas, spacing, minus-sign appearance and Greek glyphs on each width. Some `MathML` browser implementations differ; this is Chromium QA, not a cross-browser/font certification.

Artifacts retain source ID, screen width and technical location only (plus already public question-only screenshots). Do not export original answer keys, teacher-only PDFs, any logged-in student's information or private source content. The original Unit1 bank's SHA-256 is compared before/after.

## Scope and release integrity

- **Three new nonproduction files only**: V133 browser test, this note, and an Actions workflow. No student page, quiz scoring, original bank JSON/B64, text/answer/source figure, SLO/cognitive level or original teacher signoff is altered.
- Preserve current original **2,250 Grade XI provisional MCQ references** (275/206/220/640/349/560), all original V131 notation candidates, V128 structural audit, and frozen V99i report IDs.
- Unit6 **560 individual academic approvals remain PENDING**, course planned and formal graded assessment not published.
- Firebase/Auth/App Check, user data, private score saving, issue reporting (Copy only), existing branded PDF watermark, public worked answer visibility, and school exam conditions remain untouched.
- This is a **four-question representative technical sample**, not all 275 Unit1 examples, all 2,250 MCQs, original NBF figure comparison or independently verified Physics answer grading.

## Owner acceptance

Review **draft PR #233/V133**. Confirm exactly three new QA-only files. Wait for all latest-head checks green. If any red, do not merge; fix this same branch. When green, select **Ready for review → Merge pull request → Confirm merge**. Download the `grade11-v133-unit1-mathml-browser-evidence` Actions artifact and inspect the **12 public question-only screenshots**. Mark any *specific* clipped/misplaced symbol by source ID + screen width; decide whether any source-preserving, display-only change is compulsory before proposing it.

**Priority after V133:** original-source-verified targeted content corrections, only if real defects are found, rather than blanket rewriting of mathematically valid markup.
