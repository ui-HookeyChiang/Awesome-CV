"""Deterministic tests for the producer-side weekly brief handoff."""

import importlib.util
import unittest
from pathlib import Path


SCRIPTS_DIR = Path(__file__).resolve().parent.parent
FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures" / "weekly-brief-handoff-v1"
VALIDATOR_PATH = SCRIPTS_DIR / "validate_weekly_brief_handoff.py"
SPEC = importlib.util.spec_from_file_location("weekly_brief_handoff", VALIDATOR_PATH)
validator = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(validator)


CANONICAL_PATH = (
    "journal/integrated/work-report_ampere_2026-09-01-to-2026-09-07.md"
)


def fixture(name: str) -> str:
    return (FIXTURES_DIR / name).read_text(encoding="utf-8")


def errors_for(name: str, *, artifact_path: str | None = None) -> list[str]:
    return validator.validate_report(fixture(name), artifact_path=artifact_path)


class WeeklyBriefHandoffTests(unittest.TestCase):
    def test_complete_fixture_is_valid_and_path_is_exact(self):
        self.assertEqual(errors_for("complete.md", artifact_path=CANONICAL_PATH), [])

    def test_complete_fixture_preserves_log_entry_frontmatter(self):
        text = fixture("complete.md")
        self.assertTrue(text.startswith("---\n"))
        self.assertIn("kind: log-entry\n", text)
        self.assertEqual(errors_for("complete.md"), [])

    def test_missing_required_field_fails_closed(self):
        errors = errors_for("missing-required-field.md")
        self.assertTrue(
            any(
                "missing required field: weekly_brief_handoff.risks" in error
                for error in errors
            )
        )

    def test_unknown_status_fails_closed_and_reports_exact_enum(self):
        errors = errors_for("unknown-status.md")
        self.assertTrue(any("unknown status 'pending'" in error for error in errors))
        self.assertEqual(
            set(validator.ALLOWED_STATUSES),
            {"in_progress", "blocked", "decision_needed", "done"},
        )

    def test_activity_only_report_has_no_eligible_handoff(self):
        errors = errors_for("activity-only.md")
        self.assertTrue(any("exactly one" in error for error in errors))

    def test_raw_unintegrated_report_is_rejected(self):
        errors = errors_for("raw-unintegrated.md")
        self.assertTrue(any("stage must be integrated" in error for error in errors))
        self.assertTrue(
            any("must match journal/integrated/work-report_" in error for error in errors)
        )

    def test_each_evidence_item_requires_method_and_verdict(self):
        for field in ("method", "verdict"):
            text = fixture("complete.md")
            if field == "method":
                text = text.replace(
                    'method: "repository fixture and deterministic validator"',
                    'method: ""',
                )
            else:
                text = text.replace("verdict: pass", 'verdict: ""')

            errors = validator.validate_report(text)
            self.assertTrue(
                any(
                    f"evidence[0] requires a non-empty {field}" in error
                    for error in errors
                )
            )

    def test_artifact_path_must_match_validated_path(self):
        errors = errors_for(
            "complete.md",
            artifact_path="journal/integrated/work-report_other_2026-09-01-to-2026-09-07.md",
        )
        self.assertTrue(
            any("does not match the validated report path" in error for error in errors)
        )


if __name__ == "__main__":
    unittest.main()
