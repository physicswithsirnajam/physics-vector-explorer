# V68 — Grade XI portal navigation, usability, student profile, and security audit

**Baseline verified**: merged PR #57; 1,690 public Grade XI MCQs across five published units (275, 206, 220, 640, 349); 31 locally referenced public interactive simulation pages; 59 published catalog resource entries across Units1–5; original Unit4 classroom 80-MCQ materials separate and unchanged.

## Root-cause diagnosis

1. `shared/navigation.js` top-bar entry named **Simulations** was hard-coded to `https://sites.google.com/view/physics-with-sir-najam/student-hub/1st-year-hssc`. This explains the unexpected external destination. The same global drawer already linked to `portal/simulations.html`, a native 31-item searchable/filterable local library. **Fix**: the top-bar Simulations entry now opens the local catalog. Keep a clearly labeled separate external Google Sites Student Hub link.
2. Signed-in `portal/index.html` presented welcome, Learning Hub, extensive saved-progress archive, and privacy options stacked vertically. The long-page layout required unnecessary scrolling and lacked clear section-state feedback. **Fix**: lightweight browser-hash views for **Overview, Learning Hub, My Progress, My Profile, Privacy**, plus a direct Simulations shortcut. Only the selected content view is shown; no background reload or data migration is needed. Accessible anchor links, visible current-view styling, mobile horizontal-scrolling tab strip, keyboard focus outline, and deep-link support are provided.
3. An `users/{uid}` profile with a display name already existed, but there was no student-facing profile view. **Fix**: read-only account summary (existing name, signed-in email, email-verification status, enrollment, access limits) shown only inside the verified-login dashboard. No new Firestore collections, profile photo, date of birth, phone, UID display, uploads, permissions or backend writes.
4. Original 51 published unit resource pages and several independent entry points share the same navigation asset. V68 changes source navigation centrally and cache-busts the main entries and published Unit1–5 desks. Older individual resource HTML files still use the previous URL query until a later controlled cache sweep; a hard reload may be needed during edge-cache propagation.

## Security and safety: what is verified vs what is **not**

**Inspected in GitHub source**:
- The repository is a **public static GitHub Pages learning project**. Original simulations, source-based Test Builder questions, public practice keys and resources must be regarded as publicly readable. **Showing/hiding a tab is not permission enforcement.**
- Portal authentication uses Firebase Email/Password and Google login; verified-email checks are present. The administrative path uses Firebase ID token **custom claims** before showing the admin console. Existing profile, enrollment and progress data are requested from Firestore while a session is active.
- `portal/firebase-config.js` contains a Firebase **web SDK configuration**, whose API key is normally client-facing connection metadata, not a private service-account key. Do not put credentials, custom token signing keys or admin service accounts in the public repository.
- The original V10 academic enrollment logic describes enforcement in Firestore rules and uses a tightly constrained Grade XI/FBISE independent enrollment. The V68 workspace only **organizes already available UI** and has no backend access itself.
- Privacy text accurately warns that deletion **requests are not automatic full deletion**, saved progress is account-specific self-practice (not school grades), and only individual Unit1/Unit2 practice results can currently be saved. No new data collection or analytic tracking is introduced by V68.
- The user-reported Simulations link's external navigation was a usability misroute, not evidence of an account compromise.

**Not yet verified — must not call this project “secure” on code alone**:
- The **live deployed Firebase Firestore and Storage rules** are not in the GitHub repository. Actual user isolation, admin claim checks, enrollment creation-only restrictions, attempt size/shape validation, and privacy-request access need a Firebase Console rules review or targeted owner-authorized test.
- Production Firebase Authentication policy, email-enumeration protection, sign-in abuse limits, optional App Check and organization/underage consent have not been externally verified.
- Real end-to-end login with a test Firebase account, account deletion execution and cross-user tampering tests have **not** been performed by V68. CI uses synthetic layout-only dashboard state and never creates or accesses a real account.
- GitHub Pages and the Google Sites hosted entry point are separate origins. External links and embedded resources should be tested manually on the published Google Sites page after deployment for framing, mobile layout and sign-in redirection.
- A live hosted-page pixel-perfect audit was not available from the current inspection environment; visual QA uses pinned real Chromium locally against the checked-out repository, desktop and 390px mobile screenshots.

## Usability release details and safe regression gates

V68 adds `portal/workspace-tabs.js` and `portal/workspace-tabs.css`, a visually focused privacy-minimal account view, simulation shortcut from the dashboard, and more specific external-site labels. It updates `portal/app.js` only to populate existing account fields, clear the new view on signout and respect the new hash deep links; it does **not** change Firebase rules, account roles, attempt saving or original resources.

`scripts/test_student_workspace_v68.cjs` requires:
- All **31** local simulation HTML files exist and are unique; search and category filtering work in Chromium.
- The **top Simulations** link from the Student Guide leads to the native Simulation Library, not Google Sites. The external Google Sites link remains explicitly labeled.
- The original role/verified-email/profile checks remain in portal source and all five view panels can be selected, including links between profile, progress and privacy.
- Before any simulated login, the dashboard and profile remain hidden. Browser screenshots of a **synthetic, local DOM-only student account** demonstrate the views and 390px phone responsiveness; the test does **not** represent authentication testing or prove Firestore security.
- A GitHub Actions regression also runs the original V58 resource drawer, five-unit Test Builder and Student Guide checks, preserving 59 published catalog resources and the unfinished-quiz navigation warning.

## Recommended next iterations (prioritized)

**P0 — deployment security verification**. Review actual live Firestore rules and Firebase Auth policy in the Firebase Console; test owner-only profile reads, private attempts, one-time pilot enrollment, admin custom claim, account-deletion request boundaries, and stale-session signout. Make access control changes **only after** identifying a concrete failure and with regression tests. Strengthen new-user password guidance (currently the signup HTML asks for a six-character minimum) and configure a corresponding *server-side* authentication password policy where supported.

**P1 — usability polish**. Add recent lesson/breadcrumb and progress-return shortcuts **without local storage until privacy is reviewed**; improve sidebar category scannability and on-page Unit resource selection; standardize the navigation asset version on remaining catalog resource pages and test Google Sites embed/mobile behavior.

**P2 — profile features**. After Firestore rule verification, design teacher-approved minimal user profile editing (display name/preferences) and account data export/deletion workflow. Avoid student-photo, DOB, phone, addresses and other unnecessary personal data by default. Do not introduce public profile URLs.

**P3 — instructional experience**. Within the Learning Hub, consider source-verified unit dashboards, objective-focused simulations, recommended revision paths and improved lesson completion states. Keep public resources clearly separate from enrolled protected lessons and never call public quizzes secured exams.

## Manual acceptance after merging V68

1. At the public Student Guide or Learning Desk, choose top **Simulations** — opens portal-native searchable library with 31 entries.
2. The separate **Google Sites Student Hub** link is visibly labeled *external*, opening separately; no “Simulations” click should silently bounce there.
3. Sign in with an already verified student account; dashboard sections are concise, switching views shows only one main panel and the current view is highlighted. Check mobile and browser Back/Forward.
4. My Profile shows only existing account name/email/verification/enrollment, without a profile edit or public exposure. Sign out and confirm profile disappears.
5. My Progress and privacy requests continue unchanged; original saved records and public practice access still behave as before.
6. If nav looks outdated in a cached browser, refresh once using Ctrl+Shift+R. Check the Google Sites HSSC-I entry separately.
