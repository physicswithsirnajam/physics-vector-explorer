# V156 — Read-only, authenticated local teacher review preview (Grade XI U7 Topic 7.1)

## Purpose and honest deployment status

V155/PR #256 merged successfully and created a trusted, **local Firebase Auth + Firestore emulator-only** recommendation service for **Q10, Q15, Q62 and Q76**. This PR implements the **next small step**: a server-rendered HTML **read-only teacher review preview** over an ephemeral **127.0.0.1 HTTP listener** with strict request contracts.

**It is not a live teacher dashboard, public GitHub Pages route, Firebase Cloud Function, browser sign-in workflow, graded MCQ importer, or teacher approval/signoff service.** In this stage the authenticated HTML is retrievable by a trusted local HTTP tool capable of sending a *real synthetic Auth Emulator bearer token*. A normal browser address-bar navigation does **not** automatically attach that token; a safe browser sign-in experience is a separate future milestone.

The exact current V149 source candidate supplies only **question stems and four A/B/C/D alternatives**. V154 supplies only original row fingerprints and teacher-review status; V155 independently authenticates the teacher and loads their own advisory recommendation. Original Word answer letters and one-line explanations **are never loaded into the HTML renderer**.

## What the preview shows

| Visible field | Source | Protection |
|---|---|---|
| Q10, Q15, Q62 and Q76 | Four fixed question IDs from V154/V155 | All other source questions excluded from this pilot |
| Current stem and four options | V149 question-only TSV | Never marks the correct answer |
| Source row and candidate revision | First 12 characters of SHA-256 source/candidate fingerprints | Exact full digest still checked by server; shortened display for legibility only |
| Original issue category | Trusted V155 `listPilotItems` projection | Fixed four-topic reviewer scope |
| Previous advisory recommendation | Only authenticated caller's own V155 record | Display-only; no browser write endpoint |
| Academic signoff and scored release | Current V155 and V154 HOLD states | Always `PENDING` and `HOLD` |
| Source-explanation caution | Q10 and Q76 | **Requires independent repair before keyed/scored release** |

The preview uses a readable navy-and-light, mobile-friendly layout with separate cards, labelled options, source references, and visible cautions. It does not include the owner's official portrait/logo image as no new branding assets need to be imported or altered for a local-only security test.

## Authorization / security boundaries

1. `startLocalTopic71TeacherPreview()` refuses anything outside the exact demo project `demo-psn-v143-classrooms`, localhost Auth (`127.0.0.1:9099`) and Firestore (`127.0.0.1:8089`) emulator endpoints, or the explicit `PSN_LOCAL_TOPIC71_TEACHER_PREVIEW=enabled-local-test-only` switch; any production service-account environment variable rejects startup. The underlying V155 pilot is **OFF by default** separately.
2. Listener binds to **127.0.0.1** on a disposable port and requires **GET on one exact URL** and a single Authorization header. Rejects query strings, cookies, `Origin`/`Referer`, `Forwarded` and `X-Forwarded-*`, bodies, extra content-type and unsupported methods. A browser cross-site or cookie-based request cannot bypass the signed-ID-token requirement.
3. V155 validates `verifyIdToken(token, true)`, issuer/audience/sub, `email_verified`, fresh Firebase Auth account status and `teacher:true` (not admin), explicit server-managed teacher UID allowlist, active teacher directory, and an OFF-by-default trusted server enable callback, all **per request**.
4. Before HTML generation, V156 requires an **exact allowlisted projection** of four items, fixed source/candidate SHA-256 matches, unchanged pending/hold statuses and valid recommendation labels. Unexpected backend data cannot result in partial private records being displayed.
5. HTML escapes every source string; the response sets `Content-Security-Policy` with scripts blocked and forms forbidden, `X-Frame-Options: DENY`, `no-store`, `nosniff`, and no cookies or CORS. The HTML contains **no scripts, forms, submit buttons, answer keys, admin identities, student data or secret tokens**.
6. Each denial returns a minimal fixed JSON code. There is **no POST write route**, and existing V155 recommendation/audit records are **read only** from this layer. Both `unit07Topic71TeacherReviewPilot` and its audit collection stay inaccessible to the browser Firebase Client SDK under the existing *isolated emulator fixture*, as independently covered by V155 tests.

## Test coverage and limits

`scripts/test_grade11_v156_local_teacher_readonly_preview.cjs` launches real local Auth/Firestore emulators, creates synthetic reviewed/unverified teacher, outsider teacher, student and admin accounts, and checks: default OFF; valid teacher page has precisely four question cards; all option text appears without an answer key; invalid/unauthorized roles and stale bearer tokens are rejected; forged Host, cookies, query parameters, Origin, forwarded headers and POST are denied; response no-store and CSP headers; HTML-escape injection; approved teacher's preexisting synthetic V155 advisory receipt reflected on refresh; and account/teacher directory revocation. It also proves **no question/source/curriculum catalog mutations and 0 scored releases**.

The GitHub Actions workflow runs V156 real emulator test, the original V155 emulator tests (including Firestore client-rule denials), V154 consolidated 80-item audit, V99i 2,250 provisional-identity checks and Unit6 V94D 560 pending signoffs. These checks are **technical security/release regression evidence**, not scientific answer-key certification or production Rules validation.

## Next small steps (not implemented here)

- An accessible local sign-in-based teacher UI and POST recommendation workflow would need a dedicated CSRF/auth model and owner-approved deployment plan; do not take the secure local bearer HTTP fixture and expose it on GitHub Pages or the public internet.
- True **academic signoff** needs teacher-key verification, correction of Q10/Q76 original explanations, explicit cognitive/SLO review and immutable audit; simply recommending revised wording does not approve an item.
- The original source Word, existing 80-question working candidate and 80-item teacher queue remain unchanged; **all 80 MCQs pending** and **zero Unit 7 scored release**.
- No Firebase Console rules, live API settings, registration or test-builder changes required.

**Owner actions:** Keep this PR Draft until both latest-head checks pass. On green: review these four files; select **Ready for review → Merge pull request → Confirm merge**. No manual Firebase action or live teacher page testing is expected.
