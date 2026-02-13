---
name: job-analysis
description: Analyze a job description and generate tech-stack report and interview prep guide. Use when a JD is provided or when asked to analyze a job posting.
---

# Job Analysis

Use this skill to analyze a job description and produce two reports under `resumes/<company-name>/`. Called by **tailor-resume** as Steps 2-4, or independently.

## Inputs

- `resumes/<company-name>/job-description.md` — the job posting
- `milestone/summary.md`, `milestone/ubiquiti.md`, `milestone/qnap.md` — for overlap analysis

## Step 1: Extract from JD

Read the job description and extract:

1. **Required skills** — languages, tools, frameworks, platforms
2. **Key responsibilities** — what the role does day-to-day
3. **Seniority signals** — leadership, mentoring, architecture, scale
4. **Domain focus** — storage, networking, embedded, cloud, etc.
5. **Keywords** — terms for ATS matching

## Step 2: Generate Tech Stack Report

Write `resumes/<company-name>/tech-stack.md`:

```markdown
# Tech Stack Report: <Company> — <Role>

## Role Summary
- One-paragraph description of what this role does

## Core Tech Stack
| Category | Technologies | Confidence |
|----------|-------------|------------|
| Languages | C, Go, Python, ... | From JD |
| OS/Platform | Linux, ARM64, ... | From JD |
| Storage | Btrfs, ZFS, ... | From JD / inferred |
| Networking | TCP/IP, gRPC, ... | From JD / inferred |
| Tools | Git, Docker, Jenkins, ... | From JD |

## Day-to-Day Work (Inferred)
What you'll likely spend time on, grouped by frequency:
- **Daily**: [code review, debugging, ...]
- **Weekly**: [design discussions, testing, ...]
- **Monthly**: [releases, planning, ...]

## Domain Knowledge Required
Key technical domains and depth expected:
- [Domain 1]: [brief description of expected depth]
- [Domain 2]: ...

## My Overlap
| JD Requirement | My Experience | Strength |
|---------------|---------------|----------|
| [requirement] | [matching milestone] | Strong / Moderate / Gap |
```

- Mark **Confidence** as "From JD" (explicitly stated) or "Inferred" (deduced from context)
- Cross-reference milestones to fill the "My Overlap" table

## Step 3: Generate Interview Prep Guide

Write `resumes/<company-name>/interview-prep.md`:

```markdown
# Interview Preparation: <Company> — <Role>

## Skill Gap Analysis
Areas where JD requirements exceed current resume coverage:
| Area | JD Expects | My Level | Priority |
|------|-----------|----------|----------|
| [skill] | [expected depth] | [current level] | High/Medium/Low |

## Technical Review Areas

### Must Review (High Priority)
Topics explicitly required or heavily emphasized in the JD:
- **[Topic]**: [what to review, specific concepts]
  - Resources: [book chapters, docs, man pages, RFCs]

### Should Review (Medium Priority)
Topics mentioned or implied by the role:
- **[Topic]**: [what to review]
  - Resources: [links, docs]

### Nice to Know (Low Priority)
Topics that give an edge but aren't required:
- **[Topic]**: [what to review]

## Likely Interview Questions
Based on the JD and role level, expect questions on:

### System Design
- [Example question 1 relevant to role]
- [Example question 2]

### Coding / Problem Solving
- [Expected focus: algorithms, systems programming, debugging, ...]

### Behavioral / Leadership
- [Topics: team scaling, conflict resolution, mentoring, ...]

### Domain-Specific
- [Questions specific to the tech stack / domain]

## My Talking Points
Strongest stories to prepare from milestones, mapped to JD requirements:
| JD Requirement | Story (SAR) | Source |
|---------------|-------------|--------|
| [requirement] | [one-line SAR summary] | milestone/ubiquiti.md §X |

## Study Timeline
Suggested review order if time is limited:
1. [Most critical topic] — [estimated hours]
2. [Next topic] — [estimated hours]
3. ...
```

- Prioritize gaps — areas the JD demands but milestones don't fully cover
- Pick 3-5 best SAR stories for "My Talking Points"
