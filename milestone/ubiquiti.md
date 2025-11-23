# Ubiquiti Experience

## Github Metrics

| Year | Total Contributions | Code Reviews | Commits | Pull Requests |
|------|---------------------|--------------|---------|---------------|
| 2025 | 812                 | 47%          | 30%     | 22%           |
| 2024 | 722                 | 36%          | 36%     | 28%           |
| 2023 | 619                 | 31%          | 41%     | 28%           |
| 2022 | 308                 | 20%          | 52%     | 28%           |

## 2025

### Q3 Achievements

#### Storage & Filesystem Optimization

##### ZFS Implementation
- Implemented full ZFS support with complete feature parity to existing Btrfs backend
- Preserved identical user-facing behavior and functionality for seamless migration
- Added enterprise-level storage capabilities with advanced data protection features

##### Btrfs Enhancement
- Collaborated with PM to define snapshot number limit specifications based on CPU/IO impact analysis and HDD slot scalability
- Designed effective snapshot pruning mechanism to maintain optimal performance and manageability
- Analyzed system resource consumption patterns across different storage configurations

##### NFS Performance Tuning
- Optimized UNASPro series NFS performance achieving significant throughput improvements:
  - Sequential write performance improved by 45–70%
  - Random read performance improved by 5–8% for page-cached workloads
- Fine-tuned network and filesystem layer interactions for optimal data transfer efficiency

##### Samba Optimization
- Analyzed performance characteristics of asynchronous I/O mode under various workload patterns
- Identified inefficiency under random I/O workloads requiring configuration adjustments
- Provided recommendations for workload-specific optimization strategies

##### UNAS4 Performance Enhancement
- Improved sequential write performance by 100%, fully saturating 2.5GbE network bandwidth
- Achieved breakthrough through significant reduction of I/O operations and merge counts
- Optimized filesystem and block layer interactions for maximum throughput efficiency

#### Network & Hardware Enhancement

##### PHY Driver Support
- Added comprehensive auto-negotiation and pause frame support for UNASPro platforms
- Enhanced rtl8211f driver for UNASPro with improved link negotiation capabilities
- Improved ar8033 driver for UNASPro4 with flow control optimization

#### System Performance & Validation

##### UNASPro8 Comprehensive Evaluation
- Conducted end-to-end system performance evaluation on UNASPro8 with SSD Cache configuration
- Identified critical performance bottlenecks across system layers:
  - Network throughput: Rx 1400 MB/s, Tx 2150 MB/s
  - CPU processing limitations under high-load conditions
  - Storage subsystem optimization opportunities
- Measured SSD/HDD/SSD-cache performance across Samba and NFS protocols:
  - Quantified random I/O and sequential read performance gains with caching
  - Identified sequential write performance degradation requiring chunk size tuning
  - Provided actionable insights for random I/O optimization strategies

#### Automation & Tooling

##### QA Automation Framework
- Developed comprehensive automation scripts for file service and SSD-cache performance testing
- Reduced QA verification time from one week to one day across UNAS4/UNASPro4/UNASPro8 platforms
- Enabled rapid regression testing and performance validation for releases

##### Development Tooling
- Created ZFS filesystem functionality verification framework for ENAS platform
- Automated repetitive testing procedures reducing manual effort and human error
- Accelerated development iteration cycles through streamlined validation processes

#### AI-Assisted Development

##### Code Review Enhancement
- Deployed AI code reviewers across multiple projects for automated analysis
- Automatically generated contextual code summaries and architectural flowcharts
- Significantly reduced cognitive load and improved code review efficiency
- Enhanced code quality through consistent automated analysis patterns

### Q2 Achievements

#### Platform-wide Build System Revamp
- Solved a long-standing limitation in the build system, enabling all platforms to install and upgrade to backported packages without unintentionally upgrading unrelated system components
- This upgrade path made it possible to successfully update Samba, resolving:
  - Large file upload failures (frequently reported since product launch)
  - Reconnection issues due to unstable networks
  - File locking issues across clients
