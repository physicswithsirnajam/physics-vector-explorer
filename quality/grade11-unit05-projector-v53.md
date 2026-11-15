# Grade XI Unit 5 — V53 projector discussion QA and teaching handover

## Scope
- **Public teacher-led presentation** of the existing V52 Unit 5 descriptive and numerical supplement, not an additional assessment, a protected login or an officially certified FBISE resource.
- Source of prompts: question-bank/grade-11/unit-05-v52-descriptive-student.json (unchanged).
- Source of model answers: question-bank/grade-11/unit-05-v52-descriptive-teacher-key.json (unchanged and **public**).
- NBF Grade XI Physics Unit 5 printed pp.77–87. Relevant questions cited within printed pp.79–83.
- Verified supplied official FBISE HSSC-I framework PDF p.11: summative **P-11-B-29 Application; B-30 Application; B-31 Understanding; B-32 Application**.
- The student supplement remains **7 Section B × 4 marks and 2 Section C × 6 marks**: 9 numbered OR question pairs, **18 model answers**, **80 individual one-mark marking steps across both alternatives**. Only **40 marks can be awarded** to a single student's chosen A/B responses.
- Two earlier 16-MCQ banks still contain **32** MCQs, unchanged. No official whole-grade paper, scannable OMR, PBA verification or stored grades is introduced.

## Page and controls
- portal/unit-05-projector-discussion.html, public link from Unit 5 Desk and learning catalogue.
- Shows **question text only** on loading; the public teacher JSON is first fetched on explicit **Reveal next step**. This reduces accidental on-screen disclosure but is **not a security or access-control boundary**.
- Question 1–9 navigation (previous/next/select), A/B selection, current SLO/cognitive/textbook page/marks, 1-mark staged reveals, reset that removes answer nodes from DOM, and teacher insight after last step.
- Focus/projector mode uses CSS; it works within Google Sites embeds without requesting browser fullscreen permission. Desktop keyboard: left/right questions and Escape to hide steps.
- Responsive 390 px phone, accessible visible buttons, distinct navy/gold text hierarchy and **unchanged exact existing official logo asset**.
- Print current slide on A4 landscape. No browser storage, student names, answers or assessment writes.

## Calculations and interpretation inherited without content changes
1. Q2 B force crosses zero at x = 4 m; signed areas +16 and −4 J give **+12 J**, not unsigned 20 J.
2. Q4 B initial KE 36 J under 9 N opposing resistance gives **4 m stopping distance**: 5 m is not reachable.
3. Q8 B first stage +40 J and second stage −12 J yield final KE **28 J** and speed about **5.29 m/s**.
4. Q9 B initial KE 96 J under −12 N net force gives **8 m stopping**, so proposed 10 m is unreachable. Negative hypothetical target KE is not a physical result.
5. New UI reads the existing worked rubric for these and all 18 choices; no duplicate or conflicting solution data.

## Automated gates
- scripts/test_unit05_projector_discussion_v53.cjs checks 9 OR pairs, 18 alternatives, 80 one-mark steps, 40 answerable marks, all four summative SLO mappings, 11 catalogue resources and unchanged 32 MCQs.
- Real Chromium checks question-only opening, no teacher-key request before reveal, on-demand teacher-key loading, one-at-a-time steps, reset/OR/navigation clearing, projector focus, mobile overflow and print media. Screenshots from CI under qa-artifacts/unit05-v53.
- Full V52, V51, V50, V49 and V48 Unit 5 test suites rerun. Existing five suites' **catalogue expectations only** are updated for the newly added eleventh resource. No prior question/answer JSON, rubric calculations or assessment statuses altered.

## Required teacher manual review before merge
1. Wait for **all** GitHub Actions on the final PR head to pass; open screenshot artifact.
2. On the Unit 5 desk open Step-by-Step Classroom Discussion; verify question appears with no solution.
3. Select Question 2 → B. Reveal all 4 steps and verify +16 − 4 = +12 J. Hide and verify no steps remain.
4. Question 4 → B: discuss stopping at 4 m, before the proposed 5 m.
5. Question 9 → B: discuss the negative hypothetical KE versus stopping at 8 m before 10 m.
6. Use A/B, previous/next and question selector; each change should reset answers. Check phone, projector focus and printed A4 landscape page.
7. Independently sign off the physics and alternative valid methods before formal examination use. Teacher JSON remains publicly accessible; never call this protected.

## Next milestone after PR #43
Consider an optional Unit 5 numerical graphical illustration board (force vs displacement with signed areas and KE curves) after feedback, or continue to Unit 6 content only after textbook/framework scope is verified.
