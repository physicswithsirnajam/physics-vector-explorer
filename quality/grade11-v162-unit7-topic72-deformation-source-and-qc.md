# V162 — Grade XI Unit 7.2 source-checked student lesson (NBF pp. 116–121)

## Academic direction: actual Unit 7 content first

PR #262/V161 merged. After the lengthy teacher-security/backend prototypes, this PR deliberately returns to completing the **NBF Physics of Solids unit**. The user's already available, complete NBF Grade XI Physics textbook PDF was consulted **visually**: printed Unit 7 pp. **112–126**, including the full Section **7.2** on pp. **116–121**. The file's SHA-256 in the existing local workspace was `00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe`. The copyrighted textbook PDF/scan itself **is not committed to GitHub**.

We already have the user's original **Topic 7.1** boxed 80-question Word bank (private) and source-bound V154 teacher review register; no textbook pages need to be requested for Sections 7.2 or 7.3 right now. A library search on **25 November 2026** also confirmed that the user's earlier source materials are already available for reuse: **Topic 7.2 Part A (80 MCQs, solved DOCX/PDF); Topic 7.2 Part B (56 comprehensive SLO Q&A, solved DOCX/PDF); Topic 7.3 Part A (80 MCQs, solved DOCX/PDF); Topic 7.3 Part B (solved Q&A DOCX/PDF); and end-of-unit five numerical problems (solved DOCX plus student PDF)**. These source files remain in the user's private library, not in the public GitHub repository. They should be individually reconciled with the NBF book and official framework **before any student MCQ/question-key import**. A public text-only lesson does not replace the owner's source bank or its academic verification.

## This PR: one accessible, public, unscored lesson

**New:** `portal/unit-07-topic72-deformation-v162.html` — a standalone original teaching page aligned to the existing Physics with Sir Najam navy/gold visual hierarchy, using the checked-in **existing official logo image unchanged**.

**Small discoverability change:** `portal/unit-07-learning-intro-v145.html` links to the new unscored 7.2 lesson. It **does not change** the Unit 7 catalog status `planned`, `questionBankCount:0`, `assessmentStatus:not-published`, or any student Test Builder/assessment permission. The original 7.1 source introduction and its four recall prompts remain intact.

The new study page covers:

| NBF section / pages | Source-checked study coverage | Formulas and distinctions |
|---|---|---|
| **7.2**, p.116 | Deformation under applied load; reversible elastic versus irreversible plastic changes | Deformation is a dimensional/shape change, not itself a force |
| **7.2.1**, pp.117–118 | Stress and strain; tensile/compressive, shear and volume modes | Stress `F/A` in Pa; tensile strain `ΔL/L`, shear strain `Δx/h`, volume strain `ΔV/V`, all dimensionless |
| **7.2.2**, pp.118–119 | Young's, bulk and shear moduli and their loading modes | `Y=FL/(AΔL)`; `B=−Δp/(ΔV/V)`; `G=(F/A)/(Δx/h)`; all in Pa in linear elastic conditions |
| **7.2.3**, pp.120–121 | Typical ductile stress–strain curve; elastic/plastic response; proportional versus elastic limit; upper/lower yield, ultimate strength, fracture | Graph has stress on **vertical axis** and strain on **horizontal axis**; original accessible SVG schematic with A–E landmarks |
| Teacher-created unscored practice | Interactive, SI-unit stress–strain–Young calculator with correctly stated assumptions; five expandable conceptual prompts | No answer keys, official grades, student attempt saving or score release |

The **original SVG** includes `<title>` and `<desc>` for accessible interpretation, and the calculator is pure local JavaScript with `textContent` output (no Firebase, analytics or external calculator service). The official logo is referenced as the existing asset, not redrawn. The page has skip navigation, clear headings, focus states, responsive layouts and print fallback.

### Independent physics calculations used for QA

The original unscored teacher-created wire values are **F=400 N**, **A=200 mm² = 2×10⁻⁴ m²**, **L=1.5 m**, and **ΔL=0.015 mm = 1.5×10⁻⁵ m**.

- Stress `σ=F/A=400/(2×10⁻⁴)=2.000×10⁶ Pa=2.000 MPa`.
- Strain `ε=ΔL/L=(1.5×10⁻⁵)/1.5=1.000×10⁻⁵` (dimensionless).
- Young's modulus `Y=σ/ε=2.000×10¹¹ Pa=200.000 GPa`.

The calculator independently checks nonfinite/nonpositive inputs and refuses the unphysical ≥100% elongation as a *linear-elastic teaching calculation*. This does **not** establish a real material's yield point, so the UI clearly states that linear elastic behavior is an assumption, not a measurement certification.

### Science and source integrity decisions

- The textbook calls elastic modulus a constant. For scientific accuracy, the lesson explicitly restricts constant stress/strain ratio to the **linear elastic/proportional** range, rather than suggesting Hooke's law is universally true.
- The typical ductile curve distinguishes **proportional limit A** from **elastic/yield region B**; D denotes maximum engineering stress and E fracture. This interpretation follows the source's p.120–121 explanation, but the SVG is **an original schematic, not an exact source figure**.
- Bulk modulus is positive in compression with a **minus sign** when a signed negative volume change is used. The lesson distinguishes pressure, stress, strain and elastic modulus units.
- The textbook p.119 table of material constants is **not recopied as verified numerical reference data**; the study page teaches the formulas without amplifying any questionable table values.
- The book's Examples **7.1–7.2** are cited by their printed pages without copying the original exercise prompt/marking key. End-of-unit exercises and worked solutions remain later milestones.

