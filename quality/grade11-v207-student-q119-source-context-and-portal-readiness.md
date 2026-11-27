# V207 — Student-reported Unit 2 Q119 dependency repair and factual Grade XI portal readiness

**Predecessor verified:** PR #310 merged on 27 November 2026 at `1132bc2481d883f775f2b9e688112685d4852dc5`. No other open PRs at branch creation.

## Student issue: exact source truth, verified before fix

Student submission: **XI-U02-MCQ-0119**, Unit2 bank version `2:v19-dependent-question-context-review-2026-11-14`, asks “The scalar projection of A on B for Q116 is:” but its randomly selected view did not display **Q116**. This is a **real standalone-context defect**.

Owner source in current `question-bank/grade-11/unit-02.json`:
- Source **Q116** defines `A⃗ = 5î + ĵ`, `B⃗ = 2î + 4ĵ` and asks for `A⃗·B⃗=14`.
- Source **Q119** refers to Q116 but before V207 had no `contextSourceQuestionNumber`, `stimulusText` or `stimulusHtml`. The source keyed correct option **A** was `14/√20` (14 divided by magnitude `|B|=√20`).
- The student saw a shuffled A/B/C/D order with the same correct answer moved to **C**. This is **legitimate option shuffling**, not a miskey.
- The user-provided report was generated **locally**, not submitted to the protected teacher inbox. It includes no account identity, selected answer or score.

**V207 data repair:** Add **only a standalone source-Q116 vector context** to Q119 through the existing `contextSourceQuestionNumber=116`, `stimulusText`, `stimulusHtml` fields. Do **not** reword Q119's source stem, options, keyed answer, explanation or SLO. The practice renderer already displays `stimulusHtml` and the exported issue report includes `stimulusText`. The 15 intact four-question scenario groups remain unchanged, and Unit2 still has **206** original keyed questions (6 textbook + 200 additional). The manifest's SHA-256 and version must be updated together with the bank bytes.

**V207 tests:** Strengthen `scripts/validate_unit02_bank.py` with Q116/Q119 exact context and immutable source answer checks, plus a standalone Node regression testing the manifest hash, question arithmetic, source option order versus shuffled displayed order, five standalone dependent question references, 15 full scenarios, and Unit7 graded-release HOLD. Run earlier Grade XI context, source quality and builder/browser guardrails. No external personal data, backend reports or Firebase credentials.

## Verified Unit 7 content preparation — NOT live graded release

Three owner-authored Topic7 MCQ Word files, in proper FBISE boxed layout: **80 Topic7.1 + 80 Topic7.2 + 80 Topic7.3 = 240**. Topic7.1 source metadata explicitly reports **60 direct/conceptual and 20 standalone-situation** MCQs. The final 20 questions of the other two topic banks are also predominantly contextual/scenario-oriented, but **do not advertise 60 independently approved scenario MCQs** until each standalone stimulus and cognitive demand is checked. First-pass science/source/SLO review exists for all 240; further selected-item review and teacher approvals remain pending.

The original NBF Unit7 end-of-unit exercise contains **10 multiple-choice, 11 short-response, 8 comprehensive-response and 5 numerical problems = 34**. The textbook also contains **Examples 7.1–7.3** and **Assignments 7.1–7.3** (distinct from 274-topic/exercise item inventory; do not double count). Source-bounded QC from V174–V177 covers all 34 exercise items, but this is not equivalent to independently signed worked solutions or portal publication.

**Important numerical integrity:** The V177 first pass found only EOU Numerical **7.2** printed hint fully consistent. **7.1** is conditional on shear geometry/model, while original printed hints for **7.3–7.5** conflict with supplied inputs. The later V193/V194 source verification should be consulted before publishing any purported official solutions. No unqualified auto-scored numerical answer release.

Unit7 original-source identity inventory = **274**. V206 confirmed **80/80 Topic7.3 original identities accounted for** (26 earlier V185 detailed candidates, 48 additional source-only audits, six final); no authenticated human decisions or scored releases. There remain **39 Topic7.1** and **15 Topic7.2** originals outside those topics' detailed and source-only QC selections. Unit7 catalog remains `planned`, `questionBankCount=0`, `assessmentStatus=not-published`. Three public learning pages already exist: Topic7.1 introduction, Topic7.2 deformation, Topic7.3 elastic energy; simulation listing is provisional. **Prepared content ≠ accessible course page ≠ teacher-approved scored assessment.**

