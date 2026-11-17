# V69 — Single official portal, sign-in-first shell and entitlement-readiness plan

**Decision proposal (17 Nov 2026):** keep GitHub as the development/version-control workflow; use **one canonical learner-facing HTTPS portal**; retain Firebase Authentication for learner identities; protect account records and any paid/scholarship course content **on the server**. The visual login gate in V69 is a first usability step only, **not** a new security boundary.

## 1. Current architecture verified in repository

- Public repository: `physicswithsirnajam/physics-vector-explorer`. Existing standard GitHub Pages-shaped project URL is **expected** to be `https://physicswithsirnajam.github.io/physics-vector-explorer/portal/` when Pages is enabled at the default domain/path. **The live deployment URL could not be verified through the available tools**; owner should check GitHub **Settings → Pages → Visit site** for the exact current public address.
- Existing Google Sites HSSC-I entry is a separate directory/legacy learning hub; making it private or deleting it before migrating inbound links could strand existing students. Prefer an owner-published "We've moved: Open Student Portal" link for a transition period, then unpublish or make it private after confirming students use the new portal and old embed links are updated.
- Repository currently publishes static HTML, JS, 31 simulation files, public question-bank archives and answer keys; **direct-file URLs remain reachable without portal sign-in**. Private GitHub repository visibility does not imply a privately accessible Pages website for ordinary visitors (official GitHub Pages documentation).
- Firebase Auth web config is client-facing and not a secret key; existing portal verifies email and consults a trusted Admin claim for admin UI. `academicEnrollments/{uid}` currently allows a Grade XI / FBISE independent **self-enrollment** flow; it is **not** an admin-approved, paid or scholarship entitlement program yet. Existing saved Unit1–2 attempts are private-data operations governed by **deployed** Firestore rules that still need owner verification.
- V69 *only* hides global unit/resource navigation, external header links and public demo calls-to-action **on the anonymous portal sign-in page**; signup/reset/verification/privacy remain visible. Navigation appears again in the verified-learner or admin UI, and closes correctly on logout. Public resource pages remain publicly accessible by direct URL.

## 2. Proposed student-facing product

Single brand: **Physics with Sir Najam**. Once a domain is obtained and connected, example (NOT acquired/verified): `https://portal.physicswithsirnajam.com/` or one primary site `https://physicswithsirnajam.com/`.

Recommended top-level learner journey:

1. Land at branded sign-in / create-account page.
2. Register by email+password or Google; verify email. Privacy and parental/guardian consent where applicable.
3. Choose Grade XI / FBISE or another supported class; submit enrollment request when the admin-approval model is ready.
4. See one of: **Pending approval**, **Approved free/sponsored access**, **Active paid plan**, or **Expired / needs renewal**.
5. After server-confirmed entitlement, learner dashboard shows **My Courses**, **Simulations**, **Notes & Lessons**, **Practice & Tests**, **My Progress**, **Profile**, **Subscription/Access**, and **Help**.
6. Only server-granted course assets and progress become accessible. A valid account does *not* automatically grant all class/course content.

For the current no-charge session, call the entitlement **Complimentary Access**, **Free Pilot Enrollment** or **100% Sponsored/Scholarship Access** only when a genuine sponsorship/fee waiver exists. Do not advertise a nonexistent charged price as a fictional discount; show transparent zero-charge terms and any future plan as **Coming Soon**.

## 3. Secure architecture recommendation

### Development & deployment
- **GitHub** remains source control and PR/CI; keep existing code reviews, test scripts, source QC, rollback and stable release tags.
- **Firebase Hosting** (or another managed frontend) for a unified official HTTPS domain and login UI; Firebase Hosting static asset files are **public** too, not automatically private.
- **Firebase Authentication** for verified accounts and supported identity providers.
- **Cloud Firestore**, with enforced **Security Rules**, for students' own profiles, progress and enrollment/entitlement records. Rules must separately validate owner-only reads and admin-only mutations.
- **Cloud Storage with verified Storage Security Rules** or an authenticated **Cloud Functions / Cloud Run** content API for actually protected notes, PDF downloads, item banks and paid lessons. Check Firebase ID tokens **and** current course entitlement in the backend on every protected asset/API request; don't ship paid keys or files in a public GitHub Pages build.
- Custom backend Admin SDK (not browser) processes approvals, scholarship grants, payments and subscription state changes; verifies signed payment events and expiry; uses idempotent transactions.
- Warning: browser-delivered simulation JavaScript and any downloaded content can ultimately be inspected/copied by an entitled user. Authentication controls *distribution/access*, not absolute anti-copy DRM. Public existing archives may have been cached or copied already.

