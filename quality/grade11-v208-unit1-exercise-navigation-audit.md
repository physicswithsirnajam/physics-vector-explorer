# V208 — Unit 1 accessible source-related exercise links; truthful textbook end-of-unit status

## Owner-reported issue
Students cannot readily locate worked numericals, separate short/extended responses and *original NBF end-of-unit* sections through the Grade XI sidebar. This milestone must not manufacture unpublished textbook resources or silently identify adapted problems as verbatim textbook questions.

## Exact source inventory checked
- Existing `portal/verified-textbook-index-v103.json`: **10 Unit 1** source-related/adapted problems, each with a direct `unit-01-numericals.html#problem-XX` destination. These are **not verified original numbered exercise problems**.
- Existing `portal/verified-descriptive-index-v104.json`: **10 short-response + 4 comprehensive** Unit 1 source-related/adapted/original teaching responses, linked to `unit-01-descriptive.html#S1…S10` and `#E1…E4`. These are **not** a complete source-certified original NBF end exercise.
- Existing original public student catalogue contains **59 resource records** and **275 provisional Unit 1 MCQs**; Units 1–6 unchanged at **2250** questions. Unit 7 is still planned with zero scored student MCQs.

## Changes
1. `shared/navigation.js` adds exactly **three new Unit 1 direct finder shortcuts**, without editing the shared metadata catalogue:
   - Unit 1 numerical example/problem finder filtered to Unit 1 (10 adapted items).
   - Unit 1 short-response finder filtered to Unit 1 + short (10).
   - Unit 1 comprehensive finder filtered to Unit 1 + comprehensive (4).
2. Unit 1 **PREPARE** stage adds a non-clickable, plainly labelled caution that original NBF end-exercise MCQs, short/extended responses, numerical exercises and assignments are **not yet individually mapped or source-verified**. Existing practice remains available with honest labels; not a completed textbook solution bank.
3. `portal/unit-01.html` adds a concise quick-finder card and clarifies that its teacher-prepared resources do not reproduce the complete original NBF end-of-unit exercises.
4. A new network-isolated, read-only Chromium test validates the real Unit 1 sidebar, source integrity, all 24 anchored existing exercises/answers, desktop/mobile 1280/390/320 journey links, filtered destination page counts, and absence of false scored publication. The workflow runs the existing 2,250-ID pinned reference test as well.

## Explicit boundaries
No edit to any question bank, original answer letters, mathematical explanations, academic signoffs, existing 59-resource catalog, Firebase/Auth/App Check/Firestore rules, user account, teacher class, saved result, student report, Unit 7 scored release, or live grading. This is **navigation only**, not proof of the scientific correctness of all 24 adapted Unit 1 solutions.

**Later:** individually read the original NBF Unit 1 exercise and prepared answers, map original end-of-unit MCQ/short/comprehensive/numerical numbers and assignments, reconcile and revise source question issues, obtain teacher signoff and only then add textbook-labelled links. Repeat the same source-truthful navigation process for Units 2–7 before Unit 8.

## Owner instructions
Keep DRAFT until every *latest-head* GitHub Action is green. Inspect the five changed files, verify the links in the Files Changed tab, then Ready for review → Merge → Confirm. After merge, open the Unit 1 Learning Desk or any global menu, expand Unit 1, follow the three distinct shortcuts, and note the original-exercise pending status. No Firebase Console, key or account step.
