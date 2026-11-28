# V247 — Original NBF Grade XI Physics Unit 8 numericals 8.4–8.6: source-first academic review

## Provenance and scope

Following the confirmed merge of **PR #349 / V246**, the original supplied NBF Physics XI scan, **printed page 153**, was inspected visually in full for the exact numbers, stated constraints and publisher answers of **numericals 8.4, 8.5 and 8.6**. The original source hash and V235 nine-numerical inventory are recorded in the companion JSON. The book's source wording and printed answer labels **remain unchanged**. This is a teacher-only conditional numerical audit, **not** a certified student solution or an imported scored bank.

## Teacher-facing amendment triage

| Original numerical | Publisher answer | Independent calculation and evidence | Compulsory/optional; keep or independently add? |
|---|---|---|---|
| **8.4 — Carnot engine, 600 K / 400 K, heat 600 J** | **200 J** | The printed statement says heat **absorbed at the low temperature of 400 K**, despite describing a Carnot **engine** with hot reservoir 600 K. The publisher result comes from `W_by=600[1−(400/600)]=200 J` **only if** 600 J is *instead absorbed from the 600 K hot reservoir*. If **600 J is rejected at 400 K** by a reversible engine, `Q_H=600(600/400)=900 J` and `W_by=300 J`. If a **reversed Carnot refrigerator absorbs 600 J at 400 K**, it requires `W_in=600[(600/400)−1]=300 J`. These are **different processes**. | **COMPULSORY source-text contradiction, BLOCK unique graded answer**. Preserve the original 400 K absorption wording and printed 200 J as publisher data. **Do not** silently change “low” into “high”, or identify 200 J as proven from the question as written. A separate, explicitly conditioned Carnot-engine variant may be authored after approval. |
| **8.5 — immersion heater heats 136 g of water from 23.5°C to boiling point** | **198 s** | At normal atmospheric pressure, take final temperature **100°C**, so `ΔT=76.5 K` and `m=0.136 kg`. Ignoring loss, `Pt=mcΔT`. For `c=4186 J/(kg·K)`, `t≈197.9597 s→198 s`. For commonly rounded `c=4200 J/(kg·K)`, `t≈198.6218 s`, or **199 s** to the nearest whole second, with both approximately **199 s**. The original problem does not state `c` or atmospheric pressure. “Bring to boiling point” means **heat to 100°C**, not vaporise all the water. | **OPTIONAL model/constant/rounding note**. Keep the original. Printed 198 s is consistent with a standard unrounded specific heat. No reason to label the problem an arithmetic error. **COMPULSORY summative-SLO eligibility review**: the V224 Unit 8 official domain inventory contains no direct specific-heat heater-time outcome. |
| **8.6 — increase heat-source temperature for 50%→70% efficiency** | **397 K** | **Only assuming a reversible Carnot engine**, an unchanged cold-side reservoir at *numeric room temperature* `T_C`, and efficiencies `η_1=0.50, η_2=0.70`, one has `T_H1=T_C/(1−0.50)=2T_C` and `T_H2=T_C/(1−0.70)=(10/3)T_C`; hence `ΔT_H=(4/3)T_C`. Using `T_C=298 K` gives `ΔT_H≈397.3333 K→397 K`, whereas `T_C=300 K` yields **400 K**. The source does **not** numerically set room temperature or explicitly guarantee a fixed sink/reversible operation. | **COMPULSORY Carnot/fixed-sink/room-temperature qualifications and cognitive review**. Keep original 397 K as publisher data, but distinguish it from an unconditionally determined answer. Independently written, fully specified assessment item may be added after teacher approval. |

The **198 s / 199 s** distinction is a minor choice-of-constant/rounding issue, unlike the **different physical processes** behind 8.4. Do not conflate them.

## Physics safeguards for future approved solutions