- Unified default DNS configurations across all platforms, reducing configuration inconsistencies and lowering maintenance overhead across teams

#### Comprehensive NAS Stability & Stress Testing

##### Situation
- Ubiquiti NAS platform lacked comprehensive stability testing for real-world deployment scenarios

##### Action
**Stability Gap Analysis:**
- Identified lack of comprehensive stability testing for real-world deployment scenarios
- Analyzed product reliability concerns affecting customer satisfaction and generating support escalations
- Assessed insufficient validation of multi-service interactions under sustained high-load conditions
- Documented critical stability gaps in RAID operations, filesystem interactions, and cross-platform client compatibility

**QA Planning & Framework:**
- Drafted comprehensive QA plans for hardware and software stress testing covering all system layers
- Secured product reliability focus and human resource allocation through PDM collaboration
- Designed platform-wide testing strategy for robust coverage across NAS-series product releases
- Established testing methodology framework for continuous stability validation

**Cross-Team Collaboration:**
- Co-led comprehensive test planning with SQA team designing platform-wide stress testing framework
- Established cross-functional team integration with shared communication channels and responsibilities
- Implemented shared testing infrastructure with joint ownership of testing framework and result analysis
- Created collaborative workflow between development and QA teams for maximum effectiveness

**Test Automation:**
- Established automated testing infrastructure supporting multi-day continuous validation cycles
- Implemented comprehensive coverage across storage, network, and filesystem layers
- Deployed continuous monitoring and alerting for real-time issue detection during extended testing periods
- Created automated reporting systems for consistent test result analysis

**Storage Testing:**
- Implemented multi-day I/O stress loops with concurrent RAID expansion and snapshot creation/deletion operations
- Integrated xfstests for Btrfs subvolume operations, balance, and scrub under sustained stress
- Validated filesystem integrity across power cycles and service interruptions
- Performed comprehensive RAID expansion testing with concurrent high-throughput I/O operations

**Cross-Platform Testing:**
- Cross-platform validation using concurrent Linux/Mac/Windows clients running FIO workloads
- Mac Time Machine backup validation across all supported drive types and configurations
- Comprehensive testing across encrypted and non-encrypted volumes validating security performance
- Protocol compatibility validation across SMB/NFS/AFP and different OS versions

**Stability Validation:**
- Systematic identification and resolution of critical stability problems discovered during testing
- Enhanced platform stability through comprehensive edge case identification and resolution
- Implemented fixes for discovered issues including RAID crashes, eCryptFS lock-ups, and Samba file locking problems

##### Result
**Critical Issue Discovery & Resolution:**
- Discovered and resolved RAID expansion crashes during concurrent high I/O operations
- Fixed eCryptFS lock-ups during RAID operations preventing system hangs
- Resolved Samba file locking issues caused by non-durable client connections
- Enhanced platform stability through comprehensive edge case identification

**Quality Assurance Impact:**
- Improved test automation coverage enabling continuous stability validation
- Established robust testing methodology for NAS-series product releases

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
- Designed and implemented a resource control framework for the Drive application, allocating 75% CPU and memory at most, reserving the rest for mission-critical system applications and preventing swap-induced crashes under heavy I/O workloads

#### Resource Scheduling & I/O Optimization
- Collaborated with the Drive team to integrate cgroup-based resource management, improving system-wide hardware utilization and enabling future workload separation between foreground and background services
- Implemented intelligent I/O prioritization to enhance responsiveness of latency-sensitive tasks
- Supported foreground/background I/O scheduling using systemd-compatible cgroup rules
- Validated functionality using the Linux block layer test suite (blktests), laying a solid foundation for future NVMe performance validation and storage upgrades

#### Development Process Enhancement
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

##### Situation
- Single-threaded smbd process fundamentally limited by CPU core scaling
- Network throughput bottlenecked at 544/592 MB/s (write/read) despite 951/1850 MB/s local I/O capacity, 1050/1025 MB/s
  iperf3.
- Hardware platform underutilized with suboptimal IRQ distribution and TCP configuration
- Enterprise storage performance requirements demanding higher throughput and efficiency

