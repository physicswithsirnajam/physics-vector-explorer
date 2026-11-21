# V98-L — Public Unit 3/4 concept-study and SLO-navigator responsive QA

## Verified prerequisite

PR **#155** is merged at commit `f955f1aac37118c270ec0274902728bb495227a5`, after narrowly resolving Unit 5 Work and Energy Study Guide's 320/375px source-filename overflow. V98-K's last successful workflow reported zero document-level overflow at six screen widths. The broader V98-I local audit's seven pages then had zero recorded diagnostic alerts.

V98-L continues this established *observe first, repair separately* workflow. This PR adds **only a test script, workflow and audit plan**. It does **not** edit any existing lesson, branding asset, simulation, exam MCQ, answer key, CSS, JS logic, student data, authentication or Firebase permission.

## New batch: seven distinct existing public resources

| Original page | Audit anchor |
|---|---|
| `portal/unit-04-rotation-study.html` | `#radian`: rotational kinematics |
| `portal/unit-04-centripetal-study.html` | `#net-force`: centripetal force |
| `portal/unit-04-angular-momentum-study.html` | `#conservation`: torque, inertia, angular momentum |
| `portal/unit-04-artificial-gravity-study.html` | `#artificial`: weightlessness, artificial gravity |
| `portal/unit-04-centrifuge-study.html` | `#applications`: centrifugation |
| `portal/unit-03-collision-study.html` | `#momentum`: air resistance, collisions |
| `portal/unit-04-slo-focus.html` | `#sloGrid`: source-derived 12-SLO classroom navigator |

All seven existing pages were inspected directly on `main` and confirmed to contain a viewport meta tag, original `portal/assets/physics-with-sir-najam-official-logo.png` image reference, correct title and content anchors.

## What V98-L measures

The new `scripts/audit_grade11_concept_studies_v98l.cjs` runs locally against checked-out files in Chromium, **without login**, checking each page at **1280px desktop, 390px phone and 320px narrow phone**. It checks official logo *loading and visible image* with meaningful alt text, actual study content, presence of the specified section, page-wide horizontal overflow, original page exceptions, local 404s, visible link count, and unusual logo size. It archives **21 screenshots**, `audit.json` and `report.md` as GitHub artifact `grade11-concept-studies-v98l-evidence`.

Two real read-only interactions are also tested:

1. The Unit 4 SLO navigator loads its provisional 80-MCQ source-bank JSON, computes **12 original summative-theory SLO cards**, and provides **12 SLO-filtered student timed-practice links** plus 12 separate public teacher-discussion links. The audit **does not open** the discussion deck or expose answer keys.
2. The Unit 4 Rotational Kinematics study guide's existing link successfully opens the student-facing interactive Rotation Lab.

## Severity and academic boundaries

An official logo not visibly loading, missing core study marker, missing SLO data or failed lab navigation is a **blocking** audit failure. Recorded width overflow and page errors are *diagnostic alerts* in the report; a green CI check must not be confused with a zero-issue audit. If one is found, fix the **measured** cause separately in a minimal source-preserving CSS PR, just as Units 1/5 were handled.

No bank answers are tested for academic correctness. There is no claim of live production sign-in/authorization testing, accessibility certification, official board approval or audit coverage of every site page. This only checks locally served existing public content. All original logos and content are untouched.

## Merge gate

Wait for latest-head CI to complete and inspect `report.md`/screenshots. If checks are green, **Ready for review → Merge pull request → Confirm merge**. Handle any concrete diagnostic in a separate PR.
