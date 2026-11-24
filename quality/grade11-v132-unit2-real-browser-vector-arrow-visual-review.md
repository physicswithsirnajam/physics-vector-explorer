# V132 — Real-browser visual evidence for Unit 2 Vectors overhead arrow notation

## Prerequisite and actual V131 artifact evidence

PR **#231/V131** is merged; the two latest-head GitHub Actions checks passed. I downloaded and examined its archived `grade11-v131-math-notation-triage/review-queue.json` source-ID-only report. The audit checked all **2,250** public Grade XI original provisional MCQs; it found **304 candidate questions** and **1,622 advisory notation signals** (not 304 confirmed display failures).

Actual per-unit candidate counts from the artifact: Unit 1 **217**, Unit 2 **67**, Unit 3 **12**, Unit 4 **0**, Unit 5 **8**, Unit 6 **0**. This reflects the detector's selected patterns, **not** a statement that Units 4/6 have no mathematical rendering issues. The largest noisy category is Unit 1 intentional rich HTML/math markup in `*Html` fields (1,041 `RAW_HTML_MATH_TAG_IN_PLAIN_TEXT` signals). Before deciding to rewrite valid math, inspect real rendering.

Unit 2 is the most direct starting point for the owner's observed vector-arrow boxes: the source candidates contain combining overhead vector arrow **U+20D7** (141 `COMBINING_VECTOR_ARROW` signal occurrences, duplicated by 141 broader `UNICODE_VECTOR_ARROW` detections). Those flags are **not** evidence that these arrows already render incorrectly.

## Exact original selected samples

The checked-in `question-bank/grade-11/unit-02.json` contains **206** original public Unit 2 MCQs, including:

- `XI-U02-TEXT-0006` (original textbook exercise #6): `stem` contains the visible overhead combining vector symbol in a scalar/cross-product comparison.
- `XI-U02-MCQ-0035` (original extra-bank #35): original **option D** contains a vector-component notation using the same combining glyph.
- `XI-U02-MCQ-0019` (original extra-bank #19): `explanation` includes the overhead vector arrow in a position-vector expression.

All of these were confirmed directly in the **actual source bank** after inspecting the V131 artifact. This PR does **not** claim the vector-arrow typography is correct until the browser screenshots are inspected by the owner.

## Exactly what the new browser test does

`scripts/test_grade11_v132_unit2_vector_arrow_browser.cjs` loads the **unchanged public student practice engine** from an ephemeral read-only local server, with fixed `unit=2`, all-source scope, first **41 questions**, source order, four original options, and no shuffling. It traverses the genuine quiz using **Next**, stops at the two exact approved source question IDs, and captures **question-only** screenshots (never clicked-reveal answers) at **1280px desktop**, **390px phone**, and **320px narrow phone**.

For each sample the test verifies its exact stable reference ID, actual combining-arrow codepoint still present in the *rendered DOM text*, nonempty visible target element, original four nonempty options, no obvious replacement/square glyph in the target's plain text, no horizontal overflow and no JavaScript exceptions. It also submits the sample local quiz and checks that the original question #19 solution's combining mark survives into the **after-submit** review DOM, but deliberately does **not** photograph revealed answer keys.

**Crucial limitation:** a browser can preserve U+20D7 in DOM text and still draw an unattractive arrow, misplaced mark, tofu box or fallback font. The six screenshots (two public questions × three widths) must be **visually inspected**. No pixel-perfect vector-font correctness, actual physical answer correctness, equivalence to the NBF original PDF, print/PDF rendering, full 67 Unit2 candidates or all 2,250 bank items are certified by passing the codepoint test.

## Teacher decision after CI

Download the `grade11-v132-unit2-vector-arrow-browser-evidence` Actions artifact; view the six PNGs. If any arrow is a square, visually offset, or unreadable, identify **source question ID and viewport**, compare to the owner's original book/MCQ master, choose **mandatory/optional** correction and whether the source should be preserved with a display-only HTML/CSS overlay. Propose a new *narrow* PR with a screenshot regression before changing any student display. If they look correct, record visual signoff for those **two inspected cases only** and continue with the next source-ID candidates, not blanket certification.

A future iteration may examine Unit 1's rich math/TeX markup carefully, but should not treat raw `<math>` or `<sup>` source in `stemHtml` as an error if its actual rendered display is correct.

## No academic or account changes

- Original **2,250** provisional MCQs remain **275 / 206 / 220 / 640 / 349 / 560**. No question, option, correct letter, explanation, source metadata, figure, SLO or score is changed.
- The current **560 Unit 6** individual academic approvals remain **PENDING**, Unit6 full course `planned`, graded examination `not-published`.
- No Firebase/Auth/App Check, teacher inbox, report sending (still **Copy only**), student scores, student account, print watermark, branded logo, source PDFs or publicly served HTML are changed.
- Screenshots show *already public question-only student practice* (no revealed solutions), not private test content. The test's JSON artifact uses only public source IDs, viewport and display-check status, never keys/explanations.
- CI reruns original signed ID and count guards, V131 source notation scan, V128 structural audit, V94D Unit6 nonrelease and V118 readiness/Copy-only report guard.

## Review and acceptance

PR #232 should be **Draft** with exactly **three new nonproduction files**: this report, the dedicated browser test, and its CI workflow. Keep Draft until every latest-head workflow is green. If any test turns red, **do not merge**; amend this same branch. When green, **Ready for review → Merge pull request → Confirm merge**. Then open the V132 Actions artifact and inspect its **six** public question-only screenshots. Record whether the two exact source IDs are visually acceptable *per viewport* before proposing any rendering change.

**Quality principle:** evidence of original codepoint reaching the DOM is not visual evidence that a vector glyph was drawn correctly.
