# V95-C2U — Grade XI Unit 6 Topic 6.6 Bernoulli Applications MCQs 1–20: scientific, printed-original and FBISE audit

**Scope:** First twenty source MCQs of Topic 6.6 after **PR #125 independently confirmed merged**. This PR adds only teacher-facing source evidence and regression checks, with **zero changes to original student MCQ stems, choices, letter keys, explanations, figure assets, course permissions or exam release**.

## Sources directly reopened
- Owner's `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, compiled **pp.227–229** for all 20 source stems and 80 A–D options, and **pp.239–240** for all original key letters, one-line explanations and teacher B40/B44 K/U/A annotations.
- Public `question-bank/grade-11/unit-06-topic-66-v86-80-source.json`, first 20 questions. Normalizing only Unicode NFKC and whitespace and removing PDF page headers/footers gives **20/20 matching stems, 80/80 matching options and 20/20 original key letters**, source key `BBCCACCCBCACBADDCBCC`. Meaning of explanations checked but not claimed byte-exact.
- **Actual NBF Grade XI original printed pp.101–106** directly visually reopened from owner's `Unit 6(2).pdf` 24-page original scan: **p101 Figure6.10 atomizer / Figure6.11 water-jet filter pump / two-sheet activity**, **p102 Figure6.12 and Torricelli formula**, **p103 Figure6.13 Venturi piezometer tubes and Bernoulli pressure difference**, **p104 Figure6.14 simplified aerofoil**, **p105 Figure6.15 Magnus and Example6.4 (3m below; 80.0kPa answer)**, **p106 Assignment6.4 wing speeds / dimensions**. The original colour photographs have also been examined in preceding V95-C2S work. Original page images are **not copied or republished** in this PR.
- Owner-provided official FBISE HSSC-I Physics framework **pp.11–12**: **P-11-B-39 Formative/Application** (basic Bernoulli effect pressure difference, excluded from independent summative final-theory testing); **P-11-B-40 Summative/Application** (explain and apply Bernoulli equation for horizontal and vertical fluid flow); **P-11-B-44 Summative/Application** (analyze real-world applications including atomizers, Venturi ducts, spinning ball / Magnus). **P-11-B-36** continuity is a distinct Summative/Application SLO. Teacher bank B40/B44 and K/U/A assignments are **source annotations only**, not certified individual item mappings.

## Findings and scientific assumptions

| Review dimension | Result |
|---|---|
| Teacher-prepared source statements, options and keys | **20/20, 80/80, 20/20** |
| Original selected answer letters scientifically supported | **20/20**, no proposed letter changes |
| Compulsory teacher academic / figure / SLO review flags | **11: Q1, Q2, Q4, Q6, Q9, Q12, Q13, Q16, Q17, Q19, Q20** |
| Optional item-specific scientific nuances | **9** |
| Printed NBF Figures6.10–6.15, Example6.4 core source verified | **Yes**, directly inspected original scan; figure *student-display links* still require separate attention |
| Individual exam eligibility, board cognitive classification and teacher signoff | **PENDING** |

### Eleven teacher decisions, retaining all original answers

