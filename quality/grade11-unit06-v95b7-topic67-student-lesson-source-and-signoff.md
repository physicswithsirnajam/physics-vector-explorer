# V95-B7 — Unit 6 Topic 6.7 Superfluidity: rights-safe final topic lesson and teacher acceptance record

**State:** seventh of seven substantive public **student lesson previews**. The whole Unit 6 course remains **planned**, not officially certified or published as a completed course. Work follows independently verified merged **PR #103**.

## Sources actually reopened

1. Private teacher-prepared combined `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` (577 pages): **pp.289–291** of Part B directly reopened for definitions, viscosity, ⁴He/³He values and caveats; **pp.298–303** Part C directly reopened for all 11 teaching sections, eight temperature calculations, 10 conceptual checks, wall-film and vortex descriptions, pressure/temperature diagram reading; **pp.304–306** Part D directly reopened including exact figure provenance notice, Q1–10 and curriculum boundary. Companion merged `quality/grade11-unit06-v94c2-topic67-detailed-qc.md` inventories **Part B pp.289–297 (48 authored Q&As), Part C pp.298–303 (11 sections), Part D pp.304–311 (32 authored tasks)** and QC issues T67-01…11.
2. Official teacher-provided **FBISE HSSC-I Physics Assessment Framework PDF p.12**: **P-11-B-43 Summative / Understanding** — describe zero-viscosity superfluidity and effects of wall creep and persistent vortices. It does **not prescribe vortex-energy, universal critical angular velocity, numerical helium phase boundaries or temperature-conversion derivations**.
3. Owner's compiled **Part D p.304 explicitly states its second visual is a reproduced original NBF Figure 6.17 excerpt**. We have deliberately NOT copied, traced, imported, or published this protected diagram. Original printed **NBF p.106 and Figures6.16/6.17** have **not** been independently cross-checked image-by-image here. Source-reported benchmarks and region names are appropriately qualified, not asserted source-exact from a directly inspected original print.
4. The medical technology context on printed NBF **p.107** is marked **chapter-wide enrichment**, not separate Topic6.7 B43 examination material.

## Student preview implementation

- `portal/unit-06-topic-67-study-v95b7.html` — **8 sections**: zero-viscosity meaning; thin-film wall creep; persistent quantized vortex onset; isotope benchmarks and non-numeric pressure–temperature reading; real-world science/cooling/superconductivity distinctions; **8** fully shown supplementary source-based temperature calculations; **2** local interactive aids; **10** concept explanations with native `details/summary`. Accessible landmark, keyboard labelled fields, proper units, and source distinction.
- Three **independently authored** SVGs:
  1. `assets/illustrations/unit6-v95b7-superfluid-film-original.svg`: thin-film path over an exposed open rim. Not a copy of NBF Figure6.16; explicitly excludes bulk jumping.
  2. `assets/illustrations/unit6-v95b7-vortex-onset-original.svg`: possible vortex-free, onset and multiple-vortex arrangements. No invented experimental speed or required vortex count.
  3. `assets/illustrations/unit6-v95b7-phase-axes-guide-original.svg`: **axes and separate list** of solid, normal liquid, superfluid and gas. **No phase-boundary curves, coordinates or region locations** are invented because the protected original Figure6.17 has not been verified; not a reconstruction or reproduction.
- `portal/unit-06-topic-67-study-v95b7.js`: local-only Kelvin, millikelvin, microkelvin and Celsius conversion, isotope benchmark comparison, three preset examples, and **non-numeric qualitative observation chooser**. Does not assign actual phase from temperature alone, compute vortex energy, infer a universal onset value, record scores or store/transmit input.
- Existing navy/gold `portal/unit-06-study-v95b1.css` and original `superfluidity-explorer.html` simulator reused. `portal/unit-06-learning-desk-v95a.html` Topic6.7 Read now links to the new study lesson and closing statement identifies all **seven** preview lessons, while keeping course-release caveat. All 7 topic MCQ previews (80 each), 560 provisional Unit6 items and 5 original simulations remain in place.

