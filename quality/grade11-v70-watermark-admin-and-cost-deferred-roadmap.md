# V70 — Branded exports and administration readiness

**Decision:** Defer all custom-domain purchase and migration costs until **at least two full class programs are complete**. Do not buy a domain, enable billing or require new paid services as part of this PR. Keep GitHub PR/CI plus the present Firebase pilot running.

## A. Watermark policy

- Display **Physics with Sir Najam** as a low-opacity, diagonally rotated, *repeated watermark across every physical page* of the two browser-generated report types already present in the Grade XI portal:
  1. **My Physics Progress**: browser-generated portal/pdf-report.js A4 print/PDF report.
  2. **Grade XI MCQ Test Results**: practice-engine/index.html Print / Save Results as PDF, including question-by-question explanation pages.
- The reusable stylesheet lives in shared/print-watermark-v70.css. Its fixed full-height print overlay is replicated on each printed page by Chromium. It displays 8 soft repeated brand lines without obscuring the main text and is invisible on-screen.
- Official logo PNG, heading, grade/progress summaries and source answer keys are **not altered**.
- Real browser PDF test scripts/test_export_watermarks_v70.cjs creates *only synthetic student data*, generates multi-page PDF files, uses pdfinfo to count pages and pdftotext to check **at least four detectable watermark repetitions on EVERY page**, plus browser CSS print-style checks. No real learner profile or record is used.
- **CSV and JSON are not paginated documents.** A visual watermark would corrupt spreadsheet import or machine-readable data. Keep their content schema valid, with clear metadata / publisher info instead. JSON retains all previous fields and gains publisher and documentBranding; CSV appends one Exported by column. A CSV or JSON export is **not** a PDF and is not visually watermarked.
- This first release **does not automatically watermark existing standalone uploaded PDFs**, external files, NBF third-party textbooks, or user-downloaded static images. Every future document or printable report generator should adopt the shared print watermark; for already-generated static PDF resources, explicitly evaluate ownership and rights before branded stamping/migration. Never present another publisher's original book as original Physics with Sir Najam work.
- Watermarks provide attribution and deter casual redistribution; they **do not prevent screenshots, copying, editing or determined redistribution**. Truly protected distribution still requires backend authentication and per-resource entitlement checks.
- Later: PDF report identity may use a privacy-safe opaque trace token with disclosure to the learner, rather than exposing private email/name across each page. Do not introduce this before a formal privacy review.

## B. Administrator portal — usable today vs planned

**Already active/read-only:**
- Recent learner profiles (up to 25, not an accurate total user count).
- Read-only account-deletion requests (up to 25); request does not equal actual deletion.
- Trusted Firebase custom-claim administrator login enforced in the app, with Firestore rules for actual permitted reads.
- Administrator's own learner dashboard.

**V70 interface improvement:** top links to **Learner directory (read-only)**, **Privacy requests (read-only)** and **Access & roles (planned)**, with explicit status labels and responsive styling. Roadmap cards now communicate exact future modules without fake Apply, Approve or Pay buttons.

**Not enabled yet — must be enabled only through trusted backend operations:**
1. Enrollment request triage (requested/pending/approved/rejected); migration of existing free-pilot learners.
2. Complimentary seats and authentic scholarships with scope, reason, start/end date, expiry and revocation.
3. Teacher roles with least-privilege assignments to specific course/class rosters.
4. Institution registration and subscriptions, seat limits, teacher assignments, institutional-manager access restricted to their organization.
5. Paid plan catalog, verified payment confirmation, refunds, renewals and cancellation.
6. Audit history of actor, reason, scope, expiry and affected UID; reconcile denied/revoked/failed operations.
7. Verified deletion workflow, data retention, academic record export and privacy requests.

**Future role scopes (not implemented):**

| Role | Permitted future scope | Must NOT be allowed |
|---|---|---|
| Platform owner / super admin | Publish courses, approve grants/roles, oversee scoped audit | Keep secrets in client, bypass audit |
| Enrollment manager | Decide course applications and complimentary seats within limits | Grant owner status or edit payments |
| Content editor | Draft and review assigned courses | Read private student attempts or payments |
| Assigned teacher | Work with assigned classes and explicitly shared class-level results | View other classes, independent practice or payments |
| Institution manager | Allocate seats and manage own organization's roster | Cross-organization access or platform roles |
| Finance operator | See necessary redacted payment states and invoices | Change quiz keys or view student answers |
| Student | Access own permitted course resources and progress | Approve themselves, assign roles, see others' records |

The supplied Firebase rules currently allow a verified learner to create a one-time active Grade XI academic enrollment. This is intentional for the current free pilot but is **not admin-approved enrollment**. Do not alter or deploy new Firestore rules until a tested migration/grant strategy preserves existing students and the live deployed rules are backed up.

## C. Practical roadmap — preferred order

- **Next, P0:** Write Firestore Rules **emulator regression tests** using the exact user-supplied Rules text, without production changes. Verify anonymous/verified owners, admin claim, other-user profile access, attempts, Grade XI enrollment, and protected lesson get/list.
- **P1:** Define enrollmentRequests and trusted-server accessGrants schema; implement auditable Cloud Functions and owner-approved roles, grandfather existing free learners.
- **P1:** Backups/restore drill, low-cost usage monitoring, abuse/rate controls, consent and privacy for school-age learners, secure administrator recovery.
- **P2:** Complete a second class, standardize every unit Learning Desk (Read → Simulate → Practice → Revise), run individual scientific answer and SLO QC, accessibility/mobile review and content rights checks.
- **After two full class programs:** purchase and connect the official domain to a single canonical HTTPS portal; migrate Google Sites with redirects/notices to preserve bookmarks. We can design the address without paying for it now.
- **Only after security:** protected downloadable content, paid subscriptions, verified payment webhooks, invoices/refunds/cancellations, automatic expiration, fair and clear pricing.

## D. Security nonclaims and acceptance

- This PR edits **no** Firestore/Storage rules, authentication claims, Firebase config, backend grants, student records, source MCQ wording/keys, published simulations or payment flows.
- The administrator page remains **read-only**; new section links navigate to accurate descriptions, not fictitious grant actions.
- Automated gates verify original 1,690 Grade XI practice MCQs, 31 simulations and the original administrator claim checks; real browser PDF output must carry readable watermark text on **every actual page**.
- After merge, manually check a 3+ page Progress PDF, MCQ review print, watermark visibility/legibility, admin section navigation, anonymous login and unchanged personal progress.
