# V97-A — Official branding, first five of the remaining standalone simulations

## Scope and principles

This PR follows V96-E / PR #139, already merged. The official source remains the existing image file `portal/assets/physics-with-sir-najam-official-logo.png`; it is referenced directly rather than copied, generated, redrawn or modified.

The new shared component is a compact navy/gold navigational identity above the original simulation content. A large banner is intentionally excluded from interactive laboratories where it would displace physics diagrams and controls. Branding and navigation are display-only: do not interpret public pages as teacher-authorized private resources.

## Batch 1: five newly branded laboratories

| Page | Existing content |
|---|---|
| `centrifuge-applications.html` | Centrifuge / circular motion applications (Unit 4) |
| `circular-motion.html` | Circular motion and centripetal force (Unit 4) |
| `collisions-lab.html` | Momentum and collisions (Unit 3) |
| `coulomb-vector-lab.html` | Electric force vector exploration |
| `crystal-structure-explorer.html` | Crystal structures and 3D lattices (Unit 7) |

The sole per-page changes are one shared CSS link in `<head>` and one shared JS script before `</body>`. All original scientific text, formulas, scripts, numerical problems, question keys, widgets and other HTML remain byte-for-byte unchanged after removing those two inserted lines. Exact FNV source fingerprints are asserted in the new test.

## Shared component

- `shared/standalone-brand-v97a.js`: a single accessible top navigation bar and the exact unchanged official logo.
- `shared/standalone-brand-v97a.css`: strictly namespaced styles, 40px desktop / 32px mobile logo, keyboard focus and print-hide rules.
- Same-origin, project-path-safe links: **All Simulations**, **Learning Hub**, **Student Guide**.
- Not sticky or overlaying laboratory controls; does not alter projectors, experiment event handlers, canvas rendering, Firebase, saved data or report/assessment publication.

## QA and gates

`scripts/test_grade11_standalone_brand_v97a.cjs` checks each lab source fingerprint, the five browser pages, logo loading, heading and core lab controls, three correct links, desktop and 390px mobile behavior, return navigation and JavaScript errors. A dedicated GitHub Actions workflow runs the test with Chromium and saves screenshots.

Keep the PR as **draft** until its latest-head checks are green. Review original controls and visible branding on a narrow device, then mark ready and merge. A merge is a public-page change, not an authorization or academic release.

## Remaining scope

After the five V96-E labs and this five-lab batch are merged, **20 more standalone root simulations** remain for later branding batches. The independent audit of other portal learning/study pages, including pages already containing a logo, is intentionally separate to avoid oversized or duplicate brand banners.
