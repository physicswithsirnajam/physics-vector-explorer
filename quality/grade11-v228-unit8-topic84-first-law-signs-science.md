# V228 — Unit 8 Topic 8.4, First Law of Thermodynamics — source/physics/release QA

## Original source and curriculum

Owner's original **NBF Grade XI Physics** source PDF visually reviewed at **printed pages 135–140**. Textbook section **8.4** has four labeled subtopics: 8.4.1 isothermal pp.136–137, 8.4.2 adiabatic pp.137–138, 8.4.3 isochoric p.138, 8.4.4 isobaric pp.138–140. Original textbook examples: **Example 8.3** begins p.139 and continues p.140; **Assignment 8.3** is on p.140. The next section **8.5 Heat Engine** also begins on p.140, but is deliberately excluded from this lesson. No printed figures 8.10–8.13, printed text, answer-marking keys, or source scans are put in the repository.

The existing, source-verified **V224 official FBISE Grade XI framework** preserves printed theory outcomes **P-11-C-08 (Summative; Knowledge, Understanding and Application)** and **P-11-C-11 (Summative; Application)**, plus their original code spelling. No renumbering, interpretation as teacher approval, or SLO extension.

## First-law sign convention

The printed source uses **Q = ΔU + W**, with **W representing work done by the system**, so equivalently **ΔU = Q − W_by = Q + W_on**. Q is positive for heat input; negative for heat released. W_by is positive when a gas expands against a positive external pressure, negative when surroundings compress or do work on the system. ΔU=U_final−U_initial.

| Process | Constraint | Source convention | Educational qualification |
| --- | --- | --- | --- |
| Isothermal | Constant temperature T | For a fixed ideal gas, ΔU=0, so Q=W_by | Only an ideal gas has ΔU dependent solely on T. Do not claim this for arbitrary substances. |
| Adiabatic | Q=0 | ΔU=−W_by | Ideal gas cools on expansion doing work and warms on compression, assuming no other work/energy modes. |
| Isochoric | Constant volume ΔV=0 | p–V work W_by=0; ΔU=Q | No extra non-p–V work is assumed; rigid-wall boundary. |
| Isobaric | Constant external p | W_by=p(V_final−V_initial); Q=ΔU+pΔV | p positive, V in m³, work in J; 1 kPa×1 L=1 J. |

**Original Example 8.3 independent adaptation:** internal energy of gas decreases by **200 J**, gas performs **+50 J** work. Thus ΔU=−200 J, W_by=+50 J and Q=ΔU+W_by=**−150 J**; **150 J heat leaves**. It is incorrect to call Q positive under these given signs.

**Original Assignment 8.3 independent adaptation:** a cup of tea starts with U_i=**200 kJ**, loses **150 kJ** as heat (Q=−150 kJ), and a spoon performs **25 kJ** work **on** tea (W_on=+25 kJ; W_by=−25 kJ). Then ΔU=Q−W_by=−150−(−25)=**−125 kJ**, and U_f=200−125=**75 kJ**. A mistaken +25 kJ W_by would give an incorrect final answer; test both conventions explicitly.

**Independent original isobaric scenario:** p=200 kPa, V_i=2 L, V_f=5 L, Q=+1000 J. W_by=+600 J; ΔU=+400 J. Reverse V_i/V_f: W_by=−600 J and ΔU=+1600 J for the same supplied Q. At constant volume W_by=0 and ΔU=Q. Do not present these as numbered textbook example/assignment problems.

## Student, release and compatibility boundaries

- New path: `portal/unit-08-topic84-first-law-v228.html`, full branded public **unscored** topic preview. Independently worked original-data Example 8.3/Assignment 8.3, sign table and four processes, plus in-browser energy ledger and isobaric calculator. An optional initial-U field is only used when supplied; a blank one must not fabricate U_final. A preset selects J vs kJ but all entered data use one displayed unit at a time. No scores, user identity or saved results.
- Explicit discovery routes only: fixed new `additionalLearningPreviews[2]` for **8.4** in planned Unit8 catalogue, unit-aware Next Units sidebar, Exam Quick Access, and corrected follow-on link in Topic8.3. No student-facing scored Unit8 Test Builder route.
- Preserve `Unit8.status=planned`, `questionBankCount=0`, `assessmentStatus=not-published`, `resourceIds=[]`, **4** Unit8 simulations; preserve **59** catalog resources and pinned Units1–6 **2,250** MCQs/answers/keys. Leave Unit7 scored release on hold. Do not alter authentication, Firebase, roster, teacher controls, branding or grade persistence.
- Independent human science/cognitive review remains **PENDING**; source exercise answer edition **HOLD**; owner scored-question release **HOLD**. CI or GitHub merge does not imply teacher sign-off.
- Automated release suite must test V228 independent first-law signs, source inventory, browser calculator presets/guardrails, and 1280/390/320 px route/overflow checks. Rerun V227 and V226 with navigation-only compatibility amendments, plus original V225, V224, V209, V140 and pinned bank tests.

**Next small scoped topic:** V229, original textbook **8.5 Heat Engine** starts printed p.140 (continue to relevant later source pages separately). No premature 8.5 or full Unit8 release here.
