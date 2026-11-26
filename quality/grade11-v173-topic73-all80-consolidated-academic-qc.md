# V173 — Grade XI Unit 7.3: consolidated original 80-MCQ academic quality, duplicate, standalone and FBISE blueprint review

**Decision: 80/80 original first-pass source/answer checks completed, but NOT teacher-approved or ready for scored Test Builder release.** This is an **amendments-only, keyless, whole-bank report** synthesizing V169–V172 and comparing the actual privately uploaded source bank across all 80 items. It does **not** replace or edit the owner's original solved Word document.

## 1. Evidence inspected and what is — and is not — established

- **Owner's original private Word source:** `Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx`; SHA-256 `f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279`. It contains a numbered **80-row boxed MCQ table** and a matching **80-row answer/explanation/SLO/level table**, with a single study-wide direction that calculations assume *ideal linear elasticity unless otherwise stated*. Both original tables were examined privately using python-docx, including the answer-letter/selected-option-text match and original explanation for every item.
- **Original NBF Grade XI Physics textbook:** SHA-256 `00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe`; printed **pp. 122–124** (Topic 7.3), with **p.121** checked to distinguish the elastic/plastic interpretation. Printed p.122 Figure 7.13 experiment and Figure 7.14 reversed graph axes; p.123 linear Hooke-law energy derivation and Example 7.3; p.124 example computation, Assignment 7.3 and summary have been visually inspected. All new claims below about diagrams/page slips are grounded in those images.
- **Official FBISE HSSC-I assessment framework** already provided and checked: **P-11-B-25 — Summative/Understanding** (metal wire Young's-modulus experiment), **P-11-B-27 — Summative/Application** (work by force–extension graph area), **P-11-B-28 — Summative/Application** (stored elastic potential energy). **P-11-B-24** names stress/strain/Young modulus and **P-11-B-26** names elastic/plastic deformation/elastic limit; these are relevant **cross-SLO remapping candidates**, not added claims about new Topic7.3 source questions.
- **Verified first-pass facts:** all **80 of 80 original keyed letters** match the original separately stated selected-option texts. The source-review math/science checks across the four batches detected **zero incorrect keyed choices**; several items require better standalone physical assumptions or SLO placement, but their intended answers are valid **under the full original study-book instructions**.
- Exactly **80 distinct original question stems**; **no exact repeated stem** and **no duplicate option text within any individual four-choice item**. The original author intentionally balanced correct letters **A20/B20/C20/D20**. This *does not* establish good distractors, cognitive balance, or readiness for an FBISE summative test.
- **Source provenance:** full-original-keyed-row SHA-256 fingerprints reverified using the exact common V169–V172 private-source canonical JSON recipe. All 80 distinct fingerprints agree with the four prior public **keyless** ledgers; ordered digest-list SHA-256 `9bb8d9e43e2b20d14c1f58607f834d03f48b3bb03e4c871c021386c261649749`. **No original question text, option, answer letter, numerical keyed answer, explanation or textbook figure is uploaded to GitHub.** Public CI can check these metadata claims and academic HOLDs, but cannot independently read the private keyed Word.

## 2. Full original cognitive and SLO census

| Original mapped outcome | Official SLO demand | Authored K | Authored U | Authored A | **Total** | Prior direct-topic candidates | Prior supporting/cross-SLO |
|---|---|---:|---:|---:|---:|---:|---:|
| **P-11-B-25** — describe measuring metallic-wire Young's modulus | **Understanding** | 3 | 10 | 10 | **23** | 10 | 13 |
| **P-11-B-27** — work via area on force–extension graph | **Application** | 2 | 12 | 8 | **22** | 18 | 4 |
| **P-11-B-28** — elastic potential energy | **Application** | 6 | 7 | 22 | **35** | 31 | 4 |
| **TOTAL** | *Original author labels, not a certified exam blueprint* | **11** | **29** | **40** | **80** | **59** | **21** |

Original item labels correspond to **13.75% K, 36.25% U, 50% A**. These describe the source author’s tags, not independent teacher-recognized cognitive levels. In particular, **B-27 has only 8/22 originally labelled Application**, despite its official Application designation; some of the remaining items cover axes, slopes or stiffness instead of actual work/area. Under the previous conservative first-pass ledger, **27 of the 40 A-tagged items are still called 'direct-topic candidates'**, but many are conditional on stronger stimuli, actual application demand and a final SLO review.

**Scope qualification:** The existing **59 direct / 21 supporting** split is an *internal prior-batch topic-placement ledger*, **not** final FBISE-eligible scoring counts. On reading all 80 questions together, **Q7/Q14/Q26 also warrant stricter scrutiny**: they teach graph axes, stiffness or proportionality rather than demonstrating direct B-27 calculation of work/area. Moving these three to supporting would make a **proposed provisional** 56/24 split, **only if the teacher adopts this tighter interpretation**. We have not silently rewritten the original SLO mapping, approval status or the earlier ledgers.

### Questions where original A-tags may not represent actual Application depth

**Q6** is formula recognition; **Q19** is circle-area formula recognition; **Q70** reads a directly given graph slope as stiffness; and **Q80** chooses the appropriate axis replot. These questions' physical answers are correct, but their actual thinking may be **Knowledge or Understanding** rather than independently applied physics. **Q72**, by contrast, genuinely converts a mass-versus-extension gradient into a stiffness; it may be a defensible applied data-handling item even though its author assigned **B-25 (official Understanding)**. Teacher review must judge the **actual final version** and not automatically promote/demote all items with the same parent SLO.

## 3. Compulsory blockers before standalone scored use — distinct from incorrect keys

### A. One independently missing visual stimulus

**Q3** cites **Figure 7.13** but does not show the metallic-wire / reference-wire / vernier-scale apparatus or describe what it contains. That is fine for **textbook-open revision**, but an independent mobile or projector Test Builder question would depend on an unavailable image.

**Required:** attach an original or permission-cleared academically faithful apparatus figure with alt text and legible labels, or produce a separate source-bound, self-contained experimental description. **Do not directly publish the copyrighted textbook illustration**. The other direct source citations, **Q59 (NBF Example7.3)** and **Q60 (Assignment7.3)**, *already include their necessary numerical inputs*: they are **not** incorrectly counted as missing-data items.

### B. Eight individual items need the original study-wide ideal-linear assumption in scored delivery

**Q12, Q24, Q35, Q42, Q45, Q46, Q49 and Q78** all rely on some form of a linear force–extension relation, `F=kx`, a zero-to-final load, or `U=½Fx`. The original Word **already tells the student globally** to use ideal linear elasticity unless otherwise stated. Therefore the source answer is valid **in its original study-book context**. However an individually randomized Test Builder question may omit that instructional context, and *elastic/recoverable* does not logically imply *linearly elastic*.

For Q35 specifically, the same final force and extension **do not fix work if the loading curves differ**: `W=∫F(x)dx`. A straight-line zero-to-final curve gives `½Fx`; a different reversible nonlinear curve can give another result with the same endpoints.

**Required:** any source-preserving scored candidate states **both** Hooke-law/straight-line behavior and the load starting at zero where needed, or the platform visibly includes a teacher-approved shared-stimulus/instructions panel on all affected items.

**Q31** is an additional proportional-range condition: an area-reduced wire at equal load must still remain within the comparable linear elastic range for the simple inverse-area extension relation. Smaller area otherwise increases stress and could cause departure from proportional behavior.

### C. Named SLO must match the assessed relationship

- **Q64** (permanent plastic deformation) belongs most directly to **P-11-B-26** / NBF **p.121**, rather than the source's B-28 stored elastic-energy outcome/p.123. Correct keyed science; compulsory scored SLO/page decision.
- **Q73**, and **Q31/Q32/Q33/Q54/Q61/Q62**, primarily apply relationships among stress, strain, geometry, wire extension and Young's modulus. **P-11-B-24** may be a better direct summative match than **B-25**, which explicitly concerns describing the wire experiment. Teacher review needed without editing originals.
- **Q47/Q65/Q70/Q71** test stiffness, slope or departure from proportionality. Their physical results are correct, but those facts alone are **not a calculation of work as area** (named B-27 Application). Q7/Q14/Q26 similarly merit graph-prerequisite classification review.
- **Q56/Q79** use **elastic energy density, J/m³**, not total stored elastic energy in joules. Both scientifically sound in the linear regime, and the source author explicitly labelled them supplementary. Their independent use under **B-28** is a teacher blueprint decision, not automatic eligibility.
- **Q58** calculates a nonzero-start **trapezoid area**, and the owner source itself calls it supplementary to the elementary triangular case. It is potentially excellent higher-order application, but its inclusion should be deliberate, not quietly counted as a required textbook derivation.

## 4. Distinguish textbook/source imperfections from wrong answers

**NBF printed p.122, Fig.7.14**: the textbook places **weight/force on the horizontal axis** and **extension on the vertical axis**, yet says "area under graph" represents work. **For a general curve**, the work `W=∫F dx` requires force integrated *against extension*; the usual "area under the graph" convention takes **force vertically** and **extension horizontally**. The two triangle areas can coincidentally agree for the strictly linear model through zero; that does not justify using the printed orientation for an arbitrary curve. Source **Q38 and Q80 are correct** to warn against that generalization; don't mark their correct letters wrong.

**NBF Example7.3 pp.123–124**: the printed source accidentally labels a **0.004 m diameter with a radius symbol** in the Given line, while the worked area substitution **correctly uses half that diameter** for radius on p.124. Do not propagate that labelling slip in an approved explanatory diagram or numerical worked solution.

**NBF printed p.124 summary**: the claim that the *area under a stress–strain curve* is strain energy needs dimensional precision. Integrating `σdε` yields **energy density** (J/m³); integrating force over extension yields **total work/energy** (J). Preserve this distinction when using Q56/Q79 or creating a graph-work scenario.

**Q19/Q55**: the cross-section circle formula is correct; **the source's detailed worked substitution is p.124**, not merely p.123. Correct the page citation only in a separate reviewed teacher edition. **Q67/Q68** are useful general measurement quality tips (averaging/parallax), not verbatim apparatus steps listed on p.122.

## 5. Fourteen topic-wide near-duplicate/overlap groups — not automatic deletions

No original MCQ stem is an exact duplicate. **Semantic and numerical-method overlap matters for randomized paper diversity.** Keep the original source items for practice, but use teacher-controlled duplicate families and distinct cognitive outcomes for scored sampling.

| Group | Overlap strength | Editorial decision before scored selection |
|---|---|---|
| **Q5 / Q18** | **High** | Same hanging-load force relation; use one per short paper unless distinguishing a new reason |
| **Q14 / Q34 / Q70 / Q71** | **High** | Force-extension slope/stiffness repeated; don't count these as four separate area/work Applications |
| **Q21 / Q28 / Q36** | **High** | Repeated triangle/mean-force conceptual explanation |
| **Q51 / Q52 / Q53** | **High** | Same `YAx²/(2L)` numerical workflow with changed data; sample one/two distinct numerical misconceptions |
| **Q42 / Q49 / Q78** | **High** | Repeated `½Fx` numerical operation with missing local linearity condition |
| **Q38 / Q80** | **High** | Both correct reversed-axis graph interpretation; retain stronger distinct stimulus/problem |
| **Q1 / Q13** | **Medium** | Energy terminology and synonym: good vocabulary practice but narrow assessment breadth |
| **Q4 / Q30 / Q69** | **Medium** | Unloaded gauge-length measurement and strain rationale |
| **Q22 / Q23 / Q50 / Q63** | **Medium** | Quadratic energy scaling; **Q63 genuinely asks incremental rather than total energy**, so not an identical question |
| **Q19 / Q55** | **Medium** | Symbolic versus numerical circular-wire area; supporting geometry rather than duplicate full experiments |
| **Q29 / Q67** | **Medium** | Repeated readings and averaging for experimental reliability |
| **Q31 / Q62** | **Medium** | Inverse area-extension relationship within proportional range |
| **Q32 / Q61** | **Medium** | Wire length and proportional extension |
| **Q56 / Q79** | **Medium** | Source-labelled supplementary energy-density facts: numerical density versus scaling |

**No automated deletion or change of an answer key is authorized** by lexical similarity alone. The high pairwise stem similarity between Q51 and Q53 merely confirms a similar calculation, whereas Q22/Q23/Q63 may deliberately teach a valuable total-versus-incremental distinction. Teacher review should record *include together / rotate separately / keep supplementary / rewrite candidate*.

## 6. Distractor quality, cognitive spread, stimuli and accessibility

- **Verified good structure:** 80 distinct stems, four different option texts per question, every keyed letter matches its selected option, and no incorrect keyed answer was detected in the first pass.
- **Quality concerns:** options in **Q3, Q5/Q18, Q19, Q47, Q55, Q67/Q68 and Q70** include unrelated concepts or visibly incompatible units. Although these are effective for an initial learner practice sheet, they may be too easy to eliminate in a summative application task. Draft stronger, *plausible* misconception-based distractors **only in separate teacher-reviewed candidate questions**, checking that exactly one choice remains correct. Do not edit or publish the private original Word by default.
- **Cognitive balance:** all 40 author-tagged A are not proven Application. Several are direct substitution or recognition. B-27's area/work Application outcome needs more actually applied graph/scenario evidence than slope-only recall. Add diverse original/permission-cleared figures and short novel scenarios for teacher-reviewed candidate editions where source questions are weak.
- **Math and source display:** preserve Unicode/LaTeX rendering for multiplication, squared dimensions, micro/milli unit conversions, superscripts and Greek symbols. Verify legibility in mobile, projector, downloaded print/PDF and any accessible alternative text. No artificial character substitutions or broken vector/math glyphs in a future portal edition.
- **Randomization:** register near-duplicate families so a student's next test does not merely substitute a different set of numbers into the same formula repeatedly. Any eventual algorithm must respect only the student's enrolled class and consented authenticated data; **this PR does not alter test history, class access, logins or backend security**.

## 7. Teacher decisions, provenance and next milestone

**Prior-review flags:** **23 compulsory** pre-scoring source/clarity/scope decisions and **18 optional** improvements across V169–V172. These are **41 original first-pass review flags, not 41 wrong answers**. V173 adds six cross-bank teacher-review *workstreams* (standalone figure, linearity, proportional range, graph prerequisite, cognition and source precision); they do **not** mean six additional answer-key errors.

**Recommended separate teacher decision outputs** for each item: original source SHA; original number, official SLO, source authored K/U/A and teacher-evaluated demand; source-valid/conditional status; self-contained stimulus readiness; duplicate family; retain original as practice, keep supplementary, create a source-linked revised candidate, or exclude from summative sampling; teacher-reviewed option/answer/explanation verification; documented science and cognitive signoffs. A corrected edition must have a **new candidate fingerprint** and not silently overwrite the original 80 rows.

**Today:** zero individual Topic7.3 science/cognitive signoffs; Topic7.1 and Topic7.2 teacher signoffs still pending; **zero Unit7 scored Test Builder items**; original Grade XI existing provisional 2,250 item identities and Unit6 560 pending decisions intact; Firebase teacher production/staging remains **NO-GO**.

**Next V174:** start a *small source-bound batch of the original NBF Grade XI Unit7 end-of-unit exercises* while recording Topic7.3 corrected-candidate/teacher-decision work for a separately approved milestone. Continue academic coverage without representing a merge or QA script as authority to publish scored questions.

## 8. Exactly four keyless, nondeployment V173 files

1. `quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json` — **80 complete-private-row SHA-256 fingerprints** with only original number, author level, source SLO, prior review flags and teacher PENDING/score HOLD, the exact source census, 14 near-duplicate families and six cross-bank issues.
2. `quality/grade11-v173-topic73-all80-consolidated-academic-qc.md` — this owner-readable, complete, amendments-only full-bank scientific/SLO/stimulus audit.
3. `scripts/audit_grade11_unit7_topic73_bank_v173.cjs` — deterministic source-hash/cognitive/overlap/test-readiness audit with fail-closed mutation tests; validates all earlier keyless ledgers and Unit6/7 release restrictions.
4. `.github/workflows/validate-grade11-v173-topic73-full-bank-qc.yml` — V173 and original V169–V172, V168 Topic7.2, V154 Topic7.1, 2250 item ID and 560 pending, App Check reporting lock and production/staging NO-GO.

**CI limitation:** The owner's privately keyed original Word and original NBF book are not in GitHub. A green CI is **evidence of a consistent keyless review manifest and unchanged student scoring locks**, **not independent proof of the private answer-key science or final teacher signoff**. No private stems, keyed options/answers/explanations, book scans, student records, Firebase secrets, new scored question bank or backend deployments are introduced.

**Owner review/merge:** Only after *both checks on the latest PR head are green*, inspect four files → Ready for review → Merge pull request → Confirm merge. No Firebase Console changes, domain, billing, or original Word edits required.
