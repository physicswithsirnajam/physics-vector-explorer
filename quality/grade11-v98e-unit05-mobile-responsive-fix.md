# V98-E — Unit 5 Learning Desk phone overflow, focused diagnostic and regression

## Prerequisite and observed defect

PR #148 (V98-D) was confirmed merged at `9ab666d13f88d79f537673ff1045a22f78c89e5e`. It ran a seven-page source-local Playwright visual audit. **One genuine issue** was recorded on `portal/unit-05.html`: at a **390px** phone viewport, the document was **453px wide**, creating unwanted horizontal scrolling. Six other sampled pages fit; all seven had zero JavaScript page errors or missing local assets. V98-D changed no student pages.

This PR deliberately targets **only the Unit 5 Learning Desk's mobile presentation**, never any underlying scientific lessons, explanatory answers, PDF source mappings, navigation destinations, student status, teaching resources, data, privacy rules or images.

## Diagnosis and fix sequence

1. New source-limited `scripts/test_grade11_unit05_mobile_overflow_v98e.cjs` reproduces widths **390, 320, 768 and 1280px**, logs DOM elements crossing the right viewport edge and archives screenshots and `diagnostic.json`.
2. The initial test-only commit may be red by design until the offending element is identified. **Do not merge a failing draft.**
3. Apply a single narrowly scoped mobile CSS fix to the proved cause; retain all original markup, text and physics exactly.
4. Repeat latest-head Chromium checks and confirm green before merge.

The original Unit 5 desk HTML has fixed **FNV-1a source fingerprint `770261505`**. The regression removes only the one specifically approved mobile CSS rule and must recover the exact original fingerprint. The same browser test checks exact official logo loading, absence of horizontal scroll, and real **Unit 5 Desk → Work–Energy Lab → Kinetic Energy tab** interaction.

Original official logo: `portal/assets/physics-with-sir-najam-official-logo.png`. **Never redraw or replace** it.

## Quality boundaries

This tests checked-out repository source locally in headless Chromium. It is not a live production/account-access certification. Full browser screenshots and diagnostic JSON are attached as GitHub Actions artifact `grade11-unit05-mobile-v98e-diagnostics`.

No editing of other Unit 5 pages, public teacher-key status, FBISE / NBF source judgments, authentication, Firebase, assessment releases, student records, or GitHub Pages settings.
