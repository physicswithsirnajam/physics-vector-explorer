# V193 — Direct original NBF Unit 7 textbook verification and numerical accuracy audit

**Decision: ORIGINAL SOURCE RECEIVED; PAGE-SPECIFIC VERIFICATION GAPS CLOSED; FOUR END-EXERCISE NUMERICAL ISSUES REMAIN ON TEACHER HOLD.** The previous review-only PR #296/V192 merged into `main` at `8e6c300199753ba56cd925d83aa082754867913b`.

## What arrived and what was actually examined

The owner uploaded **two separate 15-page scans of the same complete Unit 7**: `Unit 7.pdf` (SHA-256 `0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9`, upright greyscale/watermarked) and `unit 7 - Physics 11.pdf` (SHA-256 `08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892`, colour/highlighted photographs with sideways orientation in PDF). Their **corresponding printed page order and visible textbook text/figures were compared**: PDF page 1 is the unit opener, pages 2–15 are printed **113–126**. We rendered original pages upright for scientific review. Unlike the V177 single-page-photo verification, these are now actual **complete Unit 7 PDF uploads**; this memo does not claim they are byte-identical to any historical full-book PDF.

Neither owner's scan nor copied publisher diagrams/text is committed to GitHub. Their cryptographic file hashes and page numbers are safe review metadata, not textbook copyright authorization.

### Formerly outstanding evidence: now directly checked

| Original printed page | Verified source claim | Updated QC disposition |
|---|---|---|
| **113** | Crystalline and polycrystalline structures and description of grain orientations | Q22's approximate polycrystalline isotropy is source-adjacent, but **random grain alignment / property caveats** apply; **SUPPORTING ONLY** as direct P-11-B-22 structural-comparison evidence |
| **114** | Natural/synthetic polymer examples, amorphous materials, Figure 7.3 beryllium fluoride, short-range order with local clusters, Figure 7.4 structural comparisons | **Q25 concept directly source-grounded:** an amorphous solid can retain short-range atomic organization without an extended lattice. Its **V189 private stem/options/key and V192 model pre-screen stay untouched**; authenticated teacher approval still pending. Polymer origin alone does not prove crystalline/amorphous order |
| **115** | Figures 7.5(a)–(c) crystal lattice and SC/BCC/FCC cells; printed effective counts **1, 2, 4** | Existing FACE-CENTER shared-site counting issue is now **FIGURE SOURCE VERIFIED**. The six face positions contribute effectively **3** and eight shared corners contribute **1** to the FCC count **4**; this explanatory counting detail is not automatically direct summative B-22 evidence |
| **121** | Original **Example 7.2 bone-shortening:** 70 kg soccer player, 62 kg supported on bone, `r=0.020 m`, `L=0.400 m`, `Y=9e9 Pa`, `F=607.6 N` | **SOURCE / ARITHMETIC CLEARED**: `ΔL≈2.15e-5 m`, agreeing to one significant figure with printed `2e-5 m`. Crucially, **70 kg total player mass and 62 kg supported load are NOT inconsistent**; do not misreport a textbook error |
| **122–123** | Figure 7.13 reference/test wire, vernier and weights; Figure 7.14 graph, elastic potential-energy derivation | **Original diagram now verified**, but any portal reconstruction must be independently accessible and permission-cleared. The work-as-area generalization has an **axis-placement caution** |

### Critical conceptual caveat — printed Figure 7.14

On **page 122**, Fig. 7.14 labels **Weight/force (F) on the horizontal axis** and **Extension (x) on the vertical axis**, and page 123 says the area under the force–extension graph gives work done. In general, work during extension is
[
W = \int F\,dx,
]
which is area under a graph of **force on the vertical axis against extension on the horizontal**. With the textbook's reversed axes, the area under an arbitrary curve is `∫ x dF`, **not generally the work**. The textbook's triangular `(1/2) F x` value **is numerically correct for its displayed linear zero-start Hookean section**, but may mislead students if presented as a general graph rule. Mark this **COMPULSORY TEACHER EXPLANATION / DIAGRAM-AXIS AUDIT**; do not silently redraw the publisher figure as if that were its original layout.

### Original printed page 126 numerical discrepancy register

These four problem types **were already flagged under V177 as teacher-PENDING** from earlier original user photographs. The new full-unit scans now independently corroborate their actual book givens, diagrams and hint values. Use (g=9.8,\mathrm{m,s^{-2}}) and ordinary circular cross-sections; values are derived with units, not replacements of the original printed answers.

