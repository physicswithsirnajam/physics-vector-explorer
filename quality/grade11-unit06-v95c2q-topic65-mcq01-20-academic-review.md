# V95-C2Q — Grade XI Unit 6 Topic 6.5 Bernoulli's Equation MCQs 1–20: source, physics and FBISE scope audit

**Scope:** First Topic6.5 foundational 20-item academic QC batch, after independently confirming PR #121 merged. This draft adds **teacher-only academic evidence, a deterministic source snapshot and release-safe regression**. No source student-facing MCQ stem, option, answer letter, explanation, illustration, course, grade or exam status is edited.

## Independently reopened evidence and scope

- Owner-private teacher-prepared `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` compiled **PDF pp.183–185** Q1–20 exact 20 stems and 80 A–D choices; **p.194** 20 original answer letters, author-tagged K/U cognitive labels and original explanations.
- GitHub `question-bank/grade-11/unit-06-topic-65-v84-80-source.json` original Q1–20 compared with prepared master using Unicode NFKC and whitespace normalization: **20/20 stems, 80/80 options and 20/20 answer letters match**. Source key `AACCBCDCBACADDBCABAD`. Prepared explanations were independently reviewed for scientific meaning, **not asserted to match byte-for-byte**.
- Owner-provided official `Physics_HSSC_I_model_paper_50_percent(5).pdf` framework p.11: **P-11-B-39 is Formative/Application (excluded as an independently tested theory SLO in the final paper)**; **P-11-B-40 is Summative/Application** for **explaining/applying Bernoulli’s equation for horizontal and vertical fluid flow**. The prepared bank's K/U cognition tags are **teacher annotations only**, not approved individual board cognition or exam eligibility.
- The original printed **NBF Grade XI Physics pp.99–101 and actual Figure 6.9 were NOT independently reopened**. Prepared teacher attribution to NBF Figure6.9, original derivation and Daniel Bernoulli information box are **unverified original-textbook fidelity**; teacher-provided photos requested when available.
- Q13 explicitly mentions `Figure 6.9` but its GitHub source record has **no `referenceFigureId`**. Q13 may be answered textually in the intended model, but claiming a verified figure-linked exercise would be improper.

## Review summary

| Check | Result |
|---|---|
| Original teacher-master stems/options/keys | **20/20; 80/80; 20/20** |
| Scientific best source letters within textbook model | **20/20 supported** |
| Incorrect answer letters found | **0** |
| Compulsory teacher cognition/figure/source/scope issues | **8: Q1, Q8, Q9, Q10, Q13, Q17, Q19, Q20** |
| Other optional mathematical or source notes | **12** |
| Individual per-item official B-40 Application classification | **PENDING** |
| Original printed NBF pp.99–101 and Figure6.9 verification | **PENDING** |
| Source student MCQ material changed | **No** |

### Eight compulsory teacher decisions for individually approved final papers

