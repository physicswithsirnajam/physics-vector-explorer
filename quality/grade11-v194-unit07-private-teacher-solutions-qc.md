# V194 — Unit 7 teacher worked-solution draft and force–extension-axis review

**Academic status: PRIVATE TEACHER REFERENCE DRAFT, NOT INDEPENDENTLY APPROVED AND NOT STUDENT-SCORED.** PR #297/V193 is confirmed merged to main at `5adb13dece9e9ce5e4a5cacc631397f6b10aafc1`.

## What is newly prepared

The two owner-uploaded **15-page complete Unit 7 textbook scans** (`Unit 7.pdf`, `unit 7 - Physics 11.pdf`) were used as primary printed NBF source. Previous V193 source verification and original page mapping are preserved; neither scan is copied into public GitHub.

A new private **six-page A4 teacher draft** in Word and PDF has been rendered and visually inspected page by page. It has equation images with **mathematical fractions, superscripts and subscripts**, a side-by-side original educational illustration showing correct general force–extension graph axes versus NBF Figure 7.14's reversed axes, a five-question discrepancy overview, and **blank independent teacher review decisions**.

| Private deliverable | Exact SHA-256 |
|---|---|
| `Unit7_V194_Teacher_Solutions_Source_Audit_DRAFT.docx` | `216b6418afd362a95ebdb3a385bf18f61fb9e091bc44820117c4e37547a1c477` |
| `Unit7_V194_Teacher_Solutions_Source_Audit_DRAFT.pdf` | `6571c53dc33d20d4e9ff39ad15d30cc8e0a03eac1e4dc508b633f1d41bd1cb14` |

Both files remain **PRIVATE conversation artifacts**; no full worked-key material is added to the public repository, CI logs or scored student bank. The whole-file checksums document their identity, but do not imply academic signoff. The PDF is intentionally offered as a teacher-readable companion, not an authoritative replacement for the publisher's answer key.

## Numerical 7.1–7.5: actual book givens versus teacher guidance

The original text and printed hints on NBF printed **p126** remain untouched. Table 7.1 on p119 gives steel Young and shear moduli and a printed brass modulus. The equations and independent calculations in the private Word/PDF were checked against those pages.

- **Numerical 7.1 — compulsory interpretation review.** A nail with d=1.50 mm, deflection 1.80 µm across y=5.00 mm has shear strain 3.60×10⁻⁴. Uniform shear estimate using book Table 7.1 steel G=8.0×10¹⁰ Pa gives about **5.19 kg** and reproduces the printed 5.2 kg hint; using printed nail Young's Y=20×10¹⁰ Pa in the same formula would imply **12.98 kg**, but is physically the wrong modulus for shear. Actual nail bending is a cantilever and is not rigorously modeled by uniform shear alone. Explicit conditional teaching note is needed.
- **Numerical 7.2 — consistent control.** Equal force, length and extension imply AₐYₐ=A꜀Y꜀, so d꜀=3√(7/12)=**2.291 mm** versus published 2.29 mm; no compulsory amendment.
- **Numerical 7.3 — compulsory source/arithmetic mismatch.** The upper steel wire carries **10 kg**, the lower brass wire **6 kg**. With the printed brass Y=1.0×10¹⁰ Pa, total extension is **1.3476×10⁻³ m** and combined stored energy **42.55 mJ**; printed hints **2.79×10⁻⁴ m** and **11.02 mJ** are inconsistent. Changing brass to Y=1.0×10¹¹ Pa is a *hypothetical diagnostic only*, giving ≈2.695×10⁻⁴ m and ≈10.86 mJ, still not exact hints. Never silently substitute the exponent.
- **Numerical 7.4 — compulsory arithmetic mismatch.** Printed A=90 mm², L=3 m, σ=300 MPa, Y=200 GPa lead to energy U=(ALσ²)/(2Y)=**60.75 J**, versus printed 12.15 J.
- **Numerical 7.5 — compulsory units/diameter mismatch.** Printed F=500 N, diameter **50 cm** give σ=F/[π(d/2)²]≈**2.546×10³ Pa**, versus printed 2.5×10⁵ Pa. Diameter **5 cm** would produce ≈2.546×10⁵ Pa, but is **hypothetical**, not the original printed question.

These findings **retain V177 and V193 classification**: 7.1 conditionally reproducible, 7.2 consistent, 7.3–7.5 inconsistent. The teacher draft explains assumptions, units and model limitations; no original publisher statement or previously preserved source row is edited.

## Force–extension graph: printed NBF p122 and p123

NBF Figure **7.14**, printed p122, places **weight/force horizontally and extension vertically**. The standard work-area statement uses **force vertically and extension horizontally** because work is \(W=\int F\,dx\). For a general reversed-axis curve, the area is \(\int x\,dF\), not generally the stretching work. In the **linear, zero-start Hookean triangle** of the textbook illustration, both triangles have numerical area \(\tfrac12 Fx\), so the stated triangular work value is valid in that special case. The new original chart in the private teacher guide makes both conventions visible. A teacher must confirm the explanation before student marking guidance is amended.

## Academic signoff and release boundary

**No independent subject teacher has submitted or authenticated a decision.** The private draft's checkbox and signature lines remain blank. Even if a paper is later signed, separate technically authenticated reviewer decisions, exact revision binding, verified backend Rules/App Check, owner permission and scored-release authorization would still be required for live scored Test Builder questions.

Current counts: **274** original Unit 7 items inventoried, **72** detailed private review candidates, **0** authenticated science/cognitive decisions, **0** owner scored-release decisions, **0** scored Unit 7 MCQs. Earlier source-backed Q25 V189/V192 private draft is preserved, not changed. V160 production and V161 production/staging teacher-backend gates remain **NO-GO**. Neither Firebase, security rules, teacher roles, student data, App Check, original books, existing question bank nor live lessons have changed.

## Exactly four additive public files

1. `quality/unit07/unit07-v194-teacher-solution-draft-provenance-no-keys.json`: private Word/PDF SHA, page/figure/number alignment and unchanged teacher hold.
2. `quality/grade11-v194-unit07-private-teacher-solutions-qc.md`: this original-source academic guide and status.
3. `scripts/audit_grade11_unit07_teacher_solution_qc_v194.cjs`: independent arithmetic verification, no-secret/no-release schema, legacy V193 and V177 source-regression checks, negative mutations.
4. `.github/workflows/validate-grade11-v194-unit07-private-teacher-solutions.yml`: V194 checks + earlier teacher/summative-source, Grade XI original bank, Unit6 teacher signoffs and backend/App Check no-deploy regressions.

**Owner merge protocol:** wait until both latest-head GitHub workflows GREEN, review four Files changed, select Ready for review → Merge pull request → Confirm merge. **V195** should seek a real subject-teacher review of the private reference draft; amendments to student-facing or teacher-facing content require explicit version-controlled decisions and cannot be inferred from this draft's existence.
