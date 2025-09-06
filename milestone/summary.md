# Career Summary

## Senior System Engineer & Storage Architect

### Core Expertise

**System Architecture & Platform Development**: Led end-to-end system bring-up and architecture design for enterprise storage platforms, from U-Boot bootloader and Linux kernel integration to user-space applications. Pioneered NAS platform scaling from 3 to 5 engineers with 6 product variants. Architected gRPC-based service frameworks replacing polling systems with microsecond-latency state management.

**Storage Architecture & Filesystem Engineering**: Architected comprehensive storage systems from filesystem layout to service integration. Designed Btrfs-based multi-volume architectures supporting snapshots, encryption, WORM compliance, and backup workflows. Implemented FUSE-based cloud filesystem with selective mounting, client-side encryption, and transparent NFS/SMB access. Expert in modern filesystems (Btrfs, ext4), RAID systems, and storage optimization with focus on reliability, performance, and data integrity at enterprise scale.

**Performance Engineering & Optimization**: Specialized in full-stack performance optimization delivering measurable improvements across storage, network, and system layers. Achieved Samba throughput gains from 544/592 MB/s to 830/930 MB/s through IRQ isolation, TCP tuning, and zero-copy I/O. Improved metadata operations by 300%, reduced directory deletion from 22s to 1s, and enhanced SSD-RAID write IOPS by 40% using ARM64 hardware acceleration.

**Quality Assurance & Testing**: Established comprehensive testing frameworks using industry-standard tools (xfstests, stress-ng, packetdrill, filebench). Co-led cross-team stress testing implementing multi-day I/O validation, RAID expansion tests, and filesystem stability validation. Built automated CI/CD pipelines with GitLab, Jenkins, and Docker reducing support escalations by 80%.

#### Tech Stacks
**Programming & System Languages**: C/C++, Go, Python, Shell scripting, SQL
**Frameworks & Protocols**: gRPC, libev, FUSE, Samba/NFS protocols, qrpc
**Storage & Filesystem**: Btrfs, ext4, RAID systems, SQLite, LVM
**Linux & Kernel**: Linux kernel development, filesystem drivers, block layer, cgroups, PCIe drivers
**Testing & Validation**: xfstests, blktests, stress-ng, packetdrill, pjdfstest, filebench
**DevOps & Build Systems**: Git, Docker, Jenkins, GitLab CI/CD, Debian packaging, autotools, Meson
**Performance & Debugging**: CPU profiling, memory optimization, IRQ tuning, TCP optimization
**Development Tools**: nvim, AI-enhanced coding tools, Coverity static analysis, troubleshooting utilities

### Key Achievements

#### **Ubiquiti (2022-Present) - UNAS Platform Engineer**
- **Product Success**: Contributed to 5K monthly unit sales and product portfolio expansion from 1 to 6 variants, scaling engineering team from 3 to 5 members
- **Build System Innovation**: Solved platform-wide package management limitations, enabling secure backported updates and resolving critical Samba issues including large file uploads and network reconnection failures
- **Performance Profiling**: Led comprehensive UNASPro8 performance evaluation across NIC, RAID, SSD-cache, Btrfs, and protocols, providing hardware strategy guidance for future releases
- **Stress Testing Framework**: Co-led cross-team test planning with SQA, designing multi-day I/O stress loops with RAID expansion, discovering and resolving critical filesystem and protocol issues
- **System Bring-up**: Enabled hardware for UNAS Pro/Studio, including U-Boot, Linux kernel, and complete firmware stack integration
- **Performance Optimization**: Boosted Samba throughput from 544/592 MB/s to 730/930 MB/s through IRQ isolation, TCP tuning, zero-copy I/O, and async processing
- **Resource Management**: Implemented cgroup-based resource isolation, reducing OOM incidents by 93% and enabling stable multi-service operation
- **Storage Architecture**: Designed Btrfs-based storage architecture supporting snapshots, file services, encryption and backups with multi-volume support across enterprise deployments
- **Quality Assurance**: Established comprehensive testing framework using xfstests, stress-ng, and automated CI/CD pipelines, reducing support escalations by 80%

#### **QNAP (Cloud File System) - Lead Performance Engineer**
- **Product Success**: Delivered cloud filesystem deployed on 190K+ QNAP NAS devices, establishing it as a core platform service
- **Cloud Storage Gateway**: Architected FUSE-based cloud filesystem with selective mounting, client-side encryption, and transparent NFS/SMB access
- **Performance Optimization**: Achieved 300% metadata performance improvement through multi-layer caching, async garbage collection, and database optimization
- **Scalability**: Enabled support for 50M+ files at 200 files/sec processing rate through filesystem redesign and resource optimization
- **Reliability**: Resolved critical deadlock scenarios in FUSE-daemon interactions and implemented robust state management for production deployment

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
