# V66 — Unit 4 Figure 4.13: exact source figure verified, five held MCQs restored

## Why this five-item supplement was held
- Earlier V62 originally imported 75 of 80 corrected Topic 4.3 (Moment of Inertia) MCQs. The missing source MCQs **Q38 and complete scenario Q69–72** explicitly referred to NBF textbook **Figure 4.13**, whose axes were not yet visually confirmed. Importing them without the source reference would have risked misleading students or displaying an incomplete scenario.
- On 17 November 2026, inspected the original **user-supplied NBF Grade XI Physics textbook PDF `11 Physics Book(9).pdf`, printed page 64 (PDF page 64)** and verified Figure 4.13 in the actual page image. The figure directly compares uniform objects and rotation axes.
- For a uniform rectangular plate of mass M and sides a,b, the exact relevant displayed entries are:
  - **Perpendicular axis through centre**: `I = (1/12)M(a²+b²)`.
  - **Perpendicular axis through corner**: `I = (1/3)M(a²+b²)`.
  - No mass, side dimensions, or physical properties are changed when selecting the axis.
- Cross-checked these with the supplied source Word notes `Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx`, SHA256 `925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777`, Word MCQ tables 115/116 and answer table 117.

## Original-source question verification
| Original topic 4.3 question | Original printed key | Verified source/result |
|---|---|---|
| Q38 | A | Corner-perpendicular plate axis: `(1/3)M(a²+b²)` |
| Q69 | C | `a²+b² = 0.40²+0.30² = 0.25 m²` |
| Q70 | B | Centre axis: `(1/12)(6)(0.25)=0.125 kg m²` |
| Q71 | C | Corner axis: `(1/3)(6)(0.25)=0.50 kg m²` |
| Q72 | B | Greater average squared distance from the corner axis |

- `question-bank/grade-11/unit04-v66-figure413-five-source.json` preserves all five **unrewritten original Word question stems, exact four A–D options, original correct letters, source explanations, original scenario Q69–72 and Word run-level superscript formatting**.
- Original four-question scenario text remains unchanged, with its `u04-v61-t43-s4` group identifier; no partial group or invented question is introduced.
- Q38 remains a **straight/single MCQ** and has a separate source-verified reference diagram, **not** an artificial one-question scenario.
- `assets/illustrations/unit4-figure413-axis-reference.svg` is a **new, original accessible educational schematic**, not a scan/crop of the copyrighted textbook page. Its axes and exact two formula references are checked against the original textbook figure. The local-only fixed asset renders in the public practice quiz and post-question review, including the scenario's four questions.
- The test engine uses an exact allowlisted static `referenceFigureId` and hard-coded local SVG path; no remote image URL is accepted from an MCQ source. Responsive CSS and screen-reader alt/caption are included.

## Final corrected Unit4 original source coverage (after V66)
| Count | V65 | V66 |
|---|---:|---:|
| Corrected original Topic4.1–4.7 MCQs incorporated | 555 / 560 | **560 / 560** |
| Original classroom-source Unit4 MCQs | 80, separate | **80, unchanged** |
| Central PUBLIC Unit4 practice MCQs | 635 | **640** |
| Complete four-item original context/scenario sets | 47 | **48** |
| Scenario-based MCQs | 188 | **192** |
| Central Grade XI Units1–5 total | 1,685 | **1,690** |

- Corrected original source topic counts are **80 each for Topics4.1–4.7** (seven ×80 =560).
- Independent classroom80, OMR/projector, discussion, descriptive paper, author logo, authenticated users, cloud-saving permissions and saved student grades are untouched.
- All imported keys remain **provisional source-matched**, `teacher-review-pending`, `boardEligible:false`; individual cognitive level/difficulty and item-level official FBISE SLO mapping remain independently unverified. The figure and source option agreement does not certify every numerical item or distractor scientifically.
- Original V62 archive remains untouched and retains the historic held list for provenance; V66 is a **separate additive original-source supplement**. Do not misinterpret its old held marker as a current absence.

## CI and teacher acceptance
- `scripts/test_unit04_figure413_v66.cjs` verifies original five rows and keys, Word superscript, source scenario and the textbook formula, 640 unique central MCQs, 560 master-source total, 48 complete scenarios, 192 contextual items, unchanged original classroom80, and an actual Chromium session.
- Real browser QA forcibly displays **exact Q38** and **complete Q69–72 scenario** after normal practice startup to prove the local SVG loads, captions and choices render correctly, with a 390px mobile screenshot and no horizontal overflow. It also verifies Unit4 640, mixed Units3+4 **860**, disabled cloud-save, and Student Guide **1,690**.
- V65/V64/V63/V62/V61 source/answer and classroom tests and V55/V56/V57/V60/V59 multi-unit and student-guide CI continue to run. All unchanged earlier source checks remain active; the old published-bank assertion that figure MCQs were absent has correctly changed to require their presence.
- Do not merge until every check on the final commit is green; teacher should still visually check Q38 and Q69–72 diagram and formula rendering in the published site, school projector and mobile, and independently review scientific/FBISE item-level correctness.

## After V66
- Unit4 corrected original seven-topic source ingestion is structurally complete. Next stage should focus on a **question-level scientific/SLO/difficulty/cognitive QC audit** and source coverage of other Grade XI units, rather than adding more unverified MCQs or duplicating the originals.
