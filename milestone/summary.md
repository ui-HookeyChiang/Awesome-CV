# Career Summary

## Senior System Engineer & Storage Architect

### Core Expertise
**System Architecture & Platform Development**: Led end-to-end system bring-up and architecture design for enterprise storage platforms, from bootloader and kernel integration to user-space applications.

**Performance Engineering**: Specialized in full-stack performance optimization, delivering measurable improvements across storage, network, and system layers through profiling, algorithmic redesign, and resource management.

**Storage & Filesystem Engineering**: Expertise in modern filesystems (Btrfs, FUSE), RAID systems, and storage virtualization, with focus on reliability, performance, and data integrity at scale.

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
