# Grade XI V211 · Unit 2 source-indexed exercise navigation

## Confirmed source inventory (existing public portal)
- V103 `portal/verified-textbook-index-v103.json`: **5** Unit 2 original-number-labelled numerical adaptations, individually linking to existing `unit-02-numericals.html#n01` … `#n05`. The index explicitly describes these as worked adaptations from the existing teacher source, **not independently confirmed identical NBF original wording**.
- V104 `portal/verified-descriptive-index-v104.json`: **35** Unit 2 short responses (9 textbook-labelled in teacher material and 26 additional SLO practice) and **15** comprehensive responses (4 teacher-textbook-labelled and 11 additional SLO practice), all individually anchored in the existing public descriptive page.
- Existing Unit 2 learning desk also holds 25 additional SLO worked numericals, provisional 206 MCQs, a formula sheet, two protected lessons and an unscored vector lab; **all remain unchanged**.

## Narrow change
- Existing 5-stage sidebar Unit 2 PRACTISE has one source-indexed link to five existing labelled numerical adaptations.
- Unit 2 PREPARE has two independently filtered links to 35 short and 15 comprehensive answers, plus explicit disclaimer about teacher-source textbook labels versus independently authenticated original NBF exercise page scans.
- Unit 2 learning desk adds a single useful question finder card, prefiltered links, and an original-source-mapping status note.
- No new question, explanation, marked option, exercise solution, image, textbook-number mapping, Firebase security rule, roster, teacher key, or student result created. Catalog remains exactly 59 source resource records; Unit 2's 206 provisional MCQs and all 2,250 currently published Units 1–6 source identities stay unchanged. Unit7 scored status remains zero.

## Evidence and QA
Source anchor/number checks for all 55 indexed items; 1280px numerical, 390px short and 320px comprehensive end-user Chromium journeys; identity/key regression and V140, V208, V210 separate navigation regressions.

## Not an original-NBF source certification
Before making claims about exact textbook *exercise MCQs*, *end-of-unit short/extended questions*, or *assignments*, independently examine NBF Grade XI Unit 2 original chapter images (pp. 22–31) and corroborate teacher-source labels and answer/figure numerals. Numerical labels are carried forward only as `textbook-labelled in teacher source (adapted)`.

## Owner review
Leave PR Draft until **all latest-head checks pass**. Then inspect 5 changed files → Ready for review → Merge → Confirm. Verify Unit 2 Learning Desk question-finders card, and sidebar Unit 2 PRACTISE numerical + PREPARE short/long links. Do not treat this as a release of an official marking scheme.


## Unrelated sitewide CI dependency repair discovered in PR checks
The existing V112 scientific-superscript/PDF watermark test was failing **before testing any page** because `npx playwright install --with-deps chromium` attempted an Ubuntu apt update through a Microsoft third-party runner source returning HTTP 403. V211 changes its GitHub Actions installer to use the already-proven `npx playwright install chromium` path used by successful other browser checks, and only installs Poppler from signed primary Ubuntu sources **if `pdfinfo` or `pdftotext` is absent**. All original V112 scientific/real-PDF test commands and expected gates remain unchanged. This does not suppress, skip, or convert a failure into success; it only prevents a nonessential external apt feed from blocking test execution.
