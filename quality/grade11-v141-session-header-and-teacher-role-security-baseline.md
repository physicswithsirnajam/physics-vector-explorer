# V141 — Verified account menu and safe teacher-portal authorization foundation

## Prerequisite and current verified scope

PR **#240/V140** was confirmed **merged** on 24 November 2026; GitHub reported **20/20 latest-head checks successful**. Its main sidebar now offers ordered **Learn / Explore / Practise / Prepare / Track** groups for Grade XI's available and provisional units, with future units correctly labeled planned and existing supplementary videos available from original catalog metadata.

The user additionally requests a **persistent top-right signed-in account indicator** with **My Profile / Sign Out**, and future teacher-owned classes, private student records, automatically saved mixed-unit tests, progress, SLO-focused recommendations, badges and visual celebrations.

This milestone focuses on the **existing portal account shell**. It must not claim that a sign-in menu makes static GitHub Pages pages private or creates real classroom roles.

## Source-backed authentication findings

I reviewed the checked-in `portal/index.html`, `portal/app.js`, `portal/academic-enrollment.js`, `portal/attempt-sync.js` and V100-M App Check initialization. Existing functionality already includes:

- Email/password and Google Firebase authentication, email verification, password reset, profile creation and privacy controls.
- `refreshView(user)` obtains **`user.getIdTokenResult(true)`**, then loads the current Firestore profile, and discards stale responses when the active UID has changed. Only a **trusted `token.claims.admin === true`** may show the existing read-only administrator view. Self-registered accounts are ordinary independent learners and cannot elevate by editing profile fields.
- Grade XI academic enrollment is separate from **teacher-owned class membership**. Existing independent enrollment does **not** authorize joining someone else's classroom.
- Current private self-practice saving is limited to individual eligible Unit 1/2 results. It does not yet support a dependable private combined-unit assessment history or a teacher's roster.
- Existing public learning pages, practice question-bank JSON, worked solution pages and video/simulation links hosted on GitHub Pages are **public HTTP resources**, even where the portal presents a sign-in-first visual shell.
- Existing V100-M App Check runs in monitoring/compatibility mode; it does not independently authorize teacher/class/graded-exam access.
- **I have not verified the deployed Firestore Security Rules, Firebase Auth role issuance, or server deployment settings from this GitHub PR.** Do not claim live teacher-class isolation or compliance based on repository UI alone.

## V141: exactly what becomes visible

In the existing signed-in **`portal/index.html` header only**, a compact, accessible right-aligned account indicator displays a first-letter avatar, verified current account's display name and (inside the dropdown) email. It offers:

- **My Profile** — navigate to the existing `#my-profile` section of the learner dashboard. Existing admin console navigation now recognizes the same profile hash and refreshes the admin's learner view using the current signed Firebase user and claim check.
- **My Progress** — navigate to the existing `#my-progress` section; the existing permission-limited practice history applies.
- **Sign Out** — calls the *existing* `logout()` → Firebase `signOut(auth)`, with its existing privacy and account cleanup. The menu never invents a successful signout; it clears when the Auth state returns to the sign-in view.

The new `portal/session-menu-v141.js` is a minimal **presentational module**, not a second authentication provider. `app.js` invokes its `show(user,verifiedName)` only in existing successfully verified **learner or trusted-admin** display paths. On logout, new sign-in, verification, error or token refresh, `screen('auth')` immediately hides the menu and clears the previous person's visible name and email. Unverified or missing-UID users are refused. All names/emails are set via `textContent` to avoid markup injection; names are length-limited and avatar only uses a character.

**Scope limitation:** V141's header exists on the current **signed-in portal dashboard**, not yet globally on every separate public GitHub Pages simulation, practice, study or Test Builder page. A future safe sitewide Auth-state indicator should reuse the same verified identity without exposing private records or initializing services before App Check. Similarly, **the public Build a Test page is not authenticated-gated by V141**. These remain deliberate separate stages.

## Teacher and classroom backend design for the next milestones

Before provisioning a real teacher or assigning a real student's records, implement and verify these server-side boundaries:

