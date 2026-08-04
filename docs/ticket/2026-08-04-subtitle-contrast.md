# Ticket: Subtitle contrast — text-role rule + deck fix

Status: ready
Spec: spec/subtitle-contrast.md (read it in full — it is the contract)

## Description

Subtitles render in `--text-muted #888899` (4.9:1 on slide-bg) and read as
decoration. Root cause: token grid has no element→role mapping. Fix upstream
skill + PR-1235 deck instance.

## Tasks

- **R1**: `.claude/skills/html-deck-design/SKILL.md` — add normative text-role
  table (spec R1); rule: presenter-read text ≥ `--text-secondary`, `--text-muted`
  reserved for skippable metadata (slide counter, footers, flow `small`, stat
  labels), muted contrast floor 4.5:1. `references/template.html` — subtitle-
  equivalent styles use `var(--text-secondary)`.
- **R2**: `~/Downloads/pr-1235-prompt-hub-slides.html` — `.subtitle` and
  `.big-sub` color → `var(--text-secondary)`; add `font-weight: 500` to
  `.subtitle`. Metadata elements stay muted. (File outside repo — edit in place.)

## Test plan

Contrast script (from spec, python) over both files: every read-aloud element
≥7:1 on its surface; metadata elements unchanged (#888899). Grep: zero
`--text-muted` on `.subtitle`/`.big-sub` in either file.

## Non-goals (spec R3)

No new tokens, no palette change, no edits to
`resumes/general/interview-presentation.html` or presentation-design skill.
