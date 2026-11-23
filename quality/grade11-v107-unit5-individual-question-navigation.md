# V107 — Grade XI Unit 5 source-labelled individual descriptive practice links

## Scope
This small follow-on to V106 removes a navigation obstacle for Unit 5: the existing 40-mark original classroom Section B/C paper already contains **nine A-or-B question pairs** (seven 4-mark short/numerical and two 6-mark extended/numerical), but previously users could only open the Section B or Section C headings.

V107 adds stable public `#u5-q1`–`#u5-q9` URLs that scroll to the exact original question **after its JSON bank loads**, including on mobile, and exposes links through the existing `descriptive-answer-finder.html`. The original 64 Unit 1–2 model-answer records remain untouched. Unit 5 links deliberately use visually distinct **question-only** cards, rather than pretending a solved model answer is available.

## Checked source boundary
- The nine records in `portal/verified-u05-descriptive-practice-index-v107.json` are derived from the existing `question-bank/grade-11/unit-05-v52-descriptive-student.json` **source**, matching question number, marks, section, SLO and the printed page used as *learning context* for both A/B alternatives.
- Printed source pages: Q1 p.82, Q2 p.80, Q3 p.81, Q4 p.83, Q5 p.82, Q6 p.80, Q7 p.81, Q8 p.82, Q9 p.83.
- **These Q1–Q9 identifiers are our ORIGINAL classroom practice question numbers, NOT NBF end-of-unit exercise numbers or official FBISE model answers.** No independently verified textbook-specific numerical/short/long exercise linkage is claimed.
- The original Unit 5 teacher scientific review is still pending. No original question wording, OR balancing, MCQ, marks, SLO, lesson, watermark, or print logic has changed.
- Unit 6 remains a provisional preview: no fabricated textbook exercise identifiers, solution links or promises of complete coverage.

## Changes
1. Student-only Unit 5 script assigns stable, predictable anchor IDs to the nine existing dynamically loaded question articles and scrolls/focuses a hash target after load.
2. New compact public navigation metadata indexes the nine original question-only pair URLs.
3. The existing descriptive finder shows the nine separate Unit 5 links (with SLO, marks, source-page context and teacher-review warnings) while retaining its 64 existing individually indexed **model-answer** links and the Unit 3–5 Section B/C fallback sections.
4. New independent V107 Chromium/source regression workflow validates 320px / 390px / 1280px navigation, filter/search, an actual Q8 click after asynchronous load, and the unchanged V104/V106 regression suites.

## Security and academic locks
No teacher marking key is loaded into the student page; no answers, student input, scores, database writes, accounts, personal data or analytics are added. App Check stays Monitoring (enforcement OFF); issue-reporting stays Copy only. No change to logo, official academic standards, protected pages or PDF-watermark rules.

## Owner acceptance (after all checks green)
1. Go to the existing Short & Comprehensive Answer Finder; choose **Unit 5**. Confirm nine separate **question-only** cards, not solved answers.
2. Select **Comprehensive / extended**. Confirm only Q8 and Q9 appear; open Q8 and verify that the page lands on **Question 8** after loading. Both A and B must still be offered, no answers shown.
3. Select **Short-response** and search **Q4**. Confirm one matching question-only shortcut.
4. Confirm the 64 original Unit 1–2 answered links and Unit 3–5 section-level practice shortcuts still work, including mobile navigation.
5. Do **not** merge until all new V107 and existing GitHub checks are green. Review Files changed; Ready for review → Merge pull request → Confirm merge.

## Roadmap
Continue source-first Unit 5/6 *actual textbook* numerical/descriptive exercise linkage only when exact printed question labels, pages, and answer source content can be verified; then finish Unit 6 academic quality signoff before widening Units 7–10.
