# 02 — Land CONTEXT.md glossary additions

**What to build:** Commit the two glossary terms already drafted and confirmed during the preceding grill session, currently sitting uncommitted in worktree `.worktree/grill-docs` on branch `docs/journal-pipeline-glossary`:

- **Journal Pipeline** — the single raw → refined → integrated stage sequence shared by `journal-integrate` and `journal-integrate-milestones`; both guard the same invariant (a stage only advances once all downstream consumers have processed it), which is why their completion checklists overlap.
- **Rule Skill** — a skill like `resume-content-rules` whose body is format/content constraints, referenced from other skills as a plain-text pointer, never an "Invoke Skill" delegation.

Tickets 03/04/05 use this vocabulary in their own descriptions and in the pointer text they land, so this ticket must land first.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `CONTEXT.md` has a **Journal Pipeline** entry under Automation Workflow
- [ ] `CONTEXT.md` has a **Rule Skill** entry under Automation Workflow
- [ ] Change is committed (not left uncommitted in the worktree)
