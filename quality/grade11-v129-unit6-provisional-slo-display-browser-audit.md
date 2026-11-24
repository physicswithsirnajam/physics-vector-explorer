# V129 — Correct Unit 6 provisional SLO badges in live Grade XI MCQ practice

**Source verified 24 November 2026.** The preceding read-only QC PR **#228/V128 merged with two successful workflows** and checked all **2,250** public provisional questions for simple structural and glyph/option signals. Zero findings in those selected categories did **not** constitute actual Physics answer verification, rendering signoff or a student-site browser test.

## Concrete student-visible issue

The original source files `question-bank/grade-11/unit-06-topic-61-v76-80-source.json` and the other six 80-item Unit 6 topics all classify their items as **`summative-topic-provisional`**, with `sloCodes: []`, a separate **`topicSloCodes`** array, and **individual SLO verification pending**. The existing `practice-engine/index.html` rendered every non-`formative` item as **“Summative theory”** and printed only `SLO: ` plus the empty per-item `sloCodes`. Thus a live Unit 6 quiz could deceptively show *“Summative theory”* beside an **empty item-level SLO tag**, even though its NBF/FBISE label is not certified. This was directly confirmed in original source code before this proposed change.

The original Unit 4 topic-level warnings and Unit 2/3 individually mapped summative tags were already present and must stay unchanged.

## Narrow correction

Change only the question-specific **practice badges**, without editing original question-bank JSON, SLO fields or academic signoff:

- For a `summative-topic-provisional` item: display `Topic SLO candidates: P-11-B-xx…` from **existing**, original `topicSloCodes`, or `not individually mapped` if empty.
- Display `Provisional topic practice — not item-verified` rather than the false definitive `Summative theory` badge.
- Add `Item-level SLO not independently verified`, matching the already careful language used for original Unit 4 master imports.
- For a genuine `summative-theory` item, retain **Summative theory** and the same item `SLO` codes.
- For a genuine `formative` item, retain **Formative**.
- Preserve all original source and answer keys; no assignment, certification or categorical scientific judgment is inferred.

**This is a display correctness fix, not new academic mapping.** Do not silently populate `sloCodes`, adjust `boardEligible`, alter the combined SLO statistics, or approve Unit 6.

## Real browser regression

New source-backed Playwright Chromium test `scripts/test_grade11_v129_unit6_provisional_slo_browser.cjs` visits the existing live `practice-engine/index.html` **locally** via an ephemeral read-only static server. It runs actual four-option public practice journeys for:

- Unit 6: source `summative-topic-provisional`, original topic candidates shown, explicit pending verification tag, no definitive “Summative theory” item badge.
- Unit 2: existing authentic `summative-theory` badge and specific item SLO preserved.
- Unit 3: existing summative-only filter and mapped item SLO preserved.

Check each unit at **1280px, 390px and 320px**. The smoke test confirms visible nonempty question + four options, original public question reference, no obvious replacement/square placeholder in the *sampled browser text*, no horizontal overflow, and no page JavaScript exceptions. QA output has only unit number, viewport and assertion metadata: **no question stems/options, correct keys, explanations or student account data**.

**Scope limitation:** 9 representative browser journeys are *not* a 2,250-question per-item browser visual proof. Original mathematical and vector notation in all other questions, source figures and Physics answer correctness remain to be checked independently.

The new workflow runs the read-only V128 2,250-item structural scan, frozen V99i answer-free reference inventory, V94D 560-pending Unit 6 academic release gate, V118 readiness/copy-only reporting guard, and V121 unchanged public worked answer resources.

## Boundary and release status

- **2,250 public provisional MCQs** remain: Units 1–6 = 275/206/220/640/349/560; the V129 browser test uses them read-only.
- **560 Unit6 item-by-item academic signoffs remain PENDING**, **65 teacher issue-register items** remain open (not all wrong answers), full course `planned`, graded assessment `not-published`.
- Public worked keys, no teacher inbox, individual U1/U2 cloud-saving restriction and monitoring-only App Check remain unchanged.
- No original textbook pages/images are copied; no bank data, source student masters, Firebase, Auth, App Check, account data, automatic reporting, PDF watermarks, logo, navigation or results grading is altered.

## Owner review and acceptance

Draft PR #229 must include **four files only**: the narrow `practice-engine/index.html` badge fix, new real browser CI test, this review note, and a new GitHub Actions workflow. Wait until every **latest-commit** check is green before **Ready for review → Merge pull request → Confirm merge**. If the real browser tests fail, inspect and amend the *same branch*; do not bypass or weaken the assertions merely to obtain green CI.

After GitHub Pages deployment, start a public **Unit 6 practice** from the Test Builder and check that the topic label clearly says provisional, includes original candidate codes, and does **not** call unverified individual items “Summative theory”. Check a Unit 2 or Unit 3 genuine summative practice question also keeps its original badge. The next QC step is a targeted original-source scientific answer/figure review, not a bank-wide assertion of certification.
