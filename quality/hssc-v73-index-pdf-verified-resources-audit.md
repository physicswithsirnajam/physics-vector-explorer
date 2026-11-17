# V73 — Source-verified HSSC-I Google Sites migration and public-link resource handover

**Date:** 17 November 2026  
**Exact 14-page printed source:** User upload, `Physics with Sir Najam - 1st Year (HSSC).pdf` printed at 11:58 PM, 17 November 2026. **The underlying PDF link annotations were inspected with PyMuPDF**, not merely image/OCR.  
**Other inspected source:** Original Google Drive `Class 11 (HSSC) - Physics` folder connected read-only, 17 PDFs in 4 nonempty folders; Google Drive permissions independently read for all 17 on 17 November 2026.
**No modifications** to Google Sites, Google Drive, Grade 9 content, Firebase rules, students or private accounts.

## 1. What is confirmed and what is NOT

| Resource class | Source-index evidence | Current migration state |
|---|---|---|
| Original existing standalone Physics simulations | **31 exact links** on original HSSC-I index (physical PDF pp. 3–11) | All 31 legacy titles have a one-to-one subject/title match to original existing GitHub HTML simulations. Machine-readable crosswalk in `quality/hssc-v73-31-simulation-link-crosswalk.json`. **Original old embedded model source was not independently opened**; matching is by title/topic/file, not binary identity |
| Extra enhanced unit labs in GitHub | 9 separately verified HTML pages under Units 2–5 | These are additional portal assets, NOT counted as nine old Google Sites simulation links |
| Unit concept videos | **15 links** on HSSC-I index pp. 2–14 | All 15 exact existing Google Sites video **subpage** links recovered; **original YouTube/video-host URLs and embedded player availability were not inspectable**. Do not claim videos have been copied/hosted |
| General-interest video pages | **2 links** on HSSC-I index p. 14 | Exact Google Sites subpage URLs recovered and indexed, original video host not verified |
| Original Drive PDF study files | **17 PDFs** in Grade XI folder (7 Unit1, 7 Unit2, 1 each Units3/4/5) | All 17 exact Drive links/filenames recorded; permissions were **Anyone with the link: Reader** at audit. These links continue to open original Drive, **NOT portal-private downloads** |
| Other old Google Sites lesson/exercise subpages | **17 further clickable subpages** on index pp. 2–6 (7 Unit1, 7 Unit2, 1 classroom-lecture page each Units3/4/5) | Exact original URLs preserved in manifest for next content-body audit; NOT asserted replaced/migrated. Headings for later units without printed hyperlinks are not counted. |
| Additional external Unit 7 reading | Lumen Learning crystal-lattice article, p. 8, exact original URL | Source URL preserved and visibly attributed to its original publisher |
| Unit1 simulations | PDF p. 2 contains 'Simulations' heading but no linked individual model | No original Unit1 sim added/invented |
| Unit11–14 simulations/notes | PDF pp. 12–14 show headings with no linked simulation pages/handouts | No original models/notes invented; videos indexed; units remain planned |
| Google Sites page body / embedded YouTube link | Nested pages not retrievable via available web/Google Drive file API | Still needs user/editor screenshots or original YouTube sharing link; index page annotation is NOT final embedded video URL |

## 2. Per-unit comparison

| Unit | NBF Grade XI subject | Old-site simulation links mapped | Legacy unit video pages | Original Drive PDFs | External reading | Portal content status |
|---:|---|---:|---:|---:|---:|---|
| 1 | Physical Quantities and Measurements | 0 | 1 | 7 | 0 | Learning desk released; source PDFs previously on Drive |
| 2 | Vectors | 2 | 1 | 7 | 0 | Learning desk released; source PDFs previously on Drive |
| 3 | Translatory Motion | 4 | 1 | 1 | 0 | Learning desk released; source PDFs previously on Drive |
| 4 | Rotational and Circular Motion | 4 | 1 | 1 | 0 | Learning desk released; source PDFs previously on Drive |
| 5 | Work and Energy | 1 | 1 | 1 | 0 | Learning desk released; source PDFs previously on Drive |
| 6 | Fluid Mechanics | 5 | 1 | 0 | 0 | Full unit notes/MCQs not yet published |
| 7 | Physics of Solids | 2 | 1 | 0 | 1 | Full unit notes/MCQs not yet published |
| 8 | Heat and Thermodynamics | 4 | 1 | 0 | 0 | Full unit notes/MCQs not yet published |
| 9 | Waves | 7 | 1 | 0 | 0 | Full unit notes/MCQs not yet published |
| 10 | Electrostatics | 2 | 1 | 0 | 0 | Full unit notes/MCQs not yet published |
| 11 | Electricity | 0 | 1 | 0 | 0 | Full unit notes/MCQs not yet published |
| 12 | Electromagnetism | 0 | 1 | 0 | 0 | Full unit notes/MCQs not yet published |
| 13 | Relativity | 0 | 2 | 0 | 0 | Full unit notes/MCQs not yet published |
| 14 | Particle Physics | 0 | 1 | 0 | 0 | Full unit notes/MCQs not yet published |
| **Total** | | **31** | **15** | **17** | **1** | +2 general video pages |

The total unit video pages (15) plus general-interest pages (2) equals 17 referenced concept videos. **32 activity links? No: count only 31 original old-site simulations.** The nine enhanced portal labs remain a separate catalog.

## 3. Exact original video titles recovered

