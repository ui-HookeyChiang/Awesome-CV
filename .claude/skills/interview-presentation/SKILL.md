---
name: interview-presentation
landing-group: resume
description: Interview presentation pipeline — fragment-based assembly, SAR case selection for different interview scenarios, and interview-safe navigation. Use when building interview decks, selecting case studies per role, authoring interview case studies, or when tailor-resume needs interview deck orchestration. NOT for visual design/tokens (→ html-deck-design) or slide content rules (→ presentation-design).
---

# Interview Presentation — Fragment Assembly & Case Selection

Orchestrates interview deck pipeline: modular HTML fragment assembly via profile YAML, SAR case selection per interview role, and interview-safe navigation (manual control, no auto-advance).

## Fragment Architecture

The presentation is built from modular HTML fragments assembled via profile YAML. This enables JD-driven content selection — swap case studies, achievements, skills, and metrics per interview without editing HTML.

### How It Works

```
src/present/
  base.html              # HTML shell (CSS, JS, modal, navigation)
  fragments/             # 15+ fragment files (slides + cards)
    cover.html           # Fixed slide with {{tagline}} template var
    background.html      # Fixed slide (education + career timeline)
    highlights/*.html    # Slide fragments (ubiquiti, qnap)
    case-studies/*.html  # SAR slides + cheat sheet JS (kernel-upgrade, nas-stability, samba-perf)
    achievements/*.html  # Card fragments with data-id for suppression (innovation, performance)
    summary.html         # Fixed slide with {{summary-tagline}}, {{strength-1/2/3}}
    qna.html             # Fixed slide
    cheat-sheet-data.js  # Consolidated cheat sheet data
  profiles/
    general.yaml         # Default profile
  assemble.js            # Assembler: profile → HTML
  test-assemble.js       # Validation: diff assembled vs original
```

### Building a Presentation

```bash
cd src/present
node assemble.js general                              # default → interview-presentation.html
node assemble.js general --output ~/Downloads/pres.html  # custom output
node assemble.js google-storage                       # JD-targeted profile
```

### Profile YAML

Profiles select which fragments to include and customize template variables:

```yaml
name: General Purpose
description: Default presentation for broad engineering roles

cover:
  tagline: "Delivering Solutions of Quality and Innovation"

summary:
  tagline: "OS Engineer — Linux Development, Performance & Storage Infrastructure"
  strengths: [End-to-End Platform Builder, Full-Stack Performance, Cross-Team Systems Thinker]

highlights: [ubiquiti, qnap]                      # order = slide order
case-studies: [kernel-upgrade, samba-perf, ai-skill]  # pick 3 from pool
achievements: [innovation, performance]           # order = display order

suppress: []  # manual override: achievement data-ids to hide (auto-suppress handles most cases)
```

### Adding Content to the Pool

**New case study**: Create `fragments/case-studies/<id>.html` with SAR slide HTML + inline `<script>` for cheat sheet data. Add frontmatter comment with tags for future auto-selection.

#### Fragment Frontmatter Format

Every fragment file should begin with an HTML comment block containing structured metadata. This enables programmatic discovery via `node assemble.js --list-fragments`.

```html
<!-- fragment:
  id: kernel-upgrade
  type: case-study
  tags: [kernel, driver, btrfs, validation]
  domain: System Infrastructure
  metrics: [32x checksum, 0 regression, +40% SSD IOPS]
  source: milestone/ubiquiti.md#2026-q1
-->
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique fragment identifier (matches filename without extension) |
| `type` | enum | One of: `case-study`, `achievement`, `highlight` |
| `tags` | array | Searchable keywords for JD-driven auto-selection |
| `domain` | string | Technical domain category (e.g., "System Infrastructure", "Storage Performance") |
| `metrics` | array | Key quantified outcomes for quick relevance matching |
| `source` | string | Milestone path where the content originated (e.g., `milestone/ubiquiti.md#section`) |
| `suppresses` | array | Achievement data-ids to auto-hide when this case study is in the lineup |

