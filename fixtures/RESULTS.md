# Rule fixture results (fair blind run)

Each reviewer saw only neutral `screen-NN` files: the bad pages of one category mixed with the clean
pages of another, so no reviewer could diff a bad page against its twin.

| Metric | Result |
|---|---|
| Rules tested | 365 |
| Caught at the planted line (within 3 lines), not reported on the clean twin | 333 (91%) |
| Right rule on the right page, not reported on the clean twin | 352 (96%) |
| Planted rule reported on its own clean twin | 0 |
| Other findings on clean pages | 30 |
| Unplanned findings on bad pages | 32 |

The 19 "right rule, wrong line" cases are mostly missing things (no Escape handler, no reduced-motion
branch, no loading state) that have no single line; the reviewer flagged the same defect elsewhere in
the component.

## Still missed (13)

- Can't be tested in a single-file fixture: COLOR-022 (repo has no border token), COMP-013 (cross-file duplication).
- Absence checks a static matcher should own: TYPE-002, TYPE-021, TYPE-022, UX-041.
- Reviewer used a neighbouring rule (checks sharpened): COMP-020 (flagged as COMP-023), UX-065 (flagged as UX-061).
- Judgement misses: COMP-018, UX-021, UX-048, MOTION-008, NATIVE-009.

Rescore: `python3 fixtures/score.py fixtures/fair-run-findings.json`
