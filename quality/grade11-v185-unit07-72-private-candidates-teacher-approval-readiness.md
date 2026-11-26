# V185 — Unit 7: 72 private candidates, first protected teacher-approval readiness contract (NO DEPLOYMENT)

**Decision: DESIGN/REVIEW ONLY — NO AUTHENTICATED ACADEMIC APPROVALS, NO LIVE TEACHER BACKEND, ZERO SCORED UNIT 7 ITEMS.** V185 deliberately changes direction from accumulating more private proposed candidates to making academic decisions actionable and auditable before any student assessment import. It is **not** a teacher-signoff PR.

## Source provenance and scope

- PR **#288 (V184)** was confirmed merged at `cef60e7ae19d781f2e7f86f5de25603fd2d5d29d`.
- V179–V184 each prepared twelve privately stored MCQ candidate reviews from the owner's original three Topic 7 banks. **72 distinct question IDs** are registered across those six already merged public keyless ledgers. V178 inventoried the wider Unit7 source universe of **274 original identities**. All compulsory-priority *source rows* in the three 80-question topic banks were **selected** for a private review candidate by V184; **selection is not scientific resolution or final academic approval**.
- **202 of 274** original Unit7 items have no separate private candidate review pack yet. Textbook exercises are part of the original 274 count but were not added to the 72 owner-authored MCQ private packs. None of these numbers represents the count ready to score.
- The V185 ledger recombines **existing exact original row SHA-256 fingerprints** and source-prefixed IDs, with each item's prior private-pack filename and **whole-file** SHA. It **does not** include the original stems, answer alternatives, keyed explanations, revised candidate wording or any personally identifying reviewer/student records. A whole-DOCX checksum is **not** a per-item candidate revision fingerprint; even the 72 reviewed private packs still need canonical individual candidate revision hashes before audit-safe signoff.

## Practical private working worksheet

A **7-page landscape Word worksheet** `Unit7_V185_Teacher_Approval_Readiness_Workbook_PRIVATE.docx` (SHA-256 `3f163418817efe30ee7e6493e030ea1b49cef0668faf9c3e389f9ab69ab6c949`) accompanies this PR through **private chat download**, never GitHub. It has a one-page procedure and one 12-source-ID page for each of six private batches, with **empty** check columns and notes: exact source/key, independent physics and distractors, exact FBISE summative SLO and actual cognitive demand, self-contained stimuli/figures, review decision and next action.

**A mark on the private worksheet is not authenticated approval.** The owner can review against the separate six private source-answer packs; the worksheet is a helpful offline working record. Later, a protected backend must authenticate a responsible reviewer and associate approvals with the **exact immutable candidate revision**, not merely the old source number, a checkbox or a GitHub merge. Do not publish the marked worksheet or private source packs to the repository.

## V185 release preconditions (all required, none bypassable)

1. **Exact immutable candidate:** preserve original source fingerprint, choose a particular *separate* candidate stem/options/key/explanation/diagram revision, canonicalize and hash that candidate privately. All **72 per-item revision digests are currently missing**; recording only the whole private DOCX checksum cannot authorize a particular candidate.
2. **Independent scientific verification:** one defensible answer for each MCQ, independently checked complete solution, correct SI units, physically valid assumptions and three distinct plausible distractors. Some previous source answer letters are defensible in study context but the standalone revised candidate is still unapproved.
3. **Source and licensing checks:** textbook images, externally referenced examples and diagrams must be verified, permission-cleared, readable on mobile/projector, and self-contained. Existing known source dependencies include original NBF printed **p114**, printed **p115**, and original **Example 7.2**. Topic7.3 Q3 also needs an accessible independently usable Fig7.13-type apparatus stimulus (not unlicensed copying).
4. **FBISE summative theory:** assign the correct named official SLO and actual **K/U/A** demand to the candidate itself. In this unit, distinguish named **P-11-B-24** Young-modulus Application from supporting shear/bulk calculations, and **P-11-B-27** force–extension graph area/work Application from supporting stiffness-slope recall. Bulk/shear-modulus supporting questions, drawn cubic-cell counting, graph slope, and formula recall cannot silently count as direct Young-modulus or graph-area Application if they do not test the required outcome.
5. **Review ownership:** enforce individual, authenticated, role-controlled, version-bound teacher science and teacher cognitive decisions and an **independent owner-controlled scoring permission**. Store reviewer identity, evidence, timestamp, prior/current revision and immutable audit events **server side only**; no public GitHub approval flags or mutable student-supplied claims.
6. **Release infrastructure:** owner explicitly approves staging/backend architecture, billing/hosting implications and deployment. V160's **NO_GO_DEPLOYMENT_BLOCKED** and V161's **NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT** remain authoritative. Verified published Firestore Rules, genuine live App Check, current teacher-role provisioning/revocation and CORS/auth/CSRF controls are not established by this PR.
7. **Per-item fail closed:** an unreviewed original, changed candidate digest, unapproved source image, stale teacher permission, missing scoring authorization or failed live security gate all result in **HOLD**. A green CI pass is only an audit of declared public metadata, not academic signoff.

