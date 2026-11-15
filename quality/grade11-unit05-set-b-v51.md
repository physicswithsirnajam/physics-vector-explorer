# V51 — Grade XI Unit 5: Original 16-MCQ Practice Set B

**Physics with Sir Najam · NBF Work and Energy · PR #41 · Optional student mini-practice and separate public worked key**

## Release boundaries

Unit 5 now contains **two separate mini-practice papers**, each with **16 newly authored source-mapped MCQs × 0.5 = 8 classroom practice marks**. Set A is the existing V50 pilot; V51 adds Set B, **without changing Set A's question/answer bank or its page logic**.

The combined catalogue **questionBankCount is 32**, distributed evenly across four verified summative theory SLOs: eight unique pilot questions per SLO across A+B (four per SLO in each set).

**Not a full FBISE HSSC-I exam:** The whole-grade model paper's 80 MCQs and 40+40 objective/descriptive allocation cover the full Grade XI syllabus, not an isolated Unit 5 practice session. No auto-grading, scannable OMR, logged-in protected exam, student-grade saving or official examiner-certified answer key is claimed.

## Directly checked academic sources

- User-provided NBF Grade XI Physics **Unit 5 Work and Energy, printed pp.77–87**, especially graphical signed work (pp.79–80), conservative/non-conservative fields (p.81), kinetic-energy derivation (p.82) and work–energy theorem in resistive medium (p.83).
- User-supplied official **FBISE HSSC-I Physics Assessment Framework** (2024 scheme, National Curriculum 2022–23), PDF **p.11**: B-29, B-30, B-31, B-32 are all **Summative**, with parent cognitive categories **Application, Application, Understanding, Application**.
- Official model paper PDF **p.30**: students use boxed MCQ question and four option columns with adjacent A/B/C/D response circles.
- A separate PBA practical SLO list, and any newer official online edition, remain outside the verified source scope.

## Set B student structure

- **12 independent** MCQs plus **one four-item changing-force shared scenario** (Q13–Q16).
- **4 SLO-verified questions per Unit 5 summative outcome**.
- All MCQs have one independently keyed option; correct-letter balance is **A=4, B=4, C=4, D=4**.
- Three explanation/calculation steps in the separate **public** teacher key for each question.
- Set B student JSON contains **no answer/explanation fields**.
- Student display has **64 initially blank response bubbles** and a second optional practice response grid. On-screen selections exist only in current page memory (not transmitted/saved); A4 landscape print uses the exact familiar boxed presentation.
- Key is provided separately and is **not password protected**: the teacher must use it only **after** collecting/finishing student practice. Explicit reveal/hide controls are a presentation safeguard, not access protection.

## Independent answer validation register

| Q | SLO | Key | Rechecked working or concept |
|---|---|---|---|
| 1 | B-29 | B | ΔK = ½×4(5²−3²) = +32 J |
| 2 | B-29 | D | K = ½×3×4² = 24 J |
| 3 | B-29 | A | Force doubling at fixed mass/d and rest doubles work: final v_new = √2 v |
| 4 | B-30 | C | F∥ graph from +12 to −4 over 8m: signed area +36−4 = +32 J |
| 5 | B-30 | A | Force triangle base 6m, height 9N: ½×6×9 = +27 J |
| 6 | B-30 | B | Horizontal projected-force graph at F cos120° = −5N, over 3m: −15 J |
| 7 | B-31 | D | Gravity path-independent: reverse 40 J becomes −40 J |
| 8 | B-31 | C | Gravity work endpoint-dependent, friction work path-length-dependent |
| 9 | B-31 | B | Two routes +14 J vs +9 J: non-conservative |
| 10 | B-32 | A | K0=24J; ΔK=(5−8)×3=−9J; Kf=15J; v≈3.16m/s |
| 11 | B-32 | C | K0=40J; friction 10N; stopping distance 4m |
| 12 | B-32 | D | Work **against** resistance +5×2=+10J; by resistance −10J |
| 13 | B-29 | C | Shared trolley: initial K0=½×3×4² = 24J |
| 14 | B-30 | D | Variable applied force (+10→+2) over 5m: ½(10+2)×5=+30J |
| 15 | B-31 | A | Resistance −FrL is dissipative/path-dependent |
| 16 | B-32 | B | Kf = 24 + 30 − 10 = 44J; v = √(88/3) ≈ 5.42m/s |

### Common quality traps addressed

- **Q4:** Do not use the absolute trapezoid area when the force line crosses the axis. Positive triangle +36 J minus negative triangle 4 J equals net +32 J.
- **Q6:** The force **component along displacement** is plotted versus displacement; this supports official SLO B-30 rather than using an angle-only work problem without any graphical interpretation.
- **Q10:** Negative net work (−9 J) does not imply an impossible travel distance because initial K=24 J and final K=15 J stays positive.
- **Q12:** The question carefully distinguishes the positive work supplied *against* resistance from the negative work performed *by* resistance.
- **Q14 vs Q16:** Q14 uses applied-force work +30 J. For Q16's net work, resistance contributes an additional −10 J. Initial K is +24 J, so final K is +44 J. Never double-count resistance or treat the 30 J applied work as net work.

## Files, compatibility and tests

New independent banks:
- `question-bank/grade-11/unit-05-v51-16-student-b.json`
- `question-bank/grade-11/unit-05-v51-16-teacher-key-b.json`

New pages:
- `portal/unit-05-mcq-set-b.html`, `portal/unit-05-mcq-set-b.js`: boxed student paper, local unsaved bubble marking and A4 print.
- `portal/unit-05-mcq-set-b-key.html`, `portal/unit-05-mcq-set-b-key.js`: separate public teacher key, explicit reveal/hide of exact Set B key.
- Both reuse the existing V50 `portal/unit-05-mcq-v50.css` and canonical official logo file unaltered.

Publication metadata:
- Unit 5 catalogue: **eight** public resources; **32** question-bank items from two distinct pilots.
- Source audit: original B-29–B-32 official framework status untouched; PBA and latest-online-edition limitations retained; no official board exam, formal descriptive paper, protected grade capture or scannable OMR.

V51 Chromium workflow validates all 16 **Set B source texts**, all 64 option texts and initially blank bubbles, single four-question scenario, every individual keyed correct option plus exactly three explanation steps, print and 390px mobile layouts, unsaved student choices, no teacher-key fetch from the student page, and teacher hide clearing answer-bearing DOM. It additionally reruns **unchanged Set A V50** browser/source tests, official-framework V49 browser audit, Unit 5 numerical V48 Explorer and earlier Unit 4 source/assessment checks.

**Limits:** passing numerical source and visual/browser regressions do not replace independent human physics examiner review of each distractor, wording, unit, cognitive fit and paper print quality.

## Manual teacher acceptance

1. Open Unit 5 Learning Desk → **Set B — 16 Additional FBISE-Style MCQs**.
2. Compare all stems and four options against source assumptions. Pay attention to Q4 negative-area graph, Q6 projected-force graph, Q10 final positive KE and Q12 resistance sign.
3. Print A4 landscape. Verify each Q has four independent boxed options and separate A/B/C/D circles, and the scenario paragraph precedes Q13–Q16.
4. Select/clear some bubbles and reload to check there is no grade recording or persistent answer.
5. After students finish, open **Set B — 16 Worked Answers**; Reveal and Hide should show and remove all 16 keyed solutions.
6. Verify **Set A** still works without any content change.
7. Independently approve physics content and source SLO mapping before calling any question teacher-certified.

**Recommended following PR:** start source-controlled **Unit 5 short-response, numerical and extended-response practice**, while retaining both 16-MCQ student sets and their public after-test keys.
