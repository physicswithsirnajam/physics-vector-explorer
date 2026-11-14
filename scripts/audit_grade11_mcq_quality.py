#!/usr/bin/env python3
"""Read-only Grade XI MCQ review report. NOT a source-based academic certification."""
from __future__ import annotations
from collections import Counter, defaultdict
from pathlib import Path
import argparse
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BANKS = ROOT / "question-bank" / "grade-11"
CHOICES = ["A", "B", "C", "D"]


def nonblank(s):
    return isinstance(s, str) and bool(s.strip())


def normalize(s):
    return re.sub(r"\s+", " ", str(s or "").strip().casefold())


def qc_unit(path, all_ids):
    raw = path.read_bytes()
    data = json.loads(raw)
    questions = data.get("questions")
    unit = int(path.stem.split("-")[-1])
    if not isinstance(questions, list) or not questions:
        raise ValueError(f"{path}: missing questions")
    errors, notices = [], []
    key_counts, pages, classifications = Counter(), Counter(), Counter()
    stems = defaultdict(list)
    sets, companions = set(), 0
    verified_pages = 0
    for idx, q in enumerate(questions, 1):
        if not isinstance(q, dict):
            errors.append(f"Row {idx}: invalid question object")
            continue
        ident = q.get("id")
        label = str(ident or f"Row {idx}")
        if not nonblank(ident) or ident in all_ids:
            errors.append(f"{label}: missing or duplicate question ID")
        else:
            all_ids.add(ident)
        if q.get("grade") != 11 or q.get("unit") != unit:
            errors.append(f"{label}: grade or unit mismatch")
        if not nonblank(q.get("stem")):
            errors.append(f"{label}: empty question stem")
        if not nonblank(q.get("explanation")):
            errors.append(f"{label}: empty explanation")
        opts = q.get("options")
        if not isinstance(opts, list) or len(opts) != 4:
            errors.append(f"{label}: four options required")
            opts = []
        ids = [o.get("id") if isinstance(o, dict) else None for o in opts]
        values = [o.get("text") if isinstance(o, dict) else None for o in opts]
        if ids != CHOICES:
            errors.append(f"{label}: choices must be A/B/C/D")
        if len(values) == 4:
            if not all(nonblank(t) for t in values):
                errors.append(f"{label}: blank answer option")
            elif len(set(map(normalize, values))) != 4:
                errors.append(f"{label}: duplicate answer choices")
        key = q.get("correctOptionId")
        if key not in CHOICES:
            errors.append(f"{label}: missing or invalid correct option")
        else:
            key_counts[key] += 1
        source = q.get("source")
        if not isinstance(source, dict) or not nonblank(source.get("file")) or not nonblank(source.get("section")):
            notices.append(f"{label}: missing source file/section metadata")
        if not isinstance(q.get("sourceQuestionNumber"), int):
            notices.append(f"{label}: missing source question number")
        status = q.get("pageStatus") or "unspecified"
        pages[status] += 1
        if status == "exercise-page-verified" and isinstance(q.get("textbookPage"), int):
            verified_pages += 1
        classifications[q.get("assessmentClassification") or "unspecified"] += 1
        if q.get("stimulusSetId"):
            sets.add(q["stimulusSetId"])
        if q.get("contextSourceQuestionNumber") is not None:
            companions += 1
        if nonblank(q.get("stem")):
            stems[normalize(q["stem"])].append(q)
    independent_repeats = []
    contextual_repeats = 0
    for duplicates in stems.values():
        if len(duplicates) <= 1:
            continue
        if all(not q.get("stimulusSetId") and not nonblank(q.get("stimulusText")) for q in duplicates):
            independent_repeats.append({
                "stem": duplicates[0]["stem"],
                "ids": [q.get("id") for q in duplicates],
            })
        else:
            contextual_repeats += 1
    return {
        "unit": unit, "title": data.get("title"), "count": len(questions),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "verifiedTextbookPages": verified_pages,
        "pendingPageMapping": len(questions) - verified_pages,
        "pageStatuses": dict(pages), "classifications": dict(classifications),
        "answerKeys": {key: key_counts[key] for key in CHOICES},
        "sharedStimulusSets": len(sets), "companionReferences": companions,
        "independentStemRepeats": independent_repeats,
        "contextualStemRepeats": contextual_repeats,
        "blockers": errors, "notices": notices,
    }


