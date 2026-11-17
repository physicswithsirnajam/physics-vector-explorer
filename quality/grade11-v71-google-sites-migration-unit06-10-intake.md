# V71 — Consolidating the Grade XI portal and preparing Units 6–10

## Decisions and safeguards

- Defer the custom domain purchase until two classes are complete.
- Make the GitHub/Firebase portal the primary learning navigation. V71 replaces the two remaining generic Google Sites entries in the Unit 1 learning catalogue, while retaining the **clearly labeled legacy hub** as a temporary source until important notes are moved.
- Change the generated PDF/printed report watermark to the classic Times New Roman serif stack (with Times, Liberation Serif, Georgia and serif fallbacks), keeping the repeating diagonal Physics with Sir Najam text on **every page**.
- **Do not add new watermarks to migrated original student notes at this stage**. The user will decide this separately. Only own report and MCQ solution PDF watermarks change. Review third-party content rights before branding it.

## Actual inventory

- Grade XI Units 1–5 are published with **1,690 provisional MCQs**: Unit1 275, Unit2 206, Unit3 220, Unit4 640, Unit5 349. There are 31 original public simulations and 59 existing catalog resource entries; V71 preserves those totals.
- Units **6–10 are already planned placeholders** and remain unpublished here.
- The user's ChatGPT Library already contains **Grade11_Unit6_COMPLETE_MASTER_ALL.pdf**, 577 pages, including seven Fluid Mechanics topics with an 80-question prepared MCQ section for each (560 topic MCQs), a 14-item textbook MCQ section, SLO practice, worked answers, comprehensive end-of-unit exercises, and teacher materials. **These are source inventory figures, not a bank published to the portal**. The bank count and scenario groups need physical source extraction and de-duplication.
- Unit 7 has some Topic 7.1 prepared source files in the Library. Complete source availability for Units7–10 remains to be checked.
- Existing NBF textbook and FBISE model/framework files are available to use as academic comparison sources. Do not claim summative item-SLO certification until each question is verified.

## Google Sites: public landing versus private site

**Do not mistake Hide from navigation for privacy**: Google says a hidden page can still be opened by link. Also, if Published site is Restricted, anonymous visitors cannot see a redirect/notice page at that same Google Site URL.

**Recommended no-cost migration:**

1. Copy the entire existing Google Site (Google Sites → More → Make a copy) and store the copy as an **unpublished** archive. Save linked Google Drive notes/PDFs separately; a copied Site does not convert public linked files to private files.
2. Inventory every note, PDF, lesson page, embedded document, image, assessment and old direct URL. Record who created it, the source publisher, what may legally be shared, and whether it was publicly shared.
3. Classify each resource as: original public sample, enrolled-learner note, internal-only teacher key, or third-party content requiring separate permission.
4. Move each allowed student note to its secure destination **and test that destination first**. **Cost constraint:** as of November 2026, Cloud Storage for Firebase requires a Blaze pay-as-you-go plan linked to a billing account, even if some usage stays within no-cost allowances; DO NOT activate it without explicit owner approval. A trusted authenticated backend also needs cost and deployment review. For a no-new-billing phase, use existing securely limited **Firestore text-only original course lessons** when suitable (individual standard Firestore documents have a 1 MiB maximum), subject to reviewed rules and small-volume limits, or keep full original PDFs in **restricted Google Drive** (which requires separate manual Google permissions rather than Firebase portal access). A public original note may be linked only after the owner explicitly decides it is intended to be public.
5. Decide **no additional watermarks on notes yet**; preserve source PDF pages while reviewing future branding policy. Existing protected lessons are readable by verified learners who can currently self-activate Grade XI; they are NOT administrator-approved grants. Do not publish sensitive/private notes even as Firestore text until rule testing and entitlement decisions are complete.
6. Once links are migrated: replace the publicly published Google Sites homepage with a simple transition message and portal link; **remove or delete previously published resource pages/embeds** and republish. Test in incognito. Mere navigation hiding is insufficient.
7. For Google Drive files still shared with Anyone with the link, choose Share → General access → Restricted and review inherited folder permissions. Also unpublish any separately Publish-to-web documents. Test previously public file URLs separately.
8. Verify that old Google Sites page URLs no longer display notes, the publicly accessible homepage still shows the new portal link, and logged-out visitors cannot download restricted files. Existing previously downloaded copies cannot be recalled.
9. To make the **entire old Google Site Restricted**, choose Google Sites → Share → Published site → Restricted; understand that the site's public landing message then disappears too. If that mode is required, create a different public landing page instead.
10. Do not delete the original or remove access to essential notes before the replacement has been checked by enrolled students.

