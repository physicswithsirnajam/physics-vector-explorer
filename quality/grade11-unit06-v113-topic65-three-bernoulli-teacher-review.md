# V113 — Unit 6 Topic 6.5, Bernoulli’s Equation: three full teacher-review candidates

**Purpose:** Review **Q61, Q67 and Q78** model assumptions as the next targeted academic QC task after owner-confirmed PR #212 merge. All three original source questions remain selectable **provisionally** until the teacher separately approves a safe practice treatment. This PR **does not change student-facing quizzes or declare the current original stems officially certified**.

## Original source and evidence boundary

- **Original GitHub bank:** `question-bank/grade-11/unit-06-topic-65-v84-80-source.json`, **80 items**, unchanged Git blob **`f5a7dd0a29d5e90842c0ef557071aebc10a70baf`**.
- **Prepared teacher master:** prior V95-C2T audit confirmed Q61/Q67/Q78 original stems, 4 options and answer letters against owner-private `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` pp.190–193 and key pp.195–196. Those private pages are **not republished here**, and were not newly reopened for this PR.
- **Original printed NBF pp.99–100:** historical V95-C2S source inspection confirmed the ideal Bernoulli relation, **not** verbatim textbook ownership of these teacher-prepared questions.
- **Review ledger:** `quality/grade11-unit06-v95c2t-topic65-mcq61-80-scenario-review.csv`, three **COMPULSORY** source-model decisions; original source answers supported *within the appropriate model*.
- **Official status:** Topic-level B-40 is Summative/Application, while B-39 is Formative/Application; **none** of these three have individual SLO/cognitive or exam certification. B-36 continuity alignment also requires individual review.

## Proposed full question-and-answer package

### Question 61 — `XI-U06-T65-MCQ-0061`

**Original stem (preserved in the source bank):** A smooth horizontal pipe narrows from section X to section Y, and water flows steadily. Relative to X, Y has:

**Proposed clarified stem (new review-only wording):** In a horizontal, unbranched pipe, water flows steadily and incompressibly from a wider section X to a narrower section Y. Assume negligible viscous losses, no pumps or turbines, and compare points on the same streamline. Relative to X, Y has:

| Option | Text |
|---|---|
| A | Lower speed and higher static pressure |
| B | Higher speed and higher static pressure |
| C | Unchanged speed and unchanged static pressure |
| D | Higher speed and lower static pressure |

**Proposed answer:** **D**, identical to the original source answer. No option text/letter change is proposed.

**Why a clarification is necessary:** Smooth pipe and steady water flow do not alone establish the ideal Bernoulli pressure outcome. A decrease in area yields higher speed by steady incompressible continuity; static pressure is lower only in the stated no-loss/no-shaft-work same-elevation same-streamline model.

**Teacher-ready explanation:** Conservation of volume discharge gives AX vX = AY vY. Because AY is smaller, vY is larger. Along the same horizontal ideal streamline without head loss or shaft work, PX + (ρvX²)/2 = PY + (ρvY²)/2, so PY - PX = (ρ/2)(vX² - vY²) < 0. Thus section Y has higher speed and lower static pressure (D).

**Independent physics reasoning:**
1. Incompressible steady leak-free continuity: AX vX = AY vY.
2. AY < AX makes vY > vX.
3. Ideal same-height Bernoulli: PY − PX = (ρ/2)(vX² − vY²) < 0.
4. Therefore original answer D remains correct, conditionally.

**Model/SLO cautions:** Viscous pipe losses and pump/turbine energy invalidate the simple no-loss pressure inference. Formative SLO P-11-B-39 must not be silently mapped as summative theory; P-11-B-40 item-level mapping remains pending. Proposed item-SLO candidate(s) `P-11-B-40`; proposed cognition `Application`. These are **not** verified individual framework classifications.

**Teacher decision:** **PENDING** — either approve this clarified version as a **separately identified provisional-practice variant** while preserving the original source history; request an alternative stem; or defer. No student-bank change should occur solely because this review document merges.

---
### Question 67 — `XI-U06-T65-MCQ-0067`

**Original stem (preserved in the source bank):** A water stream rises in a tube of unchanged area. Which pair of energy terms is unchanged and increased, respectively?

**Proposed clarified stem (new review-only wording):** Water flows steadily and incompressibly without leaks through an unbranched tube of constant cross-sectional area, rising from a lower section to a higher one. Which pair of energy terms is unchanged and increased, respectively?

| Option | Text |
|---|---|
| A | Pressure term increased; gravitational term decreased |
| B | Kinetic term decreased; gravitational term decreased |
| C | Kinetic term unchanged; gravitational term increased |
| D | Kinetic term increased; gravitational term unchanged |

**Proposed answer:** **C**, identical to the original source answer. No option text/letter change is proposed.

**Why a clarification is necessary:** Equal area alone does not guarantee equal velocities in time-varying or compressible flow or if fluid leaks or branches. Clarify constant discharge, no leaks and density, then the original kinetic and gravitational energy claims follow.

