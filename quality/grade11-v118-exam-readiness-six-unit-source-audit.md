# V118 — Grade XI six-unit exam-readiness source and navigation audit (teacher review only)

**Audit date: 23 November 2026.** **PR #218** is the agreed **read-only exam-readiness** pass before the students' first Physics examination on **December 7, 2026**. It is deliberately **not** a content-release PR and does not certify that any school exam syllabus equals the entire public Unit 1–6 practice collection.

## Evidence and method

This PR adds only an offline read-only Node audit, its contract tests, this teacher-facing report and a dedicated GitHub Actions workflow. The audit checks the **actual checkout of this repository at its PR head**, including links and target existence under `portal/exam-quick-access.html`, the full 14-unit `portal/learning-catalog.json`, selected global navigation and student pages, source-only Firebase/report saving and exam locks, and public teacher-style routes. It records machine-readable findings in **CI artifacts only** (`qa-artifacts/grade11-v118-exam-readiness/readiness-audit.json`). All external sites and protected services are **excluded from automated network requests**.

Passing CI means these **source and local-route tests** passed. It does **not** mean the published GitHub Pages CDN, live Firebase Auth/Firestore/App Check, external Drive/YouTube links, individual original NBF textbook exercise numbers, or an actual student's browser session was independently inspected. Existing historic browser regressions are run separately and must also pass before merge.

## Verified Grade XI source inventory

| Unit | Catalog status | Provisional public MCQs | Assigned original simulations | Current type |
|---|---|---:|---:|---|
| 1 · Physical Quantities and Measurements | available | 275 | 0 | Public study and practice |
| 2 · Vectors | available | 206 | 2 | Public study and practice |
| 3 · Translatory Motion | available | 220 | 4 | Public study and practice |
| 4 · Rotational and Circular Motion | available | 640 | 4 | Public study and practice |
| 5 · Work and Energy | available | 349 | 1 | Public study and practice |
| 6 · Fluid Mechanics | **planned**, provisional public practice preview | 560 | 5 | Seven topics; **full course and assessment NOT released** |
| **Six-unit combined** | — | **2,250** | **16 assignments** | 31 original simulation models cataloged elsewhere |

Unit 6 has 80 prepared-source MCQs in each of seven topics, with an original full **560-item** review queue. Its 560 individual science, printed-source-fidelity, FBISE SLO, cognitive and teacher approvals remain **PENDING**. Past work already applied V111 (four Topic 6.4 source-preserving treatments), V114 (three Topic 6.5 Bernoulli Q61/Q67/Q78 variants), and V116 (Topic 6.5 **Q55/Q56** stagnation/reservoir B/B variants) without overwriting original source. V117 / PR #217 was merged and reviewed: Topic 6.5 **Q45, Q46, Q47 and Q58** have correct calculations, but individual B36/B40 assessment-scope teacher decisions are still pending. This audit makes no new teacher decision about them.

Units 7–14 remain planned full courses. The existence of legacy video links or original simulations for those units does not authorize marking their lessons or examinations as published.

## Exam Quick Access and student wayfinding

**Already provided:** six collapsible unit panels; unit and resource-type selectors; concept/SLO study pages; relevant worked numericals; answer-practice pages; filtered Test Builder; unit-filtered simulation directory; preserved Notes & Videos index. Three finders add further navigation: textbook example/numerical, descriptive answer, and derivation/SLO/formula. The global Units & Resources drawer and Learning Hub already offer topic/resource selectors and simulation return links.

**Read-only CI test:** enumerate all literal exam-page links, confirm local target files exist, check six unit panels, six resource-type categories, explicit missing-resource messages, six-unit menu, Unit 6 provisional warning, and no fake Unit 7 published course. Also resolve the live catalog's resource IDs and local relative links; record any broken catalog hrefs as actionable findings without automatically changing content. Existing V101A Chromium filters and V96B learning-hub/V96C simulation return tests run again in this PR. An audit can flag a missing link, but it must **not silently invent** substitute textbook content.

## Prioritized owner decisions for before December 7

### P1 — Public worked solutions and teacher-labelled materials

The following routes are publicly hosted by GitHub Pages, whether or not the menus show them:

