---
title: QNAP Cloud File System
kind: concept
last_verified: 2026-04-30
summary: Career milestone — built FUSE-based cloud filesystem at QNAP with selective mounting, client-side encryption, and SMB/NFS protocol bridging for local-like cloud access.
entities:
  - kms://entity:qnap
related_concepts:
  - kms://concept:summary
sources:
  - journal/integrated/annaual_summary_2020-to-2025.md
tags: [career, milestone, storage, fuse, cloud]
---

# QNAP Cloud File System

## 🔧 Feature Highlights

- **Local-like cloud access**: Delivered a local-like experience for accessing cloud files by enabling caching and mounting as a local filesystem, with support for NFS and SMB protocols
- **FUSE-based architecture**: Built on a FUSE-based architecture with inter-daemon communication via qrpc, event handling via libev, SQLite as the metadata database, and ext4 for local cache storage
- **Selective mounting**: Supported mounting multiple folders with selective metadata exposure, allowing targeted file sharing
- **Client-side encryption**: Implemented client-side encryption for enhanced data security
- **Smart synchronization**: Enabled both predownload and autoupdate mechanisms to fetch cloud files in mtime order, with fallback to alternate versions when files are too large or space is insufficient. Seamless handling of frequent mode switching
- **Cache pinning**: Added cache pinning functionality with real-time progress tracking and precise read/write/pin statistics. Built-in retry and stable behavior during frequent pin/unpin switches
- **Partial downloads**: Supported partial file downloads to minimize cloud bandwidth and storage consumption

## ⚙️ Architecture & Algorithm Optimization

### Core Performance Improvements

- **Asynchronous garbage collection**: Implemented asynchronous cache garbage collection (async cache GC) to avoid blocking foreground I/O. Space is reclaimed gradually from high to low watermarks during idle periods
- **Deadlock resolution**: Resolved cyclic deadlocks between FUSE xattr and RPC-based daemon queries through architectural redesign, eliminating dependency loops
- **Inode management**: Fixed inode duplication in v1.5 that led to metadata inconsistencies; affected files were reuploaded to preserve correctness
- **Multithreaded access**: Enabled multithreaded access with proper synchronization of file descriptors and timestamps, resolving kernel/user space discrepancies

### VFS Cache Optimization

- **VFS cache support**: Introduced VFS cache support and fixed common CRUD-related deadlocks
  - **Example**: Deleting files while they are still in use causes deadlock during cache invalidation
  - **Solution**: Outdated attributes in VFS cache caused file disappearance and metadata mismatches in SMB/NFS clients. Resolved by forcing cache invalidation via parent directory mtime updates
  - **Case sensitivity**: Also handled case-sensitivity mismatches that could prevent proper cache entry resolution

### Download & Directory Operations

- **Download optimization**: Eliminated async read deadlocks by centralizing the download state machine and coordinating access via condition variables. Only one thread downloads a chunk while others wait, reducing download latency by **36%**. Applied similar logic to opendir
- **Delete optimization**: Reduced kernel-FUSE context switch overhead by implementing a one-shot delete API, decreasing time to delete 1000 nested directories from **22s to 1s**
- **Special file handling**: Fixed deadlocks triggered by uploading special file types
- **Directory reading**: Fixed readdir corruption during concurrent directory modifications by applying an RCU-like buffer update mechanism. Reduced ls time on 3000-entry NFS directories from **1s to 0.3s**

### Database & System Optimizations

- **Database operations**: Deferred timestamp updates from every write operation to close/fsync/setattr to reduce DB load
- **System issues**: Identified issues with outdated glibc (leading to high page fault rates) and string-based DB indexing (causing large B-trees and slow lookups)
- **Directory listings**: Enabled readdirplus, significantly speeding up large directory listings (e.g., ls) by **4–5×**
- **State machine**: Simplified the cache finite state machine: each cache entry now triggers only one DB insert/delete
- **Process consolidation**: Merged the cache daemon into the FUSE process to avoid the overhead of blocking inter-process communication
- **Data organization**: Moved bitmap data from metadb to cachedb, cutting DB operations in half during partial reads and invalidations

### Global Optimization Techniques

- **Buffer management**: Adopted larger page-aligned write/read buffers
- **Multi-layer caching**: Enabled read-ahead and implemented multi-layer caching (VFS + metadata LRU cache)
- **Database efficiency**: Reduced DB write frequency through soft deletes and operation batching
- **Query optimization**: Improved DB query latency through indexing, optimized key structure (avoiding strings as keys), and upgraded libraries such as glibc to reduce page faults
- **Overall impact**: Collectively reduced system latency and improved overall data throughput

### Performance Results

- **Metadata operations**: Improved 130–650% from v1.0 to v1.5 (average +300%), though still behind ext4
- **v1.3 vs. v1.0 improvements**:
  - Local metadata access: **+10%**
  - Sequential write performance: **+50%**
  - Random read performance: **+10%**

## 📊 Stress Testing & Performance Validation

### Version Evolution

- **v1.2**: Copying 50 million files slowed to 1/s after reaching 10 million and eventually triggered OOM
- **v1.4**: After resolving task queue and DB sync bottlenecks, SSD performance reached 200 files/s. However, ext4 limited directories to 20 million entries; enabling large_dir dropped throughput to 5/s
- **v1.5**: Redesigned metadata and cache layout to eliminate inode count limits and avoid cache clustering in single directories. HDD performance reached an average of 100 files/s

## 🧪 Build System & Quality Improvements

### CI/CD Pipeline

- **Automated testing**: Set up GitLab + Jenkins CI pipeline with containerized build system, executing builds, Coverity scans, unit tests, and performance benchmarks
- **Container compatibility**: Verified FUSE compatibility in container environments
- Built automated CI/CD pipelines with GitLab, Jenkins, and Docker. Only less than 20 client support need RD's
  involvement.

### Code Optimization

- **Library consolidation**: Consolidated redundant third-party libraries (libev, libevent, threadpool, bitmap) and removed unused ones (libcurl, libssl, xxHASH)
- **Dependency reduction**: Removed dependencies on QTS; repackaged using autotools, reducing build time from **30 minutes to under 10 minutes** and shrinking code size by **~13%**
- **Build system upgrade**: Evaluated and adopted the Meson build system, upgrading to FUSE3

### Quality Assurance

- **Comprehensive testing**: Developed and ran stress/unit tests using standard tools such as pjdfstest, filebench, and nfstest to ensure filesystem compatibility and product reliability

## Research & Technical Exploration

### IPFS Private File Sharing Network

- Researched IPFS technology, ecosystem, and NAS-applicable development directions
- IPFS uses P2P connections with content-based indexing; proven as an effective distributed storage solution (e.g., BIGTERA, Arbol), integrable with blockchain and databases
- Identified NAS use case: building private cloud on NAS, exposed as a global filesystem via Hybridmount-style FUSE interface, integrating backup, file versioning, and deduplication

### Linux Filesystem Research

- Developed FUSE framework in Golang for rapid prototyping of filesystem concepts
- Analyzed overlayfs version progression and operational principles; assessed impact of version changes on container workloads
- Studied SplitFS architecture (metadata/data operations split across ext4 DAX and FUSE); compared with NOVA achieving nearly **2x performance**
- Implemented key features in dedup FS: writeback cache and chunk defragmentation
- Refactored read/write operations: **-50% codebase**, fixing data assembly issues at chunk edges
