# V143 — Administrator-only teacher/class provisioning rehearsal (real local Firebase emulators)

## Verified starting point

PR **#242/V142** was merged and **2/2 latest-head GitHub checks passed** on 24 November 2026. That milestone added an **undeployed** scoped Firestore Rules fixture and demonstrated **484 synthetic browser-access DENIALS plus two existing student-owner read controls**. These checks protect six prospective class/teacher collections from browser-side access but do not, alone, create teacher accounts or a working classroom dashboard.

The owner wants to create/authorize teachers and attach existing learners only from an **administrator-controlled backend**, while the teacher can eventually assign tasks and inspect only their own class. A self-registered independent learner must remain outside any class unless the administrator explicitly attaches the verified Auth UID. Passwords/credentials must **never** be stored in Firestore or source control.

## V143: a real Firebase Admin SDK rehearsal, NOT a production backend

`server/local-classroom-provisioner-v143.cjs` implements four deliberately disabled-by-default operations:

| Trusted administrator operation | Input shape | Intended state change |
|---|---|---|
| `provisionTeacher` | Verified admin bearer token + existing `teacherUid` | Validate the target's already-existing verified, enabled Auth account; create a pending teacher directory record; apply trusted Auth `teacher:true` custom claim without removing unrelated existing claims; activate directory with an audit entry |
| `createClass` | Admin token, `teacherUid`, distinct `classId`, safe `title`, `grade: 11` | Validate current teacher claim and active directory; create a **draft** class with a single approved teacher and audit log |
| `attachStudent` | Admin token, `classId`, existing `studentUid` | Validate a verified, enabled non-teacher student with their own active Grade XI `academicEnrollments/{uid}`; create a class-only membership, no public enrollment or attempt history modification |
| `revokeStudent` | Admin token, `classId`, `studentUid` | Replace an assigned membership with revoked status and audit it; unrelated class membership is unaffected |

**Trusted authority:** Each operation checks that the explicit server-controlled enable callback returns `true` (defaults `false`), rejects non-demo projects and nonlocal Auth/Firestore emulator endpoints or a production service account, verifies a real Firebase Auth ID token via **`verifyIdToken(token,true)`**, checks issuer/audience/subject, `email_verified`, strict trusted administrator UID allowlist, and current **`adminAuth.getUser`** status/claim for stale-token or disabled-user revocation. The browser cannot supply UID, admin role or teacher status as a substitute for that server check; unrecognized request fields are rejected.

**Server-only data:** Uses the previously proposed V142 collection names (`teacherDirectory`, `classes`, `classes/{classId}/members`, and `teacherClassAudit`) via Firebase Admin SDK transactions. This SDK bypasses client Rules, making independent backend authorization essential. It never creates passwords, invitation links, emails, live accounts, callable/HTTP endpoints or a deployable function. Future real account invitation/password setup needs a separately reviewed admin-only workflow.

**Fail-closed partial teacher promotion:** Teacher provisioning first writes a `pending-claim` directory document, next issues the Auth custom claim, then changes the directory to `active`. If Auth or the final Firestore update fails, the directory stays pending rather than becoming an active teacher record. That failure needs explicit admin reconciliation in a later phase; V143 intentionally refuses silently retrying a partial teacher operation. We must never treat a lone custom claim as sufficient for teacher-class access.

**No classroom access yet:** Both draft classes and assigned membership remain protected by V142's client `DENY` rules. A teacher **still cannot view classes or students**, and **cannot create/revoke membership**. This is an intentional precursor to a separately secured read-only teacher view that checks BOTH the fresh current teacher claim AND server-side teacher ownership and roster. Releasing a teacher dashboard based only on email or a profile field would violate the owner's requirements.

## Real local integration and adversarial tests

`scripts/test_grade11_v143_local_classroom_provisioning.cjs` uses the actual **Firebase Admin Auth SDK, client Firebase Auth SDK, Firebase Auth emulator, Firestore Admin SDK and Firestore Rules emulator**, with only synthetic accounts and no production keys. It tests:

1. A disabled-by-default service cannot create a teacher directory entry.
2. Only a **verified, enabled, allowlisted admin** can provision an already-verified user as a teacher; a student, teacher, unverified learner, another non-allowlisted admin, malformed request, or self-provision target cannot.
3. Two synthetic teacher accounts receive genuine emulator `teacher:true` custom claims, with corresponding active directory records.
4. The administrator can create two separate draft classes C1/T1 and C2/T2, and attach Student A only to C1 and Student B only to C2. Duplicates, missing classes, forged inputs, unverified accounts and teacher-as-student attempts are rejected.
5. Only the admin can revoke Student A's membership; Student B's C2 membership remains assigned. A revoked membership does not automatically re-enroll.
6. Changing the current admin custom claim to `admin:false` rejects a previously minted stale admin token. Disabling the admin account also rejects it. Revoking a teacher's current Auth claim blocks creation of another class despite an active directory record.
7. Real Firestore client SDK requests by signed-out, both students, both claimed teachers and claimed admin are denied on teacher directories, class records, memberships, assignment/submission paths and audit logs, including read/list/write attempts. The Admin SDK alone uses its trusted path.
8. The stored teacher directory and audit records contain no raw email, passwords, tokens, or student scores. Existing Grade XI MCQ source manifest remains **275/206/220/640/349/560**, original source hashes remain unchanged, and Unit6's **560 per-question teacher signoffs remain PENDING**.

The automated evidence is counts/booleans only. Synthetic email/password values are test-only and are **never included in the artifact**.

## Limits, security review and rollout order

This PR is **not** equivalent to deploying a teacher portal, nor does it independently fetch current published Firebase Rules. The existing private 227-line Rules and V142 deny-by-default emulator gate remain separate and must be preserved. The user's verified teacher accounts and students must not be provisioned through this disabled-by-default local rehearsal.

**Before enabling real teacher workflows:** obtain owner-approved trusted backend hosting, compare live Console Rules to the pinned private baseline, configure Admin SDK credentials securely outside GitHub or page source, require authenticated App Check/replay and abuse protections as appropriate, enforce admin allowlists and revocation, create a safe emailed invitation/password reset process without storing plaintext credentials, define explicit class read projections with cross-class negative testing, and establish audit, privacy, retention and incident response.

In a later milestone, authorize a **read-only teacher-specific roster and assignment summary** through the trusted backend only. Teachers should never acquire unrestricted access to students' independent `users/{uid}/attempts` data, even if they teach that student; the allowed classroom result fields must be explicit and auditable. Then add assigned tests, saved combined-unit attempts and genuine teacher issue reports.

## Files and merging

Four new files only:

- `server/local-classroom-provisioner-v143.cjs`
- `scripts/test_grade11_v143_local_classroom_provisioning.cjs`
- `.github/workflows/validate-grade11-v143-local-classroom-provisioning.yml`
- This document, `quality/grade11-v143-admin-provisioned-teachers-classrooms-rehearsal.md`

No production Firebase settings, deployed Rules, teacher/student accounts, protected graded examinations, existing quiz questions, original answers or learning portal UI are changed.

**Owner:** Leave PR **#243** in Draft until all exact-head checks are green. On red, do not merge; the same branch will be repaired. When green, review four nonproduction files and select **Ready for review → Merge pull request → Confirm merge**. **No Firebase Console changes or user credentials are required** for this step.
