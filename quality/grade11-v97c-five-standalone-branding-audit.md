# V97-C — Five further standalone Grade XI laboratories receive official branding

## Scope and prerequisites

PR #141 is independently confirmed merged. This follows earlier batches PR #139 (five Unit 6 labs), PR #140 (V97-A five standalone labs), and PR #141 (V97-B five standalone labs).

Five more existing root simulations now reference the existing shared `shared/standalone-brand-v97a.css` and `shared/standalone-brand-v97a.js`. The source image is the exact, unchanged official `portal/assets/physics-with-sir-najam-official-logo.png`. We never redraw or resize the source image itself; CSS scales its display.

This batch deliberately does not add large hero banners to physics canvases, alter navigation destinations, change any scientific engine, or touch permissions, Firebase, tests, answer keys, assessment releases or student records.

## Pages and original source fingerprints

| Page | Content | FNV-1a original HTML without two references |
|---|---|---:|
| `gravitational-waves-interferometer.html` | Gravitational waves / interferometer | 1627750608 |
| `heat-engine-carnot.html` | Carnot and heat-engine laboratory | 3986182666 |
| `ideal-gas-kinetic-theory.html` | Ideal-gas molecules and kinetic theory | 2158428700 |
| `motion-graphs.html` | Translatory motion graphs | 2716588060 |
| `polarization-malus-law.html` | Polarization and Malus's law | 525909954 |

Every original HTML file remains byte-for-byte identical after removal of the one new CSS reference and one new JS reference. These fixed baselines are asserted in `scripts/test_grade11_standalone_brand_v97c.cjs`.

## Browser and accessibility regression

The dedicated GitHub Actions workflow `validate-grade11-standalone-brand-v97c.yml` tests the original logo image load and alt text; three original same-origin navigation destinations; laboratory title and core stage; 1280px desktop and 390px mobile widths; mobile link visibility; actual same-tab return to All Simulations; zero browser exceptions; and desktop/mobile screenshot evidence. The shared component is visual-only, non-sticky and print-hidden to preserve experiment usability.

Keep the PR in **DRAFT** until latest-head checks pass. Review screenshots and interact with the original controls before final merge.

## Remaining scope

After V97-C is merged, 20 of 30 root standalone simulation pages will use the exact official logo, leaving **10 root standalone simulations** for two further batches. The larger `portal/*.html` review is a separate audit so pages already correctly branded are not duplicated.
