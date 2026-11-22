# V101-A — Grade XI Exam Quick Access and expansion roadmap (source-grounded, 22 Nov 2026)

## Why this small PR comes before Unit 7

Owner's **Physics with Sir Najam** portal is used by students preparing for 1st-term / send-up Physics exams beginning **7 December 2026**. Students should be able to find existing worked example numericals, short/long responses, SLO/concept notes, explanations, MCQ practice and revision material quickly—especially on phones. This change is **navigation only**, not a change to academic content, answer keys, Firebase permissions or user tracking.

After the post–Unit 6 pause, owner prioritized learner ease of use, a trustworthy MCQ issue-report route, academic QC, real progress tracking, motivation for daily practice, and privacy. We must prioritize practical student value and preserve the one-focused-PR-at-a-time release policy.

## Current GitHub inventory (not a claim of independent academic certification)

- `portal/learning-catalog.json`: 14 Grade XI unit entries.
- Published-resource units: **1–5**. Their central MCQ counts are **275, 206, 220, 640, 349**, totaling **1,690**.
- Unit 6 **Fluid Mechanics**: **560** additional provisional public MCQs in seven topic previews; seven-topic desk and five simulations available. Its full course / formal academic assessment release is NOT signed off. Total Grade XI public central practice **2,250**.
- Units 7–14 remain planned as complete courses, regardless of the separate original PDF/video link index.
- Source navigation includes 31 original simulations, a growing set of dedicated study/numerical/descriptive pages, and the separate 14-unit original resources/video catalog. Existing labels are source-grounded, not certification claims.
- Firebase sign-in, eligible practice saving and protected lessons were live-tested by the owner after PR #200. Owner-provided App Check screenshots showed successful real verification; **Firestore and Authentication remain Monitoring, enforcement OFF.**
- The tested MCQ issue report in student Practice Engine stays **Copy only**. The administrator Review Desk / private HTTP workflow is local, fictional and default OFF, not a production teacher inbox. No live Send button is authorized.
- The separate Unit 1 Firestore protected workshop currently contains placeholder summary/body; drafting is not automatically permission to publish content. The two Unit 2 protected lessons and separate pilot have working owner-tested access.

## What PR V101-A actually does

New **`portal/exam-quick-access.html`**, linked in the existing global navigation and the Units & Resources drawer. Provides 6 real, collapsible unit panels, each with accessible **Unit** and **Resource Type** dropdowns:

- **Concept / SLO notes**: existing source-mapped study guides or current learning desk (do not promise independently certified per-SLO exercises).
- **Worked examples / numericals**: existing dedicated Unit 1, 2, 3 and Unit 5 practice pages, with accurate original titles. Unit 3 specifically links **textbook Numericals 3.1–3.8**.
- **Short / long answers**: existing descriptive response/practice pages in Units 1–5. Do not silently claim these are individually indexed exact end-of-unit textbook questions.
- **MCQ practice**: existing Test Builder filtered by current unit. The source bank is provisional until independent item-level review.
- **Simulations** and **Original Notes / Videos**: existing public routes and unit-specific filters.

The new page contains **41 verified existing local routes** (including 6 index-filter links), a short non-compulsive 15-minute revision routine and a clear absence message for a resource category that has no separate verified page. Not every unit has every resource, particularly Unit 6. An unavailable exercise/derivation deep link is not invented.

No content uploads, backend connection, user analytics, Firestore writes, fake grade/streak, protected lesson exposure or new student reporting.

## Four explicit release gates

1. Exact-head V101-A workflow must pass source links, 1280/390/320 Chromium filters and accessible drawer.
2. Existing V58 resource-drawer regression must pass; all other triggered workflows must pass. Check source HTML for mobile overflow and JavaScript errors, review screenshots.
3. Owner reviews the 41 direct links and public academic labels, keeps original official logo untouched, and confirms no production Firebase, secret or permission changes.
4. Only owner may choose **Ready for review → Merge pull request → Confirm merge**. After Pages propagates, open `portal/exam-quick-access.html?unit=3&kind=numericals` and test on own desktop/mobile. Use preview to check Unit 6 does not pretend end-of-unit completed.

## Roadmap — continue as separate focused PRs, not bundled into V101-A

### Before the send-up exam (highest priority)

A. Release and manually test the public navigation route. Confirm real class syllabus scope with teacher without asserting portal unit totals equal assigned school course.

B. Inventory **exact textbook example numericals, chapter end-of-unit short/long questions, end-of-unit numericals, formula sheets, derivations and summative SLO notes** by source unit/page/number. Extract/crosslink existing eligible assets or create distinct reviewed pages. Keep formative/PBA-only SLOs distinguished from summative written exams. Do not relabel generic pages as exact exercise solutions. Add unit/section links only when source metadata has been audited.

C. Tighten MCQ quality/coverage: question/option/key and stimulus sets, held figure questions, scientific computations, clear feedback; prioritize known high-risk students items. Keep student issue-report **Copy only** until approved audited real intake and teacher notifications.

D. Build clearly optional **exam revision plan** and 5/10/20/30-question quizzes with progress review. Unit 1–2 saved attempts already supported; cross-unit saving, new badges/streaks or teacher dashboards must be designed and tested first rather than implied as working. Avoid exposing student grades or manipulative competitive features.

E. Phone usability, accessibility, load speed, offline-friendly resource fallbacks and actual teacher/student smoke testing.

### Complete first Grade XI block: Units 7–10 (after exam-critical stabilization)

For each unit, use original NBF textbook + official FBISE framework, make a page-by-page/SLO/exercise inventory, distinguish summative/formative/PBA, then produce teacher-reviewed guides, textbook examples, EOU responses, derivations, topic-linked simulations and original answer-checked MCQ/scenario banks. Audit against source, build unit desk and revision dropdown, run actual desktop/mobile tests; only then mark unit complete. Do one unit/small PR at a time.

### Complete HSSC-I book: Units 11–14

Repeat the **same quality gate**, don't shortcut because routes or external YouTube/Drive links already exist. Run full-book global SLO/MCQ/exercise inventory, consistency and navigation audit after Unit 14.

### Grade IX and later expansion

Use the user's NBF Grade 9 notes, current FBISE SSC-I framework and approved 50% MCQ / 50% descriptive model. Preserve source material and source-specific question numbering/answer keys, do complete QC and mobile access, then integrate into the multi-grade portal. Do not disturb original Google Sites/Drive while migration remains incomplete.

Only when Grade XI and IX are academically reviewed and operationally reliable should the roadmap expand fully to Grades X and XII. Shared portal components may be reused, while school/FBISE-specific SLO and exercise content remains grade-specific. Any custom-domain acquisition is a separate reviewed DNS + App Check domain allowlist migration; no domain change here.

### Security and business-operational gates throughout

App Check **Monitoring, not enforcement** until representative real traffic is consistently verified in multiple real browsers and older legitimate clients are accounted for. Firestore Security Rules, billing, custom claims, backend deployment, production issue-report Send, teacher data access, and privacy/cost monitoring require separate owner approval and rollback procedures. Current Firebase skill/plugin visibility does not itself grant direct Firestore administrative access.

Academic source certification, live production app risk, controlled QA and student outcomes remain distinct measurements.