1. **Administrator-issued identity.** Only a trusted server/Admin SDK path may grant or revoke `teacher` custom claims, subject to the owner's approval and an audit record. A browser `displayName`, `role` field or query parameter is never authority. Teacher passwords are set through Firebase Auth invitation/reset; they are **never stored in Firestore or shared in source control**.
2. **Class ownership and membership.** Design canonical `classes/{classId}`, `classes/{classId}/members/{uid}`, `classes/{classId}/assignments/{assignmentId}` and `classes/{classId}/submissions/{submissionId}` with explicit owner/learner authorization decisions. Teachers can view *only* their assigned class and its intended student/submission fields. An independent learner sees their own personal data, not another student's progress or a teacher's dashboard. Class membership is provisioned/revoked only from a trusted administrative backend, not editable by teachers or students themselves.
3. **Separate public practice from trusted school assessments.** Existing public MCQ keys and worked solutions cannot be treated as secret graded exam material on GitHub Pages. Teacher-assigned practice should use the public bank while any secure official examination requires protected server-side question and marking resources.
4. **Saved combined tests.** First define student-owned `users/{uid}/attempts` schema, deterministic attempt IDs/idempotency, ownership and timestamp validation in Firebase Rules, original source question references, trusted assessment classification and explicit separation of self-reported versus teacher-verified scores. Do not allow an arbitrary student to write another student's record, another class's submission or a teacher evaluation. The current Unit1/2 save restrictions must remain until expanded safely.
5. **SLO progress, recommendation and motivation.** Accumulate eligible saved question IDs/correctness for a student's own progress, then suggest topic/SLO practice with adequate evidence and spaced repetition. Streaks, stars, badges and optional short **reduced-motion-aware** confetti should be awarded against validated, deduplicated learning milestones, not fake scores, repeated button presses or unverified claims.
6. **Actual teacher issue inbox.** Current user report is **Copy/Download only**. An authenticated backend must verify submitter, source ID, rate limits, content size/safety, retention, teacher visibility and status changes; students may see *only* their own report receipts. Do not represent old unsent reports as received.

### Required permission test matrix (before launch)

- Student A can read A's own profile/attempts and assigned classroom work, but **cannot** read Student B or other classrooms.
- Student B cannot edit student A's submission or alter A's stars, grades, streaks or badges.
- Teacher T1 can read only assigned Class C1's permitted roster and submissions and cannot modify memberships or issue teacher claims.
- Teacher T2 cannot view C1, its submissions or student A's independent practice history unless separately authorized by a trusted admin-backed relationship.
- Administrator can provision/revoke memberships and roles only via trusted audited backend operations; admin dashboard alone does not enable unrestricted student attempt reads.
- Signed-out, stale-token, revoked membership and malformed/unauthorized requests are denied by backend Rules, irrespective of whether a button is hidden on the client.
- All role/membership changes must have role-revocation, invitation expiration, disabled-account, privacy/deletion and audit considerations.

**These are specifications, not claims of implemented or tested live teacher access.** No Firestore Rules/Auth claims are changed in V141.

## Real technical QA

`scripts/test_grade11_v141_verified_session_menu_browser.cjs` uses Chromium at **1280px, 390px and 320px** and the actual existing portal header/module. It deliberately **blocks external Firebase** and injects fake users **only for a presentational UI test**. It verifies the menu starts hidden, rejects unverified identities, displays a verified name safely, provides real existing profile/progress anchors, closes via Escape/outside click, clears previous account state on account switch and delegates Sign Out exactly once. It checks source code still refreshes Firebase ID claims, has UID stale-response protection, preserves original source bank counts and Unit6 release hold, and produces only a no-account metadata JSON artifact. The test does **not** impersonate a real teacher, test deployed Security Rules, or certify cross-class isolation.

### Files and merge conditions

**Seven files total:** `portal/session-menu-v141.js`, `portal/index.html`, `portal/styles.css`, `portal/app.js`, the new browser test, this note and one GitHub workflow. No original NBF question, correct answer, SLO, student attempt database, Firebase role, backend rule or teacher assignment changes.

Keep PR **#241/V141 Draft** until **every latest-head CI check is green**. If red, do not merge; fix the same PR branch. Once green, select **Ready for review → Merge pull request → Confirm merge** and manually check the header under a real verified **test account** on the deployed portal. On sign-out, the header name/email must disappear. Do not create teacher credentials or enroll college learners until the independent backend security tests for the class permission matrix pass.
