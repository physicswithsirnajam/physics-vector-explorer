# V109 — Unit 6 Topic 6.4: four high-priority teacher wording decisions

**Stage:** Teacher **decision proposal only**, NOT a source-bank repair, new question certification or release approval. Prepared after owner-confirmed PR #208 merge on 23 November 2026.

## Why this is the next academic step

The Unit 6 V95-C3C review already inspected **560/560 provisional MCQs** across 28 separate QC batches; **216 compulsory teacher decisions and 344 optional notes** remain. That does **not** mean 216 wrong options or keys. The authoritative 560-row review queue still has all five per-item approval dimensions **PENDING**. Rather than re-audit broadly or advance to Unit 7, this PR prepares precise teacher choices for four source-documented continuity cases that have practical educational impact.

A separately supplied original printed NBF photo/scan was verified in the V95-C2S addendum on 21 November 2026. In particular, **Example 6.3 on printed pp.98–99** has the 0.8 cm aorta / 0.33 m/s / 30 arteries of radius 0.4 cm and the idealized reported result **0.044 m/s**. This corrects the *historical source-availability state* in earlier V95-C2O documents, but does **not** by itself resolve the equal-flow assumption for a physically individual branch.

## Decision 1 — Q28: missing final word in an answer option

**Source ID:** `XI-U06-T64-MCQ-0028` · compiled teacher PDF question p.140 · source letter **B**, unchanged.

- **Original B (currently displayed):** “Its speed increases while approximately the same water volume passes each level per”
- **Prepared-master B (proposed exact source-restoring wording):** “Its speed increases while approximately the same water volume passes each level per second”
- **Reason:** Definitive import truncation of one word, independently recorded in V95-C2N. No selected-answer error is claimed; the source key **B** remains correct.
- **Decision severity:** **COMPULSORY** textual correction before reuse in formal graded practice.
- **Keep original / add alternative?** The truncated wording should be retained in audit/version history, **not** kept as a student-ready answer. A one-word correction in the canonical source is appropriate **only after teacher authorization**. A duplicate question is unnecessary.
- **Physics:** For approximately steady, constant-density stream flow, area times speed is approximately constant. As the falling jet accelerates, its cross-sectional area decreases under suitable assumptions.

## Decision 2 — Q51: equal branch area does not establish equal discharge

**Source ID:** `XI-U06-T64-MCQ-0051` · compiled question p.143 · source letter **A**, unchanged.

**Original stem:**
> A main stream (area 2 cm2; speed 5 m s-1) divides into two equal branches of area 1 cm2 each. Branch speed is:

**Proposed clarified variant:**
> A main stream (area 2 cm2; speed 5 m s-1) divides into two equal branches of area 1 cm2 each, with equal volume flow rate through both branches. Speed in either branch is:

- **Proof of ambiguity:** Conservation gives `2×5 = 1×v₁ + 1×v₂`, hence `v₁+v₂=10 m/s`. Both **5 and 5** (selected **A**) and **3 and 7 m/s** conserve total discharge. Identical branch area alone cannot fix individual speeds.
- **Decision severity:** **COMPULSORY** before individually certified assessment use.
- **Keep original / add alternative?** Preserve the original as an explicitly **provisional historical teaching source**. Prefer adding a **separate teacher-approved clarified variant** to the future approved practice pool rather than silently overwriting this prepared-master original. Do not certify the underdetermined original.
- **SLO check:** Item-level P-11-B-36/B-38 choice and actual Application demand are **pending**, not inherited from topic labels.

## Decision 3 — Q52: match printed Example 6.3 but state the equal-flow model

**Source ID:** `XI-U06-T64-MCQ-0052` · compiled question p.143 · source letter **D**, unchanged.

**Original stem:**
> NBF Example 6.3: Aorta radius 0.8 cm, speed 0.33 m s-1; blood enters 30 arteries each radius 0.4 cm. Speed in each artery is:

