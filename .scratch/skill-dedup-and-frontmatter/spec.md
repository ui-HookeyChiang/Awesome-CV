# Spec: .claude/skills dedup and frontmatter fix

## Problem Statement

The user ran a skill-audit across the 10 skills under `.claude/skills/`. It surfaced two kinds of issues:

- As a user of `tailor-resume` and `journal-integrate-milestones`, when I open the SKILL.md I re-read a rule or checklist that's already stated in full in another skill (`resume-content-rules`, `journal-integrate`), so I can't tell which copy is authoritative and any future edit to the rule risks going stale in one copy but not the other.
- As a user of `interview-presentation`, `job-analysis`, and `sar-extraction`, the reference files under their `references/` directories have no frontmatter at all, so the plugin index can't group them under a `landing-group` and skill tooling that reads `name`/`description` from reference files gets nothing.
- As a user of `sar-extraction`, the SKILL.md body is padded with two full HTML cheat-sheet templates that I only consult occasionally when writing a SAR card, not on every invocation — this bloats the body I have to re-read every time.

## Solution

Deduplicate the two confirmed cross-skill overlaps by replacing the restated copy with a plain-text pointer to the authoritative skill. Extract the two cheat-sheet templates out of `sar-extraction/SKILL.md` into a new `references/cheat-sheet-templates.md`, following the existing `references/preview-fragment.md` pattern already used in that skill. Add missing frontmatter (`name`, `description`, `landing-group: resume`) to the 4 existing reference files that lack it, and to the new `cheat-sheet-templates.md` file from creation.

Two new terms were confirmed and added to `CONTEXT.md` during a grill session preceding this spec: **Journal Pipeline** (the single raw → refined → integrated stage sequence shared by `journal-integrate` and `journal-integrate-milestones`) and **Rule Skill** (a skill like `resume-content-rules` whose body is format/content constraints referenced as a plain-text pointer, never an "Invoke Skill" delegation). Those glossary additions live in worktree `.worktree/grill-docs` on branch `docs/journal-pipeline-glossary`, uncommitted, and should land in the same PR as (or immediately before) these fixes since the tickets below use that vocabulary.

## User Stories

1. As a maintainer of `tailor-resume`, I want the `\\` line-break formatting rule replaced with a pointer to `resume-content-rules`, so that the rule has exactly one authoritative copy.
2. As a maintainer of `journal-integrate`, I want its dual-completion checklist replaced with a pointer to `journal-integrate-milestones` Step 5, so that the detailed checklist has exactly one authoritative copy.
3. As a maintainer of `journal-integrate-milestones`, I want to keep the full 18-line dual-completion checklist in my SKILL.md, so that the Journal Pipeline invariant stays documented in one place.
4. As a maintainer of `sar-extraction`, I want the two verbatim HTML cheat-sheet templates moved out of SKILL.md into `references/cheat-sheet-templates.md`, so that the SKILL.md body only contains content read on every invocation.
5. As a maintainer of `sar-extraction`, I want a short pointer left inline at the original template location, so that a reader following the SKILL.md top-to-bottom still discovers the templates exist.
6. As a maintainer of `interview-presentation`, I want `references/storage-engineering.md` and `references/visual-design.md` to have `name`/`description`/`landing-group` frontmatter, so that skill tooling and the plugin index can read their metadata.
7. As a maintainer of `job-analysis`, I want `references/output-templates.md` to have frontmatter, so that it's consistent with the rest of the skill's reference files.
8. As a maintainer of `sar-extraction`, I want `references/preview-fragment.md` to have frontmatter, so that it matches the pattern the new `cheat-sheet-templates.md` file will also follow.
9. As a maintainer of `sar-extraction`, I want the new `references/cheat-sheet-templates.md` to have frontmatter from the moment it's created, so that it never has the gap the other 4 files had.
10. As a maintainer of any of these 5 skills, I want `landing-group: resume` used consistently, so that it matches the value already set on the parent SKILL.md (confirmed via `rg landing-group` across all 10 skills: `workflow` for `journal-*` skills, `resume` for resume/interview-* skills).
11. As the person reviewing this change, I want to re-run the skill-audit deterministic leg (`bash scripts/run.sh <skill-dir>`) on each touched skill after its fix lands, so that I can confirm the original finding is gone without a manual re-read of the whole file.
12. As a future contributor reading `CONTEXT.md`, I want the Journal Pipeline and Rule Skill terms available, so that I don't reintroduce the same "two pipelines" or "invoke as procedure" confusion the grill session resolved.

