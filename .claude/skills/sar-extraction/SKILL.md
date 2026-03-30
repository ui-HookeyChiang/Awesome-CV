---
name: sar-extraction
description: Extract SAR case studies from milestone/journal data and produce ready-to-use HTML fragments for the interview presentation pool. Use when asked to create a new case study, add a topic to the presentation, or expand the SAR pool. Also use when reviewing milestones for presentation-worthy achievements.
---

# SAR Case Study Extraction

Extract SAR (Situation-Action-Result) case studies from milestone and journal data, producing ready-to-assemble HTML fragments for the interview presentation.

## Inputs

- `milestone/ubiquiti.md`, `milestone/qnap.md`, `milestone/summary.md` — primary SAR content
- `src/present/fragments/achievements/*.html` — check for overlap/suppression
- `journal/raw/git-sar/<date>/<category>.md` — categorized git commits (from host-work-journal SAR collection)
- `journal/` — other supplementary detail (work reports, weekly reports)
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
3. SAR git data — read `journal/raw/git-sar/<date>/<category>.md` for the matching topic (commit subjects, bodies, file paths map to flow boxes and cheat sheets)
4. Other journal entries — search `journal/` for additional context (work reports, weekly reports)

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

**Use the template**: copy `src/present/fragments/case-studies/_template.html` and replace all `{{PLACEHOLDER}}` values with extracted content. The template has:

- **Frontmatter** — fill in `{{ID}}`, `{{TAGS}}`, `{{DOMAIN}}`, `{{METRICS_LIST}}`
- **Situation** — fill `{{SITUATION_TEXT}}` with highlighted spans. Delete the `<!-- OPTIONAL CHART -->` block if no chart needed.
- **Action** — fill 7 flow boxes: `{{BOX_N_LINE1}}`, `{{BOX_N_LINE2}}`, `{{BOX_N_DETAIL}}` and their `{{CHEAT_N}}` IDs
- **Result** — fill 2-4 metric boxes: `{{RESULT_N_NUMBER}}`, `{{RESULT_N_LABEL}}`. Delete unused boxes.
- **Cheat sheets** — fill 7 entries: `{{CHEAT_N_TITLE}}`, item headings, descriptions, commands. Add/remove `<div class="cheat-sheet-item">` blocks as needed (2-4 items per cheat sheet).

**`data-cheat` ID convention**: the template uses `{{ID}}-{{CHEAT_N}}` format, producing IDs like `zfs-analysis`, `zfs-pool-create`. This ensures global uniqueness.

**Situation text highlighting**: wrap key technical terms with:
```html
<span style="color: var(--accent); font-weight: 700;">term</span>
```

**Preview the fragment** after filling the template:

```bash
# Create a throwaway test profile that includes the new fragment
cat > src/present/profiles/preview.yaml << 'EOF'
name: Preview
description: Preview new case study fragment
derived_from: general

cover:
  tagline: "Preview"
summary:
  tagline: "Preview"
  strengths: [A, B, C]

skills: [os, tools, languages, frameworks]
highlights: [ubiquiti, qnap]
case-studies: [NEW_FRAGMENT_ID, kernel-upgrade, nas-stability]
achievements: [innovation, performance]
suppress: []
EOF

# Assemble and open
cd src/present
node assemble.js preview --output ~/Downloads/preview.html
open ~/Downloads/preview.html

# Clean up after review
rm src/present/profiles/preview.yaml
```

Replace `NEW_FRAGMENT_ID` with the actual fragment ID. The new case study appears as slide 6 (first case study position) for easy review. Check:
- Situation text renders with highlighted terms
- Chart displays correctly (if included)
- All 7 flow boxes are clickable and open cheat sheets
- Result metrics display properly
- No layout overflow or broken styles

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
