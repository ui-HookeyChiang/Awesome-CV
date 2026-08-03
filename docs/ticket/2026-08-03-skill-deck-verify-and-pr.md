# Ticket: Verify deck skills + land PR

Status: blocked-by
Spec: spec/html-deck-skills.md (Delivery + acceptance row 9)
Depends on: all three authoring tickets

## Goal + why

Adversarial + rebuild verification of the three skill changes, then one PR on
branch `html-deck-skills`. Prevents shipping skills that recreate the drift they
exist to stop.

## Steps

1. skill-audit + verify-skill over both new skills and the rewritten wrapper —
   no BLOCK-level findings (fix or escalate).
2. Rebuild verification: using ONLY the new skills, regenerate 3–5 sample slides
   of the PR-1235 Prompt-Hub deck (source:
   `~/Downloads/pr-1235-prompt-hub-slides.html`); visually compare against
   `resumes/general/interview-presentation.html` — tokens, radii, borders,
   typography must match reference defaults.
3. dataviz conflict check: diff chart/color guidance line-by-line against the
   dataviz skill; confirm NOT-clauses carve cleanly, no contradicting rules.
4. Symlink install: `ln -s` both new skill dirs into `~/.claude/skills/`
   (outside repo; document the command in PR body instead of committing links).
5. PR: branch `html-deck-skills` → master. Include spec/html-deck-skills.md +
   docs/ticket/*. Body lists acceptance evidence. **Never push master; never
   merge without explicit user consent.**

## Acceptance criteria

- [ ] Audit reports attached, zero unresolved BLOCK.
- [ ] Sample slides screenshot/side-by-side confirms token alignment.
- [ ] dataviz check documented (list of compared rules).
- [ ] PR open, CI (if any) green.

## allowed_files
Read-heavy; writes limited to fix-ups inside `.claude/skills/**` and PR metadata.

## Rollback
Close PR; delete branch `html-deck-skills`.

## Report format
<200 words: audit verdicts, rebuild diff summary, PR URL.
