# V74 — HSSC-I Grade XI Direct YouTube Concept-Video Handover

**Source:** 27 video links individually supplied by the Physics with Sir Najam portal owner in this conversation on November 18, 2026. This exact message is the authority for the video IDs, the written titles, the order and their intended unit groupings. The portal repository previously stored 15 original unit-specific Google Sites video **page** links and two general links in its V73 source-reference manifest. Those links remain unchanged.

## What changed

- **27 direct video entries, 26 unique YouTube IDs** are now available for student discovery in `portal/hssc-concept-videos-v74.json`; exactly 14 chapter unit mappings, including a five-video Relativity set and four Particle Physics entries.
- **Click-to-play in the existing source library** `portal/legacy-hssc-resources.html`: YouTube players use `youtube-nocookie.com/embed/<videoId>` and appear only when a learner clicks **Watch here**. No third-party video iframe is loaded on initial page load. Only one player may be active at once; filtering/navigation removes the active player.
- Every valid entry provides a direct **Open YouTube** link with `target="_blank"` and `rel="noopener noreferrer"`, and the user can always open the original video if embedding is blocked by its publisher.
- The original **17 Google Drive Grade XI PDF** links are unchanged and stay unwatermarked; the **15+2 original Google Sites video subpages** are preserved inside the collapsible archived-links section. The Unit7 Lumen Learning article also remains present.
- Learning Hub's unit cards show correct **direct YouTube video counts**, including units 11–14, and lead to the corresponding original notes and video directory.
- Existing resources remain public external links and **do not get Firebase-enforced private access** merely by being included in portal navigation. No video, subtitle, or thumbnail is downloaded or rehosted.

## Unit-wise source record

| Grade XI unit | Direct video entries | Source-matching status |
|---|---:|---|
| Unit 1 | 3 | Teacher-supplied original video ID, title not independently verified |
| Unit 2 | 3 | Teacher-supplied original video ID, title not independently verified |
| Unit 3 | 1 | Teacher-supplied original video ID, title not independently verified |
| Unit 4 | 1 | Teacher-supplied original video ID, title not independently verified |
| Unit 5 | 2 | Teacher-supplied original video ID, title not independently verified |
| Unit 6 | 1 | Teacher-supplied original video ID, title not independently verified |
| Unit 7 | 2 | Teacher-supplied original video ID, title not independently verified |
| Unit 8 | 1 | Teacher-supplied original video ID, title not independently verified |
| Unit 9 | 1 | Teacher-supplied original video ID, title not independently verified |
| Unit 10 | 1 | Needs source correction: wrong electricity video URL duplicated from Unit 11 |
| Unit 11 | 1 | Original YouTube title verified: The Biggest Misconception About Electricity |
| Unit 12 | 1 | Teacher-supplied original video ID, title not independently verified |
| Unit 13 | 5 | Teacher-supplied original video ID, title not independently verified |
| Unit 14 | 4 | Teacher-supplied original video ID, title not independently verified |
| **TOTAL** | **27** | **26 unique YouTube video IDs** |

## Important correction: Unit10 and Unit11 duplicated ID

The owner's Unit10 label **The Most Misunderstood Concept in Physics** and Unit11 label **The Big Electricity Misconception** both use the same video ID `bHIhgxav9LY`.

The original YouTube page was independently discovered as **The Biggest Misconception About Electricity**. This supports including the video under Unit11; **it does NOT support treating it as an independently verified Electrostatics video in Unit10**.

To preserve source fidelity and avoid changing the teacher's intended teaching sequence:
- Keep Unit10's exact supplied URL and label as a **flagged entry** with a conspicuous **Needs correction** notice and **no embedded player**. An external **Review supplied link** remains available.
- Keep Unit11's original electricity video with ordinary click-to-play.
- Ask the portal owner to share the intended corrected Unit10 source URL in the normal post-merge review; replace it in a small future PR. **Do not guess from a similar video title or silently swap Unit8's source.**
- This error does not change the physics question banks or curricula.

## What is NOT asserted

- **Titles and creators of other YouTube videos are teacher-supplied, not all independently metadata-verified.** Video availability, creator channel, rights, geographic blocking, ads, and third-party embed restrictions may change and are outside this codebase's control.
- The two **general interest** Google Sites video links do not yet have their own direct YouTube IDs and remain archived in V73. They are not part of the 27 links.
- The source notes and concept video links are separate from published academic Unit6–14 banks. Only Units1–5 have released practice banks.
- No current-page login means no valid paywall: the page itself remains a publicly linkable HTML file, even when the portal has sign-in-first shell.

## QA and acceptance

- The new `scripts/test_grade11_direct_youtube_v74.cjs` confirms every video ID and watch URL is structurally valid, all 14 unit counts, the single Unit10/11 duplication and its user-facing safeguard, and preserved original 17 Drive/17 legacy-page links/31 simulations/9 enhanced labs/1690 MCQs.
- Headless Chromium runs in an isolated local server with **any YouTube iframe request intercepted/stubbed**, confirms **no YouTube request/iframe before Watch here**, confirms one active player at a time, Unit1's three videos, Unit13's five videos, Unit14's four videos, Unit10 correction warning, Unit11 play button, URL bookmarks, unit-based search and 390px mobile.
- V73 and other existing regressions remain available. This PR does not edit any video in Google Sites; original Google Drive, Grade9, Firebase enrollment/rules and authentication remain untouched.
- After all CI on the final commit is green, the owner may merge the PR, test Unit1, 5, 10, 11, 13, 14 video cards; then supply the corrected Unit10 video link when convenient.

## Later refinements

Once original teacher-approved video IDs are complete, add notes alongside each video (concept goal, textbook page/SLO, optional duration), optional saved watching progress through protected verified UID records if justified, and classroom-safe watch options. Never create user tracking or copy third-party video content without permission.
