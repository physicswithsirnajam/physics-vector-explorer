# V142 — Teacher/classroom backend: fail-closed Security Rules compatibility gate

## Starting point and why classroom data needs server-side authorization

**PR #241/V141** was merged on 24 November 2026, with **42/42 latest-head CI checks green**. The authenticated portal dashboard now displays the verified account's top-right menu (My Profile, My Progress, Sign Out) and does not grant new teacher roles.

The owner's requirement is more demanding: **only an administrator creates teacher accounts and attaches selected college students to a particular teacher's class; the teacher sees only assigned classes and permitted student work; independent learners remain separate; students cannot view classmates' data, and teachers cannot add/remove membership.** Tests should eventually be assignable, submitted and summarized by teacher, but a teacher's browser must not control role grants or access arbitrary user history.

This milestone is **a security baseline, not a teacher-portal launch**. The public GitHub Pages shell is unable to protect publicly hosted original answer keys using a login popup alone.

## Source-grounded existing security and explicit uncertainty

I inspected the checked-in V99-C / V99-D / V99-S / V99-T Firestore emulator work and the current V141 portal. The repository intentionally does **not** contain a deployable `firestore.rules` or `firebase.json`; it relies on an existing **private owner-supplied 227-line full Rules baseline** supplied to GitHub Actions via encrypted secret `PSN_FIRESTORE_BASELINE_RULES`. The SHA-256 after normalizing newline differences is:

`c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39`.

The baseline includes original student profiles, enrollment, owner-owned practice history, lessons, privacy controls and the `verifiedAdmin()` rule function. V99-S already demonstrated how to append new server-only paths without replacing original policy bytes. The owner-attributed original baseline **is not itself proof that the currently published Firebase Console rules match**; live readback/owner snapshot attestation must be rechecked before any real deploy.

The existing student `academicEnrollments/{uid}` record is grade/course enrollment, **not** teacher-class membership; do not infer that choosing Grade XI gives a user access to a teacher.

## Six proposed sensitive document paths

Proposed, **NOT deployed**, under a trusted administrator backend:

| Proposed Firestore scope | Intended owner | Current V142 browser policy |
|---|---|---|
| `teacherDirectory/{teacherUid}` | Trusted administrator issues/revokes teacher identity | **Read/write DENY** |
| `classes/{classId}` | Administrator creates class and assigns one approved teacher | **Read/write DENY** |
| `classes/{classId}/members/{studentUid}` | Administrator attaches/detaches students via verified identity | **Read/write DENY** |
| `classes/{classId}/assignments/{assignmentId}` | Future teacher-authenticated assignment workflow | **Read/write DENY** |
| `classes/{classId}/submissions/{submissionId}` | Future authenticated student submissions and teacher review | **Read/write DENY** |
| `teacherClassAudit/{entryId}` | Trusted backend immutable authorization/roster change audit | **Read/write DENY** |

For the moment, **even `teacher:true` custom claim and `admin:true` browser sessions get DENY** on these new paths. This intentionally prevents an accidental wide grant before a trusted role-provisioning endpoint and scope-specific read DTOs exist. Privileged Admin SDK access bypasses client Security Rules and therefore must enforce separate strong authentication, class ownership, field allowlisting, audit records and rate limits. The client cannot self-award a teacher flag or add students.

### V142 implementation

1. `security-proposals/v142/teacher-classroom-isolated.rules` — **standalone emulator-only fixture**. Six scoped `allow read, write: if false;` blocks, plus a catch-all deny. It **must never be deployed as the user's complete Firebase Security Rules** because it omits the existing 227-line portal protections.
2. `scripts/test_grade11_v142_classroom_private_rules_emulator.cjs` — refuse any non-demo project, non-local Firestore host, service-account environment or missing owner private baseline. Validate the original private SHA/227 lines, extract the six exact scoped deny blocks from the fixture, insert them **only before the unique original catch-all**, and assert removing the block returns the original private baseline **byte-for-byte**. Run the isolated fixture and the full owner baseline + additive blocks in the Firestore Emulator.
3. `.github/workflows/validate-grade11-v142-classroom-private-isolation.yml` — pinned Node/Java/Firebase Emulator versions; the original 227-line rules are loaded through the existing encrypted secret only inside the required offline test step. No Firebase deploy, production key, student account, email/password or live database.
4. This decision and future-backend plan.

