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

## Confirmed root cause and the exact correction

The pre-fix V98-E Chromium run reproduced document widths of **453px at both 390px and 320px**, while 768px and 1280px had no document overflow. Instrumented DOM rectangles pinpointed an unbroken *italicized filename* in `portal/unit-05.html`'s `.source` reference paragraph:

`11_Physics_HSSC_I_model_paper_50_percent(9).pdf`

Its inline element extended from about **x=33px to x=448px** at phone width, accounting for the page overflow. Several global-navigation links also had off-screen rectangles, but those did not contribute to document scroll width and **were not modified**.

The only correction is the narrowly scoped rule:

```css
@media(max-width:700px){.source em{overflow-wrap:anywhere}}
```

This permits the otherwise unbreakable filename to wrap on phone screens **without changing any text, original brand asset, page structure, links, scientific formulas or lab behavior**. The test allows exactly this single CSS rule and compares the remainder of the document against fingerprint `770261505`. Browser regression measures 320px, 390px, 768px and 1280px plus original logo and Work–Energy Lab navigation.
