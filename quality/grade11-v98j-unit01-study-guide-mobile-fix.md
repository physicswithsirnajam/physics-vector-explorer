# V98-J — Fix Unit 1 Study Guide phone horizontal scrolling

## Prerequisite

PR #153 (V98-I) was verified merged on GitHub at `12937538325f64b41d854fdd52d8a0d1bc9ae275`. Its local Chromium audit sampled seven public Grade XI study/numerical pages at desktop (1280px), normal phone (390px) and narrow phone (320px). It found a reproducible **Unit 1 Study Guide** horizontal overflow: document width **398px** at both 390px and 320px phone viewports. One additional Unit 5 Study Guide 320px overflow is a **separate issue**, not in this PR.

## Single-page repair plan

- Diagnose the Unit 1 overflow by logging the exact offending DOM elements and table layout measurements at **320, 375, 390, 540, 768 and 1280px**; preserve screenshots and `diagnostic.json`.
- Correct **only the cause demonstrated by those measurements**. Do not change equations, answers, text, study sections, navigation, original official logo, access permissions or any other page.
- Protect the original `portal/unit-01-study-guide.html` with **FNV-1a fingerprint 2697198545**. The regression test must restore the original fingerprint by subtracting at most one expressly authorized narrow-screen CSS rule; this prevents accidental educational/source edits.
- Verify official-logo loading, all six responsive widths, absence of JS errors or source asset failures, and the existing Unit 1 Learning Desk return navigation.
- Preserve the original printed A4 study guide (the mobile rule should be screen-specific so that it does not change print formatting).

## Version-specific evidence and safety

The original image `portal/assets/physics-with-sir-najam-official-logo.png` must remain unmodified. No student accounts, Firebase records, private courses, teacher answer keys, grading, assessments or study-science content are accessed or altered.

The diagnostic runs against checked-out repository files locally, not live GitHub Pages. The early diagnose-first draft may deliberately have a **red** workflow before the correction. Keep the PR draft and do not merge until all latest-head workflows are green. Evidence is collected even on failure as `grade11-unit01-mobile-v98j-evidence`.

**After this fix merges:** diagnose the separately recorded Unit 5 Work and Energy Study Guide overflow at 320px in its own focused PR.

## Root cause confirmed and minimal correction applied

The initial V98-J Chromium diagnostic replicated **398px page width at 320px, 375px and 390px**, while pages fit at 540px, 768px and 1280px. The exact offender was the original four-column **Quantity / Defining relation / SI base units / Dimensions** table in the Unit 1 lesson. Its `<table>` element had a minimum rendered width of **360px** starting about x=38px, placing its right edge at **398px**; some other tables also exceeded the 320px phone width.

Only one media-screen-specific CSS rule was added immediately before the existing `@page` print rule:

```css
@media screen and (max-width:540px){section.lesson table{display:block;max-width:100%;overflow-x:auto}}
```

This keeps the entire four-column science reference table unchanged while allowing sideways scrolling **within the table itself** at narrow phone widths. It does **not** affect desktop, larger tablets or printed A4 lesson layouts because the media query is screen-only. The original markup, every word, calculation, image, link and answer retain their exact baseline bytes. Removing the single approved CSS line recovers FNV-1a **2697198545**.

The final latest-head regression must pass all six viewports, logo asset loading, original content fingerprint, safe Unit 1 Learning Desk return navigation, and any additional GitHub checks. Do not merge on the first diagnostic failure; use the later green latest-head run.
