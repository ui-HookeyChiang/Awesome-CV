---
name: tailor-resume
description: Orchestrator for generating tailor-made resumes, presentations, and speech scripts. Supports job-targeted (with JD) and general-purpose (without JD) modes. All output under resumes/. Use when asked to tailor, update, or rebuild a resume.
---

# Tailor-Made Resume & Presentation Generator

Orchestrator skill that coordinates sub-skills to produce a complete application package. Supports two modes:

- **Job-targeted** — JD provided; optimize for that specific role
- **General-purpose** — no JD; refresh from latest milestones

All output goes under `resumes/`.

## Sub-Skills

| Skill | When Used | Purpose |
|-------|-----------|---------|
| **job-analysis** | Job-targeted only | JD analysis → `tech-stack.md` + `interview-prep.md` |
| **resume-content-rules** | Both modes | Character limits, formatting |
| **resume-pdf-check** | Both modes | Build PDF, validate 2-page limit, scholar auto-shrink |
| **interview-presentation** | Both modes | HTML slideshow structure |
| **interview-speech** | Both modes | Speech script structure |

## Mode Selection

| Trigger | Mode | Output |
|---------|------|--------|
| JD provided (file or inline) | Job-targeted | `resumes/<company-name>/` |
| "update resume" / "refresh resume" | General-purpose | `resumes/general/` |
| "update presentation" | General-purpose | `resumes/general/` |

## Output Structure

```
resumes/
├── general/                         # General-purpose (canonical)
│   ├── resume/                      # all 5 .tex files (canonical GP)
│   ├── resume.pdf
│   ├── interview-presentation.html
│   └── interview-speech.md
│
└── <company-name>/                  # Job-targeted
    ├── job-description.md           # Input
    ├── tech-stack.md                # From job-analysis
    ├── interview-prep.md            # From job-analysis
    ├── resume/                      # summary.tex, experience.tex, [scholar.tex]
    ├── resume.pdf
    ├── interview-presentation.html
    └── interview-speech.md
```

## Source Files

| File | Purpose |
|------|---------|
| `resumes/general/resume/*.tex` | **Canonical GP resume** (all 5 .tex files) |
| `src/resume/*.tex` | Build mirror — kept in sync with GP canonical |
| `src/present/interview-presentation.html` | Default presentation template |
| `milestone/*.md` | Achievement data |

**Important:** `resumes/general/resume/` is the canonical location for all GP .tex files. After editing GP files, sync them to `src/resume/` so the build works. For job-targeted builds, the backup/copy/restore procedure in **resume-pdf-check** handles this automatically.

---

## General-Purpose Pipeline

```
mkdir -p resumes/general/resume
```

1. **Read** milestone files + current `resumes/general/resume/*.tex` (canonical GP)
2. **Create summary** → `resumes/general/resume/summary.tex`
   - Refresh from milestones, keep general-purpose
   - Follow **resume-content-rules**
3. **Create experience** → `resumes/general/resume/experience.tex`
   - Update bullets with latest achievements, order by impact
   - Follow **resume-content-rules**, do NOT change titles/dates
4. **Sync to build mirror** — copy updated files to `src/resume/`
5. **Build PDF** → `resumes/general/resume.pdf`
   - Follow **resume-pdf-check** (build, validate 2 pages)
6. **Generate presentation** → `resumes/general/interview-presentation.html`
   - Follow **interview-presentation** skill, use latest milestones
7. **Generate speech** → `resumes/general/interview-speech.md`
   - Follow **interview-speech** skill, derive from presentation

---

## Job-Targeted Pipeline

```
mkdir -p resumes/<company-name>/resume
```

1. **Save JD** → `resumes/<company-name>/job-description.md`
2. **Analyze JD** — extract skills, responsibilities, domain, keywords
3. **Run job-analysis** → `tech-stack.md` + `interview-prep.md`
4. **Select milestones** — balance depth and breadth
   - ~70% direct/transferable matches to JD requirements
   - ~30% standout contributions that show breadth (e.g., team scaling, build system innovation, cross-team testing, support excellence) — these catch the interviewer's eye and differentiate from other candidates
   - Prioritize: direct match > transferable > scale/impact > unique breadth
