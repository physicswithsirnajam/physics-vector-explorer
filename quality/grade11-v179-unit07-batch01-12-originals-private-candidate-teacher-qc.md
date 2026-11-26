# V179 — Unit 7 first teacher-review tranche: 12 exact-source-matched originals and separate private candidate drafts

**Decision: 12 original MCQ rows verified against the three previously fingerprinted owner Word sources; 12 separate proposed candidates prepared in a private, rendered 10-page teacher DOCX; ZERO authenticated teacher signoffs and ZERO scored student releases.**

**This PR is an amendments-only, keyless academic queue, not a release or a publisher-authorized answer key.** The original 80-item files are unchanged. The private teacher pack has the actual original stems, options, original keyed answers/explanations, the new separate candidate stems/options and proposed explanations, source-identity status, SCIENCE/SLO decision spaces, and explicit HOLD. The pack is a **conversation attachment**, not committed to public GitHub. No original or revised answer letters, stems, keyed solution values or copyrighted source images are included in this public report.

## Verified private source editions (not just matching filenames)

| Source | Verified actual raw file SHA-256 | Source register | Selected original question numbers |
|---|---|---|---|
| Owner Topic7.1 FBISE boxed study-with-answers DOCX | `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58` | V154 exact match; earlier V149 question-only proposals checked | **10, 15, 62, 76** |
| Owner Topic7.2 PartA study-with-answers DOCX | `a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada` | V168 exact match | **9, 33, 39, 57, 80** |
| Owner Topic7.3 PartA study-with-answers DOCX | `f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279` | V173 exact match | **3, 35, 64** |

I initially suspected the available Topic7.1 FBISE-formatted file was a different original. **Direct SHA comparison establishes it is exactly the previously reviewed V154 owner source**, resolving that source-identity concern. However a matched original is NOT a repaired explanation or a signed answer.

The privately generated `Unit7_V179_Teacher_Review_Batch01_PRIVATE.docx` (SHA-256 `a62d795451e9ddc7e93be2e9080c9874ef25f0fbc5882f748f39d236201360c9`) was rendered and visually checked. **Its contents are private and will not be uploaded into this PR or the scored question bank.**

## Twelve concrete source-preserving teacher decisions

| Section and original | Status and issue | Private candidate action; original retained |
|---|---|---|
| **7.1 Q10** | **Compulsory**: original explanation implies nylon is listed in the particular source passage's synthetic examples, contrary to earlier V154 passage-specific review. The original intended natural-polymer choice is physically defensible. | Existing V149 candidate replaces an off-passage distractor. Rebuild explanation using only verified named natural/synthetic examples; check NBF p114 before final approval. |
| **7.1 Q15** | **Compulsory**: original narrows sulphur to a molecular crystalline label not specifically asserted by the examined passage. | Existing V149 candidate asks about source-listed crystalline nonmetal instead. Retain source, seek teacher wording approval. |
| **7.1 Q62** | **Compulsory**: original wording about “random long-range arrangement” is scientifically imprecise. | Existing V149 changes to **absence of regular repeating long-range arrangement**; original source retained. |
| **7.1 Q76** | **BLOCKING**: original **nylon** explanation falsely claims NBF passage listed nylon among its synthetic examples. V149 created a **polythene** replacement but the original explanation did not automatically change. | Keep original archive but block source-key import; approve the separate V149 candidate and a *new correctly source-linked explanation* only after teacher and source-page review. |
| **7.2 Q9** | **Compulsory**: identifying five loads via missing Figure7.8 is not standalone; original K recognition is below official B-23 U. | Provide all five physical actions in a self-contained stress-mode scenario; proposed U-level review. |
| **7.2 Q33** | **Compulsory**: point D depends on absent ductile stress–strain diagram and duplicates Q80's ultimate-strength question. | Describe peak engineering stress in a standalone context; one-per-short-test rotation with Q80. |
| **7.2 Q39** | **Compulsory**: absent Table7.1 and malformed comparative distractors. | Give two steel/aluminium Young moduli locally; test applied strain comparison at same stress, B-24 Application rather than table lookup. |
| **7.2 Q57** | **BLOCKING standalone**: original refers to NBF Example7.2 but omits numerical inputs. Earlier optional rounding label does not override this. | New private candidate specifies force, bone length/radius, modulus and model; numerical answer independently recalculated from original owner explanation inputs. **Reopen original NBF Example7.2 page before signing the input data.** |
| **7.2 Q80** | **Compulsory**: same unsupplied graph-point concept as Q33; close semantic duplicate. | Optional candidate contrasts fracture at E with maximum stress at D, using a self-contained verbal graph context. Keep original for practice but rotate in scored sets after teacher approval. |
| **7.3 Q3** | **BLOCKING**: named NBF Figure7.13 apparatus is not attached to randomized MCQ. | Supply a self-contained reference/test-wire and vernier experimental description or an authorized labelled original diagram with alt text. Reassess actual Understanding demand under B-25. |
| **7.3 Q35** | **Compulsory**: equal final force and extension do not determine work without both loading paths; original global linear assumption is absent in standalone MCQ. | New candidate locally states **Hooke’s law, zero-start loading** and computes triangle area/work (B-27 Application). |
| **7.3 Q64** | **Compulsory SLO remap**: correct physics explanation of **permanent plastic extension** is mapped to B-28 elastic energy rather than direct B-26 plastic/elastic deformation. | Preserve original answer and physical interpretation; separate reviewed candidate uses B-26 Understanding, not automatically B-28. |

