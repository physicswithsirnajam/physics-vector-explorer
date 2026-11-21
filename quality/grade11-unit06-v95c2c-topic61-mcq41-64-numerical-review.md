# V95-C2C — Grade XI Unit 6 Topic 6.1 MCQs 41–64: Independent 24-item numerical QC

**Status:** Third 6.1 batch reviewed after independently confirming PR #107 merged. **No original student source records, answers, option orders, explanations, framework flags or public application code are changed.** This is a teacher-review addendum, not approval for official examination release.

## Evidence reopened, exact scope and limitations

- Owner-private **`Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` PDF pages 8–11**, original prepared Section C MCQ Q41–64 and four options each, re-read independently of GitHub.
- **Compiled PDF pp.15–16** for the Q41–64 answer letters and source explanation table; additional prepared study/assignment discussion pp.23, 34, 45 indicates Assignment 6.1 details, but is still derivative/teacher material.
- GitHub source archive **`question-bank/grade-11/unit-06-topic-61-v76-80-source.json`** Q41–64 re-read, page numbers and original answers verified.
- PDF-extraction-only Unicode NFKC and whitespace normalization, with PDF running headers/footers excluded, showed **24/24 matching MCQ stems, 96/96 matching A–D options and 24/24 answer letters**. Original key sequence: **`CDCDCBACAABABCAAACDDDDAD`**.
- **24/24 source-selected numerical options independently supported** by direct arithmetic, dimensions, and relevant hydrostatic assumptions. No compulsory source letter correction identified. Source explanations reviewed for scientific meaning, **not asserted to be byte-exact** with PDF.
- **Printed original NBF textbook pp.89–91 were not directly re-opened**. Q60/61's assignment reference is supported by the teacher prepared compilation but **original printed NBF wording/art/rights are PENDING**. Neither prepared answer agreement nor CI means source-fidelity certification.
- Earlier official-framework review identifies topic **P-11-B-33 Summative/Application**; equation-use by these teacher-written MCQs is **not an individual FBISE SLO/cognitive approval**. Individual `boardEligible:false`, empty `sloCodes:[]`, `cognitiveLevel:'Unspecified'` remain untouched.

## Recalculated answer results

`F_B=ρgV_displaced`, `p_gauge=ρgh`, `F=ΔpA`, `V=F_B/(ρg)`, `W_app≈W_air−F_B`. Here `ρ` for buoyancy refers to **fluid** density, never object density.

| Source Q | Correct letter | Independent calculation method | Recalculated | Result |
|---|---|---|---|---|
| 41 | C | ρgV | 19.6 N | Supported |
| 42 | D | ρgV | 49 N | Supported |
| 43 | C | m_displaced×g | 29.4 N | Supported |
| 44 | D | ρgV | 98 N | Supported |
| 45 | C | ρgV | 31.36 N | Supported |
| 46 | B | ρgV | 24 N | Supported |
| 47 | A | F_B/(ρg) | 0.004 m3 | Supported |
| 48 | C | ρgV | 150 N | Supported |
| 49 | A | F_B/(ρg) | 0.008 m3 | Supported |
| 50 | A | ρg(side³) | 78.4 N | Supported |
| 51 | B | ρg(side³) | 1.225 N | Supported |
| 52 | A | ρgAh | 58.8 N | Supported |
| 53 | B | ρgA(h₂−h₁) | 49 N | Supported |
| 54 | C | p_gauge=ρgh | 2000 Pa | Supported |
| 55 | A | p_gauge=ρgh | 6000 Pa | Supported |
| 56 | A | Δp×A | 80 N | Supported |
| 57 | A | W−F_B | 30.4 N downward | Supported |
| 58 | C | W_air−F_B | 95 N | Supported |
| 59 | D | F_B−W | 0 N | Supported |
| 60 | D | ΔW/(ρ_water g) | 0.02040816326531 m3 | Rounded appropriately |
| 61 | D | (ρ_iron/ρ_water)×ΔW | 1560 N | Supported |
| 62 | D | F_gauge=ρghA | 20 N | Supported |
| 63 | A | F_gauge=ρghA | 50 N | Supported |
| 64 | D | ρgV | 205 N | Supported |

**Precision case Q60–61:** `200/(1000×9.8)=0.020408163... m³ ≈ 0.0204 m³`; calculating iron weight without premature rounding gives `7800×9.8×[200/(1000×9.8)]=1560 N`. If intermediate rounded V is used, the result is approximately 1559.38 N; the source's `1560 N` is the justified properly rounded result and must not be marked wrong.

## Compulsory teacher contextual notes and printed-source checks

These are **context/wording and release notes**, **not** incorrect answer letters.