| Original source ID | Priority | Focus | Reason and disposition |
|---|---|---|---|
| **XI-U06-T66-MCQ-0001** | COMPULSORY_B44_COGNITIVE_SCOPE | Which principle recognition is not full device analysis | Source B correctly identifies Bernoulli principle for the atomizer. However recognising a named principle is basic recall/understanding while official B44 requires Application-level analysis of real-world Bernoulli effects; do not automatically certify item for B44 exams. **Retain source B for provisional practice.** |
| **XI-U06-T66-MCQ-0002** | COMPULSORY_PRINTED_FIGURE_LINK | Text cites Figure6.10 without attached figure reference | Original printed NBF p101 Figure6.10 shows a simple atomizer and fast crossflow. Original GitHub Q2 has no referenceFigureId despite citing the figure. Source B is valid because fast air lowers local static pressure relative to the bottle, but verify the student-facing figure if used as a figure question. **Retain source B for provisional practice.** |
| **XI-U06-T66-MCQ-0004** | COMPULSORY_B44_COGNITIVE_SCOPE | Identify filter pump is a recognition question | NBF p101–102 discusses the water-jet filter pump. Source C is exactly the named device; nevertheless selecting a device name is recall, not independent Application-level analysis under B44. Retain in practice pending item-level certification. **Retain source C for provisional practice.** |
| **XI-U06-T66-MCQ-0006** | COMPULSORY_B40_COGNITIVE_SCOPE | Torricelli equation recognition versus solving problems | NBF p102 prints v=sqrt(2gh), so original C is right for ideal orifice efflux. The prepared key marks Knowledge; identifying a formula is not individually B40 Summative/Application, which requires applying the ideal energy model. **Retain source C for provisional practice.** |
| **XI-U06-T66-MCQ-0009** | COMPULSORY_B40_COGNITIVE_SCOPE | Unit recall not Bernoulli summative Application | sqrt(gh) has SI dimensions m/s so source B is scientifically correct. But the teacher-prepared K tag and item task identify unit recall, not itself Application of Bernoulli for horizontal or vertical flow in official B40. **Retain source B for provisional practice.** |
| **XI-U06-T66-MCQ-0012** | COMPULSORY_CONTINUITY_CROSS_SLO | Continuity equation rather than direct Bernoulli application | A1*v1=A2*v2 is correct for steady incompressible no-leak flow, source C. This is chiefly continuity outcome B36, not a direct B40 pressure-speed-height calculation or B44 device analysis; per-item SLO and cognition require teacher review. **Retain source C for provisional practice.** |
| **XI-U06-T66-MCQ-0013** | COMPULSORY_PRINTED_FIGURE_LINK | Figure6.13 piezometers not linked in GitHub record | Original printed NBF p103 Figure6.13 shows two columns of different height on wide/throat sections. These show static pressure head for the same liquid, source B. Q13 refers to the figure but GitHub has no referenceFigureId; verify visible correctly oriented student image before figure-based exam use. **Retain source B for provisional practice.** |
| **XI-U06-T66-MCQ-0016** | COMPULSORY_AEROFOIL_FIGURE_AND_MODEL | Simplified Figure6.14 and no equal-transit-time rule | NBF printed p104 Fig6.14 labels faster flow/low pressure above the drawn aerofoil; source D matches that specific idealized figure. GitHub Q16 has no referenceFigureId despite asking about a diagram. Teach that equal transit times are NOT required for lift and do not generalize upper-side speed to every wing/flight condition. **Retain source D for provisional practice.** |
| **XI-U06-T66-MCQ-0017** | COMPULSORY_B44_COGNITIVE_SCOPE | Magnus phenomenon identification is not full real-world analysis | NBF printed p105 shows spin-induced transverse force and flow asymmetry. Source C accurately identifies a moving spinning body, but identifying the condition is Understanding/recognition, not automatically B44 Application-level analysis of forces or trajectories. **Retain source C for provisional practice.** |
| **XI-U06-T66-MCQ-0019** | COMPULSORY_FORMATIVE_B39_CROSS_SCOPE | Two-sheet activity is supportive Bernoulli effect | NBF p101 two-sheet activity depicts inward movement of sheets when blown between, source C; lower middle pressure than outside explains the net force. Standalone demonstration of Bernoulli effect is formative B39 context, not automatically individual summative B44 Application analysis. **Retain source C for provisional practice.** |
| **XI-U06-T66-MCQ-0020** | COMPULSORY_EXAMPLE_AND_B40_COGNITIVE_SCOPE | Printed Example6.4 correct but source item asks only its title/number | NBF printed p105 Example6.4 explicitly calculates pressure at a point 3m lower, with change of speed, giving 80.0 kPa. Source C matches the actual example number, but selecting the example label is Knowledge/lookup rather than B40 Application-level problem solving. **Retain source C for provisional practice.** |

### Critical conceptual explanations
- **Atomizer and filter pump (Q1–5):** NBF p101–102 describes fast-moving air above a perfume supply tube and a high-speed water jet creating a low-pressure zone at a side tube, so surrounding higher pressure drives liquid/air toward that region. A pressure difference lifts perfume; **droplet breakup** at the nozzle additionally involves entrainment/shear and is not simply the same as the hydrostatic suction mechanism.
- **Torricelli (Q6–9):** The printed p102 source derives `v=sqrt(2gh)` for steady, ideal near-lossless discharge from a sufficiently large **open** tank where free-surface speed is negligible and both free surface and jet exit have ambient pressure. `h` measures free-surface-to-orifice height. Recognising the expression or its SI unit is helpful but not automatically full B40 Application.
- **Venturi (Q10–14):** Printed p103 Fig6.13 shows higher piezometer level in the wide section, lower level at the throat, supporting static pressure head interpretation; at equal elevation `P1−P2=(rho/2)*(v2²−v1²)`, while `A1v1=A2v2` is a **continuity** relation with a separate candidate official B36 outcome. Both Q13 and Q2 reference original textbook figures but have **no linked figure ID** in GitHub source.
- **Aerofoil/Magnus (Q15–18):** Original printed p104 Fig6.14 illustrates upper-side fast airflow and low pressure for its simplified diagram; original p105 Magnus section covers transverse spin-related deflection, e.g., a cricket ball. For actual aerodynamic lift, pressure/velocity fields and flow deflection matter; **equal transit time between upper and lower stream paths is not a law or requirement**. Q16 refers to that figure without an attached source figure link.
- **Two-sheet demonstration (Q19):** Original p101 class activity describes sheets moving inward because airflow between them reduces static pressure. A scenario testing how forces act may support B44 learning, but simply recalling the demonstration can be **formative B39 effect context**, not a certified standalone final theory B44 question.
- **Example 6.4 (Q20):** Original printed p105 explicitly labels Example6.4, two water points with one **3 m lower**, with answer about **80.0kPa**. Selecting the *number* of the example is Knowledge-level information retrieval, not an Application-level Bernoulli computation. Original option C is source-fidelitous.

