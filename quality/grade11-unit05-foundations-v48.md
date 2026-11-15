# Grade XI Physics — Unit 5 Source-Grounded Foundations (V48)

**Physics with Sir Najam · Work and Energy · PR #38 · Learning release, NOT assessment release**

## Original sources inspected

- **Primary:** User-provided scanned *NBF Grade XI Physics*, **Unit 5 Work and Energy**, printed **pp.77–87**. Visual inspection of the original PDF included printed pp.77–85:
  - p.77, chapter heading, Unit 5 SLO list.
  - pp.78–80, definition and signs of work, work from linear/variable-force F–d graphs, NBF Example 5.1.
  - p.81, conservation versus non-conservation of field work, route independence and closed-path test; start of kinetic energy.
  - p.82, kinetic-energy derivation and work–energy theorem.
  - p.83, resistive-medium theorem and efficiency relations.
  - pp.84–85, worked Example 5.2 and start of the textbook exercises.
- **Secondary:** Prior user-created `Grade11_Physics_Unit5_Student_Notes_and_Practice.pdf` (source map to textbook pp.77–87 and provisional SLO/cognitive classification). Four candidate **summative theory** SLOs: `P-11-B-29` kinetic-energy derivation; `P-11-B-30` force–displacement graph work; `P-11-B-31` conservative/non-conservative forces; `P-11-B-32` resistive-medium work–energy theorem. The secondary guide labels the first, second and fourth **Application**, the third **Understanding**.
- **Unresolved:** Independent cross-check against the **primary official FBISE assessment framework source page** remains pending; the textbook gives learning outcomes, but does not itself assign official assessment/cognitive categories. Treat these labels as *provisional* in the portal.

## Implemented in V48

1. `portal/unit-05.html`: new Unit 5 Learning Desk (primary scope, four provisional SLOs, 2 learning links and JSON audit).
2. `portal/unit-05-work-study.html`: original study text with definitions/assumptions, signed work, signed area of force-displacement graphs, basic NBF Example 5.1 numbers, conservative-field comparisons, a seven-step kinetic-energy derivation and a resistive work–energy worked example.
3. `portal/unit-05-work-energy-lab.html` / `.js`: four keyboard-accessible interactive stations for classroom projection or home/mobile study:
   - **B-30:** Work W=Fd cosθ, linear `F_parallel–d` graph, signed trapezoid area, positive/negative sections and zero-axis crossing.
   - **B-29:** K = 1/2 mv² and ΔK from motion equation `v²−u²=2ad`, with changing mass, initial/final speed and correct zero-speed handling.
   - **B-31:** Gravitational path independence `mg(h0−h1)` between shared endpoints and distinct work `−F_res L` for an idealised constant resistance over 10m vs 18m routes.
   - **B-32:** `K_target=K_initial+(F_applied−F_res)d`; if negative target K, report the physical **stopping distance** instead of outputting imaginary speed. A body at rest with nonpositive net forward force **cannot start moving**, even if a naive calculation returns zero final K.
4. `portal/unit-05-slo-audit.json`: structured source map, visually inspected pages, official-framework cross-check status, **zero published Unit 5 assessment questions**, and explicit not-published/ungarded flags.
5. `portal/learning-catalog.json`: Unit 5 moves from `planned` to `available` **for teaching resources only**, with 3 public resource IDs; `questionBankCount=0`, `assessmentStatus=not-published`. Unit 4 retains all 18 resources and 80 original questions.

## Academic scope and launch boundary

- No Unit 5 original MCQ bank, FB​ISE exam papers, teacher answer keys, OMR sheets, question randomization or protected exams have been fabricated. There are no student scores or authenticated exam submissions.
- Existing 80-question Unit 4 bank, V45/V46/V47 slide systems, the brand's original logo, and all earlier units remain unchanged.
- Calculations are **idealised models**; the force/displacement graph represents a linearly varying component and its signed integral; the path-comparison model does not imply different gravity work from longer routes; the resistance model is limited to constant forces and rectilinear motion.
- The Unit 5 initial release deliberately focuses on the four textbook outcomes. Do not claim the new portal is ready for an official full-unit summative paper merely because the source and interactive tests pass.

## Automated CI

`.github/workflows/validate-grade11-unit5-foundations-v48.yml` runs on Ubuntu 24.04 / Node 22 / Playwright Chromium and checks:

- [ ] Source audit and catalog: Unit 5 Work and Energy; four preliminary source-grounded summative outcomes; original printed pages; 3 teaching resources; **0 assessment bank entries**; existing Unit 4/Unit 3 unaffected.
- [ ] All 4 interactive station controls and role tabs load. No missing images/pages, browser exceptions, grade writes or local browser storage.
- [ ] Work graph: positive `(0+20)/2 × 6 = +60 J`; negative `−30×6 = −180 J`; zero net work for opposite `30→−30 N` with positive and negative filled regions; `60→20 N` across 10m yields `+400 J`; right-angle work zero; anti-parallel negative.
- [ ] Kinetic energy: 5kg at 2→6m/s yields K₀ 10J, K₁ 90J, ΔK 80J. Doubling mass doubles ΔK; u=0 ratio undefined, not an error; speed decrease gives negative ΔK.
- [ ] Conservative/non-conservative: gravity W=294J independent of route for 5kg across a 6m drop. Constant resistive force 5N gives −50J/−90J for 10m/18m.
- [ ] Resistive: m5kg, u2m/s, Fₐ30N, Fᵣ12N, d4m yields K₀10J, Wₐ12​0J, Wᵣ−48J, ΔK72J, Kf82J and v≈5.73m/s. High resistance correctly reports 0.2m stopping distance and *no valid target final speed*. Zero-start speed with nonpositive drive also blocks impossible travel.
- [ ] Mobile viewport (390px) fits; screenshots uploaded for classroom visual review.
- [ ] Re-run Unit 4 source/catalogue/SLO regression scripts V39–V47.

## Teacher manual sign-off still needed

- [ ] Open Unit 5 from the main Learning Hub; check cards, official logo and navigation.
- [ ] Test every slider, including forces below the d-axis and a force graph crossing zero.
- [ ] Recalculate the examples and numerical rounding from first principles; inspect units and printed textbook references.
- [ ] Project the lab in a classroom; confirm legibility and mobile usage in Chrome/Google Sites.
- [ ] Independently compare the **official FBISE HSSC-I Assessment Framework** classifications and formative / summative / practical outcomes before creating an exam bank.
- [ ] Keep the Unit 5 paper bank at **0** until academic review and source-based MCQ development are complete.

**Natural next PR:** complete the independent official framework cross-audit (if source available), then carefully author/verify topic-specific Unit 5 assessments and detailed solutions without inventing questions outside the primary book/framework.