##### Action
**Benchmark Baseline Analysis:**
- Measured network throughput via Samba achieving 544/592 MB/s (write/read)
- Established local storage capacity baseline of 951/1850 MB/s using direct I/O benchmarks
- Validated network infrastructure capacity at 1050/1025 MB/s with iperf3 testing
- Identified 43-68% performance gap indicating Samba layer optimization potential

**CPU Affinity & IRQ Optimization:**
- Dedicated exclusive CPU core to RX interrupts preventing contention with smbd process
- Avoided co-locating RX and smbd on same CPU to prevent performance degradation
- Evaluated and discarded RPS/RFS due to high CPU overhead and lacking aRFS hardware support

**System-wide Network Tuning:**
- Implemented AL Ethernet adaptive RX coalescing with runtime configurability
- Applied RX interrupt coalescing and adaptive RX for optimal packet processing
- Switched congestion control algorithm from BBR to CUBIC for better burst handling
- Changed queuing discipline from pfifo to fq improving fairness and throughput

**Hardware Optimization:**
- Applied RX interrupt coalescing and adaptive RX for optimal packet processing at hardware level
- Tuned NIC settings for maximum throughput efficiency with optimized ring buffer sizes
- Implemented hardware-specific optimizations for enterprise storage requirements

**Samba-Layer Performance Tuning:**
- Enabled zero-copy data transfer from socket buffer to page cache
- Leveraged asynchronous I/O with increased negotiated packet sizes including jumbo frame support
- Optimized Samba configuration for high-throughput workloads

**TCP Socket Behavior Optimization:**
- Enabled tcp_quickack to combine ACKs with responses reducing round-trip latency
- Enabled tcp_nodelay to reduce latency by avoiding buffering writes
- Disabled tcp_cork to favor lower latency over packet efficiency
- Enabled tcp_zerocopy_recv for faster receive paths

**Dynamic Buffer Scaling:**
- Scaled TCP buffer sizes dynamically based on observed bottlenecks and rmax thresholds
- Implemented TCP buffer sizing based on bottleneck analysis and rmax thresholds
- Applied dynamic buffer pressure management for high-throughput enterprise storage workloads

##### Result
**Performance Achievements:**
- Improved Samba throughput from 544/592 MB/s to 730/930 MB/s (write/read) via full-stack optimizations
- RAID 5 configuration: 730 MB/s write / 930 MB/s read (via fio benchmark)
- RAID 10 configuration: 830 MB/s write / 930 MB/s read achieving near-optimal performance
- Baseline hardware capacity: 951/1850 MB/s (write/read) on 7× SSD KINGSTON OCP0S31

**Broader Impact:**
- Same optimization framework applied to in-house file transfer daemon achieving 1 GB/s throughput
- Reduced CPU usage by 30% through efficient resource utilization and zero-copy techniques
- Established performance tuning methodology for enterprise storage platforms


#### Linux Kernel Upgrade (v4.19 → v5.10)

##### Situation
- Evaluated fast Btrfs checksum feature for data integrity and CPU resource-saving.
- Alpine SoC running outdated Linux 4.19 kernel limiting system capabilities
- Required Btrfs enhancements for xxhash checksum and inline file scrubbing blocked by kernel limitations
- Legacy codebase too complex for backporting upstream commits

##### Action
**Btrfs Feature Analysis:**
- Evaluated fast Btrfs checksum feature for data integrity and CPU resource-saving improvements
- Identified kernel limitations with required features blocked by Linux 4.19 limitations
- Assessed backport complexity involving thousands of commits and xarray changes across modules
- Determined kernel upgrade as optimal path forward over complex backporting

**Kernel Upgrade (4.19 → 5.10):**
- Prepared and stabilized Linux kernel upgrade from 4.19 to 5.10 with Alpine SDK compatibility
- Maintained compatibility with existing build infrastructure and development workflows
- Confirmed xxhash checksum and inline scrubbing feature availability in target kernel
- Successfully integrated upgraded kernel with Alpine SoC platform requirements

