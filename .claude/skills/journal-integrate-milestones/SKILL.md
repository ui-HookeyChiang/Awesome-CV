---
name: journal-integrate-milestones
description: Process journals, integrate weekly reports into milestones, refine work logs, or update career documentation from raw reports. Use when the user asks to process journals or update milestone docs.
---

# Integrating Journal into Milestones

Use this skill when the user asks to process journals, integrate weekly reports into milestones, refine work logs, or update career documentation from raw reports.

## Pipeline Overview

3-stage pipeline: **raw -> refined -> integrated**, with the final stage feeding into `milestone/`.

```
journal/
├── raw/           # Unprocessed logs and auto-generated reports
├── refined/       # Cleaned, formatted, ready for milestone integration
├── integrated/    # Fully distilled into milestone/ career summaries
└── README.md
```

### Stage Transitions

| From | To | Action |
|------|----|--------|
| `raw/` | `refined/` | Translate (if needed), standardize formatting, fix structure |
| `refined/` | `integrated/` | Distill into `milestone/*.md`, then move |

## Step 1: Inventory and Triage

Read all files in `journal/` (or `journal/raw/` if already structured). Classify each:

| File Pattern | Type | Pipeline Stage |
|--------------|------|---------------|
| `weekly-report_*.md` | Weekly logs | Refine then integrate |
| `work-report_*.md` | Auto-generated host reports | Keep in raw (reference data) |
| `annual_summary.md` | Raw annual data | Keep in raw (reference data) |
| `*-performance.csv` | fio benchmark data | Keep in raw, refine into `refined/performance-summary.md` |

Create the directory structure if it doesn't exist:

```bash
mkdir -p journal/raw journal/refined journal/integrated
mv journal/*.md journal/raw/  # only if files are at top level
```

## Step 2: Refine Raw Weekly Reports

For each `weekly-report_*.md` in `raw/`:

1. **Translate** any non-English content to English
2. **Standardize formatting**: consistent headings, bullet points, date headers
3. **Clean up** abbreviations, add context where unclear
4. **Preserve** all technical detail and metrics

Move refined files from `raw/` to `refined/`.

## Step 3: Integrate into Milestones

### Read Existing Milestone Structure

Read `milestone/ubiquiti.md` to understand:
- Chronological structure (sections by year and quarter)
- Last quarter covered
- Writing style and formatting conventions

### Extract Achievements by Theme

From each refined weekly report, group entries by theme (NOT by date):

- Kernel Development (eCryptfs, NFS, eBPF, etc.)
- Filesystem Support (ZFS, Btrfs, EXT4)
- Performance Engineering (CPU affinity, network tuning, benchmarking)
- Platform Migration (Debian Trixie, package porting)
- System Stability (OOM prevention, memory management)
- Tooling & Automation (test frameworks, CI/CD, scripts)
- Support Excellence (case count, diagnostics, SOPs)

### Writing Style: SAR Format

For major achievements, use **Situation-Action-Result**:

```markdown
#### Achievement Title

##### Situation
- 1-3 bullets describing the problem or context

##### Action
**Sub-category:**
- Specific technical actions taken
- Include commands, configurations, metrics

##### Result
- Quantified outcomes (percentages, throughput numbers)
- Broader impact statements
```

For smaller items, use bullet-point lists grouped under themed headings.

### Writing Guidelines

- **Group by theme**, not by date
- **Include quantified metrics** (e.g., "1.9 -> 2.3 Gb/s", "+5% random I/O")
- **Match heading levels**: `##` year, `###` quarter, `####` theme, `#####` sub-theme
- **Preserve ticket references** like `[UOF-XXXX]` and version tags `[5.0.11]`
- **Don't duplicate** content already in earlier quarters
- New quarter sections in **reverse chronological order** (newest first within a year)

### Insertion Points

- New year section (`## 2026`) goes **before** previous year section
- New quarter section (`### Q4 Achievements`) goes **after** the preceding quarter in the same year
- Update GitHub Metrics table when adding a new year row

