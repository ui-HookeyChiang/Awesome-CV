---
name: references
description: Field-by-field guide for filling src/present/fragments/case-studies/_template.html — frontmatter schema, Situation/Action/Result sections, and cheat-sheet entries.
landing-group: resume
---

# Case Study Template Fill Guide

Copy `src/present/fragments/case-studies/_template.html` and replace all `{{PLACEHOLDER}}` values with extracted content. The template has:

- **Frontmatter** — fill in the full schema:
  ```html
  <!-- fragment:
    id: <fragment-id>
    type: case-study
    tags: [tag1, tag2, ...]
    domain: <broad domain>
    metrics: [metric1, metric2, ...]
    source: milestone/<company>.md#<section>
  -->
  ```
- **Situation** — fill `{{SITUATION_TEXT}}` with highlighted spans. Delete the `<!-- OPTIONAL CHART -->` block if no chart needed.
- **Action** — fill 7 flow boxes: `{{BOX_N_LINE1}}`, `{{BOX_N_LINE2}}`, `{{BOX_N_DETAIL}}` and their `{{CHEAT_N}}` IDs
- **Result** — fill 2-4 metric boxes: `{{RESULT_N_NUMBER}}`, `{{RESULT_N_LABEL}}`. Delete unused boxes.
- **Cheat sheets** — fill 7 entries: `{{CHEAT_N_TITLE}}`, item headings, descriptions, commands. Add/remove `<div class="cheat-sheet-item">` blocks as needed (2-4 items per cheat sheet).

**`data-cheat` ID convention**: the template uses `{{ID}}-{{CHEAT_N}}` format, producing IDs like `zfs-analysis`, `zfs-pool-create`. This ensures global uniqueness.

**Situation text highlighting**: wrap key technical terms with:
```html
<span style="color: var(--accent); font-weight: 700;">term</span>
```
