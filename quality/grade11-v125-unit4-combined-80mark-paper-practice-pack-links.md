# V125 — Unit 4 integrated 80-mark student paper and public practice key shortcuts

**Prerequisite:** Owner reported PR #224/V124 merged; GitHub confirmed the merge and **17 successful reported workflow runs** on the PR head. Ahead of the **7 December 2026** Grade XI Physics examination, keep useful already-published classroom practice easy to find and clearly distinguished from official assessment materials.

## Two verified existing destinations

- `portal/unit-04-combined-student-paper.html`: **Unit 4-only, 80-mark, question-only** combined student paper. It displays 80 boxed MCQs (40 marks), seven four-mark Section B OR questions (28 marks), and two six-mark Section C OR questions (12 marks) from the existing original Unit 4 student practice content. Its own page says this is **not an official full-syllabus examination**; academic teacher review is pending.
- `portal/unit-04-assessment-pack.html`: separate **public practice pack** with printable blank OMR-style responses, manually marked practice keys, worked explanations and SLO/marks distribution. Its own page expressly says **Unit 4-only practice, not an official FBISE full-syllabus paper** or scanner-compatible OMR and **provisional pending teacher academic and print review**.

The verified Unit 4 Learning Desk already links both pages; this PR does not create a new assessment or claim human certification. The pack is a **public worked-key resource**, not authenticated teacher-only content. The user previously approved keeping the eight teacher-labelled reviewed resource pages public for practice while avoiding claims of security.

## Small proposed change

Under **Exam Quick Access → Unit 4 → Short and long responses**, retain the existing descriptive Sections B/C link and append exactly two links in question-first order:

1. **Combined 80-mark Unit 4 student practice paper — question-only, not official**
2. **Unit 4 practice pack — public worked keys and manual OMR (open after practice)**

Do not link new exams, invent source questions, replace original bank content, or change access rules. Existing resource count rises **50 → 52** across Units 1–6.

## Academic and technical protections

- The existing Grade XI provisional report-reference inventory is **2,250**, distributed **275/206/220/640/349/560** (Units 1–6). The combined 80-mark Unit 4 paper is a *view* of existing practice material, not additional central-bank MCQs.
- All **560** Unit 6 question-by-question academic approval entries remain **PENDING**, Unit 6 course `planned`, official graded assessment `not-published`.
- The original source MCQs, 18 Unit4 OR alternatives, keys, mathematical solutions, SLO/cognitive mapping, logos, print watermark, scores and progress records are unchanged.
- No new Firebase, App Check, authentication, confidential teacher role, live report submission, student data, hidden answers or formal release.
- Adapt the existing V101A link/test inventory to **52**, checking both exact local routes, destination notices, original answers-category practice-first order, and real Chromium mobile filters at **390px** with no horizontal overflow; retain desktop **1280px** and narrow-phone **320px** testing.
- New V125 Actions QA also executes inherited V124/V119 Unit4/Unit6 quick-link checks, V122 public descriptive-key label, V121 eight public resources, V118 exam-readiness, V94D Unit6 signoff and V99i pinned 2,250 answer-free reference safeguards.

## Owner acceptance

Open PR #225 and check **Files changed** for exactly four files: one live HTML anchors block, inherited V101A test updates, this quality rationale, and a new CI workflow. Keep PR as **Draft** until every latest-head check is green. If red, do not merge; share the failure. After checks pass, choose **Ready for review → Merge pull request → Confirm merge**.

When deployed, visit **Exam Quick Access → Unit 4 → Short and long responses** and verify three resources: existing Sections B/C practice, the combined **question-only** paper, and the **after-practice** public marking pack. Avoid using the publicly available marking keys for an unseen confidential examination.

**Scope:** two new shortcuts to original published practice resources only; no academic certification or backend security changes.
