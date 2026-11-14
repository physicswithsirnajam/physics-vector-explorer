#!/usr/bin/env python3
"""Validate the full Grade XI Unit 2 JSON import before publication.
No third-party Python modules, credentials, network, or Firebase access needed.
"""
from pathlib import Path
from collections import Counter
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BANK_PATH = ROOT / "question-bank" / "grade-11" / "unit-02.json"
MANIFEST = ROOT / "question-bank" / "manifest.json"

def fail(reason):
    print("UNIT 2 BANK CHECK FAILED:", reason, file=sys.stderr)
    raise SystemExit(1)

def main():
    if not BANK_PATH.is_file():
        fail("Missing question-bank/grade-11/unit-02.json — upload it to THIS PR branch before merge.")
    bank_bytes = BANK_PATH.read_bytes()
    digest = hashlib.sha256(bank_bytes).hexdigest()
    try:
        data = json.loads(bank_bytes)
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except (ValueError, OSError) as e:
        fail("Invalid JSON: " + str(e))
    units = [u for g in manifest.get("grades", []) if g.get("grade") == 11 for u in g.get("units", []) if u.get("unit") == 2]
    if len(units) != 1:
        fail("Manifest must list exactly one Grade XI Unit 2 record.")
    unit = units[0]
    if digest != unit.get("sha256"):
        fail("SHA256 differs from imported and QC-checked source. Do not upload an edited or partial JSON.")
    questions = data.get("questions")
    if data.get("bankId") != "PSN-XI-UNIT-02" or data.get("status") != "practice-pilot":
        fail("Unexpected bank identity/status.")
    if not isinstance(questions, list) or len(questions) != 206 or unit.get("liveMcqCount") != 206:
        fail("Question count is not the required 206.")
    identifiers = set()
    source_counts = Counter()
    groups = {}
    slos = Counter()
    for q in questions:
        qid = q.get("id")
        if not isinstance(qid, str) or not qid or qid in identifiers:
            fail("Missing or duplicate stable question ID: " + str(qid))
        identifiers.add(qid)
        if q.get("grade") != 11 or q.get("unit") != 2 or q.get("type") != "single_choice":
            fail("Incorrect grade/unit/question type for " + qid)
        if q.get("active") is not True or q.get("boardEligible") is not False:
            fail("Question must be active provisional self-practice, not board-certified: " + qid)
        if q.get("assessmentClassification") != "summative-theory":
            fail("Unexpected assessment category for " + qid)
        opts = q.get("options")
        if not isinstance(opts, list) or len(opts) != 4 or [o.get("id") for o in opts] != list("ABCD"):
            fail("Four A/B/C/D options required for " + qid)
        if not all(isinstance(o.get("text"), str) and o["text"].strip() for o in opts):
            fail("Blank answer option for " + qid)
        if q.get("correctOptionId") not in "ABCD" or not q.get("stem") or not q.get("explanation"):
            fail("Incomplete question, key or explanation for " + qid)
        slo = q.get("sloCodes")
        if slo not in (["P-11-B-01"], ["P-11-B-02"]):
            fail("Unexpected SLO for " + qid)
        slos[slo[0]] += 1
        sect = q.get("source", {}).get("section")
        source_counts["textbook" if sect == "TEXTBOOK EXERCISE MCQs" else "additional"] += 1
        sid = q.get("stimulusSetId")
        if sid:
            if not q.get("stimulusHtml") or not q.get("stimulusText") or q.get("groupSize") != 4:
                fail("Missing stimulus passage/size for " + qid)
            groups.setdefault(sid, []).append(q.get("groupPosition"))
    # Catch obvious references to missing preceding-question context in randomized tests.
    # This is a conservative heuristic, not a substitute for academic review.
    dependent_stem = re.compile(
        r"(?:\\bthe (?:x|y)-component of (?:the same vector|that force)\\b"
        r"|^its (?:x|y)-component\\b"
        r"|\\bif the same vectors\\b"
        r"|\\b(?:according to|shown in|from) the (?:above|previous) (?:diagram|graph|table|figure)\\b)",
        re.IGNORECASE,
    )
    source_index = {
        (q.get("source", {}).get("section"), q.get("sourceQuestionNumber")): q
        for q in questions
    }
    contextual_count = 0
    for q in questions:
        qid = q["id"]
        companion = q.get("contextSourceQuestionNumber")
        if companion is not None:
            contextual_count += 1
            if not isinstance(companion, int) or isinstance(companion, bool) or companion <= 0:
                fail("Invalid companion source question number for " + qid)
            if (q.get("source", {}).get("section"), companion) not in source_index:
                fail("Companion source question not found for " + qid)
            if q.get("stimulusSetId"):
                fail("Standalone companion context must not overwrite a full stimulus set: " + qid)
            if not (isinstance(q.get("stimulusText"), str) and q["stimulusText"].strip()
                    and isinstance(q.get("stimulusHtml"), str) and q["stimulusHtml"].strip()):
                fail("Missing standalone companion stimulus for " + qid)
        if dependent_stem.search(q["stem"]) and not (
            isinstance(q.get("stimulusText"), str) and q["stimulusText"].strip()
            and isinstance(q.get("stimulusHtml"), str) and q["stimulusHtml"].strip()
        ):
            fail("Possible dependent MCQ without its scenario: " + qid)
    print("PASS — Source-dependent MCQ context present; %d companion references checked." % contextual_count)
    if source_counts != {"textbook": 6, "additional": 200}:
        fail("Unexpected source split: " + repr(source_counts))
    if len(groups) != 15 or any(sorted(g) != [1, 2, 3, 4] for g in groups.values()):
        fail("Expected 15 complete four-question stimulus groups.")
    if sum(map(len, groups.values())) != 60:
        fail("Expected 60 stimulus questions.")
    if slos != {"P-11-B-01": 73, "P-11-B-02": 133}:
        fail("Unexpected SLO counts: " + repr(slos))
    print("PASS — 206 MCQs, 6 textbook + 200 additional, 15 full stimulus sets, all keys and options present.")
    print("PASS — SHA256:", digest)
    print("PASS — SLO coverage:", dict(slos))
    print("NOTE — This validates source import integrity, NOT academic correctness or secure grading.")

if __name__ == "__main__":
    main()
