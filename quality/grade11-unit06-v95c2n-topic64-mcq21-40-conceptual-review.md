# V95-C2N — Grade XI Unit 6 Topic 6.4 MCQs 21–40: exact source reconciliation and conceptual continuity QC

**Scope:** Following independently verified merge of PR #118, second 20-item Topic6.4 reasoning review. This PR adds **teacher evidence, an explicit source-option transcription discrepancy and deterministic tests**. No existing public student-facing question/options/answer/explanation or course/assessment approval state is changed automatically.

## Sources directly reopened (not inherited summaries)

- Teacher-owned `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, compiled **PDF pp.139–142** original Q21–40 question stems and options, and **pp.148–149** original answer-letter table and one-line explanations.
- GitHub `question-bank/grade-11/unit-06-topic-64-v82-80-source.json`, Q21–40. Exact comparison using Unicode NFKC and whitespace normalization (excluding PDF page furniture): **20/20 matching stems, 79/80 matching options and 20/20 matching answer letters**. Original key string `DCADDBBBDDDBCCDBBDBA`.
- **One definite option truncation in GitHub Q28 option B:** GitHub text: `Its speed increases while approximately the same water volume passes each level per`; prepared original PDF p.140 ends with `Its speed increases while approximately the same water volume passes each level per second`. The missing **“second”** is a **COMPULSORY SOURCE CORRECTION** before final exam reuse and should be applied as a separate teacher-approved targeted edit rather than silently mutating the provisional source bank in this QC PR. It is not an error in the selected letter (still **B**). No other option differs.
- The owner-supplied official FBISE `Physics_HSSC_I_model_paper_50_percent(5).pdf`, **PDF p.11**, was reopened: **P-11-B-36** Summative / Application (*use continuity to solve problems*); **P-11-B-37** Summative / Understanding (*explain speed increase when squeezing a rubber pipe*); **P-11-B-38** Summative / Application (*justify continuity as mass conservation*). Prepared teacher-compiled key labels each Q21–40 B36/B37/B38, but that assignment is **candidate only** until individual cognitive-level/SLO approval.
- **Original printed NBF textbook pp.96–99 were NOT directly reopened.** The teacher-compiled PDF and its teaching explanations are the verified original question-master for this review, not a claim of printed-NBF word-for-word fidelity. No textbook figure is imported here.

## Source and science results

| Check | Result |
|---|---|
| Original MCQ stems match prepared master | **20/20** |
| Individual A–D options match | **79/80**, one exact Q28(B) missing final word |
| Original teacher-master answer letters match | **20/20**, `DCADDBBBDDDBCCDBBDBA` |
| Independently checked chosen physics meanings | **20/20 source-best** under intended stated/default models; Q28(B) text incomplete |
| Compulsory source/physics/assessment teacher notes | **7: Q27, Q28, Q30, Q31, Q37, Q39, Q40** |
| Optional per-item notes | **13** |
| Answer-letter changes indicated | **0** |
| Actual student-facing bank files edited | **0** |
| Printed NBF original pp.96–99 fidelity | **PENDING** |
| All individual teacher approvals and board certification | **PENDING** |

### Seven compulsory teacher decisions

| Original source ID | Priority | Issue | Reason and teacher decision |
|---|---|---|---|
| **XI-U06-T64-MCQ-0027** | COMPULSORY_HOSE_MODEL_NOTE | Squeezed-hose speed rises only conditionally | The source says 'usually' and 'approximately': a smaller outlet area increases mean speed IF discharge stays approximately maintained. In real supplied hoses, pressure losses and pump/tap behavior can change Q, so do not teach the rise as unconditional. Original B remains best and B-37 is Summative/Understanding. | **Original key B kept**; teacher decision pending |
| **XI-U06-T64-MCQ-0028** | COMPULSORY_SOURCE_OPTION_FIX | Correct source option B truncated during import | Genuine verbatim discrepancy: teacher-prepared PDF p.140 option B ends 'per second', but GitHub Q28 option B ends 'per'. Restore the missing word 'second' only after teacher authorization; original letter B and all other question texts/choices remain intact. Physically, gravity increases water-jet speed as the cross-sectional area narrows for nearly fixed Q, ignoring splashing, break-up and significant exchange. | **Original key B kept**; teacher decision pending |
| **XI-U06-T64-MCQ-0030** | COMPULSORY_BRANCH_GEOMETRY_NOTE | Combined arterial area, not single-vessel area | If one aorta splits into thirty equal-size arteries and total branch area exceeds aortic area, individual branch mean speed can be lower when total discharge is conserved and split approximately across branches. The wording 'potentially' is crucial: no universal biological flow prediction follows without areas and branch distribution. | **Original key D kept**; teacher decision pending |
| **XI-U06-T64-MCQ-0031** | COMPULSORY_COMPRESSIBLE_MODEL_NOTE | Compressible flow must retain density terms | For steady one-inlet/one-outlet gas flow with no leakage or accumulation, ṁ=ρAv stays constant while density can change; thus ρ₁A₁v₁=ρ₂A₂v₂ is the source best option D. Unsteady mass storage, branches or sources require a fuller continuity balance. | **Original key D kept**; teacher decision pending |
| **XI-U06-T64-MCQ-0037** | COMPULSORY_BRANCH_SLO_NOTE | Y-junction sums outgoing volumetric rates only under appropriate conditions | Source B is correct for a steady incompressible split with no leaks or mass storage: Q_in=Q_out1+Q_out2. For compressible fluid, mass rates ρQ must be summed. This applies conservation-of-mass B-38 rather than merely adding volumes. | **Original key B kept**; teacher decision pending |
| **XI-U06-T64-MCQ-0039** | COMPULSORY_CONTRADICTION_NOTE | Area tripling plus speed doubling contradicts fixed unbranched flow | The given simultaneous changes make A₂v₂=6A₁v₁, an algebraically sixfold Q increase; these changes cannot both occur in a steady incompressible, unbranched, no-leak pipe at equal throughput. Source B explicitly recognizes the incompatibility; teacher should emphasize this isn't a physically permitted two-section state under default assumptions. | **Original key B kept**; teacher decision pending |
| **XI-U06-T64-MCQ-0040** | COMPULSORY_TRIBUTARY_SOURCE_NOTE | Tributary adds mass and discharge between stations | In a steady incompressible river, Q₂=Q₁+Q_tributary minus any withdrawals between stations, so A₁v₁=A₂v₂ alone is generally invalid. Original A correctly requires an additional incoming term; don't assume constant Q across the confluence. | **Original key A kept**; teacher decision pending |

### Compulsory amendment recommendation: Q28(B)

- **Before:** `Its speed increases while approximately the same water volume passes each level per`
- **After (the actual teacher-prepared source PDF):** `Its speed increases while approximately the same water volume passes each level per second`
- **Type:** mandatory **text restoration**, not an answer change or reformulation. **Original correct option B stays B**. If teacher approves, change only this single option string in the archived source and any verified mirrors, update matching immutable source fingerprints/tests and preserve a clear audit trail.
- **Keep original as-is?** Acceptable only for historical provenance/temporary non-certified practice with an explicit flag; **not suitable as a final polished exam option** because the sentence ends abruptly.

### Teaching-model decisions

**Q21–26:** At fixed discharge `Q=Av`, area and average normal velocity change inversely; for a circular section `A=πd²/4`. A halved diameter gives one-quarter area and **fourfold speed**, not a mere factor of two. These are useful practice for **P-11-B-36** but the specific cognitive level should be checked before official use.

**Q27:** Squeezing a hose is explicitly an **Understanding** B-37 outcome. Source option B properly says *can* and *approximately maintained flow rate*. Actual flow can change with pressure losses and source behavior, so don't teach `Q` as automatically fixed when a hose is squeezed.

**Q28:** In a falling water stream gravity increases downward speed and approximate conservation of discharge reduces cross-section under appropriate assumptions. Missing “second” is a transcription error, separate from correct physical interpretation.

**Q30, Q37, Q40:** A branching or joining pipe/river requires an accounting of all contributing flows. Higher **combined** area among many branches can produce lower mean branch speeds. For a steady, incompressible split: `Q_in=ΣQ_out`; if compressible, conserve **mass** flux instead. With a tributary, include `Q_tributary` in the balance.

**Q31, Q33–34:** A compressible steady stream requires `ρAv` rather than dropping density differences. Pressure equality and zero viscosity are **not requirements for conservation of mass**. Other possible physical sources and storage must be accounted for.

**Q39:** Multiplying area by three and mean speed by two gives **sixfold Av**; the original B correctly says this is incompatible with fixed Q for a steady unbranched, no-leak incompressible stream. Explicitly explain the contradiction rather than presenting it as a physically allowed unchanged-throughput pair.

## Candidate-only item map

| Source question | Original key | Options matched | Candidate topic SLO | Tentative item cognition | Priority |
|---|---|---|---|---|---|
| Q21 | D | 4/4 | P-11-B-36 | Application | OPTIONAL |
| Q22 | C | 4/4 | P-11-B-36 | Application | OPTIONAL |
| Q23 | A | 4/4 | P-11-B-36 | Application | OPTIONAL |
| Q24 | D | 4/4 | P-11-B-36 | Application | OPTIONAL_GEOMETRY_NOTE |
| Q25 | D | 4/4 | P-11-B-36 | Application | OPTIONAL_GEOMETRY_NOTE |
| Q26 | B | 4/4 | P-11-B-36 | Application | OPTIONAL |
| Q27 | B | 4/4 | P-11-B-37 | Understanding | COMPULSORY_HOSE_MODEL_NOTE |
| Q28 | B | 3/4 | P-11-B-36 | Understanding | COMPULSORY_SOURCE_OPTION_FIX |
| Q29 | D | 4/4 | P-11-B-36 | Application | OPTIONAL |
| Q30 | D | 4/4 | P-11-B-36 | Understanding | COMPULSORY_BRANCH_GEOMETRY_NOTE |
| Q31 | D | 4/4 | P-11-B-38 | Application | COMPULSORY_COMPRESSIBLE_MODEL_NOTE |
| Q32 | B | 4/4 | P-11-B-38 | Application | OPTIONAL |
| Q33 | C | 4/4 | P-11-B-38 | Understanding | OPTIONAL_COGNITION_NOTE |
| Q34 | C | 4/4 | P-11-B-38 | Understanding | OPTIONAL_COGNITION_NOTE |
| Q35 | D | 4/4 | P-11-B-36 | Application | OPTIONAL |
| Q36 | B | 4/4 | P-11-B-36 | Understanding | OPTIONAL_COGNITION_NOTE |
| Q37 | B | 4/4 | P-11-B-38 | Application | COMPULSORY_BRANCH_SLO_NOTE |
| Q38 | D | 4/4 | P-11-B-36 | Understanding | OPTIONAL_COGNITION_NOTE |
| Q39 | B | 4/4 | P-11-B-36 | Application | COMPULSORY_CONTRADICTION_NOTE |
| Q40 | A | 4/4 | P-11-B-38 | Application | COMPULSORY_TRIBUTARY_SOURCE_NOTE |

These classifications are **not official individual assessments**; the original source `sloCodes:[]`, `cognitiveLevel:'Unspecified'`, `boardEligible:false` are preserved. The official B37 is not automatically application-level because the rest of the topic has application questions.

## Review evidence, regression and release holds

- `quality/grade11-unit06-v95c2n-topic64-mcq21-40-conceptual-review.csv` — 20 unique source IDs with source-key confirmation, **3/4 option match for Q28**, exact before/after teacher-source wording, scientific notes, mandatory/optional decision, candidate-only B36/B37/B38 and provisional cognitive classification, printed-source and teacher approval PENDING.
- `scripts/test_grade11_unit06_v95c2n_topic64_second20_academic.cjs` — freezes current source 20 original stems/80 public choices/20 letters to fingerprint `0x162869ac`, checks Q28 exact word truncation and pending correction, selected physics relations and all seven review flags, 560 individual teacher approvals pending, and inherited nonrelease validation gates. **This snapshot test protects provenance, not correctness of Q28's truncated wording.**
- Review progress **80/80 Topic6.1, 80/80 Topic6.2, 80/80 Topic6.3, 40/80 Topic6.4 = 280/560 Unit6 MCQs academically inspected**, **280 remain**. **None is individually teacher-certified** and the original 560-row master review queue still has all approvals PENDING. The separate 14 genuine textbook end-unit MCQs are not covered.
- Provisional source count remains **560 Unit6 / 2,250 GradeXI**, **136 standalone situations and zero genuine common-stimulus sets**. Full Unit6 course `planned`, formal assessment `not-published`, release approval false, and all source MCQs remain non-graded self-practice.

**Keep this PR in DRAFT until latest-head CI green, teacher reviews the seven decisions, especially Q28 and Q39, and explicitly approves any subsequent source text correction.** Next: **V95-C2O Topic6.4 numerical Q41–60**, followed by scenarios Q61–80.
