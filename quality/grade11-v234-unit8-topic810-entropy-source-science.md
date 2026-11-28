# V234 — NBF Grade XI Unit 8 Topic 8.10 Entropy: original source and science QC

## Original source and official curriculum scope

Owner's original NBF Grade XI Physics textbook `11 Physics Book(10).pdf` reopened visually at **printed pp.147–149**. Original section **8.10 Entropy** begins p.147 and ends p.149; subtopics **8.10.1 Sign Convention for Entropy** p.148 and **8.10.2 Entropy and Energy** p.149. Original textbook Figures **8.19** and **8.20**, both p.148, are **not reproduced** in repository. Original **Example 8.6** and **Assignment 8.6** both on p.149. Printed p.150 begins chapter summary and exercises, **not Topic 8.11**.

Existing V224 source inventory records exact **P-11-C-18, P-11-C-19, P-11-C-20, P-11-C-21 and P-11-C-22**, all **Summative; Understanding**, FBISE HSSC-I framework p.14. Their printed codes and summative designation are preserved without silently extending the framework. An academic teacher has not independently approved these outcomes' activity mapping.

## Sign conventions and scientific model limits

Entropy is a state variable; the textbook's introductory particle disorder/randomness, unavailable energy and arrow-of-time descriptions are useful qualitative teaching analogies, not universal microscopic definitions. Distinguish:
- **System entropy** can increase or decrease, depending on heat and material exchanges.
- For a **reversible isothermal** transfer at fixed absolute temperature, **ΔS_system=Q_rev/T**. Q_rev is **positive for heat entering**; **negative for heat leaving**. T must be in **kelvin**; entropy SI unit **J K⁻¹**. For variable temperature, use an integral of δQ_rev/T along a reversible path, not a single arbitrary ratio.
- For **a reversible process**, *total entropy of system plus surroundings* does not increase; it is not correct to assert **ΔS_system=0** for every reversible process.
- For an **irreversible process** in an **isolated whole**, entropy increases. The Second Law's nondecreasing requirement applies to the whole isolated system (or combined system and surroundings), not each subsystem. A cooling body with ΔS_body<0 can transfer entropy to the environment.
- Real friction, heat transfer across a finite temperature gap, mixing and dispersion give familiar irreversibility. Avoid claiming an arbitrary process is reversible simply because it is slow.

## Exact source problems and independent calculations

**Original Example 8.6** printed p.149: 700 g of ice melts at 0°C; source latent heat of fusion **L_f=3.36×10⁵ J/kg** (source's approximate constant).
- m=0.700 kg; Q_rev=m L_f = **235,200 J**, absorbed.
- Book uses T=273 K; ΔS=+235200/273=**+861.538… J/K**, rounded **+861.5 J/K**. This matches the source's stated answer and sign.
- Browser calculator uses precision offset 273.15 K: **+861.066… J/K**, slightly different because the book rounds T. Student lesson explains this explicitly. No change to original textbook answer.

**Original Assignment 8.6** printed p.149: a body at **150°C** undergoes a **reversible isothermal process**; **7,373 J of heat is removed**. Do not treat the heat as +7373 J. Q_rev=**−7373 J**; T=150+273=**423 K**; ΔS=−7373/423≈**−17.430… J/K**, i.e., **−17.4 J/K** to 3 significant figures. With 273.15 K conversion: ΔS=−7373/423.15≈**−17.424… J/K**. Negative entropy change of the body does not mean the entropy of the surrounding isolated whole decreases.

## Student technical and release boundaries

- Public branded *unscored* source lesson `portal/unit-08-topic810-entropy-v234.html`, conceptual discussion, system-vs-surroundings caution, interactive four-scenario explanation selector, two browser-only calculators, five independent reveal-on-demand self-checks and textbook source-data worked Example/Assignment 8.6. No copied original diagrams, scanned pages, exercise stems or publisher marking key.
- Explicit added Unit8 `additionalLearningPreviews[8]` topic `8.10`, pages `[147,149]`, access `public-unscored-study-teacher-review`. Update only Next Units sidebar, Exam Quick Access and Topic8.9 forward lesson. Do not create Topic8.11 or invent any source pages.
- Unit8 must remain **status planned, questionBankCount 0, assessmentStatus not-published, resourceIds [], simulationCount 4**. All original **59** resource records and **2,250** pinned Units1–6 MCQ IDs/options/answers remain unchanged. Unit7 graded hold, Firebase/Auth, student identity, enrollment, class roster, score persistence and teacher permissions remain unchanged.
- Preserve all earlier V225–V233 science and real browser tests by adjusting only exact unscored topic-index/nav expectations, plus V224 source audit, V209 and V140. Dedicated Chromium test runs at 1280px sidebar, 390px Quick Access, and 320px direct entry. Test example, assignment, signed math, changed inputs, temperature invalidity, interactive stage states, no JS runtime error, horizontal overflow, and graded-release flags. Use `npx playwright install chromium` without unrelated Microsoft apt sources which previously failed with HTTP 403.
- Teacher original science review **PENDING**, cognitive review **PENDING**, owner scored release **HOLD**. CI green or a merged PR does not substitute for teacher academic approval.

**Next source task (not V234):** review printed p.150 onward chapter-summary and **end-of-unit questions** in small batches, including original MCQs, short/extended responses and end-of-unit numericals. Plan any future graded bank only after independent answer verification and teacher approval.
