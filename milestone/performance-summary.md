---
title: NAS Storage Performance Summary
kind: concept
last_verified: 2026-04-30
summary: Career-evidence record of NAS storage performance work at Ubiquiti — before/after metrics, ticket IDs, devices, with employer context. Companion to personal-wiki/concepts/performance-tuning.md (technical knowledge).
aliases: [perf-summary, performance-summary]
entities:
  - kms://entity:ubiquiti
  - kms://entity:unas-pro
related_concepts:
  - kms://concept:performance-tuning
  - kms://concept:ubiquiti
related_skills:
  - host-work-journal
  - journal-integrate-milestones
sources:
  - journal/integrated/performance-summary.md
  - journal/raw/btrfs-drive-performance.csv
tags: [storage, performance, career, milestone]
---

# NAS Storage Performance Summary

Career evidence for NAS storage performance work at [[ubiquiti|Ubiquiti]] (2024–2026):
end-to-end benchmarking across UNAS-2/4/Pro/Pro-8, full-stack tuning of the
Samba/NFS/Btrfs/SSD-cache pipeline, and platform-level kernel/network/memory
configuration shipped to production firmware. Numbers below are measured
on Ubiquiti hardware in SQA-lab and office environments using the
`ubiquiti-nas-perf-test` framework. For the de-employed technical reference
(parameters, principles, categories), see
[Performance Tuning](kms://concept:performance-tuning).

## Test Configurations

Benchmarked across the full UNAS product line; protocol is Samba unless noted.

| ID | Device | RAID | NIC | SSD Cache |
|----|--------|------|-----|-----------|
| A | UNAS-2 | RAID1x2 (HDD) | 2.5GbE | No |
| B | UNAS-4 | RAID5x4 (HDD) | 2.5GbE | No |
| C | UNAS-4 | RAID5x4 (HDD) | 2.5GbE | Yes (fullsize) |
| D | UNAS-Pro | RAID5x7 (HDD) | 10GbE | No |
| E | UNAS-Pro-8 | RAID5x8 (HDD) | 10GbE | No |
| F | UNAS-Pro-8 | RAID5x8 (HDD) | 10GbE | Yes (fullsize) |

## Cross-Device Throughput (Best Observed)

| Metric | UNAS-2 | UNAS-4 | UNAS-Pro | Pro-8 |
|--------|--------|--------|----------|-------|
| Seq Read | 279 MB/s | 272 MB/s | 679 MB/s | **744 MB/s** |
| Seq Write | 163 MB/s | 229 MB/s | **649 MB/s** | 589 MB/s (cache) |
| Rand Read | 1,277 IOPS | 2,102 IOPS | 4,874 IOPS | **8,736 IOPS** (cache) |
| Rand Write | 1,839 IOPS | 1,591 IOPS | 2,161 IOPS | **3,613 IOPS** (cache) |
| CPU @ Seq Read | 41% | 69% | 89% | 79% |

- Pro-8 dominates seq read and random I/O when SSD cache is warm.
- [[unas-pro|UNAS-Pro]] leads no-cache seq write (649 MB/s) — simpler RAID5x7 has less overhead.
- UNAS-2/UNAS-4 are NIC-limited at 2.5GbE (~280 MB/s ceiling).
- RAID5x4 → x7 → x8 scaling: diminishing returns for sequential, strong gains for random I/O.

## Sequential Throughput Detail (MB/s)

| Config | Seq Read | Seq Write (new) | Seq Write (old/existing) |
|--------|----------|-----------------|---------------------------|
| UNAS-2 | 279 | 163 | 98 |
| UNAS-4 (no cache) | 272 | 229 | 125 |
| UNAS-4 (cache warm) | 264 | 137 | — |
| UNAS-Pro (no cache) | 679 | 649 | 584 |
| Pro-8 (no cache) | 744 | 566 | 562 |
| Pro-8 (cache warm) | 672 | 589 | — |
| Pro-8 (cache full) | 572 | **187** | — |

- Pro-8 cache-full seq write collapses to **187 MB/s** — eviction overhead is the dominant failure mode.
- Old/existing-file writes 30–50% slower than new files on UNAS-2/UNAS-4 (Btrfs fragmentation).

## Random I/O Detail (4K, IOPS)

| Config | Rand Read | Rand Write (new) | Rand Write (old) |
|--------|-----------|------------------|-------------------|
| UNAS-2 | 1,277 | 1,839 | 317 |
| UNAS-4 (no cache) | 2,102 | 1,267 | 392 |
| UNAS-4 (cache warm) | 1,543 | 330 | — |
| UNAS-Pro (no cache) | 4,874 | 2,161 | 371 |
| Pro-8 (no cache) | 5,318 | 3,250 | 596 |
| Pro-8 (cache warm) | **8,736** | **3,613** | — |

- Pro-8 cache warm: 100% hit on 4K random I/O — +64% rand read, +11% rand write vs no-cache.
- Old-file random writes 3–6x slower than new across all configs.
- UNAS-4 SSD cache hurts random read (2,102 → 1,543 IOPS) — 18% hit rate too low for the demotion overhead.

## Latency (P99, ms)

| Config | Seq Read | Seq Write | Rand Read | Rand Write |
|--------|----------|-----------|-----------|------------|
| UNAS-2 | 952 | 3,943 | 1,082 | 2,164 |
| UNAS-4 (no cache) | 1,044 | 2,835 | 986 | 10,402 |
| UNAS-4 (cache warm) | 1,602 | 5,872 | 1,502 | 13,892 |
| UNAS-Pro | 734 | 717 | 489 | 2,055 |
| Pro-8 (no cache) | 566 | 793 | 501 | 9,194 |
| Pro-8 (cache warm) | 566 | 885 | **283** | **1,116** |

- Pro-8 cache warm: rand read P99 **283 ms**, rand write P99 **1,116 ms** — best across all configs.
- UNAS-4 cache *worsens* P99 across most workloads (cache-miss penalty bleeds into HDD fallback).

## SSD Cache Effectiveness

| Workload | UNAS-4 (RAID5x4, 2.5GbE) | Pro-8 (RAID5x8, 10GbE) |
|----------|---------------------------|-------------------------|
| Seq Read | No benefit (NIC-limited, <29% hit) | Warm: 672 MB/s (+25% vs cold) |
| Seq Write | Negative (229 → 137 MB/s) | Warm: 589 MB/s; Full: 187 (degraded) |
| Rand Read | Negative (2,102 → 1,543 IOPS) | Warm: **8,736 IOPS** (+64%) |
| Rand Write | Marginal (warm 330 IOPS) | Warm: **3,613 IOPS** (+11%) |

- **2.5GbE devices are NIC-bottlenecked, not storage-bottlenecked** — SSD cache investment has low ROI.
- **Pro-8 cache is highly effective when warm**, transforms random I/O; avoid cache-full state.

---

## Before/After Performance Tuning

### Network Throughput — iperf (UNAS-4, 2026 Q1)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| iperf throughput | 1.9 Gb/s | 2.3 Gb/s | **+21%** |
| Pause frames | 4M | 3K → 0 | **~100% eliminated** |

Tuning: console-ui IRQ pinned to CPU 1, network softirq to CPU 0, ring buffer scaling, pause frames disabled.

### Samba Full-Stack Tuning (2024 Q4)

| Metric | Before | After | Improvement | Local-I/O Baseline |
|--------|--------|-------|-------------|---------------------|
| Samba seq write (RAID5) | 544 MB/s | 730 MB/s | **+34%** | 951 MB/s |
| Samba seq read (RAID5) | 592 MB/s | 930 MB/s | **+57%** | 1,850 MB/s |
| Samba seq write (RAID10) | — | 830 MB/s | — | 951 MB/s |
| Samba seq read (RAID10) | — | 930 MB/s | — | 1,850 MB/s |
| CPU usage | baseline | -30% | **-30%** | zero-copy techniques |
| In-house file-transfer daemon | — | 1 GB/s | — | same framework |

Tuning stack:
- CPU affinity: RX interrupts on dedicated core (no co-location with smbd)
- AL Ethernet adaptive RX coalescing + RX interrupt coalescing
- qdisc: pfifo → **fq**; congestion control: BBR → **CUBIC**
- TCP socket: tcp_quickack, tcp_nodelay, disabled tcp_cork, tcp_zerocopy_recv
- Samba zero-copy (socket buffer → page cache); jumbo frames + async I/O
- TCP buffers dynamically scaled (read 32 MB / write 4 MB)

### NFS Performance (2025, UNASPro)

| Metric | Improvement | Tuning Applied |
|--------|-------------|----------------|
| NFS seq write | **+45–70%** | network/filesystem-layer interaction tuning |
| NFS rand read (page-cached) | **+5–8%** | page-cache optimization |

### UNAS4 Performance Enhancement (2025)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| UNAS4 seq write | ~125 MB/s | saturated 2.5GbE | **+100%** |

Achieved via I/O-operation reduction + merge-count optimization at the block layer.

### Storage I/O Tuning

| Metric | Before | After | Tuning Applied |
|--------|--------|-------|----------------|
| SSD RAID write IOPS | baseline | **+40%** | mq-deadline + ARM64 CRC32 |
| HDD RAID write IOPS | baseline | **+6%** | mq-deadline + ARM64 CRC32 |
| Btrfs checksum throughput | 0.19 GiB/s | **6.10 GiB/s (32×)** | hardware-accelerated CRC32 (ARM64) |
| RAID5 merged writes | -50% regression | **recovered** | I/O size 4K → 64K (chunk alignment) |
| Btrfs read | baseline | **+3%** | noatime mount option |
| Btrfs metadata search | baseline | **faster** | space_cache_v2 |
| Annapurna PCIe (UNAS Pro 4) | baseline | **+5%** rand I/O | PCIe patch over service |
| Drive metadata ops | baseline | **+25–33%** | atomic transactions (eliminated TOCTOU) |
| eCryptfs throughput | baseline | **4×** | NEON instruction optimization |
| Btrfs trashcan impact | -5% drop | **prevented** | refined trashcan design |
| Btrfs subvol deletion | 150K files: ~30s SSD / ~30min HDD | **reduced** | user-facing latency tuning |

### Memory & System Tuning

| Metric | Before | After | Tuning Applied |
|--------|--------|-------|----------------|
| Socket-buffer memory waste (64 KB page) | baseline | **-93%** | SK_MEM_QUANTUM fix for 4K→64K page mismatch |
| ustd CLI CPU | baseline | **-65%** | CLI hot-path optimization |
| ustd CLI memory | baseline | **-50%** | CLI hot-path optimization |
| System load average | baseline | **-15–50%** | across all UniFi platforms |
| Pro-8 throughput drop | 500–750 → 20 MB/s | **stabilized** | page-cache throttling + memHigh cgroup |
| OOM (snapshot deletion) | frequent | **resolved** | subvolume-rm throttling |
| OOM (Drive attr updates) | frequent | **resolved** | filesystem-wide attr modification fix |
| Samba async-I/O OOM | swap thrashing | **resolved** | async-I/O queue memory cap |
| RX buffer (all UNAS) | default | **enlarged** | nfsd/smbd uptime under stress |

### Latency Tuning

| Metric | Before | After |
|--------|--------|-------|
| SSD-cache I/O migration threshold | 2048 | 1536 (4K blocks, lower P99) |
| rx-usecs (UNAS24) | default | 60 µs |
| rx-usecs (UNAS4) | 60 µs (regressed) | 15 µs |

---

## Devices and Scope

- **Hardware**: UNAS-2, UNAS-4, UNAS-Pro (RAID5x7), UNAS-Pro-8 (RAID5x8), UNASPro-87 (SFP hotplug), UNASPro4-SQALab, UNAS4-SQALab.
- **Platforms**: RTD1619 (UNAS4/UNAS24), AL324 (UNAS Pro), Annapurna SoC.
- **Protocols**: Samba (SMB/CIFS), NFS, local fio.
- **Test framework**: `ubiquiti-nas-perf-test` skill (fio.sh 2,284 lines + preflight/discover/gather/dedup/chart pipeline, 3,787 lines total) running across 19 managed NAS devices.
- **Campaigns**: 11 test sessions, 47 test runs, 69 MB structured results (2026 Q1 alone).

## Related

- Technical reference: [Performance Tuning](kms://concept:performance-tuning) — parameters, principles, categories (de-employed knowledge in personal-wiki)
- Raw history: `journal/integrated/performance-summary.md`
- Employer: [Ubiquiti](kms://entity:ubiquiti)
- Companion milestone: [Ubiquiti Experience](ubiquiti.md) — broader Q-by-Q achievements at Ubiquiti

## Sources

Journal evidence backing this milestone:

- `journal/integrated/performance-summary.md` — refined NAS storage performance dataset across UNAS-2/4/Pro/Pro-8 (Samba, NFS, RAID, SSD-cache benchmarks)
- `journal/raw/btrfs-drive-performance.csv` — raw fio result CSV across all test configurations (source data)

## Cross-references

Federation entity nodes:

- kms://entity:ubiquiti — `personal-wiki/entities/ubiquiti.md`
- kms://entity:unas-pro — `personal-wiki/entities/unas-pro.md`

Related concept pages (other milestones):

- kms://concept:performance-tuning — `personal-wiki/concepts/performance-tuning.md` (de-employed technical reference)
- kms://concept:ubiquiti — `Awesome-CV/milestone/ubiquiti.md`

<!-- graph-mirror-start -->
<details><summary>Graph anchors (auto-generated)</summary>

[[../personal-wiki/entities/ubiquiti]] [[../personal-wiki/entities/unas-pro]] [[../personal-wiki/concepts/performance-tuning]] [[milestone/ubiquiti]]

</details>
<!-- graph-mirror-end -->
