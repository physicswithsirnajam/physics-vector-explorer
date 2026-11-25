# V155 — Unit 7 Topic 7.1 four-item teacher-review security rehearsal (LOCAL ONLY)

## What this PR actually builds

A **real locally exercised server-side recommendation service** for **Q10, Q15, Q62 and Q76**, using the project’s existing V143/V144 Firebase Auth/Firestore **emulator-only** architecture. It **does not deploy anything**, create a live teacher dashboard, open a Cloud Function, modify Firebase production rules, or authorize student scores. A local synthetic teacher's recommendation **does not equal the owner's academic approval**.

The V154 merged 80-item decision queue is authoritative for the four item IDs and original full-row SHA-256 fingerprints, and V149's 80 question-only TSV is authoritative for the exact candidate revision. The service derives and checks its own per-question candidate SHA-256; a user cannot substitute a client-supplied question, alter an option, or approve an old revision as the current one. Original source DOCX SHA-256 is preserved in the unchanged V154 ledger (`930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58`).

### Strict scope and teacher decisions

| Question | Original concern | Permitted synthetic recommendation | What remains pending |
|---|---|---|---|
| **Q10** | Original keyed explanation incorrectly attributes nylon as one of NBF p.114's named polymer examples; V149 distractor now uses polythene | Supports revised wording / needs revision | The actual **original source explanation correction**, teacher answer-key validation, cognitive mapping |
| **Q15** | Original sulphur stem overclaims `molecular crystalline`; V147 narrows to textbook-listed crystalline nonmetal | Supports revised wording / needs revision | Scientific teacher approval of revised stem and original key |
| **Q62** | Original glass 'random long-range arrangement' ambiguous; V147 uses absence of regular long-range repeating structure | Supports revised wording / needs revision | Scientific teacher approval of stem, correct choice and explanation |
| **Q76** | Original claims nylon was **listed** as NBF synthetic example; V149 replaces all choices/stem with textbook-listed polythene | Supports revised wording / needs revision | **BLOCKED** original keyed nylon explanation must be rewritten and approved; teacher must also verify revised answer and assessment level |

The only two accepted recommendation strings are `supports-candidate-wording` and `needs-revision`. **Neither is academic signoff.** In particular supporting Q76's revised wording can **never** release the original invalid explanation. No answer letters or keyed explanation texts are stored in this service or GitHub review records.

## Security controls in `server/local-topic71-teacher-review-pilot-v155.cjs`

- **No live entrypoint:** This module exports a factory for **trusted Node/server code only**, with **no HTTP, Callable Function, UI or browser import**. It refuses any Firebase project other than the exact `demo-psn-v143-classrooms` project, refuses nonlocalhost Auth/Firestore emulator hosts, and rejects `GOOGLE_APPLICATION_CREDENTIALS`. This PR is not a deployment.
- **Disabled by default:** A trusted server-owned `isPilotEnabled` callback must return exactly `true`. Failure denies reads and writes; the server checks the switch before each operation and during the transaction. The switch cannot roll back an in-flight committed transaction.
- **Per-request authentication:** Verify genuine Firebase ID token with revocation check, fixed issuer/audience/sub/uid, verified email, `teacher:true` and `admin!==true`. Refresh the **current Auth user** via `getUser`, rejecting disabled, revoked claim or unverified users. Require server-owned **active** `teacherDirectory/{uid}` and membership in an explicit server-configured reviewer UID allowlist. An unrelated teacher, student, admin or anonymous browser cannot recommend source edits.
- **Strict request contract:** The caller supplies only a token, one of the four canonical question IDs, exact original SHA-256, exact candidate SHA-256 and one of the two recommendations. Extra fields (such as `correctOption`, `answerKey`, `role`, `uid`) are rejected, not written. No freeform comments, source keys, PII or student information leave the service.
- **Immutable and version-bound:** The local Firestore document ID hashes source ID, full original row fingerprint, current candidate fingerprint and reviewer UID. A change to the question candidate yields a **different document identity**; old recommendations do not become valid signoffs for newly edited content. Repeated identical submissions are **idempotent**; a changed recommendation conflicts and must be separately managed in a later revision workflow, never silently overwritten.
- **Atomic audit:** A local Firestore transaction creates one recommendation and one private audit record together. Both are `advisory-only` with `teacherScientificSignoff=PENDING`, `teacherCognitiveSignoff=PENDING`, `sourceAnswerKeyCertified=false`, and `scoredReleaseApproved=false`. Read projections include only four nonkeyed question IDs, issue codes, source/candidate digests and the caller's own recommendation, not another teacher's record or a student record.
- **Browser client denial:** Adversarial tests prove the existing V142 **isolated emulator Rules fixture** denies direct Firestore browser reads/writes to both review and audit paths for anonymous, teacher, student and admin simulated identities. V142 is explicitly **NEVER DEPLOY** and is **not** a substitute for testing the real complete production Rules baseline.

## Actual local Firebase integration tests

`scripts/test_grade11_v155_local_topic71_teacher_review.cjs` provisions synthetic Auth identities in the **real local emulators**, including one reviewer, another teacher, a student, admin and unverified user. It checks:
- Default OFF, fake bearer, forged extra field, unauthorized user, outside-reviewer teacher and unverified email **fail closed**.
- Four original/candidate hash pairs returned from a verified teacher **cannot be changed** or used with an unrelated item.
- All four synthetic recommendations are committed atomically with four audit entries; submitting exactly the same recommendation twice is idempotent; changing it returns a conflict, not silent overwrite.
- Role claim revocation, disabled account and teacher-directory revocation stop access even if a previously signed token remains.
- Browser SDK reads and writes to review and audit paths are denied under the V142 isolated Rules fixture, even for a synthetic admin.
- No user PII, correct answer, source explanation text, grade, exam score, email or credential is exposed; V154/V149 question data, legacy Grade XI **2,250** provisional items, Unit6 **560 pending teacher decisions**, and the catalog remain unchanged.

## Explicit limitations and the next safe step

This is the **first backend security pilot**, not the finished live teacher dashboard. Real use will require:
1. An owner-approved server hosting/deployment design, private production Rules compatibility and an authenticated teacher-only API/GUI.
2. A separate secure teacher action for **actual scientific signoff**, **answer-key validation and explanation correction**, including the Q76 source-explanation blocker, with complete audit and independent release permission. The pilot deliberately has **no such action**.
3. Teacher review scope, source revision invalidation, duplicate-concept avoidance, and later controlled scored-bank release only when each question is fully approved.
4. A separate, tested Firestore production migration with owner confirmation; **do not paste the V142 emulator Rules into Firebase Console**.

**Merging V155 leaves 80/80 Unit 7 items teacher PENDING and 0 Unit 7 scored questions.** Original teacher Word and answer keys remain private; student class enrollment, login, test history, Firebase live state and PDF watermark remain untouched.

### Owner merge instructions
Wait for both latest-head GitHub checks to be green, inspect these four files, choose **Ready for review → Merge pull request → Confirm merge**. There is **no Firebase Console action** and no live feature to test yet.
