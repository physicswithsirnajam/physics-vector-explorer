# V226 — Unit 8 Topic 8.2 Kinetic Theory of Gases, Example 8.2 and Work Sign Conventions

**As of 27 November 2026: first original-source-based, public unscored Topic 8.2 study preview. Not an approved original NBF worked-answer edition, summative assessment or teacher-certified question bank.**

## Original source verification conducted
- The owner's unaltered original **NBF Grade XI Physics Model Textbook** private PDF, originally materialized for V224. **Printed pages 131–134** were reopened and visually reviewed before authoring.
  - p.131: 8.2 Kinetic Theory of Gases, ideal assumptions, low-pressure limitations, original schematic Figure 8.2.
  - p.132: density and molar-mass relation `ρ = pM/(RT)`; §8.2.1 constant external-pressure work and p–V rectangular area, original Figures 8.3–8.4.
  - p.133: original **Example 8.2** argon-cylinder gas pressure; **Assignment 8.2** constant-pressure one-third compression; §8.2.2 signed work by and on gas; original Figures 8.5–8.6.
  - p.134: zero work for unchanged volume; **8.3 Gas Laws** begins and is deliberately **not** claimed as a completed lesson.
- Official FBISE Grade XI Physics Assessment Framework Domain C original:
  - `P-11-C-05`: ideal kinetic theory assumptions and applicability, **Summative / Understanding**.
  - `P-11-C-06`: use W=pΔV for constant-pressure volume change, **Summative / Application**.
  - `P-11-C-07`: distinguish work by versus on gas, **Summative / Understanding**.
  These are official outcome demands. The student study page does **not** constitute individually approved summative question mapping.

## First source-grounded learning content
`portal/unit-08-topic82-kinetic-gases-work-v226.html` uses the original official navy/gold branding asset unchanged and builds the following content in independent wording:
1. Gas-particle theory assumptions (numerous, negligible particle volume, continuous random motion, elastic wall/particle collisions, absence of intermolecular forces outside collision idealization), pressure from collisions, limitations at low T/high density.
2. Use n=m/M and `pV=nRT` to establish gas density `ρ=pM/(RT)`, with SI units and explicit ideal-gas limitations.
3. **Work signs:** for constant external pressure, `W_by=p(V_f−V_i)` and `W_on=−W_by`. Expansion: by +, on −. Compression: by −, on +. Isochoric: both 0. A rectangular area under a constant-p P–V graph applies to *work magnitude*; signed direction and the more general quasi-static `∫p dV` are stated clearly without redrawing or copying any publisher diagrams.
4. **Original Example 8.2** in separately authored worked adaptation: 2 kg argon, 0.040 kg/mol, cylinder r=1 m and h=2 m, T=30 °C=303 K. `n=50 mol`, `V=πr²h≈6.283185 m³`; with `R≈8.314`, `p=nRT/V≈20046.695 Pa≈2.00×10⁴ Pa`. This is an ideal-gas result, not an independently authenticated publisher answer.
5. **Original Assignment 8.2** separately worked using original printed data: gas compressed to **one-third original volume** at constant p=2.25×10⁵ Pa, work **on gas** +200 J. Thus `ΔV=−(2/3)V_i`; `W_on=−pΔV=(2/3)pV_i`; `V_i=1.3333×10^-3 m³`; `V_f=4.4444×10^-4 m³=0.4444 L`; `W_by=−200 J`. This independently resolves the sign with clear intermediate steps; source text not reproduced verbatim.
6. On-page, no-login **constant-pressure signed-work calculator** in kPa and L with built-in `1 kPa·L = 1 J`; independent interaction for compression, expansion, constant volume and invalid inputs. Four unscored conceptual self-checks with revealable explanations.

## Navigation and release boundary
- `portal/learning-catalog.json`: Unit 8 remains `status=planned` and `assessmentStatus=not-published` with `questionBankCount=0`, 4 existing public simulations and **2 unscored source-anchored topic previews** (8.1 and 8.2).
- `shared/navigation.js`: one second Unit8 link inside its existing **Next Units** block, using fixed topic `8.2` and explicit public-unscored access, with no Test Builder links.
- `portal/exam-quick-access.html`: show both unscored lesson links and the existing simulations; no artificial full-unit student bank or graded result.
- Existing Unit7 0 graded items and outstanding independent V223 teacher-signoff dependency remain blocked. Existing 2,250 Units1–6 provisional student MCQs and 59 catalog resource records remain unchanged.
- Original publisher scans, figures, exact question stems, grading keys, actual teacher individual approvals and original SLO coding are not copied or silently modified.
- No Firebase/Auth/Firestore/App Check, grade persistence, student class membership, teacher backend, login protection or authenticated reviewer decision is invented.

## QA / next stage
V226 source code test derives original 8.2 pressure and assignment volumes/work **independently**, validates printed source/SLO records, checks both work sign conventions and isochoric zero. Real Chromium **1280/390/320** tests sidebar/Exam Quick Access -> new source page, conditional assignment solution, work-calculator default/compression/expansion/zero change/invalid pressure, accessibility elements and zero horizontal overflow. Re-runs prior V225, V224, V209, V140 and 2,250 immutable ID/key tests.

**Do not merge until all latest-head GitHub Actions checks are green.** Then review the seven changed files, Ready for review → Merge → Confirm. After deploy check Next Units → Topic 8.2 or Exam Quick Access → Unit 8; try p=225 kPa, Vi=1.3333 L, Vf=0.4444 L and confirm W_by≈−200 J / W_on≈+200 J; reverse the volume change and verify signs. This remains an unscored, independent-teacher-review-pending lesson.

**Next unit focus V227:** NBF Topic 8.3 The Gas Laws, pp.134–135, and textbook transition to 8.4 First Law. Keep each separately scoped and source-verified; do not create original end-of-unit question banks or mark the full unit complete without source/key/teacher review.
