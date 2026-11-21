# V98-M — Grade XI Public Interactive Lab and Figure Study Visual QA

## Prerequisite and release principles

**PR #156 verified merged**, merge commit `481422ffb176fdddf2c17ee389e656c5e58b0485`. Its V98-L audit confirmed the five Unit 4 concept-study guides, the Unit 3 collisions study guide and the twelve-SLO navigator loaded at 1280px, 390px and 320px with no diagnostic alerts.

This update is **test-only** and adds only the new local Chromium audit, workflow and documentation. No student-facing HTML, lesson wording, formulas, science engines, graphics, original logo, UI source, question banks, teacher keys, access permissions, Firebase rules or student progress records are changed.

## Seven previously untested public learning resources

| Page | Safe, meaningful smoke test |
|---|---|
| `portal/unit-03-motion-lab.html` | Change the initial motion speed and observe updated velocity; change projectile speed and observe updated flight range |
| `portal/unit-03-collision-lab.html` | Select the perfectly inelastic/stick collision and confirm the momentum-conservation explanation; switch the air-resistance tab |
| `portal/unit-04-rotation-lab.html` | Change arc angle and observe changed radians; select constant rotation and check zero angular acceleration |
| `portal/unit-04-angular-momentum-lab.html` | Zero the applied torque; exercise the skater's arms-out and arms-in controls |
| `portal/unit-04-artificial-gravity-lab.html` | Set the station to zero rpm then calculate an Earth-gravity target and read normal force |
| `portal/unit-04-centrifuge-lab.html` | Switch the **qualitative** separated/mixed tube diagram and vary rpm to check calculated acceleration changes |
| `portal/unit-06-figure-study-v90.html` | Verify four original learning schematics and an in-page jump to Fig. 6.3 |

The original page designs and IDs were inspected directly. The labs' numerical models and visual animations are not modified or newly certified here. The centrifuge diagram is explicitly illustrative and not a prediction of sedimentation/separation timing.

## Desktop/mobile source-local browser checks

`scripts/audit_grade11_uncovered_interactive_labs_v98m.cjs` serves the checked-out repository sources locally and runs headless Chromium. Each route is checked at **1280px desktop, 390px phone and 320px narrow phone** for:
- Original official header logo `portal/assets/physics-with-sir-najam-official-logo.png` loaded, visible, and accompanied by meaningful alternative text
- Correct branded title, main learning content/control, visibility of the graphical lesson, and **real, local-only** slider/buttons/switches as in the table
- Document-wide horizontal overflow (internal SVG/table scrolling may be legitimate), JavaScript exceptions, and missing same-origin resources
- Public student navigation **rotation lab → rotation study guide**

Evidence is saved in GitHub Actions artifact **`grade11-interactive-labs-v98m-evidence`**: **21 viewport screenshots**, a detailed `audit.json`, and a readable `report.md`. The source and smoke-test failures block CI; horizontal overflow and other visual anomalies are recorded as diagnostics that require human review **even when CI passes**.

## Academic and security boundaries

The test is entirely local and anonymous; no account sign-in, protected lesson, teacher answer key, grading or saved data is touched. It does not check every physics calculation against NBF/FBISE, live site deployment, Firebase authorization, screen readers or accessibility conformance. No answer keys or lessons are rewritten. If any genuine issue emerges, fix only the measured issue in a separate, focused, source-preserving PR.

## Review and merge

Once all latest-head checks are green, review `report.md` and screenshots under the workflow's artifact. Then use **Ready for review → Merge pull request → Confirm merge**. Do not merge pending/red checks. Do not describe a passed smoke test as full academic certification.
