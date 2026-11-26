# V174 — NBF Grade XI Physics of Solids, Unit 7 end-of-unit original 10 MCQs: first-pass source, science, official FBISE SLO and scored-readiness audit

**Decision: ORIGINAL 10 TEXTBOOK MCQs ACCOUNTED FOR; ZERO SCORED ITEMS APPROVED. Three MCQs require a physically unambiguous standalone stem; other valid questions need teacher SLO scope decisions.**

This is the **NBF textbook exercise itself**, not another owner-written 80-item Topic7.x solved Word bank. The scanned original contains **ten** numbered MCQs on printed **p.125**, followed by short-response questions continuing on p.126. We verified the page by **visual inspection**, not automated OCR. The original exercise page **does not provide a publisher's keyed answer table**, so all selected-response results were checked from first principles rather than falsely described as matching an official publisher key. **No textbook scans, stems, options, keyed answer letters, or full worked solution values are uploaded to this public GitHub PR.**

## Sources and reproducible keyed-free provenance

- **Primary textbook:** original NBF Grade XI Physics scanned PDF `11 Physics Book(6).pdf`; SHA-256 `00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe`. MCQs appear on **printed p.125 / PDF page index 124 (0-based)**, with ten original questions and four original alternatives each. Reviewed exact equations and symbols from the page image.
- **Evidence method:** PyMuPDF rendering of original page at **2.3×** to a 1370 × 1725-pixel RGB page, then ten visually checked rectangular source-page crops; record **SHA-256 of raw RGB bytes for each cropped region**, along with crop boxes and original book PDF SHA. These pixels and the source page remain **private**. A crop can contain a small amount of adjacent line context; these image digests are **source-region provenance**, **not** claims to be a SHA of original text or of an unavailable publisher answer key. GitHub CI cannot recompute them without the original book. They guard consistency of the exact ten review records and preserve their source identity.
- **Official FBISE Grade XI Physics Assessment Framework (Curriculum 2022–23, Scheme 2024)**: PDF framework p.10 (internal p.4/21): **P-11-B-22 Summative/Understanding** — distinguish crystalline, glassy, amorphous and polymeric solids; **P-11-B-24 Summative/Application** — stress, strain, Young modulus; **P-11-B-27 Summative/Application** — work as force–extension area; PDF framework p.11 (internal p.5/21): **P-11-B-28 Summative/Application** — elastic potential energy within proportional limit.
- **Independent crystallography cross-check:** silicon is a diamond-cubic **covalent network** crystal whose periodicity is described by an **FCC Bravais lattice with two-atom basis**. See university notes [Pisa — Crystals and Periodicity](https://cmp.df.unipi.it/roddaro/SSPnotes/ch01-bravais.html) and [TU Graz — Silicon](https://lampz.tugraz.at/~hadley/memm/materials/silicon/silicon.php). This is why original Q3's combination of lattice-structure and bonding-structure descriptors is not a safe uniquely keyed standalone MCQ as written.
- **Material realism cross-check:** [US NHTSA tire engineering report](https://www.nhtsa.gov/sites/nhtsa.dot.gov/files/pneumatictire_hs-810-561.pdf) describes rubber bulk compression modulus around 2 GPa for typical examples. The original p.125 Q8 numbers imply a **much higher order of magnitude**, though the **calculation is algebraically correct from the printed data**. Treat the material example as contrived, not as an incorrect cgs conversion.

## What was established in the original ten-question check

| Item | First-pass physics finding |
|---|---|
| Number of original textbook MCQs | **10**, all visually confirmed from printed p.125 |
| Original publisher answer key on supplied exercise page | **None** — do not claim ten publisher answers were cross-checked |
| Defensible unique physics selection under intended standard context | **7** items: Q1, Q2, Q4, Q6, Q7, Q8 and Q9 |
| Questions potentially **ambiguous as written** without qualifications | **Q3, Q5 and Q10** — **compulsory** before standalone scored use |
| Independent numerical mechanics/units checks | **Q4, Q6 and Q8**, all internally consistent with the stated simplified models |
| Official outcome categories proposed, **not teacher-approved** | B-22: 3; B-24: 4; B-27: 1; B-28: 2 |
| Candidate item demand from actual tasks | **K1 / U6 / A3** |
| Strict proposed direct outcome candidates | **5** (Q1/Q2/Q4/Q5/Q6), **Q5 conditional** |
| Supporting, enrichment or cross-SLO candidates | **5** (Q3/Q7/Q8/Q9/Q10) |
| Compulsory teacher/wording decisions | **5** (Q3, Q5, Q7, Q8, Q10) |
| Optional teacher placement clarification | **1** (Q9) |
| Teacher science/cognitive approvals and Unit7 scored releases | **0** |

The seven preliminary unambiguous selections can be scientifically assessed, **but two of these seven (Q7/Q8) are supplementary to the exact named outcomes**. This census is *not* a blanket statement that the Federal Board will never examine bulk modulus or bending: it is a conservative official-SLO-to-question distinction requiring teacher judgement.

## Only original questions requiring amendments or teacher decisions

| Original Q | Priority | Exact reason | Keep original or add a reviewed replacement? |
|---:|---|---|---|
| **3** | **Compulsory — uniquely worded classification** | Silicon is both a **covalent network crystal** and a **diamond-cubic structure based on an FCC Bravais lattice with basis**. The printed alternatives mix these different classifications and may produce two defensible readings. A single-choice scored question must specify *bonding/network classification* versus *Bravais lattice / full diamond-cubic motif*. | **Retain original** in the textbook discussion/critique bank; create a separate, precisely classified new scored stem and four choices, then independently re-QC one unique correct choice. |
| **5** | **Compulsory — engineering versus instantaneous/true stress ambiguity** | Doubling length is **100% extension**. The question uses *instantaneous stress* but gives an area with no clear statement whether it is the **original (engineering)** or **current (true)** cross-section. During deformation the current area may differ; stretching a generic wire to twice length also needs a justified material range. The elementary stress law itself is correct when its area definition is fixed. | **Keep original** unchanged. For scored use explicitly define the force, whether the given area is *original or instantaneous*, and a physically appropriate deformation model. If needed, replace doubling length with modest proportional elastic strain rather than imply all wire materials can double elastically. |
| **7** | **Compulsory — summative SLO placement, not a wrong answer** | Correctly connects cantilever strain energy with **bending**, but an isolated beam-deformation fact is **not** the explicit B-28 Application task of *determining elastic potential energy* from the force–extension relationship. | **Retain original** as supplementary NBF exercise/beam-enrichment study; either document supporting placement or add an actual applied energy/work calculation for scored B-28 evidence. |
| **8** | **Compulsory — bulk-modulus scope, plus realism note** | The cgs bulk-modulus conversion and percentage reduction computation are correct, but **bulk modulus** is not independently named in the official B-24 outcome about **Young's modulus**. The implied physical bulk modulus is unusually high for rubber, making the story contrived. | **Retain original** for broad physics practice and pressure/volume conversion. Do not automatically count it as direct B-24 summative evidence; if revising independently, choose a plausible bulk-compression material and verify all units/options. |
| **10** | **Compulsory — no graph/region, scientifically ambiguous** | Gradient of a force–extension graph equals a **constant stiffness only within a straight-line proportional region**. In nonlinear loading it can change; the original question shows **no specific graph or indicated interval**. Moreover a slope question alone does not meet B-27's named **area/work** outcome. | **Keep original** for illustrating the contrast. For scored use explicitly give a straight-line graph/range or an original accessible curved graph and ask about its changing slope, with one scientifically unique correct choice; place it appropriately under the framework. |
| **9** | **Optional — vocabulary versus actual energy determination** | Naming a material's recoverable elastic energy-storage property is sound **Knowledge**. But the official B-28 outcome assesses **Application of energy/force–extension relations**, not merely the name. | **Preserve original** for vocabulary revision, or create a new applied source-linked MCQ with authentic energy data for strict B-28 evidence. |

**Q1, Q2, Q4 and Q6:** no compulsory source-physics or wording amendments found on first pass. Q1/Q2 reinforce B-22 structure classification; Q4 correctly includes the weight of the **portion of uniform wire below** the specified cross-section in the tensile force; Q6's circular cross-sectional area, modulus and percentage strain are internally consistent. These statements are **not final teacher academic approval**.

### Important distinction on textbook Q5 and Q10

We should **not claim that the textbook has a definitively wrong published answer letter**: there is **no publisher answer key on this source page**, and the elementary intended response is consistent under specific assumptions. Our finding is stronger and more useful for high-stakes assessment: **the stem does not independently determine the physical answer under all defensible interpretations**. We must resolve that before choosing or changing an answer choice in a scored edition.

Likewise, **Q3 is not simply a spelling error**. Silicon's covalent network arrangement and its FCC Bravais-lattice framework describe different structural aspects of the same solid. The original correct *intention* can be taught while preventing a student from being penalized for a scientifically defensible alternative.

## Why this review does not release students' questions

The earlier owner-created Topic7.1, Topic7.2 and Topic7.3 **80-question banks each** have completed source first-pass academic review. The final teacher science and cognitive-level signoffs are still **PENDING**; the portal's original Unit7 status stays planned, **zero scored student questions**. Existing Grade XI Units1–6 provisional manifest **2250 source items** and Unit6 560 teacher-pending decisions remain unchanged. Production and staging teacher backend deployment is still **NO-GO**. An academically useful textbook item is not yet an authenticated scored-item candidate.

The owner should eventually maintain a **source-linked candidate revision record**, not overwrite the book or publish book scans: original NBF PDF SHA, source printed page/item number, private source crop fingerprint, corrected candidate item SHA, proposed official SLO/actual cognitive level, one independently checked correct answer, distractor plausibility, teacher science signoff and teacher scoring approval. Never store original or revised keyed answer payload in public GitHub.

## Exactly four V174 nondeploy files and a strict evidence boundary

1. `quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json` — ten scan-region RGB image hashes and crop boxes with source position, proposed SLO/item demand, five compulsory and one optional decisions, teacher PENDING / score HOLD. **No actual MCQ or answer text**.
2. `quality/grade11-v174-unit07-textbook-exercise-mcq01-10-science-slo-qc.md` — this amendments-only scientific, numerical and official-SLO audit.
3. `scripts/audit_grade11_unit07_exercise_mcq_v174.cjs` — deterministic source provenance/ten-row completeness/scope/hold checks, prior Topic7.1–7.3 and 2250 existing bank guardrails, plus adversarial release-denial tests.
4. `.github/workflows/validate-grade11-v174-unit07-exercise-mcq-qc.yml` — V174 and V173/V168/V154/Unit6/App Check/backend NO-GO regressions.

**Evidence limitation:** The textbook original is scanned and **its raw pixels are not in public GitHub**; Actions can validate the reported image hashes and consistent academic review status but **cannot independently rerender the source scan**, reproduce private keyed answer calculations, or grant teacher approval. Passing GitHub checks means *review-ledger consistency and preserved scoring restrictions*, not universal correctness or automatic FBISE eligibility.

**Next V175:** original **11 NBF end-of-unit short questions 7.1–7.11**, printed pp125–126, source-bound with independent science/SLO appraisal. Then proceed to comprehensive questions and numerical problems in small batches. No Firebase, student accounts, domain, billing, keys, scored content or source Word/PDF files are altered.

**Owner:** merge only after both required current PR checks are green and the four changed files are inspected: **Ready for review → Merge pull request → Confirm merge**.
