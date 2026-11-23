# V110 — Complete MCQ candidates for four Unit 6 Topic 6.4 teacher decisions

**Scope: teacher-facing review pack only; no source-bank mutation or item certification.**
PR #209/V109 verified the original source wording and physics problems. V110 converts the four **pending proposals** into complete four-option MCQ candidates with answers, explanatory paragraphs, worked steps and unique *review-only* IDs. It does **not** authorize or publish any of them in the student Test Builder.

## Teacher review status

| Item | Review-only candidate ID | Proposed treatment | Original key | Release status |
|---|---|---|---|---|
| Q28 | `XI-U06-T64-V110-REVIEW-0028` | Correct one truncated word in option B **after approval** | B | PENDING |
| Q51 | `XI-U06-T64-V110-REVIEW-0051` | Preserve original; add revised separate candidate that explicitly states equal discharge | A | PENDING |
| Q52 | `XI-U06-T64-V110-REVIEW-0052` | Preserve original; add revised NBF Example 6.3-inspired equal-flow candidate with accurate provenance | D | PENDING |
| Q67 | `XI-U06-T64-V110-REVIEW-0067` | Preserve original; add revised separate equal-flow situation | A | PENDING |

**Review principle:** Exact original source text and every A–D option/key stay in `question-bank/grade-11/unit-06-topic-64-v82-80-source.json` without edits. Review drafts live only under `quality/`. The old `quality/grade11-unit06-v95c1-560-item-review-queue.csv` remains the authoritative **PENDING** ledger; a merged draft is not teacher signoff.

## Candidate Q28 — falling water jet

**Stem (unchanged):** Why does a freely falling water stream typically become narrower with increasing distance below a tap?

| A | B | C | D |
|---|---|---|---|
| Its mass disappears during the fall | Its speed increases while approximately the same water volume passes each level **per second** | Its density must double after leaving the tap | Water particles slow down continuously while falling |

**Intended answer: B (unchanged).** Gravity accelerates the water. For steady approximately incompressible flow before splash/breakup, `Q = Av ≈ constant`; increasing `v` requires decreasing cross-sectional `A`.

**Source discrepancy:** Original teacher-master PDF p.140 ends with "per second", but current GitHub public option B ends only "per". V95-C2N establishes exact original-master wording.

**Treatment:** **Compulsory** one-word correction, not a new item, after explicit teacher acceptance. Preserve old snapshot/historical discrepancy evidence and deliberately update only the affected legacy source-fidelity tests when the source is authorized to change. Candidate SLO/cognitive placement is for teacher review only; the original prepared-master suggested B36, while an understanding-based explanation might also invite comparison with the B37 hose outcome. Neither is automatically certified.

## Candidate Q51 — two equal-discharge outlets

**Proposed stem:** A main stream (area 2 cm2; speed 5 m s-1) divides into two equal branches of area 1 cm2 each, **with equal volume flow rate through both branches**. Speed in either branch is:

| A | B | C | D |
|---|---|---|---|
| 5 m s-1 | 2.5 m s-1 | 10 m s-1 | 20 m s-1 |

**Intended answer: A (unchanged).** `2×5 = 1×v + 1×v`, so `v=5 m/s`. The original stem only states **equal branch area**, so another pair of outlet velocities such as `3` and `7 m/s` is also consistent with continuity. Stating equal discharge is necessary for a unique answer.

**Treatment:** **Compulsory** for official numerical use; retain existing source in historical/provisional records, and consider a separate teacher-approved variant rather than silently replacing the master.

## Candidate Q52 — original printed NBF Example 6.3 data; clarified model

**Proposed stem:** Based on the **idealized equal-flow split** in NBF Example 6.3: Aorta radius 0.8 cm, speed 0.33 m s-1; blood enters 30 arteries, each of radius 0.4 cm, **with equal volume flow through each artery**. Speed in each artery is:

| A | B | C | D |
|---|---|---|---|
| 0.33 m s-1 | 1.32 m s-1 | 0.11 m s-1 | 0.044 m s-1 |

**Intended answer: D (unchanged).** With equal discharge among the 30 branches,
`v_out = (0.8/0.4)² × 0.33/30 = 0.044 m/s`.

**Source evidence:** The V95-C2S **original printed NBF pp.98–99** visual check verified the Example 6.3 numerical data, equation and printed result. The **proposed revised stem is teacher-authored**, not the verbatim original NBF exercise. Equal radii do not establish identical physical outlet discharge without the idealized assumption.

**Treatment:** **Compulsory** qualifier for individual assessment use; preserve original provenance, stage a separately identified source-related adaptation pending teacher approval.

## Candidate Q67 — fifty equal-flow outlet vessels

**Proposed stem:** One vessel (radius 1 cm) divides into 50 equal-radius vessels (radius 0.1 cm), **with equal volume flow rate through each branch**. If initial speed is 0.20 m s-1 and the fluid is **approximately incompressible**, speed in each branch is:

| A | B | C | D |
|---|---|---|---|
| 0.40 m s-1 | 0.004 m s-1 | 0.20 m s-1 | 2.0 m s-1 |

**Intended answer: A (unchanged).**
`v_out = (1/0.1)² × 0.20/50 = 0.40 m/s`.

**Why the assumption matters:** For 50 equal-radius branches, 25 at `0.20` and 25 at `0.60 m/s` also conserve the same total volume discharge. Thus equality of radii is not enough to infer each branch's speed.

**Treatment:** **Compulsory** clarification before eligible exam use; preserve original provisional source and review the separate candidate.

## Next explicit teacher decision

For each of these **four** proposals, record **Approve proposed treatment / Request a different revision / Defer** in a subsequent authorized update. The candidate's physics, source provenance, proposed item-level SLO and cognitive level must be reviewed separately: an original letter staying the same **is not** equivalent to certifying the MCQ as FBISE Summative/Application. Any final approved variant requires a stable new source-variant ID and an explicit inclusion policy. Q28 source-bank correction requires intentional updates to old fingerprint tests after authorization; **not** a silent auto-fix.

### Automated regression scope

`scripts/test_grade11_unit6_v110_full_candidate_items.cjs` checks the exact original Git blob SHA, all four full question/options/keys, the sole Q28 change, exact V109 revisions, three independent continuity calculations plus unequal-flow counterexamples, and all 560 academic approvals and launch gates still pending. It also checks that the candidate file is not linked from the public catalog or question bank manifest.

**Original photos/scans and teacher master's complete content are not copied to GitHub.** No changes to student questions, teacher answer keys, public links, branding, watermark, Firebase, App Check or student data.
