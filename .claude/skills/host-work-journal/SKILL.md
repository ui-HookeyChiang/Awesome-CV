---
name: host-work-journal
description: Collect host activity (git, shell, Claude, test artifacts) into journal/raw/ for the Awesome-CV milestone pipeline. Also collects SAR-focused categorized git commit data for sar-extraction. Use when the user asks for a work report, activity summary, journal entry, weekly report, SAR git data, or wants to review what was done over a date range.
---

# Host Work Journal

Collect work activity from the current host and generate journal entries for the Awesome-CV milestone pipeline.

## Pipeline Context

This skill produces **raw journal entries** — the first stage of the career documentation pipeline:

```
journal/raw/          ← this skill writes here
  ↓ refine (translate, format, standardize)
journal/refined/
  ↓ integrate (distill into company milestones)
milestone/*.md        ← ubiquiti.md, qnap.md
  ↓ extract (highest-impact items)
milestone/summary.md  ← resume-ready highlights
```

`raw/` is an inbox, not an archive. After downstream pipelines consume the data, files move to `journal/integrated/`.

## Quick Start

**Phase 1: Collect data** — run the collector script:
```bash
SKILL_DIR=~/Awesome-CV/.claude/skills/host-work-journal

# Default: last 7 days
python3 $SKILL_DIR/scripts/collect-weekly-report.py -v

# Custom date range
python3 $SKILL_DIR/scripts/collect-weekly-report.py \
  --start-date 2026-02-01 --end-date 2026-02-28 -v

# With detailed Claude session analysis
python3 $SKILL_DIR/scripts/collect-weekly-report.py \
  --start-date 2026-02-01 --end-date 2026-02-28 --detailed -v
```

Output: `~/work-report-data_<host>_<start>-to-<end>.json`

The JSON contains both regular git stats (`git` key) and SAR-categorized commits (`git_sar` key).

**Phase 2: Compose journal entries** — read the JSON, compose two outputs:

1. **Work report** → `journal/raw/work-report_<HOST>_<START>-to-<END>.md`
   - Activity overview, git stats by repo, Claude usage, test sessions, key work streams
2. **SAR git data** → `journal/raw/git-sar/<START>-to-<END>/` (per-category files)
   - One file per SAR category + index.md summary

## Data Sources

The collector gathers from all sources in parallel:

| Source | What |
|--------|------|
| Git repos | Commits, PRs, line stats (all repos) + detailed SAR commits (9 target repos) |
| Shell history | Command frequency, SSH targets, SCP transfers |
| Claude Code | Sessions, prompts by project/topic, token usage |
| Test artifacts | fio sessions, device configs, result counts |
| Infrastructure | Managed devices from SSH config |

## Work Report Output

Save to `journal/raw/work-report_<HOST>_<START>-to-<END>.md`. Include:

- **Activity Overview** — aggregate metrics (repos, commits, PRs, Claude prompts, devices, tests)
- **Git Activity** — table by repo with commit count and key work summary
- **Claude Code Usage** — by topic with prompt counts
- **Test Sessions** — if applicable
- **Key Work Streams** — grouped by theme, tagged for milestone integration

Tag work streams with milestone categories for faster processing by `journal-integrate-milestones`. See `_shared/categories.md` for the full milestone tags table.

## SAR Git Output

The collector's `git_sar` JSON key contains commits from 9 target repos, categorized by 12 topic keywords. Per commit: SHA, date, subject, body (first 3 lines), files changed. See `_shared/categories.md` for the full SAR categories table and target repo list.

Write per-category files under `journal/raw/git-sar/<START>-to-<END>/`:

```
journal/raw/git-sar/2025-11-to-2026-01/
  index.md              # summary table (category, commits, repos)
  zfs-backend.md        # only ZFS commits
  kernel-upgrade.md     # only kernel commits
  ...
  other.md              # uncategorized
```

Each category file lists commits grouped by repo with subject, body, and file stats. This data feeds two downstream skills:
- **sar-extraction** — reads per-category files to build SAR case study fragments
- **journal-integrate-milestones** — reads index.md for gap detection (categories with commits but no milestone section)

## Next Steps

1. Run `journal-integrate-milestones` to process reports through the pipeline
2. Run `sar-extraction` to create case study fragments from categorized git data

## Example Requests

| Request | Action |
|---------|--------|
| "work journal for Feb" | Collect + compose both outputs → journal/raw/ |
| "work report 2025/11 to 2026/02" | Specified date range |
| "just git activity" | Skip shell/Claude sections |
| "collect SAR git data for Q4" | SAR output only |
| "journal and integrate" | Generate raw, then invoke journal-integrate-milestones |
