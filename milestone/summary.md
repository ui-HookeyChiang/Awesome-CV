# Career Summary

## OS Engineer — Linux Development, Performance & Storage Infrastructure

### Core Expertise

**System Architecture & Platform Development**: Led end-to-end system bring-up and architecture design for enterprise storage platforms, from U-Boot bootloader and Linux kernel integration to user-space applications. Pioneered NAS platform scaling from 3 to 5 engineers with 6 product variants. Designed and built ustated (ustate-exporter), the central gRPC state management daemon (16,600 LOC, 20 releases) serving as the sole state export layer between hardware daemons and the application stack across all console and NAS products.

**Storage Architecture & Filesystem Engineering**: Architected comprehensive storage systems from filesystem layout to service integration across both cloud and NAS platforms. At Ubiquiti, built unifi-drive-config (UDC), a Go daemon managing the full NAS lifecycle — dual Btrfs/ZFS backends with a common Manager abstraction, encryption, user management, Samba/NFS exports, snapshots, and version-aware migrations. Implemented Btrfs-based multi-volume architectures supporting snapshots, encryption, WORM compliance, and enterprise backup workflows with atomic metadata transactions. Delivered full ZFS backend (245 commits, 8 PRs) with UTF-8 path encoding, native encryption, atomic rollback, and complete feature parity with Btrfs. Led UniFi Drive development including system/storage pool-level migration logic, lock-less client notifications, and encryptFS optimization achieving 4x performance improvement. Implemented advanced Btrfs features including subvolume operations, balance/scrub validation, and ARM64 hardware-accelerated CRC32 delivering +40% SSD-RAID write IOPS. At QNAP, implemented FUSE-based cloud filesystem with selective mounting, client-side encryption, and transparent NFS/SMB access. Expert in modern filesystems (Btrfs, ZFS, ext4, eCryptFS), RAID systems, and storage optimization with focus on reliability, performance, and data integrity at enterprise scale supporting 190K+ users.

**Performance Engineering & Optimization**: Specialized in full-stack performance optimization delivering measurable improvements across storage, network, and system layers. Achieved Samba throughput gains from 544/592 MB/s to 830/930 MB/s through IRQ isolation, TCP tuning, and zero-copy I/O. Improved metadata operations by 300%, reduced directory deletion from 22s to 1s, and enhanced SSD-RAID write IOPS by 40% using ARM64 hardware acceleration.

**Quality Assurance & Testing**: Established comprehensive testing frameworks using industry-standard tools (xfstests, stress-ng, packetdrill, filebench). Co-led cross-team stress testing implementing multi-day I/O validation, RAID expansion tests, and filesystem stability validation. Built automated CI/CD pipelines with GitLab, Jenkins, and Docker. Fewer than 20 client support cases required R&D involvement.

#### Tech Stacks
**Programming & System Languages**: C/C++, Go, Python, Shell scripting, SQL
**Frameworks & Protocols**: gRPC, libev, FUSE, Samba/NFS protocols
**Storage & Filesystem**: Btrfs, ZFS, ext4, RAID systems, SQLite, LVM
**Linux & Kernel**: Linux kernel development, filesystem drivers, block layer, cgroups, drivers
**Testing & Validation**: xfstests, blktests, stress-ng, packetdrill, pjdfstest, filebench
**DevOps & Build Systems**: Git, Docker, Jenkins, GitLab CI/CD, Debian packaging, autotools, Meson
**Performance & Debugging**: CPU profiling, memory optimization, IRQ tuning, TCP optimization
**Development Tools**: nvim, AI-enhanced coding tools, Coverity static analysis, troubleshooting utilities

### Key Achievements

