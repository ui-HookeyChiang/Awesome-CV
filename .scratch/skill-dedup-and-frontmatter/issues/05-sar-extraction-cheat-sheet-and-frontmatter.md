# 05 — sar-extraction: extract cheat-sheet templates + backfill preview-fragment.md frontmatter

**What to build:** `sar-extraction/SKILL.md` (L105-119) contains two verbatim HTML cheat-sheet templates — writing-aid material consulted occasionally when authoring a SAR card, confirmed during grill to NOT be a Fragment (never consumed by `assemble.js`, see CONTEXT.md). Move both templates into a new `sar-extraction/references/cheat-sheet-templates.md`, following the existing `sar-extraction/references/preview-fragment.md` pattern in the same skill (frontmatter block, then template content verbatim). Leave a short pointer inline in SKILL.md at the original location. While touching this skill's `references/` directory, also backfill frontmatter (`name`, `description`, `landing-group: resume`) on the existing `references/preview-fragment.md`, which currently has none.

**Blocked by:** 02 (CONTEXT.md must confirm the "not a Fragment" distinction is documented before this ticket moves the templates out)

**Status:** ready-for-agent

- [ ] `sar-extraction/SKILL.md` L105-119's two HTML cheat-sheet templates are removed from the body
- [ ] New file `sar-extraction/references/cheat-sheet-templates.md` contains both templates verbatim, with `name`, `description`, `landing-group: resume` frontmatter from creation
- [ ] `sar-extraction/SKILL.md` has a short inline pointer at the original template location directing to `references/cheat-sheet-templates.md`
- [ ] `sar-extraction/references/preview-fragment.md` gains `name`, `description`, `landing-group: resume` frontmatter (previously missing)
- [ ] Re-running `bash ~/.claude/skills/skill-audit/scripts/run.sh .claude/skills/sar-extraction` no longer reports the original G8 "belongs in references/" finding for L105-119, nor the frontmatter-missing findings for `preview-fragment.md`
