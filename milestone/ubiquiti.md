# Ubiquiti Experience

## 2025

### Q2 Achievements

#### Platform-wide Build System Revamp
- Solved a long-standing limitation in the build system, enabling all platforms to install and upgrade to backported packages without unintentionally upgrading unrelated system components
- This upgrade path made it possible to successfully update Samba, resolving:
  - Large file upload failures (frequently reported since product launch)
  - Reconnection issues due to unstable networks
  - File locking issues across clients
- Unified default DNS configurations across all platforms, reducing configuration inconsistencies and lowering maintenance overhead across teams

#### Comprehensive NAS Stability & Stress Testing
- Co-led cross-team test planning with SQA, designing and implementing platform-wide stress and long-run stability tests for UNAS services
- Improved automation coverage and depth, enabling the discovery of several critical issues:
  - RAID expansion + I/O leading to crashes
  - ecryptfs lock-ups during RAID operations
  - File locks caused by non-durable Samba clients
- Test scenario highlights:
  - Multi-day I/O stress loops with RAID expansion and snapshot creation/deletion
  - Concurrent Linux/Mac/Windows clients running FIO workloads on encrypted and non-encrypted volumes
  - Mac Time Machine backup validation on all drive types
  - xfstests for Btrfs subvolume, balance, and scrub under stress

#### Platform Performance Profiling (UNASPro8)
- Performed end-to-end storage and network performance evaluations on UNASPro8 platform, covering:
  - NIC, RAID, SSD-cache, Btrfs, Samba, NFS
- Provided deep insights to RD, PM, and QA teams:
  - LVM performance overhead and RAID throughput improvements after CPU upgrade
  - SSD cache hit rate vs actual read/write performance
  - NIC receive path being CPU-bound and implications for link aggregation
- These findings guided hardware strategy and product tuning for future releases

#### System-Level I/O Scheduling & IRQ Optimization
- On UNASPro-87, handled SFP hotplug events across various timings by correctly configuring IRQ affinity, preventing service performance degradation in production environments

#### Drive Architecture Enhancements
- Refactored the Drive migrator system, splitting logic into:
  - System-level migration
  - Storage pool–level migration
- Prevented file corruption due to duplicate migration
- Implemented subvolume rm throttling to reduce memory queue usage, preventing OOMs during mass deletion
- Fixed frequent OOMs caused by the Drive app modifying file system attributes at large scale, improving system reliability under real-world workloads

#### Filesystem & Protocol Troubleshooting
- Supporting multiple Btrfs, eCryptFS, and Samba edge cases, including:
  - Samba timestamp granularity reduced to seconds
  - Poor performance on encrypted file systems
  - Files missing from Samba clients
  - Permission/login failures
  - I/O prioritization for saturated network usage
  - Third-party compatibility issues
- Collaborated with UX/PM to evaluate snapshot space usage across subvolumes:
  - Provided technical insight on CPU/IO cost and time skew issues
  - Prevented low-ROI implementation through evidence-based recommendation

### Q1 Achievements

#### System Stability & Memory Optimization
- Conducted in-depth analysis and resolution of OOM (Out-of-Memory) issues in UNAS, particularly triggered by snapshot deletions and file system-wide attribute modifications
- Identified abnormal usage patterns and optimized system behavior to significantly enhance stability
- Reproduced and diagnosed Samba-related OOM issues under various system configurations
- Pinpointed excessive memory consumption in the asynchronous I/O queue, which caused swap thrashing and severe performance degradation
- Designed and implemented a resource control framework for the Drive application, reserving critical system resources and preventing swap-induced crashes under heavy I/O workloads

#### Resource Scheduling & I/O Optimization
- Collaborated with the Drive team to integrate cgroup-based resource management, improving system-wide hardware utilization and enabling future workload separation between foreground and background services
- Implemented intelligent I/O prioritization to enhance responsiveness of latency-sensitive tasks
- Supported foreground/background I/O scheduling using systemd-compatible cgroup rules
- Validated functionality using the Linux block layer test suite (blktests), laying a solid foundation for future NVMe performance validation and storage upgrades

#### Automated Testing & Development Process Enhancement
- Partnered with the SQA team to design and roll out automated stress and longevity tests for existing UNAS services
- Increased test coverage and ensured service stability under long-term and high-load operation
- Defined the long-term and high-load workloads of RAID and filesystem
- Deployed AI-powered code review workflows across multiple projects, enabling developers to receive immediate feedback and significantly reducing the review-development cycle while improving code quality

#### Multi-Volume Support & System Flexibility
- Successfully enabled multi-volume support in key services including NFS, Samba, and Drive, enhancing the scalability and adaptability of the system to support complex deployment scenarios in enterprise environments

