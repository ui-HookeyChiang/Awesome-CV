---
name: sar-extraction
description: Extract SAR case studies from milestone/journal data and produce ready-to-use HTML fragments for the interview presentation pool. Use when asked to create a new case study, add a topic to the presentation, or expand the SAR pool. Also use when reviewing milestones for presentation-worthy achievements.
---

# SAR Case Study Extraction

Extract SAR (Situation-Action-Result) case studies from milestone and journal data, producing ready-to-assemble HTML fragments for the interview presentation.

## Inputs

- `milestone/ubiquiti.md`, `milestone/qnap.md`, `milestone/summary.md` — primary SAR content
- `src/present/fragments/achievements/*.html` — check for overlap/suppression
- `journal/` — supplementary detail for cheat sheets (raw data, commands, dates)
- Existing case study fragments in `src/present/fragments/case-studies/` — use as HTML template

## Step 1: Discover

**If user provides a topic**: search milestones and achievements for matching sections. Gather all related content.

**If no topic provided**: scan all milestones for SAR-worthy candidates. A good SAR candidate has:
- **Quantified results** — before/after numbers, percentages, scale metrics
- **Multi-step action** — at least 5-7 distinct technical steps (maps to flow boxes)
- **Clear problem statement** — a gap, limitation, or challenge that motivates the work
- **Not already a case study** — check existing fragments in `src/present/fragments/case-studies/`

Present candidates with rationale. Let user pick.

## Step 2: Collect

Read all source material for the chosen topic:
1. Milestone sections — the primary content
2. Achievement bullets — check `achievements/*.html` for overlap
3. Journal entries — search `journal/` for supplementary detail (specific commands, dates, raw data)

## Step 3: Extract

Transform milestone prose into SAR structure:

### Situation (1-2 sentences)
- Compress milestone's problem description (typically 3-5 bullets) into 1-2 concise sentences
- Highlight key technical terms with `<span style="color: var(--accent); font-weight: 700;">term</span>`
- **Chart decision**: add a bar chart ONLY when concrete comparable numbers exist (e.g., 544 MB/s vs 1850 MB/s). Skip for qualitative situations.

### Action (7 flow boxes)
- Map milestone subsections to exactly 7 flow boxes in a 1+3+3 layout:
  - **1 preparation box** (180x80px): initial analysis/baseline step
  - **3 top-tier boxes** (160x80px): core system-level actions
  - **3 bottom-tier boxes** (160x80px): application/validation-level actions
- Each box has:
  - Title (0.85rem, bold) — the action name
  - Subtitle (0.85rem, bold) — the method or approach
  - Detail (0.7rem, muted) — one key specificity
- Each box gets `data-cheat="<fragment-id>-<action-id>"` for cheat sheet linkage
- Flow description at bottom: `"<Domain>: <Phase1> → <Phase2> → <Phase3>"`

**If milestone has fewer than 7 distinct steps**: group related actions or split a broad step into sub-steps.
**If milestone has more than 7 steps**: merge the least significant steps or move detail into cheat sheets.

### Result (2-4 metric boxes)
- Extract headline metrics from milestone's results section
- Use before→after format for improvements: `544→830`
- Use single values for counts/percentages: `-30%`, `0 Regression`
- Pick the 2-4 most impressive/memorable metrics

### Cheat Sheets (7 entries)
One per flow box. Two formats:

**Technical cheat sheets** (for implementation boxes):
```html
<div class="cheat-sheet-item">
    <strong>Heading:</strong>
    <p>What this step does and why</p>
    <code class="cheat-sheet-command"># Command example</code>
    <code class="cheat-sheet-command">actual-command --with-flags</code>
</div>
```

**Summary cheat sheets** (for validation/result boxes):
```html
<div class="cheat-sheet-item">
    <strong>Heading:</strong>
    <ul style="font-size: 1.2rem; line-height: 2; list-style-type: disc; padding-left: 20px;">
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>
</div>
```

- Titles come word-for-word from milestone text where possible
- Commands: use actual production commands from journal entries, or infer realistic examples from the technical context
- Each cheat sheet has 2-4 items

## Step 4: Produce

Write the HTML fragment to `src/present/fragments/case-studies/<id>.html`.

**Template approach**: read one existing fragment (e.g., `samba-perf.html`) and use it as the structural template. Replace content while preserving all CSS classes, inline styles, and HTML structure. This ensures visual consistency.

Fragment structure:
```
<!-- frontmatter comment -->
<div class="slide">
    <div class="slide-number">{{N}} / {{TOTAL}}</div>
    <h1>Case Study N: <Title></h1>
    <div class="sar-format">
        <div class="sar-item sar-situation">...</div>
        <div class="sar-item sar-action">...</div>
        <div class="sar-item sar-result">...</div>
    </div>
</div>
<script>Object.assign(window.cheatSheets = window.cheatSheets || {}, { ... });</script>
```

**Frontmatter**:
```html
<!-- fragment: <id>
     tags: [relevant, keywords, for, auto-selection]
     domain: <broad-category>
     metrics: [headline metric 1, headline metric 2, ...]
     time: 2-3min
     type: slide
-->
```

**`data-cheat` ID convention**: prefix all IDs with the fragment ID to ensure global uniqueness. E.g., `zfs-analysis`, `zfs-pool-create`, not just `analysis`.

## Step 5: Suppress

Check if any achievement bullets in `achievements/*.html` overlap with the new case study:
1. Read achievement fragments, find bullets that cover the same topic
2. Record overlapping `data-id` values
3. Update the suppression table in `job-analysis/SKILL.md` Step 4

## Step 6: Report (mandatory)

Always produce this report after creating a fragment:

### Extracted
- Which milestone sections were used (file + section headings)
- Which journal entries were used (if any)
- Key decisions made during extraction (e.g., "merged steps X and Y into one flow box")

### Trimmed
- What detail was left out and why
- What went into cheat sheets vs what was dropped entirely

### Manual Review Needed
- Metric accuracy: any numbers that need verification
- Command examples: any inferred commands that should be checked
- Technical claims: anything the agent wasn't confident about
- Cheat sheet depth: areas where more detail could be added from personal experience

### Suppression
- Which achievement bullets overlap with this case study
- Recommended `suppress` entries for profiles that include this case study

## Reference: Existing SAR Patterns

| Case Study | Situation | Chart | Action Pattern | Results | Cheat Sheets |
|---|---|---|---|---|---|
| `kernel-upgrade` | 1 sentence, no highlights | No | Analyze → Upgrade → Validate | 4 metrics (32x, 0, scalability, +40%) | 7 technical |
| `nas-stability` | 2 sentences, 2 highlights | No | Analyze → Plan → Test | 3 metrics (multi-issue, multi-day, 6 products) | 7 mixed |
| `samba-perf` | 1 sentence, 5 highlights | Yes (4 bars) | Baseline → System → Application | 3 before→after metrics | 7 technical |

Use these as calibration for tone, detail level, and structure.