### Required synthetic actor and operation cases

For each mode, **eight** synthetic actors: signed-out, verified Student A, verified Student B, unverified student, self-declared browser teacher, test token with `teacher:true`, verified test `admin:true`, and unverified test admin. For each of the **six scoped paths**, test **get, bounded list, create, update and delete**. All operations must be **DENIED**.

- Isolated fixture: **240** deny cases.
- Complete private baseline plus additive scope: **244** deny cases (240 classroom denies + four original-data boundary denials).
- Preserve two owner-positive controls: student A can still read **their own existing synthetic profile and historical independent attempt**, and must not read student B's records or vice versa.
- Only the disabled-Rules **emulator seeding context** may create synthetic class/member/assignment/submission records; none is a real student or teacher.
- Fail closed if private baseline is absent, fingerprint changed, original catch-all missing, a proposed collection already exists or a claimed grant is unexpectedly accepted.

**Success proves a deny-by-default emulator compatibility gate, not that real teachers can yet see classrooms, nor that live published Rules were independently verified.** All output artifacts contain only synthetic counts and flags; they exclude private Rules source, credentials, student profiles, MCQ data, and any real user information.

## What the next implementation must do

**V143+ trusted administrator provisioning proposal:** define the administrator-only API for inviting/creating Firebase Auth teachers (never storing passwords in Firestore), setting/revoking trusted teacher claims server-side, assigning a class to the verified teacher UID, and attaching students by their existing Auth UIDs through audited server transactions. The teacher must have **no** direct add/remove class-membership UI or write permission.

**Teacher-class read pathway:** require the teacher's freshly verified ID token (including revocation handling as appropriate), a server-authorized class relationship and explicit field-limited views of student assignment submissions. Test **teacher T1/C1 vs teacher T2/C2**, own versus unrelated student, independent learner, class removal/revocation and signed-out access; enforce those checks on the server, not merely on React/HTML visibility. Avoid allowing teachers to query arbitrary `users/{uid}/attempts` independent histories.

**Student test saving:** extend the current Unit1/2-only result feature to verified combined-unit attempts with deduplication/idempotency and per-question original IDs. Separate self-reported practice from official school grading, and do not reveal secure graded answer keys from public GitHub Pages. Then use eligible saved attempts for SLO recommendations, spaced repetition and meaningful opt-in streak/star/badge/confetti awards.

**Issue review:** current student Copy/Download issue reports do not automatically reach an inbox. A real teacher/admin report queue requires authenticated intake, validation, abuse controls, retention, privacy and class-limited visibility.

### Security acceptance before any live rollout

We require a **current production Rules snapshot comparison**, full original-policy emulator suite, custom claims issuing/revocation test, administrator-only membership change tests, unauthorized cross-class negative tests, data-minimization review, and explicit owner's approval to deploy trusted server endpoints. No college/APSACS student roster, teacher email/password or test records should be inserted from this PR.

## What this PR does NOT change

No live Firebase Rules, Cloud Functions, teacher roles, enrollment membership, teacher dashboard, API sender, student/teacher credentials, login gating of public GitHub Pages, course data or student history. All **2,250 original provisional Grade XI MCQs** and the **560 pending Unit6 individual teacher academic approvals** remain untouched. Teacher features are still disabled; existing independent learner data stays owner-only.

**Owner review:** PR **#242/V142** is a **Draft** until both the exact private baseline emulator run and inherited student safety checks are green. On any failure, **do not merge**; correct this exact branch. When green, review the four files, choose **Ready for review → Merge pull request → Confirm merge**. No Firebase Console change is needed to merge this offline nonproduction security gate. The next PR can introduce administrator-provisioning logic **only after** this safety baseline is merged and checked.
