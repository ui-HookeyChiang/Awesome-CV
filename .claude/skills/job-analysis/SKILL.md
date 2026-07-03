---
name: job-analysis
landing-group: resume
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

Write `resumes/<company-name>/tech-stack.md` using the template in `references/output-templates.md` § Tech Stack Report Template.

## Step 3: Generate Interview Prep Guide

Write `resumes/<company-name>/interview-prep.md` using the template in `references/output-templates.md` § Interview Prep Guide Template.

- Prioritize gaps — areas the JD demands but milestones don't fully cover
- Pick 3-5 best SAR stories for "My Talking Points"

## Step 4: Generate Presentation Profile

Write `resumes/<company-name>/presentation-profile.yaml` — a profile for the fragment-based presentation assembler.

### Fragment Frontmatter Schema

Each fragment in `src/present/fragments/` includes YAML frontmatter with these fields:

```yaml
id: string          # fragment filename without extension
type: case-study | skill | achievement | highlight
tags: string[]      # keyword matches for JD terms
domain: string      # broad technical domain
metrics: string[]   # quantified results for emphasis
source: string      # milestone path for provenance
```

### How to discover fragments

Run the assembler's list command to get JSON metadata for all fragments with parsed frontmatter:

```bash
node src/present/assemble.js --list-fragments
```

### How to match JD requirements to fragments

1. **Extract key technical terms** from the JD (e.g., "Linux kernel", "performance tuning", "ZFS")
2. **Compare against fragment `tags`** arrays in the listing output
3. **Select fragments where >= 2 tags match** JD terms
4. **Prioritize fragments with `metrics`** that align with JD emphasis areas (e.g., if the JD stresses performance, prefer fragments with throughput/latency metrics)

### How to select content

1. **Read all fragment frontmatter** — run `node src/present/assemble.js --list-fragments` to discover available fragment IDs, tags, domains, and metrics
2. **Use your judgment** from Steps 1-3 to select content that best demonstrates JD-required skills:
   - **Case studies** (pick 3): which SAR stories most directly address the JD's core requirements? Order by relevance (strongest match first)
   - **Skills** (pick 4): reorder skill cards so the most JD-relevant appears first
   - **Achievements** (pick 2): reorder achievement cards by JD relevance
   - **Suppress**: identify achievement bullets whose `data-id` overlaps with a selected case study (e.g., if `samba-perf` is selected, suppress `samba-throughput`)
   - **Cover tagline**: craft from JD keywords — what value does this role need?
   - **Summary tagline**: align with JD's domain emphasis
   - **Strengths** (pick 3): choose from JD emphasis areas (e.g., Performance, Scalability, Reliability, Infrastructure, Automation, Security, Leadership)

### Output format and suppression table

See `references/output-templates.md` § Presentation Profile Template for the YAML schema and suppression reference table.

### After writing the profile

The profile is consumed by `node src/present/assemble.js <profile-name>` to generate the tailored presentation HTML. This is called by the **tailor-resume** orchestrator (Step 9), not by job-analysis directly.
