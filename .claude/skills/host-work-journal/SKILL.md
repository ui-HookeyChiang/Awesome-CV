---
name: host-work-journal
description: Collect host activity (git, shell, Claude, test artifacts) into journal/raw/ for the Awesome-CV milestone pipeline. Also collects SAR-focused categorized git commit data for sar-extraction. Use when the user asks for a work report, activity summary, journal entry, weekly report, SAR git data, or wants to review what was done over a date range. Also use when the user says "what did I work on", "generate work log", "collect activity", "collect SAR git data", or needs to document recent engineering work for career tracking.
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

## SAR Git Collection

Collect detailed, categorized git commit data optimized for the `sar-extraction` skill. Run alongside or independently of the regular work report.

### Invocation

```bash
# Alongside regular work report
"work journal for March --sar"

# SAR git data only
"collect SAR git data for 2025-11 to 2026-02"
```

### Target Repos

Collect from these work repos only (search under `$HOME/projects/` and `$HOME/`):

```
unifi-drive-config, debbox, debfactory, prompt-hub,
debbox-kernel, debbox-base-files, ustd, ustate-exporter, unifi-protobufs
```

### Per-Commit Data

For each commit by the user, capture:
- **SHA** (short) + **date**
- **Subject line**
- **Body** (first 3 lines, if exists)
- **Files changed** (`git log --stat` — filename + lines added/removed)

```bash
# Command to extract per-commit data
git log --author="<user>" --since="<start>" --until="<end>" \
  --format="- \`%h\` %ad %s%n  Body: %b" --date=short --stat
```

### Categories

Categorize each commit by keyword matching against subject + body + file paths. A commit can match multiple categories. Keywords are case-insensitive.

| Category | Keywords (in subject, body, or file paths) |
|---|---|
| `kernel-upgrade` | kernel, btrfs checksum, alpine sdk, driver, phy, pca9575 |
| `nas-stability` | stability, stress, xfstest, fio stress, sqa |
| `samba-perf` | samba, smb, irq, tcp tuning, network tuning, throughput |
| `zfs-backend` | zfs, dataset, zpool, snapshot, quota, refquota, ustgcore |
| `btrfs-backend` | btrfs, subvolume, qgroup, ecryptfs |
| `grpc-streamer` | grpc, protobuf, event stream, poller |
| `metadata-perf` | metadata, cache, database, sqlite, dir listing |
| `memory-opt` | memory, oom, socket buffer, 64kb page |
| `cloud-gateway` | fuse, cloud, gateway, rclone, cache tier |
| `build-system` | debfactory, debbox, deb package, backport |
| `debian-trixie` | trixie, bullseye, porting, pyzfs |
| `ai-skill` | skill, claude, prompt, ai, agent, mcp |

Commits matching no category go into `other`.

### Output Format

Save to `journal/raw/git-sar-<start>-to-<end>.md`:

```markdown
# Git Activity for SAR Extraction: <start> to <end>

## Summary
| Category | Commits | Repos | Lines Changed |
|---|---|---|---|
| zfs-backend | 45 | udc, debfactory, protobufs | +2400/-800 |
| kernel-upgrade | 12 | debbox, debbox-kernel | +850/-200 |
| ... | | | |
| other | 8 | various | +120/-45 |

## zfs-backend (45 commits)

### unifi-drive-config (38 commits)
- `a1b2c3d` 2025-12-15 feat(zfs): implement dataset rename with rollback
  Body: Added LIFO rollback mechanism for multi-step rename operations.
  Automatic reversion on failure for create+rename sequences.
  Files: internal/drive/zfs.go (+145/-23), pkg/zfs/dataset.go (+67/-12)

- `d4e5f6a` 2025-12-18 feat(zfs): snapshot create and rollback
  Files: internal/drive/zfs.go (+89/-5), pkg/zfs/snapshot.go (+112/-0)

### debfactory (5 commits)
- `b7c8d9e` 2025-12-20 fix: zfs trixie packaging
  ...

### unifi-protobufs (2 commits)
- `e0f1a2b` 2025-12-10 feat: add ZFS property types
  ...

## kernel-upgrade (12 commits)
...

## other (8 commits)
...
```

### How sar-extraction Uses This

The `sar-extraction` skill's Step 2 (Collect) searches `journal/` for supplementary detail. With this output:

| SAR Need | Git-SAR Data Provides |
|---|---|
| Situation context | Commit subjects show what problem was being solved |
| Flow box mapping | File paths show which subsystems were touched → maps to action steps |
| Cheat sheet commands | Commit bodies + file context → realistic command examples |
| Cross-repo view | Categories group commits across repos (e.g., ZFS spans UDC + debfactory + protobufs) |
| Result metrics | Aggregate line counts + commit counts per category |

## Next Steps After Generation

1. Run `journal-integrate-milestones` skill to process through the pipeline
2. Or manually: refine → integrate into `milestone/ubiquiti.md` → update `milestone/summary.md`
3. Run `sar-extraction` skill to create new case study fragments from the categorized git data

## Example User Requests

| Request | Action |
|---------|--------|
| "work journal for Feb" | Collect + compose + save to journal/raw/ |
| "work report 2025/11 to 2026/02" | Specified date range |
| "just git activity" | Skip shell/Claude sections |
| "collect SAR git data for Q4" | SAR collection only → `journal/raw/git-sar-*.md` |
| "work journal --sar" | Regular report + SAR collection |
| "journal and integrate" | Generate raw, then invoke journal-integrate-milestones |
