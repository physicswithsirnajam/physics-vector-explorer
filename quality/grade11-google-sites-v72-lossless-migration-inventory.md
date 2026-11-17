# V72 — Actual GitHub resource inventory vs inaccessible legacy Google Sites

**Audit date:** 17 November 2026  
**Current site being migrated:** https://sites.google.com/view/physics-with-sir-najam/student-hub/1st-year-hssc  
**Verified repository:** physicswithsirnajam/physics-vector-explorer, main + V72 feature branch  
**Migration rule:** DO NOT restrict, remove, unpublish or redirect legacy Google Sites resources until their replacement is independently compared and checked.

## Honest evidence levels

- **Verified GitHub source:** All 31 original standalone simulation HTML pages exist in the public repository, all named by `portal/simulation-catalog.json`. Nine additional, separate unit-specific HTML learning labs exist under `portal/unit-0x-...-lab.html`. Total **40 actual interactive HTML entry points**. This is a count of pages, not 40 independently verified Google Sites simulation embeds.
- **Provisional curriculum classification:** V72 groups the 31 original models by scientifically relevant NBF Grade XI units 1–10, with an optional enrichment tag on the Gravitational Waves/Interferometer model. These unit labels are recommended navigation, NOT a direct extraction of the old Google Sites units and NOT official item-level FBISE summative SLO classifications. Existing topic labels and root files were preserved.
- **Not inspected:** The Google Sites page could not be retrieved through the available browsing connection (both page and base site returned inaccessible errors). Search engines did not supply an indexed copy of this particular site. Thus we **cannot claim** that Google Sites Unit1–5 videos, full notes, third-party embeds or additional activities were all transferred. This remains an explicit unresolved dependency.
- **Videos:** No verified legacy Google Sites YouTube/video IDs or titles were available in this inspection, and no fabricated video links were added. The former page may contain video embeds, but an actual source inventory is required. Do not download/rehost third-party educational videos; embed/link original sources with attribution/permission checks when available.
- **Notes:** Complete class notes and teacher-provided PDFs have NOT been automatically moved to protected Firebase storage. Repository static files are publicly reachable by direct URL and cannot serve as protected notes merely by hiding links. Maintain the user's **no new watermark on migrated notes** decision for this phase.

## Repository page inventory — by relevant unit

| Unit | Grade XI textbook unit | Original models | Enhanced labs | Total interactive pages | Lesson/MCQ release state |
|---:|---|---:|---:|---:|---|
| 1 | Physical Quantities and Measurements | 0 | 0 | 0 | Full unit desk released (public learning resources; provisional source banks) |
| 2 | Vectors | 2 | 1 | 3 | Full unit desk released (public learning resources; provisional source banks) |
| 3 | Translatory Motion | 4 | 2 | 6 | Full unit desk released (public learning resources; provisional source banks) |
| 4 | Rotational and Circular Motion | 4 | 5 | 9 | Full unit desk released (public learning resources; provisional source banks) |
| 5 | Work and Energy | 1 | 1 | 2 | Full unit desk released (public learning resources; provisional source banks) |
| 6 | Fluid Mechanics | 5 | 0 | 5 | Unit not yet released — interactive previews are public |
| 7 | Physics of Solids | 2 | 0 | 2 | Unit not yet released — interactive previews are public |
| 8 | Heat and Thermodynamics | 4 | 0 | 4 | Unit not yet released — interactive previews are public |
| 9 | Waves | 7 | 0 | 7 | Unit not yet released — interactive previews are public |
| 10 | Electrostatics | 2 | 0 | 2 | Unit not yet released — interactive previews are public |
| **TOTAL** | | **31** | **9** | **40** | |

These 40 are already existing files; V72 makes the ten-unit directory navigable and **does not recreate or duplicate** their simulation source.

## Exact existing HTML filenames

### Unit 1 — Physical Quantities and Measurements
- No original standalone model currently mapped


### Unit 2 — Vectors
- **Original model**: Vector Explorer (`index.html`)
- **Original model**: Vector Addition Laboratory (`vector-addition.html`)
- **Enhanced lab**: Unit 2 — Interactive Vector Mastery Lab (`portal/unit-02-concept-lab.html`)

### Unit 3 — Translatory Motion
- **Original model**: Motion Graph Explorer (`motion-graphs.html`)
- **Original model**: Projectile Motion (`projectile-motion.html`)
- **Original model**: Free Fall (`free-fall.html`)
- **Original model**: Collisions Laboratory (`collisions-lab.html`)
- **Enhanced lab**: Unit 3 — Interactive Motion Laboratory (`portal/unit-03-motion-lab.html`)
- **Enhanced lab**: Unit 3 Part 2 — Air Resistance & Collision Explorer (`portal/unit-03-collision-lab.html`)

### Unit 4 — Rotational and Circular Motion
- **Original model**: Circular Motion (`circular-motion.html`)
- **Original model**: Torque and Angular Momentum (`torque-angular-momentum.html`)
- **Original model**: Weightlessness and Artificial Gravity (`weightlessness-artificial-gravity.html`)
- **Original model**: Centrifuge Applications (`centrifuge-applications.html`)
- **Enhanced lab**: Unit 4 — Interactive Radian & Rotation Laboratory (`portal/unit-04-rotation-lab.html`)
- **Enhanced lab**: Unit 4 — Interactive Centripetal Force Laboratory (`portal/unit-04-centripetal-lab.html`)
- **Enhanced lab**: Unit 4 — Weightlessness & Artificial Gravity Interactive Lab (`portal/unit-04-artificial-gravity-lab.html`)
- **Enhanced lab**: Unit 4 — Torque, Inertia & Angular Momentum Interactive Laboratory (`portal/unit-04-angular-momentum-lab.html`)
- **Enhanced lab**: Unit 4 Part 5 — Interactive Centrifuge Concept Lab (`portal/unit-04-centrifuge-lab.html`)

