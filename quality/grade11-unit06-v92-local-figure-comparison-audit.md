# V92 — private local NBF textbook figure comparison

## Why this release
V91 PR #81 is verified merged at `32ba8ea5dd3346fb5e1182ee17b5199e21836189`. The user requires exact source/illustration verification of six original held MCQs before any public unlock. V90 supplied original accessible conceptual redraws; V91 supplied a copyable teacher evidence worksheet. **Neither release was able to visually inspect the original textbook figures itself.** V92 supplies a practical, private visual side-by-side comparison instead of assuming that a third-party description or our original schematic is authoritative.

### Four printed NBF references requiring direct review
1. **Figure 6.2, printed p.90**: submerged cylinder, bottom face upward pressure force `F₂ = P₂A`, held Topic6.1 Q11, original source key C.
2. **Figure 6.3, p.92**: migrating geese flying in V formation, held Topic6.2 Q26/Q72, source keys D/D.
3. **Figure 6.5(c), p.94**: paratrooper speed–time graph with horizontal plateau before canopy opening, held Topic6.2 Q64, source key A.
4. **Figure 6.6(a)/(b), p.95**: orderly streamline vs. turbulent paths, held Topic6.3 Q24/Q80, original keys B/B.

The source questions/answers remain in existing read-only archived JSON; no new source words/options are invented or modified.

## On-device image workflow
- Extend existing `portal/unit-06-figure-verification-v91.html` and `.js` rather than introducing a second duplicate verification desk. Header and guide clearly identify V92 enhancements while the historical page URL remains stable for existing Learning Hub links.
- Four independent original-artwork selectors support **JPEG, PNG, WebP** up to **15 MiB** each, with visual rejection of unsupported or oversized files.
- Preview selected image through **`URL.createObjectURL(file)`**, and render the matching original V90 educational SVG beside it. V90 SVGs are loaded only from a same-origin static HTML file via `fetch` and imported with `document.importNode`, never fetched from third parties. These are comparative teaching drawings, **not textbook copies or a substitute for original figure inspection**.
- Each local picture offers **100%–300% zoom** with scrollable container and **Remove image** button. Replaced or removed object URLs are explicitly **revoked**; all remaining object URLs are revoked on `pagehide`.
- The local file itself is **never transmitted to any server**, saved in browser storage, embedded in the copied/printed text review report, or uploaded to GitHub. No photo filename, object URL, raw bytes or base64 is added to clipboard text. Copied report has only `Local image shown during review: YES/NO (no image file or filename included)` as context, not as proof of actual verification.
- Selecting a picture does **not** tick any of V91's three printed-source verification checkboxes. Candidate-for-teacher-signoff still requires explicit user action, three manual checks and substantive evidence notes; it remains only a provisional recommendation.
- No `localStorage`, `sessionStorage`, IndexedDB, Firebase/Firestore, beacon, external tracking, file upload, school grades or authorizations. Public V91 source questions/answer keys already existed; this change publishes no new protected source material.

## No changes to question release/certification
All six original source figure items stay `active:false`, `boardEligible:false`, `sloCodes:[]`, cognitive `Unspecified`, `stimulusSetId:null`. No source question, answer key, official FBISE per-item claim, student record, authentication or storage rule changes. Unit6 **554 active / 560 archived**, six holds, **133 independent situation MCQs**, **zero authentic grouped stimulus sets**, Grade XI overall **2,244**. The full Unit6 course still remains planned.

## CI, teacher checks and next source release
Dedicated V92 CI uses a synthetic 1×1 PNG, never copyrighted/actual NBF art, to test private file selector, invalid type rejection, 4 corresponding schematic SVGs, local `blob:` URL, 200% zoom, image removal and revocation, no cookie/session storage, no outbound or non-GET request, no photo filename/bytes in review text, manual checkbox state unchanged, 390px mobile, and old V89–V91 regression tests. Screenshots contain only synthetic imagery and our original diagrams.

**Do not merge until all relevant checks on final PR SHA are green.** After V92 merges, owner opens Learning Hub → Unit6 Figure Comparison Desk and selects photos of the actual printed NBF pp.90/92/94/95 on their device; checks figure labels, orientations, axes and underlying original answer letters; copies only the text evidence report back to the conversation. A later, distinct PR may unlock **only** individually teacher-verified questions, with accessible standalone context and exact source fidelity. Uploading/picking photos alone never unlocks any question.
