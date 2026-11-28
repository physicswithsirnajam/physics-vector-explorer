# V246 — NBF Grade XI Physics Unit 8: original numerical problems 8.1–8.3, independently checked

## Scope and original source provenance

This is the next **teacher-only academic review** following the confirmed merge of **PR #348 / V245**. I directly inspected the original uploaded **NBF Grade XI Physics, Unit 8, printed p.153**, where all nine original Numerical Problems 8.1–8.9 and their publisher answer labels appear. This stage covers only **8.1, 8.2 and 8.3**. The original scanned textbook SHA-256 is recorded in the companion JSON, matching V224 and V235.

The V235 source inventory independently recorded the same nine question IDs and pre-existing caution flags `NUM-8.1`, `NUM-8.2` and `NUM-8.3`. Chapter source context: **ideal-gas equation in §8.1.2 (pp.130–131); Charles's law in §8.3.2 (pp.134–135); Carnot efficiency in §8.8.1 (pp.144–145)**. The source PDF is not edited; the three publisher problems are **not transcribed in full** to the repository, nor are these computations an approved student solved edition.

## Teacher amendment triage — original question, why, compulsory status and keep/add decision

| Original numerical | Publisher answer (p.153) | Independent conditional check | Teacher classification / retain-or-add |
|---|---|---|---|
| **8.1 — balloon ideal-gas mole count** | **0.3 moles** | Sphere radius **10 cm = 0.10 m**, hence volume **4π(0.10)³/3 ≈ 4.18879×10⁻³ m³**. Taking the printed **180 kPa as absolute pressure** and choosing **room T≈300 K**, the ideal gas relation **PV=nRT**, with **R≈8.31446 J mol⁻¹ K⁻¹**, gives **n≈0.30228 mol → 0.3 mol**. At 293.15 K, the value is ≈0.30934 mol; the rounded publisher answer remains compatible. | **COMPULSORY assumption note**, not a compelled original-stem rewrite. The source does **not** prescribe a numerical room temperature or say pressure is absolute versus gauge. If pressure were **gauge**, the absolute pressure would differ and so would the calculated amount. **Keep original** and explicitly state chosen room temperature, absolute-pressure convention and ideal-gas assumption in any future approved solution. No new question required. |
| **8.2 — efficiency between water fixed points** | **27%** | Using freezing **T_C=273.15 K** and boiling **T_H=373.15 K** at standard pressure, ideal **Carnot maximum** is **η_C=1−T_C/T_H≈0.2679887=26.80%≈27%**. | **COMPULSORY ideal-reversibility qualification and cognitive/SLO review**. The original calls it a **heat engine** but does **not** explicitly say Carnot or reversible. Reservoir temperatures set an **upper bound**, not a unique actual engine efficiency. **Keep original publisher question/answer** as an ideal-model exercise with explicit caveat. A separately authored question explicitly saying **reversible Carnot engine** may be added after teacher approval; do not silently change source wording. |
| **8.3 — volume rise from 1 K temperature rise** | **0.37 m³** | At **constant pressure**, fixed gas amount and ideal gas behavior, **ΔV=V_iΔT/T_i**. Original **V_i=100 m³**, **ΔT=1 K**, so **ΔV=(100/T_i) m³** with **T_i in kelvin**. An **assumed T_i≈273.15 K** gives **0.36610 m³ → 0.37 m³**; at **300 K**, the equally valid constant-pressure answer is **0.33333 m³**. An exact 0.37 m³ would imply T_i≈270.27 K. | **COMPULSORY underdetermination flag; no unique graded numerical answer**. Original source gives only symbols **P, V, T** and the one-mole amount; it supplies **neither a numerical initial temperature nor a condition that P remains constant**. Those are **two separate missing constraints**. Keep the publisher original as an explicit critical-thinking/source-QC case; **do not invent T_i=273 K or constant P** in a certified key. Independently author a fully specified practice variant if teacher approves. |

**These three review outcomes are not three defective source stems.** Numericals 8.1 and 8.2 produce the printed answers **under explicitly stated modeling assumptions**; Numerical 8.3 is genuinely **not uniquely solvable as printed**. These are additional technical clarifications of the original V235 risk flags, not a replacement of source text.

## Scientific and dimensional audit

**Numerical 8.1 — ideal gas and sphere**

