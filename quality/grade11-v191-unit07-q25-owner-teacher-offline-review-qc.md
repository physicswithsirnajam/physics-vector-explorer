# V191 — Grade XI Unit 7 Q25: actual private teacher review worksheet and source-safe offline evidence note contract

**Decision: HUMAN REVIEW REQUIRED / TEACHER PENDING / SCORED HOLD.** PR #294/V190 was verified merged to `main` at `53712aa0e269a73de4597be9884cdfc872c28773`. V191 is a small step from a simulated review state machine to a **practical private worksheet** for the precise V189 revised Q25 candidate. It does **not** implement or pretend to authenticate any teacher.

## Exact private source reopened

- Original owner Word source: `Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx`, SHA-256 `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58`, containing Topic7.1 **original Q25** with its four source options, original answer and explanation. The source was reopened and the original was preserved without change.
- Private V189 revised candidate and manifest: `V189_PRIVATE_2_Candidate_Revision_Proposal.json` and `V189_PRIVATE_2_Candidate_Revision_Manifest.json`. The revised question is `XI-U07-T071-Q025`, bound to original source-row SHA-256 `27d9b15ebe860eca6b4788d6420db4230e6266295027ef01d28ca2383a7f5353`. Its exact candidate stem, four options, proposed key, explanation, **private revision digest**, and supporting notes were reopened **outside GitHub**.
- A new **three-page Word worksheet**, `Unit7_V191_PRIVATE_Q25_Teacher_Review_And_Decision_Worksheet.docx` (SHA-256 `eabfeb97e1fe702922abadd3fd4301f85c7a6ede512fedda8d640750a9a7a7f9`) was rendered to page images and visually checked. Page 1 shows original-versus-revised content and the exact private candidate revision. Page 2 checks each option, the physics, correct FBISE SLO/cognitive match and source limitations. Page 3 provides **blank** human teacher science/SLO and owner decision fields and a hard scored-HOLD reminder.
- **Privacy:** all original/revised stem texts, options, keyed answer, complete explanation, candidate revision SHA, and the private worksheet **remain outside public GitHub**. The public contract records only existing keyless source identities and a whole-private-file checksum. It does NOT leak question text or a content-derived private item hash.

## Academic observations — no false approval

FBISE HSSC-I Physics **2025** assessment framework's **P-11-B-22** is **Summative / Understanding** and concerns distinguishing crystalline, glassy, amorphous and polymeric structures. The proposed V189 Q25 is a plausible one-best-answer structural classification task about **short-range order without extended crystal periodicity**. The original owner study answer is preserved; the separate V189 revision made its distractors more educationally credible than the earlier V188 private candidate.

However, a teacher must independently decide:
- Whether the proposed keyed choice is uniquely and scientifically defensible relative to its other **three** alternatives, including the statements about single-crystal, polycrystalline and polymeric interpretations;
- Whether the distinctions and language are appropriate to the **direct** named summative outcome or only supporting conceptual practice. The current four options do **not explicitly name glassy structure**, one of the official named classes; that absence alone does not prove misalignment but warrants deliberate human outcome-scope review;
- Whether the provisional cognitive level is genuinely **Understanding** (not definition recall), the science assumptions are fair, the item is accessible and unambiguous on a mobile device, and the original source attribution is justified.

The exact NBF textbook teaching pages **113–116 were not independently reopened in V191**. Previous page **114**, **115**, **Example 7.2** and separate apparatus-image permission matters remain outstanding across Unit 7; the V191 worksheet is **not** evidence those text/figure sources have been cleared. The reviewed framework is the referenced **2025** version; no claim that it is definitively the latest is made.

The V189/V190 policy for **Q22** remains unchanged: approximate macroscopic isotropy of randomly oriented polycrystalline grains is supporting study, not automatically direct B-22 summative content. No user-owned original questions or prior private candidate hashes are altered.

## Offline evidence receipt tests — never a teacher verdict

The two new Node files implement and test a **keyless offline note receipt** for existing source IDs. It binds a source ID and already public original source-row fingerprint to a *mock* candidate revision digest, and records six review categories: `sourceFidelity`, `science`, `distractors`, `summativeSlo`, `accessibility`, and `rights`.

Only `NOT_ASSESSED`, `ISSUE_IDENTIFIED`, and `NOTES_CAPTURED_OFFLINE` are accepted as offline findings. An `APPROVED`, `SIGNED_OFF`, invented reviewer role, or student-release field is a hard schema failure. Even if **all six notes are recorded**, the output explicitly states:

`authenticatedTeacherIdentityVerified: false`, `scienceApproved: false`, `cognitiveApproved: false`, `ownerScoringAuthorized: false`, `scoredTestBuilderEligible: false`, `studentScoredRelease: HOLD`.

An evidence hash is merely a local reference, **not scientific proof**, a trusted timestamp, a server signature or an authenticated reviewer. An offline completed checkbox does not transfer into a real approval. All GitHub tests use **synthetic SHA values only**, not the private V189 revision hash or keyed question text.

## Four-plus-one file boundary and unchanged project status

Exactly **five new public files**:
1. `scripts/unit07_offline_review_evidence_v191.cjs` — pure local note/schema validator and guaranteed HOLD output.
2. `scripts/test_grade11_unit07_offline_review_evidence_v191.cjs` — synthetic valid/invalid receipts, fake-approval rejection, original source/SLO no-score checks and previous release gates.
3. `quality/unit07/unit07-v191-q25-private-review-readiness-no-keys.json` — public Q25 source-safe worksheet reference, private SHA withheld and zero approval status.
4. `quality/grade11-v191-unit07-q25-owner-teacher-offline-review-qc.md` — this academic/source boundary memo.
5. `.github/workflows/validate-grade11-v191-unit07-q25-offline-review.yml` — V191 and all older Unit7, original bank, Unit6, App Check and teacher backend NO-GO regressions.

The broader Unit7 original inventory is **274**, detailed private candidate queue **72**. There are **ZERO real individual authenticated science/cognitive/owner score approvals and ZERO scored Unit7 student questions**. Public V185 per-item candidate SHA values stay null; no score is silently released. Earlier V160 production decision is `NO_GO_DEPLOYMENT_BLOCKED`, and V161 staging and production decision is `NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT`.

**No Firebase Auth/Firestore Rules, App Check setting, teacher role, private source Word, NBF scan, student record, published question bank, billable infrastructure, production/staging deployment or school site is changed.**

## Next owner actions and V192

1. Keep the actual private Word worksheet confidential and have an authorized subject teacher independently review the scientific choice and three distractors, precise B-22 summative scope/cognition and source/rights issues. Leave any unanswered issue marked unresolved, and do not treat marks as system signoff.
2. If that reviewer recommends a change, preserve the V189 version and generate a **new private candidate revision SHA** for the edited stem/options/key/explanation. Previous notes cannot be carried to a changed revision as authorization.
3. A future real system will require separately approved storage/architecture/billing, verified Firebase Rules/App Check, genuinely authenticated and revocable roles, server-owned revision-bound audit records, and independently recorded owner scoring authorization **before** any scored Test Builder import.

**V192:** owner-guided human review of Q25 against the private worksheet; only after explicit approval of a secure infrastructure design should authenticated decision intake be considered. No automatic publishing.

**Owner merge instructions:** keep this PR Draft until both exact latest-head GitHub checks pass. Review **five files** in Files changed, then Ready for review → Merge pull request → Confirm merge. Do not merge on red/pending/stale checks.