| Exact source question | Priority | Review focus | Scientific / source / cognitive qualification |
|---|---|---|---|
| **XI-U06-T65-MCQ-0001** | COMPULSORY_COGNITIVE_SCOPE_NOTE | Core Bernoulli variables versus Application SLO | Recognizing pressure, speed and elevation is a sound introductory Knowledge item (A); it is not by itself an Application-level use of Bernoulli’s equation, the demand of official summative B-40. **Retain original key A** for provisional practice. |
| **XI-U06-T65-MCQ-0008** | COMPULSORY_COGNITIVE_SCOPE_NOTE | SI units of Bernoulli terms | Each term P, ½ρv², ρgh has SI Pa = J/m³, so C is scientifically supported. Identification of the unit alone is Knowledge-level and does not certify official B-40 Application. **Retain original key C** for provisional practice. |
| **XI-U06-T65-MCQ-0009** | COMPULSORY_COGNITIVE_SCOPE_NOTE | Pascal conversion versus Bernoulli application | 1 Pa =1 N/m², source B. This is dimensional Knowledge/prerequisite and not by itself summative B-40 Application; keep for student practice. **Retain original key B** for provisional practice. |
| **XI-U06-T65-MCQ-0010** | COMPULSORY_COGNITIVE_SCOPE_NOTE | Elevation SI unit versus application | Height h is measured in metres, source A. This unit-recall item supports the model but is not evidence on its own of applying Bernoulli’s equation in horizontal/vertical flow. **Retain original key A** for provisional practice. |
| **XI-U06-T65-MCQ-0013** | COMPULSORY_ORIGINAL_FIGURE_REVIEW | Original NBF Figure 6.9 and inlet pressure-work direction | The teacher-prepared source Q13 references original Figure6.9 but the GitHub record has NO referenceFigureId and original printed NBF Figure6.9 pp.99–101 has not been visually examined. In the intended derivation inlet pressure force acts with displacement, giving positive work, source D. Do not certify illustration-based fidelity until original figure and its displayed orientation are checked. **Retain original key D** for provisional practice. |
| **XI-U06-T65-MCQ-0017** | COMPULSORY_CROSS_SLO_NOTE | Equal displaced volumes are continuity prerequisite | Source A follows from steady incompressible leak-free unbranched continuity over the same Δt. This concept directly supports B-36 continuity and is used in Bernoulli derivation, but does not by itself explain/apply pressure–speed–height Bernoulli B-40. **Retain original key A** for provisional practice. |
| **XI-U06-T65-MCQ-0019** | COMPULSORY_CROSS_SLO_NOTE | Volumetric flow rate as continuity prerequisite | Given uniform normal speed (or cross-sectional average), Q=V/Δt=Av, original A. This is a prerequisite continuity relation, not a standalone Bernoulli pressure/height application. The prepared source says uniform speed and does not imply all flow profiles are uniform. **Retain original key A** for provisional practice. |
| **XI-U06-T65-MCQ-0020** | COMPULSORY_ORIGINAL_TEXTBOOK_ATTRIBUTION | Historical physicist and textbook information box | Daniel Bernoulli is the name associated with Bernoulli’s equation, so source D is correct. The claim that the original printed NBF information box at pp.99–101 credits him specifically has not been directly verified; this Knowledge fact is not a B-40 Application item. **Retain original key D** for provisional practice. |

### Key physics distinctions in the full twenty

- Bernoulli's textbook ideal-flow sum `P+½ρv²+ρgh=constant` applies along the same streamline for steady, incompressible and negligible-viscosity/loss flow, with no unmodelled pumps or turbines; terms are energy per volume with units Pa (`J/m³`).
- Q5/6: `½ρv²` is kinetic-energy density; `ρgh` is gravitational potential-energy density relative to a reference. The pressure term expresses pressure work per displaced volume in the ideal derivation.
- Q11: when comparing two **equal-height** points, `ρgh` cancels, yielding `P+½ρv²=constant` along that streamline, but not a universal relation across physically unrelated flows.
- Q13/14: pressure force contributes positive work at the chosen inlet and negative work at the chosen outlet **on the selected moving fluid element**; work sign convention must be taught explicitly. Printed original Figure6.9 orientation and caption remain unverified.
- Q15/16: `W=P(AΔx)=PΔV` and `ΔV=AΔx` for the simple uniform-slab derivation.
- Q17/19: `A₁v₁Δt=A₂v₂Δt` and `Q=Av` are supporting **continuity** relations; they are useful in derivation but do not individually establish summative **B-40 application**. **P-11-B-36** is a possible alternative candidate outcome only, not certified.
- Q20 Daniel Bernoulli is historically correct, but the exact original printed textbook information-box wording cannot be vouched for until inspected.

### Candidate-only author cognitive tags, SLO and teacher priority

