# 01 — Add frontmatter to interview-presentation and job-analysis reference files

**What to build:** `interview-presentation/references/storage-engineering.md`, `interview-presentation/references/visual-design.md`, and `job-analysis/references/output-templates.md` currently have no frontmatter at all. Add `name`, `description`, and `landing-group: resume` to each — `landing-group: resume` matches the value already set on both skills' parent SKILL.md (confirmed via `rg landing-group` across all 10 skills: `resume` for resume/interview-* skills, `workflow` for journal-* skills). `name`/`description` are per-file, written to describe that file's actual content — no shared template value.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `interview-presentation/references/storage-engineering.md` has `name`, `description`, `landing-group: resume` frontmatter
- [ ] `interview-presentation/references/visual-design.md` has `name`, `description`, `landing-group: resume` frontmatter
- [ ] `job-analysis/references/output-templates.md` has `name`, `description`, `landing-group: resume` frontmatter
- [ ] Re-running `bash ~/.claude/skills/skill-audit/scripts/run.sh <skill-dir>` on `interview-presentation` and `job-analysis` no longer reports the frontmatter-missing findings (F1/F2/F3) for these 3 files
