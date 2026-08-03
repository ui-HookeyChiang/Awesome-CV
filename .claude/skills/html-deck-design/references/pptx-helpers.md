# pptxgenjs Helpers — On-Demand Reference

Use these helpers when generating PowerPoint (pptx) from the same deck spec. Load and adapt as needed for the brand's palette.

## Helper Functions

### addCard(slide, x, y, w, h, opts)

Render a rounded-rectangle card with optional title + body text.

**Parameters:**
- `slide`: pptxgenjs slide object
- `x, y, w, h`: position and dimensions (inches)
- `opts`: object with keys:
  - `title` (string, optional): card heading
  - `body` (string, optional): card body text
  - `bgColor` (hex string, default: white)
  - `borderColor` (hex string, default: light gray)
  - `titleColor` (hex string, default: dark text)
  - `bodyColor` (hex string, default: mid gray)
  - `titleSize` (number, default: 13)
  - `bodySize` (number, default: 11)
  - `bodyAlign` (string, default: 'left') — 'left', 'center', 'right'

**Behavior:**
- Draws a rounded rectangle (radius 0.1 in) with border
- Optional drop shadow (outer, blur 4, offset 2)
- Title at top (bold if present)
- Body text below title or at top if no title
- Body supports line wrapping and multi-line text

**Example:**
```javascript
addCard(s, 0.8, 1.5, 5.5, 4.8, {
  title: 'My Card',
  body: 'Card content here.',
  bgColor: 'F7F9FC',
  borderColor: 'E8ECF1',
  titleColor: '1A1A2E',
  bodyColor: '4A5568'
});
```

---

### addPill(slide, x, y, text, bgColor, textColor)

Render a small pill-shaped badge (rounded capsule with text).

**Parameters:**
- `slide`: pptxgenjs slide object
- `x, y`: position (inches)
- `text` (string): label text (short, e.g., "45+ skills")
- `bgColor` (hex string): background color
- `textColor` (hex string): text color

**Behavior:**
- Width auto-scales with text length (0.08 in per character + 0.3 in padding)
- Height fixed at 0.28 in
- Rounded rectangle (radius 0.14 in — 50% height)
- Bold sans-serif font, centered

**Example:**
```javascript
addPill(s, 0.8, 5.7, '45+ skills', 'FF6B6B', 'FFFFFF');
```

---

### addFlowNodes(slide, nodes, y, opts)

Render a horizontal flow diagram with connected nodes and arrows.

**Parameters:**
- `slide`: pptxgenjs slide object
- `nodes` (array of strings): node labels (e.g., ['Issue', 'Triage', 'Spec'])
- `y` (number): vertical position (inches)
- `opts`: object with keys:
  - `startX` (number, default: 0.8) — left margin (inches)
  - `totalW` (number, default: 11.5) — total width available (inches)
  - `activeIdx` (number, default: -1) — index of highlighted node (-1 = none)
  - `bgColor` (hex, default: light gray) — inactive node background
  - `activeColor` (hex, default: teal) — active node background
  - `textColor` (hex, default: dark text) — inactive node text
  - `activeTextColor` (hex, default: white) — active node text
  - `nodeH` (number, default: 0.4) — node height (inches)

**Behavior:**
- Equally spaced nodes with → arrows between them
- Active node (if activeIdx ≥ 0) is bold and highlighted
- Nodes are rounded rectangles; arrows are Unicode → characters
- All nodes fit within `startX` to `startX + totalW`

**Example:**
```javascript
addFlowNodes(s, ['Issue', 'Triage', 'Spec', 'Dev'], 4.8, {
  startX: 0.8, totalW: 8, activeIdx: 1, bgColor: '065A82', textColor: '8896A6'
});
```

---

### addTableStyled(slide, rows, x, y, w, opts)

Render a table with header row, alternating row colors, and optional styling.

**Parameters:**
- `slide`: pptxgenjs slide object
- `rows` (array of arrays): 2D table data (first row = header)
- `x, y, w`: position and width (inches); height auto-computed from row count
- `opts`: object with keys:
  - `headerBg` (hex, default: navy)
  - `headerColor` (hex, default: white) — header text
  - `zebraA, zebraB` (hex defaults: white, light gray) — alternating row colors
  - `fontSize` (number, default: 10)

**Behavior:**
- Header row (first row): bold, headerBg background, headerColor text
- Body rows: alternate zebraA/zebraB backgrounds every row
- All cells: light gray borders, centered padding (4px top/bottom, 6px left/right)
- Middle-aligned text (valign: 'middle')
- Column width auto-distributed equally

**Example:**
```javascript
const tableData = [
  ['Name', 'Status', 'Count'],
  ['Item A', 'Active', '42'],
  ['Item B', 'Inactive', '7']
];
addTableStyled(s, tableData, 0.8, 1.5, 11.5, {
  headerBg: '1E2761',
  headerColor: 'FFFFFF',
  zebraA: 'FFFFFF',
  zebraB: 'F1F5F9',
  fontSize: 10
});
```

---

### addCodeBox(slide, x, y, w, h, code)

Render a code block with monospace font, dark background, and green syntax color.

**Parameters:**
- `slide`: pptxgenjs slide object
- `x, y, w, h`: position and dimensions (inches)
- `code` (string): code text (multiline supported)

**Behavior:**
- Dark background (codeBg: #0F172A)
- Green text (codeText: #10B981)
- Monospace font (Courier New)
- Preserves line breaks
- Rounded corners (radius 0.08 in)

**Example:**
```javascript
const code = `const message = "Hello, World!";\nconsole.log(message);`;
addCodeBox(s, 0.8, 2.0, 11.5, 2.5, code);
```

---

## Integration Pattern

1. Define a **palette object** with all brand colors:
   ```javascript
   const C = {
     navy: '1E2761', deepBlue: '065A82', white: 'FFFFFF',
     darkText: '1A1A2E', midGray: '8896A6', …
   };
   ```

2. Define constants for fonts:
   ```javascript
   const FONT_TITLE = 'Cambria';
   const FONT_BODY = 'Calibri';
   ```

3. Invoke helpers with palette colors:
   ```javascript
   addCard(s, 0.8, 1.5, 5.5, 4.8, {
     title: 'My Section',
     bgColor: C.white,
     borderColor: C.lightGray,
     titleColor: C.darkText
   });
   ```

4. For multiline content (card body, table cells, code), break lines with `\n`:
   ```javascript
   addCard(s, …, { body: 'Line 1\nLine 2\nLine 3' });
   ```

---

## Notes

- All dimensions are in **inches** (pptxgenjs standard).
- Font family and size are locked per helper (Calibri 11–13 for body, title varies). Override by editing the helper function directly.
- Shadows and rounded corners use pptxgenjs built-in shape styling — no image assets required.
- These helpers are **not** CSS/HTML — adapt the visual grammar (colors, spacing, fonts) for pptx by changing the helper parameters, not by rewriting their structure.
