# V98-O — Remaining Grade XI Public Resources, Links and Student Navigation

## Verified prerequisite and intent

PR **#158 (V98-N)** is merged at commit `0b06514658bea2b2c4f848212a254be35aee5bd8`. Its seven public entry pages passed their latest-head desktop, mobile, navigation and branding checks with zero diagnostics. The authenticated personalized Learning Hub remains outside that unauthenticated audit.

This new PR adds **only a browser script, GitHub Actions workflow and this quality note**. It does not modify any existing learning resource, student progress data, scientific simulation, academic question or answer, logo/banner, privacy permission or account workflow.

## Seven public resources not covered in the previous entry audit

1. `portal/unit-02.html` — Vectors Learning Desk, including direct navigation to the Unit 2 formula sheet.
2. `portal/unit-04.html` — Rotational Motion Learning Desk, including direct navigation to the rotation study guide.
3. `portal/unit-05.html` — Work and Energy Learning Desk, including direct navigation to its study guide.
4. `portal/legacy-hssc-resources.html` — Original Notes and Concept Videos directory. Checks that original JSON catalogs load, Unit 2 filtering works and searching for an unavailable title then clearing the query restores the catalog.
5. `portal/privacy.html` — Pilot Privacy & Account Information disclosure and link returning to the portal. **Not a finished legal privacy policy**, consistent with its existing notice.
6. `portal/unit-03-assessment-pack.html` — Public Unit 3 practice pack (the four OMR columns, six stimulus-group blank boxes, and source-backed ready state). Does **not** click any print action or teacher resources.
7. `portal/unit-04-assessment-pack.html` — Equivalent public Unit 4 practice pack; no printing, marking or teacher-resource reveal.

## Link-integrity improvement

The test parses **all static local anchor links** on the seven existing HTML pages and confirms that their target paths exist in the checked-out repository. It **does not open** teacher, enrolled, authentication-dependent or otherwise sensitive destinations to check content. External Google Drive, YouTube and third-party URLs are **not requested**; their availability remains governed by their hosts.

This is an existence/route check, not a guarantee that enrolled students are authorized to access linked private lessons or that every fragment target is valid. A genuine broken local link is a blocking regression requiring triage.

## Browser diagnostics and screenshots

The script runs Chromium against a temporary HTTP server for checked-out source files at **1280px desktop**, **390px phone** and **320px narrow phone**. It verifies the unmodified canonical official Physics with Sir Najam logo actually loads and is visible, page title/viewport, dynamic source bank readiness, simple public study navigation, browser JavaScript exceptions, local 404s, and overall page horizontal overflow.

GitHub Actions artifact `grade11-remaining-public-v98o-evidence` will contain **21 viewport screenshots**, an `audit.json` and a readable `report.md`. Even if the job finishes green, the Markdown report can contain non-blocking width/runtime diagnostics that should be reviewed before merging.

## Important scope boundaries

Unit 3/4 assessment-pack scripts are **already public code**, which automatically loads the public answer-bearing practice-bank sources. The audit simply verifies existing blank student OMR preparation and the teacher display remains collapsed. It neither claims that these public source files are confidential nor clicks/reveals the teacher section. The audit does not edit grades, use accounts, trigger printing, submit question responses or connect to Firebase. No external YouTube playback is attempted.

This is a **source-local browser audit**, not a live production, academic-answer-certification, private-permissions, legal compliance or accessibility-conformance assessment. If a true issue is detected, preserve it in the diagnostic report and address the root cause in a separate small source-preserving PR.

## Merge gate

Leave PR in Draft until latest-head checks complete successfully, inspect the screenshot/report artifact, then use **Ready for review → Merge pull request → Confirm merge**. Never merge red or pending checks.
