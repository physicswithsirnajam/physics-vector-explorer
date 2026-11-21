# V99-B — Firebase Firestore Rules Review Gate for the MCQ Teacher Reporting Workflow

## Current verified state — 21 November 2026

PR **#162** merged into `main` at **`50ae9668f875a17afcd71ca6ebbe7fd443ff2df1`**. V99-A introduced an **offline, allowlisted, privacy-minimal report data contract**. It did not change the Practice Engine, create a live teacher inbox, connect Firestore, provision administrator/teacher access, deploy rules or send any student report.

The public GitHub repository contains:
- `portal/firebase-config.js`: existing **public Firebase web SDK configuration**, not a service account secret;
- `portal/app.js`: profile, student progress, academic enrollment, account privacy request and claim-controlled admin views;
- `portal/academic-enrollment.js`: the existing **self-enrollment** path, not a paid/teacher-approved entitlement;
- `portal/attempt-sync.js`: optional Unit 1–2, verified-account, owner-owned self-practice saves at `users/{uid}/attempts`;
- `shared/mcq-review-contract-v99a.js`: **no-network** MCQ review draft/validation;
- `practice-engine/index.html`: **copy-only** MCQ issue report, never delivered automatically.

**Crucially, the repository does not contain a known deployed snapshot of the production Firestore/Storage security rules or privileged account roles.** Source code comments and browser UI can tell us what protection is intended, but **not** what the database actually permits. A public Firebase configuration does not authorize reading live rules.

This PR is **V99-B: a read-only, no-network source inventory**, not an actual Firebase security audit, emulator test or new reporting system. It adds only an inventory script, GitHub Actions workflow and this document. Existing website, question banks, source answers, account settings and deployed configuration remain unchanged.

## How to obtain the live rules safely

**Preferred:** Connect the official Firebase plugin in ChatGPT, authorize the **existing** Physics with Sir Najam Firebase project, and use **read-only inspection** to retrieve the deployed Firestore policy. Connection always requires the project owner's explicit consent. No database writes, rule deployment or account changes should be authorized during this inspection.

**Firebase Console alternative — view/copy only:**

1. Open <https://console.firebase.google.com/> and select the existing project shown in the portal's Firebase configuration (display name may differ).
2. Go to **Build → Firestore Database → Rules**. **Copy** the *current published rules text* and inspect the rules history/version if available. **Do not click Publish** or overwrite the text. This is our first required artifact; no personal database records are needed.
3. If Firebase Storage contains private student content, go to **Build → Storage → Rules** and inspect the current published rules. Public Grade XI resources on GitHub Pages are not made private merely by a signed-in portal UI.
4. Review **Authentication → Users/Sign-in Method** and how trusted administrator custom claims are provisioned, without showing or copying any student identities. The claim value must be assigned by a privileged backend, not the browser.
5. Never send a **service-account JSON**, Firebase CLI refresh token, user ID token, private key, password, or personal student records in a public GitHub issue/PR. Current Firestore rules text can be handled privately in this chat or via an authorized connector rather than automatically committed to public source.
6. Take a read-only backup/snapshot of the exact **currently published** rules *before* proposing changes. Preserve existing profile, attempt, enrollment, privacy and administrator permissions.

## Access-path baseline to protect

| Existing browser path | Current frontend behavior | Actual backend rules still need to prove |
|---|---|---|
| `users/{uid}` | verified learner reads/creates their own profile; admin UI can list recent profiles | owner-only profile access, no student-set admin/role/entitlement; admin-claim listing restricted |
| `users/{uid}/attempts/{id}` | verified owner can save supported Unit 1–2 self-practice and read own history | owner-only reads/writes, allowed shape/size/count, no cross-user access, no forged graded results |
| `academicEnrollments/{uid}` | current pilot Grade XI / FBISE self-enrollment | existing enrollment logic preserved, no client ability to mint paid/teacher-approved access |
| `privacyRequests/{uid}` | verified student requests account deletion review; admin lists pending requests | student create/read limited to own allowed fields; trusted admin only updates/status and listing |
| **Future** `mcqReviewReports/{id}` | **NOT IN USE** | only after rules and moderation backend tests: verified owner creation with server-controlled owner/time/status, no student list/read of other submissions, teacher-only review, anti-abuse limits |

The exact path `mcqReviewReports/{id}` is an **illustrative design candidate**, not a deployed collection. Do not create it until the owner has approved the data model and verified the existing rule snapshot.

## Required denied/allowed cases BEFORE a reporting feature

Run **Firebase Emulator** tests against an isolated test project and a candidate rule delta, based on the retrieved published rules (never replace the existing rules with a guessed template):

1. Anonymous user cannot read/write private account or new report data.
2. Verified learner A can perform only allowed **own** profile, practice and verified report operations; learner B cannot read/change A's data.
3. Unverified-email account cannot create a report or saved practice record where verification is required.
4. Student cannot set `status`, `assignedTeacher`, `ownerUid`, `createdAt` arbitrarily, nor spoof an administrator claim in a browser.
5. Only a **server-assigned trusted claim** can read the teacher report queue and update report status; ordinary students cannot query the entire collection.
6. Existing student profile, enrollment, privacy request and saved Unit 1–2 attempt behaviors still pass authorized tests; a new narrow report rule must **not** weaken or break them.
7. Validate payload shape, source question ID, length limits, and rate/abuse protections independently on the server; the V99-A browser draft contract alone is **not** enforcement.
8. Only after a verified receiving endpoint is operating can the student form claim **“Report received”**; preserve copy-only fallback and clear failed/pending states.

There is no guarantee that Firestore Rules alone can enforce meaningful submission rate limits or source-bank existence; a server-mediated intake and/or App Check should be evaluated. Do not expose credentials inside a public frontend.

## V99-B CI scope and evidence

`scripts/audit_grade11_firestore_review_readiness_v99b.cjs` inspects **only checked-out source files**, with no browser login, Firebase import or network call. It asserts the existing admin claim flow, owner profile/attempt/requests, enrollment and copy-only report behavior remain in source. It also checks that those scanned frontend files have not silently introduced a new report database write without rules review.

It writes **`qa-artifacts/firestore-readiness-v99b/audit.json`** and **`report.md`**, retained by `Grade XI Firestore Security Readiness Preflight (V99-B)` in GitHub Actions. Its proposed authorization matrix is **a plan, not executed emulator results**. A successful run is **not** proof of production Firestore security.

## Next narrowly scoped PR after live rules are available

Read the exact deployed rules and produce a **diff-only, no-deploy** proposed report rule plus real emulator `allow/deny` tests. Check the entire existing ruleset and record every preserved legacy behavior. Do not edit production policies, authorize report sending, or expose a teacher dashboard until the owner reviews both the emulator results and the trusted teacher-claim provisioning model.

**Release gate:** Leave PR in Draft while CI is pending or failing. After green and review, click Ready for review → Merge pull request → Confirm merge. No credentials or student data are required for V99-B.
