# V94-D — Grade XI Unit 6 academic consolidation, teacher decisions and V95 release gates

**Date:** 21 November 2026  
**Status:** PRE-RELEASE SIGNOFF MATRIX, not final course approval. **Source of truth:** merged V94-A/B/C audits in `quality/`, not a public copy of the owner's private 577-page solved master or a newly obtained original NBF scan.

## 1. What is complete and what is not

GitHub PRs **#89–#95** are merged topic-level **first-pass academic reviews**, based on the teacher's private compiled `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`. They add checks and teacher recommendations, **not** seven publishable courses. Exercises were also separately audited in V94-B1/B2/B3: **14** end-unit MCQs, **11** short, **11** comprehensive, **11** numerical. Original printed **NBF pp.110–111** were visually checked in the previous audits; printed **pp.89–106 and diagrams not previously supplied** were not comprehensively validated.

Current verified GitHub inventory:
- Unit6: **7 × 80 = 560** provisional original public topic MCQs, including **136** standalone situational MCQs and **0** authentic shared-stimulus Unit6 groups.
- Grade XI: **2,250** public provisional MCQs. Six former figure-held questions are released after checking source figures **6.2**, **6.3**, **6.5(c)** and **6.6** and pairing with separate original educational illustrations. Zero Unit6 figure holds.
- **Five** Unit6-mapped public simulations, catalogued provisionally. Full Unit6 course `portal/learning-catalog.json` status is **`planned`**, `assessmentStatus:"not-published"`. Source per-MCQ SLO/cognitive classification and exact FBISE mode remain **unverified/not-ready**.
- Audit recommendation count: **65 distinct teacher issues** across 7 topic register files (**8 + 9 + 9 + 9 + 9 + 10 + 11**). That is not a count of identified wrong answers. Most are **conditional teaching notes, provenance and technical source-visual checks**, not rewrites.

## 2. Seven-topic audit source / gap matrix

| Topic | Compiled private master Part B / C / D | Prepared counts | Register | Mandatory V95 lesson safeguards | Source-image and teacher signoff |
|---|---|---|---|---|---|
| **6.1** Upthrust/Archimedes | **17–25 / 26–39 / 40–50** | B52, C15 sections, D24 | **T61-01…08** | Equilibrium for `F_B=W`, density/displaced volume, stability versus buoyancy, accessible units & cylinder pressures | NBF printed pp.89–91, Fig6.1, original Example/Assignment6.1 remain to be compared; Fig6.2 limited V93 visual match; teacher **pending** |
| **6.2** Viscous Drag | **65–77 / 78–87 / 88–98** | B56, C14, D32 | **T62-01…09** | Low-Re Stokes applicability, buoyancy, dimensional analysis `kηrv` vs `6π`; do **not** present formal **~10.9 m/s** droplet as observed real speed | NBF Table6.1, Fig6.4 and pp.91–95 original Example/Assignment6.2 unverified; Fig6.3/6.5(c) limited V93 match; teacher **pending** |
| **6.3** Fluid Flow | **113–120 / 121–126 / 127–136** | B48, C10, D32 | **T63-01…09** | Steady ≠ always laminar; irrotational ≠ straight paths; supplementary `Q=V/t` belongs to developed practice, not prescribed B35 mathematics | Fig6.6 limited original-source match; NBF pp.95–96 original prose and sidebars unverified; teacher **pending** |
| **6.4** Continuity | **151–161 / 162–172 / 173–182** | B56, C17, D32 | **T64-01…09** | General `ρAv` mass balance, density-constant reduction `Av`, branching and before/after hose discharge, pressure not inferred from continuity | Fig6.7/6.8, original Example/Assignment6.3 and NBF pp.96–99 unverified; teacher **pending** |
| **6.5** Bernoulli's Equation | **197–206 / 207–219 / 220–226** | B56, C12, D32 | **T65-01…09** | Same streamline/ideal flow, outlet pressure-work sign, height datum, gauge/absolute `P`, B39 formative vs B40 summative | Original NBF Fig6.9 and pp.99–101 unverified; author-original diagram needs visual signoff; teacher **pending** |
| **6.6** Applications | **243–254 / 255–265 / 266–273** | B56, C13, D32 | **T66-01…10** | Correct bulb/air-jet atomizer vs pump, Venturi and Torricelli assumptions, spinning-body aerodynamics; textbook-model **450/410 m/s** wing lift is *not* a valid real incompressible-air forecast | Fig6.10–6.15 and NBF pp.101–106 original Example/Assignment6.4 unverified; teacher **pending** |
| **6.7** Superfluidity | **289–297 / 298–303 / 304–311** | B48, C11, D32 | **T67-01…11** | Zero viscosity does not cancel gravity/mass/all losses; helium benchmarks approximate/pressure-dependent, qualitative quantized vortices, no fabricated B43 math | NBF printed p.106 and Fig6.16/6.17 unverified; **source Part D p.304 reproduces actual NBF Fig6.17 — never rehost**; teacher **pending** |

Counts are *prepared-item/section inventories*, **not counts of FBISE-certified examination questions**. Master page numbers are combined PDF page numbers, **not original printed NBF book pages**.

## 3. Cross-topic actionable teacher signoff list

