# V115 — Topic 6.5 Bernoulli Q55 and Q56: stagnation-model teacher decision pack

**Scope:** Proposal only. The original questions and existing live provisional student-practice bank remain unchanged. No text substitution, new student question, source-file edit, SLO/cognitive certification or examination-release toggle is authorized by merging this review PR.

## Verified source boundary

- Source bank: `question-bank/grade-11/unit-06-topic-65-v84-80-source.json`; original **80-question Topic 6.5 source archive** remains at Git blob SHA `f5a7dd0a29d5e90842c0ef557071aebc10a70baf`.
- The prior **V95-C2S numerical audit** matched the prepared teacher-master MCQ stems and A–D options for Q41–60 to compiled pp.188–190 and the original answer key to p.195. For the specific Q55/Q56 items, the original source pages are 189 and 190, with source answer **B/B**; the numerical audit identified both as `COMPULSORY_STAGNATION_CONDITION`.
- Prior original NBF printed pp.99–100 verification supports Bernoulli’s relation; the MCQ source and new teacher-authored clarifications are **not claimed to be verbatim original NBF textbook questions**. No original scan or protected PDF is republished.
- The previous V114 approved clarified practice variants Q61/Q67/Q78 remain in the existing 560-item provisional pool; this proposed V115 work makes **no additional change** to them.

## Complete proposed items (each awaits explicit teacher approval)

### Q55 — Stagnation point versus zero throughflow

**Original source ID:** `XI-U06-T65-MCQ-0055` (prepared PDF p.189)

**Original source stem — retained in the archive:**

> If ideal horizontal water slows from 4 m/s to 0 m/s, by how much does static pressure increase?

**Proposed clarified stem — teacher decision only:**

> In steady ideal horizontal flow, water of density 1000 kg/m³ moves at 4 m/s at point X and reaches a stagnation point Y (local speed 0 m/s) along the same streamline. Neglect viscous losses. By how much is the static pressure at Y greater than at X?

| Option | Original and proposed text (unchanged) |
|---|---|
| A | 16 kPa |
| B | 8 kPa |
| C | 4 kPa |
| D | 2 kPa |

**Correct option: B — same as the original source.** None of the four answer options changes.

**Reason for compulsory clarification:** The original describes slowing from 4 to 0 m/s without identifying the zero-speed location. A stagnation point has zero local speed while steady throughflow can continue around the body; zero average velocity across an entire unbranched downstream pipe section would contradict steady incompressible continuity.

**Independent solution:**

1. Choose point X in the moving flow, v_X = 4 m/s, and stagnation point Y, v_Y = 0 m/s.
2. The points are on the same level ideal streamline, so P_X + ½ρv_X² = P_Y + ½ρv_Y².
3. With ρ = 1000 kg/m³, P_Y − P_X = 0.5 × 1000 × 16 Pa = 8000 Pa = 8 kPa.
4. The static-pressure increase is 8 kPa: original source letter B.

**Student-friendly explanation (proposed):** Along a horizontal, lossless streamline ending at a stagnation point, P_Y − P_X = ½ρ(v_X² − v_Y²) = ½(1000)(4² − 0²) = 8000 Pa = 8 kPa. The original answer B is correct when the zero-speed condition is local stagnation, not zero discharge everywhere.

**Limits and scientific cautions:** Zero local velocity at a stagnation point is physically different from stopping all fluid discharge through a complete pipe section. The ideal, horizontal, same-streamline assumptions and explicit density make the calculation determinate; they do not certify an individual FBISE exam item.

**Individual academic status:** `P-11-B-40` is a **candidate topic-to-item SLO**, and *Application* is a candidate cognitive label only; the individual source-fidelity, science, SLO, cognitive, teacher approval and formal-exam fields all remain **PENDING**.

**Teacher decision:** **PENDING.** Choose either (a) keep original archived and approve a separate, clearly labelled **provisional practice variant** using the proposed stem, or (b) revise the wording, or (c) defer. The source answer letter should remain **B** unless new evidence warrants a separately reviewed key correction.

---
### Q56 — Large-reservoir nearly-zero inlet speed versus finite-section rest

**Original source ID:** `XI-U06-T65-MCQ-0056` (prepared PDF p.190)

**Original source stem — retained in the archive:**

> Ideal horizontal water accelerates from rest to 10 m/s. If upstream pressure is 100 kPa, the downstream pressure is:

**Proposed clarified stem — teacher decision only:**

> Water of density 1000 kg/m³ flows steadily from a very large reservoir into a horizontal duct. At point X in the reservoir, its speed is negligible and its static pressure is 100 kPa. At point Y downstream on the same elevation and streamline, the water speed is 10 m/s. Neglect viscous losses and pumps. What is the static pressure at Y?

| Option | Original and proposed text (unchanged) |
|---|---|
| A | 100 kPa |
| B | 50 kPa |
| C | 150 kPa |
| D | 75 kPa |

**Correct option: B — same as the original source.** None of the four answer options changes.

