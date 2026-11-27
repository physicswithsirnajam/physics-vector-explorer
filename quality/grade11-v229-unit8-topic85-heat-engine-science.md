# V229 — Original NBF XI Unit 8 Topic 8.5 Heat Engine: source, physics, and release review

## Original textbook source and official outcome

The owner's original **NBF Grade XI Physics** textbook was visually checked at **printed pp.140–141**, section **8.5 Heat Engine**. The section introduces conversion of heat to mechanical work, the *hot source*, *cold reservoir/sink*, and *working substance*, with **original Figure 8.14 on p.140** and its net-work energy balance **W=Q1−Q2 on p.141**. The source also describes the four strokes of a conventional petrol engine: **suction/intake, compression, power and exhaust**, on printed p.141. Topic **8.6 Reversible and Irreversible Processes** begins later on p.141 and is deliberately excluded.

The established original Grade XI FBISE source inventory (V224) records this Topic 8.5 as printed pages **[140,141]**, SLO **P-11-C-13**, *Summative — Knowledge*, with display meaning **operating principle of a heat engine** (original framework p.13). This original SLO coding is retained, without renumbering or converting it to a new rubric. The later Carnot efficiency limit and formal entropy content belong to later topics; this small lesson does not certify or replace them.

No original textbook figure, scanned source page, original publisher question text, or publisher marking key is copied to GitHub. This is a separately written teaching adaptation. Unlike earlier subtopics, original 8.5 has **no numbered textbook example or assignment** identified in the verified V224 source manifest. V229 therefore does not invent one.

## Scientific sign convention and calculations

The engine-flow diagram is an independently written **semantic text diagram**, not a recreation of original Figure 8.14.

- Define **Q_H** as a **positive magnitude absorbed** from the hot reservoir and **Q_C** as a **positive magnitude rejected** to the cold sink; these are *amounts*, not both positive signed transfers into the working fluid.
- In the **signed First Law** from Topic 8.4, the net heat received by the working substance is **Q_net = +Q_H − Q_C**. For a complete engine cycle, **ΔU_cycle = 0**, so **W_net,out = Q_H − Q_C**. Treat W as *net* cycle output rather than claiming the single power-stroke work equals this difference.
- A positive-work engine requires **Q_H > Q_C**; a cyclic engine rejects heat. **Q_C=0** may be accepted only as an algebraic boundary case in an elementary calculator, but **not** claimed physically achievable for a real cyclic heat engine (Second Law restrictions remain for later source pages).
- Independent original scenario: Q_H = 1000 J, Q_C = 650 J, so **W_net,out = +350 J**. Changing to Q_H=900 J and Q_C=500 J gives **+400 J**; Q_C >= Q_H is correctly rejected as not describing *positive engine output*. Reject negative heat magnitudes, Q_H<=0, blanks, NaN/Infinity, and out-of-range numerical results.
- **Petrol-engine strokes:** suction/intake (down, charge enters), compression (up, trapped charge), power (down, ignition and expansion), exhaust (up, burnt gases leave). Standard four-stroke cycle uses two crankshaft revolutions. Unlike the abstract heat-reservoir model, petrol combustion occurs in the cylinder and neither pressure nor temperature is asserted constant over each stroke.

## Release and regression boundaries

- Public **unscored** lesson `portal/unit-08-topic85-heat-engine-v229.html`, source range 140–141, with independently written explanatory flow, a simple cycle net-work calculator, and accessible four-stroke stage explorer. Four on-demand conceptual self-checks; **zero scored MCQs** or saved results.
- Catalogue `Unit 8.status=planned`, `assessmentStatus=not-published`, `questionBankCount=0`, `resourceIds=[]`, `simulationCount=4`; the five topic previews remain explicitly marked **public-unscored-study-teacher-review**. Unit 7 academic hold remains, source PDFs/figures not published.
- Preserve **2,250** original Unit 1–6 provisional bank question IDs/options/keys and **59** original resource records. Do not change Firebase/Auth, teacher privilege mapping, class/roster, student submission state, login, branding, or score persistence.
- Only fixed public navigation routes added: Unit 8 Next Units sidebar, Exam Quick Access and previous Topic 8.4 onward link. No scored Unit 8 Test Builder link.
- V229 browser QA: 1280px sidebar, 390px Quick Access, 320px direct route; calculate positive net work, change values, invalid inputs; select all four strokes, verify aria-pressed and displayed explanations; test overflow/no page errors.
- Re-run V228/V227/V226 compatibility tests with **only** planned-count and exact-public-preview extensions, preserving original science/regression checks. Also preserve V225, V224, V209, V140 and pinned bank regression.
- **Teacher science and cognitive review: PENDING. Owner approval to publish scored questions: HOLD.** CI green and PR merged do not count as independent teacher approval.

**Next narrowly scoped milestone:** V230, separately source-review Topic 8.6 reversible and irreversible processes, printed pp.141–142; leave original entire-Unit 8 exercises and scored bank on hold.
