#!/usr/bin/env python3
"""Check Grade XI self-practice MCQ scenarios without editing question content.

This is a conservative structure/context check, not academic verification.
Uses only Python's standard library. Run locally or in GitHub Actions.
"""
from collections import defaultdict
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BANK_DIR = ROOT / "question-bank" / "grade-11"
OBVIOUS_DEPENDENCY = re.compile(
    r"^\s*(?:the [xy][- ]component of (?:the same vector|that force)\b"
    r"|its [xy][- ]component\b"
    r"|if the same vectors\b"
    r"|(?:according to|shown in|from) the (?:above|previous) "
    r"(?:diagram|graph|table|figure)\b)",
    flags=re.IGNORECASE,
)


def fail(message):
    print("GRADE XI CONTEXT CHECK FAILED: " + message, file=sys.stderr)
    raise SystemExit(1)


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def check_bank(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        fail(f"{path.name}: unable to read valid JSON: {exc}")
    questions = data.get("questions")
    if not isinstance(questions, list) or not questions:
        fail(f"{path.name}: missing or empty questions array")
    try:
        unit = int(path.stem.split("-")[-1])
    except ValueError:
        fail(f"{path.name}: unexpected unit filename")
    seen_ids = set()
    source_index = set()
    grouped = defaultdict(list)
    dependent_questions = []
    standalone_context = 0

    for q in questions:
        if not isinstance(q, dict):
            fail(f"{path.name}: question must be an object")
        qid = q.get("id")
        if not nonempty(qid) or qid in seen_ids:
            fail(f"{path.name}: missing or duplicate question ID: {qid!r}")
        seen_ids.add(qid)
        if q.get("grade") != 11 or q.get("unit") != unit:
            fail(f"{path.name}: grade/unit mismatch for {qid}")
        if not nonempty(q.get("stem")):
            fail(f"{path.name}: blank question stem for {qid}")
        section = q.get("source", {}).get("section")
        source_no = q.get("sourceQuestionNumber")
        if nonempty(section) and isinstance(source_no, int):
            source_index.add((section, source_no))
        text_ok = nonempty(q.get("stimulusText"))
        html_ok = nonempty(q.get("stimulusHtml"))
        if text_ok != html_ok:
            fail(f"{path.name}: stimulus text/HTML must both be provided for {qid}")
        if q.get("stimulusSetId"):
            if not (text_ok and html_ok):
                fail(f"{path.name}: missing shared stimulus for {qid}")
            grouped[q["stimulusSetId"]].append(q)
        elif text_ok:
            standalone_context += 1
        if q.get("contextSourceQuestionNumber") is not None:
            dependent_questions.append(q)
            if not (text_ok and html_ok):
                fail(f"{path.name}: missing companion stimulus for {qid}")
        if OBVIOUS_DEPENDENCY.search(q["stem"]) and not (text_ok and html_ok):
            fail(f"{path.name}: potentially dependent MCQ missing context: {qid}")

    for sid, group in grouped.items():
        if len(group) < 2:
            fail(f"{path.name}: incomplete shared stimulus group {sid}")
        if len({q["stimulusText"] for q in group}) != 1 or len(
            {q["stimulusHtml"] for q in group}
        ) != 1:
            fail(f"{path.name}: inconsistent stimulus content within {sid}")
        sizes = [q["groupSize"] for q in group if "groupSize" in q]
        if sizes and (len(sizes) != len(group) or any(n != len(group) for n in sizes)):
            fail(f"{path.name}: inconsistent groupSize within {sid}")
        positions = [q["groupPosition"] for q in group if "groupPosition" in q]
        if positions and (
            len(positions) != len(group)
            or sorted(positions) != list(range(1, len(group) + 1))
        ):
            fail(f"{path.name}: incomplete groupPosition numbering within {sid}")

    for q in dependent_questions:
        qid = q["id"]
        n = q["contextSourceQuestionNumber"]
        if not isinstance(n, int) or isinstance(n, bool) or n <= 0:
            fail(f"{path.name}: invalid companion source number for {qid}")
        section = q.get("source", {}).get("section")
        if not nonempty(section) or (section, n) not in source_index:
            fail(f"{path.name}: missing companion source question for {qid}")
        if q.get("stimulusSetId"):
            fail(f"{path.name}: {qid} must not mix a companion with a full stimulus set")

    print(
        f"PASS — Unit {unit}: {len(questions)} questions, "
        f"{len(grouped)} consistent shared stimulus sets, "
        f"{standalone_context} standalone scenarios, "
        f"{len(dependent_questions)} verified companion links."
    )


def main():
    paths = sorted(BANK_DIR.glob("unit-??.json"))
    if not paths:
        fail("No Grade XI unit question banks found")
    for path in paths:
        check_bank(path)
    print("PASS — Grade XI context integrity checks completed (heuristic, not academic QC).")


if __name__ == "__main__":
    main()
