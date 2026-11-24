# V121 — Who should see worked answers and teacher review pages?

**Status: teacher review only; owner decision PENDING.** PR #220 was confirmed merged and checked on 24 November 2026. With the Grade XI Physics examination approaching on **Monday, December 7, 2026**, the priority is to protect working revision resources while explicitly deciding what is intentionally public and what would eventually require genuine teacher-only access.

## Main finding from actual GitHub source

The following **eight existing HTML routes are part of our public GitHub Pages repository**. Their current source and associated JavaScript/JSON were inspected for this review. Several pages expressly say that they are **public, post-practice** resources. In particular, the Unit 5 Set A, Set B and descriptive worked keys are separate from student tests but their answer-key JSON files remain accessible to any visitor. An initially hidden panel or **Reveal solutions** button controls *presentation*, not authorization.

**Therefore, it would be unsafe to claim these answers are private, and unnecessary to abruptly remove them before exams without the teacher's approval.** The distinction is between (1) deliberately public self-review or projector discussion, versus (2) genuine confidential teacher-only or unreleased examination materials, which would need authenticated backend delivery and an authorization audit rather than merely hiding a static link.

## Eight-item source-grounded owner decision register

| # | Existing public route | What it contains | Priority | Decision proposed for teacher |
|---|---|---|---|---|
| 1 | `portal/unit-05-descriptive-teacher.html` | 18 worked Section B/C OR alternatives with points-based marking | P1 | Post-practice student worked answers may remain public if intentional; otherwise remove the complete key and its public JSON to authorized backend |
| 2 | `portal/unit-05-mcq-key.html` | 16 answer letters and explanations, revealed deliberately | P1 | Retain as openly labelled *after-practice* review unless these questions are intended for a future restricted assessment |
| 3 | `portal/unit-05-mcq-set-b-key.html` | 16 answer letters and explanations, revealed deliberately | P1 | Same as Set A; a reveal button is not password protection |
| 4 | `portal/unit-04-discussion-slides.html` | 80 sequential question-first, teacher-revealed worked MCQ solutions | P2 | Retain as public teacher-led discussion if intentional; don't reuse its answers for a secure unseen exam |
| 5 | `portal/unit-05-projector-discussion.html` | Nine Section B/C internal-OR pairs, stepwise worked solutions | P2 | Retain after-practice projection; answers remain public to anyone who can load source files |
| 6 | `portal/unit-04-slo-audit.html` | Framework/source map, provisional 80-MCQ and descriptive coverage | P2 | Useful public academic transparency, but staff audit terminology may merit clearer student-facing explanatory links |
| 7 | `portal/unit-05-fbise-audit.html` | Four theory SLO classifications, practice publication status and answer-key links | P2 | Public framework explanation may remain; separate officially verified SLO classification from provisional individual answer/exam approval |
| 8 | `portal/unit-06-figure-verification-v91.html` | Six originally figure-held MCQ verification records and on-device figure comparison | P2 | Keep clearly labelled as public, local-only teacher-quality worksheet; it is not an official online staff approval process |

The eight **exact existing HTML files**, associated public scripts and any JSON files they read are fingerprinted in `quality/grade11-v121-eight-public-teacher-resources-audience-review.json`, with individual `ownerDecision: PENDING`. The review does **not** grant any permission change.

### What the source code establishes

- **Unit 5 40-mark descriptive discussion:** the separate `unit-05-v52-descriptive-teacher-key.json` is loaded by the public teacher page and also requested on the projector's *Reveal next step* action. It includes **18** worked alternatives. Source explicitly identifies public status and pending teacher academic approval.
- **Unit 5 Set A and Set B:** separate `unit-05-v50-16-teacher-key.json` and `unit-05-v51-16-teacher-key-b.json` contain the corresponding worked answers. Their public scripts expressly say source access is not restricted even when answers are initially hidden in the browser.
- **Unit 4 discussion:** `unit-04-discussion-slides.js` fetches the public `unit-04-v39-80-practice.json` bank and reveals a solution intentionally. This is public post-practice classroom material, not a timed test.
- **Unit 5 projector:** `unit-05-projector-discussion-v53.js` requests the same public teacher-key JSON for deliberate step-by-step display. Delaying the request does not change the public file's accessibility.
- **Unit 4/5 academic audits:** both contain teaching and syllabus explanations, with nonrelease cautions; a framework SLO classification is not proof of teacher-certified science/answers for every MCQ.
- **Unit 6 printed figure desk:** six source MCQs and local browser-based comparisons; uploaded figure photographs are kept on-device, and a copied review record does **not** update any official source bank or grant staff certification.

