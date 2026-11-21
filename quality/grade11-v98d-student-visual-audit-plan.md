# V98-D — Student-facing desktop/mobile visual QA, second seven-page sample

## Status and prerequisites

PR #147 (V98-C) is confirmed merged, at merge SHA `7f7beb01da1e6ef4dd48ec7fbbf8085608fa225d`. Its initial read-only Chromium sample of seven Grade XI student-facing routes passed on 1280px desktop and 390px phone widths with no local 404s, page JavaScript errors or horizontal overflow. That audit's diagnostic logs and screenshots were generated from the checked-out repository; they **do not** certify live GitHub Pages, private enrollment or all 73 portal pages.

V98-D continues our controlled, observational testing, with **no edits to existing public/student HTML, original image files, scientific engines, assessments, logins, or teacher-only resources**.

## Seven new student-facing routes

| Route | Visual/interaction focus |
|---|---|
| `portal/unit-02.html` | Unit 2 vector learning desk, resource navigation |
| `portal/unit-04.html` | Unit 4 rotational/circular motion learning desk |
| `portal/unit-05.html` | Unit 5 work-energy learning desk and a real safe link to its laboratory |
| `portal/unit-02-concept-lab.html` | Unit 2 interactive vector lab, `#vectorPlot` exists |
| `portal/unit-04-centripetal-lab.html` | Unit 4 centripetal interactive lab, `#circlePlot` exists |
| `portal/unit-05-work-energy-lab.html` | Unit 5 work-energy interactive lab, `#workTab` and `#kineticTab` |
| `portal/unit-06-topic-67-study-v95b7.html` | Unit 6.7 superfluidity detailed study, helium converter present |

All seven have already been inspected for existing canonical official-logo image references, viewport meta and page identity. None is a teacher-only answer key or private enrolled lesson; login is never attempted.

## Automated local browser checks

`scripts/audit_grade11_student_visual_v98d.cjs`, invoked through `Grade XI Student Visual Baseline Part 2 (V98-D)` in GitHub Actions, serves the checkout via a temporary read-only local HTTP server. Chromium checks all seven routes at **1280px desktop and 390px phone**:

- HTTP page response, brand title, exact existing original official-logo image loaded with an accessible nonempty `alt` and displayed on both viewports
- Core page or laboratory element exists, number of headings and visible links, recorded logo size
- Horizontal scrolling/overflow, hidden image, local 404s or JS page exceptions explicitly recorded as **diagnostic alerts**
- Real **Unit 5 desk → Work–Energy Lab** link followed and successful selection of its **Kinetic Energy** tab
- Fourteen viewport screenshots, machine-readable `audit.json` and a quick `report.md` uploaded to Actions as `grade11-student-visual-v98d-evidence`

A green check means the pages, primary logos, and safe navigation interaction passed. Review the report for **non-blocking diagnostic alerts even if the workflow is green**. A truly hidden brand logo is treated as a blocking audit failure.

## Safety and interpretation

No source page content, images, lesson knowledge, authentication, personal data, assessment releases, GitHub Pages configuration or Firebase access changes. The local browser may reflect logged-out portal views, not actual signed-in student appearance. Static and local tests are not substitutes for a later carefully scoped production/browser authorization review.

We will address confirmed presentation defects as separate, minimal pull requests rather than mixing seven pages with unrelated content changes. The green-check-first, one-PR-at-a-time workflow remains in force.
