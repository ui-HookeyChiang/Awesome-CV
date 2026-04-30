---
title: Awesome-CV — index
kind: meta
last_verified: 2026-04-29
summary: Entry page for the Awesome-CV vault — career milestones, journal integrations
tags: [obsidian, navigation, career]
---

# Awesome-CV

> Career knowledge wiki — LaTeX resume, interview presentation, journal
> pipeline (raw → refined → integrated), milestone synthesis.

## Milestones

Static fallback (Dataview-rendered when opened in Obsidian):

- [Career Summary](milestone/summary.md) — cross-employer synthesis
- [Ubiquiti Experience](milestone/ubiquiti.md) — NAS platform, ustated, storage stack
- [QNAP Cloud File System](milestone/qnap.md) — FUSE filesystem, encryption, cloud bridging

```dataview
TABLE summary
FROM "milestone"
SORT file.name ASC
```

## Journal — Integrated

```dataview
TABLE file.mtime AS modified
FROM "journal/integrated"
SORT file.mtime DESC
LIMIT 10
```

## Journal — Refined (in flight)

```dataview
LIST
FROM "journal/refined"
SORT file.mtime DESC
LIMIT 5
```

## Federation context

This vault is registered as `awesome-cv` in the llm-wiki federation
(see `meta-wiki/federation.md` in the federation root). When opened as a
single-wiki vault, federation cross-links resolve only to local pages.