## What the 72-keyless readiness register means

Each row holds source ID, earlier immutable *original* row fingerprint, original question number/topic, private-pack SHA/file, previous provisional science/SLO/cognitive notes, any explicitly known original book evidence concern, and **PENDING** science, cognition and scoring statuses. It deliberately stores `candidateIndividualRevisionSha256: null` for **all 72** and `eligibleForStudentScoredUse: false`. The first is a concrete missing technical prerequisite: we cannot accurately bind a teacher verdict to a private revised question without it. Later protected services must refuse stale or changed revisions and preserve audit records on decision revocation.

The known source-page exception count is **11** source IDs: four p114 polymer-attribution examples, five p115 cubic-unit-cell-related source IDs, one Example7.2 problem, and one source-apparatus-image issue. **This is not a complete source-evidence clearance list**, and `NO_SPECIFIC_OPEN_BOOK_PAGE_ATTESTED_IN_INDEX` must never be interpreted as verified or approved.

## Exact V185 changes

**Four additions only**, zero changes to student runtime or original content:

1. `quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json`: consolidated 72 keyless source identities with unresolved per-item revision digests and explicit secure-approval/release blocks.
2. `quality/grade11-v185-unit07-72-private-candidates-teacher-approval-readiness.md`: this owner-readable decision contract.
3. `scripts/audit_grade11_unit07_teacher_readiness_v185.cjs`: recompute the exact V179–V184 72 IDs, original full-row hashes/private-pack hashes and source exceptions, verify empty candidate digests, run intentional fail-closed mutations and preserve earlier Unit7/Unit6/live NO-GO safeguards.
4. `.github/workflows/validate-grade11-v185-unit07-teacher-readiness-no-deploy.yml`: focused academic readiness CI plus all earlier source, backend, and App Check no-score regressions.

No original Word question bank, candidate pack, source scan, private answer, student data, reviewer directory, Firebase Rules or roles, API, billing, staged/production deployment, graded Test Builder bank, or existing Grade XI 2250 MCQs are edited. The current first 72 candidate records have **zero independent teacher science/cognitive/scoring signoffs and zero scored releases**.

## Next V186

Prove a **per-item immutable candidate fingerprint and teacher decision protocol in an isolated test/emulator environment**—not production—to bind each private candidate revision to a future authenticated review and enforce revision-staleness, approval-revocation, and no-score gates. Keep the owner in control of any later decision to enable hosting, roles, billing or staging deployment. The 202 remaining original Unit7 source identities can continue in small academic review tranches, but more drafted candidates alone should not be mistaken for validated released content.

**Owner review:** this PR remains Draft until all latest-head checks pass GREEN. Review exactly four nondeployment files → Ready for review → Merge pull request → Confirm merge. If red/pending/stale, do not merge. The private worksheet is for review notes and must not be uploaded to public GitHub.
