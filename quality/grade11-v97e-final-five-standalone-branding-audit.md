# V97-E — Final five standalone Grade XI laboratory branding integrations

## Precondition and scope

PR #143 is confirmed merged. This final five-page batch follows PR #139 (five Unit 6 laboratories with the exact official image) and PRs #140–143 (five further standalone lab pages each). The common authoritative logo is **the repository's unmodified official original image** at `portal/assets/physics-with-sir-najam-official-logo.png`.

All five original root HTML simulations are preserved unchanged except for **two additive references each**: the shared `shared/standalone-brand-v97a.css` stylesheet and `shared/standalone-brand-v97a.js` browser script. The shared identity bar is compact, navy/gold, keyboard accessible, mobile-adaptive, non-sticky and print-hidden. It contains links to All Simulations, Learning Hub and Student Guide; it does not add a large banner above a simulation stage or alter existing experiment controls.

## Five updated pages and original source signatures

| Page | Laboratory | FNV-1a original fingerprint after removing both new asset references |
|---|---|---:|
| `vector-addition.html` | Vector addition and resultant components | 336381207 |
| `wave-intensity-energy.html` | Wave intensity, amplitude and energy transfer | 2861828549 |
| `wave-superposition-interference.html` | Wave superposition and interference | 2867618582 |
| `weightlessness-artificial-gravity.html` | Orbital weightlessness and artificial gravity | 3734143097 |
| `work-energy.html` | Work-energy laboratory | 4115624257 |

`scripts/test_grade11_standalone_brand_v97e.cjs` checks the exact original scientific HTML fingerprints at each CI run, after removing the two inserted asset lines. These fingerprints guard every original experiment, visualization, formula, answer, numerical, graph and script in the five source files.

## Validation

Dedicated `.github/workflows/validate-grade11-standalone-brand-v97e.yml` tests original HTML integrity and the exact official logo asset, plus Chromium render checks on all five real pages: logo resolved with accessible alt text, core experiment/diagram present, three correct same-tab navigation links, real All Simulations navigation, zero browser JavaScript exceptions, 1280px desktop layout, 390px mobile without overflow, visibility of links/logo, and desktop/phone screenshot artifacts.

Do not merge on failing or pending latest-head checks. Keep draft until reviewed, then mark Ready for review and merge only after green.

## Next milestone

After V97-E merges, all **30 original root-level standalone simulation pages** in the recorded 2026-11-21 inventory will contain the exact official brand logo. This means the root simulation branding coverage objective is complete **within the audited 30-page scope**; it does not assert that every `portal/*.html` lesson, lab, study guide, teacher view, test page or route is already correctly branded.

Next: create a read-only inventory of `portal/*.html` pages, categorize those already branded vs those missing assets, distinguish lesson pages from assessment, teacher or restricted pages, and recommend small visual fixes without duplicating logos/banners, disturbing access rules, or publicizing answer keys. A portal-wide audit should be its own PR and quality checkpoint.
