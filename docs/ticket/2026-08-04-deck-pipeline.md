# Ticket: Deck data pipeline — schema, renderer, gate rules, migration

Status: ready
Spec: spec/deck-pipeline.md (read in full — it is the contract)

## Description

Implement R1–R4: YAML deck schema section in presentation-design,
render-deck.py + lint in html-deck-design/scripts/, storyboard-gate /
bridge-test / checkpoint rules in presentation-design SKILL.md, and migrate the
PR-1235 deck to YAML (original kept as .bkp).

## Order

1. R2 renderer+lint first (everything else references it).
2. R1+R3 SKILL.md edits (skill-writer route; prose-guidelines).
3. R4 migration last (uses the renderer; out-of-repo artifact).

## Test plan (self-test before commit)

- Fixture YAMLs under html-deck-design/scripts/tests/: one per lint rule —
  empty bridge (fail), missing facts (fail), approved with element-less slide
  (fail), filler bridge opener (warn), act without anchor (warn), html escape
  hatch (warn), clean deck (pass). Run each, assert exit codes/messages.
- --storyboard on a phase-1 fixture produces the 4-column markdown table.
- Migration: rendered deck has 44 slides; notes text preserved (extract+diff
  against .bkp data-cheat contents); subtitle color var(--text-secondary).

## Non-goals

Spec Non-goals section verbatim: no token/template/text-role changes, no new
top-level skill, no content re-review of PR-1235.
