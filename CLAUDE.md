# Awesome-CV LaTeX Resume & Interview Presentation Project

## Project Overview
This project uses the Awesome-CV LaTeX template to generate professional resumes and CVs, enhanced with an interactive HTML interview presentation system. The main working files are in `src/` with milestone documentation in `milestone/` and a comprehensive interview presentation (`interview-presentation.html`).

## File Structure
- `resumes/general/resume/` - **Canonical GP resume** (all 5 .tex files — source of truth)
- `src/resume/` - Build mirror (synced from GP canonical, used by xelatex)
- `src/resume.tex` - Main resume document (imports from `resume/` relative path)
- `resumes/<company>/` - Job-targeted resumes with analysis reports
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
- `resumes/general/resume/*.tex` - Canonical GP resume files (edit here)
- `src/resume.tex` - Main resume file with personal information and section imports
- `src/resume/*.tex` - Build mirror (synced from `resumes/general/resume/`)

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