**Driver Modernization:**
- PCI Controller: Modernized resource management with devm_pci_alloc_host_bridge(), simplified probe flow, restored ecam_base/io_base handling
- Ethernet Driver: Updated deprecated APIs (ndo_select_queue, getnstimeofday), enhanced PHY handling with phy_set_asym_pause, improved code quality
- AHCI Driver: Updated API compatibility and modernized interrupt handling procedures

**Hardware Compatibility:**
- Addressed PCA9575 chip compatibility issues by implementing byte-by-byte read mode to resolve auto-increment read operation failures
- Corrected PHY auto-negotiation regressions (AR8033, RTL8211f) rooted from generic framework upgrades
- Verified full compatibility with existing network infrastructure and hardware components

**Critical Bug Resolution:**
- Fixed RAID5 50% performance regression by adjusting I/O size from 4K to 64K optimal chunks
- Resolved Realtek PHY system crashes from ALDPS/EEE behaviors using kdump analysis
- Fixed AHCI driver PCI IRQ vector setup through dynamic IRQ vector selection, replacing hardcoded vector assignments with conditional logic based on MULTI_MSI configuration

**Comprehensive Validation:**
- Multi-framework testing approach using extensive validation with stress-ng, fio, xfstests, packetdrill, and Phoronix Test Suite
- Btrfs functionality validated with complete xfstests suite ensuring filesystem reliability
- Network stack validation with packetdrill for edge case TCP behavior scenarios

**Stable Deployment:**
- Successfully deployed stable Linux 5.10 with zero regression issues in production environment
- Confirmed all target Btrfs features successfully enabled and operational
- Validated +40% SSD RAID write IOPS improvement using ARM64 hardware-accelerated CRC32

##### Result
**Enhanced System Capabilities:**
- Enabled NVMe 1.4, multi-queue block layer, multi-channel Samba
- More tracepoints, pressure-stall-information
- Enabled cgroup resource control
- Enabled advanced TCP congestion control
- Unlocked faster and more robust Btrfs functions (snapshots, space accounting, zoned devices)
- Achieved extremely low scheduler tail latency
- Successfully deployed stable Linux 5.10 with zero regression issues

**Infrastructure Modernization:**
- Modernized Alpine SoC PCIe infrastructure for long-term maintainability
- Improved kernel compatibility while reducing code duplication and complexity
- Enabled future hardware feature development and system scalability

**Enhanced RAID I/O and Btrfs Checksumming Performance:**
- Applied mq-deadline I/O scheduling and improved BTRFS filesystem performance on ARM64 by utilizing hardware-accelerated CRC32 capabilities for synchronous I/O operations
- **Results**: +40% SSD RAID write IOPS, +6% HDD RAID write IOPS, 0.19->6.10 checksum GiB/s


### Q1Q2 Achievements

#### Platform Stability Enhancement
- Resolved out-of-memory (OOM) issues, reducing 93% of socket buffer memory waste on 64KB page-sized systems (e.g., UNAS, EFG), verified through packetdrill testing

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

##### UniFi Drive Feature Development
- Achieved a 10% performance improvement through lock-less client notification mechanisms
- Added support for Btrfs CLI 5.16, including handling the newly required input format
- Proposed a high-performance, reformat-free checksum specification for future Drive development

#### Analytics and Testing Framework
- Refined UNAS/UNVR Analytics Reports for GA Deployment
- Resolved data contamination issues between network-console and storage-console reports
- Fixed issues related to incomplete storage data uploads, ensuring accurate analytics for GA evaluation and field diagnostics
- Developed QA Test Plans for Drive Configuration and Filesystem Stability
- Created QA test plans for unifi-drive-config and filesystem validation on UNAS/UNVR platforms
- Composed essential testing scripts based on xfstests to enable smoke testing, release verification, and robustness validation across firmware updates

#### Enhanced All Platform Stability
- Resolved out-of-memory (OOM) issues by reducing 93% of socket buffer memory waste on 64KB page-sized systems (e.g., UNAS, EFG), verified through packetdrill testing

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
