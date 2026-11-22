# V99-X — Make the Grade XI learning portal the homepage while preserving the original Vector Explorer

## User-observed defect and verified cause

The owner confirmed the active GitHub Pages project URL is `https://physicswithsirnajam.github.io/physics-vector-explorer/`, but opening it displayed the original Unit 2 **Vector Explorer**, not the Physics with Sir Najam Learning Portal. The intended student sign-in and learning workspace already works at `https://physicswithsirnajam.github.io/physics-vector-explorer/portal/`. The original root `index.html` was the Vector Explorer and did not load the shared `shared/navigation.js`; that was why the root simulation could feel like a dead end.

The standalone username root `https://physicswithsirnajam.github.io/` returning 404 is a **different** GitHub Pages user site and is NOT changed by this PR. A short branded `physicswithsirnajam.com` style address would be a **separate future domain-registration and DNS/Firebase authorized-domain/App Check review**; no domain is bought or configured here.

## Scope: carefully relocate the original, then redirect only the project landing page

1. `vector-explorer.html` — copy the entire previous original `index.html` Vector Explorer, including science controllers, SVG, all three tabs (components/dot/cross), challenges, quiz, print worksheet, projector mode, responsive original artwork and the **exact original official logo file**. Add only the shared navigation stylesheet and script, a small scoped link style, and one visible **← Learning Portal** return link. No physics, answers, SVG, SLO or exercise content is changed.
2. `index.html` — replace the old root lab with a small accessible **redirect** to `./portal/`. It uses `location.replace(new URL('./portal/',document.baseURI).href)` so desktop and GitHub Pages subdirectory navigation retains the `/physics-vector-explorer/` prefix without adding a browser-history dead end. A standard HTML meta refresh and an actual **Continue to the Learning Portal** link provide fallback when JavaScript is unavailable; a second fallback links directly to `./vector-explorer.html`. The original official logo is referenced, not recreated.
3. `portal/simulation-catalog.json` — point the single original Vector Explorer card at `vector-explorer.html`; retain all **31** original simulation cards, 9 independent enhanced labs, unit assignments and existing other links.
4. `quality/hssc-v73-31-simulation-link-crosswalk.json` — preserve the original historic Google Sites title and URL, but update the mapped actual repository file from `index.html` to `vector-explorer.html`.
5. `scripts/test_grade11_vector_explorer_brand_v98b.cjs` — retain the **existing exact FNV fingerprint** of the original entire science page by removing only the four explicitly added navigation fragments and preexisting approved logo substitution before comparison. Run real Chromium against the preserved `vector-explorer.html` at both root and GitHub Pages-style subpaths; verify shared global navigation, one official logo, original tab controls, sliders, reset, print, desktop and mobile behavior.
6. `scripts/test_grade11_homepage_vector_navigation_v99x.cjs` — new real Chromium QA of both typed project roots and explicit `index.html`, the correct `/portal/` destination, canonical vector model controls, shared drawer open/Escape close, explicit portal-return navigation, **31-card gallery** link to the relocated model, **390px mobile** with no horizontal overflow and **no-JavaScript** meta-refresh fallback. Uses a local static test server only.
7. `scripts/audit_grade11_brand_v98a.cjs` — revise the stale `rootVectorLanding` audit claim to distinguish the actual portal redirect from the original simulation and verify both have the exact original official logo.
8. `.github/workflows/validate-grade11-vector-brand-v98b.yml` — extend the original Playwright/Chromium GitHub Actions workflow so it checks both original-vector science fingerprint and new root-to-portal/browser integration on every relevant change.

All changes are navigation, public simulation catalogue, existing branding test and static GitHub Pages content. No Firebase Auth/Firestore settings, App Check registration or enforcement, real student data, report submission, private admin inbox, source notes, answer keys, domain registration, or GitHub Pages deployment configuration is modified.

## Expected site URLs after GitHub Pages publication

| Address | Intended behavior |
|---|---|
| `https://physicswithsirnajam.github.io/physics-vector-explorer/` | Immediately open the working **Learning Portal** at `/physics-vector-explorer/portal/` |
| `https://physicswithsirnajam.github.io/physics-vector-explorer/index.html` | Same portal redirect, with HTML-only fallback |
| `https://physicswithsirnajam.github.io/physics-vector-explorer/portal/` | Existing sign-in and student learning workspace; unchanged |
| `https://physicswithsirnajam.github.io/physics-vector-explorer/vector-explorer.html` | Original interactive Unit 2 Vector Explorer, now with global navigation and an explicit return-to-portal link |
| `https://physicswithsirnajam.github.io/physics-vector-explorer/portal/simulations.html` | Existing gallery, with all 31 original simulation cards, including a repaired Vector Explorer link |
| `https://physicswithsirnajam.github.io/` | Not configured by this project, may still show **404**; this is expected and unrelated |

## Quality and browser expectations

- The original scientific lab's entire pre-relocation source should match the historic fingerprint after mechanically removing **only** four new navigation fragments and the previous exact official-logo substitution. A screenshot merely showing a title is NOT sufficient to prove that tab/slider/quiz physics survived.
- The current student portal must remain the existing `portal/index.html` and must not be copied into root (which could cause broken relative Firebase modules/assets).
- All paths in the redirect and relocated lab are **relative**, so links work under the actual GitHub Pages subdirectory and a hypothetical root deployment.
- The shared navigation's active profile, login and enrollment restrictions are NOT changed by this public-page fix. A visible menu is navigation only, not a grant of access to private Firebase records.
- A meta-refresh fallback is client-side (GitHub Pages does not issue a true HTTP 301/302 from static HTML); browser history handling uses `location.replace` where JavaScript is enabled.
- Older external bookmarks to the root Vector Explorer will now open the portal; to link the original lab directly in a lesson, use the dedicated `vector-explorer.html` URL.
- GitHub Pages must finish publishing the merged main branch before the live URLs reflect these changes. Existing actions/security guards must remain green after merge.

## Merge gate

Keep this PR Draft until latest-head **Grade XI Homepage & Preserved Vector Explorer Navigation (V99-X)** completes **SUCCESS**, including original FNV science fingerprint, actual Chromium desktop/mobile and no-JS fallback, 31 gallery cards and both URL-prefix cases. The existing **V99-U** App Check/reporting launch lock must also stay green. Then owner review → **Ready for review → Merge pull request → Confirm merge**.

No Firebase Console actions, new secrets, DNS purchases, GitHub Pages settings changes or live App Check actions are needed. After merging, the owner should open the project root, dedicated vector lab, gallery link and portal on the **actual published GitHub Pages site** to verify navigation (and report any browser cache/old site variants).
