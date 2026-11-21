# V95-C2W — Grade XI Unit 6 Topic6.6 MCQs 41–60: Numerical Bernoulli Applications and Printed NBF QC

**Scope:** Numerical question source audit after PR #127 independently confirmed merged. This adds teacher-facing calculations, corrected-scope warnings and immutable regression only. Original 20 public MCQ stems, 80 choices, key letters, explanations, learning-portal delivery, course/assessment settings and all teacher approvals stay unchanged.

## Reopened and compared original sources
- User's teacher-prepared `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, compiled **PDF pp.232–235** for the original Q41–60 and 80 A–D choices; **p.241** for the original source key and explanations. Direct comparison with `question-bank/grade-11/unit-06-topic-66-v86-80-source.json` Q41–60 gave **20/20 stems, 80/80 options, 20/20 answer letters** after NFKC/whitespace normalization. Source letter sequence `ABCDACBDBDADABBDCBAA`.
- Original printed **NBF Grade XI Physics Unit6 pp.102–106**, visually examined from the user's separately provided `Unit 6(2).pdf`: **Torricelli p.102**, **Venturi Eq6.25–6.29 and area ratio p.103–104**, **Example6.4 p.105**, **Assignment6.4 p.106**. No original scanned page image uploaded into this repository.
- **Example6.4 p.105 verified**: v1=4m/s, P1=47.1kPa, v2=3m/s, second point 3m lower, rho=1000 and g=9.8; result **80.0kPa**, source Q55 B. **Assignment6.4 p.106 verified**: wing top/bottom speeds **450/410m/s**, air density **1.29kg/m³**, length 15m and width 3m. The teacher-authored bank produces **22,188Pa**, **45m²** and **998,460N** under the printed assignment's idealized formula; the printed assignment asks the student to calculate lift (it does not independently prove the physical validity of incompressible pressure calculation at those speeds).
- Official user-provided **FBISE HSSC-I Physics framework pp.11–12**: **P-11-B-36 Summative/Application** on continuity, **P-11-B-39 Formative/Application** on the Bernoulli effect, **P-11-B-40 Summative/Application** on using Bernoulli's equation for horizontal/vertical flow and **P-11-B-44 Summative/Application** on analysing real-world applications. Topic-level tags/teacher source A-level annotations are **not individual final-paper approval**.

## Full independent numerical recheck

All **20 selected numerical values recalculate correctly** with the intended idealized models. **No original answer-letter change** is proposed; the source's pressure and lift calculations are teaching-model answers, not measured actual aircraft forces.

| Original question | Source letter | Independently evaluated formula | SI result | Original selected text |
|---|---|---|---|---|
| 41 | A | `sqrt(2*g*h)` | 9.89949493661 | 9.90 m s⁻¹ |
| 42 | B | `sqrt(2*g*h)` | 4.94974746831 | 4.95 m s⁻¹ |
| 43 | C | `v^2/(2*g)` | 10 | 10.0 m |
| 44 | D | `sqrt(2*g*h)` | 6.260990337 | 6.26 m s⁻¹ |
| 45 | A | `v2=(A1/A2)*v1` | 3 | 3.0 m s⁻¹ |
| 46 | C | `v2=(A1/A2)*v1` | 6 | 6.0 m s⁻¹ |
| 47 | B | `deltaP=rho/2*(v2^2-v1^2)` | 16000 | 16,000 Pa |
| 48 | D | `deltaP=rho/2*(v2^2-v1^2)` | 8400 | 8,400 Pa |
| 49 | B | `v2=sqrt(v1^2+2*deltaP/rho)` | 3.60555127546 | 3.61 m s⁻¹ |
| 50 | D | `deltaP=rho*g*deltaH` | 24500 | 24,500 Pa |
| 51 | A | `v1=sqrt(2*g*h/(r^2-1))` | 1.97989898732 | 1.98 m s⁻¹ |
| 52 | D | `v1=sqrt(2*g*h/(r^2-1))` | 1.4 | 1.40 m s⁻¹ |
| 53 | A | `Q=A*v` | 0.002 | 2.0 × 10⁻³ m³ s⁻¹ |
| 54 | B | `deltaP=rho/2*(v2^2-v1^2)` | 8000 | 8.0 kPa |
| 55 | B | `P2=P1+rho*(v1^2-v2^2)/2+rho*g*(h1-h2)` | 80 | 80.0 kPa |
| 56 | D | `gravitationalTerm=rho*g*deltaH` | 29400 | 29.4 kPa |
| 57 | C | `deltaP=rhoAir/2*(vAbove^2-vBelow^2)` | 22188 | 22,188 Pa |
| 58 | B | `lift=deltaP*(length*width)` | 998460 | 998,460 N |
| 59 | A | `lift=deltaP*effectiveArea` | 30000 | 30,000 N |
| 60 | A | `deltaP=rhoAir/2*(vAbove^2-vBelow^2)` | 300 | 300 Pa |

