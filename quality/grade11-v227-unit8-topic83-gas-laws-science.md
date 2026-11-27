# Grade XI V227 · Unit 8 Topic 8.3 — original source-grounded gas-law teaching QA

**Source visually checked:** owner's original NBF Grade XI Physics textbook PDF, printed pages **134–135** (Unit 8, The Gas Laws); figures **8.7** (Boyle), **8.8** (Charles) and **8.9** (Gay-Lussac) remain in the private source book and are **not** copied to this repository. On printed page 135, the next section **8.4 First Law of Thermodynamics** begins; it is deliberately excluded from this independent small lesson.

**Official Grade XI framework records:** pre-existing checked V224 source inventory lists Topic 8.3 as [134,135] with sections 8.3.1 Boyle, 8.3.2 Charles, 8.3.3 Gay-Lussac and **P-11-C-09 (Summative, Understanding)** and **P-11-C-10 (Summative, Application)**. These existing printed SLO codes are retained; no SLO recoding or implied extra curriculum is introduced.

## Independent scientific validation

| Law | Constants and condition | Mathematical relationship | Independent numeric regression |
| --- | --- | --- | --- |
| Boyle | Fixed gas amount and absolute T | pV=constant, p1 V1=p2 V2 | 200 kPa, 10 L → 25 L gives **80 kPa** |
| Charles | Fixed gas amount and p | V/T=constant, V1/T1=V2/T2 | 18 L, 270 K → 360 K gives **24 L** |
| Gay-Lussac | Fixed gas amount and V | p/T=constant, p1/T1=p2/T2 | 100 kPa, 300 K → 450 K gives **150 kPa** |

- In every temperature ratio, use **kelvin**. Conversion: T(K)=t(°C)+273.15. An extrapolated V=0 near −273 °C is an **ideal mathematical** limit, not a physical condensation-free process.
- A p versus V plot under Boyle's assumptions is a downward rectangular hyperbola. V versus T (K), and p versus T (K), are straight proportional lines in the ideal model. These are **descriptions**, not copied NBF publisher figures.
- Pressure is absolute; a gauge-pressure ratio would be inappropriate. kPa and L appear only as matching units on both sides of the corresponding ratio, so they cancel properly.
- The three interactives calculate in-memory only, require finite strictly positive input, guard invalid output, use independent source-based formulas, and explicitly state which two quantities are held fixed. They are original practice, not numbered publisher exercise solutions.
- Concept checks are answer-reveal only (not scored). Exactly zero scored Unit 8 MCQs are introduced.

## Source, route, and release gate

- New separate public **unscored preview** `portal/unit-08-topic83-gas-laws-v227.html`. Update only three explicit discovery routes: existing Unit8 preview metadata, sidebar Next Units, and Exam Quick Access. The Topic 8.2 learning page's 'next topic' text is corrected to a working Topic8.3 link.
- Keep Unit8 `status=planned`, `assessmentStatus=not-published`, `questionBankCount=0`, `resourceIds=[]`; preserve Unit7 holds, existing simulations, all 2,250 pinned Units1–6 question/answer IDs, 59 original resource records, logo, student class/enrollment restrictions, teacher roles, Firebase/Auth and grade persistence.
- No source PDF, original source figures, original exercise stems, hidden answers, authenticated teacher approval decisions, or full-unit certification are published.
- Run latest V227 browser/independent math tests at 1280 / 390 / 320 px, plus prior V226, V225, V224, V209, V140 and pinned-bank regressions before marking ready. The legacy V226 regression is extended to check that its Topic8.2 link is unchanged **in addition** to the new Topic8.3 link.
- **Approval state:** teacher science review PENDING; teacher cognitive review PENDING; owner scored assessment release HOLD. A green CI and merge do not replace human approval.

**Next scoped milestone:** V228, separately validate original Topic 8.4 First Law of Thermodynamics (starting on printed p.135, continuing beyond this PR).
