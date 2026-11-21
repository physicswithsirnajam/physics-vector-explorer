# V98-B — Replace the original Vector Explorer's decorative star with the exact official logo

## Confirmed prerequisite

PR #145 (V98-A branding inventory) is merged. That source-level audit found 73/73 `portal/*.html` pages already display the original official logo, the 30 recorded standalone labs have their shared official logo, the root Student Guide has its official logo, and the Test Builder's alternate logo binary is identical to the canonical asset.

The one previously observed gap was the repository root `index.html`: the separate **Vector Explorer 1.0** (Unit 2) displays a `✦` decorative symbol in its header but has no official logo image.

## Tiny and deliberate visual fix

**Changed file: `index.html` only.** The original header node

`<div class="brandmark" aria-hidden="true">✦</div>`

becomes

`<div class="brandmark"><img src="portal/assets/physics-with-sir-najam-official-logo.png" alt="Physics with Sir Najam official logo" width="47" height="47" decoding="async"></div>`

One new narrowly scoped CSS rule makes that image fill its original small header box using `object-fit:contain`; the existing width is 47px desktop / 40px narrow phones. The file `portal/assets/physics-with-sir-najam-official-logo.png` is the **exact original official logo**; there is no image replacement, redraw, crop, custom recreation or new banner.

No vector formula, drag interaction, tab model, numerical explanation, quiz question, answer key, controls, graph, physics engine, export, print stylesheet or projector styling is touched. The page's scientific content is preserved exactly: if the small logo HTML and scoped CSS are reverted, **the full original `index.html` returns to its fixed FNV-1a fingerprint `171963615`**.

## Automated source and browser verification

`scripts/test_grade11_vector_explorer_brand_v98b.cjs` verifies:

- Original HTML fingerprint after removing only the tiny approved brand changes.
- Exactly one image node in the root vector page, with original canonical asset path, meaningful non-empty alternative text, and image with nonzero natural width.
- Actual image loading at both a custom-domain root and a GitHub Pages project-prefix path, testing relative resource safety.
- Desktop (1280px) and narrow phone (390px) header visibility without unintended sideways scrolling; original vector SVG uses the mobile viewBox.
- Real vector controls: Components, Dot Product, Cross Product, 15.0 N magnitude slider update, Reset button, and presence of Print and Projector buttons.
- No browser page errors, plus archived desktop/mobile screenshots.

Workflow: `.github/workflows/validate-grade11-vector-brand-v98b.yml`. It requires only read-only repository permission. Keep PR as draft until latest-head checks pass.

## Boundaries

This is a **branding-only** change and does not certify any separate visual QA of all 73 portal pages, nor make security or assessment-release claims. Do not change teacher/private-key exposure or any permissions in this PR. After merge, the root Vector Explorer is visually in line with the 30 audited standalone labs and the existing branded portal pages.
