# 04 — Dedup journal-integrate ↔ journal-integrate-milestones

**What to build:** `journal-integrate-milestones/SKILL.md` (L164-181) and `journal-integrate/SKILL.md` both currently spell out the same 18-line dual-completion checklist for the Journal Pipeline (see CONTEXT.md) — both wait on the other pipeline stage before advancing. Keep the full detailed checklist in `journal-integrate-milestones` (it already carries the fuller version). Replace `journal-integrate`'s copy with a plain-text pointer to "journal-integrate-milestones Step 5" — documentation dedup, not a runtime delegation, so no "Invoke Skill" call.

**Blocked by:** 02 (CONTEXT.md must define "Journal Pipeline" before this ticket's pointer text can cite it)

**Status:** ready-for-agent

- [ ] `journal-integrate-milestones/SKILL.md` retains its full dual-completion checklist unchanged
- [ ] `journal-integrate/SKILL.md`'s copy of the checklist is replaced with a plain-text pointer to "journal-integrate-milestones Step 5"
- [ ] The pointer is not an "Invoke Skill" call
- [ ] Re-running `bash ~/.claude/skills/skill-audit/scripts/run.sh .claude/skills/journal-integrate-milestones` no longer reports the original inline-reasoning-duplication finding against `journal-integrate`
