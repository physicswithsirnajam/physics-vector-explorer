# V95-B3 — Grade XI Unit 6 Topic 6.3 Fluid Flow: detailed student lesson provenance and release checklist

**State:** Provisional *public learning lesson* with independently authored educational figures and two browser-local numeric learning forms. **NOT** the finally approved full Unit 6 course. Builds on verified merged PR #99 (V95-B2) and retains seven-topic desk navigation.

## Actual private source basis reopened for this PR

1. Teacher's `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, compiled **pp.113–120 (Part B: 48 author-created Q&As)**, **pp.121–126 (Part C: 10 teaching sections, supporting seven calculations C1–C7 and an original volume–time graph)**, **pp.127–136 (Part D: 32 author-created items)**. We specifically reopened pp.121–126 to verify arithmetic/source labels and pp.127–136 for sample questions and exclusions.
2. Merged V94-C2.3 source audit `quality/grade11-unit06-v94c2-topic63-detailed-qc.md` with teacher amendment register **T63-01…T63-09**; this audit's figure comparisons and numerical checks remain the source of prior verification scope.
3. Official teacher-supplied **FBISE Grade XI assessment framework p.11**, where **P-11-B-35** is **Summative / Knowledge + Understanding** at *outcome* level. It asks students to define/apply steady/streamline or laminar, incompressible and non-viscous flow in an ideal-fluid context. The seven worked flow-rate examples and the graph are **supplementary teaching development, not extra prescribed B35 numerical examination requirements**.
4. Teacher had previously supplied original NBF **Figure 6.6(a),(b)** for focused V93 comparison. Entire printed **NBF pp.95–96**, sidebars and original text are **not fully source-exact verified**, and this PR neither copies nor rehosts any NBF source artwork, scanned page or private notes.

## New student-facing artifacts and their source status

- `portal/unit-06-topic-63-study-v95b3.html`: eight content sections: definitions, laminar/turbulent pattern explanation, four ideal-fluid simplifications and their limitations, dolphins/vehicles/wind tunnels, volume-rate meaning and supplementary slope, **seven** complete worked source-developed C1–C7 numeric applications, two interactive supplementary forms and **six** native revision self-checks.
- `assets/illustrations/unit6-v95b3-flow-patterns-original.svg`: new accessible **schematic** representing orderly paths and eddy/mixing indications. **Not** NBF Fig.6.6, not a measured complete flow field.
- `assets/illustrations/unit6-v95b3-flow-rate-graph-original.svg`: independently authored accessible 0–50s, 0–0.20m³ graph. Marker pairs (10s, 0.040m³), (40s, 0.160m³), slope 0.0040m³/s. This is extra practice, not an original textbook figure.
- `portal/unit-06-topic-63-study-v95b3.js`: form 1 computes transferred L/time s and displays L/s and m³/s. Form 2 computes the **time-weighted** overall average from two possibly unequal intervals, contrasts the incorrect equal-weighted mean only when it differs, rejects invalid data and stores/transmits nothing.
- Existing navy/gold `portal/unit-06-study-v95b1.css` reused, avoiding layout drift.
- `portal/unit-06-learning-desk-v95a.html` updated only in **Topic6.3 Read**. Detailed Topic6.1 and Topic6.2 routes, all seven 80-MCQ self-practice links, seven topics/four stages, and five original simulations preserved. The `continuity-fluid-flow.html` simulator contains a wider topic range; the lesson clearly says formal continuity is Topic6.4.

## Independently checked supporting computations

| Prepared example | Given | Correct arithmetic | Source classification |
|---|---|---|---|
| C1 | 0.48m³/120s | **0.004m³/s = 4L/s** | Supplementary |
| C2 | 720L/360s | **2L/s = 0.002m³/s** | Supplementary |
| C3 | 1.8m³ at 0.015m³/s | **120s** | Supplementary |
| C4 | 45mL/s for 240s | **10.8L** | Supplementary |
| C5 | 0.75m³/300s | **0.0025m³/s** | Supplementary |
| C6 | 0.008m³/s × 90s | **0.72m³ = 720L** | Supplementary |
| C7 | 0.06m³ in 20s then 0.03m³ in 30s | **(0.06+0.03)/50 = 0.0018m³/s**; naive mean `(0.003+0.001)/2=0.002m³/s` is **wrong** for unequal time intervals | Supplementary |
| Supplementary graph | ΔV = 0.160−0.040m³; Δt = 40−10s | **0.0040m³/s** | Supplementary |

## Teacher QC register: only items needing review

| ID | Treatment in V95-B3 | Required next approval |
|---|---|---|
| **T63-01** | Explicitly distinguishes steady (time) from laminar (organization); central speed profile is specified as *real viscous* pipe behavior | **Compulsory scientific clarity** delivered; teacher educational signoff pending |
| **T63-02** | Zero-local-vorticity meaning of irrotational vs the printed school shorthand “straight-line” | **Compulsory accuracy** delivered; teacher signoff pending |
| **T63-03** | All Q=ΔV/Δt, graph and numerical cases clearly marked **supplementary**; no continuity equation imported | **Compulsory syllabus/provenance** delivered; per-item certification not claimed |
| **T63-04** | No universal critical speed claimed; dye observation qualified as suggestive, not proof | **Scientific refinement** addressed |
| **T63-05** | Both flow-pattern and rate figures are new authored and accessible, with source distinctions; V90 Figure6.6 teaching aid linked | **Compulsory original figure rights** addressed for preview; exact NBF page fidelity not certified |
| **T63-06** | Streamlining examples remain qualitative; no Stokes sphere model applied to dolphins or fast cars | **Model boundary** addressed |
| **T63-07** | HTML units m³/s, 10⁻³ and slope shown in steps; browser/image/mobile checks added | **Compulsory rendering QA** automated; teacher projector/print review outstanding |
| **T63-08** | No Part D prompts presented as verbatim NBF; NBF pp.95–96 provenance caveat visible | **Compulsory exact-source claim gate** pending original printed source review |
| **T63-09** | Outcome **B35 Summative/Knowledge + Understanding** but no auto-classification of 80 MCQs | **Compulsory per-MCQ certification** pending |

**No original live MCQ keys were changed.** This lesson is academically sourced from teacher-owned prepared material but does not equate a pedagogical HTML preview with completed, original-text certified NBF courseware.

## Release and access invariants

- Full course `portal/unit-06.html` **not created**; `portal/learning-catalog.json` Unit6 stays `planned`, assessment `not-published`, teacher signoff matrix false.
- Public MCQ source inventory still **560 Unit6 / 2,250 GradeXI**, **136 standalone situations**, **zero genuine Unit6 shared-stimulus groups**, **zero figure holds**, **five existing mapped simulations**.
- No full NBF figure/image, private prepared 577-page PDF, answers/teacher marking data, student grades, authentication rules, cloud storage, Firebase, billing or permissions are published/modified.
- Before merging teacher reviews page text and source caveats. CI must pass both new 390/768/1440px tests and inherited V95-A/B1/B2 and older compatibility regressions.

**Next:** V95-B4 detailed Topic6.4 *Equation of Continuity* lesson after V95-B3 review/merge; complete all seven topic lessons, then student assessment and final teacher signoff before declaring Unit6 live or starting Unit7.
