# V94 — Unit 6 Academic Completion & Learning Desk Blueprint (phase 1; source-backed baseline)

**Owner direction (20 Nov 2026):** Finish a coherent, academically reviewed Grade XI **Unit 6: Fluid Mechanics** student learning experience **before** starting Unit 7. This document is a first-pass inventory/academic audit plan, **not** a certificate that all questions, derivations, diagrams, or marking schemes have been checked.

**Release boundary:** Documentation only in V94 phase 1. No changes to existing students, deployed source banks, figures, authentication, enrollment, Firebase rules, external Drive/PDF permissions, billing, or school grades. The complete Unit 6 course remains **planned** pending academic signoff.

## Verified inputs and evidence levels

1. **Owner's actual master file (read directly, 20 Nov 2026):** `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, 577 combined PDF pages, compilation dated 17 Oct 2026. At PDF pp.1–4, master contents identifies **Volume 1 solved study** with 32 source sections, 335 original PDF pages; PDF pp.312–314 contain 14 printed end-of-unit MCQs and prepared answers; PDF pp.315–318 begin/comprise 11 short response items, pp.319 onward comprehensive, pp.330 onward numericals. A combined volume also includes Volume 2 student practice (contents lists 28 sections and 212 original PDF pages) and Volume 3 teacher marking schemes (3 source sections, 24 original PDF pages). The figures and counts are *inventory*, not a complete independent accuracy audit. **Do not upload the 577-page private source to the public repo.**
2. **Official assessment framework (read directly, 20 Nov 2026):** owner's `11_Physics_HSSC_I_model_paper_50_percent(9).pdf`, FBISE Grade XI National Curriculum 2022–23 / Inclusive Scheme of Studies 2024; cover specifies **50% MCQs and 50% descriptive**. The exact Unit 6-domain B SLOs appear on PDF pages **11–12**. The official document, not the notes' title or auto-tagging, controls summative/formative definitions.
3. **Source provenance caveat:** The prepared Unit 6 master is *author-produced solved/practice material*. It is not itself a full scan of the original NBF textbook. Four teacher-supplied original NBF images of Figures 6.2, 6.3, 6.5(c) and 6.6 were used for the limited V93 figure audit. A comprehensive textbook-line-by-line audit still needs access to the actual NBF original for text/figure discrepancies. Never claim all 577 pages are original NBF pages.
4. **Current repository state on main, post-V93:** seven Unit6 source banks of **80 original MCQs each** are provisionally public: **560/560**, zero figure holds, **136** individual situation-labeled questions, **zero** authentic shared-stimulus Unit6 groups. The Grade XI central Test Builder has **2,250** provisional public MCQs (Units1–5 1,690 + Unit6 560). Five mapped public Fluid Mechanics simulations and one direct YouTube link predate V94. Full Unit 6 has `portal/learning-catalog.json` `status:"planned"`, `questionBankCount:0`, `assessmentStatus:"not-published"`, no protected original PDF and no verified individual `sloCodes` for source MCQs. Preserve that distinction.

## Source section map from Volume 1 contents (compiled PDF page numbers)

| Topic | Part A: 80 MCQs | Part B: SLO Q&A | Part C: Derivations | Part D: Examples/activities |
|:---|---:|---:|---:|---:|
| 6.1 Upthrust and Archimedes’ Principle | 3 | 17 | 26 | 40 |
| 6.2 Viscous Drag and Terminal Velocity | 51 | 65 | 78 | 88 |
| 6.3 Fluid Flow | 99 | 113 | 121 | 127 |
| 6.4 Equation of Continuity | 137 | 151 | 162 | 173 |
| 6.5 Bernoulli’s Equation | 183 | 197 | 207 | 220 |
| 6.6 Applications of Bernoulli’s Equation | 227 | 243 | 255 | 266 |
| 6.7 Superfluidity | 274 | 289 | 298 | 304 |

