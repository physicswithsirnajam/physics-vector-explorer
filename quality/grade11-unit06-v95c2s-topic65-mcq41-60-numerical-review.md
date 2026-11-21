# V95-C2S — Unit 6 Topic 6.5 MCQs 41–60, independent numerical Bernoulli QC and newly verified printed NBF sources

**Scope:** Prepared after PR #123 was independently confirmed merged. This PR adds **teacher evidence and deterministic quality-control tests** without changing original source questions, options, keys, explanations, publicly displayed course pages, original textbook image assets or formal assessment release.

## Sources reopened and fidelity results
- Private teacher-prepared `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`: **compiled pp.188–190** contain 20 stems and **80** A–D options; **p.195** contains all 20 original answer letters/explanations and Application cognitive tags. Direct Unicode NFKC/whitespace comparison to GitHub `question-bank/grade-11/unit-06-topic-65-v84-80-source.json` Q41–60 yielded **20/20 question stems, 80/80 original options and 20/20 letters matching**, original keys `DBDADBACCBBABCBBACAD`.
- User newly uploaded two *original printed NBF Unit 6 copies* (colour photographs without the study-site watermark, plus monochrome watermarked scan). **Original printed NBF pp.99–100 and Figure6.9 were directly inspected** and confirm the actual textbook's two-point Bernoulli pressure-work derivation and equations; they are **not republished in this repository**. Specific prior Source Figure6.6, Figure6.7, Example6.3 and Daniel Bernoulli confirmation is documented separately at `quality/grade11-unit06-v95c2s-original-nbf-image-verification.md`.
- The official teacher-supplied HSSC-I assessment framework p.11–12 confirms **P-11-B-39 Formative/Application (not directly tested in final-theory exam)**, **P-11-B-40 Summative/Application** (“Explain and apply Bernoulli's equation for horizontal and vertical fluid flow”), and **P-11-B-36 Summative/Application** for continuity. Official topic status is NOT individual item certification.

## Science and mathematical findings
**All 20 selected source numerical answer values independently recalculated**, with valid textbook-model assumptions. **No answer-letter change** proposed. Correct numerical outputs range from 104 kPa (Q41) to 6 m/s (Q60), with exact units in the selected original choice text. Several questions are **preparatory single-term calculations rather than direct two-point Bernoulli Application**; and two “zero speed” stems are physically ambiguous unless treated as *stagnation* conditions.

| Original Q | Original letter | Independent calculation | Numeric result (SI units, where applicable) | Original source answer choice |
|---|---|---|---|---|
| Q41 | D | `P2=P1+rho/2*(v1^2-v2^2)` | 104000 | 104 kPa |
| Q42 | B | `P2=90000+500*(3^2-5^2)` | 82000 | 82 kPa |
| Q43 | D | `P2=180000+500*(4^2-2^2)` | 186000 | 186 kPa |
| Q44 | A | `P2=P1-rho*g*(h2-h1)` | 151000 | 151 kPa |
| Q45 | D | `rho*v^2/2` | 12500 | 12 500 Pa |
| Q46 | B | `rho*v^2/2` | 40000 | 40 000 Pa |
| Q47 | A | `rho*g*h` | 29400 | 29 400 Pa |
| Q48 | C | `v2=sqrt(v1^2+2*(P1-P2)/rho)` | 6.633249581 | 6.63 m/s |
| Q49 | C | `rho/2*(v2^2-v1^2)` | 24000 | 24 kPa |
| Q50 | B | `v2=sqrt(v1^2+2*(P1-P2)/rho)` | 5.291502622 | 5.29 m/s |
| Q51 | B | `(P1-P2+rho*(v1^2-v2^2)/2)/(rho*g)` | 1.1 | 1.1 m |
| Q52 | A | `(P1-P2+rho*(v1^2-v2^2)/2)/(rho*g)` | 0.4 | 0.4 m |
| Q53 | B | `rho*g*(h2-h1)` | 19600 | 19.6 kPa |
| Q54 | C | `rho/2*(v2^2-v1^2)` | 20000 | 20 000 Pa |
| Q55 | B | `rho/2*(4^2-0^2)` | 8000 | 8 kPa |
| Q56 | B | `100000-rho/2*(10^2-0^2)` | 50000 | 50 kPa |
| Q57 | A | `P*deltaV` | 160 | 160 J |
| Q58 | C | `A*v*deltaT` | 0.3 | 0.30 m³ |
| Q59 | A | `rho*v^2/2` | 8000 | 8 000 J/m³ |
| Q60 | D | `sqrt(2*kineticPressure/rho)` | 6 | 6 m/s |

### Nine compulsory teacher decisions
| Exact original source ID | Priority | Issue | Explanation and pending teacher action |
|---|---|---|---|
| **XI-U06-T65-MCQ-0045** | COMPULSORY_B40_SCOPE_NOTE | Isolated kinetic-energy-density substitution | 0.5×1000×5²=12500 Pa. The arithmetic is correct, but computing a single Bernoulli term does not by itself explain or apply the two-point Bernoulli relation at the official B40 Application level. **Keep source letter D provisionally; formal exam decision pending.** |
| **XI-U06-T65-MCQ-0046** | COMPULSORY_B40_SCOPE_NOTE | Oil kinetic term alone versus full equation | 0.5×800×10²=40000 Pa. This is valid energy-density practice, not an independently certified B40 horizontal/vertical pressure-speed-height application. **Keep source letter B provisionally; formal exam decision pending.** |
| **XI-U06-T65-MCQ-0047** | COMPULSORY_B40_SCOPE_NOTE | Gravitational energy term alone | 1000×9.8×3=29400 Pa. Correct gravitational-energy density calculation supports Bernoulli's equation but does not alone satisfy using the complete equation for two flow points. **Keep source letter A provisionally; formal exam decision pending.** |
| **XI-U06-T65-MCQ-0055** | COMPULSORY_STAGNATION_CONDITION | Zero speed at a stagnation point versus zero throughflow | An 8 kPa static-pressure rise is correct along an ideal streamline that slows to a stagnation point (v=0). If 'slows from 4 to 0' means zero MEAN speed across a downstream section in the SAME steady unbranched incompressible pipe, constant discharge is contradicted. Clarify as a stagnation point, not a zero-flow section. **Keep source letter B provisionally; formal exam decision pending.** |
| **XI-U06-T65-MCQ-0056** | COMPULSORY_STAGNATION_CONDITION | From rest in steady throughflow needs a stagnation interpretation | Pdown=100−50=50 kPa mathematically. For steady incompressible unbranched throughflow, a full upstream cross-section at rest cannot feed a downstream 10 m/s section; interpret initial speed zero at a stagnation point or a fluid entering from a large reservoir where inlet speed is negligible. **Keep source letter B provisionally; formal exam decision pending.** |
| **XI-U06-T65-MCQ-0057** | COMPULSORY_B40_SCOPE_NOTE | Single pressure-work calculation is a derivation prerequisite | W=(80000 Pa)(0.002 m³)=160 J. Correct pressure work formula from the derivation, but does not by itself apply the full two-point Bernoulli equation for official B40. **Keep source letter A provisionally; formal exam decision pending.** |
| **XI-U06-T65-MCQ-0058** | COMPULSORY_CROSS_SLO_NOTE | Pure continuity throughput instead of Bernoulli | V=(0.020 m²)(3 m/s)(5 s)=0.30 m³, with uniform velocity explicitly assumed. This is a continuity/volume-rate question, not an independent B40 pressure-speed-height Bernoulli Application item; B36 possible pending teacher decision. **Keep source letter C provisionally; formal exam decision pending.** |
| **XI-U06-T65-MCQ-0059** | COMPULSORY_B40_SCOPE_NOTE | Kinetic energy density without flow-point comparison | 0.5×1000×4²=8000 J/m³; equals 8000 Pa in dimensions. This is correct term identification/calculation but not individually the full B40 Bernoulli-application demand. **Keep source letter A provisionally; formal exam decision pending.** |
| **XI-U06-T65-MCQ-0060** | COMPULSORY_B40_SCOPE_NOTE | Speed from a kinetic term rather than Bernoulli balance | v=√(2×18000/1000)=6 m/s. Correct inversion of the kinetic-energy density term only; exam B40 Application approval should be separately justified. **Keep source letter D provisionally; formal exam decision pending.** |

**Q55:** The source B `8 kPa` is correct when a moving fluid element slows to a **stagnation point** on an ideal streamline; a literal entire downstream cross-section at 0 mean speed in a one-inlet/outlet steady incompressible pipe cannot transport the same nonzero discharge. Use an explicit stagnation-point stem if a polished individual final assessment item is desired.

**Q56:** Source B `50 kPa` is a correct Bernoulli pressure change from a point of zero local speed (stagnation) to 10 m/s. A finite-area upstream section with *zero* steady throughflow cannot feed a downstream flowing section absent a reservoir/cross-section distinction. Clarify a reservoir whose upstream speed is negligible or refer to a stagnation point for individual exam use.

**Q45–47, Q57, Q59–60:** A valid `½ρv²`, `ρgh` or `PΔV` substitution supports Bernoulli's derivation but does not individually guarantee the exact summative B40 **two-point horizontal/vertical equation Application**. Keep valuable practice while withholding official board-style approval. Q54 also uses only kinetic-term difference; teacher may include with adequate context.

**Q58:** `ΔV=AvΔt=0.30 m³` is mathematically sound, and the question explicitly assumes uniform speed, but it directly tests **continuity/flow-volume accounting** (possible B36 candidate), not independent B40 summative Bernoulli application.

**Q41–44, Q48–53:** Pressure, speed and height relations are mathematically consistent under ideal Bernoulli assumptions. Where water density is not explicitly supplied (Q43, Q49, Q50, Q53) the original answer uses `ρwater≈1000 kg/m³`; optional teaching note explains that assumed value. Q51–52 explicitly specify `g=10 m/s²`, so their source calculations should **not** silently use 9.8.

**Q37 of previous cohort:** The original pressure difference sign remains confirmed by the now-verified printed Bernoulli p.100 relation, and V95-C2R audit remains intact.

## Evidence ledger and non-release safeguards
- `quality/grade11-unit06-v95c2s-topic65-mcq41-60-numerical-review.csv`: 20 original IDs, prepared master pages, unchanged letter/selected source option, independently computed numeric result, nine teacher priorities and candidate-only B40/B36 cognition and all teacher item approvals **PENDING**.
- `quality/grade11-unit06-v95c2s-topic65-mcq41-60-numerical-review.md`: complete 20-question math and conceptual audit, including zero-speed assumptions.
- `quality/grade11-unit06-v95c2s-original-nbf-image-verification.md`: historical *new* original printed-book verification and PDF quality comparison without copying copyrighted original page photos.
- `scripts/test_grade11_unit06_v95c2s_topic65_num41_60_academic.cjs`: locks original 20 stems, 80 choice texts and 20 answer letters to deterministic fingerprint **`0xd8048e94`**, recomputes 20 results, verifies Q55/Q56 conditional notes and Q58 cross-SLO candidate, confirms nine teacher flags, retains all **560** central teacher approvals PENDING and nonrelease course status. Dedicated workflow also executes inherited prior academic checks.

**Progress after merge:** Topic6.1–6.4 320/320, Topic6.5 60/80 = **380/560 academically inspected**; **180 MCQs remain outside academic inspection**. No individual source item has formal teacher SLO/exam certification, and all 560 master queue approvals remain PENDING. Provisional Unit6/GradeXI practice counts remain **560 / 2,250**, Unit6 **136 standalone situations / zero common-stimulus groups**; Unit6 course status `planned`, graded assessment `not-published`, `releaseApproved:false`. Original 14 textbook end-unit exercises remain separately maintained and outside this provisional source-pool audit.

Previous Topic6.4 Q28 word truncation, Q51/Q52/Q67 physical equal-split clarifications, and original figures' **student-facing asset matching** remain independent unresolved item work. Printed NBF source visibility now verified for selected figures does **not** silently approve their source-bank item classifications.

**Keep this draft PR until latest-head CI is green and teacher reviews nine compulsory notes; do not automatically change the original 560 question bank or publish any graded exam.** Next V95-C2T: Topic6.5 Q61–80 standalone Bernoulli situations.
