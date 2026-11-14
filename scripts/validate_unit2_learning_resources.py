#!/usr/bin/env python3
"""Verify public Grade XI Unit 2 resource links, structure and basic source constants.

This check is NOT an independent science/source-textbook certification.
Original Word source documents stay outside the public repository.
"""
from pathlib import Path
from html.parser import HTMLParser
import json
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
PORTAL = ROOT / "portal"
EXPECTED = {
    "unit-02-numericals.html": 13,
    "unit-02-descriptive.html": 13,
    "unit-02-formula-sheet.html": 20,
}


def die(msg):
    print("UNIT 2 RESOURCES FAILED:", msg, file=sys.stderr)
    raise SystemExit(1)


class Inspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.links = set(), []
        self.logo = False
        self.problem_cards = 0
        self.formula_cards = 0

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if d.get("id"):
            if d["id"] in self.ids:
                die("Duplicate id: " + d["id"])
            self.ids.add(d["id"])
        if tag == "a" and d.get("href"):
            self.links.append(d["href"])
        if tag == "img" and d.get("src") == "./assets/physics-with-sir-najam-official-logo.png":
            self.logo = True
        classes = d.get("class", "").split()
        if tag == "article" and "problem" in classes:
            self.problem_cards += 1
        if tag == "article" and "formula-card" in classes:
            self.formula_cards += 1


def check_inline_js(src, filename):
    scripts = re.findall(r"<script\b([^>]*)>(.*?)</script>", src, flags=re.I | re.S)
    for index, (attrs, code) in enumerate(scripts):
        if "src=" in attrs.lower() or not code.strip():
            continue
        with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as stream:
            stream.write(code)
            stream.flush()
            process = subprocess.run(
                ["node", "--check", stream.name],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
        if process.returncode:
            die(f"{filename}: inline JavaScript {index} invalid: {process.stderr}")


def inspect(filename, require_desk_return=True):
    path = PORTAL / filename
    if not path.is_file():
        die("Missing resource: " + filename)
    html = path.read_text(encoding="utf-8")
    parser = Inspector()
    parser.feed(html)
    if not parser.logo:
        die(f"{filename}: canonical logo asset is not referenced")
    if require_desk_return and "unit-02.html" not in " ".join(parser.links):
        die(f"{filename}: missing Unit 2 Learning Desk return link")
    check_inline_js(html, filename)
    return html, parser


def main():
    pages = {name: inspect(name) for name in EXPECTED}
    num, num_ins = pages["unit-02-numericals.html"]
    desc, desc_ins = pages["unit-02-descriptive.html"]
    formulas, form_ins = pages["unit-02-formula-sheet.html"]

    if num_ins.problem_cards != 30:
        die("Worked numericals: expected exactly 30 problem cards")
    if len(re.findall(r"Textbook numerical 2\.[1-5]", num)) != 5:
        die("Worked numericals: five original textbook-labelled items not present")
    if len(re.findall(r"Additional SLO practice [0-9]+ ·", num)) != 25:
        die("Worked numericals: expected all 25 additional Stage 5 applications")
    for index in (7, 9, 11, 12, 13, 14, 15, 17, 19, 20, 21, 23, 24, 26, 27, 28, 29):
        if f'id="a{index}"' not in num or f'href="#a{index}"' not in num:
            die(f"New Stage 5 numerical {index} missing or unlinked")
    if "4.3 m" not in num or "23.1 N" not in num or "173.2 N" not in num:
        die("Worked numericals: critical source values absent")
    if desc_ins.problem_cards != 13:
        die("Model answers: expected exactly 13 questions")
    if len(re.findall(r"TEXTBOOK SHORT QUESTION [1-9]", desc)) != 9:
        die("Model answers: expected nine short response items")
    if len(re.findall(r"TEXTBOOK COMPREHENSIVE QUESTION [1-4]", desc)) != 4:
        die("Model answers: expected four comprehensive items")
    if "id=\"vec-geometry-caption\"" not in desc or "<svg " not in desc:
        die("Cross-product area answer must display its instructional diagram")
    if form_ins.formula_cards != 20:
        die("Formula sheet: expected twenty formula cards")

    desk, desk_ins = inspect("unit-02.html", require_desk_return=False)
    catalog_path = PORTAL / "learning-catalog.json"
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    units = [u for g in catalog.get("grades", []) if g.get("grade") == 11 for u in g.get("units", []) if u.get("unit") == 2]
    if len(units) != 1:
        die("Catalogue must contain exactly one Grade XI Unit 2 entry")
    u = units[0]
    for name, rid in (
        ("unit-02-numericals.html", "unit2-numericals"),
        ("unit-02-descriptive.html", "unit2-descriptive"),
        ("unit-02-formula-sheet.html", "unit2-formula-sheet"),
    ):
        if "./" + name not in desk_ins.links:
            die("Unit 2 Learning Desk missing link: " + name)
        if rid not in u.get("resourceIds", []):
            die("Unit 2 resourceIds missing: " + rid)
        matches = [r for r in catalog.get("resources", []) if r.get("id") == rid]
        if len(matches) != 1 or matches[0].get("href") != "./" + name or matches[0].get("public") is not True:
            die("Catalogue missing accurate public resource entry for: " + rid)
    # These links are intentionally enrolled-only and must not be dropped.
    for id_ in ("g11-u02-vector-components-01", "g11-u02-vector-products-02"):
        if id_ not in desk:
            die("Protected course-lesson link removed: " + id_)
    for name, (html, _) in pages.items():
        if "beforeprint" not in html and name != "unit-02-formula-sheet.html":
            die(name + ": answers must be expanded for print")
    print("PASS — Unit 2: 30 worked numericals (5 textbook-labelled, 25 additional), 13 model answers and 20 formula cards.")
    print("PASS — Links, full-catalogue listings, unchanged protected lesson references, source constants and inline JS syntax.")
    print("NOTE — Educational/source-based content; this is not independent scientific or FBISE certification.")


if __name__ == "__main__":
    main()
