# Ticket: Rewrite `interview-presentation` as thin wrapper

Status: blocked-by
Spec: spec/html-deck-skills.md (Skill 3)
Depends on: 2026-08-03-skill-html-deck-design, 2026-08-03-skill-presentation-design

## Goal + why

`.claude/skills/interview-presentation/` currently owns SAR framework + visual
design + slide structure. Once the two new skills land, its styling/structure
sections become a second rule set that will drift. Cut it down to interview-only
content and delegate the rest.

## Deliverables

Rewrite SKILL.md:
- Keep: SAR framework, interview case selection, interview-safety nav notes
  (no auto-advance; manual control).
- Delegate: styling/tokens/mechanics → `html-deck-design`; density/narrative/
  jargon/fact-grounding → `presentation-design` (name them explicitly).
- Delete every rule now owned by the new skills — zero duplicated normative text.
- Update description: still triggers on interview-presentation.html work and
  tailor-resume dispatch; add NOT-clause pointing generic deck work to the
  two new skills.

## Acceptance criteria

- [ ] No styling/density rule text remains that also exists in the new skills
      (grep spot-check on token hexes, "one major element", radius values).
- [ ] tailor-resume orchestration reference still resolves (it names
      interview-presentation as sub-skill — flow must not break).

## allowed_files
`.claude/skills/interview-presentation/**` only.

## must_preserve / forbidden_changes
Do not edit tailor-resume or other sub-skills. No pushes to master.

## Rollback
`git checkout -- .claude/skills/interview-presentation/` on branch `html-deck-skills`.

## Report format
<200 words: sections kept/deleted, duplication grep result.
