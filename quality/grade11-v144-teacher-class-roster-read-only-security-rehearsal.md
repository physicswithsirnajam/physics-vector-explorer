# V144 — Scoped, read-only teacher classes and roster rehearsal (not a live portal)

## Prerequisite and scope

PR **#243/V143** was merged with **2/2 latest-head checks green** on 24 November 2026. V143 uses real local Firebase Auth/Firestore emulators to rehearse administrator-only promotion of existing verified users into teachers, creation of two draft classes, intentional student assignment and membership revocation. It is OFF by default and neither issues production credentials nor deploys a service.

The owner wants the eventually live teacher dashboard to show only the teacher's classes and their explicitly attached students, while **independent learners remain outside teacher rosters**. Teachers must not add/remove students or view independent private attempts. Front-end hiding cannot protect publicly hosted GitHub Pages resources or override Firebase Admin SDK permissions.

V144 introduces **two read-only, server-owned projections**, without enabling a web endpoint:

| Operation | Required caller | Minimal returned fields |
|---|---|---|
| `listOwnClasses({authorization})` | Verified, enabled teacher with CURRENT `teacher:true` claim, no `admin:true`, active server-owned `teacherDirectory/{uid}` | **Only** that teacher's draft classes: class ID, title, Grade XI, draft status and count |
| `getClassRoster({authorization,classId})` | Same teacher; class document's `teacherUid` must exactly match current caller | Class ID/title/grade/status plus **only** `assignedStudentUids` and assigned count; revoked members excluded |

**Not returned/read:** private `users/{uid}` profiles, phone numbers, emails, result sheets, personal practice/attempts, test answer keys, guardian data, teacher audit logs, or another teacher's roster. Display names are intentionally absent in this first security rehearsal; an eventually readable teacher-facing roster needs separately approved minimal identity fields.

### Every request is independently authorized

`server/local-teacher-classroom-reader-v144.cjs` is restricted to the exact **demo-psn-v143-classrooms** project and localhost Firebase Auth+Firestore emulators and refuses service credentials. It has **no** Cloud Function, HTTP/callable handler, browser import or real deployment. The trusted enable callback defaults to `false`.

On each call, the service:

1. Requires the explicitly enabled **trusted server-side** switch and a strict request field allowlist.
2. Validates a real Firebase ID token with `verifyIdToken(token,true)`, its issuer, audience, subject and UID.
3. Requires verified email and teacher claim, excluding browser admins; refreshes the actual Firebase Auth account using `getUser` to block stale-role, disabled or unverified accounts.
4. Reads the server-owned teacher directory, requiring an active record bound to the exact caller UID. **A self-asserted `role=teacher` parameter is ignored/rejected.**
5. Limits class and roster reads to strict caps (**10 draft classes**, **50 member documents**); malformed records or extra pages fail closed rather than returning partial data. Every class must be owned by the caller; a missing class and someone else's class give the **same** `class-access-required` error.
6. Returns only explicit, immutable safe projection fields and safe fixed error codes. No raw Admin SDK snapshots, arbitrary student notes or credential-bearing errors are forwarded.

The reader does **not** grant the browser permission to read `classes` or `teacherDirectory` directly. V142's existing Rules fixture continues to deny client get/list/write even for synthetic teacher/custom admin claims. Firestore Admin SDK bypasses Rules, so this server-side check is mandatory.

### V144 adversarial integration evidence

`scripts/test_grade11_v144_teacher_own_class_reader.cjs` uses V143's actual local Admin SDK operations to create **two synthetic teachers**, **two separate draft classes**, and one verified student membership per class, plus one independent learner intentionally unassigned. It tests:

- The service is OFF by default; malformed, forged extra-field, unsigned, student, administrator, unverified and unauthorized claims are rejected.
- Teacher One lists only C1 and sees only its explicitly assigned student; Teacher Two lists only C2 and its student. Nonexistent classes and another teacher's classes are indistinguishable denied cases.
- Fake sensitive data is placed in synthetic `users/studentA` and `users/studentA/attempts/secretAttempt`; no sensitive field, exam result or private history appears in either returned projection.
- The *admin* revokes membership A/C1; teacher one immediately receives an empty active roster, while Teacher Two's C2/B membership remains visible. Teachers never receive a way to revoke anyone.
- After **current** teacher claim revocation, disabled Auth account, directory status revocation or administrator-owned class reassignment, previously issued tokens do not grant the old classroom view.
- Tampered membership document identities cause a clean deny, not a widened or partial roster.
- Signed-out, both students, both claimed teachers and a claimed admin attempt browser Firestore get/list/write on C1/C2: all denied by the unchanged V142 policy.
- Class reads have **no Firestore write side effects**; original 2,250 Grade XI public MCQ source counts remain 275/206/220/640/349/560, and all 560 Unit6 academic signoffs remain **PENDING**.

The downloadable Actions artifact includes only aggregate synthetic counts, test scope and nonrelease flags—not real student UIDs, emails, passwords, hidden data, tokens, question text, report contents or private Rules.

## Known limitations and next teacher portal work

These are **synthetic read-only server actions**, not a published teacher account/dashboard. A teacher cannot yet sign into a working portal and browse a roster, assign a test, or see results. No production rules/claims, classroom memberships, student result saving or Firebase service were changed.

A later launch requires the owner's live Firebase Rules snapshot comparison, secure trusted backend hosting, admin-owned provisioning and revocation tools, authenticated teacher identity and class isolation tests under the deployed environment, minimal student-display-name policy, teacher assignments, secure student-owned combined-unit attempt saves, and SLO-based progress calculation. **Independent self-practice history should not automatically become teacher-readable.** Public GitHub-hosted worked keys cannot be the secret answer source for graded high-stakes school exams.

The V144 teacher viewer's revocation checks are strong, but a role change concurrent with an in-flight read cannot retroactively cancel a response; real deployment additionally needs operational session/token revocation and monitoring.

## Exactly four new files

- `server/local-teacher-classroom-reader-v144.cjs` — local-only read-only service.
- `scripts/test_grade11_v144_teacher_own_class_reader.cjs` — actual local SDK/emulator positive and negative tests.
- `.github/workflows/validate-grade11-v144-teacher-own-roster-reader.yml` — pinned emulator suite; reruns V143 role provisioning, V142 original private full-policy deny suite, V99i original MCQ identities, V94D teacher approvals and V99T published-rules guard.
- This quality and teacher rollout note.

Keep **PR #244 Draft** until both latest-head checks pass; any red check must be repaired on the same branch before merging. The owner then reviews four files and selects **Ready for review → Merge pull request → Confirm merge**. No Firebase Console changes, real teacher accounts or student roster uploads are needed for V144.
