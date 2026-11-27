# V219 — Independent author-created draft MCQs resolving three ambiguous original NBF Unit 7 end-exercise items

**Status: TEACHER REVIEW CANDIDATES ONLY · NOT A STUDENT QUESTION BANK · ZERO LIVE UNIT 7 SCORING.**

## Why these candidates exist
The 27 November 2026 original NBF Unit 7 exercise page **125** was reopened visually from the user's *actual 15-page original Unit 7 PDF*; there are exactly ten MCQs printed. The original V174 source ledger independently flagged **MCQs 3, 5, and 10** as ambiguous without extra qualification, with all original question wording and options preserved. The scanned source, its publisher watermark, picture crops and the old teacher answer keys are **not** committed to GitHub.

**MCQ 3 — two descriptions of silicon.** Crystalline silicon is a **covalent network** material and has a **diamond-cubic** lattice, described by an FCC Bravais lattice and two-atom basis. The source conflates structural classification with bond-network descriptions. The V219 candidate restricts the question to **dominant bonding classification** and supplies four mutually exclusive scientific choices. Candidate SLO **P-11-B-22** (Understanding), provisional only.

**MCQ 5 — ambiguous stress definition.** The source uses an instantaneous stress label for a wire said to have doubled in length, without defining the relevant original or current cross-section. True and engineering stress can differ, and a 100% axial strain is not automatically within small-strain linear elasticity. The V219 candidate explicitly specifies the **initial area** and **engineering tensile stress**, with self-contained 30 N and 2.0 mm² values. SI check: `30/(2×10⁻⁶)=1.5×10⁷ Pa = 15 MPa`, a single value among the alternatives. Candidate SLO **P-11-B-24**, Application; no publisher hint or invented large-strain material behavior.

**MCQ 10 — unqualified gradient and outcome placement.** The original leaves a generic force–extension gradient unspecified by graph and region. The V219 source-related candidate specifies `F=kx` **within the proportional Hookean regime**, with explicit F-vertical and x-horizontal axes; its gradient is then the constant stiffness `k`. This is supplementary graph Understanding, **NOT by itself a scored direct demonstration of summative P-11-B-27**, which involves work as force–extension area. A **fourth, distinct additional** V219 candidate specifically targets B-27 Application: spring stiffness 200 N/m, extension 0→0.10 m, graph work `0.5×200×(0.10)²=1.0 J`, with one unique option. The fourth is **not** a rewriting or replacement of original textbook MCQ 10.

## Precise new artifact
`quality/unit07/unit07-v219-three-original-ambiguities-four-draft-mcqs-no-keys.json` contains four newly written original candidate stems and options, each tied to its own source issue (or explicitly identified as a new outcome-completion candidate), a provisional FBISE SLO and cognitive demand, and **PENDING / PENDING / HOLD**. **No correct-option letters, keyed payload, user data, publisher original stem/figure, official approval or student-scored publication**.

A review by the actual independent subject teacher is required to decide each candidate's scientific clarity, curriculum fit, appropriate cognitive level, appropriateness of distractors and unique answer. The teacher should verify the original printed question with the authorized NBF source and may reject or revise any proposal. **A green CI check is only structural and formula QC, not teacher signoff.**

## Preserved identity and release boundaries
Original V174 10 exercise MCQs and the full original 274-item source census remain unchanged; original 34 end exercises are still review-pending, as is the public Unit7 score gate. Existing 2250 Units 1–6 public practice MCQs/keys, all 59 resource catalogue records, teacher/student Firebase access, class roster, score save, copyright source figures and official brand identity remain untouched. No HTML or student navigation is changed.

## Tests and owner workflow
V219 checks original V174 three unchanged ambiguity flags, four exact new candidate identities, no answer-key fields, unique math choices, the stress/graph/area problem scopes, summative-versus-supporting classification, all teacher holds and original catalog/source identity. Original bank regression retained.

**Merge protocol:** leave Draft until latest-head checks green; inspect four changed files → Ready for review → Merge pull request → Confirm. For *academic* completion, review these as separate candidate questions with the original p125 scan and return signed science/cognitive decisions through an authorized private process. Do NOT import into Test Builder or set any scored question live based on this merge alone.
