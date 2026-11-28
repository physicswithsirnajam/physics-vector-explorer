# V235 — Original NBF Grade XI Unit 8 Exercise Inventory and Source-Integrity Triage

## Scope and provenance

This is a **review-only** step after merged V234 / PR #337. The owner's original scanned NBF Grade XI Physics book was reopened and **pages 150, 151, 152 and 153 visually examined at readable resolution**. Source file SHA-256: `00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe` (same as preserved V224 source inventory).

The new machine-readable inventory lives at `quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json`. It **does not include printed question stems, answer options, solutions, copied diagrams or original numerical results**. Focus labels paraphrase topics solely for source tracking. The actual source is a scanned-image textbook with a visible third-party watermark; no original page images belong in the public portal.

### Counts, provenance, numbering

| Exercise family | Printed pages | Observed numbered items | Numbering |
|---|---:|---:|---|
| MCQs | 150–152 | **18** | 1–18; 1–4 p.150, 5–17 p.151, 18 p.152; item 17 straddles pp.151–152 |
| Short-response | 152 | **13** | 8.1–8.13; item 8.13 has (i)–(iv) |
| Comprehensive-response | 152–153 | **10 visible** | 8.1–8.7 on p.152, then 8.9–8.11 on p.153; **8.8 not printed in the inspected pages**; item 8.4 has (a)–(d) |
| Numerical problems | 153 | **9** | 8.1–8.9; item 8.9 includes (a) and (b) |
| **Total top-level items** | **150–153** | **50** | Subparts do not count as separate top-level numbered items |

**Important V224 reconciliation:** Existing `unit08-v224-original-textbook-source-slo-inventory-no-keys.json` states there are **11** comprehensive responses (8.1–8.11). Reinspection shows **10 printed numbered questions**, skipping **8.8**. We intentionally **preserve the V224 audit as a historical baseline** and record the discrepancy explicitly in V235, rather than silently changing a previously audited manifest or manufacturing a missing item. A separate teacher/source review may approve a correction to the baseline.

### Initial QC triage (NOT solved-answer certification)

The following are **possible source flaws or missing assumptions**, not accusations that every printed answer is wrong. Every flag has a source page and an independent-research/teacher-review hold in the JSON. Actions below describe what is **compulsory before a teacher-approved public answer edition**, not an instruction to alter the scanned source.

| Ref | Risk | Why review is needed | Keep original / add new? |
|---|---|---|---|
| Comprehensive 8.8 | **Blocking** | The source numbering jumps 8.7 → 8.9; the item itself is not visible in the original pages. | Keep original numbering, mark absent; do not invent or auto-renumber. |
| MCQ 11 | **Blocking** | Doubling the heat-source temperature alone does not give a unique *factor* for efficiency without further temperatures and model assumptions. | Preserve source; add a separately worded, fully specified practice item only after review. |
| MCQ 12 | **Blocking** | Stem asks about the field of thermodynamics, while alternatives concern system/environment exchanges rather than defining the field. | Preserve source as disputed; no automatic option marked correct. |
| Numerical 8.3 | **Blocking** | Initial gas temperature (and a suitable process constraint) is absent even though a volume increase for +1 K is requested. | Preserve verbatim source in the owner's textbook; list needed assumptions separately. |
| Numerical 8.4 | **Blocking** | Heat absorption is described with the lower reservoir temperature, conflicting with the usual hot-reservoir input assumed by the printed result. | Preserve source and flag inconsistency; do not silently replace “low” with “high” in a solved edition. |
| MCQ 3 | High | A fasting metabolic system is not defined as a unique elementary thermodynamic path. | Keep the original; seek curriculum-intent interpretation. |
| MCQ 9 | High | “Maximum work” among named processes requires common constraints before a meaningful comparison. | Keep source; an additional well-specified student question may be preferable. |
| Numerical 8.2 | High | A *general* engine between two reservoir temperatures does not necessarily operate at Carnot efficiency. | Clarify that the printed result invokes an ideal reversible assumption. |
| Numerical 8.6 | High | Change in source temperature inferred from efficiency requires a specified fixed sink and ideal-engine model. | Flag assumed room temperature and reversible efficiency. |
| MCQ 10 | Moderate | “Room temperature” is not numerically given, though the printed options are numerical temperatures. | State a selected room-temperature convention before solving. |
| MCQ 14 | Moderate | A PV figure is essential; a digitized item without a diagram would be incomplete. | Prepare independently drawn, checked equivalent if ultimately published. |
| MCQ 17 | Moderate | Hollow/solid sphere expansion comparison assumes uniformly heated identical external dimensions; item crosses page boundary. | Preserve both pages and qualify the physical conditions. |
| Short 8.3 | Moderate | Internal transformations can alter temperature even in an isolated whole; simplistic yes/no needs nuance. | Teach under explicit system conditions. |
| Short 8.8 | Moderate | Slow/isothermal and fast/adiabatic are common approximations, **not** thermodynamic definitions. | Provide careful explanation rather than an unconditional generalization. |
| Numerical 8.1 | Moderate | Numerical “room temperature” is not specified. | Verify printed result against a clearly disclosed temperature approximation. |
| Numerical 8.8 | Moderate | A supplied ice-melting energy differs from common reference latent-heat approximations. | For source fidelity use the question's **given** energy when eventually reviewing its calculation. |
| Numerical 8.9 | Moderate | Second subpart explicitly requires a PV diagram, so a pure numeric answer is incomplete. | Prepare an independently drawn labeled isobaric diagram in a later approved solutions stage. |

**No original answer option has been selected and no numerical result has been endorsed by this triage.** A flag may be resolved without modifying the original source; use a separate teacher note or new fully specified original practice question. The review flags are diagnostic, not a rewrite or an answer key.

### Required subsequent stages

1. **V236 candidate:** Independent MCQ source-faithfulness review (all 18), one at a time or in small batches. Evaluate unambiguous correct options, flawed distractors, diagram handling, official summative-theory SLO and cognitive level. For disputed source items, first identify what must change and whether the original can be retained for discussion versus replaced for assessment.
2. **After MCQ QC:** Independently review short and comprehensive response prompts with the source pages and official SLO classification; explicitly handle the missing comprehensive 8.8 without altering its source numbering.
3. **After theory QC:** Recalculate each original numerical problem with fully displayed symbols, equations, units and intermediate steps; cross-check printed parenthetical results and log every assumption or contradiction, especially problems 8.3, 8.4 and 8.6. Prepare diagrams only where required.
4. **After all human academic approvals:** Prepare separate reviewed teacher solutions and student-facing unscored practice; scored Test Builder publication needs explicit owner's approval and its own release PR. Never automatically treat source-printed results as verified keys.

### Invariants and acceptance

- Review-only inventory: **no public portal links, original exercise displays, scored tests or answer sheets** changed.
- Preserve Unit8 `status='planned'`, `assessmentStatus='not-published'`, `questionBankCount=0`, 4 existing simulations and Topics 8.1–8.10 unscored previews.
- Preserve all **2,250 pinned Units1–6 MCQ IDs/options/keys**, unchanged **59** resources, Unit7 scored hold and existing Firebase/Auth, class permissions, student data, roster, scores and branding.
- Verify machine-readable counts, source page ranges, numbering continuity/skip, every flagged reference, source SHA-256 and V224 baseline discrepancy using a dedicated fast CI. **Do not install a browser for this metadata-only PR.**
- Independent science, cognitive, publisher-source interpretation and owner scored release remain **PENDING/HOLD**.

A merged V235 PR means **inventory completed**, not that a single Unit8 question is academically approved or publicly released.