**Proposed clarified variant:**
> Based on the idealized equal-flow split in NBF Example 6.3: Aorta radius 0.8 cm, speed 0.33 m s-1; blood enters 30 arteries, each of radius 0.4 cm, with equal volume flow through each artery. Speed in each artery is:

- **Source verification update:** The **original printed NBF pp.98–99** Example 6.3 numerical data, continuity calculation and reported result `0.044 m/s` have now been visually checked (V95-C2S). **Do not** assert that the exact proposed wording is copied from the printed book.
- **Math:** `v = (0.33/30) × (0.8/0.4)² = 0.044 m/s` **under equal discharge per artery**.
- **Physical qualification:** One area and 30 equal outlet radii only fix *aggregate* flow. An individual outlet speed is determined only after supplying equal division (or enough equivalent physical constraints).
- **Decision severity:** **COMPULSORY** academic clarification before individual exam certification.
- **Keep original / add alternative?** Retain original in provenance and provisional practice; prefer a separate clarified variant after teacher approval. Source key **D** remains the intended equal-flow answer.

## Decision 4 — Q67: 50 equal-radius branches can have different speeds

**Source ID:** `XI-U06-T64-MCQ-0067` · compiled question p.145 · source letter **A**, unchanged.

**Original stem:**
> One vessel (radius 1 cm) divides into 50 equal vessels (radius 0.1 cm). If initial speed is 0.20 m s-1 and flow is conserved, branch speed is:

**Proposed clarified variant:**
> One vessel (radius 1 cm) divides into 50 equal-radius vessels (radius 0.1 cm), with equal volume flow rate through each branch. If initial speed is 0.20 m s-1 and the fluid is approximately incompressible, speed in each branch is:

- **Equal-flow calculation:** `v = 0.20×(1/0.1)²/50 = 0.40 m/s` (original source **A**).
- **Counterexample:** 25 same-radius branches at **0.20 m/s** and 25 at **0.60 m/s** produce the same total flow as 50 at 0.40 m/s.
- **Decision severity:** **COMPULSORY** assumption for a unique numeric MCQ.
- **Keep original / add alternative?** Preserve original provisional source; add a separately reviewed clarified variant for formal use after teacher approval.

## Teacher decision action required — not implied by merging this PR

For each of **Q28, Q51, Q52, Q67**, teacher selects an outcome: **Approve proposed text**, **Request different wording**, **Keep source as provisional and add an alternative**, or **Defer pending source check**. Those choices must be recorded explicitly in a *separate authorized amendment PR*; the V109 JSON is an immutable suggestion, **not an approval system**. The original source key letters **B, A, D, A** remain as imported throughout this proposal.

After teacher approval, any future Q28 one-word canonical edit must update the older V95-C2N fingerprint and 79/80 option-match **historical** regression assertions rather than make the old discrepancy invisible. Likewise future variants must have new stable IDs, independent answer/explanation/SLO QC and be excluded from certified bank until separately signed off. Never silently revise source history, silently change source keys or auto-enable exact-FBISE mode.

## Proof gates

- Machine-readable proposals: `quality/grade11-unit06-v109-topic64-first-four-decision-proposals.json` matches each of the four unchanged original bank entries, their current options and key letters.
- Deterministic V109 checks independently recalculate Q51/Q52/Q67 expected responses and counterexamples; ensure *all* 560 teacher approvals remain PENDING and that Unit 6 remains `planned` / `not-published`.
- Previous V95-C2N/O/P scientific audits and V108 finder regressions run in CI to protect existing lesson navigation, while preventing a source-bank rewrite in this PR.
- No private NBF scan/photograph, original copyrighted figure, student data, Firebase, App Check enforcement, grade, school release, answer-key mutation, PDF watermark or branding change.

**Current release state remains blocked.** Next academic task after explicit decisions: a small authorized correction/variant PR, with source + mathematical + desktop/mobile exam-rendering checks.