## Recommended owner decisions, before any implementation

1. **Public after-practice worked solutions (three Unit 5 pages):** Recommended default is to **retain publicly** for students reviewing past practice before December 7, with *after completion* and *not an official examination key* labels. If the teacher intends to reuse these as unseen secure tests, only an authenticated backend containing the actual answer data can support that intention.
2. **Projector discussions (two pages):** Recommended default is public, *after-practice* classroom discussion. Keep the deliberate reveal controls to help teaching, but don't call them access restrictions.
3. **Curriculum/SLO audit pages (two pages):** Recommended to keep publicly readable factual SLO/source context, but consider a separate student-friendly overview after teacher classification. Staff technical/QC language need not dominate exam revision pages.
4. **Unit 6 figure verification worksheet (one page):** Recommended to retain its existing honest **public, local-only, no-certification** label until the teacher decides whether a genuine staff-only audit process should be built behind trusted role-based authentication.

**No audience reclassification is authorized just because this teacher pack is merged.** The teacher may approve the recommendation, revise it per route, or defer it. In particular, *don't remove a useful post-practice key while students are preparing for the December 7 examination without explicit approval*.

## Academic, privacy and source integrity limits

This task reviewed actual GitHub HTML/JS/JSON as a **public resource-audience audit**, not the original NBF PDF or original uploaded FBISE model/framework anew. It does **not** independently certify that the scientific answers, source-page mappings or cognitive tags in those answer keys are all correct. It does not open actual student accounts or inspect personal submissions.

- Original Grade XI Units 1–6 question counts remain **275/206/220/640/349/560 = 2,250** provisional MCQs. The source-preserving **V111 (4), V114 (3), V116 (2)** Unit 6 corrections remain unchanged.
- All **560** Unit 6 individual key/source/SLO/cognitive/teacher approvals remain **PENDING**, and its full course/exam release remains disabled.
- The 2,250-entry answer-free reporting manifest, Copy-only MCQ issue reporting, Unit 1–2-only private attempt saving, Firebase monitoring-only App Check status, official branding and **V112 scientific superscript / repeated printed-PDF watermark** remain unchanged.
- This PR **does not change** the visibility, navigation, JavaScript, JSON, styling, links, authentication, Firebase, cloud storage, assessment classification or answer keys of **any** resource.
- Sitewide GitHub Pages files are public. Replacing a route with a login popup or removing it from the resource menu does **not** make the underlying HTML/JSON inaccessible. Private teacher access requires actual server-side authorization and a removal of answer data from unrestricted static hosting.

## Suggested next small PR after owner decision

If these resources remain public, prepare a narrowly scoped **student-facing label clarity** PR rather than moving or hiding files: clearly identify the Unit 5 worked descriptive link as **post-practice public solutions**, so students understand when to open it. Test this without changing any answer, question, or formal certification statement. If one or more must be restricted, prioritize a **separate authenticated role-based delivery design and security review**, and do not imply that static GitHub Pages hides answers securely.

## Verification and merge steps

1. Review the eight-source JSON decision register and this file in **PR #221** → *Files changed*.
2. GitHub Actions checks exact original page/script/source-JSON blob fingerprints, original Unit 6 source preservation, 560 pending reviews, 2,250 reporting references, and no inadvertent source/answer changes.
3. **Merging PR #221 adds a review record, not student-facing modifications or permission approvals.** After the teacher has read it, choose *retain publicly as post-practice*, *classify as teacher-only for future backend migration*, or *defer* for each category.
4. Later, if approved, implement exactly one small front-end labeling change or backend access-control design per PR, with original-key/SLO and PDF-watermark checks.

**Goal:** keep meaningful pre-examination revision accessible, truthful and safe while clearly separating public practice from genuinely restricted school assessments.