#### Performance Support & SOP Standardization
- Extended last quarter's performance checklist to empower support engineers in resolving most performance-related issues independently
- This quarter saw a significant reduction in support cases, with only 3–4 incidents requiring R&D involvement
- Resolved critical Samba failures and storage bottlenecks
- Established a complete set of SOPs to streamline troubleshooting, improve response times, train support staff, and reduce overall R&D load, enabling the team to focus on high-complexity issues

## 2024

### Q3Q4 Achievements

#### WORM (Write-Once-Read-Many) Specification Development
- Proposed WORM (Write-Once-Read-Many) Specification and Release Plan
- Designed a secure, tamper-resistant WORM mechanism on Btrfs, allowing files or subvolumes to become read-only after being written once or append-only
- The feature would rely on immutable attributes, subvolume flags, and timestamp-based locking (e.g., via atime / ctime)
- Defined a phased rollout strategy to align with market demand and regulatory compliance requirements

#### Samba Performance Optimization
- **Samba limitation**: single-threaded smbd process that does not scale with multi-core CPUs

##### CPU Affinity Tuning
- Dedicated an exclusive CPU core to RX interrupts to prevent contention with smbd
- Leveraged TX queue pinning (one TX queue per CPU) for better TX-side efficiency
- Avoided co-locating RX and smbd on the same CPU to prevent performance degradation
- RPS/RFS considered but discarded due to high CPU overhead and hardware lacking aRFS support

##### Samba-layer Performance Tuning
- Enabled zero-copy data transfer from socket buffer to page cache
- Leveraged asynchronous I/O and increased negotiated packet size (e.g., jumbo frames)

##### TCP Socket Behavior Optimization
- Enabled tcp_quickack to combine ACKs with responses
- Enabled tcp_nodelay to reduce latency by avoiding buffering writes
- Disabled tcp_cork to favor lower latency
- Enabled tcp_zerocopy_recv for faster receive paths

##### System-wide Network Tuning
- Applied RX interrupt coalescing and adaptive RX
- Switched congestion control algorithm from BBR to CUBIC for better burst handling
- Changed queuing discipline from pfifo to fq to improve fairness and throughput
- Scaled TCP buffer sizes dynamically based on observed bottlenecks and rmax thresholds

##### Results
- Improved Samba throughput from 544/592 MB/s (write/read) to 730/930 MB/s via full-stack performance optimizations
- **Baseline setup**: 7× SSD (KINGSTON OCP0S31) in RAID 5 or RAID 10; local I/O performance was 951/1850 MB/s (write/read)
- **RAID 5 with 7 SSDs over Samba**: 730 MB/s write / 930 MB/s read (via fio)
- **RAID 10 with 7 SSDs over Samba**: 830 MB/s write / 930 MB/s read
- **Additional impact**: The same framework was applied to optimize an in-house file transfer daemon, achieving 1 GB/s throughput while reducing CPU usage by 30%

#### Enhanced RAID I/O Performance
- Applied mq-deadline I/O scheduling and improved BTRFS filesystem performance on ARM64 by utilizing hardware-accelerated CRC32 capabilities for synchronous I/O operations
- **Results**: +40% SSD RAID write IOPS, +6% HDD RAID write IOPS

#### Linux Kernel Upgrade (v4.19 → v5.10)

##### Situation
- Alpine SoC running outdated Linux 4.19 kernel limiting system capabilities
- Required Btrfs enhancements for xxhash checksum and inline file scrubbing blocked by kernel limitations
- Legacy codebase too complex for backporting upstream commits
- Compatibility issues preventing future hardware feature development

##### Action
**System Upgrade & Modernization:**
- Prepared and stabilized Linux kernel upgrade from 4.19 to 5.10
- Resolved major compatibility and regression issues across Alpine SDK, PCI, RAID, PHY, and AHCI drivers

**Alpine PCIe Driver Modernization:**
- Migrated to modern PCI host bridge APIs (devm_pci_alloc_host_bridge, pci_host_probe)
- Properly extracted and maintained ecam_base and io_base from devm allocations
- Standardized driver data handling to match other PCIe controllers

**Network Performance Enhancements:**
- Implemented AL Ethernet adaptive RX coalescing with runtime configurability
- Enhanced throughput with independent TX/RX coalescing based on workload
- Provided ethtool architecture for dynamic tuning

**Critical Bug Resolution:**
- Fixed RAID5 50% performance regression by adjusting I/O size from 4K to 64K
- Resolved Realtek PHY system crashes from ALDPS/EEE behaviors using kdump analysis
- Fixed AHCI driver PCI IRQ vector setup through dynamic IRQ vector selection
- Corrected PHY auto-negotiation regressions from generic framework upgrades

