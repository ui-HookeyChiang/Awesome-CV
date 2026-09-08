# Ticket: Restore host-work-journal collector (broken symlink)

Status: done

## Description

`.claude/skills/host-work-journal/scripts/collect-weekly-report.py` is a
symlink to `/home/hookey/.claude/skills/host-work-journal/scripts/collect-weekly-report.py`
(Linux absolute path). On this Mac the target does not exist — Phase 1 collect
cannot run.

Root cause: commit `d74cdb9` extracted the script to a then-global skill-dev
path and left a symlink in Awesome-CV. skill-dev later dropped the skill
(`1fd30345`) after declaring Awesome-CV canonical, but the symlink was never
replaced with real file content.

## Acceptance

- [x] `collect-weekly-report.py` is a real file in-repo (not a symlink)
- [x] Content restored from last skill-dev copy before drop
  (`1fd30345^:host-work-journal/scripts/collect-weekly-report.py`, ~1885 lines)
- [x] `python3 …/collect-weekly-report.py --help` exits 0
- [x] Existing unit tests under `scripts/tests/` still import/load the module

## Comments

Restored collector is now a real in-repo file; syntax, help, and existing
module-loading checks pass.

## Notes

Canonical home is Awesome-CV (per skill-dev drop commit message). Do not
re-introduce a cross-repo absolute symlink.
