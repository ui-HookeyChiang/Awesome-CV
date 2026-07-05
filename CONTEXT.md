# Awesome-CV

A LaTeX CV/Résumé/Cover Letter template extended with Claude Code skills for automated tailoring, PDF generation, and interview presentation workflows.

## Language

### Document Types

**CV**:
Full curriculum vitae (`cv.tex`); academic/long-form focus, no page limit.
_Avoid_: Resume, curriculum

**Résumé**:
Abbreviated, job-focused document (`resume.tex`); 1–2 pages targeting a specific role.
_Avoid_: CV (they are distinct)

**Cover Letter**:
Formal letter (`coverletter.tex`); separate styling and structure from CV/Résumé.

### LaTeX Structure

**Section**:
Top-level CV division (`\cvsection`), e.g. Experience, Education, Skills. Rendered with colored heading and divider line.
_Avoid_: Chapter, block

**Entry**:
Single job or education item (`\cventry`). Three-column layout: title/location, position/date, description bullets.
_Avoid_: Item, record, row

**Subentry**:
Nested entry under a parent Entry (`\cvsubentry`). Smaller font; used for achievements within a role.

**Honor**:
Prize, certification, or recognition (`\cvhonor`). Compact three-column layout: date, award, issuer.
_Avoid_: Award, achievement (use Honor for the LaTeX element)

**Skill**:
Domain-to-skillset pair (`\cvskill`). Rendered as category label plus comma-separated values.

### Automation Workflow

**Milestone**:
A structured `.md` file capturing an achievement or project outcome. Primary source data for resume refresh and tailoring.
_Avoid_: Achievement file, update

**Tailor**:
The process of adapting CV/Résumé content to a specific job description. Produces a job-targeted output folder: matched resume, interview presentation, and interview script.
_Avoid_: Customize, adapt, personalize

**General-Purpose (GP)**:
Non-tailored canonical resume and presentation built from Milestones and `src/resume/*.tex`. The base artifact before any Tailor run.
_Avoid_: Default resume, generic version

**Fragment**:
A modular HTML or YAML piece (intro slide, case study, cheat sheet) assembled into a final interview presentation.
_Avoid_: Slide, component, partial

**Assembler**:
The Node.js tool (`assemble.js`) that merges HTML Fragments and a YAML profile into a complete `interview-presentation.html`.

**SAR**:
Situation-Action-Result; story format used in interview presentation Fragments to structure achievement narratives.
_Avoid_: STAR (we drop Task; Situation subsumes it here)

**Tech Stack**:
Programming languages, frameworks, and tools extracted from a job description. Used to filter and prioritize résumé bullets during Tailor.
_Avoid_: Skills, technologies (use Tech Stack specifically for JD-extracted items)