| Question ID | Priority | Reason | Keep or amend |
|---|---|---|---|
| **XI-U06-T61-MCQ-0054** | Compulsory note/source gate | COMPULSORY: ρgh gives hydrostatic gauge pressure relative to free surface, not absolute pressure unless surface pressure=0. | **Keep original letter C**; add contextual teaching note now, consider any rewritten alternative only after teacher decision. |
| **XI-U06-T61-MCQ-0055** | Compulsory note/source gate | COMPULSORY: calculated 6000 Pa is pressure increase relative to surface; add atmospheric surface pressure for absolute p. | **Keep original letter A**; add contextual teaching note now, consider any rewritten alternative only after teacher decision. |
| **XI-U06-T61-MCQ-0060** | Compulsory note/source gate | COMPULSORY: volume is 0.020408163... m³; option 0.0204 is an appropriate approximation, and Assignment 6.1 attribution needs direct printed NBF check. | **Keep original letter D**; add contextual teaching note now, consider any rewritten alternative only after teacher decision. |
| **XI-U06-T61-MCQ-0061** | Compulsory note/source gate | COMPULSORY: compute weight using unrounded V or density ratio to retain 1560 N; ρ_iron=7.8 g/cm³=7800 kg/m³; direct printed NBF source check outstanding. | **Keep original letter D**; add contextual teaching note now, consider any rewritten alternative only after teacher decision. |
| **XI-U06-T61-MCQ-0062** | Compulsory note/source gate | COMPULSORY: 20 N is excess/gauge hydrostatic force from water pressure, not atmospheric-plus-liquid absolute one-sided load. | **Keep original letter D**; add contextual teaching note now, consider any rewritten alternative only after teacher decision. |
| **XI-U06-T61-MCQ-0063** | Compulsory note/source gate | COMPULSORY: 50 N is gauge excess from water pressure; explicitly state pressure reference when teaching one-sided forces. | **Keep original letter A**; add contextual teaching note now, consider any rewritten alternative only after teacher decision. |

Q54/55 express pressure **relative to surface**. Q62/63 require clarity that `F=ρghA` is force associated with **gauge liquid pressure** on an area; total absolute one-sided pressure force would include surface atmospheric pressure, though common outside pressure can cancel on opposite faces.

For Q60 and Q61, the teacher-developed materials include the reported NBF Assignment 6.1 iron-density `7.8 g/cm³` and apparent loss `200 N` data, but printed NBF page 91 has not been directly checked and attribution must stay pending.

## Optional teaching cautions

- Q50–51: `V=a³` and convert `5 cm = 0.05 m` before cubing.
- Q52–53: use the **fully immersed rigid** cylinder's displaced volume; Q53 uses `Δh=0.90−0.40=0.50 m`.
- Q56: a common atmospheric baseline cancels in the force difference on equivalent opposed faces, which is a different claim from Q62/63's one-sided force.
- Q57: net vertical force calculation assumes no additional vertical external force.
- Q58: air buoyancy is negligible for the intended air-vs-water apparent-weight difference.
- Q59: zero net force does not force zero velocity.
- Other items have routine formula and dimensional-sanity notes recorded individually in the CSV. None requires an answer-letter amendment at this stage.

## Quality ledger, CI and release invariants

- **New evidence ledger:** `quality/grade11-unit06-v95c2c-topic61-mcq41-64-numerical-review.csv`, exactly **24** unique source item rows, source PDF pages, original key, independent calculations, selected answer text, issue status, candidate-only topic outcome, and **teacher approvals PENDING**.
- Dedicated Node regression locks all 24 original stems, A–D texts and answer letters to deterministic FNV fingerprint `0x2ea4e9a3`; checks arithmetic, unit strings, original source letters, 6 highlighted qualifications and pending teacher approvals. GitHub Actions workflow also inherits V95-C2A, V95-C2B, V95-C1 and V94-D checks.
- **Academic review progression:** Topic6.1 Q1–20, Q21–40 and Q41–64 = **64 inspected out of Unit6 560**; all 560 master queue teacher approvals remain pending. **16** Topic6.1 situation items (Q65–80) and **480** other-topic questions are not covered by this PR.
- The 14 separate end-unit textbook exercises are not part of the 560 and remain independent of this reviewed subset.
- Portal remains **Unit6 planned**, assessments **not published**, source MCQs **560 Unit6 / 2250 Grade XI**, independent situations **136**, authentic shared-stimulus groups **0**, course teacher signoff **false**.
- **Keep this PR DRAFT until current-head workflow succeeds and the teacher reviews the 6 precision/source notes.** Do not interpret a passing automated test as original NBF fidelity or exam release.

**Next stage V95-C2D:** Topic6.1 Q65–80, independently reviewing each standalone real-life situation, especially correct force and motion interpretations, followed by the remaining topic-bank scientific audits.
