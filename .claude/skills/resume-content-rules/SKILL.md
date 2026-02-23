---
name: resume-content-rules
description: Rules for editing LaTeX resume files in src/resume/. Ensures proper formatting and prevents hyphenated word breaks. Use when editing resume .tex files.
---

# Resume Content Rules

Use this skill when editing LaTeX resume files in `src/resume/` directory. These rules ensure proper formatting and prevent hyphenated word breaks.

## Line Length Reference
Character counts are **reference guidance** for fitting rendered content into whole lines, not strict validation rules. The goal is that each sentence or bullet renders as exactly 1 or 2 complete lines, so the next item starts from the left margin. Always verify with `xelatex` build.

### Approximate Characters Per Rendered Line

| Environment | ~1 line | ~2 lines | ~3 lines |
|-------------|---------|----------|----------|
| **cvparagraph** | 95-102 | 190-204 | 285-306 |
| **cvitems** | 95-100 | 190-200 | 285-300 |
| **itemize** (sub-bullets) | 91-96 | 182-192 | 273-288 |

- These are approximate — proportional fonts mean character count alone does not guarantee fit
- Use as a starting estimate, then build and visually verify
- Prefer fewer lines (1-line over 2-line over 3-line) for conciseness

### Quality Guidelines
- **Conciseness**: Shorter content is preferred over longer content
- **Natural breaks**: Content should fill whole rendered lines, not leave large gaps
- **Content density**: Pack meaningful information efficiently
- **Technical accuracy**: Maintain precision while respecting length
- **Impact over vanity metrics**: Prefer performance gains (latency, throughput, CPU%), user scale, and business outcomes over code volume (LOC, file counts, commit counts). LOC belongs in milestones, not on resumes.

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
6. **Every sentence in the summary must start from the left margin.** This is the core readability rule for `cvparagraph`. Enforce with `\\` after each sentence's period (except the last). Only break between sentences — never between clauses of the same sentence. Each sentence should fit within 1-2 rendered lines (~95-204 chars). LaTeX source line breaks alone have no effect on justified text rendering; only `\\` forces a new line.

## Summary Structure Rule (CRITICAL)
7. **Always use exactly 4 lines with `\\` in the summary.** The GP summary uses a proven 4-line structure where each line starts from the left margin via `\\`. Changing to 3 lines — even with shorter total text — causes page overflow because `cvparagraph` renders differently with fewer forced line breaks. For job-targeted summaries, match this 4-line pattern: (1) role identity, (2) dedication/focus, (3) impact metrics, (4) skills list.

## Common Pitfalls (Do NOT Repeat)

| Pitfall | Why It Fails | Fix |
|---------|-------------|-----|
| Changing source line breaks in `.tex` to align sentences | Source newlines have zero effect on justified paragraph rendering | Use `\\` after sentence periods |
| Rewording sentences to control where the next starts | Proportional fonts make character-count prediction unreliable | Use `\\` — the only reliable method |
| Removing all hyphenated compounds (e.g., "AI-aided") | Rule #5 only applies at LaTeX line-break positions, not everywhere | Keep compounds; only rephrase if at a break point |
| Inserting `\\` before a clause continuation (e.g., "spanning Btrfs...") | Splits one sentence across forced breaks, ruining readability | `\\` goes only after sentence-ending periods |
| Adding `\\` without checking page count | Each `\\` adds vertical space that can push tight-margin resumes to 3 pages | Build-and-check after adding `\\`; shorten sentences if overflow |
| Using 3-line summary instead of 4-line | Different `cvparagraph` rendering causes page overflow even with less text | Always use exactly 4 lines with `\\` matching GP structure |
| Reordering bullets assuming zero rendering impact | Word-break patterns differ after reorder, can add rendered lines | Always build-verify after reordering |
| Using LOC/line counts as achievements | Code volume is not impressive; interviewers care about impact | Use impact metrics: latency, CPU%, throughput, user scale |
| Redundant technical descriptors (e.g., "gRPC state daemon") | "gRPC daemon" already implies state service; extra words waste space | Drop redundant qualifiers; keep only what adds meaning |

## LaTeX Rendering Warning

Character counts are approximate — LaTeX line-breaking depends on word widths, hyphenation points, and justification. Two texts with identical character counts can render differently.

**Key lessons:**
- Same-length text can render to different line counts due to proportional font widths
- The only reliable test is `xelatex` + visual check of the rendered PDF
- Source line breaks (newlines in `.tex`) have **zero effect** on justified paragraph rendering — only `\\` forces a line break
- When editing job-targeted resumes, build-and-check after every text change — the layout has zero margin for overflow
- For summary sentences: always use `\\` to control line breaks, never rely on rewording alone
