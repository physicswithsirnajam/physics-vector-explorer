# V157 — Authenticated local teacher recommendation submissions (HTTP security rehearsal)

**Prerequisite:** PR #257/V156 merged on 25 November 2026. The V156 `127.0.0.1` teacher HTML preview is deliberately **read only**, while V155 has already validated exactly two teacher **advisory recommendations** for Q10/Q15/Q62/Q76 using real local Firebase Auth and Firestore emulators.

## This specific milestone

V157 adds an **actual but LOCAL-ONLY trusted HTTP POST action** for the four reviewed Topic 7.1 MCQs, independently authenticated with a signed Firebase Auth Emulator bearer token and verified again against fresh current teacher records. It allows a synthetic local reviewer to submit:

- `supports-candidate-wording` — *I support this revised question wording*
- `needs-revision` — *I recommend a further revision*

Both remain **`advisory-only`, never academic signoff**. A recommendation does **not** approve the original answer key or its explanation, does **not** change an MCQ's SLO/cognitive classification, and cannot publish an item for scored practice. **Q76 remains blocked until its original nylon-attribution explanation is corrected and teacher-approved**; Q10 also needs its original explanation corrected, and Q15/Q62 revised stems need teacher review.

The current V156 HTML remains **read-only**. V157 tests full interaction between a trusted local teacher POST client, Firebase-backed recommendation persistence, and the subsequent read-only preview refresh. It **does not** put a submit button in a live website or implement browser sign-in. That would require a separately designed authenticated user experience and appropriate CSRF protections. Never expose the local route on public GitHub Pages or the live Firebase project.

## Strict endpoint contract

`server/local-topic71-teacher-action-http-v157.cjs` creates one ephemeral loopback listener, only when the separately trusted environment switch `PSN_LOCAL_TOPIC71_TEACHER_ACTION_HTTP=enabled-local-test-only` is configured. The listener refuses any environment except `demo-psn-v143-classrooms`, localhost Firestore `127.0.0.1:8089` and Auth `127.0.0.1:9099` emulators, and refuses service account credentials.

Request contract:

```http
POST /__local/grade11/teacher/unit7/topic71/recommendation
Authorization: Bearer <LOCAL_EMULATOR_ONLY_TOKEN>
Content-Type: application/json
Content-Length: <exact_byte_count>
```

Only a canonical JSON body with these **four exact, allowlisted fields** is accepted:

```json
{
  "questionId": "XI-U07-T071-Q010",
  "originalSha256": "<64_lowercase_hex_characters>",
  "candidateSha256": "<64_lowercase_hex_characters>",
  "recommendation": "needs-revision"
}
```

These digests are **not user-set authority**: the server checks them against the immutable V154 original-row and V149 current question-only candidate fingerprints through the V155 trusted review service. The HTTP layer does **not** accept arbitrary teacher roles, source text, explanation text, answer letters, user UIDs, comments, `teacherApproved`, `scoredRelease`, or any extra JSON fields.

The route rejects wrong method, other paths, query strings, invalid/duplicate headers, `Origin`, cookies, proxy/forwarded headers, wrong Host, non-JSON content, absent/incorrect/oversize Content-Length, bad UTF-8, duplicate JSON keys and noncanonical encodings. It imposes a 512-byte maximum and a short read timeout.

### Server-only authentication (inherited from V155)
- Real Firebase ID token verified with revocation check, strict project issuer/audience/subject, email verified, `teacher:true` and not admin
- Current Auth `getUser` (including disabled and role changes); active trusted `teacherDirectory/{uid}`
- Explicit server-owned reviewer UID allowlist and a separate OFF-by-default trusted enable callback
- Atomic create of one source-revision-bound advisory document and one private audit row per recommendation
- Identical retry **idempotent**; different recommendation **409 conflict**, never silent overwrite
- An edited source or candidate fingerprint **409 revision mismatch**, never approval of stale wording

The successful reply contains **only** `questionId`, `advisory-only`, `alreadyRecorded`, `academicSignoff=PENDING`, `scoredRelease=HOLD`. All error replies use fixed safe JSON codes; no answer-key contents, reviewer UID, email or Firebase exception is returned. Responses use `no-store`, CSP deny-all, `nosniff`, no cookies and no CORS.

## Real local Auth/Firestore emulator tests

`scripts/test_grade11_v157_local_teacher_http.cjs` starts actual local emulators with synthetic identities (approved teacher, different teacher, student, admin and unverified teacher). It exercises:

- Default OFF and fake/unauthorized user denial
- Unrelated teacher, student, admin, unverified/disabled/revoked accounts and directory access rejection
- Wrong ID, stale candidate/source digests, forged `teacherApproved` and answer key fields, invalid recommendation, invalid content type/length and hostile request headers
- Four actual **synthetic** authenticated POST recommendations, four private atomic audits, identical retry without duplicate writes, conflicting recommendation rejection
- Successful subsequent **V156 read-only HTML preview** showing the existing advisory statuses, with **no correct answers**
- Original V154 decision queue, V149 question-only candidate, original 2,250 Grade XI provisional question IDs, Unit6 560 pending signatures, Unit7 learning catalog and student scoring unchanged
- V155 adversarial Firestore Client SDK direct-access denials remain covered by the separate regression execution within the workflow

### Critical distinction: recommendation vs approval

| Stage | Status after V157 |
|---|---|
| Original 80 Topic 7.1 first-pass notes and review queue | Complete |
| Local-only pilot recommendation submission for 4 source corrections | **Implemented and technically tested** |
| Authenticated browser teacher dashboard with normal Firebase login | **NOT IMPLEMENTED** |
| Final original answer-key/explanation repair and academic/cognitive signoff | **PENDING** |
| Unit 7 questions published for scored Build My Test | **0** |
| Live Firebase/Cloud Functions/Rules deployment | **NONE** |

Future milestones may unify a teacher sign-in interface with authenticated local requests, then design a separate **real** teacher decision and answer/explanation verification process. Publication requires new, independent release gate rules; never infer signoff from a GitHub merge or a recommendation receipt.

**Owner actions:** Keep PR draft until both latest-head checks GREEN. Review four scoped files; select **Ready for review → Merge pull request → Confirm merge**. **No Firebase Console action** is required, and there is no live UI to click for this PR.
