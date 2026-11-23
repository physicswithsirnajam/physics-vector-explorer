# V114 — Grade XI Unit 6 Topic 6.5 authorized Bernoulli practice variants (Q61, Q67, Q78)

**Approval:** On 23 November 2026, after teacher-review PR #213/V113 was merged and reviewed, the teacher explicitly authorized all three treatments: keep the original prepared-source records; create distinct clarified student-self-practice variants with the stated ideal-flow/continuity/incompressibility model conditions; preserve the original correct letters **D/C/C**; block the ambiguous originals across **all** student practice paths; withhold individual FBISE SLO, cognitive-level and official-examination certification.

## Original source remains immutable

- Historical source: `question-bank/grade-11/unit-06-topic-65-v84-80-source.json`. The full original **80-question** prepared-master bank, including source Q61, Q67 and Q78, is **byte-for-byte unchanged**, at Git blob SHA **`f5a7dd0a29d5e90842c0ef557071aebc10a70baf`**. Historical V95-C2T source/question/key evidence and V113 review proposals therefore remain reproducible.
- The proposed V113 teacher candidates are the exact reviewed stems used for these V114 authorized variants. Their academic ledger remains **PENDING** for formal, item-by-item FBISE/exam approval. Narrow approval for an ordinary learning variant is **not** a blanket academic signoff.
- Provenance: the teacher-prepared private master PDF was earlier audited for source Q61/Q67/Q78 on prepared pp.190–193 and keys pp.195–196. Original printed NBF textbook pp.99–100 previously verified the Bernoulli equation, **not** that these teacher-prepared MCQ stems or new clarified variants were verbatim NBF textbook content. No protected scans are published in this PR.

| Original source | New **student-practice-only** ID | Condition explicitly stated | Original answer |
|---|---|---|---|
| Topic6.5 Q61, `XI-U06-T65-MCQ-0061` | `XI-U06-T65-MCQ-0061-V114` | Horizontal, unbranched, steady incompressible flow; negligible viscosity/loss, no pump/turbine; same streamline | **D**: faster, lower static pressure |
| Topic6.5 Q67, `XI-U06-T65-MCQ-0067` | `XI-U06-T65-MCQ-0067-V114` | Steady incompressible flow, no leak or branch, constant tube area, rising elevation | **C**: kinetic term unchanged; gravitational term increased |
| Topic6.5 Q78, `XI-U06-T65-MCQ-0078` | `XI-U06-T65-MCQ-0078-V114` | Same-area, steady incompressible horizontal ideal flow, same streamline, no pump or losses | **C**: equal static pressure under the model |

**Scientific model nuance:** Equal areas do **not** on their own imply equal speeds for compressible flow, for which steady **mass discharge** rather than necessarily volumetric flow is conserved. A smooth pipe is not equivalent to a proof of inviscid flow; the ideal/Bernoulli outcome is explicitly a simplifying educational model. These qualifiers make the provisional practice questions more scientifically well-specified, but do not independently verify framework-level board eligibility.

## Source-preserving overlay and universal quiz filtering

New immutable-source-compatible overlay: `question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json`, with three original ID exclusions and three stable `-V114` practice IDs. `shared/practice-bank-adapter-v55.js` validates that exact overlay against its expected source, every original stem and option, original key **D/C/C**, exact 3-item boundary, intact original source blob reference, explicitly stated assumptions, unapproved exam fields and unique replacement IDs. It **fails closed** if the overlay file, source assumptions, key integrity or required status flags are unavailable/invalid.

Four public practice surfaces use that same strict transform:

