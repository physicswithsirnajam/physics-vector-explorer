# V112 — Whole-site physics typography and owner-branded print/PDF watermark

## Trigger and scope

The owner reported two post-V111 student-experience issues: physics measurement units appear as flat tokens such as `m3` and `s-1` instead of typographic powers, and saving some quiz/lesson pages as PDF omits the approved watermark. These are **sitewide presentation and printing defects**, not wrong answer-letter or scientific-key data.

GitHub inspection on 23 November 2026 found two public HTML classes: navigation-backed study/assessment pages with the established V102/V70 watermark, and standalone learning/quiz/simulation pages lacking the print injection. The public Git tree contained **115 tracked HTML files including one nonpublic internal fixture**, giving **114 public HTML routes**. **No raw PDF assets** are tracked in this repository. Browser-created Progress Report PDFs already have the V70 watermark; no third-party or external PDF files are silently modified.

## Implementation: one shared reusable layer

- `shared/sitewide-science-print-v112.js` + CSS: detect isolated, unambiguous **measurement-unit powers** `m3`, `cm2`, `m-3`, `s-1`, `kg m-3`, `N m-2`, `s^-2`, `m^{3}` and explicit algebra powers `v^2`, `10^-3`. Produce actual `<sup>` markup with a tiny presentation-only wrapper. Native superscripts are visible in both the browser and Save to PDF.
- **No blind normalization:** A variable `v2` can mean a second speed rather than a square, so naked variable suffixes aren't converted; source IDs, question numbers, plain 2026 dates and raw spreadsheet/JSON files remain unchanged. Likewise expressions such as `(0.8/0.4)2` need context and must be handled in a separate, source-reviewed academic/math audit rather than guessed globally.
- **Exact text preservation:** Before replacing a text node, the formatter checks that its resulting full DOM `textContent` is identical to the original text. For literal caret notation (`s^-1`) the source caret/braces remain in visually hidden DOM spans; the exponent is raised as `<sup>-1</sup>`. This means existing source text, copied formulas, answer letters, exam grading, SLOs and question-bank records do not change. Works with dynamic MCQ rendering via a bounded `MutationObserver`.
- **Existing watermark contract:** Reuse `shared/print-watermark-v70.css` and its fixed, diagonal, repeated 8-line **Physics with Sir Najam** stamp. The watermark is **hidden on screen** and visible in printed/PDF pages, even if the browser disables background graphics. Idempotent injection prevents two watermarks on pages that already load the V70/V102 print layer.
- **Whole public-site inclusion:** The **72 navigation-backed** routes receive V112 through `shared/navigation.js`. **41 standalone** routes without navigation import V112 directly, including all seven Unit 6 topic previews, the balanced quiz, simulations, the landing page and the privacy page. The **one intentionally script-free original Unit 6 figure-study gallery (V90)** receives the established watermark through a static CSS link and an eight-line HTML watermark, with no executable scripts or dynamic formula rewriting, preserving the original source-restriction regression. The CI coverage test checks all 114 public HTML routes and enforces these exact classes.
- **No new exception yet:** Once completion certificates are implemented, a dedicated, explicitly approved certificate generator may bypass the general print stamp for **that verified export only**. V112 does **not** make an open-ended `?no-watermark` flag, bypass attribute, public endpoint or automatic user-controlled exemption.

## What this does and does not guarantee

For **owned HTML content printed / saved as PDF through the browser**, the page must load the shared script to receive the repeated diagonal watermark. The V112 CI enforces **navigation loader or direct loader** on 113 public routes and the deliberate **script-free CSS-only** printed watermark on the original Unit 6 figure gallery. Browser-created Progress Report popups retain their existing independently tested V70 stamps. **External linked PDFs, PDF assets hosted by other providers, screenshots, files made offline by a third-party app or content copied from the site are not altered by HTML print CSS**; any future direct PDF-download generator must add its **own verified PDF stamping** and become a blocking release test. New page/route creation must include the shared layer to pass CI.

The watermark is a **visual attribution measure**, not DRM or an unremovable security protection; a user can alter their own printed document outside the site. Avoid promising otherwise.

## Regression and scientific QA gates

- `scripts/test_grade11_v112_universal_science_print.cjs` enumerates the repo's public HTML files using tracked paths, fails if **any** lacks navigation or a direct V112 loader, and rejects duplicate inclusion.
- Chromium desktop/mobile tests demonstrate real superscript vertical alignment and **bit-for-bit unchanged visible-source textContent**, including `m3`, `cm2`, `s-1`, `kg m-3`, `s^-2`, `v^2`, `10^-3`, and unaltered question IDs `Q28` / `v2`.
- Real Chromium-generated A4 PDFs, with `printBackground:false`, are validated using `pdfinfo` and **page-by-page `pdftotext -raw`** counts. Examples: Topic6.4 preview, independent Continuity simulation, navigation-backed Unit2 Numericals, homepage and the actual **80-item corrected Unit6 Topic6.4 review**.
- Regressions retain existing V70 Progress Report and MCQ print stamping, V102 navigation/lesson multi-page watermarks, and V111 source-preserving teacher-approved Q28/Q51/Q52/Q67 practice treatment.
- All 560 Grade XI Unit 6 teacher approvals stay PENDING, full Unit 6 and formal assessment not released, FBISE SLO/cognitive claims untouched, Firebase/App Check still governed by previous owner-approval gates. No private PDFs or student personal data are used.

## Post-merge owner acceptance (after latest-head CI passes)

1. Open [Topic 6.4 practice](https://physicswithsirnajam.github.io/physics-vector-explorer/portal/unit-06-topic-64-preview.html). View or answer numericals. Powers in **m s-1, cm2, m2, kg m-3**, etc. should now appear **raised**, while values and correct letters remain unchanged.
2. Select **All Questions**, submit the local practice and select **Print review / Save as PDF**. In the resulting browser PDF, each page should have a faint repeated diagonal **Physics with Sir Najam** watermark. Use the browser's default **Background graphics OFF** once to verify it still appears.
3. Try [balanced Unit 6 practice](https://physicswithsirnajam.github.io/physics-vector-explorer/portal/unit-06-balanced-mcq-v95c1.html), a Unit 2 numerical page, and a standalone simulation such as [Continuity and Fluid Flow](https://physicswithsirnajam.github.io/physics-vector-explorer/continuity-fluid-flow.html). Print previews should contain the same watermark across sites.
4. Confirm the main portal, official brand/logo, central Test Builder, original source history and final exam locks remain unchanged.

**Follow-up academic work:** review exceptional textbook notation beyond safe unit/exponent patterns (e.g. non-explicit `r2` / `(r1/r2)2`, symbolic subscripts versus powers, Greek and vector glyphs) **item by item with original NBF context**, rather than automatically altering mathematical meaning. This is a distinct academic source-certification task.