### Nine compulsory teacher scientific/SLO decisions

| Exact original ID | Priority | Cause and disposition |
|---|---|---|
| **XI-U06-T66-MCQ-0043** | COMPULSORY_HEAD_TERMINOLOGY | The calculation h=v²/(2g)=10m is correct as equivalent velocity head or driving elevation head for ideal Torricelli efflux. But calling it 'pressure head' without identifying the pressure datum can confuse pressure head P/(rho g) with the velocity head. Teacher should clarify terminology before formal exam certification. **Source answer letter C is retained conditionally; no automatic correction.** |
| **XI-U06-T66-MCQ-0045** | COMPULSORY_CONTINUITY_SLO | v2=3.0 m/s follows directly from steady incompressible Q=A v, not a Bernoulli pressure relation. Source author assigns B40 Application, but this item independently tests summative continuity SLO B36; B44 device context alone is insufficient for automatic certification. **Source answer letter A is retained conditionally; no automatic correction.** |
| **XI-U06-T66-MCQ-0046** | COMPULSORY_CONTINUITY_SLO | v2=6.0 m/s from the area ratio 8/2 and inlet speed 1.5m/s; the squared-cm area ratio cancels. This is a single continuity calculation B36 candidate even though the device is called a Venturi meter; the original B40 tag is not item certified. **Source answer letter C is retained conditionally; no automatic correction.** |
| **XI-U06-T66-MCQ-0050** | COMPULSORY_PIEZOMETER_SCOPE | Two same-fluid, static piezometer columns with equal datum have a 2.5m difference giving ΔP=24500 Pa. This directly tests hydrostatic pressure head measurement, not on its own using the Bernoulli pressure-speed-height equation for two flowing sections; B40 or B44 item scope must be assessed individually. **Source answer letter D is retained conditionally; no automatic correction.** |
| **XI-U06-T66-MCQ-0053** | COMPULSORY_CONTINUITY_SLO | Q=(5.0×10^-4 m²)(4.0m/s)=2.0×10^-3 m³/s. Area unit conversion is essential; this is a one-section volumetric flow / continuity prerequisite, not independently an application of Bernoulli pressure to water flow as B40 demands. **Source answer letter A is retained conditionally; no automatic correction.** |
| **XI-U06-T66-MCQ-0056** | COMPULSORY_B40_SINGLE_TERM_SCOPE | ρgΔh=(1000)(9.8)(3)=29400Pa=29.4kPa, source D. Calculating only the gravitational-energy density term is useful supporting practice, but is not itself full B40 Application of horizontal/vertical Bernoulli across two flow points. **Source answer letter D is retained conditionally; no automatic correction.** |
| **XI-U06-T66-MCQ-0057** | COMPULSORY_SUPERSONIC_COMPRESSIBILITY | Original printed NBF Assignment6.4 p106 truly gives 450m/s above and 410m/s below with air density 1.29kg/m³; the specified simplified Bernoulli calculation gives ΔP=22188Pa, source C. Both speeds exceed typical near-room-temperature air sound speed (~340m/s): actual flows are compressible and may involve shock waves, so incompressible wing-velocity pressure inference cannot represent a realistic aerodynamic prediction. Retain clearly as textbook idealization, not a measured real lift estimate. **Source answer letter C is retained conditionally; no automatic correction.** |
| **XI-U06-T66-MCQ-0058** | COMPULSORY_AEROFOIL_AND_COMPRESSIBILITY | Printed original Assignment6.4 states 15m ×3m, with source ideal ΔP=22188Pa; F=22188×45=998460N exactly, original B. The simple uniform ΔP across projected area neglects actual distribution; moreover upstream 450/410m/s speeds are supersonic for usual air conditions, invalidating incompressible Bernoulli realism. Keep the textbook arithmetic but require conceptual caveat for exam suitability. **Source answer letter B is retained conditionally; no automatic correction.** |
| **XI-U06-T66-MCQ-0060** | COMPULSORY_DIFFERENT_STREAMLINES_MODEL | The arithmetic ΔP=0.6(900−400)=300Pa is correct in the simplified textbook wing model at the supplied 30/20m/s speeds (source A), but comparing local velocities above and below different streamlines only fixes pressure difference when a common upstream total head/Bernoulli constant and appropriate elevations, losses and flow fields are assumed. Do not infer pressure difference from speeds alone universally. **Source answer letter A is retained conditionally; no automatic correction.** |