**8.4 — signed heat versus heat magnitudes.** In a complete reversible heat-engine cycle, positive magnitudes `Q_H>0` absorbed from the hot source and `Q_C>0` rejected to the cold sink satisfy `W_by=Q_H−Q_C` and `Q_C/Q_H=T_C/T_H`. For an ideal refrigerator, cold-side heat **absorption** is a useful cooling effect but **net work is input**, not positive engine work output. The original printed wording associates absorption with the cold side; thus its **200 J** cannot be certified as its engine-output answer. Neither the source stem nor its printed answer is edited.

**8.5 — dimensional consistency.** `P=220 W=220 J/s`, `m=136 g=0.136 kg`, `ΔT=100−23.5=76.5 K`; `m c ΔT` has units joules and `(m c ΔT)/P` units seconds. No latent heat is included because the task stops at the boiling point. Some reasonable textbook values of water's specific heat alter the rounded final second; both the chosen constant and rounding convention belong in a teacher key.

**8.6 — different reservoir temperatures.** The textbook asks for **difference between the two hot-source temperatures**, not the hot/cold temperature difference of one engine. `η_C=1−T_C/T_H` uses **absolute kelvin** and applies to reversible Carnot limit. Assuming `T_C=298 K` gives `T_{H,1}=596 K`, `T_{H,2}≈993.33 K`, so `ΔT_H≈397.33 K`. If the room acts as neither a fixed cold reservoir nor a specified numerical one, the unique 397 K result cannot be derived.

## Candidate FBISE mapping and sign-off

| Original | Recorded candidate summative outcome | Official cognitive level | Outstanding status |
|---|---|---|---|
| **8.4** | **P-11-C-23** Carnot limit; secondary **P-11-C-16** working principle | **Knowledge**; secondary Knowledge + Understanding | Observed **Application**, source contradiction and teacher assessment ruling **PENDING** |
| **8.5** | **No verified directly matching SLO** in V224 Domain C. Secondary conceptual link **P-11-C-11** (conservation) is **indirect only** | P-11-C-11 is **Application**, but not a direct heater-time permission | **Do not fabricate** a heat-capacity SLO or silently label it summative-approved |
| **8.6** | **P-11-C-23**, secondary **P-11-C-16** | Knowledge; secondary Knowledge + Understanding | Observed **Application** with unstated Carnot and room/sink assumptions; teacher ruling **PENDING** |

These are source framework **candidates**, not official certification of the individual numerical questions.

## Inherited protections and next batch

- The V235 full original index contains **9 numerical problems**, and this PR brings preliminary QC coverage to **6/9** after V246 (8.1–8.3). Original 8.4 and 8.6 concerns were already flagged in V235; the 8.5 constant note is a new explanatory qualification, not a newly established defective source stem.
- Preserve all earlier V224–V246 source reviews, **18/18 MCQs, 13/13 shorts and 10/10 visibly printed comprehensives**, including the missing comprehensive 8.8 numbering.
- Unit7 and Unit8 scored assessment availability remains **zero** (`questionBankCount=0`, `assessmentStatus=not-published`). Existing unscored lessons and simulations remain untouched. Preserve exactly **2,250** pinned Units1–6 MCQs, their IDs/options/keys, **59** catalogue resources, Firebase/Auth, roles, rosters, student marks/results and navigation.
- The V247 regression tests verify original source identifiers and printed answer labels, arithmetic for the **three different 8.4 interpretations**, both 8.5 heat-capacity constants, two possible 8.6 room temperatures, original official SLO metadata and prior V246–V224/source/bank gates.
- **Human science approval PENDING; teacher SLO/cognitive ruling PENDING; approved numerical solution edition NOT-PUBLISHED; scored student Test Builder release HOLD.**

**Next V248:** source-review original numericals **8.7–8.9** on p.153: Carnot rejection from `Q` at `T` to `T/3`, signed entropy of freezing under the supplied unusual latent-energy data, and the two-part isobaric gas-expansion work plus an independently checked P–V diagram. Keep all original source conditions and answer labels, with independent recalculation rather than unstated correction.