#### **Ubiquiti (2022-Present) - UniFi-OS Platform Engineer**
- **Product Success**: Contributed to 5K monthly unit sales and product portfolio expansion from 1 to 6 variants, scaling engineering team from 3 to 5 members, impacting software on 2M UniFi-OS devices.
- **Storage Architecture**: Led Btrfs-based filesystem layout design supporting user/group management, snapshots, file services (Samba/NFS), encryption, and backups, with seamless multi-volume support across enterprise deployments
- **System Bring-up**: Enabled hardware for UNAS Pro/Studio platforms, including U-Boot, Linux kernel, and complete firmware stack integration
- **Build System Innovation**: Solved platform-wide package management limitations, enabling secure backported updates and resolving critical Samba issues including large file uploads and network reconnection failures
- **Performance Profiling**: Led comprehensive UNASPro8 performance evaluation across NIC, RAID, SSD-cache, Btrfs, and protocols, providing hardware strategy guidance for future releases
- **Stress Testing Framework**: Co-led cross-team test planning with SQA, designing multi-day I/O stress loops with RAID expansion, discovering and resolving critical filesystem and protocol issues
- **Performance Optimization**: Boosted Samba throughput from 544/592 MB/s to 730/930 MB/s through IRQ isolation, TCP tuning, zero-copy I/O, and async processing
- **Resource Management**: Implemented cgroup-based resource isolation and prioritization, enabling quality-of-service for multi-service operation
- **Memory Optimization**: Resolved OOM issues by reducing 93% of socket memory consumption and optimizing whole-filesystem attribute updates
- **Support Excellence**: Developed SOPs and performance checklists, reducing support escalations to fewer than 10 cases requiring R&D involvement
- **Debian Trixie Migration**: Ported 6+ packages (ZFS, Samba, wsdd2, UDC, rclone, ustd) from Bullseye to Trixie, handling CLI breaking changes and cross-build compatibility
- **NAS Performance Engineering**: Designed CPU affinity framework (smbd/nfsd/IRQ pinning), network tuning (qdisc fq, TCP buffers, rx-usecs), improving iperf throughput from 1.9 to 2.3 Gb/s
- **SSD Cache Benchmark Framework**: Created 4-scenario test methodology (basic/empty/full/warm) with I/O migration tuning, enabling systematic cache performance validation
- **ZFS Filesystem Support**: Implemented full ZFS backend (245 commits, 8 PRs) with dataset management, snapshot system, quota enforcement via Samba dfree, and 2-step deletion workflow achieving complete feature parity with Btrfs
=======
- **Kernel Development**: Authored sunrpc sysfs CPU affinity patch for runtime NFS thread pinning, implemented eCryptfs nanosecond timestamps and fallocate support, enabled BTF/eBPF for filesystem event auditing, added CFS bandwidth control
- **NAS Performance Testing Platform**: Built end-to-end automated benchmarking infrastructure (3,787 lines of scripts, 11 AI skills) completing 11 test sessions with 47 runs across 19 managed devices
- **RAID Level Comparison**: Conducted 3-way raid10/raid5/raid6 benchmarking across 4 device tiers, delivering data-driven RAID recommendations — RAID10 leads seq read (751 MB/s), RAID5 best overall write throughput (344 MB/s), RAID6 impractical on 4-disk configs
- **Support at Scale**: Analyzed 180 support bundles across 60+ unique issues (63 GB diagnostic data) spanning storage, Samba, NFS, performance, and network categories
- **unifi-drive-config (UDC)**: Built core NAS management daemon in Go — dual Btrfs/ZFS filesystem abstraction, Samba/NFS exports, encryption, snapshots, user management, and version-aware migrations deployed on all UNAS hardware
- **ustate-exporter (ustated)**: Designed core architecture and V1 API (6 endpoints) for the central gRPC state daemon (16,600 LOC, 151 files, 20 releases) — sole state export layer across all Ubiquiti console and NAS products

#### **QNAP (Cloud File System) - Lead Performance Engineer**
- **Product Success**: Delivered cloud filesystem deployed on 190K+ QNAP NAS devices, establishing it as a core platform service
- **Cloud Storage Gateway**: Architected FUSE-based cloud filesystem with selective mounting, client-side encryption, and transparent NFS/SMB access
- **Performance Optimization**: Achieved 300% metadata performance improvement through multi-layer caching, async garbage collection, and database optimization
- **Scalability**: Enabled support for 50M+ files at 200 files/sec processing rate through filesystem redesign and resource optimization
- **Reliability**: Resolved critical deadlock scenarios in FUSE-daemon interactions and implemented robust state management for production deployment
- **Filesystem Research**: Developed Golang FUSE framework, studied SplitFS/NOVA achieving 2x performance, implemented dedup FS with writeback cache and chunk defragmentation (-50% codebase)
- **IPFS Exploration**: Researched IPFS for NAS private cloud with P2P content-based indexing, Hybridmount-style global filesystem interface integrating backup, versioning, and deduplication

### Technical Leadership

**Cross-Platform Development**: Successfully scaled solutions for ARM64 architectures with hardware-accelerated optimizations and driver compatibility

**Performance Engineering**: Demonstrated expertise in profiling, bottleneck identification, and systematic optimization across kernel, middleware, and application layers

**Quality & Testing**: Led comprehensive validation strategies including stress testing, regression testing, and compatibility validation using industry-standard tools

**Collaboration**: Served as technical liaison between engineering, product management, and support teams, creating SOPs and diagnostic tools that enabled independent issue resolution

### Impact
- Delivered production-ready storage platforms serving enterprise and prosumer markets
- Reduced system resource utilization by 50-65% through optimization and architectural improvements
- Established testing and validation frameworks ensuring long-term product reliability
- Created knowledge transfer materials and processes enabling team scalability and reduced support overhead
