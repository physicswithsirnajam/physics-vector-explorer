# V138 — Local MCQ issue report download with original figure references (no backend sender)

## Prerequisite, purpose and user-visible problem

PR **#237/V137** was merged into `main` on 24 November 2026; **both latest-head workflows passed**. Its read-only teacher QC ledger reconciles the **304** original Grade XI notation candidates with **27** source-ID-anchored technical follow-up IDs and **277** not yet individually selected for these audits. All 304 rows still require Physics teacher academic review; notation candidates are not confirmed incorrect answers.

The existing student Practice Engine offers **Copy issue report** before submitting and **Copy this MCQ for teacher review** afterwards. Those controls correctly state that **no report is sent to a backend**. However, a copied report can be lost when a user navigates to another question or loses clipboard contents. Also, original image-dependent source questions already have `referenceFigureId`, but the copied plain-text report omitted this important figure reference. A teacher receiving a copied text report may therefore need extra steps to identify which verified source figure the student was viewing.

This proposed improvement creates a recoverable local `.txt` artifact without pretending that a live teacher inbox exists.

## Small, student-facing change

In `practice-engine/index.html` only:

- Add **Download issue report (.txt)** next to the existing Copy action while answering an MCQ. The selected issue type and any optional student's description are preserved in the same existing plain-text report.
- Add **Download this MCQ issue (.txt)** next to **Copy this MCQ for teacher review** on each completed-test question.
- Both downloads use a browser-generated UTF-8 `Blob` and a sanitized filename based **only** on the immutable public question ID, e.g. `psn-mcq-issue-XI-U06-T61-MCQ-0011.txt`. No external API call, Firebase write, teacher-queue insertion, login, student identity, selected answer or test score is added.
- The existing shared `makeMcqIssueReport` now adds the **original `referenceFigureId` only when present**, e.g. `unit6-figure62`. It explicitly states that the diagram itself is **not attached** to the text file. Also append the source `stimulusSetId` when available so a shared scenario can be located faithfully. These are source locator IDs, **not newly invented diagrams or actual images**.
- State clearly that a download is only **requested locally** and the student must **send the saved file to the teacher themselves**. Browser restrictions may block downloads; the existing Copy action and manual fallback remain available. Do not claim that any file reached a teacher or that previous unsent reports were recovered.

## Real browser and original-source quality check

`scripts/test_grade11_v138_issue_report_local_download.cjs` launches the unchanged Grade XI public question bank and Practice Engine on a local read-only HTTP server, using real Chromium at **1280px, 390px and 320px**. It identifies the existing **Unit 6 Topic 6.1 original question `XI-U06-T61-MCQ-0011`**, which was inspected in the real `question-bank/grade-11/unit-06-topic-61-v76-80-source.json` and carries `referenceFigureId: unit6-figure62`.

It opens the original question from the already loaded 560-item provisional bank in a **test-only one-question session**, downloads the issue TXT while in practice, uses the original Copy action, submits the test locally, and downloads the same source question from completed review. It verifies:

- Browser downloads complete at all three viewport sizes with safe expected filename.
- Downloaded text contains the original public question ID/source number, source figure locator, the no-embedded-diagram warning, issue classification, typed note where appropriate, original question/options in the same **existing** report format, and bank version.
- **No** keyed correct answer label, student answer, score, account identifier or report transmission appears in the file.
- The old Copy action/fallback remains available and the status accurately says the report was **not sent automatically**.
- No side effects on original question banks, `question-bank/manifest.json`, original V55 adapter, source-ID-only report catalog, or Unit 6 academic release matrix.
- No horizontal overflow, browser runtime exceptions or failed feedback controls.

The QA artifact is **metadata only**, such as viewport, source ID and pass/fail booleans. Downloaded actual public question/option contents and optional test notes are inspected in the isolated CI browser but **are not uploaded as artifacts**, and no student account is used.

## Safety, current release status and acceptance

- Original **2,250 Grade XI provisional public MCQs** remain unchanged (275/206/220/640/349/560). No source JSON/B64, key, explanation, SLO mapping, original figures or student test/scoring/grade data is altered.
- All **560** Unit6 individual academic signoffs remain **PENDING**, its full course remains planned, and official graded assessment release remains blocked. Public provisional self-practice is still available.
- Firebase, Auth, App Check and backend reporting endpoints **are untouched**. The student issue workflow remains **Copy/Download only**; **there is no live teacher inbox**. The prior two reports the owner tried to submit were not automatically received, and this PR does not retrieve them.
- The existing V112 scientific/typesetting/print watermark system, academy/logo assets, dashboard and results saving restrictions are untouched.
- CI preserves V137 304-candidate QC ledger, V128 all-source structural guard, V99i answer-free reference IDs, V94D 560-pending Unit6 signoffs, and V118 Copy-only reporting/nonrelease safeguards.

**Owner acceptance:** Keep PR **#238/V138 Draft** until all latest-head checks pass. Verify **four changed files**: one Practice Engine reporting UI/utility, one Chromium browser regression, this quality note, and a dedicated Actions workflow. On any red check do **not merge**; correct the same PR. After all green, **Ready for review → Merge pull request → Confirm merge**. After GitHub Pages deployment, try a figure-bearing Unit 6 provisional practice item: use **Download issue report (.txt)**, inspect the original figure ID and A–D choices, and **send the file to yourself/the teacher** using your chosen channel. After submission, check the per-question download option as well.

**Next separate phase:** A real teacher inbox must only be enabled after secure backend authentication, Firebase Rules/App Check readiness, retention and abuse protections, and explicit owner review. A client-side download is an interim user-friendly reporting path, **not a substitute for authenticated issue receipt**.
