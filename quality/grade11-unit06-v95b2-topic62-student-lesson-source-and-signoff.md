# V95-B2 — Unit 6 Topic 6.2 student study lesson: source, corrections and release boundaries

**Status:** teacher-reviewable public *preview*, not an officially certified full-course lesson. Builds on merged **PR #98** (Topic 6.1) and V95-A seven-topic desk. All existing public student question banks and answer keys remain unchanged.

## Source documents actually reopened

1. Owner's private `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` (577 pages): Topic 6.2 **Part B pp.65–77** with all **56** source-prepared Q&As; **Part C pp.78–87** with **14** top-level derivation/reference sections, both prepared NBF numbered exercise data sets and **eight** supplementary numerical illustrations; and **Part D pp.88–98** with **32** guided/reinforcement Q&As. These are *compiled PDF pages*, not original NBF page numbers.
2. Merged `quality/grade11-unit06-v94c2-topic62-detailed-qc.md`, PR #90, including its nine issue IDs `T62-01`…`T62-09` and independent arithmetic first pass. This new web lesson does **not** republish the private notes or claim to transcribe 56+32 original book questions.
3. Supplied official **FBISE Grade XI assessment framework**, PDF p.12: **P-11-B-41** (real fluids are viscous) and **P-11-B-42** (viscous retarding forces) are **Summative / Understanding** at *SLO level*, not a blanket official cognitive assignment to every generated MCQ.
4. Focused figure-image comparison from V93: NBF **Figure 6.3 (geese)** and **Figure 6.5(c) (parachutist graph)** checked in the earlier milestone; the web lesson links to existing original V90 educational illustrations. The new force diagram `assets/illustrations/unit6-v95b2-terminal-force-original.svg` was authored separately and expressly does **not** copy original NBF Figure 6.4. **Exact NBF printed pp.91–95, Table 6.1, original Figure 6.4 and Example 6.2/Assignment 6.2 phrasing remain unverified**. Do not claim exact textbook source art/text.

## What the student gets in V95-B2

- `portal/unit-06-topic-62-study-v95b2.html`: **eight** structured lesson sections: viscosity in real liquids/gases, Stokes' law, a six-stage simplified terminal-speed derivation, buoyancy correction as *supplementary*, paratrooper and geese, **five** complete numeric/graph examples, a model-validity input checker and **six** revealable conceptual revision items. Uses the existing navy/gold `unit-06-study-v95b1.css` design system.
- Interactive, *entirely local* `portal/unit-06-topic-62-study-v95b2.js`: enter dynamic viscosity η, radius in mm, relative speed and fluid density to obtain formal Stokes drag `F=6πηrv` and independent supplementary `Re=2ρ_fvr/η`. A safe creeping-flow preset and the prepared Example6.2 input preset let students compare model applicability. `Re ≪1` is necessary but not sufficient for exact physical validity; results always show "formal model" rather than claiming measured drag. Invalid/empty inputs are rejected; no account, storage, grade or network call.
- A freshly authored accessible terminal-sphere `SVG` with downward W and upward Fd/Fb and the two scientifically distinct balances; this is an educational force schematic, not a trace of NBF Fig6.4. Copyright/provenance caption and alternative text provided.
- `portal/unit-06-learning-desk-v95a.html` updated only in **Topic 6.2 Read**, retaining Topic6.1's V95-B1 link and unchanged seven topic/four-stage pathway, five original simulations and 560 MCQ practice.
- Revision/next-step navigation returns students to the connected existing `viscosity-terminal-velocity.html` simulator and `unit-06-topic-62-preview.html` provisional 80-MCQ practice.

## Independently recalculated results used by the student preview