### All candidate-only source SLO and cognition labels

| Q | Original letter | Prepared teacher SLO annotation | Teacher K/U/A | Priority |
|---|---|---|---|---|
| 1 | B | P-11-B-44 | U | COMPULSORY_B44_COGNITIVE_SCOPE |
| 2 | B | P-11-B-44 | U | COMPULSORY_PRINTED_FIGURE_LINK |
| 3 | C | P-11-B-44 | U | OPTIONAL_ATOMIZATION_MECHANISM |
| 4 | C | P-11-B-44 | U | COMPULSORY_B44_COGNITIVE_SCOPE |
| 5 | A | P-11-B-44 | U | OPTIONAL_PRINTED_FILTER_PUMP |
| 6 | C | P-11-B-40 | K | COMPULSORY_B40_COGNITIVE_SCOPE |
| 7 | C | P-11-B-40 | K | OPTIONAL_TORRICELLI_ASSUMPTIONS |
| 8 | C | P-11-B-40 | U | OPTIONAL_TORRICELLI_ASSUMPTIONS |
| 9 | B | P-11-B-40 | K | COMPULSORY_B40_COGNITIVE_SCOPE |
| 10 | C | P-11-B-44 | U | OPTIONAL_B44_APPLICATION_DEPTH |
| 11 | A | P-11-B-44 | U | OPTIONAL_IDEAL_VENTURI_MODEL |
| 12 | C | P-11-B-40 | U | COMPULSORY_CONTINUITY_CROSS_SLO |
| 13 | B | P-11-B-44 | U | COMPULSORY_PRINTED_FIGURE_LINK |
| 14 | A | P-11-B-40 | A | OPTIONAL_VENTURI_PRESSURE_SIGN |
| 15 | D | P-11-B-44 | U | OPTIONAL_AERODYNAMIC_FORCE_NUANCE |
| 16 | D | P-11-B-44 | U | COMPULSORY_AEROFOIL_FIGURE_AND_MODEL |
| 17 | C | P-11-B-44 | U | COMPULSORY_B44_COGNITIVE_SCOPE |
| 18 | B | P-11-B-44 | U | OPTIONAL_MAGNUS_EXAMPLE |
| 19 | C | P-11-B-44 | U | COMPULSORY_FORMATIVE_B39_CROSS_SCOPE |
| 20 | C | P-11-B-40 | K | COMPULSORY_EXAMPLE_AND_B40_COGNITIVE_SCOPE |

**No original NBF page image is embedded here.** The *printed-source fact-check* is distinct from independent approval of teacher-written item-level SLO/cognitive classification, figure display or original student-bank text changes.

## New evidence and safeguards
- `quality/grade11-unit06-v95c2u-topic66-mcq01-20-academic-review.csv`: 20 original IDs, source/key pages, exact original answer/cognitive/SLO source labels, 11 required + 9 optional teacher notes, printed figure check, and all individual exam/teacher signoffs **PENDING**.
- `quality/grade11-unit06-v95c2u-topic66-mcq01-20-academic-review.md`: complete science and original NBF figure/textbook attribution review and per-item SLO distinctions.
- `scripts/test_grade11_unit06_v95c2u_topic66_first20_academic.cjs`: source-provenance snapshot locks all 20 stems, 80 option texts and 20 original answer letters to fingerprint **`0x6592ce3f`**; checks no figure links Q2/Q13/Q16, all eleven flags, B39/B40/B44/B36 distinctions, 560 unchanged teacher queue PENDING approvals, and existing course/exam-release holds.
- Dedicated GitHub Actions workflow runs this and inherited V95-C2T through V94D checks.

**Progress after merge:** Topic6.1–6.5 **400/400**, Topic6.6 **20/80** = **420/560 academically inspected (75.0%)**, **140 still uninspected**. All **560** central original teacher approvals remain PENDING; no item is official individually certified yet. Original NBF printed 14 end-unit exercise questions remain a separate pool. Existing Unit6 provisional self-practice **560 / GradeXI 2,250**, 136 standalone situations / zero common-stimulus groups, Unit6 full course `planned`, official graded assessment `not-published`, and central release approval false.

Earlier Topic6.4 Q28 missing-word option and Q51/Q52/Q67 equal-branch-flow assumptions remain separate flagged teacher decisions. No automatic source changes.

**Keep this PR DRAFT until latest-head CI green and teacher reviews 11 academic decisions.** Next V95-C2V: Topic6.6 Q21–40 on the mechanisms, limitations and application SLO depth.