## Step 4: Update Career Summary

After milestone integration, update `milestone/summary.md`:

- Add 3-5 new bullet points under the relevant employer section
- Format: `- **Bold Title**: One-line description with key metric`
- Place new bullets after existing ones, before the next employer section

## Step 5: Finalize

1. Move integrated weekly reports from `refined/` to `integrated/`
2. Update `journal/README.md` if new file types were processed
3. Verify:
   - `raw/` contains unprocessed work-reports
   - `refined/` is empty (all refined reports integrated)
   - `integrated/` contains processed weekly reports
   - Milestone file has new quarter sections
   - Summary file has new highlights

## Performance Tuning Reference

When processing journals that contain performance tuning work, use `journal/refined/performance-summary.md` as the canonical reference and follow these guidelines.

### Data Sources

| Source | Content |
|--------|---------|
| `journal/raw/btrfs-drive-performance.csv` | Raw fio benchmark data (BW, IOPS, latency, cache hit, CPU) |
| `journal/refined/performance-summary.md` | Refined summary with before/after tuning stats |
| `journal/raw/annual_summary_*.md` | Historical tuning results by year |
| `journal/raw/work-report_*.md` | Detailed work streams with tuning parameters |

### Performance Tuning Categories

When extracting tuning achievements from journals, classify into these categories:

| Category | Examples | Key Metrics |
|----------|----------|-------------|
| Network Stack | CPU affinity, IRQ pinning, qdisc, rx-usecs, adaptive RX coalescing | Throughput (Gb/s, MB/s), pause frames |
| TCP Tuning | tcp_quickack, tcp_nodelay, tcp_cork, tcp_zerocopy_recv, buffer scaling, congestion control | Latency (ms), throughput (MB/s), CPU % |
| Storage I/O | mq-deadline, CRC32 acceleration, chunk size, I/O merge, noatime, space_cache_v2 | IOPS, BW (MB/s), checksum (GiB/s) |
| Memory Management | vm.min_free_kbytes, SK_MEM_QUANTUM, cgroup memHigh, subvol rm throttling | OOM count, memory waste %, stability |
| Filesystem | eCryptfs NEON, Btrfs trashcan, subvol deletion, metadata ops | Throughput multiplier, latency (s) |
| Service Optimization | ustd CLI gRPC migration, Samba async I/O, zero-copy, CFS bandwidth | CPU %, memory %, load average |

### Writing Before/After Tuning in Milestones

Use this format for tuning results in SAR sections:

```markdown
**Network Stack Tuning:**
- [parameter]: [old value] → [new value] — [impact with metric]
- Example: qdisc pfifo → fq — improved fairness under mixed workloads
- Example: iperf 1.9 → 2.3 Gb/s (+21%) via CPU affinity (console-ui IRQ → CPU 1)
```

For tabular tuning summaries (use in Result sections):

```markdown
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Samba seq write | 544 MB/s | 730 MB/s | **+34%** |
```

### Tuning Integration Rules

- **Always include before/after numbers** — avoid vague "improved performance"
- **Specify the tuning parameter** — not just the category (e.g., "rx-usecs 60 µs" not "network tuning")
- **Note device-specific differences** — same tuning may have different effects per platform (e.g., rx-usecs: 60 µs on UNAS24, 15 µs on UNAS4)
- **Flag regressions** — document tunings that hurt (e.g., SSD cache on UNAS-4 RAID5x4)
- **Cross-reference ticket IDs** — e.g., `[UOF-4034][5.0.11]`
- **Update `performance-summary.md`** when new benchmark data or tuning results are processed

## Example User Requests

| Request | Action |
|---------|--------|
| "integrate journals into milestones" | Full pipeline |
| "refine weekly reports" | Stage 2 only |
| "add Q1 2026 to milestones" | Stage 3 only |
| "update career summary" | Stage 4 only |
| "process new journal entries" | Triage new files, run full pipeline |
| "update performance summary" | Regenerate `performance-summary.md` from CSV + milestones |
