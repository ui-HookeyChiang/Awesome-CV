---
name: tailor-resume
description: Orchestrator for generating tailor-made resumes, presentations, and speech scripts. Supports job-targeted (with JD) and general-purpose (without JD) modes. All output under resumes/. Use when asked to tailor, update, rebuild, or refresh a resume, presentation, or speech script. Also use when the user says "update resume", "refresh resume", "tailor for this job", "customize CV", or provides a job description and expects a complete application package. This is the top-level skill that coordinates sub-skills (job-analysis, resume-content-rules, resume-pdf-check, interview-presentation, interview-speech).
---

# Tailor-Made Resume & Presentation Generator

Orchestrator skill that coordinates sub-skills to produce a complete application package. Supports two modes:

- **Job-targeted** — JD provided; optimize for that specific role
- **General-purpose** — no JD; refresh from latest milestones

All output goes under `resumes/`.

## Sub-Skills

| Skill | When Used | Purpose |
|-------|-----------|---------|
| **job-analysis** | Job-targeted only | JD analysis → `tech-stack.md` + `interview-prep.md` + `presentation-profile.yaml` |
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
    ├── presentation-profile.yaml    # From job-analysis (auto-generated, editable)
    ├── resume/                      # All 5 .tex files (summary, experience, education, scholar, leadership)
    ├── resume.pdf
    ├── interview-presentation.html
    └── interview-speech.md