| Textbook numerical | Directly printed source and published hint | Independently recalculated | Priority / academic action |
|---|---|---|---|
| **7.1 nail in shear** | Diagram diameter `1.50 mm`, `Δx=1.80 µm`, `Y=5.00 mm`; stem supplies steel `Y_s=20e10 Pa`, answer **5.2 kg** | **5.19 kg** if using Table 7.1's **steel SHEAR modulus `G=8e10 Pa`**; **12.98 kg** if applying its printed **Young** modulus instead | **COMPULSORY** disclose modulus mismatch, validate geometry/model; never call the printed 5.2 kg correct with the written `Y_s` alone |
| **7.2 equal extension wires** | Aluminum `Y=7e10 Pa`, `d=3 mm`, copper `Y=12e10 Pa`, same length and force, printed **2.29 mm** | **2.291 mm** using `d_c=3 sqrt(7/12) mm` | **CONSISTENT**, no compulsory amendment |
| **7.3 series steel/brass** | `L_steel=1.5m`, `Y_steel=20e10 Pa`; lower brass `L=1m`, `Y_brass=1.0e10 Pa` (same exponent also appears in **Table 7.1 on p119**), diameter `0.25cm`; 4kg upper/6kg lower; hints **2.79e-4 m, 11.02 mJ** | **1.3476e-3 m, 42.55 mJ** with the explicitly printed brass modulus and correct upper-wire 10kg and lower-wire 6kg loads | **COMPULSORY** do not replace printed `10^10` with `10^11` without explaining it is a hypothetical correction. Using `10^11` yields approximately **2.695e-4 m / 10.86 mJ**, close to but not exactly the hints |
| **7.4 rod strain energy** | `A=90 mm²`, `L=3m`, `stress=300 MPa`, `Young=200 GPa`, printed **12.15 J** | **60.75 J** from `U=(A L σ²)/(2Y)` | **COMPULSORY** correction/explanation: factor-of-five discrepancy with given data |
| **7.5 axial tensile stress** | `F=500N`, rod `diameter=50cm`, printed **2.5e5 Pa** | **2.55e3 Pa** from `σ=500/[π(0.25m)²]`; **5 cm hypothetical diameter** instead yields **2.55e5 Pa** | **COMPULSORY** visible diameter-versus-key discrepancy; do not silently change 50 cm to 5 cm |

**Do not import the published printed hints as auto-graded answer keys** for problems 7.1/7.3/7.4/7.5 before independent teacher reconciliation. Other textbook mistakes are possible; this register is the **source-audited subset**, not proof all nine units or all Unit 7 paragraphs are perfect.

## Effect on previously private academic work

- V192 Q25 private revised question is **not superseded**: original page 114 directly supports local short-range order. It still needs independent one-best-answer, three-distractor, actual Summative/Understanding SLO and authenticated teacher science review before scoring.
- V184 Topic7.1 Q70 natural/synthetic polymer examples and FCC figure questions now have direct primary-page evidence. Their private candidate-science approvals remain **PENDING**; no earlier source-ID or private SHA is changed.
- Example7.2 on p121 is now **original-source checked and arithmetically defensible**, not a blocker. The remaining clearance for recreating third-party diagrams/figures remains separate from merely accessing a scan.
- The earlier V177 teacher-amendment classifications **7.1 conditional**, **7.2 consistent**, **7.3–7.5 inconsistent** are retained and strengthened, not secretly replaced.
- Wider Unit7 review counts remain **274 original source identities, 72 detailed private candidate drafts, 0 authenticated science/cognition/owner approvals and 0 scored question releases**. Individual private item digests, originals, teacher identities and keys remain outside public GitHub.
- All V160/V161 backend staging/production NO-GO, Firebase Auth/Rules and App Check controls remain unchanged.

### Precisely four public nondeploying additions

1. `quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json` — SHA-pinned two original PDFs, page mapping, verified source topics, formulas/conditional arithmetic and original scoring HOLD.
2. `quality/grade11-v193-unit07-original-two-pdf-source-verification-and-numerical-qc.md` — this teacher-readable source audit and discrepancy analysis.
3. `scripts/audit_grade11_unit07_original_pdf_source_v193.cjs` — rederive all five numerical calculations, check source resolution against V177/V192/V185, inspect all public HOLD invariants and fail closed on altered source facts/approvals.
4. `.github/workflows/validate-grade11-v193-unit07-original-pdf-source-audit.yml` — V193 arithmetic/source audit with earlier Unit7, Grade XI 2250 original, Unit6 560, teacher backend and App Check NO-GO regressions.

**V194:** require teacher independent signed-off solution assumptions for the four disputed numericals and corrected graph teaching guidance, update only authorized teacher explanations after review, and keep the original textbook pages unchanged.

**Owner merge:** PR stays Draft until both latest-head checks GREEN; inspect four changed files → Ready for review → Merge pull request → Confirm merge. No Firebase/billing/domain action or public upload of textbook scans is required.
