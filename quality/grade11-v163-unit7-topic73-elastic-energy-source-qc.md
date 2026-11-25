# V163 — Unit 7.3 Elastic Potential Energy: NBF/FBISE source audit and unscored interactive student lesson

## Context and exact original sources

Prerequisite **PR #263/V162 merged** on 25 November 2026. The owner NBF Grade XI Physics textbook is already available in the private workspace, and printed **pp. 122, 123 and 124** were visually inspected directly. The private **official FBISE Assessment Framework for Physics Grade-XI, Curriculum 2022–23 / Scheme of Studies 2024**, PDF pages 10–11 (internally Page 4–5 of 21), was also checked. **No new owner upload is required for this milestone.**

Topic-level official HSSC-I theory mapping:

| Official SLO | FBISE theory status | Cognitive level | Source-aligned V163 coverage |
|---|---|---|---|
| **P-11-B-25** — describe Young's modulus experiment using metal wire | **Summative** | **Understanding** | NBF p.122, apparatus and method with reference wire and vernier measurements |
| **P-11-B-27** — explain/apply work as area under force–extension graph | **Summative** | **Application** | NBF pp.122–123 and **corrected graph-axis convention** |
| **P-11-B-28** — determine elastic potential energy and apply `½Fx=½kx²` within proportionality | **Summative** | **Application** | NBF pp.123–124, Hooke's law, strain energy and mathematical examples |

**This is topic/framework alignment only; not approval of individual source MCQ answers, scenario questions, cognitive classifications, rubrics or a scored Unit7 release.**

## Scope — one public unscored student resource

**New:** `portal/unit-07-topic73-elastic-energy-v163.html` is an original teaching page with:
- NBF **7.3.1**: simplified original two-wire Young's modulus experimental apparatus (accessible `svg` title/description), precise steps using reference wire, measuring wire diameter and length, force increments, vernier elongation and `Y=FL/(Ax)`.
- NBF **7.3.2**: work from force–extension graph `W=∫F dx` with extension on the **horizontal x-axis** and force on the **vertical y-axis**, and `W=½Fx` for linear force–extension only.
- NBF **7.3.3**: original derivation of `U=½Fx=½kx²=YAx²/(2L)` within the proportional range.
- Transparent scientific/source correction notes for original NBF Figure 7.14 reversed axes, p.123 radius versus diameter notation in Example 7.3, and p.124 summary's stress–strain area versus energy-density confusion.
- An original accessible interactive graph of `F(x)` with shaded energy area. Students may enter final force, extension, original wire length and cross-section and vary the **loading fraction 0–100%** by a real keyboard-operable slider. The shaded triangle dynamically shows why **50% extension stores 25% of final energy** for Hooke's law. Output stays in the browser: **no Firebase, no answer key, no saved grade**.
- Six original expandable concept self-check prompts; existing official square logo asset loaded unchanged; original navy/gold brand, keyboard focus, skip link, responsive mobile and printable page.

**Small navigation updates:** `portal/unit-07-learning-intro-v145.html` and `portal/unit-07-topic72-deformation-v162.html` add a public link to this Section 7.3 unscored lesson. No other shared navigation, question-bank manifest or enrollment setting changes.

## Independent numeric/source checks

1. **Teacher-created unscored model default:** final F = **200 N**, x = **1 mm = 0.001 m**, wire L = **2 m**, A = **2 mm² = 2×10⁻⁶ m²**. Results: `k = F/x = 200,000 N/m`; `Y = FL/(Ax) = 2.0×10¹¹ Pa = 200.000 GPa`; `U = ½Fx = 0.100 J`.
2. **50% extension:** x = **0.5 mm**, F = **100 N**, energy `U = ½(100)(0.0005) = 0.025 J`, exactly **25%** of the initial full-extension energy. The current polygon vertices must be `90,320 377.5,320 377.5,195` within the original SVG viewport; force–extension axes remain unambiguous.
3. **Second independent model:** F = **300 N**, x = **2 mm**, L = **2 m**, A = **2 mm²**: `k=150,000 N/m`; `Y=1.5×10¹¹ Pa = 150 GPa`; `U=0.300 J`.
4. **Textbook Example 7.3 audit, not a full copyrighted prompt copy:** NBF data F = **980 N**, wire L = **1 m**, diameter d = **0.004 m**, Y = **2.0×10¹¹ Pa**. Actual radius r = **0.002 m**; `A=πr²≈1.2566×10⁻⁵ m²`; `x=FL/(YA)≈3.899×10⁻⁴ m`; `U=½Fx≈0.191 J`. This matches the final textbook answers while correcting the p.123 **'r=0.004 m'** Given label. Using 0.004 m as radius would make the area four times too large.
5. **Graph-integral correction:** NBF printed p.122 Figure 7.14 says **weight on x-axis, extension on y-axis**, but work is `∫F dx` with **extension horizontally and force vertically**. The two triangular products agree numerically only in the linear origin-through-line case. This page uses the conventional graph and explicitly explains the source discrepancy.
6. **Stress–strain nuance:** p.124 summary equates strain energy with area under the stress–strain curve. Physically, its area is **elastic energy density** `J/m³`; for uniform strain, total elastic energy is that area multiplied by specimen volume.
7. **No average-force mistake:** NBF p.122 references average force in the wire method. `F/2` is used for work when loading from zero linearly; the wire's Young's modulus is calculated with the **actual load/extension pair**.

