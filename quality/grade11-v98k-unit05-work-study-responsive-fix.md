# V98-K — Unit 5 Work and Energy Study Guide: narrow-phone horizontal overflow

## Prerequisite and observed defect

PR #154 (V98-J) merged successfully at `1610f7ec36a5105d2140191f7f4fc5821fdd01d1`. It corrected the Unit 1 study guide table overflow and passed its targeted and general CI checks.

The V98-I and V98-J local-browser audits separately observed `portal/unit-05-work-study.html` at a **320px phone viewport** render a **383px document**, causing horizontal scrolling. The same file fit at **390px and 1280px**. This is an existing presentation defect, not a regression introduced by the audit.

## Single-page diagnosis and correction gates

1. Run a diagnostic in Chromium at **320px, 375px, 390px, 540px, 768px and 1280px**. Log the actual right-of-screen DOM elements and horizontal widths, plus page screenshots and `diagnostic.json`.
2. Identify the actual cause from browser measurements; do **not** guess and modify unrelated styles.
3. Apply **one small screen-only CSS rule**, preserving every existing physics explanation, symbol, equation, unit, SLO mapping, navigation destination, printable page layout and official logo.
4. Verify no **document-level** horizontal overflow at any of the six widths, that the official original logo is loaded and visible, no 404s / JavaScript page errors occur, and that Unit 5 study → Unit 5 Learning Desk navigation remains functional.
5. A built-in FNV-1a source gate requires exact recovery of the original source fingerprint **`2185159722`** when the single expressly approved CSS line is removed.

## Safety and evidence

No Firebase or login changes, private student records, teacher keys, grading, new source banks, or textbook content changes. The original logo `portal/assets/physics-with-sir-najam-official-logo.png` must never be redrawn or replaced. The checks serve checked-out files locally; they are not live deployed site verification.

The first diagnosis run may **fail intentionally** while overflow is reproduced; keep this PR a draft until a corrected latest-head run passes. GitHub Actions artifact: `grade11-unit05-study-mobile-v98k-evidence`.

When this PR finishes green and is merged, return to small-scope audits of uncovered public study/practice pages.

## Final root-cause analysis and actual fix

The early V98-K browser runs reproduced **383px document width** at both 320px and 375px, while the guide fitted 390px and wider viewports. A deliberate trial on `.action` links did **not** improve document width and was **discarded**.

More precise browser instrumentation compared each element's **scrollWidth** with its **clientWidth**, and excluded the already-contained SLO tables and off-canvas shared-navigation links. At 320px it found:

- `main` — client width 320px, scroll width 383px
- A direct child `p.muted` source-reference paragraph — x=11px, client width 298px, scroll width **372px**, hence its content reaches **x=383px**

The overflowing text is the long unbroken supplementary PDF reference **`Grade11_Physics_Unit5_Student_Notes_and_Practice.pdf`** in that paragraph. The tables were already enclosed in properly scrolling `.tbl` wrappers and were not the cause of document-level overflow.

The **only retained source-page change** is this narrow, screen-only CSS rule immediately before the existing print stylesheet:

```css
@media screen and (max-width:560px){main>p.muted{overflow-wrap:anywhere}}
```

It allows the source filename to wrap without changing any text, academic contents, physics equations, SLO labels, images, website navigation, table display or printed formatting. Deleting that exact CSS line recovers the untouched original `portal/unit-05-work-study.html` FNV-1a fingerprint **2185159722**.

Final readiness depends on the latest-head Chromium six-viewport test and the site's preexisting GitHub checks. The earlier failed diagnostic runs are intentional evidence of the original overflow and do not authorize merging any red checks.