## Implementation Decisions

- **Pointer format**: a plain-text reference (e.g. "See resume-content-rules for the `\\` line-break rule" / "See journal-integrate-milestones Step 5 for the full dual-completion checklist") — never an "Invoke Skill X" call. Both overlaps are Rule-Skill-style or documentation-only dedup, not runtime delegation; replacing them with an actual skill invocation would add an agent turn where a static reference is all that's needed.
- **Which copy is authoritative**: `resume-content-rules` for the `\\` formatting rule (it is the dedicated Rule Skill); `journal-integrate-milestones` for the dual-completion checklist (it already carries the fuller 18-line version; `journal-integrate` gets the pointer).
- **New reference file**: `sar-extraction/references/cheat-sheet-templates.md`, structured the same way as the existing `sar-extraction/references/preview-fragment.md` in that skill (frontmatter block, then the template content verbatim as moved from SKILL.md).
- **Frontmatter shape** for all 5 reference files (4 existing + 1 new): `name`, `description`, `landing-group: resume`. `name`/`description` are per-file, written to describe that file's actual content (no shared template value).
- **No runtime/code changes**: every change in this spec is to `.md` files under `.claude/skills/`. No script, no assembler, no `.tex` file is touched.
- **CONTEXT.md**: the two glossary additions (Journal Pipeline, Rule Skill) already made during the preceding grill session should ship in the same change set, since ticket descriptions and future readers rely on that vocabulary existing.

## Testing Decisions

There is no runtime behavior to exercise — every change is a documentation/skill-file edit. The single verification seam for all 4 fixes is: re-run the skill-audit deterministic leg after each fix —

```
bash ~/.claude/skills/skill-audit/scripts/run.sh <skill-dir>
```

— on the touched skill directory, and confirm the specific finding that motivated the fix (S1 chained-command finding is unrelated and out of scope; look at the G1/G8/frontmatter findings from the original audit) no longer appears in that skill's `## semantic` / `## syntax` output. This is prior art from the audit session itself — the same script already ran cleanly against all 10 skills and is the source of every finding in this spec.

No new test files, no assertions beyond this script's own findings output.

## Out of Scope

- The prose-compression (`prose-guidelines`) findings from the audit (ratio-based rewrite suggestions in `host-work-journal`, `interview-presentation`, `journal-integrate-milestones`) — those are separate, lower-priority, purely stylistic and not part of this spec.
- Any G1/G8 candidate that was REJECTED during the audit's probabilistic leg (e.g. `interview-presentation` L147-171, `journal-integrate-milestones` L172-181, `sar-extraction` L51-60) — confirmed as correctly-inline content, no action.
- Any change to skill trigger descriptions, routing, or `Skill` tool behavior.
- Any change to `assemble.js` or the Fragment assembly pipeline — the cheat-sheet templates were confirmed during grill to NOT be Fragments and are never consumed by the assembler.

## Further Notes

This spec follows a `grill-with-docs` session that resolved 4 open questions against `CONTEXT.md` before the spec was written:

1. Confirmed the Journal Pipeline is a single pipeline with one shared invariant restated in two skills, not two separate pipelines.
2. Confirmed `resume-content-rules` is a Rule Skill — referenced as a pointer, not invoked as a procedure.
3. Confirmed the sar-extraction cheat-sheet templates are writing-aid material, not Fragments (never touched by `assemble.js`).
4. Confirmed `landing-group: resume` is the correct value by surveying existing frontmatter values across all 10 skills with `rg landing-group`.

No issue tracker was configured for this repo (`/setup-matt-pocock-skills` was not run) — tickets from the companion `/to-tickets` pass will be written as local files under `.scratch/skill-dedup-and-frontmatter/issues/`.
