---
name: presentation-design
description: Content rules for slide decks — per-slide density, narrative, jargon discipline, fact-grounding. Use when creating or editing deck/slides/簡報 content. NOT visual tokens/mechanics (→ html-deck-design) or speaking scripts (→ interview-speech).
---

# Presentation Design — Slide Deck Content Rules

Use this skill when authoring or editing slide deck content: ensuring each slide focuses on one major element, controlling keyword density, structuring narrative, managing jargon, grounding facts, and pacing delivery.

## R1 — YAML Deck Schema

Decks are authored in YAML conforming to this schema. The deck becomes the single source of truth — visual rendering, speaker notes, and storyboard all derive from it. Pipeline: phase-1 storyboard (author + approve), then full element authoring.

```yaml
meta: 
  title: Deck title
  lang: zh-Hant
  acts: {1: "Act Name", 2: "Act Name", …}

approved: false              # user approval gate; flips true after storyboard acceptance

slides:
  - id: stable-slug         # reorder-stable identifier (never reuse after deletion)
    act: 1                  # which act this slide belongs to
    claim: "Single sentence this slide proves"
    bridge: "How this follows from previous slide (mandatory; empty = FAIL)"
    anchor: true            # optional; marks anchor-case slides (≥1 per act ideal)
    element:                # ABSENT during storyboard; present after approval
      type: table|flow|cards|code|statement|composite|html
      data: {}              # per-type structure (see renderer)
    notes: |                # speaker notes → data-cheat modal
      Optional multi-line notes for presenter.
    facts:                  # mandatory; [] = explicitly no factual claims
      - claim: "Claim that needs sourcing"
        source: "path/to/file:line"
```

**Storyboard phase** (before approval):
1. Omit all `element` keys — review is claim + bridge only
2. Run renderer with `--storyboard` to produce markdown table (act | claim | bridge)
3. Iterate narrative, reorder slides, refine claims
4. When approved by user, set `approved: false → true` (no element changes after this flip; reorders reopen the gate)

**Full authoring phase** (after approval):
1. Author `element` for every slide (required for approved: true)
2. Add speaker notes (`notes` field) and facts sourcing
3. Render full HTML; renderer refuses build without `approved: true` + all elements

**Schema semantics:**
- `id`: never empty; matches `[a-z0-9_-]+` for HTML/CSS safety
- `claim`: the one thing this slide must convince the viewer of (not the slide title — the intellectual claim)
- `bridge`: mandatory. Empty bridges HARD-FAIL lint. Default order for process decks = chronological/pipeline order; deviations need a stated reason in the bridge.
- `facts`: every claim needs grounding. Use `facts: []` for aspiration/no-claim slides. Each fact has `claim` (the factual assertion) and `source` (file path, optionally with `:line`).
- `element.type`: `statement` (text only), `table`, `flow` (step sequence), `cards` (grid of labeled items), `code` (code block), `composite` (multiple sub-elements), `html` (raw HTML escape hatch, triggers warning).
- `lang` always `zh-Hant`; slide body in Traditional Chinese, code identifiers in English.

## Storyboard Gate

**Enforcement**: No slide element may be authored before the storyboard is approved. Storyboard approval = user sets `approved: true`.

**Workflow:**
1. Draft content with `approved: false` + all slides lacking `element`
2. Run `render-deck.py --storyboard` to produce claim/bridge table
3. Review claims, reorder slides, refine narrative beats
4. User approves: set `approved: true` (this is the gate-flip point)
5. After approval: reorders reopen the gate (require re-approval)
6. Render storyboard again; if slide order changed, get new approval before authoring elements

**Checkpoint 1** (before showing storyboard to user): order + density agents adversarially review. Do NOT show storyboard until order passes (avoid 5+ rounds of "reorder slides").

## Bridge Test

**Rule**: Every claim answers the previous slide's open question or advances the same causal chain. Default order = pipeline/time order (for process decks); deviations must carry a reason in the bridge.

**Detection**: 
- Empty bridge → HARD-FAIL (lint)
- Filler opener (另外/順帶一提/回到剛才/補充一下) → WARN (continue, but flag for review)
- Act with zero `anchor: true` slides → WARN (ask: is this act under-anchored?)

**Writing bridge:**
- State logical connection explicitly: "Building on X, we now examine Y"
- Avoid fillers; they hide weak narrative structure
- If you're reaching for "另外" (by the way), reorder the slides instead

## Checkpoints

**Checkpoint 1** (pre-approval): order + density agents review storyboard (claim/bridge only) before user sees it. Focus: narrative flow, act balance, density of claims per act.

