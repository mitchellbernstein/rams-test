"""Score a reviewer's findings against the fixture answer keys.

Usage: python3 fixtures/score.py <findings.json> [category ...]

findings.json: list of {"file": "fixtures/ux/01-bad.tsx", "line": 23, "rule": "UX-001"}
A planted defect counts as caught when a finding names the same rule in the bad file
within +/-3 lines. A rule "passes" when it is caught on the bad page and not reported
anywhere on its clean twin. "pass_page_level" relaxes the line window: the right rule anywhere
on the bad page counts (useful for absence defects, like a missing handler, that have no single line).
"""
import json, sys, pathlib, yaml, collections

ROOT = pathlib.Path(__file__).resolve().parent
findings = json.load(open(sys.argv[1]))
cats = sys.argv[2:] or sorted(p.name for p in ROOT.iterdir() if (p / "expected.yaml").exists())

by_file = collections.defaultdict(list)
for f in findings:
    by_file[f["file"].replace("\\", "/").split("fixtures/")[-1]].append(f)

rows, totals = [], collections.Counter()
for cat in cats:
    for e in yaml.safe_load(open(ROOT / cat / "expected.yaml")):
        bad, good = f"{cat}/{e['bad']}", f"{cat}/{e['good']}"
        caught = any(f["rule"] == e["rule"] and abs(int(f.get("line", 0)) - e["line"]) <= 3 for f in by_file[bad])
        on_page = any(f["rule"] == e["rule"] for f in by_file[bad])
        fp = any(f["rule"] == e["rule"] for f in by_file[good])
        ok = caught and not fp
        totals["rules"] += 1; totals["caught"] += caught; totals["clean_fp"] += fp; totals["pass"] += ok; totals["on_page"] += on_page and not fp
        rows.append({"rule": e["rule"], "caught": caught, "right_rule_wrong_line": on_page and not caught, "false_positive_on_clean": fp, "pass": ok})

# unplanned findings on bad pages = rule ids reported that weren't planted on that page
planted = collections.defaultdict(set)
for cat in cats:
    for e in yaml.safe_load(open(ROOT / cat / "expected.yaml")):
        planted[f"{cat}/{e['bad']}"].add(e["rule"])
extra = sum(1 for k, fs in by_file.items() if k.endswith("-bad.tsx") or k.endswith("-bad.swift")
            for f in fs if f["rule"] not in planted.get(k, set()))
clean_noise = sum(len(fs) for k, fs in by_file.items() if "-good" in k)

print(json.dumps({"rules": totals["rules"], "caught": totals["caught"], "pass": totals["pass"], "pass_page_level": totals["on_page"],
                  "false_positives_on_clean_pages": clean_noise, "unplanned_findings_on_bad_pages": extra}, indent=1))
json.dump(rows, open(pathlib.Path(sys.argv[1]).with_suffix(".scored.json"), "w"), indent=1)
