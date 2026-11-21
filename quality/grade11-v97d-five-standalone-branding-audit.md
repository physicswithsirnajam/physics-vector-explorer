# V97-D — Five original laboratory pages receive consistent official branding

## Scope and prerequisite

PR #142 is confirmed merged. This is a display-only continuation of the five-page batches. The original official logo at `portal/assets/physics-with-sir-najam-official-logo.png` remains the exact, unchanged image. The existing reusable components `shared/standalone-brand-v97a.css` and `shared/standalone-brand-v97a.js` add the modest navy-and-gold header and same-origin links to the lab library, Learning Hub and Student Guide.

These five original HTML files have **exactly two added references each**, one stylesheet tag immediately before `</head>` and one script tag immediately before `</body>`. Every original line of science, calculation, numerical explanation, simulation code, diagram content and quiz answer remains untouched.

## This batch

| Page | Existing content | FNV-1a baseline after removing the two inserted references |
|---|---|---:|
| `projectile-motion.html` | Projectile motion laboratory | 798374308 |
| `second-law-entropy-refrigerator.html` | Second law, entropy and refrigeration | 2358697173 |
| `stationary-waves-harmonics.html` | Standing waves and harmonics | 4025742624 |
| `stress-strain-young-modulus.html` | Stress, strain and Young's modulus | 2779836982 |
| `torque-angular-momentum.html` | Torque and angular momentum | 299764409 |

The source fingerprints above are asserted by `scripts/test_grade11_standalone_brand_v97d.cjs` at each CI run, preventing an unnoticed alteration of original scientific code.

## Browser quality controls

A dedicated V97-D GitHub Actions workflow uses Chromium to check all five public laboratory pages, the original image loads (with accessible alt text), the intact core control/diagram, correct three return destinations, real navigation to the simulations directory, error-free JS, 1280px desktop and 390px mobile visibility with no horizontal overflow. Screenshot evidence is archived in the workflow artifact.

No Firebase access, personal data, account permissions, academic release flags, assessments, question keys, saving systems or teacher-only tools change in this PR. A large banner is intentionally **not** inserted over simulation canvases or controls; the branding bar is not sticky and is hidden for printing.

## Next batch

After this batch is merged, **25 of 30** standalone root simulations will carry the official logo. Five remain: `vector-addition.html`, `wave-intensity-energy.html`, `wave-superposition-interference.html`, `weightlessness-artificial-gravity.html`, and `work-energy.html`. Audit separately all portal study and lesson pages for existing logos or missing identity; avoid redundant marks.