**Textbook exercise section starts in compiled Volume 1:** 14 textbook MCQs p.312; 11 short questions p.315; 11 comprehensive p.319; 11 numericals p.330. The master additionally inventories question-only student papers and Version A/B/C assessment + teacher marking schemes. Do not confuse **PDF page** with printed NBF book page.

## Official FBISE Grade XI Unit 6 SLO boundary (framework PDF pp.11–12)

| Code | Official scope (faithful short paraphrase) | Official assessment | Cognitive level |
|---|---|---|---|
| P-11-B-33 | Justify and use Archimedes’ flotation principle | Summative | Application |
| P-11-B-34 | Explain/justify how ships float | Summative | Application |
| P-11-B-35 | Define/apply steady, incompressible and non-viscous flow for ideal fluids | Summative | Knowledge + Understanding |
| P-11-B-36 | Use continuity to solve problems | Summative | Application |
| P-11-B-37 | Explain higher speed in squeezed rubber pipe | Summative | Understanding |
| P-11-B-38 | Justify continuity as conservation of mass | Summative | Application |
| P-11-B-39 | Justify pressure differences due to flow-speed differences (Bernoulli effect) | **Formative** | Application |
| P-11-B-40 | Explain/apply Bernoulli's equation to horizontal and vertical flows | Summative | Application |
| P-11-B-41 | Explain viscosity of real fluids | Summative | Understanding |
| P-11-B-42 | Describe viscous retardation of an object moving in fluid | Summative | Understanding |
| P-11-B-43 | Describe superfluidity and its implications | Summative | Understanding |
| P-11-B-44 | Analyze real-world Bernoulli applications | Summative | Application |

This table maps **framework outcomes**, not every individual MCQ. Existing source questions remain `boardEligible:false`, `sloCodes:[]`, and `cognitiveLevel:"Unspecified"` until each item is independently assessed; never auto-assign an item official status from its topic.

The framework separately labels experimentation skills as formative-for-PBA in Domain N. It does **not** justify inventing a PBA designation for every Unit 6 theory item.

## Initial source issues already expressly documented (not new silent corrections)

- **Textbook MCQ 3, master p.314:** The source notes that option **B** is intended, but Stokes drag does **not** strictly require constant speed; the small Reynolds-number/creeping-flow condition is more fundamental. **Compulsory clarification for instructional explanation**, not unilateral rewriting of the original textbook stem.
- **Textbook MCQ 12, master p.314:** Increased speed after halving pipe radius assumes **fixed volume flow rate**. Include this assumption prominently when teaching/applying the answer. **Compulsory context note**.
- **Textbook MCQ 1, master p.314:** The application of flotation to density requires **additional measurements**, not density arising from flotation alone. **Compulsory context note**.
- **Textbook short Q6.8, master pp.317–318:** The textbook uses “upthrust” for an aircraft on a runway, but the notes rightly distinguish **aerodynamic lift** from Archimedes’ buoyancy. **Compulsory accuracy note**; preserve the original wording in a clearly attributed exercise.
- **Textbook numerical 6.1, master p.330:** The published radius `5.1×10⁻⁶ m` depends on the **unstated water-droplet density** `1000 kg m⁻³`, with `g=9.8 m s⁻²` and neglected air buoyancy. **Compulsory assumption disclosure** before presenting a single numerical result.
- **Short Q6.3, master p.315:** A river's **width alone** does not fix continuity speed; full cross-sectional area and steady flow matter. **Compulsory condition statement**.

These findings are grounded in the prepared source's own QC notes. They need comparison with the original NBF textbook before deciding whether any item requires a *teacher-approved* correction. No public bank question is changed by this audit.

## Gap register: what is public vs what is still owed