| Release gate | Decision required | Current state | Blocking to full-course release? |
|---|---|---|---|
| **A — Scientific limitations** | Approve visible notes for Stokes high-Re examples, buoyancy/equilibrium, flow steadiness, signed Bernoulli work, pressure versus discharge, transonic-style wing model, quantum superfluid interpretation | **Pending teacher approval** of the 65 issue entries | **Yes** |
| **B — Source fidelity** | Verify original printed figures/tables/numbered textbook examples that student lessons will call “NBF exact”; if unavailable, author distinct educational representations and state what remains unverified | **Partial**: Figure6.2/6.3/6.5c/6.6 limited check; original pp.110–111 exercise evidence; other original chapter art/text unverified | **Yes for any exact-source claim**, not for a properly marked original learning graphic |
| **C — Rights** | Keep original scanned textbook pages and **NBF Figure6.17 excerpt** outside public GitHub/Drive public lessons; make new verified accessible original sketches instead | **Protected material identified**, replacements not yet approved | **Yes** |
| **D — Item-level FBISE classification** | For an exam-labelled quiz, individually assess official SLO, cognitive demand, answer and summative/formative status; keep **B39 formative**, **B43 summative/understanding**, other official B33–B44 classifications per framework | **Not individually verified**; `perQuestionSloVerified:false`, `exactFbiseModeReady:false` | **Yes for “board-certified”/exact-FBISE claims**, not for plainly labelled provisional self-practice |
| **E — End-of-unit exercises** | Preserve the actual NBF wording and source answers in private record. Publish a distinct labelled teacher explanation for confirmed textbook **Numerical6.9** `0.72 kg/m³` inconsistency and distinguish gauge/absolute pressure. Flag missing assumptions Q6.1,6.7 | Original textbook **pp.110–111 checked**, mathematical caveats documented; student-facing correction note **not approved** | **Yes if exposing solved end-unit exercises** |
| **F — Lesson completeness** | Teacher signs off each of seven topic student lesson drafts, formulae, diagrams, examples, links to 5 existing simulations, practice/review controls | **Not built** | **Yes** |
| **G — UX / accessible rendering** | Check `Read → Simulate → Practice → Revise` navigation, phone ~390px, keyboard and screen reader, projector legibility, math exponents, print, reduced-motion and no broken links | **Not tested for integrated desk** | **Yes** |
| **H — Public-data and access security** | Public pages/questions must not be advertised as login-protected. No teacher keys, private scanned PDFs, school grades, protected notes or student data on public GitHub. Any restricted offering needs independently tested server-side permissions | **Existing public preview only; secured-content rollout not validated** | **Yes for protected/graded features** |
| **I — Release regression** | Verify Unit6 560, GradeXI 2250, 136 scenarios, 0 holds, 5 mapped simulations, original question IDs/keys, browser and GitHub Actions green; then change catalogue `planned` only after teacher signs off | **Current counts observed; final V95 integration not tested** | **Yes** |

### Immediate teacher-facing decision format

For each existing register item `T61-01` through `T67-11`, the teacher should choose **Accepted note / Needs original NBF check / Needs amendment / Optional deferred**. **Do not overwrite the source question or mark it corrected from a merged PR alone.** Use the full referenced QC document for its source item IDs, rationale, compulsory-vs-optional severity and whether the original can remain. Relevant prior end-unit registers: `SR-01…07`, `CR-01…07`, `NUM-01…07`.

## 4. Proposed V95 delivery plan (not implemented by V94-D)

1. **V95-A — Unit6 learning-desk scaffold:** One coherent seven-topic landing page with fixed `Read → Simulate → Practice → Revise` navigation and explicit `provisional study` labeling. Integrate only safe public links and the five existing Unit6 sims; **retain full-unit catalogue `planned`**.
2. **V95-B — Topic lessons and original visual aids:** New short student-readable explanations based on **teacher-accepted** corrections, original figures with alt text, derivative reasoning, optional deeper conceptual sections, and staged worked numericals. Never copy private source pages or NBF Figure6.17 excerpt.
3. **V95-C — Student-safe review and assessments:** Keep 560 source MCQs and 136 standalone situation items with immutable original IDs/keys. Introduce verified, separately labelled end-unit questions / answers and genuinely common-stimulus groups only after independent academic review; never invent item-level official FBISE status.
4. **V95-D — Acceptance and status:** Static/unit/integration regressions, browser + mobile + projector + printable view QA, rights/access review, teacher signoff. Only then adjust `portal/learning-catalog.json` and user notices to accurately report the released full course.

**Do not start Unit 7 until the teacher accepts the integrated Unit6 learning experience.** No one should treat a docs-only merged audit as evidence the complete Unit6 student course is live.

## 5. Traceability

- Topic reviews: `quality/grade11-unit06-v94c2-topic61-detailed-qc.md` through `quality/grade11-unit06-v94c2-topic67-detailed-qc.md`, merged through PRs #89–#95.
- End-unit reviews: `quality/grade11-unit06-v94b1-short-response-academic-audit.md`, `quality/grade11-unit06-v94b2-comprehensive-academic-audit.md`, `quality/grade11-unit06-v94b3-eleven-numerical-audit.md`.
- Earlier inventory: `quality/grade11-unit06-v94c1-seven-topic-bcd-qc-register.md`.
- Machine-readable **provisional, blocked-by-default** release matrix: `quality/grade11-unit06-v94d-signoff-matrix.json`.

### Merge restrictions for this V94-D PR

**No student-facing code or lesson, PDF/scanned original artwork, questions, key corrections, course catalogue change, student account/grade, Firebase or payment operation is performed.** Merge of this documentation/guard file after teacher review is an approval of a *plan and issue register*, not approval of unpublished lessons, exam certification or source-reuse rights.
