# Awesome-CV LaTeX Resume Project

## Project Overview
This project uses the Awesome-CV LaTeX template to generate professional resumes and CVs. The main working files are in `src/` with milestone documentation in `milestone/`.

## File Structure
- `src/resume.tex` - Main resume document
- `src/resume/` - Individual resume sections (summary, experience, education, etc.)
- `milestone/` - Career milestone documentation (summary.md, qnap.md, ubiquiti.md)
- `examples/` - Template examples and generated outputs

## Build Commands
```bash
# Build resume from src/ directory
cd src && xelatex resume.tex

# Build all examples using Makefile
make examples

# Clean generated files
make clean
```

## Key Files
- `src/resume.tex` - Main resume file with personal information and section imports
- `src/resume/experience.tex` - Professional experience section
- `src/resume/summary.tex` - Professional summary
- `src/resume/education.tex` - Education background
- `src/resume/scholar.tex` - Scholarly activities
- `src/resume/leadership.tex` - Leadership experience

## Content and Formatting Guidelines

### Line Length Requirements
To prevent hyphenated word breaks, maintain these character limits per complete item of continuous text.
Count only the rendered display text, excluding LaTeX markup, indentation, and line numbers.

#### Environment-Specific Character Limits

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
  - Target: Aim for lower multiples (91-96 preferred over 182-192 over
    273-288)
  - Measurement: Count all text within nested `\item{}` braces that appears in final output
  - Line breaks: Maintain proper indentation and break at natural word boundaries

#### Character Counting Methodology
- **Include**: All letters, numbers, spaces, punctuation marks, special characters (%, \, /)
- **Exclude**: LaTeX commands (`\item`, `\cvparagraph`, `\begin`, `\end`), all braces (`{}`), indentation spaces, line numbers
- **Validation**: Each complete item must fall within one of the specified character ranges
- **Preference**: Choose the lowest suitable multiple that accommodates the content appropriately

#### Quality Guidelines
- **Conciseness**: Shorter content within range is preferred over longer content
- **Natural breaks**: Line breaks should occur at natural word boundaries
- **Content density**: Pack meaningful information efficiently within character limits
- **Technical accuracy**: Maintain precision while respecting character constraints

### Content Structure
- **cvparagraph**: Overall summarizing.
- **cvitems**: Focus on impact and results (what you achieved)
- **itemize**: Provide specific details and evidence (how you achieved it)

### Formatting Rules
1. Break lines at natural word boundaries when approaching character limits
2. Never let LaTeX hyphenate words across lines
3. Maintain consistent indentation within each environment type
4. Use action verbs and quantifiable results where possible

## Build Requirements
- XeLaTeX engine
- Awesome-CV class file (`awesome-cv.cls`)

## Interview Presentation Creation

### PowerPoint Generation Process
```bash
# Create interview presentation from resume content and milestones
# The presentation combines:
# - Personal information and contact details from src/resume.tex
# - Professional summary from src/resume/summary.tex
# - Experience details from src/resume/experience.tex
# - Education background from src/resume/education.tex
# - Research projects from src/resume/scholar.tex
# - Leadership experience from src/resume/leadership.tex
# - Detailed achievements from milestone/ directory (summary.md, ubiquiti.md, qnap.md)
```

### Presentation Structure
The interview presentation (`interview-presentation.md`) includes:
1. **About Me**: Personal information and professional summary
2. **Education Background**: Academic credentials and achievements
3. **Core Technical Expertise**: Key skills and specializations
4. **Professional Experience Overview**: Company roles and impact
5. **Detailed Achievements**: Year-by-year accomplishments from milestones
6. **Technical Projects**: Research and development work
7. **Leadership Experience**: Management and mentoring roles
8. **Key Accomplishments Summary**: Quantified results and impact

### Content Sources
- **Resume sections**: All `.tex` files in `src/resume/` directory
- **Milestone documentation**: All `.md` files in `milestone/` directory
- **Personal details**: Contact information from `src/resume.tex`

### Presentation Features
- Structured for 15-20 minute interview presentation
- Emphasizes quantifiable achievements and technical impact
- Includes specific performance improvements and business results
- Organized chronologically with clear technical depth
- Suitable for technical interviews and engineering roles

## Interview Speech Script Creation

### Speech Script Generation Process
```bash
# Create interview speech script from presentation content
# The speech script is derived from interview-presentation.md and includes:
# - Structured timing for 12-15 minute presentation
# - Natural speaking transitions between sections
# - Emphasis on quantifiable achievements and technical impact
# - Professional opening and closing statements
# - Clear section breaks for pacing and emphasis
```

### Speech Script Structure
The interview speech script (`interview-speech.md`) includes:
1. **Opening (30 seconds)**: Professional introduction and overview
2. **About Me (1 minute)**: Background, education, and career impact
3. **Core Technical Expertise (2 minutes)**: Four key technical areas with examples
4. **Professional Experience - Ubiquiti (3 minutes)**: Current role achievements
5. **Professional Experience - QNAP (2 minutes)**: Previous role accomplishments
6. **Research and Technical Projects (1 minute)**: Academic and technical contributions
7. **Leadership Experience (1 minute)**: Management and community leadership
8. **Key Accomplishments Summary (1 minute)**: Quantified impact across roles
9. **Closing (30 seconds)**: Professional conclusion and discussion invitation

### Speech Script Features
- **Timing optimized**: 12-15 minute presentation with 5-10 minutes for Q&A
- **Natural flow**: Smooth transitions between technical and business achievements
- **Quantified impact**: Specific numbers and performance improvements
- **Technical depth**: Balance of high-level overview and detailed technical examples
- **Professional tone**: Appropriate for technical interviews and engineering roles
- **Speaking cues**: Clear section breaks and emphasis points for delivery

### Content Sources
- **Base content**: `interview-presentation.md` structured presentation
- **Speaking adaptation**: Natural language flow and timing considerations
- **Technical examples**: Specific achievements with quantified results
- **Professional framing**: Interview-appropriate opening and closing

## Output
- Primary output: `src/resume.pdf`
- Interview presentation: `interview-presentation.md`
- Interview speech script: `interview-speech.md`
- Example outputs available in `examples/` directory
