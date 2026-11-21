# V98-P — Fix the Grade XI Original Notes & Concept Videos Directory's Mobile Overflow

## Prerequisite and original finding

PR **#159 (V98-O)** is confirmed merged at `19dbd89735cf5bef962f38824bff954df5b4f626`. That read-only seven-page audit verified 90 existing local links across Grade XI Learning Desks, original resources, privacy information and Unit 3/4 assessment packs. Its browser artifact showed a single **reproducible document-width problem** on `portal/legacy-hssc-resources.html`:

| Viewport | Measured document width | Result |
|---|---:|---|
| 390px phone | 457px | Unwanted page-wide horizontal scrolling |
| 320px narrow phone | 457px | Unwanted page-wide horizontal scrolling |
| 1280px desktop | 1280px | Fits correctly |

The original JSON-backed PDF and YouTube listings, unit filters and search behavior loaded properly, with no JavaScript exceptions, missing local files or broken static links. The issue is **presentation-only**, discovered by V98-O and not introduced by that audit.

## Deliberate diagnosis-first fix workflow

1. Run local headless Chromium from an Actions job at **320, 375, 390, 540, 620, 768 and 1280px**, capturing actual DOM element bounding rectangles, `scrollWidth`, `clientWidth`, computed grid columns and content overflow. Collect seven screenshots and `diagnostic.json` even on the first failing run.
2. Identify the **actual offender** from browser evidence rather than guessing based on the width alone.
3. Apply a minimal, **screen-only** responsive style if supported by the measurements. No content text, resource URLs, course indexes, PDF/YouTube references, original official logo or print behavior should be altered.
4. Protect the original HTML source with a tested FNV-1a32 checksum **3496041848**. Removing the single approved CSS line must produce exactly the original file content. This prevents accidental academic or source-link modifications.
5. Verify all seven widths fit, original logo actually loads, both JSON source catalogs function, Unit 2 filter/search and no-match restoration work, no browser JS exceptions or local 404s occur, and external Google Drive/YouTube hosts are **not contacted** during QA.

## Security, accuracy and branding boundaries

The source directory is a **public student resource**. Do not change external sharing permissions, video URLs, Drive notes, existing warning about the Unit 10/11 duplicate video link, or source notes. The original asset `portal/assets/physics-with-sir-najam-official-logo.png` remains unmodified.

This is source-local browser testing against checked-out code, **not** a live production, external-host availability, full accessibility or academic-content certification. The initial diagnostic can **fail intentionally** while reproducing the original bug. This is not permission to merge a red PR.

GitHub Actions artifact: `grade11-original-resources-v98p-evidence`.

## Release gate

Keep the PR as a **Draft** until the **latest-head** dedicated V98-P run and all other triggered CI checks are green. Read the diagnostic artifact; do not assume green means all issues were resolved. Only then use **Ready for review → Merge pull request → Confirm merge**.

## Diagnostic root cause and approved correction — confirmed by Chromium

The first browser run successfully loaded the original PDF and YouTube JSON catalogs and logged the actual elements causing horizontal scrolling:

- At **320px, 375px, and 390px**, the overall document was **457px** wide. The offending content was an `h3` heading inside `#pdf-cards .card`, with an unbreakable original PDF filename `Grade11_Unit3__NOTES_+_Assessments.pdf`. Its card's scroll width was approximately **442px**, although the card visually occupied the normal mobile grid column.
- At **620px**, the two-column card grid produced **653px** overall page width, with another unbroken filename `11th_PHYSICS_Unit_4_(Complete NOTES)_+_ASSESSMENTS.pdf` overflowing its card. The source catalog, selector and input themselves fit correctly.
- The observed document fit at **540px, 768px, and 1280px** in the first diagnostic. Separately, the shared global navigation link strip scrolls internally as designed and was not identified as the cause.

The proposed `.controls` fix was **not used** because browser measurements showed those controls already fit. The retained, single CSS change is:

```css
@media screen and (max-width:620px){#pdf-cards .card h3{overflow-wrap:anywhere}}
```

This affects **only PDF card headings on smaller screens**. It preserves the complete original filename text, existing Google Drive URL, original source catalog entries, original logo, video catalog and A4/print styles. Removing the one approved style line recovers the original byte-exact HTML FNV-1a32 fingerprint `3496041848`.

The latest-head checks must verify all seven screen widths and the original unit-select and catalog-search interactions. If tests identify any further layout issue, do not merge until resolved.
