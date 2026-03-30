# Shared Categories

Reference file for skills that categorize work by topic. Read this file when a skill says "See `_shared/categories.md`".

## Milestone Tags

Used by `host-work-journal` (tag work streams) and `journal-integrate-milestones` (theme grouping).

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

## SAR Categories

Used by `host-work-journal` (categorize git commits), `sar-extraction` (find relevant commits), and `job-analysis` (match JD to fragment tags). Also defined in `collect-weekly-report.py` as `SAR_CATEGORIES`.

| Category | Keywords (match against subject, body, file paths) |
|---|---|
| `kernel-upgrade` | kernel, btrfs checksum, alpine sdk, driver, phy |
| `nas-stability` | stability, stress, xfstest, fio stress, sqa |
| `samba-perf` | samba, smb, irq, tcp tuning, throughput |
| `zfs-backend` | zfs, dataset, zpool, snapshot, quota, ustgcore |
| `btrfs-backend` | btrfs, subvolume, qgroup, ecryptfs |
| `grpc-streamer` | grpc, protobuf, event stream, poller |
| `metadata-perf` | metadata, cache, database, sqlite |
| `memory-opt` | memory, oom, socket buffer, 64kb page |
| `cloud-gateway` | fuse, cloud, gateway, rclone, cache tier |
| `build-system` | debfactory, debbox, deb package, backport |
| `debian-trixie` | trixie, bullseye, porting, pyzfs |
| `ai-skill` | skill, claude, prompt, ai, agent, mcp |

Commits matching no category go into `other`.

## SAR Target Repos

Used by `host-work-journal` (SAR git collection). Also defined in `collect-weekly-report.py` as `SAR_REPOS`.

```
unifi-drive-config, debbox, debfactory, prompt-hub,
debbox-kernel, debbox-base-files, ustd, ustate-exporter, unifi-protobufs
```
