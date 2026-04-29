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

## Federation links

- [Federation root README](../llm-wiki/README.md)
  *(if you opened the federation root as the vault)*
- Or open this directory directly as a single-wiki vault.
