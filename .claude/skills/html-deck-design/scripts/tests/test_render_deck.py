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


def test_template_placeholder_removal():
    """Render test: template example slides should not appear in output."""
    result = TestResult("template-placeholder removal (2-slide deck renders 2)")
    yaml_path = FIXTURES_DIR / 'template-placeholder-removal.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    import tempfile
    import re
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as f:
        output_path = f.name

    exit_code, stdout, stderr = run_renderer(yaml_path, '-o', output_path)
    if exit_code == 0:
        with open(output_path) as f:
            html = f.read()
        slide_count = len(re.findall(r'data-slide-index', html))
        if slide_count == 2:
            result.passed = True
        else:
            result.error = f"Expected 2 slides in output, got {slide_count}"
    else:
        result.error = f"Render failed: {stderr[:200]}"

    import os
    try:
        os.unlink(output_path)
    except:
        pass

    return result


def test_custom_css_injection():
    """Render test: custom_css should be injected, and type:html claims skipped."""
    result = TestResult("custom-css injection + html claim suppression")
    yaml_path = FIXTURES_DIR / 'custom-css-with-html.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    import tempfile
    import re
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as f:
        output_path = f.name

    exit_code, stdout, stderr = run_renderer(yaml_path, '-o', output_path)
    if exit_code == 0:
        with open(output_path) as f:
            html = f.read()
        # Check that custom CSS classes are defined
        css_ok = '.flow-box' in html and '.big-statement' in html and '.cheat-sheet-modal' in html

        # Extract intro slide (type:html) and verify claim "Custom CSS Test" NOT in h1
        intro_match = re.search(r'id="intro"[^>]*>(.*?)</div>\s*</div>', html, re.DOTALL)
        claim_suppressed = True
        if intro_match:
            intro_html = intro_match.group(1)
            # Check that <h1>Custom CSS Test</h1> is NOT present in intro slide
            if '<h1>Custom CSS Test</h1>' in intro_html:
                claim_suppressed = False

        if css_ok and claim_suppressed:
            result.passed = True
        else:
            result.error = f"CSS ok={css_ok}, claim_suppressed={claim_suppressed}"
    else:
        result.error = f"Render failed: {stderr[:200]}"

    import os
    try:
        os.unlink(output_path)
    except:
        pass

    return result


def test_html_without_custom_css_warn():
    """Lint rule: element.type: html without meta.custom_css should warn."""
    result = TestResult("html-escape without custom_css WARN")
    yaml_path = FIXTURES_DIR / 'html-without-custom-css.yaml'

    if not yaml_path.exists():
        result.error = f"Fixture not found: {yaml_path}"
        return result

    exit_code, stdout, stderr = run_renderer(yaml_path)
    if exit_code == 0 and 'WARN:' in stderr and 'custom_css is absent' in stderr:
        result.passed = True
    else:
        result.error = f"Expected exit 0 with specific WARN, got exit {exit_code}\nstderr: {stderr[:200]}"

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
        test_template_placeholder_removal,
        test_custom_css_injection,
        test_html_without_custom_css_warn,
    
        test_standalone_embedded_js,
        test_cheatsheets_valid_js,
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




def test_standalone_embedded_js():
    """Deck embedding its own <script>: template modal/JS stripped, wrapper class honored, no auto-trigger duplication."""
    result = TestResult("standalone-embedded-js strip + cover class")
    yaml_path = FIXTURES_DIR / 'standalone-embedded-js.yaml'
    with tempfile.NamedTemporaryFile(suffix='.html', delete=False) as f:
        out = f.name
    code, stdout, stderr = run_renderer(yaml_path, '-o', out)
    html = Path(out).read_text()
    checks = [
        (code == 0, f"exit {code}"),
        ('stripping template modal/nav/JS' in stderr, 'no strip warning'),
        (html.count('<script') == 1, f"{html.count('<script')} script blocks"),
        (html.count('id="cheatSheetModal"') == 0, 'template modal not stripped'),
        ('class="slide cover"' in html, 'cover wrapper class missing'),
        (html.count('data-cheat') == 1, f"{html.count('data-cheat')} data-cheat occurrences (expected 1: cover's own trigger only — auto-trigger must be skipped)"),
    ]
    failed = [msg for ok, msg in checks if not ok]
    if failed:
        result.error = '; '.join(failed)
    else:
        result.passed = True
    return result


def test_cheatsheets_valid_js():
    """Non-standalone deck: generated cheatSheets must be valid JSON-shaped JS."""
    result = TestResult("cheatSheets injection is valid JS")
    yaml_path = FIXTURES_DIR / 'template-placeholder-removal.yaml'
    with tempfile.NamedTemporaryFile(suffix='.html', delete=False) as f:
        out = f.name
    code, stdout, stderr = run_renderer(yaml_path, '-o', out)
    html = Path(out).read_text()
    import re as _re, json as _json
    m = _re.search(r'const cheatSheets = (\{.*?\});', html, _re.DOTALL)
    if code != 0:
        result.error = f"exit {code}: {stderr[:200]}"
    elif not m:
        result.error = 'cheatSheets object not found'
    else:
        try:
            _json.loads(m.group(1))
            if 'example:' in html:
                result.error = 'template example notes not replaced'
            else:
                result.passed = True
        except ValueError as e:
            result.error = f'invalid JSON in cheatSheets: {e}'
    return result


if __name__ == '__main__':
    sys.exit(main())