**No original-answer blanket error claim.** Some questions have scientifically correct original answers but missing standalone context; one original explanatory attribution is a hard blocker (Q76). Two item pairs warrant duplicate-aware Test Builder sampling, particularly 7.2 Q33/Q80. Original physical answers were checked against the actual Word rows, while every proposed candidate is still just a draft.

## Teacher authorization requirements

The official named **summative FBISE SLO and expected cognitive demand** must match the final item, not simply the original tag. The private DOCX contains candidate stems, four proposed alternatives, planned answers and explanations **for teacher review, not as a future auto-import**. Each source-safe row is tracked by section-prefixed original ID, existing original-row SHA and source full-file SHA. Public metadata retains no answer payload.

The teacher must review every proposed answer and distractor, correct any source-example attribution, approve the original-vs-candidate disposition, verify missing textbook figures/data, and sign off science, cognition and permission to score **individually in a protected, authenticated workflow**. Merely marking the private document or merging GitHub PRs will **not** create backend credentials or academic signoffs.

**Two additional original NBF pages needed before final scientific source closure:** (a) printed **p114** for the natural/synthetic polymer examples used in Topic7.1 Q10/Q76, and (b) the printed page showing **Example 7.2** bone-shortening values used in Topic7.2 Q57. The original NBF scanned textbook remains the strongest source; the earlier review ledgers are not a substitute for the actual printed example.

## Boundaries, CI and following work

This V179 PR adds four nondeploy files: a **12-row keyless register**, this amendments-only teacher memo, a deterministic original-source hash/signoff HOLD/duplicate-source audit, and a GitHub Actions workflow. It retains V178 274-item counts, seven older source ledgers, Unit6 560 pending and Grade XI Units1–6 2250 pinned identities. **No student question bank, backend, Firebase settings, private source keyed files, App Check, billing, domain or student profile is modified.**

**CI can confirm the three previously recorded source DOCX SHA strings, 12 archived row hash references, private pack's reported checksum, no-public-payload restrictions, pending teacher decisions, zero scored releases and prior release locks. It cannot independently reconstruct the private Word/pack or authenticate a teacher.**

**Next V180:** complete source-image closure for the two outstanding NBF references and run another small teacher-review tranche. No portal scoring release without actual authenticated teacher signoffs and explicit production/staging approval.
