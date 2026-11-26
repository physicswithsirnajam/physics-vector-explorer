# V188 — First two actual PRIVATE Unit 7 candidate revisions: item-level identities, no academic signoff

**Academic decision: HOLD / NOT APPROVED / NOT DEPLOYED.** PR #291/V187 is confirmed merged into `main` at `8844e9ab1f8d00e4af70b78eed18ebbea6ad3f98`. V188 is our first tiny local content-identity pilot using **actual privately authored proposed candidate text** rather than invented synthetic fixtures. It still cannot grant authenticated teacher science, cognitive or scoring approval.

## Exactly what was reopened and verified locally

- The owner's actual **`Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx`** file was reopened; its SHA-256 matches the previous V154 source register: `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58`.
- The actual private **`Unit7_V184_Teacher_Review_Batch06_PRIVATE.docx`** file was reopened; its whole-file SHA-256 matches the recorded V184 pack: `c63f8ed1c9fe68d3e331971e258d2b2104da58a098ca8b2975a83c16b6356980`.
- **Topic7.1 original Q22 and Q25** were individually cross-checked: each original stem, **all four source options**, original keyed letter and original explanation match the original 80-question owner file. The previously proposed revised candidate stem/options/key/explanation was then extracted from its distinct V184 private review table, with **provisional P-11-B-22 / U** assignment and **no diagram**.
- Exact previous **V185 public source-row SHA-256** fingerprints were compared to both selected IDs: `XI-U07-T071-Q022` and `XI-U07-T071-Q025`. These are two existing members of the 72-item queue, **not two new original questions**.
- A **private** two-candidate JSON input and a **private keyless** two-item SHA manifest were created in the conversation working area (not GitHub). The candidate revision SHA-256s were independently recalculated in Node using the **V186 versioned canonicalization convention** and matched both manifest entries.
- The pilot JSON and derived keyless manifest must be treated as **confidential**, even though the latter omits answer letters: its hashes originate in private keyed content. **Never upload either private file to public GitHub, Actions, Google Sites, the classroom portal or a public issue.**

### Important accuracy limitation

The local identity pilot **did not run the entire checked-in V187 command line program against a complete local copy of the 72-entry V185 source index**, and it did not independently reopen the entire NBF textbook or the official SLO framework. It reproduced the V186 Node digest convention for two exact private candidates and checked their source IDs and source-row SHA metadata against previously retrieved V185 entries. Public CI cannot rerun this private extraction, recompute the withheld digests, or claim that a human authorized the outcomes.

The scientific propositions underlying the two candidates are plausible: randomly oriented crystal grains can approximately average directional response on a macroscopic scale, while amorphous solids may retain local short-range order without a repeated long-range lattice. These checks are **model pre-screening**, not source-author attestation, independent laboratory verification, or an authenticated teacher approval. Both candidates still require human scientific checking, correct official theory-SLO scope and actual cognitive-level review, clarity/distractor review, source permissions and owner decision.

## Two-keyless-row public index

| Source ID (already public) | Academic concern addressed | Provisional official SLO / student demand | Scoring |
|---|---|---|---|
| `XI-U07-T071-Q022` | Polycrystal random-grain approximate macroscopic isotropy, with texture caveat | P-11-B-22 / U | HOLD |
| `XI-U07-T071-Q025` | Local-neighbour organization without long-range periodic repetition in amorphous solids | P-11-B-22 / U | HOLD |

**Neither the original nor the proposed private MCQ text, options, answer letter, complete explanation, actual candidate SHA-256 digest, sensitive private-input SHA-256 digest, or private manifest is committed in this PR.** Public metadata exposes only the same original source-row fingerprints already held in V185 and source-safe review categories.

## Status of the remaining Unit 7 work

- Wider original Unit7 inventory: **274** items with earlier first-pass QC.
- Six private teacher candidate packs prepared before this pilot: **72 distinct original-owner MCQ IDs**. This new pilot gives **two of those existing 72** a locally verified individual *candidate revision hash*, held **outside public GitHub**. The public V185 queue is **not mutated** and continues to show **72 null per-item revision hash fields** until a separately authorized protected import method exists.
- Remaining originals without separate candidate sheets: **202**.
- Authenticated teacher science signoffs **0**, cognitive signoffs **0**, independent owner scoring permissions **0**, and scored Unit7 student questions **0**.
- Full NBF printed p114 polymer examples, printed p115 conventional cubic figures, Example 7.2 bone-shortening data and independently cleared accessible apparatus artwork from earlier batches remain outstanding. These two pilot candidates were deliberately selected to avoid making new passage-specific or figure-dependent source claims. This **does not** clear the other source dependencies.
- V160/V161 teacher backend production/staging **NO-GO** remains in force. No real Firebase/role provisioning, Firestore/App Check policy or graded Test Builder import has been changed.

## Four-file GitHub PR / private artifacts boundary

1. `quality/unit07/unit07-v188-private-two-item-pilot-no-keys.json` — two source-safe original identities; self-reported private local candidate-digest exercise; withheld digests; teacher and scored HOLD.
2. `quality/grade11-v188-unit07-two-real-private-candidate-pilot-review.md` — this evidence and limits memo.
3. `scripts/audit_grade11_unit07_private_pilot_v188.cjs` — verify prior original source-row fingerprints, six-batch and 72-item index membership, public privacy and release H0LD invariants, with deliberate fail-closed mutations. No private file input or private content.
4. `.github/workflows/validate-grade11-v188-unit07-private-pilot-no-deploy.yml` — public-only audit with V187/V186, V185–V154, original Grade XI/Unit6, App Check and backend NO-GO regressions.

**The two private artifact JSON files and their short README are conversation attachments only, not PR changes.** Nothing in this PR implements an authenticated decision store or student-scored item.

**Next V189:** inspect these two exact private proposed questions for final science/distractor/SLO decisions, and design a secure owner-approved individual-review intake that binds the candidate hash to the eventual reviewer identity and version. No actual approvals, score release, backend staging or production actions may occur until independent academic and security gates are satisfied.

**Owner merge sequence:** keep PR Draft until both latest-head GitHub Actions checks are green. Inspect exactly four changed files → Ready for review → Merge pull request → Confirm merge. If a workflow is pending, failed or stale, do not merge. No Firebase Console, domain or billing task required.
