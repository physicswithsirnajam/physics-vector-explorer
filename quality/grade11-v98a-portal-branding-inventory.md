# V98-A — Grade XI portal and student-facing route branding inventory

**Audit-only PR. No page presentation changes.** Inspected `main` after PR #144 merged (merge SHA `f141c0fb1bb439c3d7c16f5806657811f89348df`). This phase follows the official-logo integration batches #139–#144.

## Scope and method

The audit reads every top-level HTML file in `portal/` (73 files), the 30 recorded root standalone simulation HTML files, and three other root student-facing HTML files (`index.html`, `student-guide.html`, `build-your-physics-test.html`). It checks direct `<img src>` references, original logo paths and shared branding script integrations. These are **source-level results**: a browser viewport, disabled images, CSS visibility, access control, active routing, page performance, and science correctness are **not** conclusively tested by this inventory.

The one authoritative brand asset is `portal/assets/physics-with-sir-najam-official-logo.png`. Its original corresponding banner is `portal/assets/physics-with-sir-najam-official-banner.png`. Do not generate, redraw, recolor, crop or modify these originals.

## Portal HTML inventory

| Section | HTML files checked | Direct original-logo image references | Direct original-banner image references |
|---|---:|---:|---:|
| Core (home, simulations, lesson, privacy, legacy resources) | 6 | 6 | 2 |
| Unit 01 | 4 | 4 | 0 |
| Unit 02 | 5 | 5 | 0 |
| Unit 03 | 10 | 10 | 0 |
| Unit 04 | 19 | 19 | 0 |
| Unit 05 | 11 | 11 | 0 |
| Unit 06 | 18 | 18 | 0 |
| **Total** | **73** | **73** | **2** |

The two portal pages displaying the original banner are `portal/index.html` and `portal/secure-lesson.html`. Other pages use a compact logo instead of a large banner, which is appropriate for scientific controls, detailed study pages, test views and projector layouts. **Recommendation: do not add a second logo or a full banner to the 73 already-branded pages.**

## Other root student-facing pages

| Page | Finding | Action |
|---|---|---|
| 30 standalone laboratory HTML files | All 30 include the existing, validated official-logo shared component; five Unit 6 files use `simulation-return-v96c.js`, the other 25 use `standalone-brand-v97a.js` | None; retain existing verified components |
| `student-guide.html` | References the direct official logo asset | None |
| `build-your-physics-test.html` | Displays `assets/branding/physics-with-sir-najam-logo.png`; GitHub blob SHA for this asset and `portal/assets/physics-with-sir-najam-official-logo.png` are both **`7c40a353dc59b7009c41e3888941da2317483d88`**, and both are 2,729,109 bytes. The audit regression independently confirms their file bytes match | No logo replacement. An optional future consolidation may reduce duplicate asset storage, but not necessary for correct visual identity |
| **`index.html`** | **Actual gap.** This is the original Unit 2 Vector Explorer simulation, not a redirect. Its header has `<div class="brandmark" aria-hidden="true">✦</div>` with brand text but **no official image tag** | **Next focused PR:** replace only decorative star with a small, exact existing official-logo reference, carefully preserve all vector controls, checks and projector layout; test phone and desktop |

There are no other **known** gaps in this scoped source inventory; this does not certify the entire live site.

## Assessment and teacher-facing caution

The `portal/` tree contains paths named for teacher/descriptive feedback and MCQ keys (for example `unit-05-descriptive-teacher.html`, `unit-05-mcq-key.html`, and `unit-05-mcq-set-b-key.html`). **A static HTML filename, badge, or client-side link does not constitute server-enforced authorization.** This **branding** audit does not judge whether these resources are intentionally public or properly protected. Review student/teacher answer-key exposure, genuine access controls and publication approval in a separate privacy/security workstream before making access claims; do not publish private answer material merely to standardize branding.

## Regression added by V98-A

The read-only `scripts/audit_grade11_brand_v98a.cjs` checks every current/future top-level portal HTML page for an actual official-logo `<img src>` reference and nonempty alt text, ensures the known 30 standalone pages keep their validated branding-script references, verifies both shared components point to the original asset, and confirms that the Test Builder's alternate-path logo is **byte-for-byte identical** to the canonical logo. The root `index.html` gap is explicitly warned and left unchanged, rather than silently fixed in an oversized PR.

The `Validate Grade XI Branding Inventory (V98-A)` workflow runs this test with Node.js and no browser, no secrets, and read-only repository permissions. No physics calculations, student data, Firebase, authorizations, or release flags change.

## Next quality-first decisions

**Phase B (small visual remediation):** repair only the root Vector Explorer `index.html` brand mark using the original official logo and a dedicated browser regression. **Phase C (optional):** audit true visual rendering and access permissions in separately scoped steps. Continue the one-PR-at-a-time and green-checks-first process.