**Checkpoint 2** (pre-delivery): fact + density agents review rendered deck (full elements + notes). Focus: factual sourcing, visual density vs. readability.

Both gates use `render-deck.py` (renderer lives in `html-deck-design/scripts/render-deck.py`) + agent review. Order is locked after approval (changes reopen Checkpoint 1).

## Rule 1: One Major Element per Slide

**Core:** One primary content type per slide — table, diagram, keyword-card row, code-box, or statement. Exception: diagram + ≤3 label cards (≤14 CJK chars each), plus one-line takeaway captions allowed.

**Applies to:** slide structure design, content reordering before styling.

**When to trigger:** Slide contains multiple unrelated tables, stacked diagrams, or jumbled element types.

**When to skip:** Single card with sub-bullets, or diagram with integral labels ≤3 items.

## Rule 2: Keyword-First, Overflow to Notes

**Core:** ≤~40 CJK chars visible per card; longer text moves to speaker notes. Every slide gets a notes entry; file-path citations always notes-only, never on-slide.

**Applies to:** card text trimming, notes population, citation handling.

**When to trigger:** Card text exceeds ~40 CJK; speaker notes missing; paths visible inline.

**When to skip:** Code samples (may exceed 40 chars); single sentence < 40 chars.

## Rule 3: Progressive Table Slides

**Core:** Tables >5 rows split across progressive slides for readability; never nest a table inside a card element.

**Applies to:** table layout, multi-slide sequencing.

**When to trigger:** Single slide shows >5-row table; table is wrapped in a card container.

**When to skip:** Tables ≤5 rows; standalone table (not nested).

## Rule 4: Act Structure with Anchor Demo

**Core:** Narrative uses act tags and structure; establish one real anchor demo early and revisit it — never abandon a demo 10+ slides later without return.

**Applies to:** deck narrative flow, demo lifecycle.

**When to trigger:** Slides lack clear act/section markers; demo introduced then unused for 10+ slides.

**When to skip:** Conceptual-only decks (no demo); short decks <8 slides.

## Rule 5: Jargon Discipline

**Core:** Kill invented abbreviations; first-use inline glosses for kept terms; glossary appendix ≤8 terms.

**Applies to:** term vetting, abbreviation audit, glossary curation.

**When to trigger:** Slides use undefined abbreviations or repeated jargon terms without intro.

**When to skip:** Standard technical terms (HTTP, JSON, etc.) and product names (already known).

## Rule 6: Fact-Grounding Workflow

**Core:** Audit every claim against source-of-truth files BEFORE styling; use honest status labels (已出貨 / 待辦 / 證據不足); never present unshipped as shipped.

**Applies to:** fact verification, status labeling, claim sourcing.

**When to trigger:** Claims about product features, performance, or releases; feature shipping status unclear.

**When to skip:** Speculative/aspirational content explicitly marked "future direction".

## Rule 7: Pacing ~40–60s per Slide

**Core:** Aim for 40–60 seconds delivery per slide; split beats (complex multi-step explanations) compress across slides.

**Applies to:** slide decomposition, speaker timing.

**When to trigger:** Single slide covers 2+ distinct topics or >60s of content.

**When to skip:** Title/intro slides; image-only slides (visual only, low time).

## Rule 8: Language — zh-Hant + English Identifiers

**Core:** Deck body in Traditional Chinese (繁體中文); technical identifiers (skill names, file paths, model IDs, stage names, code) stay English.

**Applies to:** translation/localization, identifier casing.

**When to trigger:** Technical names translated; identifiers converted to Chinese.

**When to skip:** Direct quotations from specs or code (preserve original).

## Workflow

1. **Draft content** in slide tool; apply rules 1–4 (structure/narrative).
2. **Density audit** (Rule 2): trim cards to ~40 CJK, populate notes.
3. **Table check** (Rule 3): split large tables; unwrap nested ones.
4. **Jargon sweep** (Rule 5): list undefined terms, inline first-use gloss, cap glossary at 8.
5. **Fact audit** (Rule 6): verify claims, add status labels, source files.
6. **Pacing review** (Rule 7): estimate slide durations, split long beats.
7. **Language review** (Rule 8): verify deck is zh-Hant, identifiers English.
8. **Style with html-deck-design** (after content rules met).

## Integration

- **Before styling:** apply all 8 rules to content.
- **Visual design:** delegate to `html-deck-design` (tokens, layout, mechanics).
- **Speaking notes:** delegate to `interview-speech` (interview-specific SAR structure, case selection).
- **General prose:** for README/docs/demo scripts, use `prose-guidelines`.