### Minimal possible data model (conceptual — NOT DEPLOYED)
```text
users/{uid}                     # existing auth-linked public profile fields, owner-read/write subject to rules
academicEnrollments/{uid}       # existing independent Grade XI self-enrollment: migrate carefully
courses/{courseId}              # public listing and prices only if approved
enrollmentRequests/{requestId}  # learner's requested course and pending/denied/approved status
accessGrants/{uid_courseId}     # SERVER-WRITTEN: uid, courseId, status, accessType, startsAt, expiresAt
practiceAttempts/{uid/...}      # existing user-owned attempt design, preserve paths and old data
payments/{id}                   # SERVER-WRITTEN minimal receipt/status; never store card details
auditEvents/{id}                # admin grant/renew/revoke, timestamp and actor only
```
Allowed access types: `complimentary`, `scholarship`, `paid`, `trial`, `institution-sponsored`. None is a Firebase role. An `admin` claim only authorizes trusted privileged workflows; it must not be grantable by the client.

### Access flow
```text
Visitor → Sign In/Register → Verified? ──No→ Verify email
                                   └─Yes→ Request Grade/Course
                                                  ↓
                                  Existing grant? ─No→ Pending review
                                                  └Yes→ Check active/expiry
                                                            ↓
                                            Authenticated lesson/quiz API or protected file
```

For existing students, **grandfather** their current free Grade XI enrollment into an appropriate complimentary course entitlement during a tested migration. Do not change self-enrollment or disable old users before rules, data migration, and test accounts are ready.

## 4. Minimum security release gates

1. Obtain/read the currently **deployed** Firestore and Storage rules in Firebase Console (not present in public repo); make sure anonymous requests cannot read any private attempt/profile/payment, and one student cannot read another student's records.
2. Admin-only access granting, revoking and changing enrollment status. Browser editing of UI, Firestore direct SDK calls or changing a URL must never provide premium content or admin actions.
3. Simulate two separate student accounts and one admin in a test Firebase project, including stale tokens and old/revoked subscriptions. Confirm denial on direct API/file URLs, not only hidden links.
4. Configure approved email verification, password policy, recovery, abuse/rate protection, optional App Check and consent/privacy workflows for school-age students. Set audit logs and usage/billing alerts.
5. Separate public previews from protected course questions/downloads; audit NBF/school material rights before commercial redistribution. Keep service-account credentials out of GitHub/client JS.
6. Verify deployed Google Sites legacy links, one canonical URL, responsive mobile login, account-specific logout and accessibility across public and protected routes.
7. Define refunds, payment-provider webhook validation, cancellation, renewal/grace period and honest visible subscription conditions **before** collecting payment.

## 5. Concrete staged delivery plan

- **V69 (this PR)**: signed-out **portal** shows only its branded sign-in/create-account/password-reset/verification/privacy workflow; no global resource nav or Google Sites CTA until verified account view; old public resources still accessible separately.
- **Next security sprint**: owner inspects deployed Firebase rules; GitHub PR creates a **no-deploy, test-first** entitlement/rules specification and Firestore emulator tests. Only after verification, safely deploy rule changes.
- **Student enrollment workflow**: request/approve/deny; admin grant to a named UID/class with an expiry and audit log; grandfather existing cohort without lost records.
- **Protected content migration**: choose canonical custom domain and Firebase Hosting, move any truly gated PDFs/question banks to server-authorized storage/API, and remove private materials from public deployment sources. Prepare clear public previews if needed.
- **Paid subscriptions later**: select supported payment processor for the operating country; integrate secure server-verified payments/webhooks, invoice/refunds, cancellation and recurring access; do not accept direct card credentials in the portal.
- **Google Sites retirement**: after all resource links and school messages point to the single canonical portal and you've checked active students, replace Google Sites with a migration notice temporarily, then make private/unpublish if desired.

## 6. V69 acceptance and limitations

`scripts/test_portal_signin_first_v69.cjs` uses real Chromium at desktop and 390px mobile but **stubs the Firebase app only for layout testing**. It ensures anonymous portal global resource nav/header CTA absent, login and privacy visible, synthetic verified dashboard re-displays navigation, drawer closes on logout, original 31 simulations/1,690 MCQs unchanged, and **direct static simulation URL still opens anonymously**. This last test deliberately proves V69 is NOT server-side security.

- No changes to existing Firebase Auth configuration, Firestore, Storage rules, enrollment schema, records, original MCQ archives, proprietary content, payments, custom claims or default login policies.
- Never call the public resources truly paywalled or inaccessible until protected hosting and request-level backend access tests pass.