| Teaching case | Original prepared numeric givens / attribution | Calculated result and physical boundary |
|---|---|---|
| Source-described **Example6.2** | r=2 mm, v=2m/s, η=1.9×10⁻⁵ Pa·s; π≈3.14 | Formal Stokes drag = **1.43184×10⁻⁶ N ≈1.43×10⁻⁶ N**. Using *supplementary* typical air density 1.2kg/m³, Re≈**505.3**; it does **not** satisfy creeping flow, and is not a validated real-air resistance prediction |
| Source-described **Assignment6.2** | r=0.3mm, η=1.8×10⁻⁵ Pa·s; explicit **assumed** raindrop ρ=1000kg/m³, g=9.8m/s², buoyancy neglected | Formal v_t=**10.88889m/s≈10.9m/s**. With *supplementary* ρ_air=1.2kg/m³, Re≈**435.6**; cannot be interpreted as actual measured real raindrop terminal speed |
| Teacher supplementary viscosity inversion | Fd=3.0×10⁻⁶ N, r=.50mm, v=.020m/s | η=**0.0159155 Pa·s** under the model, not independently measured fluid properties |
| Teacher supplementary small-sphere buoyancy | ρ_s=1200, ρ_f=1000kg/m³, r=50μm, η=.10Pa·s, g=9.8 | v_t≈**1.0889×10⁻⁵m/s downward** conditional on slow-flow Stokes regime |
| Graph-reading supplement | Downward speed 50→8m/s over approximate 5s | Approx average a=(8−50)/5=**−8.4m/s²** (downward positive); ratio 50/8=**6.25**; graph illustrations are estimates |

**No incorrect prepared numerical answer was silently replaced.** The crucial correction is *scope*: a formal computed result does not justify treating Stokes' drag as a physical law for fast raindrops or parachutes.

## Teacher amendment register — preserve originals, qualify student-facing material

| ID | Action implemented or recorded | Compulsory / optional and remaining verification |
|---|---|---|
| **T62-01** | Example6.2 shows formal 1.43×10⁻⁶N and an explicit approximate Re≈505 validity warning | **Compulsory addressed in preview**; original printed wording still unverified |
| **T62-02** | Assignment6.2 states missing density assumption and approximate Re≈436; formal 10.9m/s is not presented as a measured raindrop speed | **Compulsory addressed in preview**; original exercise transcription unverified |
| **T62-03** | Small sphere, creeping Newtonian flow, fluid/sphere densities and buoyancy are distinguished | **Compulsory addressed**; simulator stays an ideal educational model |
| **T62-04** | Explicitly states dimensional analysis cannot derive 6π | **Compulsory addressed** |
| **T62-05** | Parachutist and geese are not modelled as Stokes spheres; graph values approximate; car-window example marked discussion-only | **Compulsory addressed**; real flight depends on equipment/conditions |
| **T62-06** | Prepared 20°C Table6.1 values **not** republished as textbook-exact numbers; temperature trend is qualified | **Compulsory original Table6.1 check outstanding** |
| **T62-07** | New terminal force SVG is independently authored; links to preexisting V93-reviewed original V90 Fig6.3/Fig6.5(c) teaching art | **Compulsory original NBF Figure6.4 source-fidelity check outstanding** |
| **T62-08** | B41/B42 mapped as official Summative/Understanding **outcomes**, not individual certified MCQs | **Compulsory full per-MCQ review outstanding** |
| **T62-09** | Buoyancy correction, Reynolds number and extra numerical practice clearly labelled **supplementary** | **Provenance addressed**; teacher pedagogical signoff pending |

## Release and safety boundaries

This PR adds one detailed public preview and its original figure/checker, **not** full `portal/unit-06.html`. Full catalogue Unit6 remains `planned`, official assessments `not-published`, actual source MCQs **560** (GradeXI **2250**), situation items **136**, figure holds **0**, and B41/B42 item-level certification **false**. Signoff matrix `topicTeacherApproved:false` remains in place. No original NBF figure/photo/table page, owner PDF, school marks, Firebase rules, login/permissions, billing or answer key is committed.

After review and CI, the teacher can merge a *provisional study page*, then continue **V95-B3 Topic6.3 Fluid Flow**, and subsequent student lessons before Unit6 release acceptance and Unit7.