- `portal/unit-05-descriptive-teacher.html` — explicitly linked as **worked descriptive/numerical answers** from Exam Quick Access. Decide whether this is intentional **public practice discussion** (keep and label clearly) or genuinely teacher-only material (requires authenticated backend storage, not hiding a link).
- `portal/unit-05-mcq-key.html`, `portal/unit-05-mcq-set-b-key.html` — public answer-key pages. Decide whether students may inspect them for provisional self-practice versus whether formal exam timing requires private delivery.
- `portal/unit-04-discussion-slides.html` and `portal/unit-05-projector-discussion.html` — public projector/discussion content, audience decision pending.
- `portal/unit-04-slo-audit.html`, `portal/unit-05-fbise-audit.html`, `portal/unit-06-figure-verification-v91.html` — public academic/source-verification pages. Verify student-facing wording or plan genuinely restricted hosting for internal-only information.

The audit documents accessibility and needed permission decisions only. It does **not** assert that a file is a leaked secret merely because its filename says “teacher”.

### P1 — Exact Unit 6 examination-material availability

The current Exam Quick Access properly links the seven-topic provisional Fluid Mechanics desk and 560-question self-practice preview, but does **not** pretend that its end-of-unit worked numerical and short/long answer sections have all been independently checked. For **Unit 6**, retain the truthful missing-resource message until exact book page/question and summative/formative boundaries are verified.

### P2 — Honest missing-resource path for Unit 1 simulations

The Unit 1 Exam Quick Access “simulations” shortcut leads to the overall simulation directory filtered for Unit 1; the catalog currently assigns **zero** Unit 1 original simulations. Check the displayed empty-state wording in an actual learner browser; do not promise a model that does not exist. This is a usability and classification question, **not** proof of a broken URL.

### P2 — Make student versus internal explanations clearer

Check the portal's historical Unit 6 development log and public SLO/figure audit descriptions. Development version IDs and teacher QA commentary should not confuse students. A separate owner-approved copy/classification PR can shorten student messaging while preserving historical verification elsewhere.

### P2 — Record-keeping, feedback and login boundaries

The student **Copy only** MCQ issue action does **not** send any report into a live teacher inbox; the trustworthy backend and review Desk are separately audited local/emulator implementations, not an enabled production service. Students may copy a report and send it directly to their teacher. Combined-unit reports remain printable/local; **private cloud saving is currently limited to individual Unit 1 and Unit 2 attempts**. Teacher class assignment, roster and grades are not live. Public GitHub Pages study resources are public; an auth popup is **not** data protection. Firebase App Check was introduced in **monitoring-only** mode; no enforced security claims follow from this audit.

These are after-exam backend milestones unless an urgent student-affecting problem requires a smaller emergency fix.

### P2 — Exact source and external-reference reconciliation

The original Notes & Videos index retains historical Google Sites URLs as non-navigation provenance; the core student routes were previously migrated to same-site pages. Existing original reference catalog includes **27 direct YouTube entries (26 distinct)** and **17 source-indexed historical Drive PDFs**. We have not checked every external destination live or completed source-by-source migration. Any video, end-of-unit exercise or NBF page link should be verified **before** upgrading its availability label.

## Regression and changes explicitly not included

The new source-only script requires an immutable Unit6 academic-release gate, 560 pending teacher approvals, intact V111/V114/V116 overlays, read-only public routes and historic resource IDs. The test checks that every protected live student/source/report file is **byte-for-byte unchanged** across the audit execution and that the CI artifact communicates unverified limitations.

No change to the question-bank originals, correct keys, teacher decisions, course release flags, `boardEligible`, individual SLO/cognitive maps, physical simulation code, protected student data, login permissions, Firebase App Check settings, admin endpoints, MCQ report submission buttons, badges/streaks, the official Physics with Sir Najam logo, PDF watermark or original file-sharing. Source-record preservation and V112 superscript/PDF watermark rules remain in place.

## Teacher and owner acceptance after checks turn green

1. Open the V118 PR **Files changed** and review this finding register, then open **Checks** → download the public synthetic QA artifact if you wish to inspect every local link and classification.
2. Confirm the newly generated audit reports **six source-covered units** and no broken local Exam Quick Access links. Any catalog-only missing link is separately listed, not silently suppressed.
3. Check the existing V101A real-browser six-unit filters, V96B Learning Hub and V96C simulation-return regression status on the latest PR commit.
4. After merge/deployment, manually browse <https://physicswithsirnajam.github.io/physics-vector-explorer/portal/exam-quick-access.html?unit=6&kind=mcq> and a few real study links on phone and desktop; check Unit 1 simulation empty state and the public Unit 5 worked-answers page. **No login credentials, personal student records or private textbook pages should be shared for this check.**
5. The **next small PR** should fix any specifically proven broken or confusing **student-facing revision route/label**. Keep audience restrictions, private exam keys and true security access changes as distinct owner-approved backend decisions.

**Dec 7 goal:** reliable, truthful, quickly accessible existing study material—not a rushed unsupported course release.