| Q | Original letter | Prepared author's K/U tag | Candidate topic outcome (unapproved) | Review priority |
|---|---|---|---|---|
| 1 | A | K | P-11-B-40 | COMPULSORY_COGNITIVE_SCOPE_NOTE |
| 2 | A | K | P-11-B-40 | OPTIONAL_PRINT_ATTRIBUTION_NOTE |
| 3 | C | K | P-11-B-40 | OPTIONAL |
| 4 | C | K | P-11-B-40 | OPTIONAL |
| 5 | B | U | P-11-B-40 | OPTIONAL |
| 6 | C | U | P-11-B-40 | OPTIONAL |
| 7 | D | U | P-11-B-40 | OPTIONAL |
| 8 | C | K | P-11-B-40 | COMPULSORY_COGNITIVE_SCOPE_NOTE |
| 9 | B | K | P-11-B-40 | COMPULSORY_COGNITIVE_SCOPE_NOTE |
| 10 | A | K | P-11-B-40 | COMPULSORY_COGNITIVE_SCOPE_NOTE |
| 11 | C | U | P-11-B-40 | OPTIONAL |
| 12 | A | U | P-11-B-40 | OPTIONAL |
| 13 | D | U | P-11-B-40 | COMPULSORY_ORIGINAL_FIGURE_REVIEW |
| 14 | D | U | P-11-B-40 | OPTIONAL_SIGN_CONVENTION_NOTE |
| 15 | B | U | P-11-B-40 | OPTIONAL |
| 16 | C | K | P-11-B-40 | OPTIONAL |
| 17 | A | U | P-11-B-36_possible;P-11-B-40_supporting | COMPULSORY_CROSS_SLO_NOTE |
| 18 | B | K | P-11-B-40 | OPTIONAL |
| 19 | A | U | P-11-B-36_possible;P-11-B-40_supporting | COMPULSORY_CROSS_SLO_NOTE |
| 20 | D | K | P-11-B-40_supporting | COMPULSORY_ORIGINAL_TEXTBOOK_ATTRIBUTION |

**Crucial:** The prepared master includes K/U cognitive tags for this entire foundational section; those are **not equivalent** to the official framework's **Summative/Application** demand for B-40. This PR does NOT label these twenty questions final-paper-ready. Any future board-style versions must map each proposed summative MCQ to an approved official learning outcome with an appropriate individual cognitive demand.

## Evidence assets, source immutability and release holds
- `quality/grade11-unit06-v95c2q-topic65-mcq01-20-academic-review.csv`: 20 original IDs, prepared PDF item/key pages, exact original key, author's K/U tag, topic B39/B40 official distinction, eight teacher findings, optional item notes, pending original NBF print fidelity and item-by-item teacher/exam approval.
- `scripts/test_grade11_unit06_v95c2q_topic65_first20_academic.cjs`: freezes source original 20 stems/80 option texts/20 answer letters to fingerprint **`0x5a371272`**, protects the B39 formative vs B40 summative distinction and missing original Fig6.9, eight decision flags, all 560 central queue approvals pending and unchanged release settings. Dedicated GitHub Actions workflow runs this plus inherited V95-C2P through V94D tests.
- Review progress after this batch: Topic6.1 **80/80**, 6.2 **80/80**, 6.3 **80/80**, 6.4 **80/80**, Topic6.5 **20/80** = **340/560 academically inspected**, **220 questions uninspected** in remaining Unit6 topics. **Zero source items have formal individual teacher certification; all 560 central approvals remain PENDING**. The original 14 real printed textbook end-unit MCQs are separate/outside these 560 original teacher-prepared MCQs.
- Student provisional practice counts remain **560 Unit6 / 2,250 GradeXI**, **136 independent standalone situations / 0 authentic common-stimulus groups**. Full Unit6 course stays `planned`, official graded assessment `not-published`, central `releaseApproved:false`, original `sloCodes:[]`, `cognitiveLevel:'Unspecified'`, `boardEligible:false`.
- Previously documented Q28 option truncation, Q51/Q52 and Q67 branch flow assumptions remain teacher pending and are **not edited by this PR**.

**Keep this PR DRAFT until latest-head CI passes and teacher reviews the eight issues.** Next: **V95-C2R — Topic6.5 MCQs 21–40** on vertical/horizontal Bernoulli pressure-speed-height reasoning, carefully distinguishing summative B40 application from formative B39 effect.
