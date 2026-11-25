# V159 — REAL Chromium teacher interaction, keyboard, accessibility and mobile QC

## Scope: local-only, synthetic users, no student release

V158/PR #259 merged and created a browser-facing Grade XI Unit 7 Topic 7.1 **emulator-only** teacher review shell, with source-aligned question-only Q10/Q15/Q62/Q76 and an advisory-only POST boundary. V159 exercises the **actual Chromium browser UI and real Firebase Auth/Firestore emulators**. This closes V158's expressly documented missing **native-browser UI verification**, not the outstanding live deployment or academic approval work.

The browser UI remains under **`local-dev/topic71-teacher-review-v158.js`**, deliberately **outside** the production `portal/` Firebase initializer tree. Existing App Check production-entrypoint inventory remains unchanged. The local Node server `server/local-topic71-browser-review-v158.cjs` only listens on disposable `127.0.0.1` after an explicitly enabled synthetic emulator switch. No normal hosted teacher route, real teacher login, live Firebase Cloud Function, production Firestore rules, real roster, gradebook or scored MCQ change.

### Small, purposeful accessibility and communication improvements

The **same local-only** browser shell now provides:
- A visible keyboard `:focus-visible` indication on text inputs and buttons, plus hover affordance, on desktop and narrow mobile widths.
- An explicitly focusable **review-section heading**. Following an approved synthetic teacher sign-in, focus moves to that heading, instead of remaining on a hidden login button.
- Per-question **accessible card label** and a heading level below the section heading; submission buttons announce their question number, so four identical buttons are not ambiguous to a screen-reader or keyboard user.
- Each fieldset's legend includes the question number and explicitly says **not approval**. Radio buttons remain native keyboard-accessible and submission remains disabled until a choice is made.
- Separate polite live-region status messages for authentication and recommendation receipts.
- After sign-out, focus returns to the login email input.
- If the backend has **already stored** a recommendation but the subsequent refresh fails, the UI now says **stored; refresh failed**, rather than falsely saying the recommendation was not recorded or encouraging conflicting resubmission.
- A non-sensitive `data-local-review-ready` marker only tells automated tests that the browser's module and event handlers loaded. It never stores an Auth token or any user data.

### Actual native Chromium checks

`scripts/test_grade11_v159_local_chromium_teacher_review.cjs` launches **real headless Chromium**, not a synthetic DOM stub. It uses:
- **Real local Auth/Firestore emulators:** synthetic verified teacher, unauthorized teacher and student identities, with real Firebase Auth Emulator email-password sign-in.
- **Genuine pinned Firebase Web SDK imports** in Chromium from the existing public SDK source `https://www.gstatic.com/firebasejs/13.1.0`, without mocking the browser module. CDN availability is an actual test dependency and is not production availability certification.
- **Playwright browser interactions:** anonymous shell has no source questions; unauthorized logins show denial and no MCQs; authorized synthetic teacher sees exactly four source questions, each with four choices, review issues, revision fingerprints and PENDING/HOLD.
- **Keyboard-only selection:** focus a native radio input, press Space to select, confirm the question-specific advisory submission button becomes enabled; a real browser click causes a real signed same-origin POST, immutable Firestore recommendation and atomic audit.
- **Second question submission and screen refresh:** two different advisory recommendations survive a UI rerender and previously submitted cards stop offering conflicting submission buttons.
- **Native mobile layouts** at 390 and 320 px, including no horizontal overflow and screenshots at 1280/390 px containing only synthetic, keyless, already-accessible candidate text.
- **Real document accessibility audit** using `axe-core` with WCAG 2 A/AA and 2.1 A/AA rules; critical/serious issues fail CI. Browser console/page errors and pinned CDN module failures also fail CI.
- **Mid-session security revocation:** once the server-owned teacher directory is revoked, an already-issued token cannot create another recommendation; the UI displays the safe denial and no extra Firestore review/audit records appear.
- **Sign-out and reload:** question cards disappear; sign-in returns, focus resets; the client uses the existing in-memory persistence and no valid teacher session survives reload.
- **Academic source regression:** no mutation to original Grade XI 2,250 provisional MCQ identities, 560 pending Unit6 signoffs, 80 source-bound Unit7 teacher holds, 80-row keyless question candidate or learning-catalog Unit7 planned/zero scored status.

The test captures **synthetic-only screenshots and a counts-only QA JSON**. It does not include production accounts, private keyed answer letters or original explanation texts. A passing native browser test is evidence for local UI behavior and semantics, **not** an academic correctness verdict or validation of production authentication rules.

### Security and teacher-science boundaries unchanged

- V155 still validates per request: signed, revocation-checked Firebase ID token; verified email; current `teacher:true` claim excluding admins; active server-owned teacher directory; reviewer allowlist; source and candidate SHA-256.
- V155 recommendation writes remain **advisory-only, atomic, revision-bound and immutable**. Browser can never submit `teacherApproved`, answer letters, original explanations, student records or scoring approvals.
- **Q10/Q76** original keyed explanations must still be corrected and teacher-approved; **Q15/Q62** revised stems remain teacher-pending.
- **80/80** Unit 7 academic signatures remain PENDING, and **0** Unit7 questions appear in scored Build My Test.
- App Check scans of production `portal/` are not relaxed; no Firebase Console or live student/teacher account action is needed.

## Follow-up after merge

The next controlled step should review the **local preview's browser evidence and accessibility findings**, then prepare a clear, owner-approved, independently secured **deployment design** for the teacher portal. A public GitHub Pages script must not receive Firebase Admin SDK privileges or rely on visibility hiding. A genuinely deployed backend requires authenticated server-side authority, production rules compatibility, anti-CSRF strategy, audit retention and release-gate design. Teacher academic approval and answer-key correction remain a **separate** workflow, not implemented by this PR.

**Merge instructions:** Keep this PR draft until all latest-head checks, including the new Chromium test and existing App Check launch lock, are green. Review five scoped changed files, click **Ready for review → Merge pull request → Confirm merge**. No Firebase Console action required.
