# V83 — Grade XI central Test Builder expands to partial Unit 6 Topics 6.1–6.4

## Academic source inventory
V82 PR #72 is verified merged. V83 reads its unchanged public `question-bank/grade-11/unit-06-topic-64-v82-80-source.json` directly, preserving all **80 original** continuity question stems, four original choices, answers and teacher explanations. The previously created original source archives for Topics6.1/6.2/6.3 remain unchanged.

Unit 6: Topic6.1 **79**, Topic6.2 **77**, Topic6.3 **78**, Topic6.4 **80** = **314** live provisional MCQs. The four archived source banks total **320** original questions. **Six** prior figure-dependent originals remain held (T6.1 Q11; T6.2 Q26/Q64/Q72; T6.3 Q24/Q80). The topic scenario/situation-labelled questions are **73 standalone** items, not any four-question shared stimulus; zero fake common-stimulus groups.

Original Units1–5 retain **1,690** selectable questions. Combined central Grade XI selectable items now **2,004** with unique IDs. No old question rewritten to manufacture scenarios. All Unit6 items continue to carry `sloCodes:[]`, `boardEligible:false`, `difficulty:'Unspecified'`, `cognitiveLevel:'Unspecified'`, and `stimulusSetId:null`. Topic6.4 teacher `sourceKeySloReference` is provenance, **not board-certification**. Full Unit6 course remains `status:'planned'`, `questionBankCount:0`; partial builder counter is separately `314`.

## Student and safety boundaries
The updated Test Builder and Practice Engine now let students select Unit6 alone or in any mixed choice of Units1–6, with random or compatible grouped practice. Scenario-only tests involving Unit6, summative-only Unit6, and exact individual SLO filters remain fail-closed unless independently certified. Public self-scoring is local/printable, not an official exam grade; no Firebase permissions, accounts, payments, source PDFs, original video links or private files have changed. Standalone Topic6.4 still works.

## Merge gate and manual QA
New V83 CI checks original teacher answer letters, 320 archive records, 314 live Unit6 records, six figure holds, 73 independent situations, full 2,004 unique IDs, all-four-topic source fidelity, failure on tampered Topic6.4 source key/SLO metadata, board/SLO/scenario safety, balanced six-unit allocation and real Chromium desktop/mobile quiz with 390px overflow check. Historical regressions updated only for current legitimate totals. Do not merge until all checks pass on latest PR HEAD.

After merge manually try a Unit6-only 20-MCQ practice, Units1+6 grouped practice, six-unit 30-MCQ balanced quiz, strict scenario-only or summative-only Unit6 rejection, the standalone 80-MCQ Topic6.4 preview, and totals 314/2,004.
