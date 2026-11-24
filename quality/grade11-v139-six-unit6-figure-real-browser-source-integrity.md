# V139 — Six original Unit 6 figure-dependent questions: real browser image-integrity evidence

## Verified prerequisite and reason for this QC gate

**PR #238/V138 merged**, and GitHub confirmed **39/39 latest-head checks successful**. Students can now locally download an MCQ issue report before or after practice, preserving exact figure/scenario IDs when present. The report is not automatically delivered to a teacher; students must send it themselves.

A local source audit confirmed that the Grade XI public Unit 6 practice bank includes **exactly six original figure-dependent questions** referencing **four independent educational SVGs**. All four SVG assets exist in the repository. The V93 source-figure component already places them in the question stimulus and post-submission review. However, **source-file existence and matching IDs do not prove the browser actually loads and shows those images** on student phones. Missing a force diagram or speed-time graph could make an otherwise intact MCQ impossible to answer.

V139 adds a **read-only** real-browser check of both contexts before changing any student-facing code or academic material.

## Exact original source-to-figure mapping

The following IDs were found directly in the current checked-in Unit 6 Topic 6.1–6.3 JSON sources:

| Public MCQ ID | Original source item | Figure reference | Existing SVG |
|---|---:|---|---|
| `XI-U06-T61-MCQ-0011` | 6.1 #11 | `unit6-figure62` | `unit6-figure62-reference.svg` |
| `XI-U06-T62-MCQ-0026` | 6.2 #26 | `unit6-figure63` | `unit6-figure63-reference.svg` |
| `XI-U06-T62-MCQ-0064` | 6.2 #64 | `unit6-figure65c` | `unit6-figure65c-reference.svg` |
| `XI-U06-T62-MCQ-0072` | 6.2 #72 | `unit6-figure63` | `unit6-figure63-reference.svg` |
| `XI-U06-T63-MCQ-0024` | 6.3 #24 | `unit6-figure66` | `unit6-figure66-reference.svg` |
| `XI-U06-T63-MCQ-0080` | 6.3 #80 | `unit6-figure66` | `unit6-figure66-reference.svg` |

**The existing SVGs are original educational reference drawings**, not copied or cropped NBF textbook figures. The existing captions identify the printed NBF figure/page and appropriately distinguish independent educational schematics from original printed imagery. This PR does **not** replace the textbook source or certify diagram equivalence.

## V139 real student-browser test

`scripts/test_grade11_v139_unit6_figure_browser_integrity.cjs` launches **unchanged** `practice-engine/index.html` using an ephemeral local static HTTP server and the existing checked-in V55 adapter, which loads **all 560 public provisional Unit 6 MCQs**. It selects only the six original source figure questions in a **test-only deterministic practice sequence**, preserving the original A–D options, stems, figure IDs, correct letters and source metadata.

For **1280px desktop, 390px mobile, 320px narrow mobile** it:

1. Displays each original item in the real quiz interface, checks the immutable question ID, four choices, source-figure DOM element, image loading/decoding, nonzero intrinsic and layout dimensions, descriptive alt text, honest NBF source caption, and no page overflow or JavaScript exceptions.
2. Captures **12 question-only screenshots**, one per unique SVG figure at each width. No worked explanation or revealed correct answer is shown in screenshots.
3. Submits the six-item practice unanswered in the **real** Results interface and confirms the same six source-referenced images load/decipher and retain their caption, still without horizontal overflow. It deliberately takes **no screenshots of the completed answer review**, to avoid exporting public worked keys unnecessarily.
4. Hash-checks all original figure-backed question sources, four SVG assets, manifest, renderer, and teacher release matrix before/after execution.
5. Produces an answer-free technical JSON log with the source question ID, figure reference ID, viewport, quiz/review context and pass booleans. **No original questions, options, worked explanations, correct answer letters, student scores, accounts, reports or private textbook scans are exported to JSON.**

Passing confirms that the original educational **assets load** and have a visible box in this Chromium environment. The teacher must still visually inspect the 12 PNG files for labels, force directions, axes, clipping, accessibility and faithfulness to the owner's original NBF textbook. Passing does **not** make a scientific diagram/source fidelity or correct-option certification claim.

## Academic and security boundaries

- Exactly **three new QA-only files**: this rationale, the browser regression, and a dedicated GitHub Actions workflow. No production portal pages, source bank JSON/B64, student scoring, answer keys, SLOs, PDF/watermark, logo, Firebase/Auth/App Check, issue submission, account data or teacher inbox changes.
- The original public provisional Grade XI bank remains **2,250 MCQs** across Units 1–6 (275/206/220/640/349/560).
- All **560 Unit 6 per-question academic approvals remain PENDING**, Unit 6 full course `planned`, and its formal graded assessment remains unpublished. Source-verified SVGs support *provisional self-practice*, not an official secure exam.
- Original V138 download and Copy issue-report features remain intact. Reports are still manually delivered, not automatically sent.
- Existing V94D pending-signoff, V99i source-ID parity, V118 readiness, V137 disposition ledger and V128 structural safety tests run in CI.

## Owner review and acceptance

Review **draft PR #239 (V139)** and verify **three new nonproduction files only**. **Do not merge** until every latest-head GitHub check is green. If red, the same PR will be repaired.

When green, choose **Ready for review → Merge pull request → Confirm merge**. Then download the `grade11-v139-six-unit6-figure-browser-evidence` artifact from the successful Actions run and inspect its **12 original public question-only screenshots**. If a figure is clipped, incorrect, missing labels, or inconsistent with the original NBF figure, record **question ID + viewport + original source comparison**; classify whether a correction is compulsory or optional before making a separate display-only change.

**Quality standard:** correct network delivery and legibility are necessary for figure-based practice, but only the original textbook comparison and teacher review can establish scientific accuracy.