## Source-grounded supplementary conversion audit

| Example from owner prepared Part C | Correct result | Status |
|---|---|---|
| 2.17 K × 1000 mK/K | **2170 mK** | Supplementary, not B43 derivation |
| 0.0025 K × 1000 mK/K | **2.5 mK** | Supplementary |
| 2.17 K / 0.0025 K | **868** | Ratio of source-reported rounded reference values only |
| 2.17 K − 0.0025 K | **2.1675 K** | Supplementary benchmark difference |
| 3.0 mK / 1000 | **0.0030 K** | Supplementary |
| 0.0025 K × 10⁶ μK/K | **2500 μK** | Supplementary |
| 2.17 K − 273.15 | **−270.98 °C** | Supplementary |
| 2.17 K − 1.50 K | **0.67 K** | Does not determine physical phase alone |

No mathematical result in these examples requires answer replacement. The source attributes helium-4 transition ≈**2.17 K** and helium-3 ≈**0.0025 K (2.5mK)** to the prepared NBF p.106 information box. These are **source-reported** rather than verified exact original printed measurements; pressure/isotope qualification is mandatory.

## Eleven targeted teacher issues inherited from V94-C2.7

| Issue | What this public preview does | Remaining review |
|---|---|---|
| **T67-01** | η=0 Pa·s described as an ideal viscous-friction property, **not no mass, density, gravity or all dissipation** | Teacher final wording signoff |
| **T67-02** | Source-reported 2.17K/0.0025K with isotope/pressure qualifications and visible conversions | **Original printed p.106 information-box source match outstanding** |
| **T67-03** | Separately authored accessible thin-film illustration; clarifies no bulk jump and open rim path | Printed Fig6.16 original fidelity review pending |
| **T67-04** | Vortex onset and discrete circulation qualitative; no ungrounded critical-angular-speed or energy equation | Teacher quantum model signoff pending |
| **T67-05** | Protected original Fig6.17 **not republished**; original axes-only reading aid purposely omits all phase-boundary curves and locations | **Compulsory original phase source review pending** for real graph reading |
| **T67-06** | Eight temperature worked examples labelled **supplementary**, not original NBF numerical exercises | Teacher provenance check |
| **T67-07** | Compression/expansion cooling acknowledged as broad context and **not a laboratory recipe** | Teacher source exact-text check |
| **T67-08** | Gyroscopes, slow-light, neutron-star and superconductivity cases qualified | Teacher examples and claims review |
| **T67-09** | NBF p.107 medical technology excluded from B43 topic specificity | Chapter-wide enrichment later |
| **T67-10** | Check η, ⁴He, ³He, μK, MPa/K, original SVGs, alt, print CSS, 390px mobile/projector UI via CI | Manual classroom screen/print approval |
| **T67-11** | B43 declared **Summative / Understanding at outcome level**, 80 provisional individual MCQ mappings still unsigned | **Individual item-level SLO and cognitive audit pending** |

## Hard release boundary

- The full-course route `portal/unit-06.html` **remains absent**, and `portal/learning-catalog.json` GradeXI Unit6 stays **planned**, assessments **not-published**.
- Current provisional inventory **560 Unit6 / 2,250 GradeXI**, **136 standalone situation MCQs**, **zero** shared genuine scenario groups, **zero** source figure held items and five original simulations; no source keys, rights-sensitive private master files or copied textbook images are exposed.
- `quality/grade11-unit06-v94d-signoff-matrix.json` must remain **topicTeacherApproved:false**, **studentLessonReady:false**, and **releaseApproved:false** until teacher explicitly authorizes them after source and page review.
- No changes to school grades, authentication, access rules, Firebase or billing. No asynchronous publication claims.
- **Next after teacher merge:** V95-C Unit6 assessment integration and per-item source/SLO/answer verification, followed by V95-D accessibility, original-figure rights, teacher projector/print and final course release gates. Do not declare Unit6 complete or begin Unit7 solely because the seventh lesson preview exists.
