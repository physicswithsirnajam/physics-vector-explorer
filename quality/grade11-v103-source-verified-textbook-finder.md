# V103 — Verified textbook-resource finder (Phase 1: indexed existing public sources)

## Owner goal and trigger

After PR #201 exam quick-access and PR #202 global Print → Save PDF watermark, the owner asked to continue toward **direct textbook example numericals, end-of-unit numerical/short questions, derivations and SLO notes**. Students preparing for Grade XI send-ups need fast and truthful resource discovery. This is **one focused, content-preserving navigation update**, not a new Physics answer-key release.

## Current checked-in source evidence

- `portal/unit-01-numericals.html`: ten `problem-01`–`problem-10` stable anchors. They are labelled **inspired by, based on, paraphrased from, or adapted from** sections/exercises—NOT ten verbatim textbook numbered questions.
- `portal/unit-02-numericals.html`: five individual textbook-labelled `Numerical 2.1–2.5` worked entries with existing `n01`–`n05` anchors; current teacher-source labels are **not independent examiner certification**.
- `portal/unit-03-study-guide.html`: source-labelled worked `Example 3.1` (printed p.35), `3.2` (p.36), `3.5` (p.43). Add stable IDs to those exact existing cards without changing their content or calculations.
- `question-bank/grade-11/unit-03-textbook-numericals.json`: eight adapted, worked `Numerical 3.1–3.8` with printed pp.51–52 and SLO/assessment provenance; source status `teacher-review-pending`. Note **3.6 formative (B-11)** and **3.8 supplementary-formative/cross-topic**. `portal/unit-03-numericals.js` already assigns stable IDs but its data arrives asynchronously; update hash navigation after source finishes loading, without touching answer/marking logic.
- `portal/unit-04-rotation-study.html`: source-labelled Example 4.1 (pp.58–59), existing `#example` target.
- `portal/unit-04-centripetal-study.html`: source-labelled Example 4.2 (pp.63–64), existing `#example42` target.
- Units 5 and 6 have public study, assessment and practice, but this audit has **not confirmed standalone individually numbered source links for their exercises**, and Unit 6 remains a **provisional seven-topic learning preview**. For these units the finder displays an honest missing-index message and a safe link back to Exam Quick Access.

## What PR V103 changes

1. **Add** `portal/verified-textbook-index-v103.json` — 28 source-grounded links: **10 clearly labelled Unit 1 adapted/inspired/based-on worked problems**, **five Unit 2 textbook-labelled numericals**, **three Unit 3 textbook-labelled examples**, **eight Unit 3 textbook-labelled numericals**, and **two Unit 4 textbook-labelled examples**. All `href` values are same-project static HTML with known actual `#anchor` IDs; no external/Drive/teacher-private file.
2. **Add** public `portal/textbook-resource-finder.html`, with an accessible responsive **unit dropdown**, **type dropdown** and optional number/topic/SLO search. It displays source notices, SLO and formative/summative/source-related status, and results as deep links, not hard-coded answer content. It includes transparent no-index states, especially Units 5–6, and a public quick-access fallback.
3. **Update** `portal/exam-quick-access.html` with an obvious **Textbook Example & Numerical Finder** link. Existing six-unit 41-link inventory and dropdowns remain unchanged.
4. **Update** Unit 3 example page with **three ID attributes only** and Unit 3 numerical loader with **nonintrusive hash scrolling** so direct source links work even though exercises appear after an asynchronous JSON fetch. Do not alter examples, answer text, assessment designation, teacher marks, or print controls.
5. Add focused automated source and real 1280/390/320 Chromium browser tests, screenshots, and regression to V101-A and V58.

## Academic and security boundaries

- V103 is a **navigation index of previously published teaching pages**, not a claim of exhaustive textbook exercise coverage, independent answer validation or official FBISE marking.
- Page labels preserve that Unit 1 examples are *adapted, inspired, paraphrased or section-based*, not exact textbook reproductions. Neither student-facing nor metadata calls these ten verbatim textbook numbers.
- No newly licensed textbook page scans, NBF art or other publisher PDFs; all published text and numerical solutions remain exactly as before.
- Exact individual end-of-unit short/long questions and derivations **remain a planned Phase 2** once validated from original NBF book + official FBISE assessment framework. Summative/formative/PBA-only distinctions must be separately audited; do not invent missing source page numbers, exact exercise IDs or academic completeness.
- No modification to MCQ question/option/key or data bank, protected `courseLessons`/enrollment docs, Firebase Authentication, Firestore security rules, billing, teacher/admin roles, App Check token logic, source PDF watermarks or student practice-saving rules.
- Firebase App Check remains in **Monitoring**; no enforcement. Student MCQ issue reporting stays **Copy only**, no production send/report inbox.
- The source index is public metadata only, and the page makes no personal/student database requests.

## Release/test gate

1. Open **Draft** PR only. Inspect latest-head code and automatic workflow; require V103, V101-A, V58 plus all triggered CI to be green.
2. Verify V103 source-backed 28 records against the exact current source labels and target anchors. Verify Unit 3 dynamic arrival scrolling at least one formative numerical, and Unit 3 original Example 3.2 anchor.
3. Owner may choose **Ready for review → Merge pull request → Confirm merge** after tests and scope review.
4. After Pages succeeds, open `portal/textbook-resource-finder.html?unit=3&kind=textbook-numerical`; click **Numerical 3.6** and confirm it scrolls to **3.6** with formative label. Then try **Unit 2 → Numericals → 2.1**. Select Unit 5 → numericals; verify it **does not invent a numbered exercise**.
5. If a deep link fails on a browser, do not silently redirect to a wrong answer; report the browser and link, amend the anchor in a focused PR, preserving the original academic source.

## Following PRs (not included here)

- **V104 and later:** source/teacher audit of exact end-of-unit **short and comprehensive exercises**, source page/number, SLO, formative/summative/PBA boundary and current matching page anchor; source-verified single-item deep linking only then.
- **Subsequent:** original textbook example numericals/derivations by remaining units (including 5–6) after verification; student-friendly cross-page navigation and quality-gate signed off.
- **Exam readiness:** concise topical quick-revision and practice pathways; scientific QC of MCQ stems, keys and stimulus-based items before public claims; optional daily/weekly practice support without coercive streaks or false cloud-save claims.
- **After exam-focused stabilization:** complete Unit 6 scientific sign-off, then Units 7–10 and 11–14 one original-textbook/SLO reviewed unit at a time; build Grade IX from source notes and official FBISE SSC-I model; defer comprehensive X and XII launches until XI and IX are academically and operationally mature.