### Unit 5 — Work and Energy
- **Original model**: Work and Energy (`work-energy.html`)
- **Enhanced lab**: Unit 5 — Interactive Work–Energy Explorer (`portal/unit-05-work-energy-lab.html`)

### Unit 6 — Fluid Mechanics
- **Original model**: Archimedes and Flotation (`archimedes-flotation.html`)
- **Original model**: Bernoulli and Venturi (`bernoulli-venturi.html`)
- **Original model**: Continuity and Fluid Flow (`continuity-fluid-flow.html`)
- **Original model**: Viscosity and Terminal Velocity (`viscosity-terminal-velocity.html`)
- **Original model**: Superfluidity Explorer (`superfluidity-explorer.html`)


### Unit 7 — Physics of Solids
- **Original model**: Stress, Strain and Young's Modulus (`stress-strain-young-modulus.html`)
- **Original model**: Crystal Structure Explorer (`crystal-structure-explorer.html`)


### Unit 8 — Heat and Thermodynamics
- **Original model**: First Law and P-V Work (`first-law-pv-work.html`)
- **Original model**: Ideal Gas and Kinetic Theory (`ideal-gas-kinetic-theory.html`)
- **Original model**: Heat Engines and Carnot Cycle (`heat-engine-carnot.html`)
- **Original model**: Second Law, Entropy and Refrigeration (`second-law-entropy-refrigerator.html`)


### Unit 9 — Waves
- **Original model**: Stationary Waves and Harmonics (`stationary-waves-harmonics.html`)
- **Original model**: Diffraction Ripple Tank (`diffraction-ripple-tank.html`)
- **Original model**: Doppler Effect Laboratory (`doppler-effect-laboratory.html`)
- **Original model**: Wave Superposition and Interference (`wave-superposition-interference.html`)
- **Original model**: Wave Intensity and Energy (`wave-intensity-energy.html`)
- **Original model**: Polarization and Malus' Law (`polarization-malus-law.html`)
- **Original model**: Gravitational Waves and Interferometer (`gravitational-waves-interferometer.html`) — optional/enrichment label


### Unit 10 — Electrostatics
- **Original model**: Electric Field Particle Laboratory (`electric-field-particle-lab.html`)
- **Original model**: Coulomb Force Vector Laboratory (`coulomb-vector-lab.html`)



## What is still needed to close the Google Sites migration audit

| Material on the legacy site | V72 coverage | Required evidence |
|---|---|---|
| Original simulations in Units 1–5 | 11 existing root original pages + 9 enhanced unit lab pages, independently present in GitHub | Screenshot/list of each old site's actual embeds for **one-to-one comparison**, including different names/URLs |
| Original simulations in Units 6–10 | 20 root original pages present in GitHub and newly filterable | Old site's unit-by-unit embed/list source, including extra pages |
| Additional simulations beyond Unit10 | Unknown, not declared migrated | Screenshot or old page URL for each additional asset; verify if already one of existing 40 |
| Embedded concept videos (Units1–10) | No item-by-item video import certified; video data not available | Video title, external original YouTube/video URL, intended unit/topic, recommended starting timestamp if any |
| Notes, original PDF handouts and links | Not transferred by this PR | Original PDF/Word file, Google Drive file permissions, copyright ownership and which enrolled course gets it |
| Teacher answer keys / private assessments | Intentionally not copied to public GitHub | Keep private until trusted backend distribution and teacher role permissions exist |
| External simulations such as PhET | Not verified without old site list | Exact original official URL, external authorship attribution and embedding permission |

## Source-collection method that does not risk changing Google Sites

1. **Leave Google Sites published and unchanged for now.** Work from the existing page editor or a full-page screenshot/visual copy for Units1–10 and any Additional Activities page. A whole-site public landing-only version is for after content migration.
2. Copy the **exact original URL** for each YouTube video/external simulation rather than guessing it from a title. Add the subject unit/topic and creator/title if shown.
3. For notes hosted in Google Drive, connecting a Google Drive app to ChatGPT permits direct access to supported Drive files once authorized; it does not automatically reveal the entire Google Sites layout or all embedded links. Screenshots, page link lists or an editor-exported source inventory are still necessary to verify each Google Sites page.
4. Compare one unit at a time against the **existing repository list above**. Mark each legacy item **Already present**, **New link to add**, **Needs authorized protected note hosting**, or **Unsupported/permission required**. Do not label a unit migrated until **every** video, simulator and note has an audited destination.
5. For videos, store curated links (not video binaries) in a public JSON metadata file and embed only when the video's host permits it. Use original attribution and include accessibility descriptions. Require manual teacher verification before showing each video.
6. For new original simulations not currently here, check the user's source code/project ownership before porting. Avoid AI-created visually similar substitutes when the user specifically wants the exact older original.
7. Once unit resources match, check **mobile browser**, sign-out behavior, iframe permissions and any external content policy. Publish a simple site move notice only after students can retrieve their critical resources at the new portal.

## V72 release protections

- Existing account, registration/enrollment, privacy, admin and Firebase rules unchanged; no student data used or transmitted in these tests.
- Original 31 simulation source HTML pages left untouched; enhanced nine lab source HTML pages left untouched.
- Existing Grade XI MCQ banks **Units1–5 = 1,690** remain unchanged; Units6–10 are still not marked as completed lesson/MCQ units.
- New unit-specific browsing is discoverability, **not a login or paid-content boundary**. GitHub Pages static HTML still opens by direct URL.
- Browser CI verifies actual 40 source files exist, search/filter by units1–10, 390px mobile, deep links, Unit6 models, and existing basic tests.
