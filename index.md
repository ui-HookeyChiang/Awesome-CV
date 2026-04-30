---
title: Awesome-CV — index
kind: meta
last_verified: 2026-05-01
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
- [NAS Performance Summary](milestone/performance-summary.md) — UNAS-2/4/Pro/Pro-8 fio results

```dataview
TABLE summary
FROM "milestone"
SORT file.name ASC
```

## Journal — Integrated

Static fallback (chronological — most recent first):

- [Annual Summary 2020-2025](journal/integrated/annaual_summary_2020-to-2025.md) — career arc across QNAP and Ubiquiti
- [Performance Summary (refined)](journal/integrated/performance-summary.md) — refined NAS fio dataset
- [Weekly Report 2026Q1 (Feb)](journal/integrated/weekly-report_2026Q1-feb.md)
- [Weekly Report 2026Q1](journal/integrated/weekly-report_2026Q1.md)
- [Weekly Report 2025Q4](journal/integrated/weekly-report_2025Q4.md)
- [Work Report — ampere 2026-03-17 to 2026-03-24](journal/integrated/work-report_ampere_2026-03-17-to-2026-03-24.md)
- [Work Report — ampere 2026-03-01 to 2026-03-26](journal/integrated/work-report_ampere_2026-03-01-to-2026-03-26.md)
- [Work Report — ampere 2026-03-01 to 2026-03-10](journal/integrated/work-report_ampere_2026-03-01-to-2026-03-10.md)
- [Work Report — ampere 2026-02-01 to 2026-02-28](journal/integrated/work-report_ampere_2026-02-01-to-2026-02-28.md)
- [Work Report — ampere 2025-11 to 2026-02](journal/integrated/work-report_ampere_2025-11-to-2026-02.md)
- [Work Report — C1153-MacBook-Pro 2024-03 to 2026-02](journal/integrated/work-report_C1153-MacBook-Pro_2024-03-to-2026-02.md)

```dataview
TABLE file.mtime AS modified
FROM "journal/integrated"
SORT file.mtime DESC
LIMIT 10
```

## Journal — Refined (in flight)

- [refined/ stage placeholder](journal/refined/README.md) — stage 2 of the raw → refined → integrated pipeline

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