## Suggested landing page wording

PHYSICS WITH SIR NAJAM — THE STUDENT PORTAL HAS MOVED

Our Physics learning resources, simulations and practice are being consolidated into one Student Portal. Please open the link below to sign in or register and continue learning.

OPEN STUDENT PORTAL: https://physicswithsirnajam.github.io/physics-vector-explorer/portal/

We are moving study notes in stages. Please follow your class instructions for any remaining resources.

**Before publishing**, verify the precise active site address in GitHub Settings → Pages, as the browser URL was not independently verified in this review.

## Units 6–10 academic publishing workflow

| Stage | Recommended preparation | Check before publication |
|---|---|---|
| 0. Source inventory | NBF chapter pages; master topic notes; questions and answer keys, if already prepared; latest official FBISE framework | Stable filenames, original source hash, exact printed and PDF page references |
| 1. Topic/SLO map | Textbook topics and official summative/formative/PBA classification | Do not carry topic-level SLO candidates as verified item-level mappings |
| 2. Study desk | Clear original explanations, solved numericals, accessible figures and source references | Accurate physics, mobile/desktop readability and copyright/license |
| 3. MCQ transfer | Preserve all original MCQ stems, four options, explanations and complete scenario sets | Answer-table transfer, duplicate and error checks, source traceability |
| 4. Independent QC | NBF original worked examples and recalculations | Compulsory versus optional corrections listed **only for items needing change**, not silent bulk edits |
| 5. Release | Unit bank, scenario test builder, navigation, teaching guide, simulations, SLO review | CI green on final PR; no regression to existing banks, accounts or classroom resources |
| 6. Restricted downloads | Original shareable PDFs + explicit entitlements/verified Storage rules, after backend setup | Anonymous and another student cannot download by direct URL |
| 7. Teacher signoff | User manually checks content and student workflow, merges PR | Unit marked available only after approval |

**Sequence**: Begin with **Unit6 Fluid Mechanics** (source-rich), then Unit7 Physics of Solids (partial source present), then Units8, 9 and 10 in NBF order. We can reuse the previously prepared Unit6 source in Library; no need to retype it or re-upload it unnecessarily. The user may send later completed unit notes/MCQs as available. If none exist, we can draft from the supplied NBF book one topic at a time and have the user academically approve them before publication.

## Security work before real protected notes

- Keep the existing Grade XI self-enrollment free pilot unchanged until a safe migration is designed. Current Firestore rules let verified students create a one-time active enrollment, so this is **not admin-approved access**.
- Prioritize a no-production-changes Firebase Emulator test suite of the user-supplied rules, followed by course-specific approved access grants.
- Then test Firebase Storage rule protection, download links and the recurring cost/usage implications before uploading restricted files.
- No admin role grants, Firebase rule publication, paid subscriptions, domain purchase, private file migrations or Unit6 MCQ uploads happen in V71.

## Visual audit limits

The portal source, catalog, CSS, modules and previous headless Chromium regressions were inspected. The live GitHub Pages and live Google Sites addresses could not be opened from the current browsing environment, so V71 tests local source renders and cannot claim pixel-by-pixel production UI inspection. Finish with a logged-out and logged-in live mobile/desktop manual walkthrough.

## Pricing reference verified 17 November 2026

Firebase official documentation states Cloud Storage for Firebase **requires Blaze pay-as-you-go**, with billing linked even when usage fits the product's included no-cost thresholds: https://firebase.google.com/docs/storage/faq-and-troubleshooting . Firestore Standard individual documents have a maximum 1 MiB and the default database offers a no-cost quota: https://firebase.google.com/docs/firestore/quotas and https://firebase.google.com/docs/firestore/pricing . These facts do **not** mean image-rich/full-length PDF files should be stored as Firestore strings. No billing or Storage setup is part of V71.
