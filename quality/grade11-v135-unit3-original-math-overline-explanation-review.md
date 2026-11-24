# V135 — Unit 3 overlined velocity and plain caret-power notation: source-backed browser review

**Prerequisite:** PR **#234/V134** merged into `main` on 24 November 2026; GitHub confirmed its two pull-request workflows succeeded. V134 found that the eight Unit5 source HTML-entity warnings were ordinary apostrophe encodings that the real Chromium practice renderer decoded correctly. No source correction was justified.

## Exactly what remains from V131 for Unit 3

The original, downloadable **V131** read-only Grade XI report listed **12** Unit3 candidate source IDs; this is **not** 12 confirmed errors. These flags are **all in original worked explanation fields**, not missing multiple-choice alternatives:

- **One summative-theory original scenario:** `XI-U03-MCQ-0031` (original question #59 in `unit-03-stage2-80-practice.json`) includes a **combining overline** on the average-velocity symbol (U+0305). Original question key, explanation and official classification are unchanged.
- **Eleven formative Unit3 Topic 3.3 original master questions:** `g11-u03-master-t33-q036`, `q042`, `q045`, `q047`, `q050`, `q053`, `q055`, `q057`, `q058`, `q059`, `q060`. The V131 detection is **ASCII caret-power notation** such as a letter followed by `^2`. Original source is compressed into the signed, checked-in `unit03-v60-part1.b64` and `unit03-v60-part2.b64` assets and is loaded through the trusted current V55 adapter. These 11 questions are **formative momentum-topic practice** and must **not** be represented as summative theory examination items.

The candidate queue is a *rendering-review list*. A plain `v^2` expression can be mathematically understandable even if a true superscript `v²` looks better; typography and final academic interpretation require deliberate review against original source.

## Proposed test, not a content change

New `scripts/test_grade11_v135_unit3_notation_browser.cjs` opens the original, unchanged `practice-engine/index.html` using a read-only local server and actual checked-in Unit3 source. For **each 1280px, 390px and 320px viewport**:

1. Load Unit3 source via the public current V55 adapter; verify **220 original public questions**, exact **12 immutable candidate IDs**, and the genuine source assessment classification (1 summative + 11 formative).
2. Render each original explanation *in memory only* through the **same production `setRich` renderer** as a student sees on post-submission review. Confirm the overline or caret-power marker survives, or that an existing valid rich superscript represents it.
3. Create three deliberately narrow, **answer-free test-only** visual previews: source marker from `XI-U03-MCQ-0031`, `g11-u03-master-t33-q036`, and `g11-u03-master-t33-q060`. The marker is extracted from original explanation, then passed through the unchanged production safe **plain-text fallback**. This yields **nine small PNG screenshots**, with only source ID/classification and an isolated mathematical token — **no full worked explanation, correct letter, answer option or private original textbook page**.
4. Require nonblank visible elements, four intact options in the existing practice engine, no horizontal overflow and no browser JavaScript errors. Do not silently convert the source or insert a new visible student page.

The JSON quality artifact contains the 12 exact public IDs, classifications, boolean display checks, screen width and filename. **It does not export question stems, options, correct answers, full explanations, student accounts, personal test scores or confidential PDFs.** Test protects original Unit3 JSON, two compressed assets, adapter and academic release matrix by before/after SHA-256 checks.

A browser can faithfully display `v^2` as ordinary caret text without it being a *corruption*; it also does not certify the glyph shape or NBF science. Human screenshot review should decide if an educational-display improvement is needed. In case of a **verified** issue, a subsequent PR should prefer source-preserving presentation formatting plus visual regression, not a bank-wide replacement of strings.

## Source and security guarantees

- No original `question-bank/grade-11` records, questions, explanations, options, answer keys, SLOs, figures, topic eligibility, teacher approvals or formal examinations changed. All Grade XI public provisional MCQ references remain **275 / 206 / 220 / 640 / 349 / 560 = 2,250**.
- **560 individual Unit6 item reviews remain PENDING**, Unit6 full course `planned`, formal graded assessment `not-published`.
- No Firebase/Auth/App Check, progress saving, issue-report sending (still Copy only), live public UI, navigation, logo or PDF watermark modifications.
- QA workflow reruns V131 notation candidates, V128 source structural integrity, V99i answer-free original IDs, V94D Unit6 release hold and V118 audit of the existing reporting restrictions. Tests of syntax and actual Chromium remain separate from independent textbook/teacher validation.

## Owner acceptance

PR **#235 / V135** must contain exactly **three new nonproduction files**: this teacher report, the browser-test script, and its dedicated GitHub Actions workflow. Keep it **Draft** until **all latest-head checks are green**; if red, do not merge and send the failing job. After success, use **Ready for review → Merge pull request → Confirm merge**. Open the Actions artifact `grade11-v135-unit3-caret-overline-notation-evidence` and visually inspect nine answer-free markers, especially at 320px, to decide whether the ASCII caret exponent is acceptably legible or needs a future display-only amendment.

**Do not interpret passing as approval of 12 original answers or endorsement of formative questions for summative FBISE theory assessment.**
