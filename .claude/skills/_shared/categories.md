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

Each category maps 1:1 to a potential case study. The flow is: **category → achievement → case study**.

| Category | Keywords (match against subject, body, file paths) | Achievement | Case Study |
|---|---|---|---|
| `kernel-upgrade` | kernel, btrfs checksum, alpine sdk, driver, phy, pca9575, kconfig, kasan, menuconfig, btf, ebpf | Linux 4.19→5.10 migration + driver modernization | kernel-upgrade.html |
| `samba-perf` | samba, smb, irq, tcp tuning, network tuning, throughput, async, zero-copy, pause frame, rx-usecs, qdisc, nfsd, sunrpc, cpu affinity | Full-stack Samba/NFS optimization | samba-perf.html |
| `zfs-backend` | zfs, dataset, zpool, snapshot, quota, refquota, ustgcore, dfree | Full ZFS backend with feature parity | zfs-backend.html |
| `nas-stability` | stability, stress, xfstest, fio stress, sqa, slab, fio, benchmark, perf test, preflight, iperf | Cross-team stress testing + perf framework | nas-stability.html |
| `system-perf` | memory, oom, socket buffer, 64kb page, cgroup, memhigh, min_free_kbytes, vm., sk_mem, swap, resource limit, idle.slice | OOM resolution + cgroup resource isolation | system-perf.html |
| `grpc-streamer` | grpc, protobuf, event stream, poller, ustated, ustate, ustd, gnet, streaming | ustated/ustd event-driven gRPC + optimization | grpc-streamer.html |
| `btrfs-backend` | btrfs, subvolume, qgroup, ecryptfs, scrub, balance, trashcan, worm, snapshot prun | Btrfs storage architecture | btrfs-backend.html |
| `cloud-perf` | async gc, deadlock, download state, readdirplus, one-shot delete, readdir, dir listing, metadata, cache invalidat, vfs cache, db optim, sqlite, page fault | Hybridmount performance: +300% metadata ops | Needed |
| `cloud-cache` | cache pin, predownload, autoupdate, partial download, cache gc, watermark, smart sync, cache entry, cache state, bitmap | Cache layer: pinning, smart sync, partial DL | Needed |
| `cloud-encrypt` | client.side.encrypt, enc.dir, enc.unlock, encryption | Client-side encryption integration | Needed |
| `fuse-arch` | fuse, qrpc, libev, socket.handling, daemon, ipc, fuse3, meson, autotools, pjdfstest, filebench | FUSE daemon architecture + build system | Needed |
| `ai-skill` | claude skill, ai review, pr agent, prompt-hub, ai-assisted, claude session, ai workflow, mcp server, skill framework | AI-powered developer platform | ai-skill.html |
| `debian-trixie` | trixie, bullseye, porting, pyzfs, migration | Bullseye→Trixie package migration | Possible |
| `build-system` | debfactory, debbox, deb package, backport, firmware, build, bootstrap, reprepro, package bump | debfactory/debbox packaging infra | Low priority |

Commits matching no category go into `other`. When many commits land in `other`, review them for recurring themes and consider adding a new category.

> **Single source of truth:** This table is authoritative. `collect-weekly-report.py` reads from here at runtime via `_load_categories()`. Do not hardcode categories in the Python script.
> **Category priority:** When a commit matches multiple categories, the first match wins (table order). Place more specific categories before broader ones.

## SAR Target Repos

Used by `host-work-journal` (SAR git collection). Also defined in `collect-weekly-report.py` as `SAR_REPOS`.

```
unifi-drive-config, debbox, debfactory, prompt-hub,
debbox-kernel, debbox-base-files, ustd, ustate-exporter, unifi-protobufs,
hybridmount
```
