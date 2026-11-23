# V119 — Unit 6 revision: direct balanced and topic MCQ shortcuts for December 7

**Owner-approved roadmap:** after **PR #218** merged and was checked, improve one verified source-backed student revision pathway before the HSSC-I Physics examination beginning **December 7, 2026**. This is a minimal **public navigation-only** PR. The Exam Quick Access page already passed the earlier V118 read-only audit with no broken local links; this PR adds useful shortcuts, not missing scientific content or an official examination release.

## What changes, and why

Only one student HTML page changes: `portal/exam-quick-access.html`, **Unit 6 / MCQ practice category**. Its original link and wording are preserved:

1. **Existing unchanged** — “Practise 560 provisional Unit 6 MCQs” → `../build-your-physics-test.html?unit=6` (central Test Builder).
2. **New source-verified shortcut** — “Seven-topic balanced practice — 28, 35, 42 or 56 MCQs” → `./unit-06-balanced-mcq-v95c1.html`, an existing public, ungraded balanced pool with equal sampling across Topics 6.1–6.7.
3. **New source-verified shortcut** — “Choose Topic 6.1–6.7 — 80 provisional MCQs per topic” → `./unit-06-learning-desk-v95a.html#choose-topic`, the existing all-seven-topic chooser with a matching `choose-topic` anchor and original topic practice routes.

Both new destinations already existed in GitHub Pages; this PR does not create or reword scientific questions. The existing six-unit filter and six resource types are unchanged. Source-backed **resource-group links on the exam page increase from 41 to 43**. These are students' pre-exam navigation links, **not** a statement that a school exam must cover all six units.

## Safeguards and honest labels

- **Unit 6 is still a provisional seven-topic learning preview**, with 80 original prepared-source records in each topic and **560** provisional current practice IDs. Exact end-of-unit textbook answers and independently verified derivations are not falsely advertised.
- Already approved Q55/Q56 local stagnation/large-reservoir variant keys **B/B**, Q61/Q67/Q78 Bernoulli variants **D/C/C**, and Topic 6.4 V111 clarifications remain unchanged. This is not an extra academic approval: the V111, V114 and V116 practice overlays and original protected question source files are **not edited**.
- Every one of the **560** individual science/print-fidelity/FBISE SLO/cognitive/teacher approval entries remains **PENDING**. There is no new formal exam certification, official examination key, student score, school grade or course-release permission.
- The sitewide V112 scientific typography and multi-page PDF watermark, the exact official brand assets, Firebase, App Check, login, MCQ-report Copy only workflow and Unit 1/2-only private score saving are unchanged.
- The prior V118 audit's **Unit 1** empty simulation result and the publicly hosted teacher-labelled answer-key / academic-review pages remain explicitly separate owner decisions. A link cannot be made private on public GitHub Pages by hiding it in a menu.
- Unit 6 self-practice uses source-provenance and is not automatically a summative FBISE exam question collection. There are 136 standalone situation questions, not genuine multi-item shared stimuli.

## Code and test boundary

1. `portal/exam-quick-access.html`: append two Unit 6 MCQ shortcuts only.
2. `scripts/test_grade11_exam_quick_access_v101a.cjs`: update earlier 41-link source inventory to **43**, verify direct URL and exact topic anchor, and test all three Unit 6 MCQ links on actual 390px Chromium viewport; preserve original 1280/390/320 responsive tests and Unit 3 textbook numeric link.
3. `scripts/test_grade11_unit6_exam_quick_paths_v119.cjs`: independently assert that links are exactly the three expected source-backed routes, preserve the 2250-item public report IDs, 560 pending academic queue, four V111 + three V114 + two V116 safety variants and planned course release.
4. `quality/grade11-v119-exam-quick-unit6-mcq-pathways.md`: this honest teacher-readable change record.
5. `.github/workflows/validate-grade11-v119-unit6-exam-quick-paths.yml`: exact source and real mobile/desktop verification plus prior V118 audit, school exam nonrelease and public report reference integrity.

**No** changes to student accounts, protected data, MCQ stems/options/keys/explanations, source PDF or question-bank JSON, scientific formulas, course-resource catalog, teacher-facing answer keys, original YouTube inventory, Firebase or official exam mode.

## Teacher review and owner manual check after all latest-head GitHub Actions green

Open **Exam Quick Access**, choose **Unit 6 → MCQ practice**. The result should show **3 links**. Check that the balanced destination offers **28/35/42/56** questions without a graded/exam-release claim and the topic choice leads directly to the seven-topic selector. On a phone, confirm the three options are visible without sideways scrolling. Check **Unit 3 → Worked Numericals** still opens the existing textbook examples. The Unit 6 simulation, original notes and full Learning Desk links remain accessible.

If any destination is not visible on GitHub Pages immediately after merge, account for normal site deployment/caching before concluding that the committed paths failed. Report a reproducible discrepancy for a separate small repair PR.

**Next after V119:** decide public Unit 5 teacher-labelled model answer exposure explicitly and clarify the **Unit 1** zero-original-simulation shortcut if the student-browser experience warrants it; continue exact textbook exercise indexing and Unit 6 pending source/SLO review separately.