## Live Grade XI portal and source-navigation audit

`question-bank/manifest.json` contains Grade XI Units1–6 **2250** browser-practice MCQs: U1=275, U2=206, U3=220, U4=640, U5=349, U6=560 (the Unit6 content is labelled as **partial topic preview**, despite all seven topic files being included; do not change academic release labels without independent signoff). Original manifests are provisional source practice, not secure board papers. Unit7 has no live scored bank.

`shared/navigation.js` already provides unit-aware **Learn / Explore / Practise / Prepare / Track** resource categories and separate status signals. `portal/exam-quick-access.html` has explicit unit sections only **1–6**; `portal/verified-textbook-index-v103.json` contains **28 exact/source-related entries limited to Units1–4**. The textbook finder explicitly warns Units5–6 lack verified numbered source links; it has not yet indexed Unit7 examples, three assignments or EOU sections. This is a real discoverability issue consistent with student complaints.

**Next small PR — public resource architecture, NO DEEP-LINK FICTION:** For Units1–10, present consistent labelled sections:
- Topic lessons / notes and source diagrams
- Direct MCQ practice versus standalone scenario/stimulus MCQs
- **Textbook Worked Examples**
- **Assignments**
- **End-of-Unit MCQs**
- **End-of-Unit Short Response**
- **End-of-Unit Extended/Comprehensive Response**
- **End-of-Unit Numerical Problems**
- SLO-based questions / derivations (planned where not yet verified)
- Report a question or notation problem, with actual local-copy vs protected-server submission clearly distinguished.

Link **only to existing tested anchors**. For missing content, show “Not yet indexed” or “Source practice — solutions under teacher review” instead of an incorrect/dead shortcut. First add a Unit7 read-only exercise locator using source labels and statuses; do not import unapproved answer keys into the scored Test Builder.

## Secure release and post-Unit10 architecture

- **Build Your Test:** preserve login/class registration gates and existing unit limitations; verify mixed/individual simulations on both desktop/mobile and per-question source context; improve autosaved attempt results, unseen question rotation and SLO suggestions only after browser/session consistency verified. Do **not** label provisional scores as certified FBISE mastery.
- **Teacher provisioning:** V141/V143/V144 local teacher role and classroom security rehearsals exist; V160/V161 teacher backend gates explicitly remain **NO-GO for production and staging**. A production administrator-only invite workflow should verify an email, issue a one-time short-lived setup link (rather than a shared general password), require teacher-chosen secret, and attach teacher-to-class/roster relationships **from administrator backend only**. Reject self-assignment, cross-class read/write and role escalation, with audit logs, before enabling.
- **Issue inbox:** V138 provides copy/download issue reports but server-side teacher inbox remains gated by actual Firebase Auth/App Check/Rules readiness and V99-U. Future dedicated moderation dashboard should accept immutable question ID, version, sanitized report and reproducible visual evidence, then assign role-controlled triage statuses: new → investigate → source-verified → proposed fix → academic decision → staged regression → published/closed, with provenance and user privacy safeguards.
- **Motivation:** first ensure trustworthy attempt recording, then modest streaks, achievements for spaced practice, and nonpunitive re-engagement. No inflated grades or encouraging unhealthy compulsive usage.
- **Impact feedback/testimonials:** collect opt-in, privacy-safe student feedback after their examinations (confidence/utility/before-after preparation perception), clearly separate experience from measured improvement and require explicit consent before public testimonials, especially for minors. Do not infer causality from self-report alone.

**Schedule clarification:** 7 December 2026 is **Monday**; 10 December 2026 is **Thursday**. The timetable should be checked with the school rather than guessing the intended paper date. Keep any public launch deadline tied to the verified calendar.

**This V207 PR changes Unit2 standalone context data, its verified bank manifest, and the checksummed static reporting-reference snapshot for the same unchanged 2250 original IDs, plus validators/workflow and this review note. The static snapshot contains only ID, unit, original source number and version; its checksum is regenerated rather than bypassed. No source MCQ answer, Unit7 bank, Firebase/Auth/App Check, teacher role, staging/production or scored-release gate is changed.**