### What source pages remain for the rest of Unit 7

- **7.1 Classification of Solids:** pp.113–116, public intro already exists; original 80 MCQs reviewed editorially but 80/80 teacher science/cognitive approvals still pending; source keyed explanations **Q10/Q76** need correction and Q15/Q62 stems need verification.
- **7.2 Deformation in Solids:** pp.116–121, this V162 unscored learning lesson; topic-specific MCQ bank and formal answer key remain unapproved/unpublished.
- **7.3 Elastic Potential Energy:** pp.122–124, next source-anchored unscored learning lesson, including Hooke's law, force–extension graphs and original examples. **Check p.122 axis orientation carefully** when teaching area/work; work conventionally equals `∫F dx`, with force on the vertical axis and extension horizontally.
- **NBF chapter exercises:** pp.125–126 contain **10 original textbook MCQs, 11 short questions, 8 comprehensive questions and 5 numerical problems**, besides earlier three worked examples and assignments. These must be independently solved and verified before providing students an authoritative answer key.
- **Known textbook QC flag for future numerical stage:** On printed p.126, numerical **7.5** visibly states a steel rod diameter of **50 cm** but lists answer **2.5×10⁵ N m⁻²** for **500 N**. That listed answer matches roughly a **5 cm** rod, not **50 cm** (`σ≈2.55×10³ Pa` if diameter is 50 cm). **Do not silently fix the textbook**; flag to the teacher and create an explicit source-correction decision before keyed publication. Similarly p.124 Example 7.3 inconsistently labels `r=0.004 m` while its area calculation correctly uses radius `0.002 m` from diameter `0.004 m`. The source should be taught with a transparent caveat, never imported without QC.

The NBF chapter-cover SLOs on printed p.112 were inspected, and the owner's previously uploaded official **FBISE Assessment Framework for Physics Grade-XI, Curriculum 2022–23 / Scheme of Studies 2024** was independently retrieved from the file library (PDF page 10, internally labelled *Page 4 of 21*; P-11-B-28 continues on PDF p.11). The relevant official theory classification is:

| Official SLO | Assessment form | Cognitive level | Lesson placement |
|---|---|---|---|
| **P-11-B-22** — structures of crystalline/glassy/amorphous/polymeric solids | Summative | Understanding | Existing Section 7.1 |
| **P-11-B-23** — one-dimensional deformation under force (tension/compression) | Summative | Understanding | **V162 Section 7.2** |
| **P-11-B-24** — define and use stress, strain and Young's modulus | Summative | Application | **V162 Section 7.2** |
| **P-11-B-25** — experiment to determine Young's modulus of a wire | Summative | Understanding | **V163 metal-wire experiment**, NBF Section 7.3.1 p.122 |
| **P-11-B-26** — elastic/plastic deformation and elastic limit | Summative | Understanding | **V162 Section 7.2** |
| **P-11-B-27** — justify and use force–extension graph area as work | Summative | Application | **V163 Section 7.3** |
| **P-11-B-28** — elastic potential energy from force–extension area; E=½Fx=½kx² | Summative | Application | **V163 Section 7.3** |

This source confirms *topic-level framework alignment*, **not** that any individual future MCQ or marking key is teacher-approved. The textbook's additional bulk/shear-modulus treatment is included as chapter learning, but **P-11-B-24 specifically names Young's modulus**; do not uncritically classify all bulk/shear numerical items as summative exam items without further SLO scope justification.

## Automated quality gates, release protection and limits

`scripts/test_grade11_v162_unit7_topic72_study.cjs` uses **real headless Chromium** on a local static server, at **1280, 390 and 320 px**, to check page visibility, scientific text/units, original SVG title/description, all five collapsed self-check prompts, the working calculator and SI conversions, nonphysical 100% elongation refusal, navigation from the existing 7.1 learning page, image availability, and no horizontal overflow.

Existing GitHub CI checks preserve the 80-unit7 review HOLD, 2,250 existing provisional Grade XI question identities, Unit6 560 teacher pending signoffs, current production App Check entrypoints and the previous no-deploy teacher callable contract. **No Firebase Admin, Cloud Function, teacher login, production Rules or private answer source is used**.

**Publication boundary:** Publishing this unscored concept study page is not publishing a scored MCQ. `question-bank/manifest.json`, `portal/learning-catalog.json`, question-bank Unit7 files, source teacher review JSON, all private source Word content and answer keys remain unchanged. After V162, **0 Unit7 items are scored**.

## Sequence after this PR

**V163:** create the equally source-checked **7.3 Elastic Potential Energy** lesson, with careful force–extension graph explanation, `U=½Fx=½kx²=YAx²/(2L)` within the proportional range, independent calculation QC and a public study link.

**V164–V166:** original NBF exercise source checks in small batches: 10 textbook MCQs (scientific answer verification), 11 short plus 8 comprehensive responses, then all 5 numericals with explicit p.126 text/answer discrepancies. Reuse the existing private 7.2/7.3 teacher-authored 80-MCQ study banks and original solved question documents found in the user's library; do not invent, reconstruct or publish keyed answer records before full review.

**Later:** full teacher approval and **item-level** official framework alignment (topic-level SLO codes were verified above); scored Unit7 Test Builder activation remains a separate gated owner decision.

### Owner merge steps

Keep draft until latest-head V162 real-Chromium and App Check checks are green. Inspect **five changed files**: new lesson, modified 7.1 index link, QA, documentation and workflow. Click **Ready for review → Merge pull request → Confirm merge**. **No Firebase Console action.**
