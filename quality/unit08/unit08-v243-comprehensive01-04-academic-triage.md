# V243 — Original NBF Grade XI Unit 8 Comprehensive Questions 8.1–8.4: source-first academic QC

## Provenance, scope and important baseline distinction

**Continuation after confirmed merged PR #345 (V242).** The owner's original NBF Grade XI Physics scan was reopened visually at **printed exercise p.152** (the four comprehensive question stems and Q8.4 parts (a)–(d)) and the original explanatory chapter sections on **pp.129–140**. This is **internal preliminary scientific/QC metadata only**. Original publisher prose, figure images, multiple-choice keys, written model answers, derivations and source page screenshots are not republished.

The existing **V235** original source index records **10 visible numbered comprehensive questions** on printed **pp.152–153**, using source IDs `8.1–8.7, 8.9–8.11`. The original **comprehensive 8.8 is absent** in the inspected pages; **do not invent it or silently renumber**. V224's earlier 11-question count is preserved as historical evidence pending reconciliation.

## Teacher-facing amendment triage — retain original source wording

| Original comprehensive item | Compulsory or optional? | Scientific issue / precision needed | Keep original? May an independent item be added? |
|---|---|---|---|
| **8.1 — internal energy and absolute temperature** | **COMPULSORY model qualification in teacher solution** | Original internal-energy text (p.129) connects gas-molecule mean kinetic energy to absolute temperature, and p.130 broadly says constant temperature means constant internal energy. That blanket statement is **not universal**. For a fixed amount of ideal gas, `U` depends on `T` alone; only a **monatomic ideal gas** has the simple translational expression `U=(3/2)nRT` under the usual model. More general ideal-gas changes may use `ΔU=n C_V ΔT` when `C_V` is constant; real matter may also change intermolecular potential energy or phase at constant temperature. | **Retain original question**. Add an explicit model note; do not silently substitute a different publisher stem or state `U∝T` for all materials. No extra item required for source coverage. |
| **8.2 — gas laws** | **OPTIONAL precise definitions/kelvin checklist; SLO breadth review** | Source **section 8.3** (pp.134–135) specifically names **Boyle's law** (at constant temperature and amount), **Charles's law** (at constant pressure and amount) and **Gay-Lussac's law** (at constant volume and amount). State `PV=constant`, `V/T=constant`, `P/T=constant`, respectively, with `T` in **kelvin**. `PV=nRT` is the ideal-gas relation in section 8.1.2 and is suitable only as a connected concept, **not** a fourth named subsection invented for 8.3. | **Retain original**; optional table and graph references in a future approved teacher solution. The broad original question should not automatically be mapped to every calculation or advanced diagram SLO. |
| **8.3 — First Law of Thermodynamics** | **COMPULSORY sign and state-versus-path precision** | The original page 135 uses the convention **heat supplied is positive**, and **work done by the system is positive**. For the textbook's closed-system simplification, **`ΔU=Q−W_by`**, equivalently **`Q=ΔU+W_by`**. If switching to **work on the system**, use `ΔU=Q+W_on`; never swap these without reversing the sign. `ΔU` is a state-function change, but `Q` and `W` are energy transferred along a process, not energy stored inside the body. | **Retain original**. Keep example equations and symbols internally consistent in any later approved worked solution; no replacement item needed. |
| **8.4 — four thermodynamic processes** | **COMPULSORY all-four-parts completeness, idealisations and SLO-fit check** | Preserve the original QUESTION order: **(a) isothermal**, **(b) isobaric**, **(c) adiabatic**, **(d) isochoric**. This differs from the source's chapter teaching order (isothermal, adiabatic, isochoric, isobaric). **Isothermal:** `T` constant, and `ΔU=0` only for a fixed ideal-gas amount (not arbitrary matter). **Isobaric:** `P` constant, `W_by=PΔV` for a quasistatic constant-pressure step. **Adiabatic:** `Q=0`, not defined by speed or reversibility. **Isochoric:** `V` constant, hence zero **PΔV boundary work** but other work modes may be possible. | **Keep all four original subparts**. Additional independently drawn P–V sketches may be prepared later, with explicit axes/model conditions and teacher review. Do not replace original source diagrams with unchecked copies. |

**No new defect requiring publisher-stem rewriting has been established in these four exercise prompts.** The compulsory flags concern the **future solution's scientific accuracy**, original part completeness and authentic assessment-framework eligibility. These notes are not teacher-certified solutions.

## Original FBISE HSSC-I summative outcome candidates

The V224 source inventory assigns the following **printed codes and cognitive levels**; item-specific placement requires human review.

| Source question | Primary original candidate | Secondary candidate | Reviewer-observed task |
|---|---|---|---|
| **8.1** | **P-11-C-02** — temperature/internal energy (Understanding) | **P-11-C-12** — relation between temperature and internal energy (Understanding) | Understanding, conditional on ideal versus real-gas model |
| **8.2** | **P-11-C-09** — qualitative P/V/T relationships (Understanding) | **P-11-C-10** — isothermal P–V graph (Application) | Understanding of three laws; any extended graph/calculation needs separate cognitive approval |
| **8.3** | **P-11-C-08** — First Law and sign convention (Knowledge + Understanding + Application) | **P-11-C-11** — conservation of energy (Application) | Understanding the energy balance, with further applications possible |
| **8.4** | **P-11-C-08** — First Law effects of processes (Knowledge + Understanding + Application) | **P-11-C-10** — constant-temperature P–V graph (Application) | Four-part explanatory Understanding, with incomplete direct coverage under secondary graph outcome |

**Important limitations:** Source-topic proximity is not proof of an approved official SLO-to-item match. The recorded outcome P-11-C-10 covers a specific isothermal graph, not a license to classify all four process definitions as one official Application task. This PR preserves exact printed IDs without inventing new theory outcomes.

## Review status, inherited safeguards and next stage

- Unit 8 original **18/18 end MCQs**: preliminary QC documented in V237–V239; **13/13 short questions**: preliminary QC documented in V240–V242. This V243 begins **comprehensive** QC with the first **4 of 10 visible numbered** originals.
- The original Unit 8 comprehensive **8.8 is not visibly printed**; the earlier V224 11-count remains historically documented in V235 and this file. No synthetic missing question.
- Unit 7 and Unit 8 remain `status=planned`, `questionBankCount=0`, `assessmentStatus=not-published`. Student-accessible unscored lesson previews and existing simulations are preserved unchanged.
- Exact **2,250** pinned Units1–6 MCQ IDs/options/keys, **59** catalogue resources, and all Firebase/Auth/teacher roles/class registration/student results/navigation remain unchanged.
- Dedicated metadata-only CI should verify source IDs/pages, the four source subparts of 8.4, all four review decisions and original SLO candidates against the V224 source, V235 numbering anomaly, V242–V237 regressions and bank integrity. It does **not** run a browser as there are no public UI changes.
- **Human science review PENDING; item-to-SLO/cognitive teacher approval PENDING; teacher solution edition NOT-PUBLISHED; scored-bank owner release HOLD.** Passing CI or merging this review-only PR does not approve marking scheme answers.

**Next proposed V244:** review the original comprehensive **8.5–8.7** on p.152 (heat engine, Second Law and Carnot engine efficiency), leaving the source-numbering gap explicitly recorded. Then review the original comprehensive **8.9–8.11** on p.153. Only after question-level science/answer/SLO checks should a graded bank or solved edition be considered.