**Comprehensive Validation:**
- Backported and validated Linux kernel and BSP components for system reliability
- Performed extensive validation using stress-ng, fio, xfstests, packetdrill, and Phoronix Test Suite

##### Result
**Enhanced System Capabilities:**
- Enabled NVMe 1.4, multi-queue block layer, and cgroup resource control
- Unlocked faster and more robust Btrfs functions (snapshots, space accounting, zoned devices)
- Achieved extremely low scheduler latency and advanced TCP congestion control
- Successfully deployed stable Linux 5.10 with zero regression issues

**Infrastructure Modernization:**
- Modernized Alpine SoC PCIe infrastructure for long-term maintainability
- Improved kernel compatibility while reducing code duplication and complexity
- Enabled future hardware feature development and system scalability

### Q2 Achievements

#### Platform Stability Enhancement
- Resolved out-of-memory (OOM) issues by reducing 93% of socket buffer memory waste on 64KB page-sized systems (e.g., UNAS, EFG), verified through packetdrill testing

#### UniFi Drive Feature and Performance Improvements
- Achieved a 10% performance improvement through lock-less client notification mechanisms
- Added support for Btrfs CLI 5.16, including handling the newly required input format
- Proposed a high-performance, reformat-free checksum specification for future Drive development, based on analysis of Btrfs copy-on-write behavior, dm-integrity, and data scrubbing techniques

##### Metadata Operations Enhancement
- Refactored Drive metadata operations (Samba and Linux users) into atomic transactions
- Mitigated power failure risks and time-of-check/time-of-use (TOCTOU) vulnerabilities
- Improved performance by 25–33%
- Enhanced Drive filesystem resilience to power failure, reducing the risk of data loss during critical operations

##### Security and Integration Improvements
- Reviewed and refined Drive's Samba integration, resolving insecure configurations and adding detailed code comments to prevent API misuse and future regressions
- Improved the incremental backup experience by integrating rclone into drive.slice, enabling better resource isolation and service-level recovery
- Resolved an issue where the Drive daemon entered an out-of-service state, implementing a self-recovery mechanism without requiring a system reboot

##### Backup Optimization
- Saved 50% of bandwidth and storage previously wasted due to failed incremental backups, significantly enhancing backup efficiency
- Enabled rclone to support both upgradeability and multi-architecture builds within debfactory, improving maintainability and compatibility

##### Performance Acceleration
- Accelerated Drive encryption feasibility by optimizing encryptFS with NEON instructions, resulting in a 4x performance boost
- Reduced user-facing latency during Btrfs subvolume deletion, which previously scaled poorly with file count (e.g., 150K files: ~30s on SSD, ~30min on HDD)

#### Analytics and Testing Framework
- Refined UNAS/UNVR Analytics Reports for GA Deployment
- Resolved data contamination issues between network-console and storage-console reports
- Fixed issues related to incomplete storage data uploads, ensuring accurate analytics for GA evaluation and field diagnostics
- Developed QA Test Plans for Drive Configuration and Filesystem Stability
- Created QA test plans for unifi-drive-config and filesystem validation on UNAS/UNVR platforms
- Composed essential testing scripts based on xfstests to enable smoke testing, release verification, and robustness validation across firmware updates

### Q1 Achievements

#### Enhanced All Platform Stability
- Resolved out-of-memory (OOM) issues by reducing 93% of socket buffer memory waste on 64KB page-sized systems (e.g., UNAS, EFG), verified through packetdrill testing

#### UniFi Drive Feature Development
- Achieved a 10% performance improvement through lock-less client notification mechanisms
- Added support for Btrfs CLI 5.16, including handling the newly required input format
- Proposed a high-performance, reformat-free checksum specification for future Drive development

## 2023

### Q4 Key Contributions

#### Critical System Issue Resolution
- Fixed leakage of Samba socket files that previously flooded the runtime filesystem and caused firmware upgrade failures
- Designed zero-intervention backup-restore logic for user-differentiated data across swapped disks, ensuring reliability and usability

#### Long-term Data Protection Architecture
- Evaluated and aligned the Btrfs RAID scrubbing/checksum flow with UX expectations
- Proposed a cohesive remote backup solution using rclone + Samba, which improves interoperability across different NAS brands, simplifies feature expansion, reuses user databases, and enhances transfer performance—compared to traditional rsync + ssh

#### Cross-platform Network Discovery & Security
- Supported up-to-date secure network discovery protocols for SMB/CIFS clients on macOS and Windows
- Refined discovery daemons for a consistent UX and laid the foundation for Time Machine support, enabling seamless macOS backup integration with version control and data protection

