# Grade XI first-five-unit student-readiness checkpoint — V57

## Verified publication baseline
- PR #46 / V56 merged on 16 November 2026. Its five post-merge GitHub Actions, including actual mixed-unit tests and GitHub Pages deployment, passed.
- 5 of 14 Grade XI textbook units have published learning resources. Exactly 59 resource catalogue entries, sourced from the five available units, are linked from the Portal.
- Central provisional public MCQ Test Builder currently has 673 original Grade XI MCQs: Unit 1: 275, Unit 2: 206, Unit 3: 80, Unit 4: 80, Unit 5: 32. These are *imported online questions*, not necessarily all the teacher's separate master-bank questions.
- The Test Builder supports any unique subset of Units 1–5, up to the currently supported count and eligible pool. Original scenario groups are kept together when requested. A provisional source key is not certified by the FBISE or verified by independent human sign-off.

## Changes in V57
- Add student-guide.html, a public first-time student start guide styled in the original navy/gold portal palette, using the exact existing official Physics with Sir Najam logo binary. It links to all five Learning Desks, all five individual test deeplinks, one sample mixed-unit deep link, the signed-in Learning Hub and the public Google Sites Student Hub.
- Guide lists the latest published MCQ counts; it can update those counts from the existing source manifest when available. No student identity or scores are collected by the guide.
- Portal welcome panel, dashboard cards, course-unit counts and resource-filter descriptive text now acknowledge all five published units rather than only Units 1–2.
- Dashboard explicitly distinguishes **public practice for all five** from **private cloud-saving of results for single Unit 1/2 tests only**. No misleading promise of automatic cloud saving for mixed-unit tests or Units 3–5.
- Portal resource filters now expose both SIMULATIONS and REVISION, categories already used in its original 59 published resources; previously those categories were only browsable through "All resources."
- Every available Unit 1–5 course card gets a direct link to its own central MCQ test in addition to the existing Learning Desk.
- Test Builder now links directly to the student guide and clarifies that SLO search covers all selected units.

## QA gate
- scripts/test_five_unit_student_guide_v57.cjs checks: exact five published Grade XI units; correct source-manifest MCQ counts; unique 59 resource IDs; valid local destinations and expected Google Sites domain for existing external links; matching category choices including Simulations/Revision; all five existing unit desk files; original logo present and unmodified.
- Chromium opens the guide; checks dynamic 673 total and each individual source count; verifies all five unit links and first-use guide links; launches the sample Units 1+3+5 mixed-unit Test Builder and confirms 387 questions available and valid Start; captures 1320px and 390px screenshots; checks no horizontal mobile overflow or missing local assets.
- Reruns the V56 five-unit actual browser test as a regression gate, including all-five scenarios and per-unit reporting.
- Human spot-check: check Google Sites embedding/iframe sizing, Android/iPhone mobile, external Google Sites destination, published explanatory wording, visual screenshot and all five unit resources.

## Inherited limits, for accurate messaging
- User's complete MCQ source files may contain more questions than the 673 imported MCQs. **Do not claim all master MCQs are imported**, or guess counts from filenames. Request the latest complete master files (preferably DOCX/Word, optionally PDF or Excel) before a deduplicated source-based import.
- Independent human item-by-item Physics, SLO/classification and official framework review is still pending for some published banks. Automated structural QA cannot certify academic correctness.
- Cloud progress saving is private for verified accounts and only supports individual Unit 1 or Unit 2 self-practice; mixed-unit and Units 3–5 results remain printable local reports. Do not change authenticated security rules in this UX PR.
- Teacher/admin role, secure exams, official full-syllabus paper builder and paid student protections are NOT part of this release.
- The future collapsible unit-by-unit sidebar and mobile navigation remain a separate improvement phase; this guide is a low-risk wayfinding step, not a replacement for that work.

## Communication readiness and next milestones
- After V57 is merged/deployed and the owner opens each link once, a short Urdu and English WhatsApp announcement can link to the public Google Sites HSSC-I Student Hub and/or the new public five-unit Student Start Guide.
- Next: deduplicate latest owner-provided master MCQ files against these 673 imported IDs; preserve original text, diagrams, source page, answers, worked explanations and SLOs; expand bank only after academic QC.
- Then: implement accessible collapsible sidebar with per-unit resource dropdowns and strong mobile/Google Sites embed behavior; audit Firestore data/rules separately before new saved mixed-unit attempts.
