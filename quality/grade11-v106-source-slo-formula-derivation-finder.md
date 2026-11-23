# V106 — Grade XI source-checked derivation, formula and SLO study shortcuts

## User goal

After confirming that V105 fixed the square-box Unicode vector-arrow rendering issue, continue our send-up priority: **students need a one- or two-click route to textbook-related derivations, formulas and SLO notes**, without digging through long guides and without falsely treating formative material as summative.

The existing Exam Quick Access (V101), numbered example/numerical finder (V103), and short/comprehensive answer finder (V104) are retained. This update only indexes already-existing, public Grade XI lesson sections and adds a direct finder's shortcut.

## Checked public page inventory

This is a **source-checked portal navigation index** based on current repository HTML with explicit stable `id` anchors. It is NOT a fresh textbook exercise transcription, independent answer audit, official FBISE marking scheme, certified full SLO coverage report or final assessment release.

New `portal/verified-slo-study-index-v106.json` contains exactly **48 individual original-page anchors**:

| Unit | Sources | Total |
|---|---|---:|
| 1 | Unit 1 source-related study guide (estimated quantities, derived units, dimensional homogeneity and derivation, precision, uncertainty, propagation and revision) | 8 |
| 2 | Existing dedicated vector formula sheet: components, dot and cross products, integrated relations, examiner tips | 5 |
| 3 | Existing motion study guide (equations, free fall, projectiles) and collision guide (drag, momentum, elastic and inelastic collisions) | 7 |
| 4 | Rotational, centripetal, artificial gravity, angular momentum, centrifugation study sections + summative SLO audit | 13 |
| 5 | Work and Energy source-mapped SLO table, work graph, conservative forces, derivation of kinetic energy, resistive work theorem | 5 |
| 6 | Seven provisional detailed topic study sheets with source-anchored summaries, including Archimedes, continuity and Bernoulli school derivations | 10 |
| **Total** | **7 derivation shortcuts; 22 formula/method sections; 19 SLO/concept sections** | **48** |

The new finder `portal/slo-study-finder.html` offers Grade XI Unit 1–6, resource-type filters (derivations / formulas / SLO notes), optional topic or SLO search, source-labelled assessment status, result counts, and fallback to existing Exam Quick Access. It is public, responsive and does not collect student data.

## Explicit academic safety guardrails

- **P-11-A-01 estimating** is formative; **P-11-B-03 motion equation derivation** is formative; **P-11-B-11 momentum foundation** is formative. These labels are inherited from current approved-source mapping in existing study guides and remain visible.
- A studied derivation does **not automatically** mean that exact derivation is a summative theory examination question. The finder links to material and preserves the associated SLO-level boundary.
- Unit 6 Topic 6.5 school Bernoulli derivation includes **P-11-B-39 formative background**, alongside B-40. It must not be promoted as B-39 summative exam eligibility.
- **All Unit 6 links remain explicitly provisional**; an already-published, detailed learning-topic page is not equivalent to a fully reviewed MCQ question bank, individual SLO certification or complete end-of-unit question release.
- Entries like Unit 1 summary and Unit 4 audit support revision; neither is a separately certified official formula insert.
- Actual school-assigned chapters may differ from all published Grade XI units. Do not imply that a student must study every unit for the approaching send-up.
- Original mathematical text, worked examples, question options, answer keys, SLO bank data and printed textbook source scans are NOT modified.

## Production changes

1. New public standalone `portal/slo-study-finder.html` — accessible, filterable one-click direct source-link tool.
2. New `portal/verified-slo-study-index-v106.json` — 48 source-grounded shortcuts, status and provenance metadata.
3. Small new link on `portal/exam-quick-access.html`; all prior original 41 resource links and the V103/V104 finder links stay present.
4. New source/browser test script, workflow and this quality note.

No Firebase, Firestore, Authentication, App Check, protected lessons, teacher/student personal details, grading, MCQ submissions, backend reporting, PDF watermark, logo, interactive simulator or analytics changes.

## QA gates

- CI source audit requires 48/48 `href` targets to match an existing `portal/*.html#id` exactly and classify 7 derivation, 22 formula and 19 SLO-note entries with counts [8,5,7,13,5,10] across units.
- Explicit assertions preserve formative A-01, B-03 and B-11, plus Unit 6 provisional status and B-39 formative background.
- Desktop 1280px, mobile 390/320px actual Chromium navigation. Test Unit 6 has three provisional derivations; Unit 2 has four formula groups and **no invented derivation**. Test search by SLO and valid empty result fallback.
- Actual clicks open the corresponding sections of Unit 1 dimensional derivation, Unit 3 motion derivation, Unit 5 kinetic-energy derivation and Unit 6 Bernoulli derivation.
- Run V101-A, V103, V104 and V58 tests to protect old resource inventory, student links and unfinished quiz warning; all other GitHub Actions including App Check/branding and watermark guards must also pass.
- Remain **Draft** until all latest-HEAD workflows green and owner reviews Files changed.

## Manual owner acceptance after merge

1. Open `https://physicswithsirnajam.github.io/physics-vector-explorer/portal/slo-study-finder.html?unit=3&kind=derivation` and confirm **Equations of motion from a velocity–time graph** is clearly **Formative**, then click the link to reach the correct existing guide section.
2. Select **Unit 2 → Formula sheets and relations**, check components/dot/cross/integrated formula sections; inspect the now-correct vector arrows.
3. Select **Unit 5 → Derivations**, click **Deriving the kinetic-energy expression**.
4. Select **Unit 6 → Derivations**, confirm three source links and all labels **Provisional**. Open Bernoulli; do not misclassify the B-39 formative context.
5. Save/print an eligible formula sheet and confirm the previously deployed watermark still appears in PDF output.

**Security launch locks:** Firebase App Check remains **Monitoring / enforcement OFF** pending further real traffic validation. Student issue reporting stays **Copy only**; no teacher-admin send enabled. Independent academic certification of individual answer-bank/MCQ content remains pending.

## Immediate next roadmap priorities

- Increase verified explicit textbook exercise/source-page deep linking, especially Unit 5–6 short/long/numerical problems; do not fabricate absent exact NBF exercise numbers.
- Maintain scientific QC of students' exam-critical banks, actual grouped stimulus figures, SLO/cognitive mapping, and clear print/PDF/mobile notation.
- Finish Unit 6 formal academic signoff, then expand Grade XI Unit 7 → Unit 10, then Units 11–14; Grade IX improvement after XI; only then full Grade X and XII.
