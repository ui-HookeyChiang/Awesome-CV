---
name: host-work-journal
description: Collect host activity (git, shell, Claude, test artifacts) into journal/raw/ for the Awesome-CV milestone pipeline. Use when the user asks for a work report, activity summary, journal entry, or wants to review what was done over a date range.
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
  ↓ update
src/resume/*.tex      ← canonical CV
```

After generating a raw report, use the `journal-integrate-milestones` skill to process it through the pipeline.

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

**Phase 2: Compose journal entry** — read the JSON, compose the report, save to `journal/raw/`.

## Data Sources

Collect from **all** sources in parallel:

| Source | What | Fallback Command |
|--------|------|-----------------|
| Git repos | Commits, PRs, line stats | `find $HOME -maxdepth 4 -name ".git"` then `git log` |
| Shell history | Command frequency, SSH targets, SCP transfers | `rg ': [0-9]+:[0-9]+;(.*)' ~/.zsh_history` |
| Claude Code | Sessions, prompts by project/topic | `rg '"project"' ~/.claude/history.jsonl` |
| Test artifacts | fio sessions, device configs, result counts | `find ~/ubiquiti-test-results -name "*_fio"` |
| Infrastructure | Managed devices from SSH config | `rg '^Host (UNAS\|ENAS\|UNVR)' ~/.ssh/config` |

## Report Structure

### Activity Overview

| Metric | Value |
|--------|-------|
| Git repositories | N active |
| Total commits | N |
| Merged PRs | N |
| Claude Code sessions | N prompts across M projects |
| Devices managed | N |
| Test sessions | N sessions, M runs |

### Git Activity (by repo)

| Repo | Commits | Key Work |
|------|---------|----------|
| repo-name | N | Brief summary |

### Claude Code Usage (by topic)

| Topic | Prompts | Description |
|-------|---------|-------------|
| storage/raid | N | Brief summary |

### Test Sessions (if applicable)

| Date | Session | Devices | Runs |
|------|---------|---------|------|
| date | name | devices | N |

### Key Work Streams

Tag each stream with milestone categories for faster integration:

| # | Tags | Stream | Period | Key Deliverables |
|---|------|--------|--------|-----------------|
| 1 | `[perf]` `[storage]` | NAS benchmarking | Feb 8-10 | 4-device baseline, 20 runs |

### Milestone Tags

| Tag | Category | Maps to |
|-----|----------|---------|
| `[storage]` | Storage, RAID, filesystem | milestone/ubiquiti.md — Storage I/O |
| `[perf]` | Performance tuning, benchmarks | milestone/ubiquiti.md — Performance Engineering |
| `[kernel]` | Linux kernel, drivers, dm-cache | milestone/ubiquiti.md — Kernel Development |
| `[platform]` | Debian packaging, debfactory, debbox | milestone/ubiquiti.md — Platform Migration |
| `[network]` | Network stack, Samba, NFS | milestone/ubiquiti.md — Network Stack |
| `[tools]` | Automation, scripts, Claude skills | milestone/ubiquiti.md — Tooling & Automation |
| `[testing]` | Test framework, fio.sh, preflight | milestone/ubiquiti.md — Test Infrastructure |
| `[support]` | Device management, diagnostics | milestone/ubiquiti.md — Support Excellence |

## Output

Save to `journal/raw/` with naming convention:

```
journal/raw/work-report_<HOSTNAME>_<START-DATE>-to-<END-DATE>.md
```

Header format:
```markdown
# Work Report: <HOSTNAME> (<START-DATE> to <END-DATE>)

**Host:** <HOSTNAME>
**Date Range:** <START-DATE> to <END-DATE>
**Generated:** <TODAY>
```

## Next Steps After Generation

1. Run `journal-integrate-milestones` skill to process through the pipeline
2. Or manually: refine → integrate into `milestone/ubiquiti.md` → update `milestone/summary.md`

## Example User Requests

| Request | Action |
|---------|--------|
| "work journal for Feb" | Collect + compose + save to journal/raw/ |
| "work report 2025/11 to 2026/02" | Specified date range |
| "just git activity" | Skip shell/Claude sections |
| "journal and integrate" | Generate raw, then invoke journal-integrate-milestones |
