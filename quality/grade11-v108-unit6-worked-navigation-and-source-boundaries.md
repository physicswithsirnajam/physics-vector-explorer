# V108 — Unit 6 worked-application navigation, with explicit source boundaries

## Purpose
After V107's individual Unit 5 original classroom-question links, Unit 6 still has **zero independently verified numbered textbook example/exercise links** in the V103 numerical finder. Nevertheless, seven published Unit 6 provisional study lessons already include real `#worked` sections that students can use for guided learning. V108 exposes those sections as a **separate provisional category** rather than incorrectly adding them to the verified textbook-number index.

## Source inventory (existing public pages inspected 23 Nov 2026)

| Topic | Exact public section | Contents and provenance | Outstanding academic check |
|---|---|---|---|
| 6.1 Upthrust / Archimedes | `unit-06-topic-61-study-v95b1.html#worked` | Calculations using prepared-master Example/Assignment 6.1 data plus original supplementary illustrations | Original NBF printed pp.89–91 and figure / verbatim question wording |
| 6.2 Viscosity / terminal speed | `unit-06-topic-62-study-v95b2.html#worked` | Prepared-master Example/Assignment 6.2 data plus supplementary cases | Original NBF pp.91–95, table and exact exercise wording |
| 6.3 Fluid flow | `unit-06-topic-63-study-v95b3.html#worked` | Seven teacher-developed supplementary C1–C7 rate calculations | Not numbered textbook examples; check scientific/cognitive details before certification |
| 6.4 Continuity | `unit-06-topic-64-study-v95b4.html#worked` | Prepared-master Example 6.3 data with newly worded explanation plus extra cases | Original NBF printed pp.96–99, figure and exact question wording |
| 6.5 Bernoulli equation | `unit-06-topic-65-study-v95b5.html#worked` | Eight teacher-developed numerical illustrations for horizontal/vertical flow | Not numbered textbook exercises; cross-check model assumptions and mathematical solutions |
| 6.6 Bernoulli applications | `unit-06-topic-66-study-v95b6.html#worked` | Mixed source-prepared givens attributed to Example/Assignment 6.4 and supplementary Torricelli, Venturi, lift practice | Original NBF pp.101–106, figures and exact exercise wording |
| 6.7 Superfluidity | `unit-06-topic-67-study-v95b7.html#worked` | Eight supplementary temperature conversions and comparisons | Not separate mandated FBISE B-43 derivations or textbook problem numbers; physical constants/benchmarks still provisional |

**Scope note:** A direct link to seven *sections* does not mean there are only seven worked examples or that any given question is a verbatim textbook exercise. The mixed-source summaries describe their **existing source labels**; no independently approved textbook transcriptions, no per-question MCQ certification, and no new answer-key approval are claimed.

## Implementation
- `portal/verified-unit6-worked-topic-index-v108.json` contains exactly 7 source-labelled topic-section links.
- `portal/textbook-resource-finder.html` retains the original 28 V103 numbered/source-labelled records from Units 1–4 with the same file, schema and validation. The Unit 6 supplement is a **visually distinct** section with a distinct dropdown choice and its own `preview-card` class; it never enters the textbook-result `#results .item` collection.
- Supplemental file errors fall back to the original 28 verified links. The original no-independently-indexed-textbook warning remains present for Unit 6 even when topic-level examples appear.
- Exact `#worked` anchors already exist in each source lesson. No changes to the original lessons' text, numerical values, equations, answers or lesson artwork.
- Search by title/topic/source note, truthful absent-state behavior and responsive 1280px/390px/320px browser checks.

## Release and security locks
New V108 CI audits seven source anchors and verifies a real click into Bernoulli's eight supplementary examples. It runs **V103, V106 and V107 regression tests**. Do not merge until the PR and every latest-head GitHub Action check pass.

No Firebase/Firestore authentication, scores, student data, teacher keys, App Check, reporting, watermark, branding or MCQ answer banks changed. Firebase App Check remains **Monitoring** with enforcement OFF; student feedback remains **Copy only**.

## Owner acceptance
1. After green Actions, review the six changed files on GitHub and merge the PR.
2. After Pages deployment, open `/portal/textbook-resource-finder.html?unit=6&kind=provisional-worked-topic-section`. Confirm **7 separate provisional Unit 6 topic cards**, none labelled certified NBF textbook numerical numbers.
3. Open the Bernoulli Equation card and confirm the browser lands at **Eight supplementary numerical applications**.
4. Select `Numbered textbook numerical exercises`: Unit 6 must still truthfully say there are no independently verified textbook-number links.
5. Select Unit 3 → numbered textbook numericals and confirm the original eight links still show.

## Next academic priority
The next release should focus on **actual Unit 6 textbook source verification and item-level scientific review**, using owner-provided exact pages where needed. Do not unlock official textbook-number claims or teacher academic sign-off solely from existing prepared-master references. Once Unit 6 is reviewed, progress to Grade XI Unit 7.
