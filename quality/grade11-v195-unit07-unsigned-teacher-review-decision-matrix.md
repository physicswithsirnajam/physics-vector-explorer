# V195 — Independent teacher decision pack for source-verified Unit 7 numerical corrections

**PR #298/V194 confirmed merged** into `main` at `646cdef9fc269a1f638f5ae9a6d0b3039a80c4c3`.

**V195 is practical teacher-review preparation, NOT academic approval.** The six-page V194 teacher solution guide was reopened directly and its DOCX/PDF SHA values were verified. Printed NBF page **126** was reviewed again against the uploaded textbook image, and the source-verified 7.1–7.5 findings were retained without changing a publisher value or giving a student scored answer.

## What is different from V194

The V193 complete-textbook PDF source audit and V194 long-form worked guide established the printed page and arithmetic basis. The long V194 guide already contains detailed calculations. Rather than duplicate it, V195 creates a **two-page A4 landscape independent-teacher decision pack**, rendering and checking both pages:
- Page 1: a compact **five-row side-by-side matrix** showing book printed hints, calculated source-based values, issue category and required review. It also states that `W=∫Fdx` applies as area when force is vertical versus extension horizontal; the original textbook Fig **7.14** reverses those axes, and `Fx/2` is valid in the linear, origin-starting case.
- Page 2: **blank independent reviewer identity/date/source-edition fields**; decisions for five numericals and graph axis explanation; reviewer notes, outcome, and explicit warning that a signed paper is evidence of a human review but **not Firebase Auth / App Check / server-logged or scored-release authorization**.

The newly prepared private files are:
- `Unit7_V195_Independent_Teacher_Decision_Pack_UNAPPROVED.docx`, SHA-256 `0d207e5a02b888c942dc171438d96266b74b6f3809e0e9658d2e266e2c1b8ff5`.
- `Unit7_V195_Independent_Teacher_Decision_Pack_UNAPPROVED.pdf`, SHA-256 `03e18c10306c3936ca6804bd7303e851c07bca95caa048f88ae05b06a63a42d9`.

**Privacy:** these files are provided only as private chat deliverables, never committed in GitHub. The public PR includes only the private artifact filenames/hashes and the already source-verified numerical metadata. The two original complete Unit7 scans, original owner source questions, full answer keys and source images are unchanged.

## Source-audited teaching guidance awaiting independent decision

| Printed page 126 problem | Original hint | Result from stated source data | Status |
|---|---|---|---|
| 7.1 | 5.2 kg | ≈5.19 kg using book Table 7.1 **shear modulus** (not printed Young modulus); direct insertion of Young would give ≈12.98 kg but wrong deformation law | **COMPULSORY** model and modulus explanation |
| 7.2 | 2.29 mm | 2.291 mm | **CONSISTENT**; review confirms no correction |
| 7.3 | 2.79×10⁻⁴ m and 11.02 mJ | ≈1.3476×10⁻³ m and 42.55 mJ from printed brass `Y=10¹⁰ Pa` | **COMPULSORY** note original contradiction |
| 7.4 | 12.15 J | 60.75 J using `U=ALσ²/(2Y)` | **COMPULSORY** numerical correction guidance |
| 7.5 | 2.5×10⁵ Pa | ≈2.546×10³ Pa with printed **50 cm diameter** | **COMPULSORY** note diameter vs hint |

For **Fig 7.14** (p122), original axes put force horizontal, extension vertical. The general area for work requires force vertical against extension horizontal. The original linear right triangle gives the same numeric `Fx/2`; do not falsely label it universally correct for a nonlinear reversed-axis plot.

All above results are **science/mathematics audit findings, not final examiner or marking policy**. If a student follows the uncorrected printed question, only an authorized teacher/examiner can decide how to award credit for alternate methods. The source data, original printed hint and hypothetical changes must always be clearly distinguished.

## No-release boundary and what we still require

A human science/cognitive reviewer has **not** completed the V195 decision sheet. All six decisions are **PENDING / unselected**. No person, teacher role, date, signature or institutional approval was fabricated. A future reviewer may select `Accept for owner consideration`, `Revise explanation`, or `Hold for evidence`; those are **offline recommendations**, not automatic changes to the portal.

Existing Unit7: **274 original source identities, 72 private detailed candidate drafts, 0 authenticated teacher science/cognitive approvals, 0 owner scoring authorizations, 0 scored Unit7 questions**. V160 and V161 teacher-backend production/staging remain **NO-GO**. No Firebase/Auth/Firestore Rules/App Check, teacher claims, student records, Test Builder, public source bank or original NBF pages were modified.

### Four additive public nondeployment files
1. `quality/unit07/unit07-v195-unsigned-independent-teacher-review-no-keys.json` — keyless identity/source metadata and all decisions blank.
2. `quality/grade11-v195-unit07-unsigned-teacher-review-decision-matrix.md` — this teacher-facing evidence and next-step guide.
3. `scripts/audit_grade11_unit07_teacher_decision_pack_v195.cjs` — arithmetic/fail-closed checks for source figures, six blank decisions, zero approvals and no-score regression.
4. `.github/workflows/validate-grade11-v195-unit07-unsigned-decision-pack.yml` — V195 and earlier V194–V154, Unit6, backend App Check holds.

**Next V196:** a real independent teacher reads the original textbook, V194 worked guide and this V195 decision sheet; only then should requested explanations be amended in teacher-facing resources. Even then, student-scored import requires separate authentication, exact revision binding, backend security checks and owner approval.

**Merge:** keep the PR Draft until **both latest-head checks GREEN**. Inspect four changed files, then Ready for review → Merge pull request → Confirm merge. No Firebase or billing step is required.
