#!/usr/bin/env python3
"""
Test suite for render-deck.py lint rules and rendering modes.
Run with: python3 test_render_deck.py
"""

import sys
import subprocess
from pathlib import Path
import tempfile

FIXTURES_DIR = Path(__file__).parent / 'fixtures'
RENDERER = Path(__file__).parent.parent / 'render-deck.py'


class TestResult:
    def __init__(self, name):
        self.name = name
        self.passed = False
        self.error = None

    def __str__(self):
        status = "PASS" if self.passed else "FAIL"
        msg = f"  {status}: {self.name}"
        if self.error:
            msg += f"\n    {self.error}"
        return msg


def run_renderer(yaml_path, *args):
    """Run render-deck.py and return (exit_code, stdout, stderr)."""
    cmd = [sys.executable, str(RENDERER), str(yaml_path)] + list(args)
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode, result.stdout, result.stderr


def test_empty_bridge():
    """Lint rule: empty bridge should HARD-FAIL."""
    result = TestResult("empty-bridge HARD-FAIL")
    yaml_path = FIXTURES_DIR / 'empty-bridge.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    exit_code, stdout, stderr = run_renderer(yaml_path)
    if exit_code == 1 and 'empty or missing bridge' in stderr:
        result.passed = True
    else:
        result.error = f"Expected exit 1 with 'empty or missing bridge', got exit {exit_code}\nstderr: {stderr}"

    return result


def test_missing_facts():
    """Lint rule: missing facts key should HARD-FAIL."""
    result = TestResult("missing-facts HARD-FAIL")
    yaml_path = FIXTURES_DIR / 'missing-facts.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    exit_code, stdout, stderr = run_renderer(yaml_path)
    if exit_code == 1 and 'missing facts key' in stderr:
        result.passed = True
    else:
        result.error = f"Expected exit 1 with 'missing facts key', got exit {exit_code}\nstderr: {stderr}"

    return result


def test_approved_no_element():
    """Lint rule: approved: true with element-less slides should HARD-FAIL."""
    result = TestResult("approved-no-element HARD-FAIL")
    yaml_path = FIXTURES_DIR / 'approved-no-element.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    exit_code, stdout, stderr = run_renderer(yaml_path)
    if exit_code == 1 and 'approved: true but slide has no element' in stderr:
        result.passed = True
    else:
        result.error = f"Expected exit 1, got exit {exit_code}\nstderr: {stderr}"

    return result


def test_filler_opener_warn():
    """Lint rule: filler openers should WARN (not fail)."""
    result = TestResult("filler-opener WARN (non-blocking)")
    yaml_path = FIXTURES_DIR / 'filler-opener.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    # Use storyboard mode to bypass draft exit
    exit_code, stdout, stderr = run_renderer(yaml_path, '--storyboard')
    if exit_code == 0:
        result.passed = True
    else:
        result.error = f"Expected exit 0, got exit {exit_code}\nstderr: {stderr}"

    return result


def test_act_no_anchor_warn():
    """Lint rule: act without anchor should WARN (not fail)."""
    result = TestResult("act-no-anchor WARN (non-blocking)")
    yaml_path = FIXTURES_DIR / 'act-no-anchor.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    exit_code, stdout, stderr = run_renderer(yaml_path)
    if exit_code == 0 and 'WARN:' in stderr and 'no anchor' in stderr:
        result.passed = True
    else:
        result.error = f"Expected exit 0 with WARN, got exit {exit_code}\nstderr: {stderr}"

    return result


def test_html_escape_warn():
    """Lint rule: element.type: html should WARN (escape hatch)."""
    result = TestResult("html-escape WARN (escape hatch)")
    yaml_path = FIXTURES_DIR / 'html-escape.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    exit_code, stdout, stderr = run_renderer(yaml_path)
    if exit_code == 0 and 'WARN:' in stderr and 'escape hatch' in stderr:
        result.passed = True
    else:
        result.error = f"Expected exit 0 with WARN, got exit {exit_code}\nstderr: {stderr}"

    return result


def test_clean_deck_storyboard():
    """Mode test: --storyboard should produce markdown table."""
    result = TestResult("clean-deck --storyboard (markdown table)")
    yaml_path = FIXTURES_DIR / 'clean-deck.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    exit_code, stdout, stderr = run_renderer(yaml_path, '--storyboard')
    if exit_code == 0 and '| id | act | claim | bridge |' in stdout:
        result.passed = True
    else:
        result.error = f"Expected exit 0 with table header, got exit {exit_code}\nstdout: {stdout[:200]}"

    return result


def test_clean_deck_draft_mode():
    """Mode test: approved: false should exit with draft message."""
    result = TestResult("clean-deck draft mode (approved: false)")
    yaml_path = FIXTURES_DIR / 'clean-deck.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    exit_code, stdout, stderr = run_renderer(yaml_path)
    if exit_code == 0 and 'DRAFT:' in stderr:
        result.passed = True
    else:
        result.error = f"Expected exit 0 (draft mode), got exit {exit_code}\nstderr: {stderr[:200]}"

    return result


def main():
    print("Testing render-deck.py lint and mode rules\n")

    tests = [
        test_empty_bridge,
        test_missing_facts,
        test_approved_no_element,
        test_filler_opener_warn,
        test_act_no_anchor_warn,
        test_html_escape_warn,
        test_clean_deck_storyboard,
        test_clean_deck_draft_mode,
    ]

    results = [t() for t in tests]

    # Print results
    for r in results:
        print(r)

    # Summary
    passed = sum(1 for r in results if r.passed)
    total = len(results)
    print(f"\n{passed}/{total} tests passed")

    return 0 if passed == total else 1


if __name__ == '__main__':
    sys.exit(main())
