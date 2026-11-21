# V99-A — Privacy-first Grade XI MCQ Review Intake: Contract and Deployment Gates

## Confirmed prerequisite

PR **#161** is merged at `8ee61972f2b2b48c140d2dccb68291b47a84e243`. Its successful **30-MCQ, all-six-unit** browser regression independently showed that the student-side “Found an issue with this MCQ?” feature **only copies** a report. Neither clicking that action nor completing the self-test creates a teacher notification, submission record or inbox entry.

This is an intentional **first foundation PR** for a secure future receiving workflow, not a pretend implementation of an inbox. The repository contains `portal/firebase-config.js` and `portal/attempt-sync.js` (self-practice save), but **no deployable or known current Firestore security rules, authenticated report-receiving endpoint, privileged teacher-account provisioning or teacher report dashboard**. We must not overwrite unknown production rules, assume teacher role claims, publish a write-open collection or put service-account credentials into this public repository.

## V99-A: Versioned report data contract, no network side effects

New pure module: `shared/mcq-review-contract-v99a.js`. It exposes `buildDraft`, `validateDraft` and `toTeacherLabel` for subsequent controlled review-intake work. It **does not send anything**.

The intended **student-controlled fields** are exactly:

| Field | Constraint / meaning |
|---|---|
| `schemaVersion` | 1 (fixed) |
| `kind` | `grade11-mcq-review` (fixed) |
| `grade` | 11 (fixed) |
| `unit` | integer 1–6 |
| `questionId` | existing canonical ID beginning with `XI-U0N-` or `U0N-`; unit prefix must match the stated unit |
| `sourceQuestionNumber` | positive integer, maximum 5000 |
| `bankVersion` | required plain text, maximum 120 characters |
| `category` | one of: `missing-context`, `incorrect-key`, `unclear-wording`, `formula-display`, `other` |
| `note` | optional plain text, maximum 500 characters, with C0 control characters removed |
| `origin` | `practice-engine` (fixed) |

The builder constructs a new explicit allowlist record from trusted normalized source identifiers and the selected issue category. It does **not** spread the original question object, expose `correctOptionId`, embed a score or selected answer, or copy account identifier, email, name, password, teacher role, auth token, admin status, source HTML, or arbitrary extra fields. Strict validation **rejects** forged/extra fields even if the builder safely omits them.

**Privacy caveat:** A student's free-text note could still contain personally identifying information if they type it. The future form must visibly remind them not to include private details; backend validation and the teacher moderation interface must treat note text as untrusted, escaped text. The existing copy-only form already has a privacy reminder, but this contract does not itself transmit or display a form.

## Future secure receiving workflow (NOT active in V99-A)

**Stage B — security rules and approved intake:** Inspect the **current live Firebase Firestore rules** first and merge a narrowly scoped report collection policy; do not replace existing ownership rules. Require sign-in and verified email, enforce schema and length limits independently on the server, enforce a server timestamp and authenticated report owner, and permit student creation only; forbid student status spoofing and student updates/deletes to already submitted reports. A server-mediated intake and/or App Check plus per-account anti-abuse limits should prevent spam and abusive content. Validate the `questionId` against the published bank before triage; client claims alone are not proof.

**Stage C — teacher access:** Authorize teacher/administrator reads and status changes **only via trusted server-set role claims or a separately verified role document**. No browser-set `isTeacher` flag, no client-side “secret” token, no open Firestore collection reading, and no public repo-stored administrator credentials. Initial statuses such as *new → investigating → resolved/dismissed* must be server-authorized and auditable. Teacher annotations must not be exposed to arbitrary students.

**Stage D — student handoff and acknowledgment:** Once rules and teacher receipt are verified with denied/allowed emulator tests and a controlled teacher account, connect the existing copy-only page to an **opt-in** “Submit to Teacher” flow with clear Pending / Received / Failed acknowledgments. Preserve a **copy-only fallback** for unsigned users or unavailable backend. Never claim successful delivery before server acknowledgment; never send reports invisibly. Automatic email/WhatsApp notifications require a separate, authorized integration, not a public client token.

At every stage, preserve the exact official Physics with Sir Najam logo, original MCQ sources, answer keys, SLO/classification and student privacy. **Do not treat an educational self-practice report as a secure examination or disciplinary record.**

## Automated checks in this PR

`scripts/test_grade11_mcq_review_contract_v99a.cjs` runs entirely offline (Node.js 22, no Firebase keys or services), building valid reports from **real Grade XI question-bank samples in all six units**. It checks the five issue types, ID-unit consistency, strong field limits, source version, omitted PII and answer/score fields, rejections for forged `uid`, `status`, extra `correctOptionId`, invalid unit/ID/category and 501-character notes, and confirms the existing Practice Engine button remains explicitly **copy-only**.

The new Actions workflow runs this contract test plus existing `scripts/test_grade11_mcq_issue_report.py`, which verifies the original copyable report remains stable. If a test fails, do **not** merge.

## Merge and availability truth

This PR adds a pure module, tests/workflow, and documentation. It **does not modify** existing student practice pages, connect to Firestore, publish roles, deploy rules, create any live teacher inbox, transmit a report or notify a teacher. Once latest-head checks are green, merge normally. The next small step must begin by inspecting existing Firestore rule text/configuration before any database policy change; that information is **not contained in this public GitHub repository**.
