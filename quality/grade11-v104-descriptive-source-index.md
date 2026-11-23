# V104 — Grade XI Short and Comprehensive Response Finder (exam-focused resource navigation)

## Owner request, provenance and release aim

After confirming PR #203 (numbered textbook example and numerical finder), the owner asked to continue **direct end-of-unit short responses, extended answers, SLO-based study and derivations**, without losing academic accuracy. This focused PR adds **individual question discovery where current sources provide stable, checked anchor IDs**; it does **not** pretend every NBF end-of-unit exercise has been verified or newly authored.

Existing sources inspected on `main`:

- `portal/unit-01-descriptive.html`: **10 short responses S1–S10** + **4 comprehensive responses E1–E4**. The page explicitly calls these **newly composed original teaching explanations related to/derived from textbook exercise themes**, rather than verbatim NBF questions; S9/S10 are original reinforcement, E4 is linked to formative P-11-A-01.
- `portal/unit-02-descriptive.html`: **35 short responses s1–s35** + **15 comprehensive responses l1–l15** with instructor Stage 3/4 source numbering. **9 short and 4 comprehensive** are labelled textbook questions in that instructor source; **26 short and 11 comprehensive** are additional SLO practice. These labels have **not received fresh independent textbook page-by-page certification** and are not claimed as official FBISE examiner questions.
- `portal/unit-03-descriptive-practice.html` and `portal/unit-04-descriptive-practice.html`: existing **Section B** (seven four-mark OR-pair questions) and **Section C** (two six-mark OR-pair questions) of **provisional original 40-mark summative theory classroom practice**, not individually indexed textbook exercise numbers. Links target existing static `#sectionB/#sectionC`.
- `portal/unit-05-descriptive-student.html`: public Section B/C descriptive practice from reviewed source, linked to existing `#shortTitle/#longTitle`; its question bank has separate status from exact textbook end-of-unit individual answers. **Unit 5 public teacher solutions were not added or altered**.
- Unit 6: seven-topic **provisional** preview; no independently source-verified individual descriptive textbook answer IDs available yet. The finder offers a plainly labelled absence and existing Exam Quick Access fallback.

## Small change in V104

1. Add `portal/verified-descriptive-index-v104.json` with **64 exact existing anchor-linked question labels**: 14 Unit 1 plus 50 Unit 2, **45 short + 19 comprehensive**. Every entry retains its current source-type label and SLO. The group split is **Unit 1: 12 source-related/adapted and 2 original reinforcement**; **Unit 2: 13 textbook-labelled by instructor source and 37 additional SLO practice**.
2. Add `portal/descriptive-answer-finder.html`: two dropdowns (unit + short/long type), keyword/SLO/number search, honest source labels, live result count, accessible mobile design, clear Unit 3/4/5 Section B/C practice-section routes and no invented numbered answers for Unit 6.
3. Add one direct shortcut from `portal/exam-quick-access.html` so students can reach this finder from the current exam revision workflow. All existing six-unit 41 links remain.
4. Add **only a screen scroll offset** to the existing Unit 1 and Unit 2 question blocks so a direct `#S7` or `#l4` destination is not hidden behind the global sticky navigation. **No wording, numerical solution, formula, marking, student question or answer is changed.**
5. Automated V104 QA matches **every one of 64 entries** to the exact original question heading/source label/SLO/anchor; tests legitimate public source-section links; confirms accurate formative and provisional notices; uses desktop (1280) and mobile (390/320) Chromium navigation including real deep-link clicks; reruns V101-A, V103 and V58 regression.

## Unresolved educational-resource work — do not imply completion

The owner requested eventual exact indexing of **NBF textbook example numericals, end-of-unit short questions, long questions, end-of-unit numericals, derivations and SLO notes**. V103 and V104 make **truthful access faster** but they do **not** guarantee that the current questions reproduce every textbook exercise or that all answers have independent scientific QC.

Next small tasks:
- Original NBF Unit 1–6 source exercise question-number/page/SLO inventory; start with already supplied books/teacher notes, inspect missing source before claiming mappings.
- Individually numbered original textbook end-of-unit short/long question links for Units 3–6, only once source match and student page anchors exist.
- Dedicated derivation/Formulas/SLO note navigation, with summative vs formative/PBA-only labels and source-specific proof.
- Assess high-risk MCQs, answer keys and figures before send-ups; preserve V99-U **student issue report Copy only** launch lock until authorized secure intake, and avoid unfounded mastery or saved-score claims.
- Finish Unit 6 academic certification, proceed to Units 7–10, then Units 11–14, Grade IX and eventually Grades X/XII after independent full-book checks.

## Security, branding, privacy and release constraints

No new exam grades, account sign-in, API, Firebase call, user tracking, external script, teacher inbox or admin role. No changes to MCQs, answer keys, official logo, source books, original V70/V102 watermark implementation, Firebase Security Rules, private protected lessons or App Check provider. **App Check remains Monitoring/Enforcement OFF** and issue-report backend remains default OFF.

Open **Draft PR**. Require all latest-head GitHub Actions, including V104 source/browser, V101-A, V103, V58, V102 watermark and security regressions, green. Owner reviews **Files changed → Ready for review → Merge pull request → Confirm merge**. After Pages deployment, test `/portal/descriptive-answer-finder.html?unit=2&type=comprehensive-response` and jump to `Comprehensive Q4`, then Unit 1 `S7`, and ensure Unit 6 clearly shows no indexed individual answers. Print or Save as PDF from source pages should retain the existing Physics with Sir Najam watermark.
