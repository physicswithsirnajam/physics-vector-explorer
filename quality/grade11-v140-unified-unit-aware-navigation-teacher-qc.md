# V140 — Unified, unit-aware left sidebar for Grade XI (public navigation only)

## Verified source and design decision

The original public `portal/learning-catalog.json` currently lists **14 Grade XI unit records**: Units **1–5** marked `available`, Unit **6** marked `planned` with a **seven-topic provisional public practice preview**, and Units **7–14** marked `planned`. There are **2,250 original public provisional Grade XI practice MCQs** across Units 1–6 (275/206/220/640/349/560), 31 original public simulation models, and graded Unit6 assessments remain unpublished.

The existing `shared/navigation.js` already displays a left-side drawer and catalog-driven unit menus, but its groups follow the insertion order of `STUDY`, `PRACTISE`, `SIMULATIONS`, `EXAM PREPARATION`, `REGISTERED LEARNERS`, etc. This is difficult to scan and does not fully recognize `?unit=3` on a filtered Test Builder or an in-page Simulations selector. The user asked for **one unified left unit menu** with clearly sequenced access to notes, videos, simulations, examples, numerical problems, MCQs, short/long questions, assignments and progress.

### Exact navigation hierarchy

Each **available or public-provisional** Unit 1–6 now has the same consistent collapsible stage order:

1. **01 · Learn** — Learning Desk, SLO/concept notes, formula/revision guides, available existing supplementary videos and future official channel lessons.
2. **02 · Explore** — verified unit-filtered simulation library and existing hands-on laboratory/explorer links.
3. **03 · Practise** — Unit-specific Test Builder entry, existing MCQ practice, numerical examples, interactive concept practice.
4. **04 · Prepare** — short/long/descriptive practice, exam packs, assessment blueprint, worked solutions, projector teaching resources and assignment links *where already published*.
5. **05 · Track** — genuine public links to private progress or enrolled lessons. These do not grant access; Firebase rules remain the authority.

Each stage shows its **actual mapped link count** and either its safe published resource links or a truthful non-clickable note where that content is missing. Existing source-aligned titles remain intact. The drawer does **not** invent assignments, teacher classes, official YouTube channel addresses, notes, exam pages or MCQs. The old internal `protected-lesson` access-test entry is omitted from the student drawer, without deleting or altering the underlying access-test page.

### Unit-aware interactions

- A page such as `/portal/unit-03.html` opens **Unit 3 → Learn** automatically.
- `/build-your-physics-test.html?unit=3` opens **Unit 3 → Practise**.
- `/portal/simulations.html?unit=6` opens **Unit 6 → Explore**, with a visible **provisional academic status notice**.
- If the learner changes the Simulations unit selector from `6` to `3` using `history.replaceState`, reopening the sidebar immediately selects **Unit 3 → Explore** without a page refresh. Current link highlighting also follows the current unit query rather than highlighting every unit's shared Test Builder URL.
- Units **7–10** are shown in a compact, separately collapsible **Next units** area, and Units **11–14** in a **Future units** area; neither displays invented study/MCQ/graded-course links. Where the catalogue records existing public simulation models (Units 7–10), a clearly described **simulation enrichment** link is available without claiming that the unit itself is published.
- Search/focus, Escape, outside click, responsive drawer, original navigation guard for in-progress unsaved quizzes and print watermark behavior remain unchanged.

### Video precedence: official first, supplementary second

The catalogue gains explicit **six supplementary-video source directory links**, one per currently accessible Unit 1–6, to the existing same-site `legacy-hssc-resources.html?unit=N` directory. The new `category: VIDEOS` and `videoPriority: supplementary-existing` avoid implying that the historic linked videos belong to Physics with Sir Najam.

The **primary** video section belongs to verified future **Physics with Sir Najam** YouTube uploads, placed ahead of additional links when they exist. **No official channel ID, video ID or published URL has been provided or verified**, so the sidebar currently displays an honest non-clickable note about forthcoming official uploads instead of fake embeds. Video creation, upload, copyright checks and embedding are a later PR.

### Safe source and security boundaries

- V140 changes **only** `shared/navigation.js`, `shared/navigation.css`, `portal/learning-catalog.json`, a new real-browser regression, this QA note and the workflow. No original public or protected MCQ bank, answer, SLO/cognitive status, video file, source textbook, private student data, scoring, results, Firebase/Auth/App Check rules, classroom assignment or backend setting is changed.
- The public resource catalogue **is not an access-control system**. The navigation currently shows public study links without sign-in; a browser popup alone cannot protect static assets on GitHub Pages. Teacher/student permissions, role-scoped class membership and protected saved assessments require authenticated backend security and must be separately implemented and tested.
- The request for top-right session dropdown (**My Profile / Sign Out**), mandatory authentication for personalized Test Builder activity, students seeing only their enrolled classes, secure admin-provisioned teachers, automatic saving of *combined-unit* attempts, SLO recommendations, streaks, stars, badges and celebrations belongs to subsequent PRs. None is represented as already implemented here.
- All **560 individual Unit6 academic teacher signoffs remain PENDING**; full Unit6 course planned and formal graded assessment unpublished.
- The historic Google Sites references can remain archived in source materials as necessary, but **no global sidebar link points to Google Sites**. Any remaining legacy textual references elsewhere need a separate carefully scoped content audit.

### V140 acceptance and checks

The dedicated Chromium test loads the **real global navigation** on the existing student guide, Unit3 Learning Desk, unit-filtered Test Builder and live Simulations selector. At **1280px, 390px and 320px**, it verifies six active/provisional unit accordions, correct five-stage order per unit, academic caution for Unit6, honest future-unit labels with enrichment simulation links, extra video directory links, no internal access-test page, no Google Sites menu URLs, responsive drawer without horizontal overflow, Escape closing, automatic current-unit stage and dynamic filtered-unit changes.

It also validates that every catalog-mapped student menu resource resolves to a **real local path**, and that original source counts and Unit6 release-hold matrix remain unchanged. The Actions artifact contains only **public sidebar screenshots** and an answer-free verification summary.

The workflow reruns existing V99i 2,250 source identity checks, V94D Unit6 release gates, V118 readiness, V137 original notation teacher ledger and V138 student report download tests. A real signed-in teacher/student backend security test is deliberately **not** part of this navigation-only PR.

**Owner steps:** PR **#240** must remain Draft until all latest-head checks pass; expect **six files** and no student account or academic source changes. If a check is red, keep it unmerged and amend the same PR. If green, choose **Ready for review → Merge pull request → Confirm merge** and inspect the public sidebar on student guide, `?unit=3` Test Builder and `?unit=6` Simulations.

**Next milestone:** PR #241 should inspect **auth state and role/claims/rules** first, then prepare the smallest secure teacher-portal foundation. Do not introduce mere CSS/JS gatekeeping as a substitute for server-enforced access.
