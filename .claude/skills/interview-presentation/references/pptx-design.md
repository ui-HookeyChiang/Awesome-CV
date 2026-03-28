# PPTX Visual Design Spec

Design guide for interview presentation PPTX generation. Follow this when creating or editing slides with PptxGenJS.

## Canvas

| Property | Value |
|----------|-------|
| Width | 13.333" (widescreen 16:9) |
| Height | 7.5" |

## Color Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Dark BG | `1A1A2E` | 26, 26, 46 | Slide background (all slides) |
| White | `FFFFFF` | 255, 255, 255 | Slide titles, primary text, name |
| Light Gray | `F0F0F5` | 240, 240, 245 | Body text, descriptions |
| Med Gray | `888899` | 136, 136, 153 | Subtitles, labels, footnotes |
| Primary Blue | `006FFF` | 0, 111, 255 | Accent lines, section headers, arrows, Action SAR border |
| Success Green | `00C853` | 0, 200, 83 | Result SAR border, positive metrics, improvements |
| Accent Cyan | `00D4FF` | 0, 212, 255 | Metric numbers, technical term highlights |
| Accent Orange | `FF9F00` | 255, 159, 0 | Key achievements, important callouts |
| Alert Red | `FF4545` | 255, 69, 69 | Situation SAR border, problem/gap descriptions |
| Card BG | `25253A` | 37, 37, 58 | Card/box background |
| Deep BG | `0D0D1A` | 13, 13, 26 | Flowchart box dark background, inset panels |

> **PptxGenJS rule:** Never prefix hex colors with `#`. Use bare hex strings like `"1A1A2E"`.

## Typography

| Element | Font | Size | Color | Bold |
|---------|------|------|-------|------|
| Slide title | Avenir Next | 36pt | White | Yes |
| Name (cover) | Avenir Next | 48pt | White | Yes |
| Subtitle | Avenir Next | 24pt | Med Gray | No |
| Section header | Avenir Next | 14pt | Primary Blue | Yes |
| Body text | Avenir Next | 16-18pt | Light Gray | No |
| Card title | Avenir Next | 15pt | Accent Cyan | Yes |
| Card body | Avenir Next | 12pt | Light Gray | No |
| Metric number | Avenir Next | 36-40pt | Accent Cyan | Yes |
| Metric label | Avenir Next | 12pt | Med Gray | No |
| Footnote | Avenir Next | 14pt | Med Gray | No |
| Speaker notes | Avenir Next | 12pt | — | No |

**Fallback:** If Avenir Next is unavailable, use Calibri.

## Layout Components

### Accent Line
- Position: below title, left-aligned
- Size: 3-5" wide x 0.04" tall
- Color: Primary Blue
- Purpose: visual separator between title and content

### Metric Boxes
- Background: Card BG (`25253A`)
- Border: none
- Corner radius: default rounded rectangle
- Layout: number on top (36-40pt Accent Cyan bold), label below (12pt Med Gray)
- Standard sizes: 2.8" wide for 3-across, 2.2" for 4-across
- Gap: 0.4" between boxes

### Cards (rounded rectangles)
- Background: Card BG (`25253A`)
- Border: none
- Corner radius: default rounded rectangle
- Padding: 0.2" left/right, 0.15" top
- Title at top, body below with 0.55" offset
- Standard widths: 2.2" (small), 2.8" (medium), 3.8" (large), 5.8" (half), 12" (full)

### SAR Section Panels
- Full-width rounded rectangles with colored left border
- **Situation:** left border Alert Red, background slightly tinted
- **Action:** left border Primary Blue, background slightly tinted
- **Result:** left border Success Green, background slightly tinted
- Header: SAR label icon + text (e.g., "Situation") in border color, 18pt bold
- Body: Light Gray text, 14-16pt

### Flowchart Boxes (Action slides)
- Background: gradient fills per optimization stage
- Size: 2.0" x 1.0" (preparation: 2.2" x 1.0")
- Text: White, 11pt bold title, 9pt subtitle
- Layout: preparation box top-center, then rows of 3 connected by arrow shapes
- Arrow connectors: Primary Blue, 0.04" line

### Bar Charts (Situation comparison)
- Vertical bars with proportional heights
- Width: 0.6" per bar
- Colors: Alert Red for "before"/problem, Success Green for "after"/target
- Labels: below bars, 12pt Med Gray
- Values: inside or above bars, 11pt White bold

## Slide Structure Conventions

### Cover Slide (Slide 1)
- Dark background
- Name at y=2.5", 48pt White bold
- Title at y=3.5", 24pt Med Gray
- Accent line at y=4.2", 3" wide Primary Blue
- Contact row at y=5.5": email, GitHub, LinkedIn in Med Gray 14pt
- Key metrics row at y=6.2": 3 metric boxes (Accent Cyan numbers)

### Content Slides (Slides 2-5, 9)
- Title at y=0.4", 36pt White bold
- Accent line at y=1.1", 3" wide
- Content starts at y=1.5"
- Left margin: 0.5-0.8"
- Footer/footnotes at y=6.0-6.3"

### Career Highlights (Slides 4-5)
- Role + company as subtitle at y=1.2", Med Gray
- One-liner description at y=1.8", Light Gray italic
- Two rows of 3 metric boxes each
- Row 1 at y=2.5", Row 2 at y=4.5"
- Gap: 0.4" between boxes

### Case Study Slides (Slides 6-8)
- Title at y=0.4" (case study name)
- Three SAR panels stacked vertically:
  - Situation panel: y=1.2", height ~1.5"
  - Action panel: y=2.8", height ~2.5" (contains flowchart)
  - Result panel: y=5.5", height ~1.5"
- Each panel: full width with colored left border

### Summary Slide (Slide 10)
- Professional tagline at y=2.0", 24pt Primary Blue, centered
- Three key strengths at y=3.5", horizontal with pipe separators
- Four metric boxes at y=5.0"

### Q&A Slide (Slide 11)
- "Questions & Discussion" at y=2.5", 48pt White
- Accent line at y=3.5"
- Subtitle at y=4.0", Med Gray
- Contact row at y=5.5"

## Card Grid Layouts

| Cards | Width Each | Gap |
|-------|-----------|-----|
| 2 | 5.8" | 0.4" |
| 3 | 3.6-3.8" | 0.4" |
| 4 | 2.8" | 0.4" |
| Full-width | 12" | — |

Starting x: `(13.333 - total_width) / 2` for centering.

## Color Semantics

| Color | Meaning |
|-------|---------|
| Alert Red | Problem state, situation, gap, regression |
| Primary Blue | Action, process, methodology, section accent |
| Success Green | Result, improvement, achievement, positive delta |
| Accent Cyan | Metric numbers, technical highlights, key terms |
| Accent Orange | Important callouts, orchestrator-level achievements |
| Light Gray | Descriptive body text |
| Med Gray | Labels, context, footnotes, subtitles |

## SAR Color Mapping

| SAR Phase | Border Color | Icon | Header Text |
|-----------|-------------|------|-------------|
| Situation | Alert Red (`FF4545`) | Red circle | "Situation" |
| Action | Primary Blue (`006FFF`) | Blue circle | "Action" |
| Result | Success Green (`00C853`) | Green circle | "Result" |

## Speaker Notes Convention

Cheat sheet content from the HTML interactive presentation goes into speaker notes:
- One note section per flowchart box or clickable metric
- Format: `**[Box Title]:** description + key commands/configs`
- Keep notes concise — reference material, not scripts
- Notes are visible only in presenter view