def report_md(units):
    total = sum(u["count"] for u in units)
    pending = sum(u["pendingPageMapping"] for u in units)
    lines = [
        "# Grade XI MCQ Quality Control — Teacher Review",
        "",
        "**Scope:** Structural checks, source-mapping status and teacher review flags.",
        "**Not verified here:** scientific correctness, true answers, source-document fidelity,",
        "or official FBISE SLO/page classifications. Source questions were NOT edited.",
        "",
        f"{total} MCQs in {len(units)} units; {pending} page references pending verification.",
        "",
        "| Unit | MCQs | Shared stimulus sets | Pages verified | Objective errors |",
        "|---|---:|---:|---:|---:|",
    ]
    for u in units:
        lines.append(f"| {u['unit']} | {u['count']} | {u['sharedStimulusSets']} | {u['verifiedTextbookPages']} | {len(u['blockers'])} |")
    lines += [
        "",
        "## Original answer-key distribution (before practice-engine shuffling)",
        "",
        "| Unit | A | B | C | D | Review flags |",
        "|---|---:|---:|---:|---:|---|",
    ]
    for u in units:
        k = u["answerKeys"]
        lows = [x for x in CHOICES if k[x] / u["count"] < 0.10]
        highs = [x for x in CHOICES if k[x] / u["count"] > 0.50]
        flags = []
        if lows: flags.append("under 10%: " + ", ".join(lows))
        if highs: flags.append("over 50%: " + ", ".join(highs))
        lines.append(f"| {u['unit']} | {k['A']} | {k['B']} | {k['C']} | {k['D']} | {'; '.join(flags) or '—'} |")
    lines += [
        "",
        "Note: Source key imbalance does not imply a wrong answer. The engine can",
        "shuffle visible options. Never change an answer key merely to rebalance letters.",
        "",
        "## Teacher review queue",
        "",
    ]
    for u in units:
        lines += [
            f"### Unit {u['unit']}",
            "",
            f"- **Page mapping:** {u['pendingPageMapping']} MCQs require textbook/source-page verification.",
            f"- **Repeated wording in separate stimulus sets:** {u['contextualStemRepeats']} distinct stem group(s) (not automatically errors).",
        ]
        if u["independentStemRepeats"]:
            lines.append("- **Possible duplicate independent questions (review, not automatic deletion):**")
            for dup in u["independentStemRepeats"]:
                ids = ", ".join(str(i) for i in dup["ids"])
                lines.append(f"  - {ids}: {dup['stem']}")
        else:
            lines.append("- **Independent repeated stems:** none detected.")
        if u["notices"]:
            lines.append("- **Missing provenance data:** " + "; ".join(u["notices"][:10]))
        for error in u["blockers"][:30]:
            lines.append("- **Objective error:** " + error)
        lines.append("")
    lines += [
        "## Academic QC that still requires the instructor's original sources",
        "",
        "- Verify stems, four options, marked keys and explanations against the provided source documents.",
        "- Independently solve numericals and review units, vector signs and significant figures.",
        "- Compare graphs, diagrams, tables and passages with the original stimulus in context.",
        "- Verify textbook pages, formative/summative SLO status and cognitive classifications.",
        "- Keep stable question IDs so historic saved-test references remain attributable.",
        "",
        "## SHA-256 fingerprints of banks reviewed",
        "",
    ]
    for u in units:
        lines.append(f"- Unit {u['unit']}: {u['sha256']}")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--markdown", required=True, type=Path)
    parser.add_argument("--json", required=True, type=Path)
    args = parser.parse_args()
    paths = sorted(BANKS.glob("unit-??.json"))
    if not paths:
        print("ERROR: no Grade XI unit banks", file=sys.stderr)
        return 1
    try:
        ids = set()
        units = [qc_unit(p, ids) for p in paths]
        for path in (args.markdown, args.json):
            path.parent.mkdir(parents=True, exist_ok=True)
        args.markdown.write_text(report_md(units), encoding="utf-8")
        args.json.write_text(json.dumps({
            "reportType": "teacher-review-not-academic-certification", "units": units,
        }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    except (OSError, ValueError, TypeError) as exc:
        print("QC failed to run: " + str(exc), file=sys.stderr)
        return 1
    for u in units:
        print(f"Unit {u['unit']}: {u['count']} questions; {u['sharedStimulusSets']} stimulus sets; "
              f"{u['pendingPageMapping']} page mappings pending; "
              f"{len(u['independentStemRepeats'])} repeated independent stem group(s); "
              f"{len(u['blockers'])} structural error(s).")
    print(f"Teacher review report: {args.markdown}; JSON: {args.json}")
    failed = sum(len(u["blockers"]) for u in units)
    if failed:
        print(f"FAIL: {failed} structural errors; read report.", file=sys.stderr)
        return 1
    print("PASS: basic MCQ integrity. Academic/source verification still pending.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
