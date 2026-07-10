# 03 — Dedup tailor-resume ↔ resume-content-rules

**What to build:** `tailor-resume/SKILL.md` (L97-104, L195-200) currently restates the `\\` line-break formatting rule that already lives in full in `resume-content-rules` — a Rule Skill (see CONTEXT.md). Replace both restated blocks with a plain-text pointer (e.g. "See resume-content-rules for the `\\` line-break rule") — not an "Invoke Skill" call, since re-checking a rule doesn't warrant a fresh agent turn.

**Blocked by:** 02 (CONTEXT.md must define "Rule Skill" before this ticket's pointer text can cite it)

**Status:** ready-for-agent

- [ ] `tailor-resume/SKILL.md` L97-104 no longer restates the `\\` formatting rule; replaced with a plain-text pointer to `resume-content-rules`
- [ ] `tailor-resume/SKILL.md` L195-200 no longer restates the rule; replaced with a plain-text pointer to `resume-content-rules`
- [ ] Neither pointer is an "Invoke Skill" call
- [ ] Re-running `bash ~/.claude/skills/skill-audit/scripts/run.sh .claude/skills/tailor-resume` no longer reports the original inline-reasoning-duplication finding against `resume-content-rules`
