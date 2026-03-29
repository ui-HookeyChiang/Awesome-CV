# Editorial Warmth HTML Redesign

## Design
- Aesthetic: Editorial Warmth (warm cream, serif headings, magazine layout)
- Full spec: `.claude/skills/interview-presentation/references/html-design.md`
- SAR treatment: Subtle tinted backgrounds (rose/cream-blue/sage), no colored borders
- Modals: Keep modals, refine with editorial typography
- Source file: `src/present/interview-presentation.html` (on master, merged PRs #4-6)

## Tasks
- [>] 1. Implement editorial warmth redesign on interview-presentation.html
  - Files: src/present/interview-presentation.html
  - Design spec: .claude/skills/interview-presentation/references/html-design.md
  - Keep all content, cheat sheets, and interactive features intact
  - Change only CSS and visual presentation

## Fragment Extraction (Presentation Modularization)

- [x] Task 1: Create base.html shell
- [x] Task 2: Extract fixed slide fragments
- [x] Task 3: Extract card fragments
- [x] Task 4: Extract highlight + case study fragments
  - Created: highlights/ubiquiti.html, highlights/qnap.html
  - Created: case-studies/kernel-upgrade.html (8 cheat sheets), nas-stability.html (8 cheat sheets), samba-perf.html (7 cheat sheets)
- [x] Task 5: Create assembler + general.yaml
  - Created: profiles/general.yaml, assemble.js
  - Added js-yaml dependency to package.json
  - Assembles 11 slides, all template variables replaced
- [ ] Task 6: Validation — diff assembled vs original