**Important Q43 pressure-head terminology:** `v²/(2g)=10m` is a **velocity head** equivalent to a free-surface-to-orifice driving elevation head in the elementary unpressurized Torricelli model. A pressure head is usually `P/(ρg)` and needs a pressure datum/measurement point. Preserve source answer C but clarify the stem to distinguish the type of head before a certified examination.

**B36-versus-B40 (Q45, Q46, Q53):** The Venturi *context* does not turn `Q=Av` or `A1v1=A2v2` into a full Bernoulli pressure application. These should be individually reviewed for official **summative B36 continuity**, rather than silently approved as B40 just because prepared key tags say so. **Q50** is a piezometer static-pressure-head conversion supporting Venturi, and **Q56** is a single gravity term; both require individual SLO-scope confirmation.

**Supersonic numerical limitation Q57/Q58:** The **printed NBF Assignment6.4's actual 450 and 410m/s speeds** exceed an ordinary ~340m/s sound speed in air near room conditions, so a realistic analysis would involve compressibility and potentially shocks. The original simplified exercise arithmetic is exactly `0.5×1.29×(450²−410²)=22,188Pa`, followed by `22,188×45=998,460N`. Those are **mathematically correct book-model numbers but not reliable realistic wing-lift estimates** at the stated high speeds. Do not change correct original answer letters C/B to “fix” an upstream textbook idealization.

**Wing model at ordinary speeds Q59/Q60:** A uniform/effective pressure difference times area estimates the net pressure-force contribution (`F≈ΔP A`); actual lift generally requires integrating pressure across the wing. Two local velocities on **different streamlines** cannot automatically be substituted into one common Bernoulli constant without matching upstream total head and model assumptions. Q60's 300Pa original A remains conditional on that simplified common-head idealization, not a universal aircraft theorem.

**Independent Venturi checks Q51/Q52:** Original printed p.104 relation uses measured piezometer head `h`: `v1=√[2gh/((A1/A2)²−1)]`. Recalculation yields **1.98m/s** and **1.40m/s** exactly. The same ideal fluid/equal-height/no-loss/two-section conditions apply.

## New teacher evidence and protection
- `quality/grade11-unit06-v95c2w-topic66-mcq41-60-numerical-review.csv`: 20 exact original source IDs, master stem/options/key matches, independent SI calculations, original selected answer strings, **9 compulsory / 11 optional** teacher notes, candidate-only SLO, printed provenance, and all individual approvals PENDING.
- `quality/grade11-unit06-v95c2w-topic66-mcq41-60-numerical-review.md`: complete 20-question numerical audit plus high-speed aerodynamics and head terminology warnings.
- `scripts/test_grade11_unit06_v95c2w_topic66_num41_60_academic.cjs`: original 20 stem/80 choice/20 answer snapshot fingerprint **`0xebe31ab1`**, re-evaluates 20 calculations, cross-checks nine teacher holds, prints source values and inherited 560-row pending approvals and formal release gates.
- Dedicated workflow executes the new validation and inherited **V95-C2V through V94D** scientific/release tests.

**Academic inspection progress after merge:** Topics6.1–6.5 **400/400**, Topic6.6 **60/80**, **460/560 (82.1%)** original Unit6 teacher-prepared source MCQs inspected, **100 remaining**. This is NOT individual teacher/FBISE certification; all **560 central teacher approvals stay PENDING**. The separate **14 actual NBF end-of-unit textbook MCQs are a different pool**. Original provisional student self-practice remains 560 Unit6 / 2,250 GradeXI, 136 standalone scenarios / 0 genuine shared-stimulus sets, Unit6 course `planned`, formal assessment `not-published`, and central `releaseApproved:false`.

Earlier Topic6.4 **Q28 missing last word in correct option**, and **Q51/Q52/Q67 missing equal-flow assumptions** remain pending distinct teacher-authorized source edits. No source MCQ edits or formal exam release performed here.

**Keep DRAFT until latest-head GitHub Actions is green and teacher reviews nine decisions, especially Q43 and high-speed Q57–58.** Next V95-C2X Topic6.6 MCQs 61–80 scenarios.
