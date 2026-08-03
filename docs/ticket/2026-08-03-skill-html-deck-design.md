# Ticket: Author `html-deck-design` skill

Status: ready
Spec: spec/html-deck-skills.md (Skill 1)
Depends on: none

## Goal + why

Create `.claude/skills/html-deck-design/` — the artifact-side skill for
self-contained HTML slide decks (tokens, visual grammar, file mechanics).
Codifies the Awesome-CV reference template so future decks stop drifting
(this quarter's deck "沒對齊" because tokens were regenerated ad hoc).

## Deliverables

- `SKILL.md` — via skill-writer route:
  - Swappable token grid: ~15 CSS variables (page-bg, slide-bg, card-bg, border,
    primary, accent, text tiers, semantic tints); defaults = Awesome-CV reference
    values (`resumes/general/interview-presentation.html` lines 9–24:
    `#12121f`/`#1A1A2E`/`#25253A`/`#006FFF`/`#00D4FF`/`#3A3A55`, Avenir Next h1
    with 35%-width 3px underline, no hero cover slide).
  - Visual grammar: surface = card-bg + 1px border + radius 14/10/8 (shrinks with
    nesting); semantic emphasis = 4px colored left border + 6%-alpha tint;
    diagrams = flexbox + Unicode arrows, no SVG/canvas.
  - Codified fixes: classes over repeated inline styles; JS-generated slide
    numbers; notes in one JS object or per-slide `<template>`.
  - Token-swap guidance: when skinning for a new brand, apply the official
    frontend-design plugin's principles — 4–6 named hex palette, avoid AI-default
    palettes (cream+terracotta, near-black+acid-green), boldness in one place.
    Reference the plugin, don't duplicate its body.
  - NOT-clauses: NOT data-chart palettes/internals (→ dataviz); NOT slide
    content/narrative (→ presentation-design).
- `references/template.html` — skeleton with tokens + slide card + nav JS
  (scrollIntoView, IntersectionObserver 0.5 counter, keyboard map, Esc order:
  modal → fullscreen) + `data-cheat` notes modal (body scroll lock) + print
  media query (light theme, `page-break-after: always`). No content slides.
  Extract from reference template (mechanics at lines 48–92, 382–418, 620–637,
  1957–2100), applying the codified fixes.
- `references/pptx-helpers.md` — mined pptxgenjs helpers (addCard/addPill/
  addFlowNodes/addTableStyled/addCodeBox) from scratchpad
  `/private/tmp/claude-502/-Users-hookeychiang--claude-skill-dev/a0d895e3-0404-41b3-8162-ea2fe1ef3125/scratchpad/generate-deck.js`
  (fallback: branch `slides-wayfinder` commit `a61e498f` tickets).
  On-demand only.

## Acceptance criteria

- [ ] `template.html` opens in browser: keyboard nav, counter, notes modal,
      print preview flips light — all work with zero console errors.
- [ ] SKILL.md token table lists all variables with Awesome-CV defaults.
- [ ] Description carves cleanly against dataviz + presentation-design.

## allowed_files
`.claude/skills/html-deck-design/**` only.

## must_preserve / forbidden_changes
Do not touch `resumes/**`, existing skills, `src/**`. No pushes to master.

## Rollback
`git checkout -- .claude/skills/html-deck-design/` on branch `html-deck-skills`.

## Report format
<200 words: files created, template.html manual-test results, open questions.
