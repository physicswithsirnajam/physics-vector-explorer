# V95-B1 — Topic 6.1 student lesson: source, accuracy and teacher signoff

**Scope:** New detailed, public *preview* lesson `portal/unit-06-topic-61-study-v95b1.html`, linked from the **Read** stage of the existing `portal/unit-06-learning-desk-v95a.html`. The original seven-topic scaffold and all public original MCQ keys remain intact. Release is a teacher-reviewable educational preview **not an approved full Unit 6 course**.

## Directly reopened source evidence

- Teacher's **private** `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, combined pp. **26–36** (Part C pressure derivation, flotation, apparent weight, ship stability, examples) and **40–45** (Part D classroom questions and source-attributed Example 6.1/Assignment 6.1) were reopened. The overall C2.1 first-pass review includes prepared **Part B 52, Part C 15 sections, Part D 24 prompts**; that entire bank is NOT copied into the new website.
- Merged PR **#89**: `quality/grade11-unit06-v94c2-topic61-detailed-qc.md`, amendment IDs **T61-01…T61-08**. The preview expressly implements scientific assumptions and separately labels supplementary material.
- Teacher's official **FBISE Grade XI HSSC-I assessment framework**, PDF p.11: **P-11-B-33** and **P-11-B-34** are **Summative / Application** at **outcome level**, not proof that each generated sample/MCQ is officially certified.
- Independently created `assets/illustrations/unit6-figure62-reference.svg` was previously compared with user-supplied Figure 6.2 in V93. It is included via `<img>` with descriptive alt and source-distinction caption. **NBF printed pp.89–91, Figure 6.1 and exact original Example/Assignment 6.1 wording have not been re-compared item-by-item here**, so neither example is claimed as verbatim NBF reproduction. No protected originals or personal PDF pages are committed.

## What V95-B1 students can actually do

1. Read the pressure-to-upthrust derivation with equal-area immersed vertical cylinder, force directions and the atmospheric pressure cancellation.
2. Distinguish fully submerged from partially submerged displaced volume; separate `F_B=W` **free-floating equilibrium** from general immersed bodies.
3. Work through apparent weight, floating fraction, ship buoyancy/stability/strength and ideal ballast.
4. View four **newly authored pedagogical worked problems**: data associated with prepared NBF Example6.1 (cube, **9.8 N**) and Assignment6.1 (iron, **0.020408… m³**, **1560 N**), plus explicit teacher supplements (5kg object **49/19.6/29.4 N**, and a boat limited to 0.8 m³ needing 0.9 m³ displacement).
5. Enter fluid density, displaced volume and object weight in a **client-side only** calculator and read the resulting upthrust/instantaneous force comparison. It **does not** claim a guaranteed final float/sink state from an input submerged volume.
6. Reveal **six** conceptual revision explanations, use the NBF Figure6.2-inspired but separately authored illustration, then return to existing simulation and MCQ preview.

## Amendment audit resolution for a **provisional** student lesson

| ID | What this preview handles | What remains before final course |
|---|---|---|
| T61-01 | Official B33/B34 outcomes tagged Summative/Application; no per-question FBISE certification | Item-level review across actual public MCQ bank pending |
| T61-02 | Explicit condition on free flotation, apparent weight and depth-independent full immersion | Teacher signs off pedagogical emphasis |
| T61-03 | Six-step pressure derivation, gauge/absolute distinction, original educational V93 figure | Printed NBF Figure6.1/source fidelity still pending |
| T61-04 | Full SI conversions and source-labelled worked numerical steps | Compare exact source wording NBF pp.89–91 before “verbatim” claim |
| T61-05 | Separate ship **buoyancy, stability and structural reliability** explanation; ideal cargo comparison explicitly not vessel certification | Real-world engineering claims limited to textbook-level model |
| T61-06 | New phrasing; source-guided labels and figure copyright restrictions | Original NBF printed pp.89–91 not fully compared |
| T61-07 | Does not make unqualified moving/open-mug hand-force claims | Optional dynamic mug experiment can be added later |
| T61-08 | HTML superscripts/subscripts, descriptive accessible math, projector/mobile/print styling and automated 390px browser check | Final teacher manual accessibility and projector acceptance pending |

## Exact independent arithmetic regression

- Cube: `L=.10m`, `V=.001m³`, `F_B=1000×9.8×.001=9.8 N`.
- Iron: `F_B=200 N`, `V=200/9800=0.020408163…m³`; `ρ_iron=7800 kg/m³`, `W=1560 N`; `W_app=1360 N`.
- Supplementary: uniform block `600/1000=.60` submerged fraction; 5kg/2litre object `W=49 N`, `F_B=19.6 N`, `W_app=29.4 N`; 900kg load needs `0.9m³` greater than `0.8m³` specified upper volume.
- Optional source boundary: an object in uniform water experiencing fixed immersed volume has unchanged ideal buoyancy with depth. A ship's hydrostatic displacement does not prove restoring stability.

## Release invariants

The new route is *preview-only*: full `portal/unit-06.html` remains absent. `portal/learning-catalog.json` stays `status:"planned"`, `assessmentStatus:"not-published"`, with **560** provisional Unit6 and **2,250** GradeXI questions, 136 independent situations, zero figure holds, five original simulation links and per-question board verification `false`. No GitHub-published teacher master PDF or NBF original scan, student account, Firebase, school marks, payments or permissions modified. The merged V94-D matrix's **topicTeacherApproved:false** stays unchanged until explicit teacher signoff.

**Next:** After teacher review and CI, this can be merged as a preview. Continue V95-B2 through V95-B7 for the other six lessons and review final chapter rights, original source figures, content pedagogy, mobile/projection/print and assessments before changing complete Unit6 status to available.
