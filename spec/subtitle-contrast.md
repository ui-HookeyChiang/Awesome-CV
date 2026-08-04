# Spec: Subtitle contrast — deck fix + html-deck-design token rule

Status: draft 2026-08-04
Origin: user report — `~/Downloads/pr-1235-prompt-hub-slides.html` 背景顏色讓副標不明顯

## Problem

`.subtitle` and `.big-sub` (25 occurrences in the PR-1235 deck) render in
`--text-muted: #888899` on `--slide-bg: #1A1A2E`. WCAG contrast measured:

| Foreground | vs `#1A1A2E` slide-bg | vs `#12121f` page-bg |
|---|---|---|
| `#888899` (muted, current) | 4.9:1 | 5.33:1 |
| `#F0F0F5` (secondary) | 15.02:1 | 16.33:1 |
| `#FFFFFF` (primary) | 17.06:1 | 18.55:1 |

4.9:1 passes AA for body text but subtitles are functional headers — at 1rem
directly under a 2.2rem white h1 the muted tier reads as decoration, not
hierarchy. Root cause is a token-role gap: the grid has primary/secondary/muted
but no rule mapping roles to slide elements, so subtitle fell to muted.

`html-deck-design` skill has zero subtitle guidance (grep confirmed) — every
future deck inherits the same failure. Fix upstream + instance.

## Requirements

### R1 — html-deck-design skill: text-role mapping rule
Add a normative table to SKILL.md (and matching CSS in
`references/template.html`):

| Element | Token | Rationale |
|---|---|---|
| h1, card h3, big-statement | `--text-primary` | structure |
| **subtitle / big-sub / section lede** | **`--text-secondary`** | supporting header — must read at a glance |
| body, td, flow labels | `--text-secondary` | content |
| captions, footers, slide counter, flow `small`, stat labels | `--text-muted` | true metadata only |

Rule: `--text-muted` is reserved for metadata a viewer may skip; anything a
presenter reads aloud gets secondary or better. Contrast floor for muted on any
surface it's allowed on: ≥4.5:1 (keep #888899; it stays legal for metadata).

### R2 — PR-1235 deck instance fix
In `~/Downloads/pr-1235-prompt-hub-slides.html`: change `.subtitle` and
`.big-sub` color from `var(--text-muted)` → `var(--text-secondary)`.
Optional differentiation from body text: `font-weight: 500` on `.subtitle`
(no color change beyond secondary; do NOT invent a new hex).
Leave `.slide-header .slide-num`, `.flow-box small`, `.stat .label`, footer
on muted (metadata per R1).

### R3 — Non-goals
- No new token; no palette change (defaults stay Awesome-CV reference values).
- No change to reference template at `resumes/general/interview-presentation.html`
  in this pass (it has its own subtitle treatment; audit separately if needed).
- presentation-design skill untouched (content rules, not color).

## Acceptance

- [ ] template.html `.subtitle`-equivalent styles use `--text-secondary`; SKILL.md
      carries the text-role table with the "read-aloud ⇒ ≥secondary" rule.
- [ ] Deck: all 25 `.subtitle`/`.big-sub` occurrences render `#F0F0F5` (15:1);
      metadata elements still `#888899`.
- [ ] Contrast script (python, in ticket) re-run: no read-aloud element below 7:1.

## Delivery

- Branch `subtitle-contrast` off `origin/dev`; PR → `dev`. Never push master/dev.
- Deck file lives in `~/Downloads` (outside repo) — fix in place, note in PR body
  that the deck artifact is not repo-tracked.
