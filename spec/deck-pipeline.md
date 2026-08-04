# Spec: Deck data pipeline — storyboard gate, bridge test, YAML/renderer split

Status: converged 2026-08-04 (grill session, 5 rounds)
Origin: handoff-deck-process-retro.md — PR-1235 deck took 8 feedback rounds;
three of them were pure slide reordering (rounds 5/7/8). Root causes: no
storyboard gate, no inter-slide transition rule, edits as full-HTML rewrites.

## Decisions (user-confirmed)

| # | Decision |
|---|---|
| 1 | Scope: A (storyboard gate) + bridge test + **whole B** (YAML schema + renderer + migrate PR-1235 deck; original HTML kept as `.bkp`) + D (two named checkpoints) |
| 2 | `element.data`: structured types + `html: \|` escape hatch (renderer warns on use). `facts` mandatory per slide; no factual claims ⇒ explicit `facts: []` |
| 3 | Storyboard = phase 1 of the same YAML (`id/act/claim/bridge` only); single source of truth. `approved: true` field gates build mode — renderer refuses full build without it; slides with claim/bridge but no element ⇒ draft mode |
| 4 | Enforcement: empty `bridge` = hard-fail; transition-filler openers (另外/順帶一提/回到剛才/補充一下) = warning; anchor-per-act coverage = warning. Pipeline/chronological order is the DEFAULT rule for process decks — deviations must carry a reason in the storyboard |
| 5 | Checkpoint 1 (order+density lenses) runs BEFORE user approval of storyboard; Checkpoint 2 (fact+density) runs pre-delivery; order is locked after approval (changes reopen the gate). Renderer+lint live in `html-deck-design/scripts/`; schema + process rules live in `presentation-design` |

## R1 — YAML deck schema (owned by presentation-design)

```yaml
meta: {title, lang: zh-Hant, acts: {1: "...", ...}}
approved: false          # flips true only by user approval
slides:
  - id: stable-slug      # reorder-stable reference
    act: 2
    claim: "one sentence this slide must convince"
    bridge: "how it follows from the previous slide"
    anchor: true         # optional; marks anchor-case slides
    element:             # ABSENT in draft/storyboard phase
      type: table|flow|cards|code|statement|composite|html
      data: {...}        # per-type structure; type html = escape hatch (warn)
    notes: |             # speaker notes → data-cheat modal
    facts:               # mandatory; [] = explicitly no factual claims
      - {claim: "...", source: "path/to/file:line"}
```

## R2 — Renderer + lint (owned by html-deck-design)

`scripts/render-deck.py <deck.yaml>`:
- `--storyboard`: markdown table (# | act | claim | bridge) from phase-1 YAML.
- full build: requires `approved: true` AND every slide has `element` — else
  exit with draft-mode message. Output honors template.html mechanics + tokens
  and the text-role table.
- Lint (runs in both modes):
  - HARD-FAIL: empty/missing `bridge`; missing `facts` key; `approved: true`
    with element-less slides.
  - WARN: filler bridge openers (另外/順帶一提/回到剛才/補充一下); act with
    zero `anchor` slides; `element.type: html` usage.
- `--check-facts`: verify each `facts[].source` path exists (mechanical leg;
  semantic leg is Checkpoint 2's fact agent).

## R3 — presentation-design SKILL.md additions

- **Storyboard gate** (new section, before existing rules): no slide element
  may be authored before the user approves the phase-1 storyboard; approval is
  recorded as `approved: true`. Reorders after approval reopen the gate.
- **Bridge test** (extends Rule 4): every claim answers the previous slide's
  open question or advances the same causal chain; default order for process
  decks = pipeline/time order, deviations need a stated reason.
- **Checkpoints** (codifying candidate D): CP1 = order+density adversarial
  agents on the storyboard BEFORE presenting it to the user; CP2 = fact+density
  agents on the rendered deck before delivery. Order not re-reviewed at CP2.
- Point to the schema (here) and renderer (html-deck-design/scripts/).

## R4 — Migrate PR-1235 deck

Convert `~/Downloads/pr-1235-prompt-hub-slides.html` (44 slides, 5 acts) to
`deck.yaml` + rendered output; verify rendered HTML is functionally equivalent
(slide count, notes content, tokens). Keep original as
`pr-1235-prompt-hub-slides.html.bkp`. Deck YAML lives beside the HTML in
`~/Downloads` (out of repo); a copy of the YAML may land in repo examples/ if
useful as schema reference.

## Non-goals

- No changes to token grid, template mechanics, or text-role table.
- No new top-level pipeline skill — flow lives inside presentation-design.
- No retroactive re-review of PR-1235 content (structure is converged).

## Acceptance

- [ ] render-deck.py --storyboard, draft-mode refusal, approved-mode build,
      all lint rules demonstrably firing (test YAML fixtures for each rule).
- [ ] Migrated PR-1235 deck renders 44 slides; spot-diff vs .bkp: same slide
      order, same notes text, subtitle at text-secondary.
- [ ] presentation-design SKILL.md passes skill-audit + verify-skill, no BLOCK.
- [ ] Cross-references: presentation-design names the renderer path;
      html-deck-design SKILL.md gains one line pointing at render-deck.py.
```

## Delivery

Branch `deck-pipeline` off origin/dev; PR → dev. skill-writer route for both
SKILL.md edits. Deck migration artifact stays out of repo (Downloads).
