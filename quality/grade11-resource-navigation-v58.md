# V58 — Collapsible Grade XI Resource Navigation

## Scope
- Add a visible "Units & Resources" toggle to the existing site-wide Physics with Sir Najam navigation bar.
- Drawer can be opened/closed on desktop and on phone; it overlays the current page without changing layout, and allows expansion by **Unit 1–5** and then by currently available category (Study, Simulations, Revision, MCQs/Practice, etc.).
- Resource titles and link destinations are read at runtime from the **original public learning-catalog.json**, not invented or duplicated in the navigation implementation. Every currently released unit is included and all 59 published unit-resource entries are reachable from the menu.
- Quick links lead to Student Start Guide, Grade XI Test Builder, Learning Hub Dashboard, private account progress, Simulations and FBISE Blueprint.
- Unreleased Units 6–14 are never shown as active resources. This is a navigation change only, not content or examination publication.
- Restricted enrollment and private-progress links display visible access labels; the sidebar neither grants access nor writes account data.

## Accessibility
- Keyboard-operable menu toggle with aria-controls and aria-expanded, dialog labelled for assistive technology, independent close button, Escape to close, backdrop click to close, and focus restored to opening control.
- Tab and Shift+Tab cannot leave the active drawer while it is open; nested unit and category summaries are native HTML details with keyboard support.
- Mobile width is constrained to the viewport; background scroll is suppressed while menu is open and restored when closed.
- Existing 50-second classroom projector screens and A4 print pages keep their original content; navigation hides in print.
- When leaving a live, unfinished MCQ test through drawer links, the *existing* unsaved-answer confirmation is respected; cancel keeps the user on the test.

## Coverage
- Shared nav was already installed on the Unit 3–5 resource pages and later Unit 2 pages.
- Install it on the earlier public pages that were missing it: Unit 1 desk, Unit 1 study guide/numericals/descriptive answers, Unit 2 desk, simulation library, and the existing portal course-lesson shell.
- Bump cache-busting navigation asset versions on main entry pages to v58.
- All 51 original local HTML documents linked from the five published learning resource catalogue entries now contain a shared navigation script/style reference.
- Current 673 provisional original MCQs, Test Builder, 59 catalogue records, Firestore roles/rules, student history, source keys, official logo binary and Google Sites embedded links are otherwise unchanged.

## Automated acceptance and regression
1. Verify 5 published units, 59 unique catalogue references and 51 locally linked HTML pages with shared nav.
2. Open public student guide in Chromium: menu closed by default, toggles and fetches five unit details and all 59 linked resource pages.
3. Expand Unit 4 and its SIMULATIONS category; check original public link and category.
4. Verify private/enrolled labels, ESC close, backdrop close, keyboard focus trap and restoration.
5. Check 390px phone width and that all five units remain reachable from the drawer.
6. Open five previously missing-nav public pages and ensure drawer loads.
7. Start an actual Units 1+3+5 20-question mixed test; attempt to leave via drawer, reject warning (stay on test), then accept warning and navigate to guide.
8. Rerun existing V56 mixed-unit and V57 student-guide browser suites, upload screenshots.
9. Human QA: test narrow iframe embedding through Google Sites, common mobile browsers, projector usage and visual contrast.

## Future releases
- User-provided full master MCQ files for Units 1–5 should be inventoried, academically checked and deduplicated before adding items to the original 673-question online bank.
- The sidebar's nested categories will expand dynamically as Units 6–14 and resources are genuinely published; do not advertise future lessons until linked.
- Cloud saving for mixed-unit and Unit 3–5 tests remains unavailable until a separate verified Firestore schema/rules update.
