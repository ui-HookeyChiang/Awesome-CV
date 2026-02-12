# Awesome-CV LaTeX Resume & Interview Presentation Project

## Project Overview
This project uses the Awesome-CV LaTeX template to generate professional resumes and CVs, enhanced with an interactive HTML interview presentation system. The main working files are in `src/` with milestone documentation in `milestone/` and a comprehensive interview presentation (`interview-presentation.html`).

## File Structure
- `src/resume.tex` - Main resume document
- `src/resume/` - Individual resume sections (summary, experience, education, etc.)
- `milestone/` - Career milestone documentation (summary.md, qnap.md, ubiquiti.md)
- `interview-presentation.html` - Interactive HTML slideshow for technical interviews
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

## Build Requirements
- XeLaTeX engine
- Awesome-CV class file (`awesome-cv.cls`)

## Output Files
- **Primary resume**: `src/resume.pdf`
- **Interview presentation**: `interview-presentation.html` (interactive slideshow)
- **Interview speech script**: `interview-speech.md` (speaking notes)
- **Example outputs**: Available in `examples/` directory

## Usage Instructions

### Building Resume
```bash
cd src && xelatex resume.tex
```

### Using Interview Presentation
1. Open `interview-presentation.html` in any modern web browser
2. Use ← → arrow keys to navigate between slides
3. Press ESC for fullscreen presentation mode
4. No automatic slide changes - full manual control for interview safety
