# V96-E — Original official brand assets on standalone simulations

Scope: visual identity and navigation presentation only. This does not alter any physics model, exercise, answer key, release hold, Firebase rule, authentication, or access permission.

## Single source of truth

- Exact official logo: `portal/assets/physics-with-sir-najam-official-logo.png` (existing original; not recreated or retouched).
- Exact official banner: `portal/assets/physics-with-sir-najam-official-banner.png` (existing original; not recreated or retouched).
- The main student portal already displays both assets. The simulation-directory header already uses the official logo.
- Preserve the existing logo/banner aspect ratio, correct alternative text, and proper styling on mobile. A full-size banner is not appropriate over a small experiment canvas.

## Standalone root HTML inventory, audited on the main branch after PR #138

The repository root has 30 dedicated simulations (excluding the portal landing page, test builder and student guide). None directly embeds the official logo or banner image. Five of those already use the shared V96-C return navigation. This PR displays the existing exact logo in that bar:

1. `archimedes-flotation.html`
2. `viscosity-terminal-velocity.html`
3. `continuity-fluid-flow.html`
4. `bernoulli-venturi.html`
5. `superfluidity-explorer.html`

The remaining 25 root standalone simulations require their own later scoped integration:

- `centrifuge-applications.html`
- `circular-motion.html`
- `collisions-lab.html`
- `coulomb-vector-lab.html`
- `crystal-structure-explorer.html`
- `diffraction-ripple-tank.html`
- `doppler-effect-laboratory.html`
- `electric-field-particle-lab.html`
- `first-law-pv-work.html`
- `free-fall.html`
- `gravitational-waves-interferometer.html`
- `heat-engine-carnot.html`
- `ideal-gas-kinetic-theory.html`
- `motion-graphs.html`
- `polarization-malus-law.html`
- `projectile-motion.html`
- `second-law-entropy-refrigerator.html`
- `stationary-waves-harmonics.html`
- `stress-strain-young-modulus.html`
- `torque-angular-momentum.html`
- `vector-addition.html`
- `wave-intensity-energy.html`
- `wave-superposition-interference.html`
- `weightlessness-artificial-gravity.html`
- `work-energy.html`

This inventory covers only root standalone simulations, not every `portal/*.html` learning, lab or teacher page. A later portal-wide visual inventory should distinguish pages already branded from pages that need a logo, and avoid stamping public exam keys/admin tools with misleading student-facing treatment.

## V96-E design and safeguards

- Only two shared navigation assets are modified: `shared/simulation-return-v96c.js` and `shared/simulation-return-v96c.css`. Five original simulation HTML and scientific code files stay byte-for-byte unchanged.
- Insert the exact official logo as a **non-clickable** image and a compact two-line identity in the existing navigation bar. All four existing same-origin navigation links stay unchanged.
- Responsive navy-and-gold presentation; a 38px logo on desktop and 32px on mobile. No repeated full-width banner inside simulations.
- V96-C original scientific fingerprints, direct links, academic holds, 390px mobile checks and screenshots remain active. Extend the real Chromium test to assert the correct original image loads and is visible on each of the five pages, including mobile.
- Print CSS continues to hide the return bar so content remains printable without intrusion.

## Follow-on plan

Complete the other 25 standalone root simulations in independently tested batches using a common identity component where practical; then audit the distinct portal learning/study pages and apply exact official assets only where appropriate. Each merge needs latest-head green GitHub Actions and visual checks before release.