The assembler's `readFragment()` strips the frontmatter comment before assembly, so it has zero impact on the rendered presentation. Use `node assemble.js --list-fragments` to output a JSON array of all fragment metadata for tooling integration.

**New achievement card**: Create `fragments/achievements/<id>.html` using `<div class="achievement-section">` containing `<div class="achievement-grid">` with `<div class="achievement-chip" data-id="...">` chips. Each chip has `<span class="ach-title">` and `<span class="ach-stat">` inside. The assembler wraps these in an `achievements-container`.

### Overlap Strategy

| Overlap | Strategy |
|---|---|
| Case study ↔ achievement (auto) | **Auto-suppress** — case study frontmatter `suppresses` field lists achievement `data-id`s to hide when that case study is in the lineup. No profile edit needed. |
| Case study ↔ achievement (manual) | **Manual suppress** — add achievement `data-id` to profile `suppress` list for overrides not covered by auto-suppress. |
| Case study ↔ highlight metric | **Reinforce** — metric teases, case study explains. No action. |
| Highlight metric ↔ achievement | **Acceptable** — different granularity. No action. |

Career highlight metrics are **fixed** per role — always shown, never suppressed.

### Fragment Types

- **Slide fragments**: Full `<div class="slide">` with `{{N}} / {{TOTAL}}` slide number
- **Card fragments**: Inner `<div class="achievement-section">` with `<div class="achievement-grid">` — assembler wraps in `achievements-container` inside a slide

### Editing Workflow

1. Edit the relevant fragment file (not `interview-presentation.html` directly)
2. Run `node assemble.js general` to rebuild
3. Run `node test-assemble.js` to validate (if editing existing content that should match original)

> **Design spec**: `spec/2026-03-29/presentation-fragments.md`


## SAR Framework for Case Studies

Each interview case study follows Situation → Action → Result structure for problem-solving narrative:

- **Situation**: Context and technical challenge; problem statement.
- **Action**: Solution methodology; system-level and application-level optimizations.
- **Result**: Quantified impact; before/after metrics demonstrating improvements.

For visual rendering (colors, gradients, border-radius, layout, typography, charts) → delegate to **html-deck-design**.
For slide density, content structure, and keyword-first rules → delegate to **presentation-design**.

## Cheat Sheet Architecture

Interactive cheat sheets provide on-demand technical depth via modal overlays, triggered on-click:

- **Technical cheat sheets** (Action boxes): Command-line examples, production configs, implementation steps.
- **Summary cheat sheets** (Result metrics): Bullet-point lists of outcomes, capabilities, impacts — no code.

Modal mechanics (scroll lock, focus management, ESC behavior, overlay styling) → delegate to **html-deck-design**.

## Interview Case Selection

Profile YAML controls case study roster — pick 3 from a pool of 5+ based on role fit.

**Workflow:** `job-analysis` produces `tech-stack.md` + `interview-prep.md` → create profile YAML in `src/present/profiles/<company>.yaml` → `node assemble.js <company>` → tailored deck with case study selection applied.

**Selection criteria:**
- **Primary case study** (slide 6): Core technical domain matching job responsibility.
- **Secondary case study** (slide 7): Transferable skills; demonstrates breadth.
- **Tertiary case study** (slide 8): Different problem-solving approach; unique strength.

For role-specific summary slide content (tagline, strengths, metrics) → delegate to **presentation-design** (narrative structure, act tags, anchor demo).

## Interview Navigation — Manual Control (Safety)

Keyboard-only navigation prevents auto-advance during live delivery:

- **Left/Right Arrow**: Previous / next slide
- **Space / PageDown / PageUp**: Next / previous slide
- **Home / End**: First / last slide
- **ESC**: Toggle fullscreen presentation mode

**Why manual control:** Speaker stays in sync with slides — zero risk of unplanned auto-advance disrupting interview delivery.

For keyboard mechanics, fullscreen behavior, modal priority, and presentation tech stack → delegate to **html-deck-design**.
