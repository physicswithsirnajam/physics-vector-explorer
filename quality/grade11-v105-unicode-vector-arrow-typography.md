# V105 — Render vector arrows reliably instead of Unicode missing-glyph boxes

## User-reported defect (23 November 2026)

Owner opened the public Grade XI **Unit 2 comprehensive response** through the V104 Descriptive Answer Finder and provided a screenshot. The Physics calculations were legible, but the arrow-above combining Unicode character in `A⃗`, `B⃗` and other vector symbols appeared as a visible empty box. This is a **mathematical notation rendering defect**: the source uses the combining right arrow above (`U+20D7`) with letters, and the selected browser/font fallback does not reliably shape that glyph. The image did not demonstrate a wrong dot-product or cross-product answer.

## Source audit and scope

Checked-in public learning page source affected:
- `portal/unit-02-descriptive.html`: **263** right-arrow-above markers.
- `portal/unit-02-numericals.html`: **110**.
- `portal/unit-02-formula-sheet.html`: **48**.
- `portal/unit-03-collision-study.html`: **4**.
- `portal/unit-04-angular-momentum-study.html`: **8**.
- **433 total** across these five static public HTML pages.
- `portal/verified-descriptive-index-v104.json` includes source-labelled vector expressions and is rendered asynchronously in `portal/descriptive-answer-finder.html`. The public index JSON **remains unchanged**; this reader is the sixth opt-in public page.

V105 source QA scans every `portal/*.html` page for `U+20D7` and rejects any as-yet-uncovered static pages, so coverage is not handwaved. Other Unicode glyphs (e.g. unit-vector `î`, `ĵ`, `k̂` using combining circumflex `U+0302`, Greek letters, subscripts and superscripts) are **not presumed defective** merely because the original combining arrow is. They require browser-specific evidence before changing the mathematics.

## Exact implementation

1. New `shared/vector-notation-v105.css`: a lightweight **font-independent, actual CSS border-stroke arrow** above each vector letter. It does not depend on an installed math font, third-party font, online SVG, background image or print background-graphics setting.
2. New `shared/vector-notation-v105.js`: a **small opt-in text-node display decorator**. Searches within the page's public `main` only for letter + `U+20D7`, creating an inline `role="img"` with `aria-label="vector A"` (or the corresponding letter/Greek name), visible original letter, tiny hidden-from-rendering source combining mark, and CSS arrow. The original combining character remains within the decorated element's `textContent`, so the mathematical source order, expressions and scientific content are preserved. No regex is applied to raw HTML or to raw source JSON; `script`, `style`, `code`, `pre`, `math`, SVG, text inputs and contenteditable are excluded. A limited `MutationObserver` only decorates new text inserted under `main`, e.g. source-labelled finder questions loaded from JSON.
3. Six public HTML pages **explicitly opt in** via a stylesheet and a deferred script. This deliberately avoids an uncontrolled site-wide DOM transform in student test attempts, secure Firebase lesson views, MCQ input engines or interactive simulations.
4. The original **`U+0302`** circumflex for standard `î`, `ĵ`, `k̂` and all other punctuation/symbols are left unchanged pending separate QC.

No Physics question text, formula, numerical result, scientific interpretation, instructional answer, score, lesson body, or protected source document is authored/modified. No Firebase Auth, App Check, Firestore, MCQ bank, student report intake, administrator workflow, cost or privacy changes. The official brand logo and the existing V70/V102 print watermark remain unchanged. App Check remains **Monitoring; enforcement OFF**. MCQ user reports remain **Copy only**.

## Acceptance / regression

V105 source and Chromium tests:
- Every static visible `U+20D7` in all affected pages becomes a CSS-drawn arrow above its own letter without changing the original document source text.
- Actual Chromium render checks inspect the visible wrapper count, arrow pseudo-elements' **border-stroke rendering**, zero-size original source mark (no glyph box), accessibility label and preserved original `textContent`.
- Real Unit 2 comprehensive Q15 after revealing the answer, Unit 2 formula sheet and responsive 390px phone screenshot.
- The **dynamic** descriptive finder is checked after its JSON source loads; it should decorate every vector arrow in displayed answers without changing which question opens.
- Actual browser Print → Save as PDF for the Unit 2 Formula Sheet with **Background graphics OFF**, checking generated PDF, source legibility and print CSS.
- Preserve existing Unit 2 resources validator, V104 individual answer finder, and V102 global PDF watermark regressions; require other triggered CI green.
- Source-scope fail-closed guard: any newly discovered static `portal/*.html` page with an unsupported `U+20D7` that does not opt in fails the audit.

## Owner deployment and manual visual QA

1. PR stays **Draft** until exact latest-head Actions including V105, Unit 2 resources, V104, V102 and triggered guards pass.
2. Review Files changed: only 2 shared presentation files, six HTML script/CSS includes, V105 QA/CI and this note. Existing Math answers/academic content and all original source PDFs unchanged.
3. Owner approves **Ready for review → Merge pull request → Confirm merge**. Do not alter Firebase security or server settings.
4. After GitHub Pages deploys, open `portal/unit-02-descriptive.html#l15`; reveal **Comprehensive Question 15**, confirm the arrows visibly float over `A` and `B` in dot/cross product formulas and no empty squares are visible. Cross-check a few lines at normal zoom on the student's Windows/Chrome browser and on a phone if possible.
5. Open `portal/unit-02-formula-sheet.html`, test on-screen and **Print → Save as PDF** with Background graphics disabled; check arrows, line wrapping, watermark and mathematical readability. Also test Unit 2 Numericals and a Unit 3/4 example.
6. If a browser still renders broken arrows or readability suffers, stop and report the browser+zoom+screenshot; adjust a focused CSS variant, or revert this PR; do **not** change the Physics question data or disable App Check.

## Future typography quality gate

Audit visual fallback coverage for **remaining symbols** in actual user browsers (unit-vector hats, Greek letters, subscripts, superscripts, minus signs, radical signs, multiplication dots, degree signs), then integrate a symbol-rendering QA gate into each new Unit 7–14 and Grade IX page release. Do not treat this V105 proof as blanket certification of every mathematical symbol or every browser.
