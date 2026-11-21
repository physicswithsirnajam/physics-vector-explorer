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