- Spherical volume: \(V=(4/3)\pi r^3\), where \([V]=\mathrm{m^3}\) and \(r=0.10\,\mathrm{m}\).
- Ideal molar equation: \(n=PV/(RT)\); SI dimensions \(\mathrm{Pa\,m^3=J}\), \(R T=\mathrm{J\,mol^{-1}}\), hence \([n]=\mathrm{mol}\).
- Source **180 kPa = 1.80×10⁵ Pa**; assumption **absolute P=180 kPa** and **T=300 K**. Do not treat gauge pressure as absolute without a gauge reference and ambient pressure.

**Numerical 8.2 — temperature scales and upper bound**

- All heat-engine reservoir temperatures in the efficiency ratio must be **absolute kelvin**, never 0°C/100°C as a numerical quotient.
- For a reversible Carnot engine, \(\eta_C=1-T_C/T_H\). The temperatures determine the **maximum theoretical efficiency** for engines between those reservoirs, not every engine's operating efficiency.
- The result \(\eta_C\approx26.8\%\) is compatible with the printed **27%** rounded to the nearest whole percent. An actual engine needs additional efficiency or heat/work data.

**Numerical 8.3 — data sufficiency and dimension check**

- At constant pressure, \(V/T\) is constant for a fixed ideal-gas amount, giving \(\Delta V=V_i(\Delta T/T_i)\). The ratio is dimensionless and yields units of **m³**, provided **T_i** and **ΔT** are in **kelvin**.
- Even accepting \(n=1\,\mathrm{mol}\) and the initial volume \(100\,\mathrm{m^3}\), no numerical initial pressure or temperature is printed. The ideal gas equation \(PV=nRT\) relates symbolic variables but **does not fix numerical T_i**. Unless pressure stays constant, the volume change also depends on the pressure path.
- The textbook's 0.37 m³ answer is **only conditional**, not the uniquely determined solution of its actual printed input. Mark any certified answer **HOLD** until the missing assumptions are explicitly authorized.

## Candidate official FBISE HSSC-I summative outcomes

| Original numerical | Printed primary SLO | Other relevant outcome | Observed task and approval |
|---|---|---|---|
| **8.1** | **P-11-C-03**, ideal gas equation — **Application** | None needed | Direct numerical ideal-gas application; teacher sign-off of reference assumptions pending |
| **8.2** | **P-11-C-23**, Carnot efficiency limit — **Knowledge** | **P-11-C-16**, Carnot operation — **Knowledge + Understanding** | Calculation is **Application** and source stem does not specify Carnot; teacher must approve cognitive and model fit |
| **8.3** | **P-11-C-09**, qualitative gas relationships — **Understanding** | **P-11-C-03**, molar ideal-gas equation — **Application** | This would be **Application** under a properly defined constant-pressure process, but source is underdetermined |

These are *candidate* matches to the original official V224 summative theory inventory, **not an officially approved question-to-SLO map**. Do not silently relabel Knowledge or Understanding outcomes to Application.

## Technical release and provenance controls

- V235 has **9** original end numerical problems; V246 covers the first **3/9**. No source rewriting or automatic published answer key. The printed answer labels are cited here only as historical **source data for teacher QC**, explicitly separated from independently derived conditional values.
- Preserve V224/V235 original source and framework manifest, V237–V239 original 18/18 end MCQ preliminary QC, V240–V242 original 13/13 short QC and V243–V245 10/10 visible comprehensive QC.
- Preserve **2,250** exact pinned Units1–6 MCQ IDs/options/keys, **59** original catalogue resources, student/teacher auth roles and Firebase data. Unit7 and Unit8 stay `status=planned`, `questionBankCount=0` and `assessmentStatus=not-published`; unscored lessons and simulations remain accessible.
- New CI will **recalculate the numbers independently** using SI quantities, verify source-page counts/IDs, validate missing-input and model holds, check exact printed official SLO codes/cognitive labels, and rerun all earlier source and pinned-bank regressions. **Passing CI certifies arithmetic and metadata only**, not final teaching approval.

**Human review PENDING. Student solution edition NOT-PUBLISHED. Scored Unit8 bank HOLD.**

**Next V247:** original numericals **8.4–8.6** from printed p.153. Special attention: the heat-engine 8.4 wording says it absorbs heat at the **low** 400 K side while specifying a **high** 600 K side; do not silently change “low” to “high” merely because the printed work answer expects heat absorbed from the hot reservoir. Independently verify heating-time assumptions for 8.5 and Carnot/fixed-sink assumptions for 8.6.
