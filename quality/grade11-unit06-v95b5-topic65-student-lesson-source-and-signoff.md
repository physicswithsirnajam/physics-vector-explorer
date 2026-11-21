# V95-B5 — Topic 6.5 Bernoulli’s Equation: student study preview, numerical verification and academic signoff

**Status:** Author-built public student **preview**, **not** a completed/teacher-certified NBF Unit6 course. Based on merged V94-C2.5 audit, verified merged PR #101 (V95-B4) and direct reinspection of the teacher's private source.

## Original source material directly reopened

1. Owner-private `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` compiled **pp.207–219** (Part C: 12 major sections, 12-step Bernoulli pressure-work derivation, 14 teacher-supplementary solved applications, 8 short checks) and accompanying V94-C2.5 register, which examined **pp.197–206** (Part B, 56 authored Q&As) and **pp.220–226** (Part D, 32 prepared questions). This PR *does not* copy the question bank or private PDF.
2. Owner-provided **FBISE HSSC-I Physics Assessment Framework PDF pp.11–12**:
   - **P-11-B-39: Formative/Application.** Justify pressure differences due to flow rates; **not independently summative in final theory**.
   - **P-11-B-40: Summative/Application.** Explain and apply Bernoulli's equation for **horizontal AND vertical** fluid flow. This is the relevant release target.
   - These are **SLO-level** classifications, not automatic per-MCQ item verification.
3. `quality/grade11-unit06-v94c2-topic65-detailed-qc.md` covers nine teacher amendment decisions **T65-01…T65-09** and the independent math checks.
4. Original printed **NBF pp.99–101** and original **Figure6.9** have **not** been completely independently compared; newly authored `unit6-v95b5-bernoulli-pressure-work-original.svg` (signed force work and heights) is explicitly *not* the textbook figure. Unlike other subtopics, the source's Topic6.5 Part C indicates **no separately numbered NBF Example/Assignment**; the student web lesson's 8 worked examples are **supplementary teacher-developed practice**.

## Student deliverables and curricular boundary

- `portal/unit-06-topic-65-study-v95b5.html`: **eight** detailed sections: ideal conditions, 12-step signed-pressure-work derivation, energy-per-volume and head (labelled supplementary), horizontal/vertical/equal-speed special cases, continuity coupling and limits, eight complete worked solutions, two interactive calculators and eight independent accessible revision checks.
- `assets/illustrations/unit6-v95b5-bernoulli-pressure-work-original.svg`: original accessible schematic with positive inlet work, **negative outlet work**, same volume V and shared height datum. No protected book artwork.
- `portal/unit-06-topic-65-study-v95b5.js`: client-only general outlet static pressure calculator and pressure/velocity/elevation **head in metres** explorer; presets **horizontal (169.5kPa)**, **rising acceleration (157.7kPa)** and **rising deceleration (136.4kPa)**. Input checking, Pa/kPa conversion, physical limit notes and no storage/network/account/grades.
- Existing navy/gold and mobile/print rules `portal/unit-06-study-v95b1.css` reused. Topic6.5 Read link added in `portal/unit-06-learning-desk-v95a.html`; Topics6.1–6.4 detailed lessons, all seven 80-MCQ previews and five original simulators remain unchanged.

## Eight independently recalculated worked examples

| Exercise | Prepared-master givens | Correct output | Model boundary |
|---|---|---|---|
| Supplement 1: horizontal | P1=180kPa, v1=2, v2=5m/s, ρ=1000 | P2 = **169.5kPa** | h1=h2; ideal |
| Supplement 2: vertical | P1=220kPa, v1=3, v2=4m/s, h1=2, h2=8m | P2 = **157.7kPa** | Both speed and height |
| Supplement 3: outlet speed | v1=1.2m/s, P1−P2=5400Pa | v2 = **√12.24 ≈3.50m/s** | Horizontal ideal; radicand ≥0 |
| Supplement 4: same speed | P1=120kPa, h1=12, h2=7m | P2 = **169kPa** | Δv=0 |
| Supplement 5: total head | P=180kPa, v=4m/s, h=3m | P/(ρg)=**18.3673m**, v²/2g=**0.816327m**, H≈**22.18m** | **Head form is supplementary** |
| Supplement 6: continuity plus energy | d1=8cm, d2=4cm, v1=1.5m/s, P1=200kPa | v2=**6.0m/s**, P2=**183.125kPa** | A∝d²; no real-pipe losses |
| Supplement 7: net pressure work | P1=180kPa, P2=150kPa, V=.020m³ | W=**600J** | Work on tracked fluid volume |
| Supplement 8: rises, slows | P1=150kPa, v1=4, v2=2m/s, h1=5, h2=7m | +6.0kPa kinetic and −19.6kPa elevation → P2=**136.4kPa** | Neither trend alone proves outcome |

There is no original textbook-numbered example/assignment copied. The prepared master's 14 worked cases remain teacher-only; the web lesson selects eight covering full horizontal/vertical B40, not exhaustive source publication.

## Teacher amendment register — V95-B5 disposition

| Issue | Preview response | Required future review |
|---|---|---|
| **T65-01** | Explicit same-streamline, steady, incompressible, near-inviscid, pump/turbine and height datum conditions | **Compulsory addressed in preview**; final teacher acceptance pending |
| **T65-02** | Twelve-step derivation highlights **W2 = −P2A2Δx2** and equal Δt, V, m | **Compulsory addressed**; compare original Figure6.9 before exact diagram claim |
| **T65-03** | Horizontal vs rising-but-slowing analysis; continuity/pressure distinction; no universal faster-lower-pressure slogan | **Compulsory addressed** |
| **T65-04** | Pa/kPa, same pressure reference, negative outlet gauge caveat, height signs, speed squared and head metres | **Compulsory addressed**, source verification pending |
| **T65-05** | B39 **Formative** clearly distinguished from B40 **Summative/Application** horizontal and vertical | **Compulsory addressed**, per-MCQ certification pending |
| **T65-06** | Original accessible SVG, *not* NBF Figure6.9; no original figures/scans uploaded | **Compulsory original printed pp.99–101/figure audit outstanding** |
| **T65-07** | All eight numericals explicitly **supplementary**, no implied printed NBF Example6.x or Assignment6.x | **Compulsory provenance addressed** |
| **T65-08** | Test checks ½ρv²/ρgh and signed differences, image, all links, responsive 390px/768px/1440px, print CSS | **Compulsory automated QA**, teacher projector and hardcopy review pending |
| **T65-09** | Both horizontal and vertical worked cases, plus mixed scenario, in lesson | **Teacher-approved assessment item-level/full B40 coverage still pending** |

## Immutable academic and technical release guards

- Full `portal/unit-06.html` **must stay absent**; catalogue Unit6 remains **planned**, assessments **not-published** and V94-D topic teacher signoffs false.
- No original source bank mutations: **560** provisional Unit6 MCQs, **2,250** GradeXI across six units, **136** independent situation questions, **0** original figure holds, **0** true shared-stimulus Unit6 groups, five existing original simulation routes.
- No original NBF textbook scan/figure, 577-page teacher PDF, school marks, answer keys, student data, billing, account access rules or Firebase configuration changed.
- Merge as a **student preview only** after all latest-head Actions green, teacher review of equations and page appearance, and post-merge Pages smoke test. Continue V95-B6 (Bernoulli applications) then B7 (superfluidity), V95-C assessment, V95-D final approval before full Unit6 release and Unit7.