1. `portal/unit-06-topic-65-preview.html` — Topic6.5 direct 80-MCQ quiz, including 20 standalone situations. It validates V84 source then applies V114; ambiguous original Q61/Q67/Q78 are **never presented**. Missing overlay disables practice.
2. `portal/unit-06-balanced-mcq-v95c1.html` — seven-topic balanced 28/35/42/56-question quiz. Original source checks run first, then apply **both** V111 Topic6.4 and V114 Topic6.5 overlays, and use corrected records for all question sampling and review. If either overlay fails, the quiz is disabled.
3. `build-your-physics-test.html` — centrally loaded Grade XI Unit6 pool uses the upgraded shared practice adapter and still exposes **560** provisional MCQs (rather than adding duplicates).
4. `practice-engine/index.html` — same guarded central bank and **560**-item inventory.

The 80 original Topic6.5 records are still accessible in the public raw JSON archive for historical fidelity; the exclusion specifically prevents those three ambiguous IDs from being *selected as live practice questions*, not from being inspected by teachers.

## Reporting/reference consistency

- The trusted public-source allowlist admits **only** the named new V114 overlay. No user-controlled arbitrary file path or new user-record access is allowed.
- `server/review-manifests/grade11-approved-public-review-refs-v99i.json` retains **2,250** public, ID-only reference rows and changes only the three affected IDs plus the single Unit6 bank-version identifier and deterministic content digest. The existing V111 Topic6.4 practice refs remain unchanged.
- Student report references and practice history must resolve the actual V114 variant ID; original prepared-source ID remains available as `sourceOriginalId` on a learning item.
- The existing `question-bank/manifest.json` remains the historical source-inventory manifest, rather than being misrepresented as a certified 560-item final-exam bank.

## Grade XI academic constraints unchanged

- All **560** individual teacher-approval queue entries remain PENDING for scientific key signoff, original printed-source fidelity, exact FBISE summative/formative SLO mapping, cognitive mapping and formal teacher/exam eligibility. **No item** gains `boardEligible:true`, new individual SLO codes or a certified cognitive level.
- Full Unit 6 course stays `planned`, graded assessment stays `not-published`, `releaseApproved:false`. Original **2,250 Grade XI / 560 Unit6 / 136 standalone situations / zero genuine shared-stimulus groups** inventory counts are preserved.
- The prior V111 Topic6.4 Q28/Q51/Q52/Q67 approved practice changes are preserved **unchanged**. Scientific notation, superscript display and universal print/PDF watermark rules delivered in V112 continue without modification.
- No Firebase, App Check enforcement, student data, authentication, PDF stamping implementation, official logo, private textbook image, payment or exam-key privacy changes.

## CI and owner acceptance

The new V114 GitHub Actions workflow verifies:
- Source-bank Git SHA and all three original prepared-source stems/choices/keys; exactly three explicit practice treatments and six practice/academic certification barriers.
- Independently worked example of ideal Bernoulli pressure decrease, constant-area incompressible continuity and a compressible counterexample.
- Central **560** plus V111 four-item and V114 three-item separation, no ambiguous IDs; **2,250** pinned source references and original institutional release holds.
- Actual Chromium **1280/390/320px** Topic6.5 quiz and review of **all 80** provisional questions; seven-topic balanced quiz; real central Practice Engine.
- Failure behavior with missing V114 overlay: disable both direct and balanced quizzes, never quietly serve originals.
- Real multi-page A4 student-review PDF with **repeated Physics with Sir Najam watermark on every page**, background graphics turned OFF, without changing V112.
- Re-run V84, V95-C1, V79/V81/V83/V85/V87/V89, V111, V113, V95-C2T, V112, pinned reporting catalog and V94D official nonrelease regressions.

**Merge only after all checks on the latest PR head are green.** After GitHub Pages deployment, open Topic6.5 practice, select **All** (80) and Submit → accept the unanswered-question confirmation when used for QA → verify Q61/Q67/Q78 have “V114 clarified variant” labels, and print the review PDF to confirm every page contains our watermark. Also check seven-topic balanced quiz and central Test Builder remain available. Report PR number and check outcome to continue academic review of remaining Topic6.5 Bernoulli model decisions (notably Q55/Q56 stagnation assumptions), then Topic6.6/6.7 issues.
