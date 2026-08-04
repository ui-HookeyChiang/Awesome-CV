---
name: html-deck-design
description: Design and build self-contained HTML slide decks with swappable token grid (~15 CSS variables), semantic visual grammar (card surfaces, colored left borders, flexbox diagrams), and zero-dependency file mechanics (scrollIntoView + IntersectionObserver nav, keyboard control ←/→/Space/Esc, speaker notes modal with body lock, print PDF in light theme). Use when building presentations that render as single HTML files with inline CSS+JS, need branded color/font swaps without code rewrites, or will export to PDF handouts. NOT data visualization internals/palettes (→ dataviz skill), NOT slide content/narrative (→ presentation-design skill), NOT docs/README/talks (→ prose-guidelines).
---

## Overview

Design and build zero-dependency slide presentations. Owns the visual token system, card/surface grammar, and HTML/JS mechanics — not content or data charts.

**Token grid** (~15 CSS variables): page-bg, slide-bg, card-bg, text tiers (primary/secondary/muted), semantic colors (primary/success/alert/accent), borders, code styling. Defaults = Awesome-CV reference values (see template).

**Visual grammar**: every surface = card-bg + 1px border + radius (14 slide / 10 card / 8 nested); semantic emphasis = 4px colored left border + 6% alpha tint (Situation/Action/Result colors coded); diagrams = flexbox + Unicode arrows (no SVG/canvas).

**File mechanics** (shipped in `references/template.html`, never LLM-regenerated): scroll-document model (scrollIntoView + IntersectionObserver 0.5 threshold); keyboard nav (←/→/Space/PageUp/PageDown/Home/End, Esc fullscreen with modal priority); `data-cheat` speaker-notes modal with body scroll lock; print media query for light theme + page-break-after.

## Token Swap Workflow

Extract defaults from `references/template.html` lines 9–24 (`--page-bg` through `--code-text`). To skin for a new brand:

1. **Palette source**: use your official frontend-design system (reference the system, don't duplicate its body in this skill). Avoid AI-default palettes (cream+terracotta, near-black+acid-green).
2. **Constraints**: pick 4–6 named hex colors; apply one bold accent to 1–2 places max (usually primary + accent).
3. **CSS path**: edit `:root { --var-name: #hexcode; }` block at the top of `<style>`. One variable per color role; never inline hex into component styles.
4. **Test**: open in browser, verify text contrast (WCAG AA), print preview (light theme readability).

## Text-Role Mapping

Every text element maps to a semantic role with a corresponding token. Use these rules to ensure presenter-read text is always legible and metadata remains visually distinct.

| Element | Token | Rationale |
|---|---|---|
| h1, card h3, big-statement | `--text-primary` | structure — dominant, always readable |
| subtitle / big-sub / section lede | `--text-secondary` | supporting header — must read at a glance |
| body, td, flow labels | `--text-secondary` | content — primary reading tier |
| captions, footers, slide counter, flow `small`, stat labels | `--text-muted` | true metadata only — viewer may skip |

**Rule**: `--text-muted` is reserved for metadata a viewer may skip; anything a presenter reads aloud gets `--text-secondary` or better. Contrast floor for muted on any surface it's allowed on: ≥4.5:1 (keep #888899; it stays legal for metadata).

## Visual Grammar Reference

### Slide structure
- `.slide`: rounded 14px, 1px border, dark background, min-height 80vh
- `.slide h1`: 35%-width primary-color underline (3px), Avenir Next 2.2rem
- `.subtitle`-equivalent: `--text-secondary`, supporting header under h1
- Semantic cards (SAR): grid layout, 4px left border + 6%-alpha tint per role

### Card / Surface stack (nested)
- **Slide level**: radius 14px (outer wrapper)
- **Card level**: radius 10px (content containers inside slide)
- **Inner elements** (tables, code, lists): radius 8px (deepest nesting)

**Semantic emphasis rule**: 4px colored left border + background `rgba(color, 0.06)` (6% alpha).
- Situation (SAR-situation): `--alert` (#FF4545)
- Action (SAR-action): `--primary` (#006FFF)
- Result (SAR-result): `--success` (#00C853)

### Diagrams
Flexbox rows/grids + Unicode arrows (→, ↓, ↔). No SVG or canvas elements.

## Mechanics (Fixed in Template)

### Navigation
- **Arrow keys** (← / →): prev/next slide
- **Space / PageDown / PageUp**: next/prev slide
- **Home / End**: jump to first/last
- **Esc**: toggle fullscreen presentation mode (modal closes first if open)

### Slide counter
- Rendered dynamically from `IntersectionObserver` (threshold 0.5) — never hardcoded
- Updated in nav hint: `Slide N of M`

### Speaker notes modal
- Trigger: click or keyboard on `.flow-box[data-cheat]` or `.metric-box[data-cheat]` elements
- Body scroll lock while modal open (prevent background scroll)
- Close: click outside modal or press Esc
- Content: stored in `cheatSheets` JS object (one entry per note key) or per-slide `<template>` elements

### Print media query
- Light theme: white background, #1f2937 text, #e5e7eb borders
- Removes nav hint, shadows, dark styling
- `page-break-after: always` on every `.slide` for PDF handout export

## Codified Fixes

1. **Hoisted styles**: use `.class-name` for repeated inline patterns, never inline style attributes (exception: dynamic position/sizing with JS).
2. **Slide numbers**: JS-generated from array index + total, stored in nav state — never hardcoded HTML.
3. **Notes content**: store in single `cheatSheets` JS object `{ key: { title, content }, … }` OR per-slide `<template id="notes-KEY">` elements; both work, pick one per deck.

## References

- `references/template.html` — skeleton (tokens + slide card + nav JS + modal + print) — ready to fill with content slides
- `references/pptx-helpers.md` — mined pptxgenjs helpers (addCard, addPill, addFlowNodes, addTableStyled, addCodeBox) for when generating pptx from the same deck spec

## NOT Clauses

- **NOT chart palettes or internals**: color-by-series, legends, axes, diverging palettes → dataviz skill
- **NOT slide content or narrative**: keyword-card layout, SAR selection, speaker-script details → presentation-design skill
- **NOT docs/README/demo scripts/talks**: markdown/prose structure → prose-guidelines; conference talks → interview-presentation wrapper
