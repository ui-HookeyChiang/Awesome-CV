# Output Templates

## Tech Stack Report Template

Write to `resumes/<company-name>/tech-stack.md`:

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

## Interview Prep Guide Template

Write to `resumes/<company-name>/interview-prep.md`:

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

## Presentation Profile Template

Write to `resumes/<company-name>/presentation-profile.yaml`:

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
