# V207 — Student-reported Grade XI Unit 2 MCQ 119: standalone question-context repair

**Student report:** `XI-U02-MCQ-0119`, raw bank version `v19-dependent-question-context-review-2026-11-14`; a student testing independently found the question referring to unseen source Q116. The displayed alternatives were shuffled; the student reported option **C = 14/√20**. The original source key is **A = 14/√20** before display shuffle. Neither is contradictory: the correct *mathematical value* is identical.

## Reproduced science/UX defect

- Source Q116: A = 5i + j; B = 2i + 4j, with perpendicular i/j.
- Source Q119 asks for scalar projection of A on B **"for Q116"** without giving the vectors.
- A randomized attempt need not contain Q116. The question is therefore not fair or self-contained when selected alone.
- Dot product A·B = 14; |B| = √20; scalar projection A on B = 14/√20.
- The original key and explanation are physically correct. This is **missing context**, not an incorrect answer.

## Bounded repair

The public `shared/practice-bank-adapter-v55.js` now overlays a **presentation-only** display context on one verified stable ID, `XI-U02-MCQ-0119`:

1. It supplies the equivalent ordered component pairs A=(5,1), B=(2,4) along perpendicular x/y unit axes in both visible HTML and plain text.
2. It preserves the original question stem referring to Q116, while the **visible local stimulus supplies the complete Q116 vectors** so random selection remains self-contained. This also preserves legacy source-fidelity regression expectations.
3. It retains the original four option texts, keyed original option A, explanation, SLO, question ID, source Q119 and bank version.
4. It records `contextSourceQuestionNumber:116` and `presentationContextRevision:v207-unit2-q119-standalone` in the adapted public view. It **does not** create a group scenario or expose hidden account data.
5. It fails closed if the source Q119 stem, key or source option A changes unexpectedly.

**Immutable source promise:** `question-bank/grade-11/unit-02.json` and its `question-bank/manifest.json` SHA-256 remain untouched; this is an annotation overlay rather than silent alteration of the owner's original solved source. The 206 Unit 2 MCQs, 15 original four-question scenarios, 2,250 Unit 1–6 public provisional questions, any owner/private signoffs, Firebase settings, roster, and reports are unchanged.

## Validation and rollout boundaries

The separate Node regression loads the actual V55 adapter in a closed, mocked local runtime, verifies the complete 206-item Unit 2 practice bank, all 60 existing common-stimulus items, source immutability, original key/answer identity, Q116-to-Q119 data transfer, and the four previously restored dependent contexts (#4/#13/#15/#153). CI also runs the existing pinned source SHA and all-2250 static reference checks.

Source-identity/hash tests and this targeted scientific calculation **do not** constitute an independent approval of the other Unit 2 questions, official FBISE cognitive tags, or secure examination keys. Student reports are still **copy/share only**; no automatic message reception or teacher inbox is deployed.

**Owner steps:** Leave the PR Draft until *every latest-head check* has passed; review adapter-only runtime overlay, one Node test, one read-only workflow, and this note. Then **Ready for review → Merge pull request → Confirm merge**, and test Unit 2 MCQ 119 via a new independent practice session on the published site. Do not change student accounts or Firebase settings for this correction.