Note: the app is an illustration of the *assumed* linear model, **not a predictor of yield, a certified value of Y, or an approved textbook marking key**. The calculator rejects nonfinite/nonpositive inputs, strains of 100% or greater, numerical overflow and extreme values, with no grading call or persistent history.

## Source bank and later chapter work

Private owner files **already retrieved/found** in the Library: 7.2 Part A **80 MCQs solved**, 7.2 Part B **56 solved SLO Q&A**, 7.3 Part A **80 MCQs solved**, 7.3 Part B **solved comprehensive Q&A**, and end-of-unit **five numerical problems solved**. They remain **private**; no copy, keyed explanation or letter is added to the public portal by this PR.

After V163, all three Unit7 topic **concept lessons** (7.1 introductory, 7.2 full public unscored, 7.3 full public unscored) are reachable from the intro, although detailed 7.1 and all **assessment banks** are separately pending. The next priority is to **audit the already-authored 7.2 80 MCQs and 7.3 80 MCQs in small, source-bound batches**, then verify end-of-unit original exercises pp.125–126 and their keyed solutions. Avoid recreating the user's existing work. Do not claim scored/unit readiness from public concept pages.

Further original textbook issue for a later numerical exercise review: p.126 numerical **7.5** prints **50 cm diameter** while the printed stress answer is approximately consistent with **5 cm**, not 50 cm; use the *as-printed* dimensional calculation and flag the discrepancy before publishing any official answer.

## Real browser & release-safety CI

`scripts/test_grade11_v163_unit7_topic73_study.cjs`:
- Independent Node calculations for the original demonstration and corrected NBF Example 7.3.
- **Real Playwright Chromium** at **1280, 390 and 320 px**.
- Actual browser keyboard slider at **50%** checking quarter-energy and SVG polygon; real update of input values and new derived modulus/energy; invalid extension equal to wire length hides results.
- Both original SVG `title`/`desc` items, six concept prompts collapsed until opened, no runtime exceptions/overflow.
- Student navigation link from 7.1 intro to 7.3, 7.3 back to 7.2, then 7.2 back to 7.3.
- Original 2,250 Grade XI provisional MCQ identities, Unit6 560 teacher-pending approvals, 7.1 source-bound **80 pending / 0 scored**, catalog Unit7 `planned` and original V160/V161 production backend **NO-GO** unchanged.

GitHub workflow additionally runs existing **V145 intro**, **V162 deformation lesson**, legacy App Check and unscored release checks. CI artifacts contain *only public original learning page screenshot(s) and anonymous summary data*, not the owner's private book/Word/source answer keys.

**Exact six PR files:** new 7.3 page; existing 7.1 intro; existing 7.2 lesson; new V163 Chromium test; this source/QC note; new V163 GitHub workflow. No Firebase Console action, no Rules or backend changes, no production teacher service deployment, no scored MCQs. All **80 7.1** teacher signatures PENDING, Unit7 `questionBankCount=0`.

### Owner merge instructions

Keep PR draft until latest-head tests green. Read six file changes, select **Ready for review → Merge pull request → Confirm merge**. No owner-uploaded material needed yet. **After merge, next milestone V164 should begin a careful 7.2 MCQ source and answer-key audit, not automatically publish 80 questions.**
