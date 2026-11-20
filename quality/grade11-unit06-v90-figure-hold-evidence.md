# V90 — Unit 6 figure-hold evidence and original accessible study drawings

**This PR is study support and verification preparation, NOT a hold release.**

## Why
V89 PR #79 successfully merged 80 Superfluidity source MCQs and brought Grade XI Test Builder to **2,244 public provisional** (1,690 Units 1–5 and 554 Unit 6). Unit 6 contains 560 original study-bank MCQs across Topics6.1–6.7, **six held figure-referencing records** and 133 standalone situation-labelled MCQs. Full Unit 6 remains a planned course, not an official exam or certified item-level FBISE bank.

The held records are:
| Original ID | NBF figure and printed page | Teacher study key | Accessible source evidence from figure description | Release? |
|---|---|---|---|---|
| XI-U06-T61-MCQ-0011 | 6.2 p.90, submerged cylinder | C: F₂=P₂A | Liquid pressure times submerged bottom face area; F₂ acts up, F₁ acts down | **HELD** |
| XI-U06-T62-MCQ-0026 | 6.3 p.92, migrating geese in V | D: reduce drag/energy | Caption describes V formation lowering individual drag and energy consumption | **HELD** |
| XI-U06-T62-MCQ-0064 | 6.5(c) p.94, paratrooper speed–time | A: constant downward speed | Horizontal section before canopy opens corresponds to steady 50 m/s, zero acceleration | **HELD** |
| XI-U06-T62-MCQ-0072 | 6.3 p.92, geese V formation | D: reduce drag/energy | Same stated caption as Q26; independent item, not a shared-stimulus cluster | **HELD** |
| XI-U06-T63-MCQ-0024 | 6.6(a)(b) p.95, fluid flow | B: ordered vs swirling paths | a = streamline ordered; b = turbulent eddies | **HELD** |
| XI-U06-T63-MCQ-0080 | 6.6(a)(b) p.95, fluid flow | B: a streamline, b turbulent | a/b orientations and labels correspond to source description | **HELD** |

## Evidence and verification limitation
- **Primary study-bank archive:** original owner-only `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` was used in V76/V78/V80 for exact stems, keys and explanations. V90 preserves these original public JSON source records unchanged.
- **Cross-check source:** a web-accessible PDF text extraction labelled *UNIT 6 — FLUID MECHANICS* at `https://lms.pkpoint.com/stream-ebook.php?download=1&id=219`. It describes NBF Figures6.2, 6.3, 6.5(c), 6.6 alongside the surrounding textbook sections:
  - 6.2 p.90: `F₁=P₁A`, `F₂=P₂A`, `F=F₂−F₁`
  - 6.3 p.92: photograph of geese arranged in a V; caption links to drag/energy savings
  - 6.5(c) p.94: time 0–20 s speed increasing; ~20–42 s 50m/s plateau; canopy opens at42s; 42–47s deceleration; ~47–70s 8m/s plateau
  - 6.6 p.95: panel a smooth streamline flow, panel b irregular turbulent flow
- **Important limit:** the PDF screenshot service could NOT render the approximately 55MB web PDF (oversized-resource error), so the **actual original figure pixels were not directly visually inspected** at V90. Source descriptions and captions have been checked, not exact artwork layout. Therefore the original six items must **stay held** pending textbook-image side-by-side comparison and teacher signoff; secondary extraction alone is not enough to assert visual fidelity.

## Student learning implementation
`portal/unit-06-figure-study-v90.html` contains **four original, hand-authored accessible SVG concept schematics**: (1) immersed cylinder top/bottom liquid pressure forces, (2) simplified V-formation birds, (3) an approximate 0–70s paratrooper speed–time graph with 50m/s and8m/s steady stages, (4) an independently drawn side-by-side pipe flow comparison with a = smooth streamlines and b = turbulence.

These are **not copied textbook artwork** and never claim to be pixel-exact substitutes for the book figures. Four SVGs have accessible titles/descriptions, and explanatory text reinforces the physics and limitations. No source PDF, screenshot, copyrighted photograph, original textbook chart or user-private grade content is published.

Link from Learning Hub and original Topic6.1/6.2/6.3 MCQ previews, clearly indicating all six questions remain held. No changes to source JSON, private files, central adapter, manifest, student's existing practice counts, scoring, login, billing, Firebase, saved grades, simulations, or third-party requests.

## Teaching cautions
- Geese formation aerodynamic savings are contextual, not a guarantee for each bird or flying condition.
- A flat **speed–time** segment means constant *downward speed* and zero acceleration; it does not mean the paratrooper stopped moving.
- The source calls streamline/steady/laminar synonymous in its simplified prose. At advanced physics level, steady and laminar are different descriptors. Avoid teaching they are universally identical.
- Pressure on a plane face is treated uniform in the standard school pressure-depth model; bottom force `F₂=P₂A` and upthrust `ρgV` reflect that context.
- Teaching diagrams are the studio's original constructions; the textbook remains authoritative.

## Future teacher review and V91 candidate
1. Open the actual NBF printed textbook pp.90, 92, 94, 95 and compare figure directions, labels, plateau timing and (a)/(b) orientation to the original V90 drawing.
2. Verify the exact six original source MCQ stems, all A–D options and teacher keys against that artwork; note any ambiguous or misleading item.
3. Mark each item approved / requires edited standalone context / remains held, with reasons.
4. **Only then** design an explicitly separate V91 unlock, with updated active/hold flags, central counts, careful per-topic preview adjustments, original explanation integrity and full CI.
5. Do not invent common-stimulus sets or certified per-item FBISE cognitive/SLO tags.

## Merge gate
**Do not merge until GitHub Actions all green for the final HEAD.** V90 CI checks all six source flags and key letters are still held, accessible figure section labels, no external network use, 390px mobile and unchanged 2,244 central inventory. Test the Learning Hub gallery link and three topic preview links on a mobile browser.
