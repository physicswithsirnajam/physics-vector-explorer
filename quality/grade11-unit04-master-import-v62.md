# Grade XI Unit 4 V62 — Corrected Topics 4.3 and 4.4 master MCQs

## User's source and exact matching
- Corrected owner-supplied **Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx** (8 Oct 2026), SHA256 \`925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777\`.
- Original Topic 4.3 (Moment of Inertia) bank: 80 printed source questions, including six four-question scenarios. Topic 4.4 (Angular Momentum): 80 original source questions, including six four-question scenarios. Each question's **printed four options, correct source answer letter and explanation** was matched to its original Word topic answer table.
- Critically, the source DOCX's **run-level superscripts/subscripts** were read directly, rather than heuristically reconstructed from plain extracted text. This preserves \`r²\`, \`kg m² s⁻¹\`, \`R₁² + R₂²\` and original formulas.
- **Five original Topic4.3 MCQs withheld** pending actual source Figure4.13. Q38 explicitly asks about that figure; source scenario 4 Q69–72 refers to the axis "shown in the source figure" and its four MCQs must stay together. No figure, diagram or formula was fabricated or substituted.
- Topic4.3 imported **75 questions: 55 straight + 20 contextual in 5 intact 4-question scenarios**.
- Topic4.4 imported **80 questions: 56 straight + 24 contextual in 6 intact 4-question scenarios**.
- Combined release imports **155 provisional MCQs: 111 straight + 44 contextual in 11 intact 4-question scenarios**, no partial groups.
- Original 80 Unit4 V39 classroom paper and its teacher key, projector, SLO-focus, print/OMR and separate descriptive practice **remain unchanged**. Prior 160 Unit4 Topic4.1/4.2 central questions and their 12 original scenarios are retained.

## Central Test Builder after V62
- Unit 4 **395** = 80 original classroom-source + 80 Topic4.1 + 80 Topic4.2 + 75 Topic4.3 + 80 Topic4.4.
- Unit 4 **29 complete scenario groups** = 6 original + 12 V61 + 11 V62; 116 scenario MCQs and 279 straight MCQs.
- Five published units **1445 MCQs** = U1 275 + U2 206 + U3 220 + U4 395 + U5 349.
- Remaining master-source Unit4: **245 unimported** = 240 Topic4.5–4.7 plus 5 figure-dependent Topic4.3 questions. Additional teacher source-check and diagram reconstruction are needed for the five held questions; never silently force partial scenario imports.
- All new items \`status:teacher-review-pending\`, \`boardEligible:false\`, \`difficulty:Unspecified\`, \`cognitiveLevel:Unspecified\`; source SLOs are topic-level candidate arrays: Topic4.3 B-18, Topic4.4 B-18/B-20. **These are not certified individual question SLO classifications, official FBISE keys, or authenticated school grades**.
- No cloud-saving for Unit4 or mixed-unit tests; only existing single Unit1/2 private saved attempts. No Firebase/Firestore permissions, roles, student history, original logo or authentication changed.

## Exact source archiving
- Three checked gzip+base64 PUBLIC assets \`question-bank/grade-11/unit04-v62-part{1,2,3}.b64\`; lengths **5500, 5500, 2684 characters**.
- Combined length **13684 chars**, FNV32 **55b60683**. Source document SHA256 embedded and checked. Archive records 155 source question stems, four options, answer letters, explanations, 11 complete situation texts, and exact list of five held figure questions.
- Adapter checks no duplicate IDs or exact normalized stem+option text, all 395 entries, all 29 complete groups, source provenance and academic warning metadata. Any missing/corrupted file fails closed rather than silently shortening practice.
- Existing V61 first-160 and original V39 source records are checked unchanged.

## Browser/CI acceptance
- \`scripts/test_unit04_master_v62.cjs\`: archived source key/option/figure hold check; all 155 source-to-adapter matches; original classroom80 source unchanged; no duplicate ID/text; complete 11 new four-question scenarios; 395 total; no accidental figure items; examples of original math formatting.
- Playwright launches **40-question scenario-only Unit4 practice** and mixed **Unit3 + Unit4** practice with **615 available questions**, per-unit result breakdown, no cloud save, mobile 390px guide displaying 1445.
- V61 regression tests first 240 and original paper, V55/V56/V57, Unit3/5 master imports and source browser checks remain active. All 37+ repository checks on the **final PR HEAD** must be green before merging.
- Manual teacher sign-off still required to verify scientific correctness, wording, SLO applicability, and Google Sites iframe + phone viewing; automated source agreement cannot certify Physics correctness.

## Follow-on
1. After merge, proceed through corrected Topic4.5–4.7 source MCQs in controlled, fully checked source batches.
2. Recover source Figure4.13 and independently validate the five held Topic4.3 items before adding them.
3. Finish held Unit3 Topics3.1/3.2 corrected 130-page student source reconciliation; audit Unit5 extra assessments and Units1/2 master completeness; then move to new Unit6 content.
