# Ticket: Author `presentation-design` skill

Status: ready
Spec: spec/html-deck-skills.md (Skill 2)
Depends on: none (parallel with html-deck-design)

## Goal + why

Create `.claude/skills/presentation-design/` — the content-side skill for slide
decks: per-slide density, narrative, jargon discipline, fact-grounding. Distills
user-confirmed rules from the PR-1235 deck's 3 review rounds; persisted nowhere else.

## Deliverables

`SKILL.md` (via skill-writer route) encoding:

1. One major element per slide (table OR diagram OR keyword-card row OR code-box
   OR big statement). Composite exception: diagram + ≤3 label cards ≤14 CJK chars.
   One-line takeaway captions allowed.
2. Keyword-first: ≤~40 CJK chars visible per card; overflow → speaker notes.
   Every slide gets a notes entry; file-path citations notes-only.
3. Tables >5 rows split into progressive slides; never nest table inside card.
4. Act structure with act tags; one real anchor demo set up early and revisited —
   never abandoned 10+ slides.
5. Jargon discipline: kill invented abbreviations; first-use inline gloss for
   kept terms; ≤8-term glossary appendix.
6. Fact-grounding workflow: audit every claim against source-of-truth files
   BEFORE styling; honest status labels (已出貨 / 待辦 / 證據不足); never present
   unshipped as shipped.
7. Pacing ~40–60s per slide; split beats compress.
8. Language: deck body zh-Hant; technical identifiers stay English.

Description triggers on deck/slides/簡報 creation-or-edit.
NOT-clauses: NOT docs/README/demo scripts/talks (→ prose-guidelines /
interview-speech); NOT visual tokens/mechanics (→ html-deck-design).

## Acceptance criteria

- [ ] All 8 rules present, each with its exception/boundary intact
      (composite exception, glossary cap, notes-only citations).
- [ ] Description trigger mutually exclusive with html-deck-design,
      interview-speech, prose-guidelines.

## allowed_files
`.claude/skills/presentation-design/**` only.

## must_preserve / forbidden_changes
No other paths. No pushes to master.

## Rollback
`git checkout -- .claude/skills/presentation-design/` on branch `html-deck-skills`.

## Report format
<200 words: file created, rule count, trigger-overlap check result.
