# Milestone Adapter Schema

Stable output contract for milestone data consumed by `sar-extraction`, `resume-content-rules`, and other downstream skills.

## Frontmatter Contract

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | ✓ | string | Display name (e.g. "Ubiquiti Experience") |
| `kind` | ✓ | literal `concept` | Federation layer marker |
| `last_verified` | ✓ | date (YYYY-MM-DD) | Last human-verified date |
| `summary` | ✓ | string | One-line career milestone summary |
| `company` | ✓ | string | Company identifier (lowercase, matches entity slug) |
| `role` | ✓ | string | Job title held during this period |
| `period` | ✓ | string | Employment period (e.g. "2022-09 — present") |
| `entities` | ✓ | list of `kms://entity:<slug>` | Federation entity references |

## Body Structure

### Section Heading = Theme

Each `## <Theme>` heading maps to a tag from `_shared/categories.md` § Milestone Tags.

```markdown
## Storage I/O          ← maps to [storage]
## Performance Engineering  ← maps to [perf]
## Kernel Development       ← maps to [kernel]
```

### Achievement Entry Shape

Each bullet under a theme heading is one achievement:

```markdown
- **One-liner summary with metric** (tags: `[storage]`, `[perf]`)
  - Situation: Context that made this hard or important
  - Action: What was done (technical specifics)
  - Result: Quantified outcome (before/after, %, latency, throughput)
```

| Field | Required | Description |
|-------|----------|-------------|
| one-liner | ✓ | Bold summary; includes key metric if available |
| tags | optional | Category tags from `_shared/categories.md` § SAR Categories |
| Situation | optional | Context/problem statement |
| Action | optional | Technical approach taken |
| Result | optional | Quantified outcome |

When S/A/R sub-bullets are absent, the one-liner stands alone as a compact achievement.

## Conforming Example

```yaml
---
title: Ubiquiti Experience
kind: concept
last_verified: 2026-07-16
summary: Career milestone — OS engineering at Ubiquiti
company: ubiquiti
role: Senior Embedded Software Engineer
period: "2022-09 — present"
entities:
  - kms://entity:ubiquiti
---
```

```markdown
## Storage I/O

- **Btrfs RAID5/6 write-hole mitigation — 2× sequential write throughput** (tags: `[storage]`)
  - Situation: Production NAS suffered silent corruption under power-loss during RAID5 parity rebuild
  - Action: Implemented journal-based partial-stripe write with dm-integrity checksums
  - Result: Zero corruption in 72h stress test; sequential write 1.1→2.2 GB/s

- **SSD cache hit-rate tuning — 40% IOPS improvement on mixed workload**
```

## References

- Valid tags: [`_shared/categories.md`](categories.md)
- Writer: `journal-integrate-milestones` produces milestone files conforming to this schema
- Readers: `sar-extraction`, `resume-content-rules`, `interview-presentation`
