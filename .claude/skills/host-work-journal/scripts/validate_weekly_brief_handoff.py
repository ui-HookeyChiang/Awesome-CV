#!/usr/bin/env python3
"""Validate the host-work-journal weekly brief handoff contract."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Any

import yaml


CONTRACT_ROOT = "weekly_brief_handoff"
CONTRACT_NAME = "weekly-brief-handoff"
CONTRACT_VERSION = 1
CANONICAL_STAGE = "integrated"
CANONICAL_PATTERN = "journal/integrated/work-report_<HOST>_<START>-to-<END>.md"
ALLOWED_STATUSES = frozenset(
    {"in_progress", "blocked", "decision_needed", "done"}
)
REQUIRED_FIELDS = (
    "outcomes",
    "evidence",
    "open_items",
    "risks",
    "decisions",
    "next_focus",
)
DATE_PATTERN = r"\d{4}-\d{2}-\d{2}"
ARTIFACT_PATTERN = re.compile(
    rf"^journal/integrated/work-report_(?P<host>[A-Za-z0-9][A-Za-z0-9._-]*)_"
    rf"(?P<start>{DATE_PATTERN})-to-(?P<end>{DATE_PATTERN})\.md$"
)
FRONTMATTER_PATTERN = re.compile(r"\A---\n(?P<yaml>.*?)\n---\n", re.DOTALL)
HANDOFF_PATTERN = re.compile(
    r"(?ms)^## Weekly brief handoff v1\s*\n+```yaml\s*\n(?P<yaml>.*?)\n```\s*"
)


def _load_yaml(raw: str, label: str, errors: list[str]) -> Any:
    try:
        return yaml.safe_load(raw)
    except yaml.YAMLError as exc:
        errors.append(f"{label} is not valid YAML: {exc}")
        return None


def _mapping(value: Any, label: str, errors: list[str]) -> dict[str, Any] | None:
    if not isinstance(value, dict):
        errors.append(f"{label} must be a mapping")
        return None
    return value


def _required_mapping_field(
    mapping: dict[str, Any], key: str, label: str, errors: list[str]
) -> Any:
    if key not in mapping:
        errors.append(f"missing required field: {label}.{key}")
        return None
    return mapping[key]


def _iso_date(value: Any, label: str, errors: list[str]) -> date | None:
    if isinstance(value, date) and not isinstance(value, datetime):
        parsed = value
    elif isinstance(value, str) and re.fullmatch(DATE_PATTERN, value):
        try:
            parsed = date.fromisoformat(value)
        except ValueError:
            parsed = None
    else:
        parsed = None

    if parsed is None:
        errors.append(f"{label} must be an ISO date (YYYY-MM-DD)")
    return parsed


def _check_frontmatter(text: str, errors: list[str]) -> None:
    match = FRONTMATTER_PATTERN.match(text)
    if not match:
        errors.append("report must start with YAML frontmatter")
        return

    frontmatter = _mapping(
        _load_yaml(match.group("yaml"), "frontmatter", errors),
        "frontmatter",
        errors,
    )
    if frontmatter is None:
        return
    if frontmatter.get("kind") != "log-entry":
        errors.append("frontmatter.kind must remain log-entry")
    for field in ("date", "title"):
        if not frontmatter.get(field):
            errors.append(f"frontmatter.{field} is required")


def _check_artifact(
    artifact: dict[str, Any],
    date_range: dict[str, Any],
    artifact_path: str | None,
    errors: list[str],
) -> None:
    path = _required_mapping_field(artifact, "path", "artifact", errors)
    pattern = _required_mapping_field(artifact, "pattern", "artifact", errors)
    if pattern != CANONICAL_PATTERN:
        errors.append("artifact.pattern must be the exact canonical pattern")
    if not isinstance(path, str):
        errors.append("artifact.path must be a relative Markdown path")
        return

    match = ARTIFACT_PATTERN.fullmatch(path)
    if not match:
        errors.append(
            "artifact.path must match "
            "journal/integrated/work-report_<HOST>_<START>-to-<END>.md"
        )
        return

    start = _iso_date(match.group("start"), "artifact.path start", errors)
    end = _iso_date(match.group("end"), "artifact.path end", errors)
    range_start = _iso_date(date_range.get("start"), "date_range.start", errors)
    range_end = _iso_date(date_range.get("end"), "date_range.end", errors)
    if start and range_start and start != range_start:
        errors.append("artifact.path start does not match date_range.start")
    if end and range_end and end != range_end:
        errors.append("artifact.path end does not match date_range.end")
    if start and end and start > end:
        errors.append("artifact path date range must be inclusive and ordered")
    if artifact_path is not None and path != artifact_path:
        errors.append("artifact.path does not match the validated report path")


def _check_semantics(handoff: dict[str, Any], errors: list[str]) -> None:
    for field in REQUIRED_FIELDS:
        if field not in handoff:
            errors.append(f"missing required field: {CONTRACT_ROOT}.{field}")
        elif not isinstance(handoff[field], list):
            errors.append(f"{CONTRACT_ROOT}.{field} must be an array")

    evidence = handoff.get("evidence")
    if isinstance(evidence, list):
        for index, item in enumerate(evidence):
            item = _mapping(item, f"evidence[{index}]", errors)
            if item is None:
                continue
            for field in ("method", "verdict"):
                value = item.get(field)
                if not isinstance(value, str) or not value.strip():
                    errors.append(f"evidence[{index}] requires a non-empty {field}")

    open_items = handoff.get("open_items")
    if isinstance(open_items, list):
        for index, item in enumerate(open_items):
            item = _mapping(item, f"open_items[{index}]", errors)
            if item is None:
                continue
            for field in ("item", "status", "next_step"):
                if field not in item or not item[field]:
                    errors.append(f"open_items[{index}] requires {field}")
            status = item.get("status")
            if status not in ALLOWED_STATUSES:
                errors.append(
                    f"open_items[{index}].status has unknown status {status!r}; "
                    "allowed statuses are: "
                    + ", ".join(sorted(ALLOWED_STATUSES))
                )


def validate_report(text: str, artifact_path: str | None = None) -> list[str]:
    """Return deterministic validation errors; an empty list means valid."""

    errors: list[str] = []
    _check_frontmatter(text, errors)
    matches = HANDOFF_PATTERN.findall(text)
    if len(matches) != 1:
        errors.append(
            "report must contain exactly one 'Weekly brief handoff v1' YAML block"
        )
        return errors

    handoff = _mapping(
        _load_yaml(matches[0], "weekly brief handoff", errors),
        "weekly brief handoff",
        errors,
    )
    if handoff is None:
        return errors
    root = _mapping(handoff.get(CONTRACT_ROOT), CONTRACT_ROOT, errors)
    if root is None:
        return errors

    if root.get("contract") != CONTRACT_NAME:
        errors.append(f"{CONTRACT_ROOT}.contract must be {CONTRACT_NAME}")
    if root.get("version") != CONTRACT_VERSION:
        errors.append(f"{CONTRACT_ROOT}.version must be {CONTRACT_VERSION}")
    if root.get("stage") != CANONICAL_STAGE:
        errors.append(f"{CONTRACT_ROOT}.stage must be {CANONICAL_STAGE}")

    date_range = _mapping(root.get("date_range"), "date_range", errors)
    artifact = _mapping(root.get("artifact"), "artifact", errors)
    if date_range is None:
        date_range = {}
    if artifact is None:
        artifact = {}
    _iso_date(date_range.get("start"), "date_range.start", errors)
    _iso_date(date_range.get("end"), "date_range.end", errors)
    start = _iso_date(date_range.get("start"), "date_range.start", [])
    end = _iso_date(date_range.get("end"), "date_range.end", [])
    if start and end and start > end:
        errors.append("date_range must be inclusive and ordered")
    _check_artifact(artifact, date_range, artifact_path, errors)

    producer = _mapping(root.get("producer"), "producer", errors)
    if producer is None:
        producer = {}
    if producer.get("skill") != "host-work-journal":
        errors.append("producer.skill must be host-work-journal")
    if producer.get("pipeline") != "journal-integrate-milestones":
        errors.append("producer.pipeline must be journal-integrate-milestones")

    consumer = _mapping(root.get("consumer"), "consumer", errors)
    if consumer is None:
        consumer = {}
    if consumer.get("skill") != "brief":
        errors.append("consumer.skill must be brief")
    if consumer.get("mode") != "weekly-brief-presentation-transform":
        errors.append(
            "consumer.mode must be weekly-brief-presentation-transform"
        )

    _check_semantics(root, errors)
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("report", type=Path)
    parser.add_argument(
        "--artifact-path",
        help="canonical repository-relative path to compare with artifact.path",
    )
    args = parser.parse_args(argv)

    try:
        text = args.report.read_text(encoding="utf-8")
    except OSError as exc:
        print(f"error: cannot read {args.report}: {exc}", file=sys.stderr)
        return 2

    artifact_path = args.artifact_path
    if artifact_path is None:
        try:
            artifact_path = str(args.report.resolve().relative_to(Path.cwd()))
        except ValueError:
            artifact_path = str(args.report)

    errors = validate_report(text, artifact_path=artifact_path)
    if errors:
        for error in errors:
            print(f"INVALID: {error}", file=sys.stderr)
        return 1
    print(f"VALID: {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
