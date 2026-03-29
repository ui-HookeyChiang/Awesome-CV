---
name: job-analysis
description: Analyze a job description and generate tech-stack report, interview prep guide, and presentation profile. Use whenever a JD or job posting is provided, when asked to analyze a role, research a company's tech stack, prepare for an interview, identify skill gaps, or compare qualifications against job requirements. Even if the user just pastes a job link or description without explicit instructions, use this skill to analyze it.
---

# Job Analysis

Use this skill to analyze a job description and produce three outputs under `resumes/<company-name>/`: tech-stack report, interview prep guide, and presentation profile YAML. Called by **tailor-resume** as Steps 2-4, or independently.

## Inputs

- `resumes/<company-name>/job-description.md` — the job posting
- `milestone/summary.md`, `milestone/ubiquiti.md`, `milestone/qnap.md` — for overlap analysis
- `src/present/fragments/` — fragment frontmatter for presentation profile generation (Step 4)

## Step 1: Extract from JD

Read the job description and extract:

1. **Required skills** — languages, tools, frameworks, platforms
2. **Key responsibilities** — what the role does day-to-day
3. **Seniority signals** — leadership, mentoring, architecture, scale
4. **Domain focus** — storage, networking, embedded, cloud, etc.
5. **Keywords** — terms for ATS matching

## Step 1.5: Company & Product Research

Use a **subagent** (Task tool with `subagent_type=general-purpose`) to research the company in parallel with Step 1. The subagent should use WebSearch to:

1. **Identify the team/product** this role belongs to — use the job title, team name, and domain clues from the JD
2. **Research recent company activity** — search for recent blog posts, engineering talks, open-source projects, press releases, and product announcements related to the role's domain
3. **Speculate on internal tech stack** — based on job postings, engineering blog posts, conference talks, GitHub repos, and industry knowledge, infer:
   - Programming languages and frameworks likely used internally
   - Infrastructure and platform choices (cloud provider, container orchestration, CI/CD)
   - Internal tools or proprietary systems hinted at in the JD
   - Open-source projects the team contributes to or depends on
4. **Identify the product landscape** — what products/services does this team likely build or maintain? What are the competitive alternatives?
5. **Find team culture signals** — engineering blog posts, team size indicators, development methodology clues

The subagent should return a structured summary that gets incorporated into the tech-stack report (see Step 2).

## Step 2: Generate Tech Stack Report

Write `resumes/<company-name>/tech-stack.md`:

```markdown
# Tech Stack Report: <Company> — <Role>

## Role Summary
- One-paragraph description of what this role does

## Product & Team Context
- **Product/Service**: What the team likely builds or maintains
- **Competitive Landscape**: Key competitors and alternatives
- **Recent Activity**: Notable launches, blog posts, talks, or open-source contributions
- **Team Signals**: Estimated team size, development methodology, engineering culture

## Core Tech Stack (JD + Research)
| Category | Technologies | Confidence |
|----------|-------------|------------|
| Languages | C, Go, Python, ... | From JD |
| OS/Platform | Linux, ARM64, ... | From JD |
| Storage | Btrfs, ZFS, ... | From JD / Inferred |
| Networking | TCP/IP, gRPC, ... | From JD / Inferred |
| Tools | Git, Docker, Jenkins, ... | From JD |
| Infra | Kubernetes, Borg, ... | Research |
| Internal | [proprietary systems hinted at] | Research |

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

- Mark **Confidence** as "From JD" (explicitly stated), "Inferred" (deduced from JD context), or "Research" (discovered via company research in Step 1.5)
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

## Step 4: Generate Presentation Profile

Write `resumes/<company-name>/presentation-profile.yaml` — a profile for the fragment-based presentation assembler.

### How to select content

1. **Read all fragment frontmatter** — run `grep -r "^<!-- fragment:" src/present/fragments/` to discover available fragment IDs, tags, domains, and metrics
2. **Use your judgment** from Steps 1-3 to select content that best demonstrates JD-required skills:
   - **Case studies** (pick 3): which SAR stories most directly address the JD's core requirements? Order by relevance (strongest match first)
   - **Skills** (pick 4): reorder skill cards so the most JD-relevant appears first
   - **Achievements** (pick 2): reorder achievement cards by JD relevance
   - **Suppress**: identify achievement bullets whose `data-id` overlaps with a selected case study (e.g., if `samba-perf` is selected, suppress `samba-throughput`)
   - **Cover tagline**: craft from JD keywords — what value does this role need?
   - **Summary tagline**: align with JD's domain emphasis
   - **Strengths** (pick 3): choose from JD emphasis areas (e.g., Performance, Scalability, Reliability, Infrastructure, Automation, Security, Leadership)

### Output format

```yaml
name: <Company> <Role>
description: Auto-generated from JD analysis on <date>
derived_from: general

cover:
  tagline: "<JD-aligned value proposition>"

summary:
  tagline: "<JD-aligned professional identity>"
  strengths: [<strength-1>, <strength-2>, <strength-3>]

skills: [<4 skill fragment IDs, reordered by JD relevance>]
highlights: [ubiquiti, qnap]
case-studies: [<3 case study fragment IDs, ranked by JD relevance>]
achievements: [<2 achievement fragment IDs, reordered>]

suppress: [<data-ids of achievement bullets that overlap with selected case studies>]
```

### Suppression reference

When a case study is selected, suppress these overlapping achievement bullets:

| Case Study | Suppress |
|---|---|
| `kernel-upgrade` | (no direct overlap in current achievements) |
| `nas-stability` | (no direct overlap in current achievements) |
| `samba-perf` | `samba-throughput` |

Update this table as new case studies and achievements are added to the fragment pool.

### After writing the profile

The profile is consumed by `node src/present/assemble.js <profile-name>` to generate the tailored presentation HTML. This is called by the **tailor-resume** orchestrator (Step 9), not by job-analysis directly.
