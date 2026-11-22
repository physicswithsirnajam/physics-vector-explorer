# V102 — Reuse the approved V70 print watermark across the Grade XI portal

## Trigger and root cause

On 22 November 2026 the owner opened the new V101-A **Exam Quick Access** page, followed its **Unit 3 Textbook Numericals 3.1–3.8** shortcut, and reported that the browser **Print / Save as PDF** output was missing the agreed watermark.

**Root cause confirmed in checked-in source:** V70 already created the approved repeated diagonal **Physics with Sir Najam** browser watermark in `shared/print-watermark-v70.css`, but only `portal/pdf-report.js` and `practice-engine/index.html` included it. Standalone Unit 1–6 study, numericals, descriptive practice, printable worksheets and enrolled lesson pages share the global `shared/navigation.js` but did not load the V70 watermark CSS or text overlay.

This PR **reuses the existing approved V70 design**, not a new logo, pattern, slogan, color system or resource watermark.

## Precise change (one production source file)

**`shared/navigation.js`** now adds, once per normal document that loads shared navigation:

1. A stylesheet link to the **existing unchanged** `shared/print-watermark-v70.css`, with the new browser cache query `?v=102`.
2. A print-only, `aria-hidden` watermark div with **eight identical** `Physics with Sir Najam` text lines, positioned by V70 CSS as a low-opacity, diagonally rotated, fixed overlay. The inline screen `display:none` is intentionally non-important so the `@media print ... display:flex!important` rule overrides it in browser PDFs.
3. A duplicate guard. Pages already carrying the V70 overlay, such as the public MCQ Practice Engine, do not receive a second copy. The standalone dynamically generated Progress report remains untouched.

This is a **shared infrastructure improvement** that covers existing first-party browser **Print → Save as PDF** on public study, printed worksheets, numericals and protected page HTML after authorized access. The overlay is invisible during normal reading and does not change the page's Physics content or original official logo image.

## Explicit non-goals and accurate language

- It covers **browser-created PDF print output of pages using `shared/navigation.js`**. It cannot magically stamp PDF bytes already generated/uploaded on Google Drive or a third-party website, nor does it modify external NBF textbooks or source material belonging to another publisher. Any first-party static PDF downloads lacking print markup require a separate file-ownership and PDF-audit task.
- Not a DRM system: students may still screenshot/copy permitted content; watermark gives attribution, not copying prevention.
- Do not overwrite raw CSV/JSON exports with visual page watermarks. Preserve their valid schemas and original V70 publisher metadata.
- No changes to MCQs, original text or key, assessment mapping, navigation destinations, private Firebase collections, App Check monitoring/enforcement, Auth, student progress, reports, teacher roles, billing, domain or image/branding assets.
- Student MCQ issue submission remains **Copy only**; no live backend enabled.

## Real PDF acceptance evidence (V102)

CI `Grade XI Sitewide Browser Print Watermark Regression (V102)` uses pinned Playwright Chromium and **`printBackground:false`**—the common user print setting with background graphics disabled. It prints *actual* source pages served locally and uses Poppler `pdfinfo` and `pdftotext -raw` to confirm that the eight-line watermark is physically present **at least four detectable times on every PDF page**:

1. Unit 3 **question-only** numericals (triggers the existing button with a local stub for the native dialog).
2. Unit 3 **teacher worked solutions** (triggers the other existing button).
3. Unit 1 original worked numerical study page.
4. Unit 2 original worked numericals study page.
5. The existing protected lesson HTML with **synthetic content only**, no actual authenticated Firebase user, student record or protected course content.

The test ensures original problem text remains, printed CSS computes to a rotated fixed overlay, the DOM uses exactly one hidden-on-screen accessible label, and the page includes its normal shared navigation. It also runs **V70's existing multi-page real Progress PDF and MCQ results PDF tests** plus V58 drawer / unfinished-test warning regression. This is true PDF byte/text evidence but not a claim that Chrome, Edge, Safari and all printer drivers render identically; user should inspect the live browser print dialog before marking the issue fully resolved.

## Safe owner release procedure

1. Keep PR **Draft** until **all latest-head GitHub checks are green**, including V102, V70, V58, V68, V99-U launch lock and any other triggered browser/navigation workflows.
2. Review `Files changed`; only shared navigation source, audit/test, CI and this note should change. No current lesson HTML, original logo, student information, teacher answers, external PDFs or server rules change.
3. Owner chooses **Ready for review → Merge pull request → Confirm merge**.
4. After GitHub Pages successful deployment, open:
   - `portal/unit-03-numericals.html` → **Print numerical questions** → verify the watermark in preview → **Save as PDF** → check multiple pages.
   - Same page → **Print worked solutions** → save PDF and verify every page.
   - `portal/unit-01-numericals.html` → print preview; confirm text remains legible.
   - `practice-engine/index.html` practice-result PDF and `portal/pdf-report.js` Progress PDF should still have the original V70 watermark without duplicate stamps.
5. If watermarks are missing or obscure text, **do not weaken the existing document access rules** or change print margins throughout the site. Instead stop further rollout and revert this focused PR for triage. A future browser-specific adjustment should use a focused PR and real PDF evidence.

**Firebase:** Cloud Firestore and Authentication App Check stay in **Monitoring**; do not click Enforce. Preserve the completed V100-N real verification progress as owner evidence but do not reinterpret this print PR as an App Check release.