#### Code Quality and Test Coverage Enhancement
- Developed QA tests covering the integration of Btrfs, Linux, Samba, UniFi Drive, and migration workflows to ensure release stability and correctness
- Guided the team in improving Go code quality with cleaner abstractions (e.g., using feat.Update() over feature.UpdateFeatures(feat))
- Refactored repetitive patterns and reduced code complexity while preserving contextual clarity—especially in rollback handling

### Q3 Key Contributions

#### NAS Snapshot Feature Development
- Delivered GA-level snapshot feature for NAS, including final implementation, refinement, and validation
- Implemented non-blocking asynchronous web handlers and conducted stress testing to ensure deadlock-free operation under high load
- Built a migration framework to support firmware-independent upgrades and downgrades, improving long-term maintainability

#### Platform and System Enhancements
- Optimized ustd CLI performance, reducing CPU usage by 65% and memory usage by 50%, resulting in a 15–50% lower system load average on all UniFi platforms
- Designed and initiated migration of ustd toward an event-triggered gRPC framework to eliminate polling overhead

#### UX and Feature Correctness Improvements
- Refined and unified network discovery flow for Samba clients on macOS and Windows
- Identified and fixed a critical issue where UniFi Drive mistakenly overwrote file metadata, aligning behavior with other Drive products to prevent data inconsistency

### Q2 Key Contributions

#### Early-stage Design Guidance
- Provided early-stage design guidance for NAS system architecture and user experience to prevent long-term misdirection
- Identified a high-risk implementation that could cut SSD lifespan by half, and proposed a new filesystem layout balancing performance, data separation, and developer ergonomics
- Created clear, accessible documentation to improve team understanding of Btrfs behavior, promoting informed development decisions

#### Performance Validation Leadership
- Participated in NAS tuning and system-level validations
- Set up and ran xfstests to verify the impact of page size changes and ensured its applicability to future file system development
- Measured the performance impact of features like the trashcan, refined its design to prevent a 5% drop
- Enabled btrfs noatime to improve read performance by 3%, and turned on space_cache_v2 to improve metadata search efficiency

#### UniFi Drive Development Support
- Designed and implemented the trashcan and snapshot architectures
- Addressed corner cases including power failures, full quota, chroot errors, and leftover Drive issues to ensure system resilience

### Q1 Key Contributions

#### UNAS Bring-up and Framework Development
- Consolidated UNAS bring-up and feature development
- Integrated months of foundational work into a unified firmware framework including debbox, debfactory, basefiles, uboot, and ubntnas

#### Core System Service Development
- Developed core system service: ugrpcd
- Redesigned the event notification architecture to simplify development and enhance system integration
- Implemented graceful shutdown handling to ensure clean resource release
- Integrated streaming settings with lcm and ucore for improved user experience

#### Configuration and Storage Features
- Developed unifi-drive-config to support system-level backup and restore
- Improved filesystem quota retrieval logic for accurate usage reporting
- Fixed log flooding issues that previously risked eMMC wear-out when accessing the system via Windows SMB

#### Specifications and Planning
- Finalized and documented snapshot and trashcan feature specs
- Communicated technical decisions across product managers and backend teams
- Broke down the roadmap into actionable tasks to align with the Early Access (EA) schedule

## 2022

### System Bring-Up and Debian Build Integration
- Brought up UNAS Pro/Studio from early boot stages, including U-Boot and firmware image preparation
- Integrated multiple system components into the Debian build system using Debfactory, including:
  - debfactory, debbox-base-files, ubntnas, unifi-hal, amaz-alpinev2-boot, anal-report, and uof-recovery
- Authored FTU and FCD (Factory Calibration & Diagnostics) documentation to support factory mass production and testing workflows
- Migrated the recovery image to eMMC, enabling persistent and reliable recovery capability
- Coordinated with hardware teams for EEPROM and factory write-protection enablement

### System Configuration & Package Management Enhancements
- Added missing package dependencies for unifi-drive, including links to unifi-drive-config and relevant samba-xxx components
- Upstreamed and bumped core build dependencies such as linux-headers and libc-dev from the debbox master
- Improved ugrpcd behavior with graceful shutdown and added Go build tags for better integration with Debfactory
- Enhanced ugrpcd functionality to listen for RAID changes via udev events instead of polling, reducing CPU load

### System Services and Device Communication Improvements
- Implemented backup and restore of Linux Samba users, supporting user persistence across firmware upgrades or recovery scenarios
- Defined protobuf schemas for communication between system components and the UniFi app
- Developed and configured udc (Unified Device Config) daemon as a secure system proxy, supporting privileged command execution and streaming asynchronous communication with reduced permission scope for the UD service
- Designed and implemented the Bluetooth pairing flow, supporting secure and user-friendly device onboarding
