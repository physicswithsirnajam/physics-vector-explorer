# V120 — Unit 1 simulation availability: honest empty-state and helpful study alternative

**Prerequisite:** owner verified **PR #219** merged, then continued the small exam-readiness roadmap before the first Physics paper on **December 7, 2026**.

## Specific finding verified from the repository

The original simulation catalog contains **31** standalone public demonstrations, plus **9** enhanced interactive learning labs in a separate lesson catalog. Neither inventory maps an original model or enhanced lab to **Unit 1 (Physical Quantities and Measurements)**. The Grade XI learning catalog similarly reports `simulationCount:0` for Unit 1. It would be incorrect to advertise a Unit 1 simulation merely because a filtered simulation-directory URL exists.

The existing **Exam Quick Access → Unit 1 → Simulations** link works but was labelled “Browse Unit 1 simulations,” which could give the impression that an actual Unit 1 model was available. Once clicked, the directory already provided a truthful text-only empty-state message, but it gave no direct follow-up link. This is a **navigation and wording problem**, not broken links, missing original files, or a new official simulation requirement.

## Narrow student-facing change

1. `portal/exam-quick-access.html`: the **existing** `./simulations.html?unit=1` URL and its filter category stay unchanged; only its text becomes **“Unit 1 simulation availability — no models mapped; see study alternatives.”** This prevents misleading availability expectations.
2. `portal/simulations.html`: when the current Unit 1 filter finds **zero** standalone models **and zero** enhanced labs, the same truthful original status text remains, and an additional accessible, keyboard-usable notice appears:
   - **Open the Unit 1 Learning Desk** → `./unit-01.html`.
   - **Browse simulations across other units** → `./simulations.html`, clearing the Unit 1 filter through ordinary navigation.
   - It expressly says that the directory does **not** certify a Unit 1 simulation.
3. The notice automatically hides for other units, the unfiltered catalog, and any future mapping that actually supplies Unit 1 activities. It changes no source JSON, route IDs or unit assignments.

## Academic and production safety

- All **31** original simulations and **9** enhanced labs remain exactly as before; **Unit 6** continues to show five Fluid Mechanics models. No substitute Unit 1 model or verified SLO alignment was invented.
- Grade XI Units 1–6 still have **2,250 provisional MCQs**, including **560** for Unit 6. The existing V111 (four Topic 6.4), V114 (three Bernoulli) and V116 (two stagnation/reservoir) approved self-practice variants are unchanged. Every one of the 560 individual Unit 6 scientific, source-fidelity, FBISE SLO, cognition and exam signoffs remains **PENDING**. Unit 6 course remains `planned`; formal assessment is `not-published`.
- Existing V112 true superscript and universal PDF watermark, Student Portal sign-in, Firebase, App Check monitor-only mode, saved Unit 1/2 results, Copy only reporting, combined-test printing, teacher-only role plans and all historical sources remain unchanged.
- Static **public GitHub Pages** resources are not access-restricted by a student login popup. Public worked answer keys and teacher-labelled academic audits still need separate owner decisions; this PR grants no such approval.

## Regression and expected teacher manual check

The V120 CI checks the existing 31+9 source inventory, Unit 1 zero/Unit 6 five results, exact single changed link label and status message, and runs **actual Chromium 1280px, 390px and 320px** user paths:

**Exam Quick Access → Unit 1 → Simulations → Honest empty state → Unit 1 Learning Desk**; it also checks that switching to Unit 6 yields five original models and switching to All yields all 31 original plus 9 enhanced activities, with no sideways overflow.

Prior V72 simulation migration/browser tests, V101A Exam Quick Access filters, V118 read-only link/source audit, V119 Unit 6 MCQ shortcuts, V94D exam safeguards and answer-free report-source integrity are retained. This is **not a new textbook source audit**, and does not claim end-of-unit numericals, resource links or actual user accounts were externally tested.

**After merge:** visit `/portal/exam-quick-access.html?unit=1&kind=labs`, follow the now-honest Unit 1 link and verify the alternative Learning Desk and other-unit directory links work on mobile. The next owner-approved exam-readiness work should review how intentionally public **teacher-labelled worked solutions and answer keys** are described and indexed, with genuine private hosting (not CSS hiding) if restrictions are desired.
