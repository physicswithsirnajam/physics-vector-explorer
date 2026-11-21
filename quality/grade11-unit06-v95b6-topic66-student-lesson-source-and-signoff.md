# V95-B6 — Topic 6.6 Bernoulli Applications student lesson: source, arithmetic, and teacher review

**State:** A source-guided public **student lesson preview**, not final original-text verified NBF content nor a released Grade XI Unit6 course. PR #102 (V95-B5) merged and independently verified.

## Exact evidence reopened before authoring

- Owner-private compiled `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` **pp.255–265**: 13 prepared Part C sections; 6 application types (air-jet atomizer, filter pump, Torricelli, Venturi, aerofoil and Magnus), complete Torricelli and Venturi textbook-grounded derivations, 15 solved numeric cases (9.1–9.15) including *prepared original-labelled* Example6.4 / Assignment6.4 and 10 self-checks. Merged V94-C2.6 `quality/grade11-unit06-v94c2-topic66-detailed-qc.md` independently reports **pp.243–254 Part B 56 Q&As** and **pp.266–273 Part D 32**, with 10 amendment IDs.
- Original printed **NBF pp.101–106**, original **Figures6.10–6.15**, and *exact wording* of Example6.4/Assignment6.4 are **not independently cross-checked** here. The only drawn figure in this new lesson is `assets/illustrations/unit6-v95b6-torricelli-venturi-original.svg` — original and separately labelled, NOT a textbook scan.
- Official supplied FBISE Grade XI assessment framework PDF pp.11–12: **P-11-B-40 Summative/Application** (horizontal and vertical fluid flow); **P-11-B-44 Summative/Application** (real-world application analysis); **P-11-B-39 Formative/Application** and not separately final-theory-examination assessed. These are **outcome-level** labels, not official board certification for any individual MCQ.

## Completed preview features

1. `portal/unit-06-topic-66-study-v95b6.html`: **eight** authored teaching sections: model conditions; air-jet versus mechanical sprayer and filter pump; **6-step Torricelli** derivation; **6-step Venturi** derivation; aerofoil and Magnus; **8** worked examples; **3** interactive math tools; **10** accessible question/reveal revision notes.
2. `assets/illustrations/unit6-v95b6-torricelli-venturi-original.svg`: newly authored side-by-side schematic with descriptive alt. No actual NBF figure or source page reproduced.
3. `portal/unit-06-topic-66-study-v95b6.js`: browser-local **Torricelli** ideal speed/outlet Q; **Venturi** v2/delta P/Q with two presets; **wing toy model** formal force with default moderate and the prepared high-speed 450/410 preset. A conspicuous warning appears for inputs at/above **300m/s** as a *student-facing heuristic*, NOT a universal speed-of-sound boundary. No network, account, marks or local storage.
4. Reuse `portal/unit-06-study-v95b1.css` navy/gold responsive/print design. Change only Topic6.6 **Read** link in `portal/unit-06-learning-desk-v95a.html`. All 6 detailed lesson paths, 7×80 original MCQ links and 5 existing original simulations remain intact.

## Independently checked example arithmetic and role

| Web case | Prepared givens | Correct result | Boundaries |
|---|---|---|---|
| 1 Torricelli | H=5m, g=9.8m/s² | **9.90m/s** | Large open tank; ideal instantaneous speed |
| 2 Torricelli | v=7m/s | **H=2.50m** | Vertical head, not sloping length |
| 3 Venturi | A1=12cm², A2=6cm², v1=2m/s, ρ=1000 | **v2=4m/s, ΔP=6000Pa** | Horizontal incompressible no-loss model |
| 4 Venturi open columns | A1/A2=2, H=.30m | **v1=1.40m/s, v2=2.80m/s** | Same-liquid piezometers; not differential two-fluid manometer |
| 5 Original-labelled Example6.4 data | P1=47.1kPa, v1=4m/s, v2=3m/s, h1−h2=+3m, ρ=1000 | **P2=80.0kPa** | Printed original wording not yet independently checked |
| 6 Original-labelled Assignment6.4 data | upper/lower speeds **450/410m/s**, air density 1.29, area 45m² | Formal ΔP=**22,188Pa**, F=**998,460N** | **COMPULSORY: speed near/above typical sound speed invalidates incompressible toy-model result as real-flight prediction** |
| 7 Teacher supplementary wing | upper/lower **80/60m/s**, ρ=1.2, A=20m² | Formal ΔP=**1680Pa**, F=**33,600N** | Still not complete real-aircraft lift |
| 8 Teacher supplementary atomizer | ρliquid=800kg/m³, H=.15m | Minimum ideal head estimate **1176Pa ≈1.18kPa** | Not actual spray/evacuation rate |

The prepared original exercise results and labels are *preserved*, with explicit high-speed caution, **not silently changed**. Eight public teaching cases are only a selection from the prepared private Part C 15 numeric cases; no claim of publishing the entire master.

## Disposition of previous QC register

| ID | Addressed in public V95-B6 preview | Remaining check |
|---|---|---|
| **T66-01** | Air-jet/bulb atomizer distinguished from mechanical liquid pump; suction separate from droplet formation; static head supplementary | Teacher pedagogical review pending |
| **T66-02** | Filter pump is a *partial vacuum* with entrainment, leakage and losses, no invented exact pumping-rate formula | Teacher signoff pending |
| **T66-03** | Large open tank, same external atmosphere, v_surface≈0, vertical H and real efflux limitations explicitly shown | Print source Figure checks pending |
| **T66-04** | Venturi continuity plus Bernoulli, squared area ratio, same-liquid open piezometer only; A2<A1 validation | Original source Fig6.10–6.15 comparisons pending |
| **T66-05** | High-priority toy-model warning on 450/410m/s and **998,460N** beside worked exercise and in interactive preset | **Teacher compulsory final source/model signoff outstanding** |
| **T66-06** | Magnus force described qualitatively, with spin, velocity and flow factors; no invented universal force law | Teacher review pending |
| **T66-07** | B39 formative vs B40/B44 summative clearly separated, outcome-level only | Per-item MCQ certification pending |
| **T66-08** | New original SVG and source-vs-prepared attribution. No NBF exact-art claim | **Printed pp.101–106, Figures6.10–6.15, Example6.4/Assignment6.4 exact wording check outstanding** |
| **T66-09** | SI, ΔP sign, √(2gH), cm² and numerical answers covered by code tests + mobile/print CSS | Manual classroom print/projector acceptance pending |
| **T66-10** | Chimney draft primarily temperature/buoyancy and real wing lift not “equal transit time” | Teacher pedagogical signoff pending |

## Non-release safeguards

- Full `portal/unit-06.html` must remain absent; `portal/learning-catalog.json` Unit6 **planned**, assessments **not-published**.
- Original provisional question data unchanged: **560 Unit6 / 2,250 GradeXI**, **136** independent situations, **0** true shared stimulus groups, **0** original figure holds, **5** mapped simulations, 7 original per-topic MCQ preview routes; `quality/grade11-unit06-v94d-signoff-matrix.json` release and topic teacher signoffs remain false.
- No new protected original scans, private teacher PDFs, MCQ keys, school marks, access controls, Firebase, student account logs or billing changes.
- Teacher can merge only as a **preview after latest-head CI is green and reviewing the high-speed warning and source distinctions**.
- Next V95-B7 **Superfluidity**, followed by Unit6 V95-C assessment integration and V95-D teacher/rights/UX acceptance before full course release and Unit7.