**Teacher-ready explanation:** For an unbranched, leak-free, steady incompressible stream, the discharge Q = Av is constant. Since A is the same at both stations, v is the same, so ½ρv² is unchanged. The higher point has greater ρgh, so the gravitational energy term increases. The source correct answer remains C. This alone does not guarantee individual FBISE B40 Application certification.

**Independent physics reasoning:**
1. Steady incompressible continuity: Q = A1v1 = A2v2.
2. A1 = A2 and no leaks/branches imply v1 = v2.
3. The kinetic energy-density term ½ρv² remains unchanged.
4. For h2 > h1, the gravitational energy-density term ρgh increases; original answer C.

**Model/SLO cautions:** Unsteady flow and compressible density variation may defeat a universal inference from equal area. This uses continuity in support of Bernoulli, so P-11-B-36 vs P-11-B-40 and item cognition require separate review. Proposed item-SLO candidate(s) `P-11-B-36; P-11-B-40`; proposed cognition `Application`. These are **not** verified individual framework classifications.

**Teacher decision:** **PENDING** — either approve this clarified version as a **separately identified provisional-practice variant** while preserving the original source history; request an alternative stem; or defer. No student-bank change should occur solely because this review document merges.

---
### Question 78 — `XI-U06-T65-MCQ-0078`

**Original stem (preserved in the source bank):** A fluid moves steadily in a horizontal pipe with the same cross-sectional area at both points. Ignoring losses and pumps, its static pressures are:

**Proposed clarified stem (new review-only wording):** An incompressible fluid flows steadily through an unbranched horizontal pipe of equal cross-sectional area at points X and Y. Assume both points lie on the same streamline, with negligible viscous losses and no pumps or turbines between them. The static pressures at X and Y are:

| Option | Text |
|---|---|
| A | Necessarily increasing downstream |
| B | Necessarily decreasing downstream |
| C | Equal |
| D | Always both zero |

**Proposed answer:** **C**, identical to the original source answer. No option text/letter change is proposed.

**Why a clarification is necessary:** The original says a fluid with equal areas, which does not enforce constant density. Steady compressible mass continuity ρAv = constant permits different speeds at the same area; static pressure need not be equal. State incompressibility and ideal Bernoulli conditions.

**Teacher-ready explanation:** For steady incompressible no-leak flow, Q = Av is constant. Equal AX and AY give vX = vY. Because both points are horizontal and the same ideal lossless streamline is used, PX + ½ρvX² = PY + ½ρvY²; hence PX = PY (C). Compressible flow can have different densities and speeds at equal area, so the original unqualified premise was under-specified.

**Independent physics reasoning:**
1. Steady incompressible continuity: AX vX = AY vY.
2. Since AX = AY, vX = vY.
3. At equal height, ideal Bernoulli implies PX + ½ρvX² = PY + ½ρvY².
4. Therefore PX = PY under the stated model, original answer C.

**Model/SLO cautions:** For compressible flow, constant mass rate ρAv—not equal area alone—governs speed, and pressures may differ. Real flow pressure losses also make equal static pressure invalid unless negligible as explicitly stated. Proposed item-SLO candidate(s) `P-11-B-40`; proposed cognition `Application`. These are **not** verified individual framework classifications.

**Teacher decision:** **PENDING** — either approve this clarified version as a **separately identified provisional-practice variant** while preserving the original source history; request an alternative stem; or defer. No student-bank change should occur solely because this review document merges.

---
## Recommended next owner-controlled implementation

1. **Teacher academic approval required for each of Q61, Q67, Q78.** An owner’s merge of this proposal-only PR preserves evidence but does **not** count as approval.
2. If approved, prepare one separately scoped implementation PR creating versioned clarified practice variants, retaining all three original source records, and excluding ambiguous originals from student practice in **all** affected entrypoints (Topic6.5 direct quiz, balanced Unit6 quiz, central Test Builder and Practice Engine).
3. Keep original answer letters D/C/C and 80 per-topic / 560 Unit6 provisional count; do not certify official B40/B36/K/U/A mappings or release exams without a separate source-science and framework review.
4. Run immutable-archive, new-variant, all-560 central pool and browser/PDF/regression safeguards. The new V112 scientific superscript and watermark presentation is a separate already-merged layer and must not be altered by this review PR.

## Remaining Unit 6 roadmap

After this three-item review, prioritize the other compulsory Bernoulli Model Topic6.5 notes (e.g., Q55/Q56 stagnation-point interpretation, remaining model/context flags), then Topic6.6 Q43 and Q57/Q58/Q80 and Topic6.7 Q24/Q61/Q38/Q74. Across all topics, the consolidated V95-C3C first-pass flags **216 compulsory teacher decisions and 344 optional notes**, not 216 incorrect answers. The authoritative 560-entry signoff queue and exam release gates must remain untouched.

**No textbook scan, private student data, Firebase change, exam publication, new image, public quiz edit or release toggle is included in V113.**
