# Spec: `html-deck-design` + `presentation-design` skills

Status: converged 2026-08-03 (grill session; supersedes handoff-presentation-skills.md assumptions where noted)
Source: $TMPDIR/handoff-presentation-skills.md + 6-round user Q&A

## Decisions (user-confirmed)

| # | Question | Decision |
|---|----------|----------|
| 1 | Token strategy | **Swappable token grid** (~15 CSS variables as skin points), Awesome-CV values (`#12121f` / `#1A1A2E` / `#25253A` / `#006FFF` / `#00D4FF` / `#3A3A55`, Avenir Next h1 w/ 35%-width 3px underline, no hero cover) as default |
| 2 | Existing `interview-presentation` skill | Rewrite as **thin wrapper**: keeps only interview-specific content (SAR framework, case selection); styling + structure rules delegate to the two new skills |
| 3 | pptx | **HTML primary**; pptxgenjs helpers (addCard/addPill/addFlowNodes/addTableStyled/addCodeBox) demoted to `references/` file, loaded on demand |
| 4 | presentation-design trigger scope | **Slide decks only**; NOT-clause excludes docs/README/demo scripts (those → prose-guidelines / interview-speech) |
| 5 | Template mechanics (scroll model, nav JS, notes modal, print flip) | Belong to the visual/artifact skill — no third skill |
| 6 | Naming | `visual-design` too broad → **`html-deck-design`**; content skill stays **`presentation-design`** |
| 7 | Executable starting point | **Yes** — `references/template.html` skeleton (tokens + card + nav JS + notes modal + print theme, no content); mechanics never rewritten by LLM |
| 8 | Landing repo | **Awesome-CV only** — both skills in `.claude/skills/`, symlinked into `~/.claude/skills/` for global use. skill-dev repo untouched. One PR, includes interview-presentation wrapper rewrite. Supersedes handoff's skill-dev + two-PR plan |
| 9 | Acceptance criteria | (a) skill-audit + verify-skill pass, no BLOCK findings; (b) rebuild verification: regenerate 3–5 sample slides of the PR-1235 deck with the new skills, visually aligned to Awesome-CV reference; (c) dataviz conflict check — chart/color guidance must not contradict, NOT-clauses carve cleanly |

## Skill 1: `html-deck-design` (the artifact)

Owns: how the deck is built and looks.

- **Token grid**: ~15 CSS variables (page-bg, slide-bg, card-bg, border, primary,
  accent, text tiers, semantic tints…) — the only sanctioned skin points; defaults =
  Awesome-CV reference (`resumes/general/interview-presentation.html`, tokens at lines 9–24).
- **Visual grammar**: every surface = card-bg + 1px border + radius (14 slide / 10
  card / 8 inner — radius shrinks with nesting); semantic emphasis = 4px colored left
  border + 6%-alpha tint; diagrams = flexbox boxes + Unicode arrows (no SVG/canvas).
- **File mechanics** (shipped in `references/template.html`, not prose-regenerated):
  zero-dependency single file (inline CSS+JS, system fonts); scroll-document model
  (`scrollIntoView` + IntersectionObserver threshold 0.5 counter); keyboard
  ←/→/Space/PageUp/PageDown/Home/End, Esc fullscreen (modal owns Esc first);
  `data-cheat` speaker-notes modal with body scroll lock; print media query → light
  theme + `page-break-after: always` (free PDF handout).
- **Codified fixes**: hoist repeated inline styles into classes; JS-generated slide
  numbers (`i+1 / total`), never hardcoded; notes content in one JS object or
  per-slide `<template>`.
- **`references/pptx-helpers.md`**: mined pptxgenjs helpers from
  scratchpad `generate-deck.js` (a0d895e3 session) — on-demand only.
- Description NOT-clauses: NOT chart internals/palettes for data plots (→ dataviz);
  NOT slide content/narrative (→ presentation-design).

## Skill 2: `presentation-design` (the content)

Owns: what goes on each slide.

1. One major element per slide (one table OR diagram OR keyword-card row OR code-box
   OR big statement). Composite exception: diagram + ≤3 label cards of ≤14 CJK chars.
   One-line takeaway captions allowed.
2. Keyword-first: ≤~40 CJK chars visible per card; overflow → speaker notes. Every
   slide gets a notes entry; file-path citations always notes, never on-slide.
3. Tables >5 rows split into progressive slides; never nest table inside card.
4. Narrative: act structure with act tags; one real anchor demo set up early and
   revisited — never abandoned 10+ slides.
5. Jargon discipline: kill invented abbreviations; first-use inline gloss; ≤8-term
   glossary appendix.
6. Fact-grounding: audit every claim against source-of-truth files BEFORE styling;
   honest status labels (已出貨 / 待辦 / 證據不足); never present unshipped as shipped.
7. Pacing ~40–60s per slide; split beats compress.
8. Language: deck body zh-Hant; technical identifiers (skill names, paths, models,
   stage names) stay English.
- Description NOT-clauses: NOT for docs/README/demo scripts/talks; NOT visual
  tokens/mechanics (→ html-deck-design).

## Skill 3 (edit): `interview-presentation` → thin wrapper

Keep: SAR framework, interview case selection, interview-safety nav notes.
Delegate: all styling/tokens → html-deck-design; density/narrative → presentation-design.
Remove duplicated rules so no drift surface remains.

## Delivery

- Branch off master in Awesome-CV (never push master), one PR:
  - `.claude/skills/html-deck-design/` (SKILL.md + references/template.html +
    references/pptx-helpers.md)
  - `.claude/skills/presentation-design/` (SKILL.md)
  - `.claude/skills/interview-presentation/` wrapper rewrite
  - symlinks into `~/.claude/skills/` (or install note — symlink step is outside repo)
- Authoring route: skill-writer (repo rule; never skill-creator directly).
- Acceptance: row 9 above.
