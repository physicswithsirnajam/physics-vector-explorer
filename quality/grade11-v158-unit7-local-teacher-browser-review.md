# V158 — Local authenticated teacher browser review shell (Unit 7 Topic 7.1)

## Purpose and deployment status

PR #258/V157 merged. The project already has: **V155** server-side review recommendations and private immutable audit, **V156** protected read-only HTML preview, **V157** a strict local authenticated POST action. V158 adds the first **browser-facing sign-in/review/recommendation shell** using those exact four critical NBF Grade XI Topic 7.1 source items **Q10, Q15, Q62 and Q76**.

**This is an emulator-only development build, not a live teacher dashboard.** The new Node server listens on a disposable **127.0.0.1** port only when `PSN_LOCAL_TOPIC71_BROWSER_REVIEW=enabled-local-test-only` and the exact synthetic `demo-psn-v143-classrooms` Firebase Auth/Firestore emulators are configured. It refuses production credentials and has no Cloud Function, Firebase production rule update, GitHub Pages route or persistent service.

## Interactive user journey — local development only

1. Open the local preview link on the **same machine** as the emulator. The anonymous HTML shell contains **no question stems, options or keys**.
2. Enter a **synthetic Firebase Auth emulator** teacher test email/password. The browser uses pinned Firebase Web SDK v13.1.0 modules (imported from Google's public static CDN) with `connectAuthEmulator` to `127.0.0.1:9099`. Session persistence is `inMemoryPersistence`, so it is not written to LocalStorage/IndexedDB by our app. The password input clears after the sign-in attempt. **Do not enter real production credentials.**
3. After sign-in, the browser sends a fresh Firebase ID token in a same-origin Authorization header for `GET /__local/grade11/teacher/unit7/topic71/items`. The trusted server V155 policy rechecks JWT revocation, current Auth account, verified email, teacher claim (no admin claim), active admin-owned teacher directory and explicit reviewer UID allowlist on each call.
4. A valid teacher receives **only four question-only candidates**, each with labelled A/B/C/D options, original/candidate fingerprints, issue description, existing advisory recommendation and explicit **PENDING/HOLD**. No correct-option marker, original source explanation, key or student information is returned.
5. For a question not previously recommended, select **Supports candidate wording** or **Needs further revision**, then submit. The browser POST has the signed token, same-origin Origin, exact source and candidate SHA-256, canonical four-field JSON and no cookies. V155 transaction creates the recommendation and private audit atomically. UI reloads the trusted server result and locks that item against duplicate conflicting changes. Existing recommendation edits need a separate future workflow, not a hidden override.
6. Sign out clears local session access and question cards. The browser must never display or store raw ID tokens in the page DOM, query string or local browser storage.

### Security and accessibility distinctions

| Area | V158 guarantee / limitation |
|---|---|
| Anonymous shell | Public shell has no questions or private data; authenticated JSON needed for all source items |
| User role | Verified, enabled `teacher:true` account, **not admin**, server allowlisted + active teacher directory |
| Content | Only fixed Q10/Q15/Q62/Q76; question-only V149; no correct answer letter or keyed source explanation |
| Student permissions | No direct Firestore Client SDK review read/write path; V142 isolated-deny client Rules and V155 regressions retained |
| Submission | Canonical JSON body; exact own same-origin `Origin`; no CORS, cookies, forwarded headers, extra fields, stale fingerprint or unapproved item |
| Browser protection | CSP forbids arbitrary scripts/frames/forms, allows only own static client module and pinned public Firebase SDK; `no-store`, no framing, `nosniff`, no response cookies |
| HTML rendering | DOM `textContent` and `createTextNode`, not untrusted `innerHTML`; no student PII |
| Key & score integrity | Advisory-only records and audit; all real teacher scientific/cognitive approvals still PENDING; Unit7 scored question count remains **0** |
| Browser automation | **Not yet verified with a native browser**; V158 CI proves actual local HTTP/auth/Firestore contracts and inspects the delivered HTML/JS. An automated Chromium UI test and deployment design should come next |

Browser CDNs require working network access for the local demonstration; the emulator-facing services themselves run locally. We do not publish a usable local URL in the hosted portal, because the localhost addresses only exist within the test environment or an explicitly configured developer machine. The local Auth Emulator synthetic test users are created by integration tests and **are not live teacher accounts**.

## Actual tests and unchanged protections

`scripts/test_grade11_v158_local_browser_review.cjs` uses real Firebase Admin/Auth/Firestore local emulators and local HTTP to verify:
- Anonymous shell is safe and contains no source MCQs; source questions require valid signed teacher token.
- Unauthorized student, other teacher, admin, unverified, malformed token and disabled feature are denied.
- Four keyed-**free** candidate stems/options are returned only after server authorization; no original keyed content or PII leaks.
- Browser-style same-origin POST, allowed recommendation strings, exact question/source/candidate revision binding, immutable audit and idempotent status.
- Wrong Origin, missing Origin, forged `teacherApproved`, correct-option injection, stale fingerprint, malformed/wrong method/path/header/body and conflicting update are denied.
- Current teacher claim revocation, disabled account and active-directory revocation are checked against formerly valid tokens.
- Original Grade XI **2,250 provisional MCQs**, Unit6 **560 pending teacher decisions**, V154 **80 pending Unit7 decisions**, V149 candidate, original Word and source book, learning catalog, PDF watermark, Firebase production settings and student test history are unchanged.

GitHub Actions also independently reruns V157/V156/V155 local Firebase security tests (including direct browser Firestore client denials) plus the original Unit7 and legacy question release-lock audits. The actual native browser sign-in and DOM click path should be tested separately before claiming the UI is end-to-end browser-verified.

## Outstanding academic work (unchanged)

- Q10 and Q76 have incorrect original NBF attribution **in their keyed explanation** and require a separately reviewed rewrite.
- Q15 and Q62 have corrected question-only candidates requiring final teacher approval.
- **0/80** original Unit7 teacher academic scientific/cognitive signoffs, **0** scored questions released.
- A recommendation is not approval, an academic correction, a grading key, or automatic student publication.

**Owner merge procedure:** Keep draft until both latest-head CI checks green. Review the five new, nonproduction files; select **Ready for review → Merge pull request → Confirm merge**. No Firebase Console action and no real teacher/password setup required. Next small PR should focus on native-browser test automation and interface accessibility, followed by explicit owner-approved real deployment architecture—not automatic roll-out.
