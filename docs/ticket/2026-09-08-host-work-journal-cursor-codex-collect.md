# Ticket: host-work-journal Cursor + Codex session collection

Status: done

## Description

`host-work-journal` collects Claude Code and OpenCode sessions but not Cursor
or Codex. Both store local transcripts that should feed the same journal
pipeline.

Depends on: `2026-09-08-host-work-journal-restore-collector` (collector must
be a real file first).

## Data sources

| Source | Path | Date key | Project key | Prompt unit |
|--------|------|----------|-------------|-------------|
| Cursor | `~/.cursor/projects/*/agent-transcripts/*/*.jsonl` | file mtime and/or first `<timestamp>` in user text | project dir name under `projects/` (decode if needed) | `role==user` turns |
| Codex | `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` | `session_meta.payload.timestamp` (fallback: path date) | `session_meta.payload.cwd` | `response_item` messages with `role==user` (skip developer/system) |

## Acceptance

- [x] `collect_cursor_sessions(start, end, detailed=False)` and
      `collect_codex_sessions(...)` mirror Claude/OpenCode result shape:
      `total_prompts`, `total_sessions`, `by_project`, `by_topic`, `by_day`,
      `session_summaries`, `first_prompt_timestamp`, `last_prompt_timestamp`
- [x] Wired into `main()` as `cursor_sessions` / `codex_sessions` keys
- [x] `print_summary` prints both when non-empty
- [x] SKILL.md Data Sources + Work Report Output list Cursor and Codex
- [x] Unit tests with temp fixtures (date filter in/out, empty store OK)
- [x] Missing store dirs return empty result (no crash) — same as OpenCode

## Out of scope

- Composing Markdown work-report sections beyond SKILL.md source list
  (Phase 2 composition still agent-driven from JSON)
- Token/cost for Cursor/Codex if not present in transcripts

## Comments

Implemented Cursor transcript and Codex rollout collectors, wired output and
summary reporting, updated SKILL.md source documentation, and added fixtures.
