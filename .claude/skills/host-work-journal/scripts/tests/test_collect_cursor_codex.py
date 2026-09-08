import importlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import pytest

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS_DIR))
collector = importlib.import_module("collect-weekly-report")


def test_cursor_filters_transcripts_by_embedded_timestamp(tmp_path, monkeypatch):
    projects = tmp_path / "projects"
    inside = projects / "encoded-project" / "agent-transcripts" / "inside-id"
    outside = projects / "encoded-project" / "agent-transcripts" / "outside-id"
    inside.mkdir(parents=True)
    outside.mkdir(parents=True)
    (inside / "inside-id.jsonl").write_text(json.dumps({
        "role": "user",
        "message": {"content": [
            {"type": "text", "text": "<timestamp>2026-09-05T12:00:00Z</timestamp> fix raid"}
        ]},
    }) + "\n")
    (outside / "outside-id.jsonl").write_text(json.dumps({
        "role": "user",
        "message": {"content": "old prompt"},
    }) + "\n")
    old = datetime(2026, 8, 1, tzinfo=timezone.utc).timestamp()
    os.utime(outside / "outside-id.jsonl", (old, old))
    monkeypatch.setattr(collector, "CURSOR_PROJECTS", projects)

    result = collector.collect_cursor_sessions("2026-09-01", "2026-09-07")

    assert result["total_sessions"] == 1
    assert result["total_prompts"] == 1
    assert result["by_project"] == [{"project": "encoded-project", "prompts": 1}]
    assert result["session_summaries"][0]["session_id"] == "inside-id"[:12]


def test_codex_counts_in_range_user_message(tmp_path, monkeypatch):
    sessions = tmp_path / "sessions" / "2026" / "09" / "05"
    sessions.mkdir(parents=True)
    rollout = sessions / "rollout-test.jsonl"
    lines = [
        {"timestamp": "2026-09-05T10:00:00Z", "type": "session_meta",
         "payload": {"cwd": str(Path.home() / "Projects" / "demo"),
                     "timestamp": "2026-09-05T10:00:00Z",
                     "session_id": "codex-session-id"}},
        {"timestamp": "2026-09-05T10:01:00Z", "type": "response_item",
         "payload": {"type": "message", "role": "developer", "content": "system"}},
        {"timestamp": "2026-09-05T10:02:00Z", "type": "response_item",
         "payload": {"type": "message", "role": "user", "content": "fix scripting"}},
    ]
    rollout.write_text("\n".join(json.dumps(line) for line in lines) + "\n")
    monkeypatch.setattr(collector, "CODEX_SESSIONS", sessions.parents[3])

    result = collector.collect_codex_sessions("2026-09-01", "2026-09-07")

    assert result["total_sessions"] == 1
    assert result["total_prompts"] == 1
    assert result["by_project"] == [{"project": "Projects/demo", "prompts": 1}]
    assert result["by_topic"][0]["topic"] == "scripting"


def test_missing_cursor_and_codex_dirs_are_empty(tmp_path, monkeypatch):
    monkeypatch.setattr(collector, "CURSOR_PROJECTS", tmp_path / "missing-cursor")
    monkeypatch.setattr(collector, "CODEX_SESSIONS", tmp_path / "missing-codex")

    for result in (
        collector.collect_cursor_sessions("2026-09-01", "2026-09-07"),
        collector.collect_codex_sessions("2026-09-01", "2026-09-07"),
    ):
        assert result["total_prompts"] == 0
        assert result["total_sessions"] == 0
        assert result["session_summaries"] == []
