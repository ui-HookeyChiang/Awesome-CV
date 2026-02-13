---
name: resume-content-rules
description: Rules for editing LaTeX resume files in src/resume/. Ensures proper formatting and prevents hyphenated word breaks. Use when editing resume .tex files.
---

# Resume Content Rules

Use this skill when editing LaTeX resume files in `src/resume/` directory. These rules ensure proper formatting and prevent hyphenated word breaks.

## Line Length Requirements
To prevent hyphenated word breaks, maintain these character limits per complete item of continuous text.
Count only the rendered display text, excluding LaTeX markup, indentation, and line numbers.

### Environment-Specific Character Limits

- **cvparagraph environment**: 95-102, 190-204, or 285-306 characters per complete item
  - Used in: `resume/summary.tex`
  - Purpose: Professional summary paragraphs and first impression
  - Target: Aim for lower multiples (95-102 preferred over 190-204 over 285-306)
  - Maximum: Total paragraph should not exceed 510 characters (approximately 5 lines)
  - Measurement: Count all text within `\cvparagraph{}` that appears in final output

- **cvitems environment**: 95-100, 190-200, or 285-300 characters per complete item
  - Used in: `experience.tex`, `education.tex`, `scholar.tex`, `leadership.tex`
  - Purpose: Main bullet points summarizing roles, achievements, or milestones
  - Target: Aim for lower multiples (95-102 preferred over 190-204 over 285-306)
  - Measurement: Count all text within `\item{}` braces that appears in final output
  - Line breaks: Use natural word boundaries, maintain proper indentation

- **itemize environment**: 91-96, 182-192, or 273-288 characters per complete item
  - Used within: cvitems blocks for detailed sub-points
  - Purpose: Specific achievements, technical details, or supporting evidence
  - Target: Aim for lower multiples (91-96 preferred over 182-192 over 273-288)
  - Measurement: Count all text within nested `\item{}` braces that appears in final output
  - Line breaks: Maintain proper indentation and break at natural word boundaries

### Character Counting Methodology
- **Include**: All letters, numbers, spaces, punctuation marks, special characters (%, \, /)
- **Exclude**: LaTeX commands (`\item`, `\cvparagraph`, `\begin`, `\end`), all braces (`{}`), indentation spaces, line numbers
- **Validation**: Each complete item must fall within one of the specified character ranges
- **Preference**: Choose the lowest suitable multiple that accommodates the content appropriately

### Quality Guidelines
- **Conciseness**: Shorter content within range is preferred over longer content
- **Natural breaks**: Line breaks should occur at natural word boundaries
- **Content density**: Pack meaningful information efficiently within character limits
- **Technical accuracy**: Maintain precision while respecting character constraints

## Content Structure
- **cvparagraph**: Overall summarizing.
- **cvitems**: Focus on impact and results (what you achieved)
- **itemize**: Provide specific details and evidence (how you achieved it)

## Formatting Rules
1. Break lines at natural word boundaries when approaching character limits
2. **Never break a word with a hyphen to the next line.** LaTeX may auto-hyphenate long words at line ends (e.g., "perfor-\nmance", "infra-\nstructure"). Prevent this by rewording, using shorter synonyms, or adjusting nearby text so the word fits on one line. If a build shows hyphenated breaks in `resume.log` (Overfull/Underfull warnings), fix them.
3. Maintain consistent indentation within each environment type
4. Use action verbs and quantifiable results where possible
5. **Avoid hyphenated compound words** (e.g., "low-latency", "full-stack", "cross-team") at positions where LaTeX may line-break them — the hyphen becomes a line-end break point, splitting the compound across lines and hurting readability. Rephrase instead (e.g., "Delivered measurable latency gains" instead of "Low-latency gains").
6. **In multi-sentence blocks (summary, paragraphs), each sentence should start from the left margin.** If a sentence ends mid-line and the next sentence starts near the right edge, readers' eyes have to jump awkwardly. Adjust wording so sentence boundaries align with line starts. This rule applies to `cvparagraph` (summary) and any multi-sentence content — NOT to single-sentence sub-bullets where a short second line is fine.

## LaTeX Rendering Warning

Character counts alone do NOT guarantee page fit. LaTeX line-breaking depends on word lengths, hyphenation points, and justification — two texts with identical character counts can render to different numbers of lines.

**Key lessons:**
- A 91-char sub-bullet with short words may render as 1 line, but the same count with long words may render as 2 lines
- Swapping "streamlined the dev" for "enabling secure" (same length) can add an extra rendered line
- The only reliable test is `xelatex` + `pdfinfo | grep Pages`
- When editing job-targeted resumes, build-and-check after every text change — the layout has zero margin for overflow