| Unit | Printed Google Sites video link title | Source PDF page | Linked destination type |
|---|---|---:|---|
| 1 | The Ultimate Race to Redefine the Kilogram | 2 | Original Google Sites video subpage only |
| 2 | The Misunderstood Nature of Torque | 3 | Original Google Sites video subpage only |
| 3 | Can You Perceive Acceleration? | 4 | Original Google Sites video subpage only |
| 4 | Rotational Kinematics & Moments of Inertia | 5 | Original Google Sites video subpage only |
| 5 | Kinetic Energy & Work-Energy Transformations | 6 | Original Google Sites video subpage only |
| 6 | The Strange Physics of the Magnus Effect | 7 | Original Google Sites video subpage only |
| 7 | How To Make Graphene (The Nobel Prize Discovery) | 8 | Original Google Sites video subpage only |
| 8 | What is NOT Random? (The Thermodynamic Arrow of Time) | 9 | Original Google Sites video subpage only |
| 9 | Does gravity obey the rules of quantum mechanics? | 10 | Original Google Sites video subpage only |
| 10 | The Most Misunderstood Concept in Physics | 11 | Original Google Sites video subpage only |
| 11 | The Biggest Misconception About Electricity | 12 | Original Google Sites video subpage only |
| 12 | Do we know how magnets work yet? | 12 | Original Google Sites video subpage only |
| 13 | The Special Theory of Relativity Series | 13 | Original Google Sites video subpage only |
| 13 | What Happens If You Keep Slowing Down? | 13 | Original Google Sites video subpage only |
| 14 | The Ultimate Guide to Particle Physics | 14 | Original Google Sites video subpage only |
| General | Physics VS Animation (Alan Becker) | 14 | Original Google Sites video subpage only |
| General | The Strange Math That Predicts (Almost) Anything | 14 | Original Google Sites video subpage only |

**Special title/URL mismatch requiring future verification:** The Unit7 PDF index displays **'How To Make Graphene (The Nobel Prize Discovery)'**, but its original Google Sites URL ends with `/the-molecular-limits-of-materials`. The manifest deliberately preserves both values; confirm the underlying player title using the Google Sites editor before substituting a direct video link.

## 4. Public-link migration in this PR

- `portal/legacy-hssc-resources-v73.json` preserves exact Google Sites video page URLs, source page numbers, 17 original Google Drive URL references, and the one Unit7 outside reference. Each source is labeled as external and originally public as verified.
- `portal/legacy-hssc-resources.html` is a responsive accessible separate resource directory with Grade XI Unit1–14 dropdown, keyword search, sections for original Drive PDFs / original Google Sites video pages / extra reading, clear public access notices, explicit external navigation and bookmarkable `?unit=N` links.
- All original source Drive PDFs stay **unchanged and unwatermarked**. Downloads depend on Drive viewer and existing owner permissions. These are **NOT** uploaded as PDFs to GitHub and **NOT** protected by Firebase login.
- Active and planned unit cards in the signed-in Grade XI learning hub show their source handout/video link count and a shortcut to the appropriate unit in this index. The existing 31+9 simulation library is unchanged.
- Original 1,690 MCQs, Grade XI units6–14 course-release statuses, registration, auth, reporting, student data, Grade 9 pages, Google Sites sharing and Firebase security configuration are unchanged.
- As a lossless reference, the source manifest also stores 17 other old **Google Sites lecture/notes/exercise subpage URLs** and the original old Test Builder subpage URL. Their actual page bodies are not accessible and **they are NOT marked migrated** merely because their old links are archived.

## 5. Follow-up steps before saying "everything was moved"

1. **Video end-target audit:** open each old Google Sites video subpage in the site editor; copy the true original YouTube / Vimeo / authorized video URL and creator title. If hosted player embeddable, use its official embed; otherwise link to the original host. Do **not** download or re-upload third-party videos; use attribution and rights-compliant links.
2. **Drive notes authorization:** decide when to replace existing public Reader links with course-entitled access. Firebase Storage requires a Blaze billing account and appropriate tested Storage rules; no billing changes authorized. Never assume a hidden portal UI protects direct Drive URLs.
3. **Academic & SLO cross-check:** Unit1–5 notes already contain source material, but content/key/source updates are separate quality PRs. Do not silently import teacher-only marking keys as an independently private resource.
4. **Other legacy site pages:** Home and cross-grade navigation, additional activities pages and any embedded Drive files missing from this index still require a separate inspection. The 14-page PDF establishes HSSC-I index, not the entire Google Sites site.
5. **Privacy review then migration:** only once Grade IX and XI sources are safe in the new portal, adjust old site's publication and every Drive file permission. This PR **does not** make anything private or change a single Google-hosted resource.

## 6. Academic and security checks

- Actual linked resources remain public external data until genuinely protected. Students must not interpret login-gated navigation as an access-control boundary.
- The index permits only exact expected `https:` origins and route patterns: Google Drive /file/d/.../view for PDFs, Google Sites /view/physics-with-sir-najam/ for legacy concept pages, and the original Lumen Learning chapter.
- Page title strings are inserted using textContent to prevent HTML injection. External links use `rel=noopener noreferrer`.
- CI uses only synthetic content, validates 31 crosswalk records, real GitHub file paths, 15+2 video pages, 17 Drive handout records, 1 external reference, unit filtering and mobile view. No tests access real learner accounts or write external files.
