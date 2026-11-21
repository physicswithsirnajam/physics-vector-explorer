# V98-N — Grade XI Public Student Entry, Discovery and Navigation Audit

## Verified prerequisite

PR #157 has been independently confirmed merged at commit `65ec1e56ee6b46cf75cec1890c57504b966fe214`. Its local browser test verified six original interactive physics labs and the Unit 6 figure companion, including meaningful control changes and intact branding, with zero recorded diagnostics.

**This is a testing-only change**, limited to a new Playwright/Chromium script, GitHub Actions workflow and this audit note. No live HTML, assessment bank, answer key, educational page, test engine, Firebase permission, student data or official branding asset is altered.

## Seven key public student entry points

| Original route | Read-only student-path check |
|---|---|
| `portal/index.html` | Public landing/login entry references the exact original official logo and banner. The existing V69 sign-in-first CSS deliberately **hides** the Simulation Directory header shortcut and public-demo section while signed out. The audit respects this design and confirms the public Simulation Directory URL is directly reachable without authentication (without claiming a visible signed-out shortcut). No login or registration is attempted. |
| `portal/simulations.html?unit=6` | Public directory loads its original simulation and unit-specific laboratory catalogs, preselects Unit 6, renders its five original standalone simulations, filters on search and restores them when cleared; first linked simulation resolves locally. |
| `student-guide.html` | Student Start Guide loads its manifest-based public MCQ total and links to Test Builder and the real Unit 1 Learning Desk. |
| `build-your-physics-test.html?unit=6` | Public Test Builder preselects provisional Unit 6, can Clear, Select All and Reset unit selections without launching, grading or saving a test. |
| `portal/unit-01.html` | Unit 1 desk links into the existing public Unit 1 Study Guide. |
| `portal/unit-03.html` | Unit 3 desk links into the original public Collision Learning Lab. |
| `portal/unit-06-learning-desk-v95a.html` | Seven-topic selector jumps to Topic 6.3, synchronizes the URL fragment and `aria-current`, and exposes the topic's real study lesson. |

The personalized Learning Hub under `portal/index.html#learning-hub` is **authenticated account content**. The audit intentionally does not pretend to validate it, bypass its gate, or read anyone's account data. The public portal landing page is still useful and accessible without login.

## Branding precision

The Test Builder uses `assets/branding/physics-with-sir-najam-logo.png`, whereas most public portal pages use `portal/assets/physics-with-sir-najam-official-logo.png`. GitHub's tree identifies **exactly identical SHA-1 blob IDs** for these files. The regression makes an additional **byte-for-byte file comparison** to ensure that the distinct path does not imply a substitute logo. The portal's original official banner is also checked for presence and actual browser loading. No existing logo/banner is edited or recreated.

## Browser evidence and diagnostics

Headless Chromium serves the checked-out repository files locally and checks all seven pages at **1280px desktop**, **390px phone**, and **320px narrow phone**. It validates official logo visibility, page title, student-facing links and controls, document-wide overflow, JS exceptions and missing local files. It saves **21 viewport screenshots**, `audit.json`, and `report.md` as artifact `grade11-public-entry-v98n-evidence`.

**Read the diagnostic report even if the workflow passes:** overall page overflow, branding-size alerts, runtime exceptions or missing resources are logged rather than hidden. The script fails on broken branding loading and major student navigation paths. Any confirmed issue should be resolved in a separate, minimally scoped PR with source-preserving tests.

## Boundaries and merge procedure

This is anonymous, source-local public-browser testing, **not** certification of deployed website, production auth, personalized user dashboards, complete academic SLO mappings, screen-reader accessibility, or teacher-controlled workflows. It does not interact with private accounts, answer keys, grades or test submissions.

After latest-head checks finish green, review `report.md` and screenshots. Then **Ready for review → Merge pull request → Confirm merge**. Keep the one-PR-at-a-time policy and isolate follow-up defects.

## Sign-in-first CSS discovery during the first diagnostic run

The first V98-N browser run failed because it tried to click a signed-out portal header shortcut that was not visible. A second check at desktop width showed the same result. The cause is **deliberate global navigation styling**, not a phone-only defect: `shared/navigation.css` explicitly hides `.topbar .header-link` and `.public-demo` for `body.psn-portal-auth-gated:not(.psn-portal-access-approved)`. That is an existing sign-in-first visual-routing policy, and this audit will not bypass it.

The corrected test checks that the original public banner and logo load and that **`/portal/simulations.html` responds successfully without authentication** via its direct URL, while recording `publicShortcutVisible: false` for signed-out visitors. The test does **not** claim signed-out portal users can click a hidden header link. Whether an explicitly visible public-resource shortcut should be restored is a separate design/UX decision for later discussion; that change is **not** in this read-only PR.
