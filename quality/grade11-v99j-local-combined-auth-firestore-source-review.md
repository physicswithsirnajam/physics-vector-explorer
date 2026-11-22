# V99-J — End-to-end local Firebase Authentication + Firestore + frozen MCQ references

## Verified prerequisite

PR #170 (V99-I) merged at `379a396b0e7d9c245ee194dda66502b6edfb6924`; its exact **2,250-reference static Grade XI MCQ catalog** is now pinned and CI-verified against the original public practice bank. PRs #166–168 previously tested the intake policy, real Firestore transaction adapter and real Firebase Authentication Emulator tokens **separately**.

V99-J connects these already-reviewed components **only inside a local demo project**, with no production service, endpoint, token storage, or website change.

## Four-file scope

- `server/local-review-pipeline-v99j.cjs`: fail-closed local-only composer that imports the existing **V99-G verified Firebase ID-token boundary**, existing **V99-F real Firestore Admin transaction adapter**, and **V99-I immutable JSON-only catalog**. Refuses any project other than `demo-psn-v99f-firestore`, any emulator host other than loopback `127.0.0.1:9099` (Auth) and `127.0.0.1:8089` (Firestore), service-account credentials, or an Admin Auth SDK tied to a different project. Always requests Firebase token revocation checking.
- `security-proposals/v99j/combined-local-emulators.json`: two demo-only loopback emulator ports; never a production Firebase deployment mapping.
- `scripts/test_grade11_combined_local_review_v99j.cjs`: synthetic student + real Firebase Auth Emulator token and Admin SDK verification + actual Firestore Admin SDK **atomic report and rate transaction** + frozen original MCQ source IDs. Also tests isolated V99-C browser-client rule denial with fake student/teacher roles, duplicates, cooldowns, wrong enrollment, tampered tokens, fake source IDs and storage failures.
- `.github/workflows/validate-grade11-combined-local-review-v99j.yml`: read-only GitHub Actions workflow using Node 24, Java 21, pinned SDKs, both local Firebase emulators and only synthetic summary evidence.

The full pinned source bank contains Unit 1 **275**, Unit 2 **206**, Unit 3 **220**, Unit 4 **640**, Unit 5 **349**, Unit 6 **560** = **2,250 public practice references**. The test deliberately exercises original Unit 3/5 master IDs. No question stems, answer keys, student results, emails, passwords or Firebase ID tokens are included in test artifacts.

## Security and behavior boundaries

This PR does NOT:
- Create an HTTP/Callable route or Cloud Function or deploy a Firebase Function.
- Turn the existing student **Copy issue report** button into a live sender or add notifications, admin inbox, grading, report editing, emails, profile changes or real academic enrollment records.
- Modify or publish the owner's actual deployed Firestore Security Rules, student rights, Firebase Auth settings, production database or website.
- Modify any existing textbook-aligned MCQ, option, answer, explanation, SLO classification or visual branding.

The isolated V99-C rule fixture used here is a **test-only policy** and is NOT the complete production policy. V99-D checked the owner-supplied baseline separately; any future real deployment must review the **current published** version again. A working emulator is *not* authorization to activate public reporting.

The authenticated `createLocalReviewPipeline` is exported only as an **offline test factory**; production must not copy its demo-only project guards or bypass App Check and anti-abuse. No live student submission is enabled by this PR.

## Merge gate

Keep **Draft** until the *latest-head* `Grade XI Local Auth + Firestore + Pinned MCQ Report Integration (V99-J)` check passes and the test log confirms real Admin SDK transactions + true emulator-issued Firebase Auth tokens. Review this note and the four-file diff. Only then select **Ready for review → Merge pull request → Confirm merge**.

The next separate stage should focus on explicit server-only request shaping, security controls and rollback strategy before even considering a production endpoint. No extra GitHub secrets or Firebase Console settings are needed here.
