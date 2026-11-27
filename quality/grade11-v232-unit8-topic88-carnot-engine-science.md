# V232 — Original Grade XI NBF Unit 8 Topic 8.8: Carnot Engine — science, source and release QC

## Visually verified original source

Owner's original NBF Grade XI Physics book, printed pp.143–145, was visually reopened. Original **8.8 Carnot's Engine** spans [143,145]. Subtopics: **8.8.1 Efficiency of Carnot Engine** [144,145]; **8.8.2 Carnot's Theorem** [145,145]. Original figures **8.16** (p–V loop, p.143) and **8.17** (four piston processes, p.143) are verified but **not reproduced** in the public repository. **Example 8.4** and **Assignment 8.4** both appear p.145. Section **8.9 Refrigerator** begins later on p.145, excluded from this scoped update.

The original official FBISE Grade XI framework's pre-existing V224 inventory preserves both **P-11-C-16 (Summative; Knowledge + Understanding; Carnot engine working principle)** and **P-11-C-23 (Summative; Knowledge; Carnot efficiency limit 1−Tc/Th)**. The printed code indexes and SLO status remain untouched. All source formulations below are adaptations and unscored; no academic approval is implied.

## Four reversible cycle stages and equations

1. **Isothermal expansion (T_H):** ideal gas receives positive heat Q_H, expands and does work by the system; absolute temperature remains fixed.
2. **Adiabatic expansion:** Q=0, working gas continues expanding, doing work and cooling from T_H to T_C.
3. **Isothermal compression (T_C):** surroundings compress gas at constant lower temperature; gas rejects heat, represented by a positive **amount** Q_C.
4. **Adiabatic compression:** Q=0; work on gas raises its temperature from T_C to T_H, restoring initial state.

The ideal cycle is reversible. Net work is the area enclosed on the p–V loop, equivalent to net energy transfer **W_net,out=Q_H−Q_C** for a complete cycle (ΔU=0).

For any cyclic two-reservoir heat engine with these magnitudes, **η = W_net,out/Q_H = 1−Q_C/Q_H**; for an ideal **reversible Carnot** engine specifically **η_Carnot=1−T_C/T_H**. Both temperatures must be in **kelvin**, T_H>T_C>0. The efficiency is a theoretical **upper bound** between reservoirs, not an actual observed efficiency of all engines. In the ideal algebraic limit T_C=0 K, η=1, but absolute zero cannot be achieved physically; real irreversible engines do not reach the Carnot benchmark. Carnot theorem: no engine between identical reservoir temperatures can surpass a reversible engine's efficiency; all reversible engines between the same two reservoirs share that bound independent of working fluid.

## Independently verified source-based numerical solutions

**Example 8.4 (original source printed p.145):** T_H=400°C; T_C=30°C. The textbook approximates 273°C to 273 K, so T_H≈673 K, T_C≈303 K, η=1−303/673=370/673≈0.549777…⇒**55%** at book rounding. A precision calculator using T(K)=t(°C)+273.15 gives T_H=673.15 K, T_C=303.15 K, η≈**54.9655%**, still **55%** at 2 significant figures. Do not divide 30/400, nor present 100% as physically achievable.

**Assignment 8.4 (original source printed p.145):** Given a cyclic heat engine with 40% efficiency and Q_H=4 kJ, work output W=0.40×4=**1.6 kJ** and rejected waste heat Q_C=4−1.6=**2.4 kJ**. No reservoir temperatures are specified, so this problem uses general heat-engine efficiency rather than unjustifiably assigning Carnot reversibility.

**Original calculator sample:** positive heat input 4 kJ at 40% produces 1.6 kJ work and 2.4 kJ rejection. Reject empty/NaN/Infinity, heat≤0, efficiency≤0 or ≥100; reject temperature at/below absolute zero, equal or inverted reservoirs and out-of-range numbers. 0% and 100% excluded intentionally as positive-work heat-engine practice boundaries; no claim those arithmetic values are impossible in arbitrary other devices.

## Technical and academic release gate

- New public unscored branded lesson `portal/unit-08-topic88-carnot-engine-v232.html` (printed pp.143–145): stage selector, two browser-only calculators, five revealable concept checks, independently solved textbook Example/Assignment 8.4. No tracking, storage, Firebase/Auth, graded buttons, and no publisher figures or copied question stems.
- Catalogue Unit8 **planned**, `questionBankCount=0`, `assessmentStatus=not-published`, `resourceIds=[]`, `simulationCount=4`. Add only explicit `additionalLearningPreviews[6]` topic 8.8, sourcePages [143,145], same unscored-teacher-review access status. Keep original 59 resource records, Unit7 scored hold, and the exact 2250 pinned Unit1–6 bank identities, options and keys.
- Only fixed links in Unit8 Next Units sidebar, Exam Quick Access and Topic8.7 onward lesson. Existing 8.1–8.7 lesson routes and original simulation links remain unchanged.
- Run real Chromium at 1280px (sidebar), 390px (Quick Access) and 320px (direct), all four stages' accessible `aria-pressed` states, source Example/Assignment values, validation/overflow/browser errors, and earlier V231–V225 source/browser tests, V224 original inventory, V209 and V140, pinned-bank checks. No `--with-deps` Playwright apt installation because prior external Microsoft apt source produced HTTP 403 on otherwise working jobs.
- **Teacher science/cognitive review PENDING; owner scored release HOLD.** A green CI and a merged PR are not independent academic approval.

**Next limited stage:** V233 Topic 8.9 Refrigerator, beginning printed p.145 and extending through original p.147. Do not release it, the complete Unit8, or the textbook end-exercise edition in this PR.