| Component | Current public condition | V94 review / V95 delivery |
|---|---|---|
| Seven MCQ banks (560) | Available in provisional central/standalone self-practice | Per-item scientific QC, original answers, optional/compulsory changes, duplicates, numerical dimensions and SLO/cognitive decisions |
| Four figure-referenced original illustrations / 6 questions | Source-compared and released in V93 | Teacher verifies final displayed diagrams and print/review fallback; maintain alt text and no NBF scans |
| Seven Part B SLO explanation sets | In owner's prepared source, **not full public Unit6 learning lessons** | Audit each against framework B33–B44 and author topic lessons without false item-level certification |
| Seven Part C derivation/formula sets | In owner's prepared source | Audit derivations, assumptions, symbols, dimensions, worked examples |
| Seven Part D worked activities/assignments | In owner's prepared source | Check all problems; select safe student-facing explanations and interactive steps |
| 14 textbook MCQs | Prepared as answered study material; not verified as a standalone public portal set | Review original pp.108–109, diagram in Q11, answer reasoning; separate source provenance from newly authored questions |
| 11 short + 11 comprehensive + 11 numerical textbook exercise items | Prepared solved/source material, not published as full interactive unit desk | Full original-text, calculation and SLO check; log compulsory/optional revisions before edits |
| Student practice Versions A/B/C and teacher marking schemes | Included in master but not published in Unit6 portal | Independently check against **current 50/50** FBISE model, avoid assuming prior practice paper matches exact current official pattern |
| Simulations | Five Unit6-mapped standalone public simulations | Map each to correct topic; test keyboard/mobile/projector legibility; do not invent SLO attestation |
| Student navigation | Unit6 `planned`, seven separate previews, several outdated “early preview” labels | V95 single coherent `Read → Simulate → Practice → Revise` Unit6 desk with honest readiness flags |
| Restricted downloadable notes | Not securely deployed; protected owner PDFs are private | Defer until actual backend rules and authorization are independently tested and owner approves any billing |

## Phased acceptance plan

**V94-A — Evidence/inventory (this PR):** Document actual source, official framework, existing portal gap, important known QC warnings and no-change boundaries. No student-facing code changes.

**V94-B — Academic item review (subsequent reviewed changes):**
1. Audit all 14 end-unit MCQs and four printed sets: text/options/key/figure/math.
2. Audit 11 short, 11 comprehensive and 11 numerical exercises, tracking each source line/page, assumptions and *minimum* necessary corrections.
3. Audit seven Parts B–D; review all 560 source MCQs systematically for content accuracy and independent scenario descriptions. Separate source-preservation from editorial recommendations.
4. Produce a **question-level issue register**: source ID, source PDF page, NBF printed page, official SLO candidate, factual issue, compulsory vs optional change, “retain original and add alternative?” and teacher approval state.
5. Only teacher-approved corrected content becomes release material. Do not generate a blanket “all verified” claim before item-level review.

**V95 — Unit 6 Integrated Learning Desk:**
- Seven coherent topic pages with micro-lessons, worked examples, formulae, assumptions, original accessible figures and simulation hookups.
- Read → Simulate → Practice → Revise, consistent mobile/projector design and a unit landing page.
- Clear distinction between **public practice**, **lesson content**, **teacher-only answers**, **formative enrichment**, and **FBISE summative exam-prep**. Do not advertise private PDFs as protected if accessible by direct GitHub URL.
- Recheck unit-scoped test builder, correct count 560/2250, figure cards, print review, no cloud grades and no new paid services. Mark unit *available* only after teacher approval and actual requirements satisfied.

**V96 — Assessments:** Only after V94 science and source review; map official 50% MCQ / 50% descriptive format, scenario stimuli, answer schemes, error handling and print/OMR.

**V97 — Start Unit 7:** No new Unit7 content PR until this Unit6 integrated learning desk has been approved.

### No-merge conditions for V94-A
This doc does not authorize any content release, user permission change or mark-by-mark academic certification. Source privacy remains intact. Confirm any CI checks that run at the branch head before merging the documentation-only PR.
