# Visual Design Spec

Unified design guide for the interview presentation across both HTML and PPTX formats. Both formats share the same color palette, typography, and visual language.

## Color Palette

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Page BG | `#12121f` | `--page-bg` | HTML body background (slightly darker than slides) |
| Slide BG | `#1A1A2E` | `--slide-bg` | Slide background (both formats) |
| Card BG | `#25253A` | `--card-bg` | Cards, metric boxes, elevated surfaces |
| Text Primary | `#FFFFFF` | `--text-primary` | Headings, names |
| Text Secondary | `#F0F0F5` | `--text-secondary` | Body text, descriptions |
| Text Muted | `#888899` | `--text-muted` | Subtitles, labels, footnotes |
| Primary Blue | `#4B8BFF` | `--primary` | Accent lines, section headers, Action SAR border |
| Success Green | `#34D399` | `--success` | Result SAR border, positive metrics, code text |
| Accent Cyan | `#67E8F9` | `--accent` | Metric numbers, technical term highlights |
| Accent Orange | `#FBBF24` | `--orange` | Key achievements, important callouts |
| Alert Red | `#F87171` | `--alert` | Situation SAR border, problem/gap descriptions |
| Border | `#333350` | `--border` | Card borders, subtle separators |
| Code BG | `#0a0a16` | `--code-bg` | Code blocks, inset panels |
| Code Text | `#34D399` | `--code-text` | Code block text color |

> **PptxGenJS rule:** Never prefix hex colors with `#`. Use bare hex strings like `"1A1A2E"`.

## Typography

**Primary font:** Avenir Next (fallback: Calibri, sans-serif)
**Code font:** Consolas (fallback: Courier New, monospace)

All text uses Avenir Next — headings, body, metrics, labels. Consolas only for code blocks in cheat sheet modals.

| Element | Size (PPTX) | Size (HTML) | Weight | Color |
|---------|-------------|-------------|--------|-------|
| Name (cover) | 48pt | 3.5rem | 700 | White |
| Slide title | 36pt | 2.2rem | 600 | White |
| Subtitle | 24pt | 1.2rem | 400 | Text Muted |
| Section header | 14pt | 1.1rem | 600 | Primary Blue |
| Body text | 16-18pt | 1.05rem | 400 | Text Secondary |
| Card title | 15pt | 1rem | 600 | Accent Cyan |
| Card body | 12pt | 0.9rem | 400 | Text Secondary |
| Metric number | 36-40pt | 2.5rem | 700 | Accent Cyan |
| Metric label | 12pt | 0.75rem | 500 | Text Muted (uppercase, letter-spacing 2px) |
| Footnote | 14pt | 0.85rem | 400 | Text Muted |
| Code | 14-15pt | 0.85rem | 400 | Success Green on Code BG |
| Speaker notes | 12pt | — | 400 | — |

## Color Semantics

| Color | Meaning |
|-------|---------|
| Alert Red | Problem state, situation, gap, regression |
| Primary Blue | Action, process, methodology, section accent |
| Success Green | Result, improvement, achievement, positive delta |
| Accent Cyan | Metric numbers, technical highlights, key terms |
| Accent Orange | Important callouts, orchestrator-level achievements |
| Text Secondary | Descriptive body text |
| Text Muted | Labels, context, footnotes, subtitles |

## SAR Color Mapping

| SAR Phase | Border Color | Tint Background | Header Color |
|-----------|-------------|-----------------|-------------|
| Situation | Alert Red (`#F87171`) | `rgba(248,113,113,0.06)` | Alert Red |
| Action | Primary Blue (`#4B8BFF`) | `rgba(75,139,255,0.06)` | Primary Blue |
| Result | Success Green (`#34D399`) | `rgba(52,211,153,0.06)` | Success Green |

## Layout Components

### Accent Line
- Position: below title, left-aligned
- Size: ~35% width, 3px tall
- Color: Primary Blue
- Purpose: visual separator between title and content

### Metric Boxes
- Background: Card BG
- Border: 1px solid Border color
- Corner radius: 10px
- Layout: number on top (bold, Accent Cyan), label below (uppercase, Text Muted)
- Gap: 0.4" / 20px between boxes

### Cards
- Background: Card BG
- Border: 1px solid Border color
- Corner radius: 10px
- Hover (HTML): border brightens to Primary Blue, subtle shadow increase, no translateY

### SAR Section Panels
- Full-width with 4px colored left border + subtle tinted background
- Header: 8px colored dot + bold text in phase color
- Body: Text Secondary, standard body size
- Border-radius: 10px

### Flowchart Boxes (Action slides)
- Background: Card BG with Border
- Border-radius: 8px
- Title: White/Primary text, bold
- Subtitle: Text Muted
- Hover (HTML): border brightens to Primary Blue, glow shadow
- Layout: preparation box top-center, then rows of 3 connected by arrows

### Bar Charts (Situation comparison)
- Vertical bars with proportional heights
- Colors: Alert Red for "before"/problem, Success Green for "after"/target
- Labels: below bars, Text Muted, uppercase
- Values: above/inside bars, White bold

## Slide Structure

### Cover Slide (Slide 1)
- Name: left-aligned, weight 700
- Title: Text Muted, uppercase, letter-spacing 3px
- Blue accent line below
- Contact: Text Muted, no backgrounds
- 3 metric boxes: Accent Cyan numbers

### Content Slides (Slides 2-5, 9)
- Title at top, weight 600
- Blue accent line below title
- Content below with standard margins

### Career Highlights (Slides 4-5)
- Role subtitle in Text Muted
- Description in Text Secondary
- Two rows of 3 metric boxes

### Case Study Slides (Slides 6-8)
- Three SAR panels stacked vertically
- Situation → Action (with flowchart) → Result (with metrics)

### Summary Slide (Slide 10)
- Tagline: Primary Blue, centered
- Three key strengths with pipe separators
- Four metric boxes

### Q&A Slide (Slide 11)
- Large title centered
- Accent line
- Subtitle + contact row

## Card Grid Layouts

| Cards | Width (PPTX) | Gap |
|-------|-------------|-----|
| 2 | 5.8" each | 0.4" |
| 3 | 3.6-3.8" each | 0.4" |
| 4 | 2.8" each | 0.4" |
| Full-width | 12" | — |

Starting x (PPTX): `(13.333 - total_width) / 2` for centering.

## HTML-Specific Notes

- **No external font loading** — Avenir Next and Consolas are system fonts. No Google Fonts needed.
- **CSS variables** — use the `--var-name` column from the color table
- **Slide container**: `max-width: 1200px`, `border-radius: 14px`, `box-shadow: 0 6px 30px rgba(0,0,0,0.5)`
- **Slide border**: `1px solid var(--border)` for edge definition
- **No ::before gradient bars** on slides
- **Motion**: subtle fade+rise (15px, 0.3s) for modals, border-glow hover on interactive elements, no translateY lifts
- **Cheat sheet modals**: Slide BG background, 3px solid Primary Blue top border, warm dark overlay `rgba(0,0,0,0.8)`, code blocks with Code BG + Code Text in Consolas

## PPTX-Specific Notes

- **Canvas**: 13.333" x 7.5" (widescreen 16:9)
- **PptxGenJS**: never use `#` prefix on hex colors — use bare strings like `"1A1A2E"`
- **Accent line**: 3-5" wide x 0.04" tall RECTANGLE shape
- **Speaker notes**: cheat sheet content goes into notes pane, format: `**[Box Title]:** description + key commands`
- **Font fallback**: Avenir Next → Calibri (PPTX embeds fonts differently)