```

## Source Files

| File | Purpose |
|------|---------|
| `src/resume/*.tex` | **Canonical GP resume** (all 5 .tex files) — edit here |
| `src/present/fragments/` | Presentation HTML fragments (assembled by `assemble.js`) |
| `src/present/profiles/general.yaml` | Default presentation profile |
| `src/present/assemble.js` | Fragment assembler: `node assemble.js <profile> [--output <path>]` |
| `milestone/*.md` | Achievement data |

**Important:** `src/resume/` is the canonical location for all GP .tex files and also the build directory (`cd src && xelatex resume.tex`). No sync step needed. For job-targeted builds, the backup/copy/restore procedure in **resume-pdf-check** handles this automatically.

---

## General-Purpose Pipeline

1. **Read** milestone files + current `src/resume/*.tex` (canonical GP)
2. **Create summary** → `src/resume/summary.tex`
   - Refresh from milestones, keep general-purpose, use "OS Engineer" framing (Linux, performance, storage)
   - Use `\\` after each sentence (except last) per **resume-content-rules** rule #6
   - Follow **resume-content-rules**
3. **Create experience** → `src/resume/experience.tex`
   - Update bullets with latest achievements, order by impact
   - Follow **resume-content-rules**, do NOT change titles/dates
4. **Build PDF** → `cd src && xelatex resume.tex` → `src/resume.pdf`
   - Follow **resume-pdf-check** (validate 2 pages, no overfull/underfull warnings)
   - Always generate the PDF after any .tex change — the PDF is the deliverable
   - `resumes/general/resume.pdf` is a symlink to `src/resume.pdf` — no copy needed
5. **Generate presentation** → `resumes/general/interview-presentation.html`
   - Use the fragment assembler: `cd src/present && node assemble.js general --output ../../resumes/general/interview-presentation.html`
   - Follow **interview-presentation** skill for content guidelines
6. **Generate speech** → `resumes/general/interview-speech.md`
   - Follow **interview-speech** skill, derive from presentation

---

## Job-Targeted Pipeline

```
mkdir -p resumes/<company-name>/resume
```

1. **Save JD** → `resumes/<company-name>/job-description.md`
2. **Analyze JD** — extract skills, responsibilities, domain, keywords
3. **Run job-analysis** → `tech-stack.md` + `interview-prep.md` + `presentation-profile.yaml`
4. **Select milestones** — balance depth and breadth
   - ~70% direct/transferable matches to JD requirements
   - ~30% standout contributions that show breadth (e.g., team scaling, build system innovation, cross-team testing, support excellence) — these catch the interviewer's eye and differentiate from other candidates
   - Prioritize: direct match > transferable > scale/impact > unique breadth
5. **Copy shared files** — copy education.tex, scholar.tex, leadership.tex from GP:
   ```bash
   cp src/resume/{education,scholar,leadership}.tex resumes/<company-name>/resume/
   ```
6. **Create summary** → `resumes/<company-name>/resume/summary.tex`
   - Emphasize job-matching skills, include ATS keywords
   - Include 1 breadth signal (e.g., product sense, team building, process improvement)
   - **Must use exactly 4 lines with `\\`** matching GP structure (3-line summaries cause overflow)
   - `\\` only between sentences — never between clauses of the same sentence
   - Follow **resume-content-rules**
7. **Create experience** → `resumes/<company-name>/resume/experience.tex`
   - **Start from GP text** — copy `src/resume/experience.tex` as base
   - **Reorder top-level bullet groups** for job relevance — but always build-verify after (reordering can change rendered line counts)
   - **Reorder QNAP top-level bullets** if relevant (performance-first vs product-first)
   - **Rewrite sub-bullets incrementally** — the layout is at the absolute 2-page limit. Rewrite one sub-bullet at a time and build-and-check after each change. If overflow, shorten that bullet before moving to the next.
   - Keep 1-2 breadth sub-bullets per role (70/30 rule)
   - Follow **resume-content-rules**, do NOT change titles/dates
8. **Build PDF** → `resumes/<company-name>/resume.pdf`
   - Follow **resume-pdf-check** (backup, build, restore, validate 2 pages)
9. **Generate presentation** → `resumes/<company-name>/interview-presentation.html`
   - Use the profile from job-analysis Step 4: `resumes/<company-name>/presentation-profile.yaml`
   - Copy profile to assembler: `cp resumes/<company-name>/presentation-profile.yaml src/present/profiles/<company-name>.yaml`
   - Assemble: `cd src/present && node assemble.js <company-name> --output ../../resumes/<company-name>/interview-presentation.html`
   - Review the generated profile before assembling — adjust selections if needed
   - Follow **interview-presentation** skill for content guidelines
10. **Generate speech** → `resumes/<company-name>/interview-speech.md`
   - Follow **interview-speech** skill, emphasize job-relevant stories

---

## Customization Rules

| Element | Customizable | Notes |
|---------|-------------|-------|
| Summary | Yes | Rewrite freely — has margin room |
| Experience bullet order | Yes | Reorder top-level bullet groups (safe, no page impact) |
| Experience sub-bullet text | Yes | Rewrite incrementally — build-and-check after each change |
| Scholar | Copy from GP | Currently 2 entries; auto-shrink via resume-pdf-check if overflow |
| Presentation | Yes | Reorder case studies, customize summary slide |
| Speech | Yes | Adjust emphasis and transitions |
| Education / Leadership | No | Never modify |
| Job titles/dates | No | Never modify |

### Tight Margin Constraint

The GP resume is at the **absolute 2-page limit**. LaTeX line-breaking is unpredictable — even same-character-count text rewrites can add an extra rendered line and push to 3 pages. Adding `\\` to summaries also adds vertical space — if it causes overflow, shorten sentences rather than removing `\\`.

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
- **Unique technical breadth** — dual filesystem backends (Btrfs+ZFS), gRPC migration, build system revamp

These signal a well-rounded engineer who delivers beyond the narrow job scope.

### Tone Matching

- **Startup**: breadth, ownership, wearing many hats
- **Enterprise**: scale, process, cross-team collaboration
- **OS/Storage/infra**: Linux internals, filesystem, kernel, performance metrics
- **Platform/DevOps**: CI/CD, build systems, automation
- **Senior/Staff**: leadership, mentoring, architecture

### Identity Consistency

When the GP resume identity changes (e.g., "OS Engineer" instead of "Firmware Engineer"), propagate to **all** artifacts:
- `milestone/summary.md` title
- Presentation tagline (slide 10) and metric labels
- Speech script opening and closing
- All job-targeted resume summaries (re-derive from GP)

### ATS Optimization

- Mirror exact keywords from JD where truthful
- Spell out acronyms on first use if JD does
- Use standard section names

## Keeping Job-Targeted Resumes in Sync

When the GP resume is updated (quality fixes, milestone refreshes), **all job-targeted resumes become stale** because they were derived from the old GP text. To refresh:

1. **Copy shared files from GP** — education.tex, scholar.tex, leadership.tex from `src/resume/`
2. **Start from latest GP** `src/resume/experience.tex` as base
3. **Re-apply job-specific bullet reordering** — but build-verify after (reordering can change rendered lines)
4. **Re-apply any sub-bullet rewrites** that were job-specific, incrementally with build checks
5. **Update summary** — match GP's 4-line `\\` structure, customize line 2 for JD focus
6. **Rebuild and verify** 2 pages for each

Do NOT try to patch old job-targeted text — always re-derive from current GP to pick up all quality fixes.

## Example Requests

| Request | Mode | Action |
|---------|------|--------|
| "update resume" | GP | Full pipeline → `resumes/general/` |
| "update presentation" | GP | Steps 5-6 → `resumes/general/` |
| "tailor resume for this job" + JD | Job | Full pipeline → `resumes/<company>/` |
| "analyze this job posting" + JD | Job | Steps 1-3 only (job-analysis) |
| "rebuild all tailored resumes" | Job | Loop `resumes/*/` and rebuild each |
