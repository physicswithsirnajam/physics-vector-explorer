# V196 — Unit 7 numerical scaling and graph-coordinate regression safeguards

**Verified prerequisite:** PR #299/V195 merged into `main` at `aed5f150a5dc5287e1da18769cebbbffdd200339`.

**Disposition: numerical and unit-consistency regression only — real teacher decisions PENDING, all scored Unit 7 questions HOLD.** Our two-page V195 independent teacher decision pack has not been returned with signed, checked decisions. We cannot invent an academic signoff, marking rule, reviewer account or Firebase authentication. Instead, V196 makes the mathematical assumptions of the previously source-audited teacher guidance testable under small changes to inputs.

## Specific source connection and scientific cautions

The primary evidence remains the two NBF **Unit 7** PDF uploads examined in V193 (15 pages each, original printed p113–126), the full private **V194** teacher worked solution draft, and the unsigned **V195** decision matrix. Source textbook p119 lists the moduli, p122–123 has Figure 7.14 and the force-extension/strain energy discussion, and p126 has numerical questions 7.1–7.5.

| Original problem | Regression invariant tested | Source / academic limit |
|---|---|---|
| **7.1 nail shear** | For an idealized uniform shear proxy, estimated apparent mass scales with shear modulus **G**, diameter squared, deflection, inverse shear depth and inverse g. Doubling diameter gives fourfold mass. | The printed question names Young's modulus; it must **not** be silently treated as shear modulus. The simplified proxy also does **not** model genuine bent cantilever mechanics. Teacher review compulsory |
| **7.2 equal extension** | If length, force and elongation are common, second diameter scales as square root of the first-to-second Young modulus ratio | Published **2.29 mm** remains mathematically consistent |
| **7.3 steel + brass** | Upper wire supports both masses, lower supports only hanging lower mass; elongation and elastic strain energy are computed separately and summed. Increasing brass Young's modulus by 10 divides only brass's contribution by 10 | Preserve the printed `1.0×10¹⁰ Pa` for brass. The hypothetical `10¹¹ Pa` is a diagnostic, not a publisher correction. Hint mismatch remains compulsory teacher review |
| **7.4 strain energy** | For stress-based energy, `U = A L σ²/(2Y)`; doubling stress gives fourfold energy, doubling area or length doubles energy, doubling Young's modulus halves it | With book values result is **60.75 J**, not 12.15 J. No automatic marking approval |
| **7.5 tensile stress** | `σ=4F/(πd²)`; doubling force doubles stress and doubling diameter reduces stress fourfold | **50 cm** printed diameter gives about **2.546×10³ Pa**, while a **hypothetical 5 cm** diameter gives 100 times higher stress. Avoid cm/m conversion errors |

**Units:** Each function requires explicit SI field names (metres, square metres, pascals, newtons, kilograms, joules). Unexpected `diameterCm`, `crossSectionMm2`, `youngModulusPa` in a shear call, missing data or malformed values fail closed. This helps prevent mistakes but a green test is **not** a substitute for real source or scientific judgment.

## Force-extension graph: a falsifiable nonlinear example

The printed NBF Figure 7.14 has **force/weight horizontally**, **extension vertically**. In the usual work-area graph, extension is on the horizontal axis and force on the vertical axis:

[
W = \int_0^X F(x)\,dx.
]

When coordinates are reversed, the geometric under-curve area is instead `∫x dF`. For a **linear, zero-start Hookean** relation `F=4x` up to `x=3`, both integrals equal **18** (in consistent units), explaining the textbook's special triangular result. But for a **nonlinear** illustrative relation `F=2x²` up to `x=3`, actual work is **18**, whereas the reversed area is **36**. Thus treating a reversed-axis area as work for arbitrary shapes is false. This test is an abstract dimensional/scaling illustration, **not a claim that the textbook's spring becomes nonlinear**.

## Public code and validation boundaries

V196 adds **five public files**, with no original question text/answers or private source scans:

1. `scripts/unit07_numerical_scaling_v196.cjs` — pure deterministic SI physics helpers with no keys, authentication or student scoring.
2. `scripts/test_grade11_unit07_numerical_scaling_v196.cjs` — original-source numeric checks, scaling perturbations, malformed-input denials, nonlinear graph counterexample and unchanged teacher/scoring holds.
3. `quality/unit07/unit07-v196-numerical-scaling-regression-hold.json` — exact source-review status and no-release contract.
4. `quality/grade11-v196-unit07-numerical-invariants-teacher-hold.md` — this teacher-readable scientific and limitations note.
5. `.github/workflows/validate-grade11-v196-unit07-numerical-scaling.yml` — new tests plus V195–V154, original Grade XI 2250 pinned MCQs, Unit6 560 signoff, V160/V161 and App Check/reporting protections.

The public CI tests use numerical source data already examined in V193. They **do not** import the original publisher scans, the private Word/PDF answer guide, individual revised candidate SHA values, authenticated teacher decisions, or actual student submissions. The original source bank, portal, Firebase Auth, Firestore Rules, App Check and production/staging are unchanged.

**Release status remains NO-GO.** Unit7 has **274** original inventoried source identities, **72** detailed private candidate reviews, **0** authenticated teacher science or cognitive approvals, **0** owner scored-release permissions and **0** scored student MCQs. Even the correct problem **7.2** remains outside the scored Unit7 builder until teacher/owner approval and the backend gates are satisfied.

## Next V197 and owner merge

An independently completed V195 teacher decision pack will allow actual academic disposition of problems 7.1, 7.3, 7.4, 7.5 and the graph explanation. Until then, rather than multiplying empty approval forms, the next useful **V197** can return to a small fresh batch of original Unit7 MCQ/source quality control with the verified NBF teaching pages, while maintaining **PENDING / HOLD**.

For this PR: wait for **both latest-head workflows GREEN**, inspect all five Files changed, choose Ready for review → Merge pull request → Confirm merge. No Firebase or student portal action is needed.
