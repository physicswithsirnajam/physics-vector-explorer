#!/usr/bin/env python3
"""Syntax-check V18 edited JavaScript and classic inline scripts using Node.js.
Does not execute application code or call Firebase.
"""
from pathlib import Path
import re
import subprocess
import sys
import tempfile

root=Path(__file__).resolve().parents[1]
modules=[
    "portal/app.js",
    "portal/learning-analytics.js",
    "portal/attempt-sync.js",
]
html_files=[
    "build-your-physics-test.html",
    "practice-engine/index.html"
]
failures=[]
with tempfile.TemporaryDirectory(prefix="pwsn-v18-js-") as tmp:
    for index,path in enumerate(modules):
        file=root/path
        target=Path(tmp)/f"module-{index}.mjs"
        target.write_text(file.read_text(encoding="utf-8"),encoding="utf-8")
        check=subprocess.run(["node","--check",str(target)],capture_output=True,text=True)
        if check.returncode:failures.append(f"{path}: {check.stderr}")
    for index,path in enumerate(html_files):
        text=(root/path).read_text(encoding="utf-8")
        scripts=re.findall(r'<script\b([^>]*)>(.*?)</script>',text,flags=re.S|re.I)
        inline=[body for attrs,body in scripts if "src=" not in attrs.lower() and body.strip()]
        if not inline:failures.append(f"{path}: no inline JS found")
        for n,code in enumerate(inline):
            target=Path(tmp)/f"inline-{index}-{n}.js"
            target.write_text(code,encoding="utf-8")
            check=subprocess.run(["node","--check",str(target)],capture_output=True,text=True)
            if check.returncode:failures.append(f"{path} inline {n}: {check.stderr}")
if failures:
    print("\n".join(failures),file=sys.stderr)
    raise SystemExit(1)
print("PASS — V18 portal modules and both inline Test Builder/Practice Engine scripts parse cleanly.")
