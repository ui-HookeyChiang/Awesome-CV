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

## Date-Range Deduplication

**Always pass `--skip-covered`** — it is the default for all date-range requests. The script scans both `journal/raw/` and `journal/integrated/` for `work-report_*` files matching the current hostname, computes uncovered date gaps, and runs the collector only for those gaps. If the entire range is already covered (even if raw files were moved to `integrated/` after processing), it exits cleanly.

This means reports that were collected, integrated, and moved out of `raw/` are still recognized as covered — no duplicate collection.

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

# Skip dates already covered by existing reports
python3 $SKILL_DIR/scripts/collect-weekly-report.py \
  --start-date 2026-01-01 --end-date 2026-04-13 --skip-covered -v
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

The collector's `git_sar` JSON key contains commits from target repos (see `_shared/categories.md`), categorized by topic keywords. See `_shared/categories.md` for the full category → achievement → case study mapping.

### Directory naming: exact dates

Use **exact dates** in directory names so incremental collections don't re-sweep the same range:

```
journal/raw/git-sar/<START-DATE>-to-<END-DATE>/
```

Example: `journal/raw/git-sar/2018-01-01-to-2026-03-30/`

**When re-collecting**, check existing directories to find the last sweep end date, then collect only from that date forward. For example, if `2018-01-01-to-2026-03-30/` exists and today is 2026-04-15, collect `2026-03-31-to-2026-04-14/` (yesterday, to avoid partial-day issues).

### Directory structure

```
journal/raw/git-sar/2018-01-01-to-2026-03-30/
  index.md              # summary table + sweep metadata
  zfs-backend.md        # one file per category
  kernel-upgrade.md
  ...
  other.md              # uncategorized
```

### index.md sweep metadata

The `index.md` header records what was swept, so future collections know where to resume:

```markdown
# Git SAR Index: 2018-01-01 to 2026-03-30

**Sweep metadata:**
- Collected: 2026-03-30
- Repos swept: debbox, debfactory, unifi-drive-config, ustd, ustate-exporter, prompt-hub, unifi-protobufs, debbox-base-files, hybridmount
- Authors: ui-HookeyChiang, Hookey, HookeyChiang
- Total unique commits: 4305

| Category | Commits | Repos |
|---|---|---|
...
```

### Incremental collection

When asked to "collect SAR git data" or "update SAR data":

1. **Check existing** — scan `journal/raw/git-sar/` for directories, find the latest end date
2. **Collect from next day** — use `--start-date <last-end + 1 day>` and `--end-date <yesterday>`
3. **Write new directory** — e.g., `git-sar/2026-03-31-to-2026-04-14/`
4. **Both old and new directories coexist** — downstream skills read all directories

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
| "update SAR data" | Incremental — collect from last sweep end date to yesterday |
| "journal and integrate" | Generate raw, then invoke journal-integrate-milestones |
