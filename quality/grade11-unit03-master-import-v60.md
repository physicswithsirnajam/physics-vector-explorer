# V60 - Unit 3 master MCQ expansion: momentum and collisions (source-safe portion)

## Existing baseline
- PR #49 merged, 36/36 post-merge checks. Public five-unit Test Builder: U1 275, U2 206, U3 80, U4 80, U5 349; total 990.
- V60 retains all originals and adds 140 provisional Unit 3 MCQs, resulting in U3 **220** and combined **1130**.

## Original source control and revision discrepancy
- Student source: Grade_11_Physics_Unit_3_MASTER_Student_Edition.pdf, 115 pages, dated Oct 10, SHA256 e9dc7e4ec9081cd881f8becb2408f503f48eb72ecaa99d195c83461f774f8df9.
- Teacher key: Grade11_Unit3_QC_TEACHER_KEYS_COMPLETE.pdf, dated Oct 11, SHA256 635f510251b78639f3bf2d22a9be71d3c226596e202f72cd11c7242966bed330.
- Corrections: Grade11_Unit3_QC_AUDIT_AND_CORRECTIONS_REPORT.pdf, dated Oct 11.
- The available earlier Student Edition disagrees with Oct11 teacher answer option letters in Topic 3.1 and Topic 3.2. The QC report describes a later corrected **130-page Student Edition**, but that edition is not currently accessible. **HOLD** Topic3.1 60, Topic3.2 80, end-of-unit 9 and A/B/C 240 assessment MCQs until the corrected student source can be checked against its key. These are not imported.
- The earlier 115-page source and later teacher key agree structurally in Topics 3.3 and 3.4 except two numerical source corrections to 61.6 m/s explicitly required by the Oct11 QC report (Topic3.3 Q34 and Q44). Both corrected option text and source-calculated answer are audited with clear provenance. Do not represent this as comprehensive independent item-by-item signoff.

## Source records and framework distinctions
- Topic 3.3 Law of Conservation of Momentum: 60 additional questions = 40 straight + 20 scenario (five complete groups of four); all **FORMATIVE P-11-B-11**.
- Topic 3.4 Elastic and Inelastic Collisions: 80 additional questions = 56 straight + 24 scenario (six complete groups of four); **SUMMATIVE P-11-B-12 / P-11-B-13**.
- 140 new = 96 straight + 44 scenario in 11 groups; existing 80 remain untouched with six groups.
- Unit 3 central Test Builder: **All 220**, **Summative 160**, **Formative 60**, **17 complete scenario groups**. Existing stand-alone 40-MCQ and 80-MCQ summative paper pages remain independent.
- Questions are public, provisional educational self-practice, status teacher-review-pending, boardEligible false. No private cloud saving for U3.

## Technical implementation
- Two public compressed base64 parts carry 140 complete source records and 11 shared original scenarios; total base64 length 13820, FNV checksum d73d09df. No third-party requests, code eval, account changes, original academic source rewrites or unsafe HTML.
- Adapter loads and verifies parts; browser native DecompressionStream expands compact source data; original scenario text HTML-escaped; failed source/unsupported browser errors fail closed.
- Existing Unit 3 source 80 MCQs and original Unit5 349 MCQs remain unchanged. Manifest/catalog/student guide/Unit3 desk reflect 220 Unit3 and 1130 total.
- All source text and teacher answer options are compared to the original PDFs; only the explicit corrections to 61.6 are applied.

## Browser and source QA
1. Verify source hashes, compressed payload integrity, 140 unique source records, two topic inventories, 11 groups and documented corrected numerics.
2. Verify adapter yields 220 records, first 80 byte-equivalent question/option/key/explanation fields, 60 formative vs 160 summative, all 17 complete scenarios and no duplicate MCQ IDs.
3. Real Chromium: Unit3 builder shows 220 All, 60 Formative, 160 Summative; 40 Scenario-only launches with intact stimulus; mixed U1+3+5=844; guide total=1130; mobile 390px; Unit3 cloud save disabled.
4. Re-run existing V55, V56, V59, and V57 regression checks for all original banks and the student guide.

## Next safe imports
- Request the corrected **130-page Unit 3 Student Edition** (matching the Oct11 keys). Then verify the 389 held master MCQs item by item and deduplicate against original online 80.
- Continue with Unit4 full topic master, QC scope classification and complete scenario groups. No student exam approval implied.
