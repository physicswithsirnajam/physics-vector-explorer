# V136 — Confirm existing V112 typesets original Unit 3 formative seconds exponents correctly

## Corrected source finding

PR **#235/V135** merged with two successful GitHub Actions checks. Its answer-free screenshot evidence showed an overlined velocity symbol and two Unit 3 formative examples that initially appeared to contain raw `s^-1` text. Before considering a display fix, V136 inspected the **actual loaded original V55 question-bank strings** for `g11-u03-master-t33-q036` and `g11-u03-master-t33-q060`.

The original text is actually **`s^{-1}`** (with braces), **not** `s^-1`. This distinction matters. The existing `shared/navigation.js` loads the **V112 sitewide scientific-notation renderer**, which recognizes `s^{-1}` and presents a real HTML superscript `s` + `<sup>-1</sup>` while preserving the exact original raw characters in `.textContent` through visually hidden source spans. The CSS ensures the superscript remains readable on-screen and in print. This explains why the V135 screenshots looked typographically correct.

**The initial proposed extra V136 formatting wrapper was therefore unnecessary. It was completely reverted before review.** The original `practice-engine/index.html` on this PR branch has the **same Git blob SHA as `main`**, so merging V136 does not modify the student quiz, any original questions, formatting scripts, source keys or scores.

## What the new V136 regression really tests

The corrected `scripts/test_grade11_v136_unit3_seconds_display_browser.cjs` is a **read-only, real-browser guard** for this existing behavior. On an ephemeral local server it:

1. Opens the actual source-backed Unit 3 practice engine with **all 60 original formative** items from the 220-item public bank at **1280px, 390px and 320px**.
2. Submits a real 60-item formative practice in Chromium and checks that all **11 source-identified Topic 3.3 review candidates** retain original immutable IDs and **Formative** classification. Where original explanation content includes `s^{-1}`, the completed-test review must contain **a real visible `<sup>-1</sup>`**, the V112 source-preserving full text `s^{-1}`, and hidden source caret/braces. No unit-specific replacement is performed.
3. Uses the actual optional **Check Answer** feedback UI on original formative `q036` to confirm that the same existing V112 typesetter works before final submission, without screenshotting answer keys.
4. Confirms that an unrelated **summative** overlined velocity original `XI-U03-MCQ-0031` remains unaltered. The original Unit 3 formative 60 are still excluded when a student selects `scope=summative` for theory-exam practice.
5. Saves **six small isolated source notation screenshots** for `q036` and `q060` at the three widths; no worked-answer strings, correct choices, questions, private NBF PDF scans, student data or credentials are exported. Checks original file SHA-256 values before and after the run, source counts, basic no-overflow/JavaScript-error conditions and the original academic-release safeguards.

The test is designed to **fail if the existing V112 renderer or its source-preservation/print-oriented contract is broken**. It does not turn any question into a certified FBISE summative item or independently verify answer correctness.

## Scope, academic preservation and roadmap

- **Exactly three nonproduction files changed** in the final PR: this teacher quality report, the revised V136 browser regression, and its GitHub Actions workflow. No runtime files or original question/source keys are changed.
- The prior V131 source audit found 12 Unit 3 notation candidates (one summative overline, 11 formative caret). V136 proves that the selected braced seconds-unit cases are **already handled** by V112, avoiding a redundant rendering implementation. Remaining independently identified notation candidates still require source-specific visual QC.
- Original public provisional Grade XI MCQ count remains **2,250** (275/206/220/640/349/560). Unit 6's 560 individual academic signoffs remain **PENDING**, full course `planned`, graded examination `not-published`.
- Original Firebase/Auth/App Check behavior, account data, score persistence, Copy-only teacher issue reports, original V112 watermark, and current completed-review labels are unchanged.
- CI executes this complete original-bank browser regression and existing V131/V128/V99i/V94D/V118 source/release checks. Screenshot passing is **representative browser evidence**, not a guarantee across every browser or a full scientific-content audit.

## Owner acceptance

Review draft **PR #236** as a **QA-only proposal**, not the original suggested formatting change. In Files changed, expect **only three nonproduction files** and **no `practice-engine/index.html`**. Do **not** merge if any latest-head check is red. After all green, use **Ready for review → Merge pull request → Confirm merge**. Review the six V136 source-notation screenshots if useful; they should display superscript `s⁻¹` while retaining source `s^{-1}` in DOM text.

**Quality lesson:** do not "fix" source notation that the existing safe typesetting layer already renders correctly. Protect original source fidelity first, then invest in genuine remaining student-visible or academic defects.