**Reason for compulsory clarification:** The original phrase 'accelerates from rest to 10 m/s' in steady ideal flow can be misunderstood as a finite upstream throughflow section with zero discharge. A very large reservoir makes the initial local speed negligibly small while finite flow can pass through the smaller duct. No open-to-atmosphere outlet boundary is inferred.

**Independent solution:**

1. In a large reservoir the local approach speed at X is negligible compared with the downstream duct speed, so v_X ≈ 0.
2. The ideal same-elevation streamline relation gives P_Y = P_X + ½ρ(v_X² − v_Y²).
3. With ρ = 1000 kg/m³ and v_Y = 10 m/s, dynamic pressure rise is 50000 Pa = 50 kPa.
4. The downstream static pressure is 100 kPa − 50 kPa = 50 kPa: original letter B.

**Student-friendly explanation (proposed):** Apply ideal horizontal Bernoulli between a near-stagnant point in a very large reservoir and a downstream point on the same streamline. P_Y = P_X + ½ρ(v_X² − v_Y²) ≈ 100000 + ½(1000)(0 − 10²) Pa = 50000 Pa = 50 kPa. The original letter B is retained. No downstream atmospheric discharge is assumed.

**Limits and scientific cautions:** A zero-speed finite inlet cross section cannot supply positive downstream discharge in steady, incompressible, unbranched throughflow. The calculated downstream pressure is a point in a duct and is not asserted to be an atmospheric-pressure free-jet exit; the source alone does not specify that boundary. Any nonnegligible head loss, pump, elevation change or initial reservoir speed would require further model terms.

**Individual academic status:** `P-11-B-40` is a **candidate topic-to-item SLO**, and *Application* is a candidate cognitive label only; the individual source-fidelity, science, SLO, cognitive, teacher approval and formal-exam fields all remain **PENDING**.

**Teacher decision:** **PENDING.** Choose either (a) keep original archived and approve a separate, clearly labelled **provisional practice variant** using the proposed stem, or (b) revise the wording, or (c) defer. The source answer letter should remain **B** unless new evidence warrants a separately reviewed key correction.

---
## Physics audit: why these two treatments differ

**Q55 is a stagnation-pressure problem.** In an ideal flow a fluid parcel travelling along a streamline can decelerate as it approaches a body until its **local** speed reaches zero at the stagnation point. That does not mean the total volume flow rate of a complete straight pipe must become zero. Using a 4 m/s upstream speed and water density 1000 kg/m³, the resulting ideal static-pressure rise is **8 kPa**.

**Q56 is a reservoir-to-duct problem.** The starting point is **inside a very large reservoir** where the local velocity is negligibly small relative to 10 m/s in the downstream duct. We explicitly compare the same-elevation ideal streamline points, with no pump or significant losses. From an upstream 100 kPa static pressure, the ideal downstream static pressure is **50 kPa**. No downstream free-jet pressure or atmospheric boundary is asserted; if the downstream point were an atmospheric discharge, a separately specified physical setup could invalidate this simple pressure assignment.

An actual viscous stream, substantial height difference, pump/turbine, leakage, compressibility or changed boundary conditions requires a more complete analysis. These candidates are **ideal teaching models**, not a blanket claim about all flows.

## Proposed next protected implementation (not authorized by this merge)

1. Obtain **explicit teacher approval** for each new stem and treatment. A merge of this evidence-only PR is **not approval** to alter student-facing practice.
2. If approved, create separately identified V116 provisional practice variants, retain original V84 prepared-source records and original letters B/B, and exclude unqualified source Q55/Q56 across **Topic 6.5 direct practice**, **seven-topic balanced quiz**, **central Test Builder**, **Practice Engine**, and **ID-only reporting catalog**. Fail closed if the approved overlay is unavailable.
3. Preserve exactly **80 Topic 6.5**, **560 Unit 6**, **2,250 Grade XI** provisional MCQs, along with V111 Topic6.4 corrections, V114 Q61/Q67/Q78 variants, and V112 scientific superscripts plus printable-PDF watermark.
4. Run archive SHA, exact keys, source options, scientific calculations, real browser routes, all-page PDF watermark, pinned report references, and official nonrelease gates. All **560** individual academic approvals remain **PENDING** until separate FBISE mapping/cognitive and exam eligibility assessment.

## Academic QC roadmap after these proposals

Continue the remaining Topic6.5 compulsory **scope/classification** decisions (Q45–Q47, Q57–Q60 and cross-SLO Q58) without treating correct numerical answers as wrong. Then progress to the already prioritized Topic6.6 pressure/velocity-head and wing-lift assumptions, and Topic6.7 superfluidity cause/context questions, before individual-item FBISE SLO/cognitive certification. The original 14 end-unit NBF textbook MCQs remain separate from the prepared 560-item provisional practice pool.

**No change** to student PDFs, Firebase, App Check, public figures/scans, question-bank source text, account data, grading status or academic release is included in this V115 teacher-only review.