5. **Create summary** → `resumes/<company-name>/resume/summary.tex`
   - Emphasize job-matching skills, include ATS keywords
   - Include 1 breadth signal (e.g., product sense, team building, process improvement)
   - Follow **resume-content-rules**
6. **Create experience** → `resumes/<company-name>/resume/experience.tex`
   - **Start from GP text** — copy `resumes/general/resume/experience.tex` as base
   - **Reorder top-level bullet groups** for job relevance (safe, no page impact)
   - **Reorder QNAP top-level bullets** if relevant (performance-first vs product-first)
   - **Rewrite sub-bullets incrementally** — the layout is at the absolute 2-page limit. Rewrite one sub-bullet at a time and build-and-check after each change. If overflow, shorten that bullet before moving to the next.
   - Keep 1-2 breadth sub-bullets per role (70/30 rule)
   - Follow **resume-content-rules**, do NOT change titles/dates
7. **Build PDF** → `resumes/<company-name>/resume.pdf`
   - Follow **resume-pdf-check** (backup, build, restore, validate 2 pages)
8. **Generate presentation** → `resumes/<company-name>/interview-presentation.html`
   - Follow **interview-presentation** skill, customize for role
9. **Generate speech** → `resumes/<company-name>/interview-speech.md`
   - Follow **interview-speech** skill, emphasize job-relevant stories

---

## Customization Rules

| Element | Customizable | Notes |
|---------|-------------|-------|
| Summary | Yes | Rewrite freely — has margin room |
| Experience bullet order | Yes | Reorder top-level bullet groups (safe, no page impact) |
| Experience sub-bullet text | Yes | Rewrite incrementally — build-and-check after each change |
| Scholar | Shrink only | Auto-shrink via resume-pdf-check |
| Presentation | Yes | Reorder case studies, customize summary slide |
| Speech | Yes | Adjust emphasis and transitions |
| Education / Leadership | No | Never modify |
| Job titles/dates | No | Never modify |

### Tight Margin Constraint

The GP resume is at the **absolute 2-page limit**. LaTeX line-breaking is unpredictable — even same-character-count text rewrites can add an extra rendered line and push to 3 pages.

**Incremental rewrite workflow:**
1. Start from GP text (proven 2-page fit)
2. Reorder bullet groups first (safe, zero page impact)
3. Rewrite sub-bullets **one at a time**, building after each change
4. If a rewrite overflows, shorten that bullet (fewer words, shorter synonyms) until it fits
5. Move to the next sub-bullet only after the current one passes

### Depth vs Breadth (70/30 Rule)

Don't over-optimize for the JD. A resume that only mirrors the job posting looks generic and misses what makes a candidate memorable. Keep ~30% of content as standout breadth:

- **Product ownership** — scaling from 1 to 6 product variants, 5K monthly sales
- **Team building** — growing team from 2 to 5, cross-team SQA collaboration
- **Process innovation** — CI/CD pipelines, support SOPs, AI-assisted code review
- **Unique technical breadth** — kernel upgrades, build system redesign, gRPC architecture

These signal a well-rounded engineer who delivers beyond the narrow job scope.

### Tone Matching

- **Startup**: breadth, ownership, wearing many hats
- **Enterprise**: scale, process, cross-team collaboration
- **Storage/infra**: filesystem, kernel, performance metrics
- **Platform/DevOps**: CI/CD, build systems, automation
- **Senior/Staff**: leadership, mentoring, architecture

### ATS Optimization

- Mirror exact keywords from JD where truthful
- Spell out acronyms on first use if JD does
- Use standard section names

## Example Requests

| Request | Mode | Action |
|---------|------|--------|
| "update resume" | GP | Full pipeline → `resumes/general/` |
| "update presentation" | GP | Steps 5-6 → `resumes/general/` |
| "tailor resume for this job" + JD | Job | Full pipeline → `resumes/<company>/` |
| "analyze this job posting" + JD | Job | Steps 1-3 only (job-analysis) |
| "rebuild all tailored resumes" | Job | Loop `resumes/*/` and rebuild each |
