# V99-D — Full Existing Firestore Rules + Future MCQ Report Queue: Private Emulator Regression

## Prerequisite and hard safety boundaries

PR **#164** merged at `d7305b11c4250edffaeeb64a8d92b4de500843bc`. Its isolated Firestore Emulator suite passed 34 tests for the proposed administrator-only read/client-write-deny report collection. **That isolated fixture did not contain the existing Firestore policy** and must never be published to the user's live Firebase project.

The owner has provided **two matching, 227-line Firestore Rules files**, with different CRLF/LF line endings. This file is a source-provided baseline, **not independently retrieved from the published Firebase version**. After normalizing line endings and a single trailing newline, its SHA-256 is:

`c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39`

We deliberately **DO NOT commit the owner's complete 227-line policy to the public GitHub repository**. A real full-policy emulator test must receive those bytes privately. PR #165 is therefore a **gated test runner**, not a new set of deployed rules.

## One-time owner action: configure private GitHub Actions secret

1. Open the connected GitHub repository: <https://github.com/physicswithsirnajam/physics-vector-explorer>.
2. Select **Settings → Secrets and variables → Actions → New repository secret**.
3. Enter the exact name **`PSN_FIRESTORE_BASELINE_RULES`** (case-sensitive).
4. In **Secret**, paste the **entire exact Firestore rules text** the owner provided (beginning with the Portal V17 comment and ending after the final closing brace). This is a **rules source text**, not a password or service account. No base64 encoding is needed.
5. Select **Add secret**. GitHub stores the value encrypted and does not show its full contents again. Avoid adding the text to a GitHub PR comment, discussion, issue, public file, screenshot, or workflow command.
6. Return to **PR #165 → Checks**. The first run is **deliberately red** while the secret is absent. Once the secret has been saved, use **Re-run failed jobs** on the failed GitHub Actions run, or tell ChatGPT “secret configured, pal” so the failed job can be rerun through the connected GitHub integration.
7. **Do not merge the PR until this exact-head full-policy emulator job passes.** The workflow must never silently skip this private rule baseline or substitute the isolated V99-C fixture for it.

**Note on security:** GitHub Actions repository secrets are readable to eligible workflows on trusted repository branches. Only repository collaborators you trust should have write access to workflows. This secret contains *rules source text only*. **Do not store or paste Firebase service-account JSON, private keys, passwords, ID tokens, OAuth refresh tokens, or personal student records.** If you'd rather not store the rules in a GitHub Actions secret, use a local offline emulator run with the same test script instead and leave the PR unmerged until tests have been verified.

## What the full-policy test executes

`scripts/test_grade11_full_firestore_rules_v99d.cjs`:
- Rejects any project other than `demo-psn-v99d-full-rules` and emulator host other than `127.0.0.1:8089`, preventing fallback to a production Firebase project.
- Reads the rules source **from the encrypted environment variable only**. It normalizes line endings, validates the precise owner-provided SHA-256, requires one original `verifiedAdmin()` and one catch-all deny. It never logs, writes to a tracked repository file, stores in an artifact, or publishes the original policy.
- Inserts only this **isolated proposed addition immediately before the existing deny-all match** (the original policy is left byte-for-byte intact):

```javascript
match /mcqReviewReports/{reportId} {
  allow get: if verifiedAdmin();
  allow list: if verifiedAdmin()
    && request.query.limit != null
    && request.query.limit <= 25;
  allow create, update, delete: if false;
}
```

- Runs the **complete original-plus-proposal policy** against Firebase Emulator with synthetic anonymous, student A/B, unverified student, forged browser teacher role, unverified administrator, and verified administrator identities.
- Checks existing profile own-access/admin bounded-list/create-update constraints; existing one-time Grade XI/FBISE enrollment; Unit 1–2 owner practice history and prohibited Unit 3/forged results; privacy-request creation/owner/admin reads; specifically named pilot and three course lessons; catch-all deny; and proposed report get/list/unauthorized access/bounded query/all direct browser write denials.
- Uses only synthetic user IDs and data, not actual students' records or email addresses.
- Writes **only a summary of expected allow/deny cases** to `qa-artifacts/full-firestore-rules-v99d/audit.json` and `report.md`, retained in the evidence artifact. No rules source text is present in the artifact.

**Production truth:** Even a full emulated test cannot prove that the provided text is still the **currently published** Firebase rules; compare the live Firestore Console published revision before any production change. Firebase ID-token custom claims can only be issued by a trusted backend; simulated test claims validate rule conditions but cannot prove real account administration is configured correctly.

## Why reports are still copy-only

The proposed report rule intentionally keeps **all client creates/updates/deletes disabled**, even for verified administrators. Student submission would later require a trusted backend endpoint, which must verify Firebase ID tokens and email verification, validate the Grade XI question reference, enforce rate limits and abuse controls, inject a server-controlled report status/owner/time, and acknowledge **successful receipt only after a real write**.

Teacher/admin review mutations must likewise use server-authorized operations with an audit trail; no public browser script should set teacher roles or overwrite reports. Existing student question answers, grades, history, protected lesson data, and the official Physics with Sir Najam logo are unaffected by this PR.

## Important differences between file review and full policy testing

The submitted rules' top-level comments refer to “Portal V17” and also mention “V18” practice saving. Those are **version labels in the file**, not evidence of which edition is actually live. No changes to the comments are required for this PR.

No Firebase production console configuration, Storage rules, course content publication, cloud deployment, service account or current live database record is touched. This PR is a **security regression test harness only**.

## Merge procedure once verified

Leave PR in **Draft** until the owner adds the private rules text and a **real full-policy emulator workflow is green on the latest head**. Review the access-matrix artifact. Then click **Ready for review → Merge pull request → Confirm merge**. No live Firebase publication should follow from merging this test-only PR.
