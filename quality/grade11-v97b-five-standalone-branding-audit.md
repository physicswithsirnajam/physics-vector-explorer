# V97-B — Five more officially branded standalone Grade XI laboratories

## Scope

Following merged PRs #139 and #140, this is the **third five-lab batch** of the root standalone simulation branding sequence. It applies the existing exact official logo at `portal/assets/physics-with-sir-najam-official-logo.png` through the reusable V97-A brand component already on main.

This batch only introduces two references per HTML page — the established `shared/standalone-brand-v97a.css` and `shared/standalone-brand-v97a.js` files — and deliberately leaves original experimental code, calculators, animations, text, assessment questions and answer feedback untouched.

## Included simulations

| Original HTML | Focus | FNV-1a baseline with inserted references removed |
|---|---|---:|
| `diffraction-ripple-tank.html` | Diffraction and ripple tank | 1284529756 |
| `doppler-effect-laboratory.html` | Doppler effect | 4036963233 |
| `electric-field-particle-lab.html` | Electric fields and particle motion | 1858785059 |
| `first-law-pv-work.html` | First law of thermodynamics and P–V work | 172425708 |
| `free-fall.html` | Free fall and vertical motion | 1664955211 |

The shared brand bar has exactly one official logo and the three original portal destinations of V97-A: All Simulations, Learning Hub and Student Guide. It is non-sticky, print-hidden and responsive; no banner overlays an experiment.

## Quality gates

Dedicated `scripts/test_grade11_standalone_brand_v97b.cjs` checks the exact full HTML fingerprint after removing the added tags, official-logo loading, original laboratory stage/control presence, browser JavaScript errors, link paths, 1280px desktop and 390px phone widths, navigation functionality and screenshots. GitHub Actions `validate-grade11-standalone-brand-v97b.yml` must be green before a merge.

No student privacy, Firebase auth, records, teacher-only access, exam status or academic release checks are changed.

## Further batches

With this batch merged, **15 other root standalone simulations** will remain without the official logo. The wider `portal/*.html` branding audit is a separate task to respect layouts already branded and to avoid duplicating logos unnecessarily.
