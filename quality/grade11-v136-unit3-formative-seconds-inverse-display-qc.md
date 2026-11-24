# V136 — Preserve original Unit 3 formative explanations while typesetting seconds-inverse

## Source evidence and prerequisite

PR **#235/V135** is merged into `main` (24 November 2026, **both GitHub workflows successful**). The V135 source-backed audit inspected **12 original Unit 3 worked-explanation notation candidates** through the unchanged production renderer. Its technical source check passed at 1280px/390px/320px and screenshots demonstrated: (a) the summative average-velocity overline `v̅` appeared legible in sampled Chromium; (b) original **formative** Topic 3.3 momentum explanations for `g11-u03-master-t33-q036` and `q060` contained legible but plain ASCII `s^-1` rather than the typographic scientific unit `s⁻¹`.

This is a **narrow mathematical display consistency improvement**. There is **no evidence that any specific answer, calculation or official SLO mapping is wrong**, and the original source must remain unchanged.

## The strictly limited presentation change

The actual current quiz's `practice-engine/index.html` already calls `setRich(node,q.explanationHtml,q.explanation)` when displaying (1) the optional checked-answer feedback and (2) question-by-question solutions after submission. V136 adds a small source-ID-allowlisted `setPracticeExplanation(node,q)` wrapper at *these two display sites only*. The original rich-text `setRich` sanitization still runs first.

For exactly **11 original Unit 3 formative Topic 3.3 candidate IDs** — `g11-u03-master-t33-q036`, `q042`, `q045`, `q047`, `q050`, `q053`, `q055`, `q057`, `q058`, `q059`, and `q060` — the wrapper changes visible text-node occurrences of the literal original `s^-1` to `s⁻¹`. It preserves MathML, preformatted code blocks, all other characters and any other original exponent strings. A listed source ID that does not contain the exact token stays unchanged. These are **formative** materials, not newly summative-exam eligible.

**No question-bank JSON/B64 or explanation text is edited.** All questions, correct letters, option choices, calculations, source metadata, SLO labels, cognitive levels, stimulus groups, print links, scores and saved records remain exactly as before. This is deliberately **not a global regex** on the entire Grade XI bank.

## End-to-end original student behavior

New `scripts/test_grade11_v136_unit3_seconds_display_browser.cjs` uses the **actual checked-in 220-item Unit 3 bank and live Practice Engine** over an ephemeral local read-only HTTP server. At **1280px desktop, 390px mobile and 320px narrow phone**, it:

1. Opens an actual Unit3 **formative-only practice containing all 60 original formative items** and submits the real test unanswered in the browser; verifies all 60 source references, all 11 original candidate IDs, and that every original `s^-1` among them displays `s⁻¹` in the genuine completed-test explanation, with no raw `s^-1` left at that location.
2. Exercises the actual checked-answer feedback UI using original formative `q036` (test-only selected from the real loaded bank); checks that it uses the same science-preserving `s⁻¹` display.
3. Verifies the original **summative** average-velocity overline from `XI-U03-MCQ-0031` is still present; an out-of-scope synthetic Unit2 string remains untouched; the original 11 items remain formative.
4. Generates **six isolated symbol-only screenshot previews**, from original `q036` and `q060` at the three widths, plus an answer-free status report. No entire solution, original key, teacher-only PDF, login or student record is exported.
5. Hash-compares the current original source files and academic release matrix before/after the test. Checks for viewport overflow and JavaScript errors. The test has no authority to certify scientific answer correctness.

## Academic/nonrelease boundaries

- **All 2,250 provisional Grade XI public question references** remain **275 / 206 / 220 / 640 / 349 / 560**. Unit3's original 60 formative items are *still excluded* by the theory-exam `scope=summative` filter.
- Unit6 **all 560 item-level academic signoffs remain PENDING**, full course `planned`, official graded assessment `not-published`. Its corrected V129/V130 provisional SLO badges/results remain unchanged.
- No Firebase, App Check, Auth, student data saving, report sending (the button stays **Copy only**), school exam security, logo, original illustrations or printed watermark changes.
- A rendered superscript in these source-identified formative explanations is a limited visual improvement, **not** blanket approval of the 11 explanations, the remaining V131 source flags or all 2,250 answers.

## Owner acceptance

PR **#236 / V136** should contain exactly **four files**: one short Practice Engine rendering wrapper change, the new original 60-formative-result Chromium test, this quality rationale and a dedicated Actions workflow. Keep it **Draft** until every latest-head check is green; if red, do not merge, and amend *the same branch*. Once green, **Ready for review → Merge pull request → Confirm merge**.

After GitHub Pages deployment, take any Unit 3 **formative** Topic 3.3 question whose explanation contains `s^-1`, use `Check Answer` or submit, and confirm the displayed unit is **s⁻¹**, while the original answer, its formative label, and optional result printing are unchanged. Review the six source-ID-only screenshots if desired.
