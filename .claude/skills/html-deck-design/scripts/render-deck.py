#!/usr/bin/env python3
"""
render-deck.py: YAML deck schema to HTML renderer with lint rules.

Modes:
  - Storyboard: --storyboard flag produces markdown table (phase 1: id/act/claim/bridge)
  - Draft mode: approved: false or missing element → exits with draft message
  - Full build: approved: true + all slides have element → renders complete deck

Lint (both modes):
  - HARD-FAIL: empty/missing bridge; missing facts key; approved: true with element-less slides
  - WARN: filler openers; acts with zero anchors; element.type: html usage
"""

import sys
import yaml
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import re
import os


FILLER_OPENERS = {'另外', '順帶一提', '回到剛才', '補充一下'}
TEMPLATE_PATH = Path(__file__).parent.parent / 'references' / 'template.html'


def load_deck(yaml_path: str) -> Dict[str, Any]:
    """Load and validate deck YAML."""
    try:
        with open(yaml_path, 'r', encoding='utf-8') as f:
            deck = yaml.safe_load(f)
    except FileNotFoundError:
        print(f"ERROR: Deck file not found: {yaml_path}", file=sys.stderr)
        sys.exit(1)
    except yaml.YAMLError as e:
        print(f"ERROR: Invalid YAML: {e}", file=sys.stderr)
        sys.exit(1)

    if not deck or 'meta' not in deck or 'slides' not in deck:
        print("ERROR: Deck must contain 'meta' and 'slides' keys", file=sys.stderr)
        sys.exit(1)

    return deck


def lint_deck(deck: Dict[str, Any]) -> Tuple[List[str], List[str]]:
    """
    Run lint rules. Returns (failures, warnings).
    Failures halt execution; warnings are reported but allow continuation.
    """
    failures = []
    warnings = []
    slides = deck.get('slides', [])
    act_anchors = {}
    has_html_escape = False
    has_custom_css = bool(deck.get('meta', {}).get('custom_css', '').strip())

    for i, slide in enumerate(slides):
        slide_id = slide.get('id', f'slide-{i}')

        # HARD-FAIL: empty/missing bridge
        bridge = slide.get('bridge', '').strip()
        if not bridge:
            failures.append(f"Slide {i} ({slide_id}): empty or missing bridge")

        # HARD-FAIL: missing facts key
        if 'facts' not in slide:
            failures.append(f"Slide {i} ({slide_id}): missing facts key (use [] for no claims)")

        # HARD-FAIL: approved: true with element-less slides
        if deck.get('approved') is True and 'element' not in slide:
            failures.append(f"Slide {i} ({slide_id}): approved: true but slide has no element")

        # WARN: filler openers
        if bridge:
            first_word = bridge.split()[0] if bridge else ''
            if first_word in FILLER_OPENERS:
                warnings.append(f"Slide {i} ({slide_id}): bridge starts with filler opener '{first_word}'")

        # WARN: element.type: html
        element = slide.get('element', {})
        if isinstance(element, dict) and element.get('type') == 'html':
            has_html_escape = True
            warnings.append(f"Slide {i} ({slide_id}): uses escape hatch element.type: html")

        # Track anchors per act for later warning
        act = slide.get('act')
        if act is not None:
            if act not in act_anchors:
                act_anchors[act] = []
            if slide.get('anchor'):
                act_anchors[act].append(slide_id)

    # WARN: element.type: html without custom_css
    if has_html_escape and not has_custom_css:
        warnings.append("Deck uses element.type: html but meta.custom_css is absent — custom classes will be unstyled")

    # WARN: act without anchor slides
    for act, anchors in act_anchors.items():
        if not anchors:
            warnings.append(f"Act {act}: no anchor: true slides defined")

    return failures, warnings


def render_storyboard(deck: Dict[str, Any]) -> str:
    """Render phase-1 storyboard as markdown table (id | act | claim | bridge)."""
    slides = deck.get('slides', [])

    lines = ['| id | act | claim | bridge |', '|---|---|---|---|']
    for slide in slides:
        slide_id = slide.get('id', 'unnamed')
        act = slide.get('act', '')
        claim = slide.get('claim', '').replace('|', '\\|')[:60]  # Truncate for table
        bridge = slide.get('bridge', '').replace('|', '\\|')[:60]
        lines.append(f'| {slide_id} | {act} | {claim} | {bridge} |')

    return '\n'.join(lines)


def load_template() -> str:
    """Load template.html."""
    if not TEMPLATE_PATH.exists():
        print(f"ERROR: Template not found: {TEMPLATE_PATH}", file=sys.stderr)
        sys.exit(1)
    return TEMPLATE_PATH.read_text(encoding='utf-8')


def html_escape(text: Optional[str]) -> str:
    """Escape HTML special characters."""
    if text is None:
        return ''
    return (text
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
            .replace("'", '&#39;'))


def render_slide_html(slide: Dict[str, Any], slide_index: int) -> str:
    """Render a single slide to HTML."""
    slide_id = slide.get('id', f'slide-{slide_index}')
    claim = html_escape(slide.get('claim', ''))
    element = slide.get('element', {})
    notes = slide.get('notes', '').strip()

    html_parts = [f'        <div class="slide" id="{html_escape(slide_id)}" data-slide-index="{slide_index}">']
    html_parts.append(f'            <h1>{claim}</h1>')

    # Render element based on type
    if isinstance(element, dict):
        elem_type = element.get('type', 'statement')

        if elem_type == 'statement':
            text = element.get('data', {}).get('text', '')
            html_parts.append(f'            <p class="big-sub">{html_escape(text)}</p>')

        elif elem_type == 'table':
            # Simple table rendering
            data = element.get('data', {})
            headers = data.get('headers', [])
            rows = data.get('rows', [])
            html_parts.append('            <table style="width: 100%; border-collapse: collapse;">')
            if headers:
                html_parts.append('                <tr>')
                for h in headers:
                    html_parts.append(f'                    <th style="border: 1px solid var(--border); padding: 8px;">{html_escape(h)}</th>')
                html_parts.append('                </tr>')
            for row in rows:
                html_parts.append('                <tr>')
                for cell in row:
                    html_parts.append(f'                    <td style="border: 1px solid var(--border); padding: 8px;">{html_escape(cell)}</td>')
                html_parts.append('                </tr>')
            html_parts.append('            </table>')

        elif elem_type == 'flow':
            # Simple flow diagram (cards connected by arrows)
            steps = element.get('data', {}).get('steps', [])
            for i, step in enumerate(steps):
                html_parts.append(f'            <p>{html_escape(step)}</p>')
                if i < len(steps) - 1:
                    html_parts.append('            <p style="text-align: center;">↓</p>')

        elif elem_type == 'cards':
            # Card layout
            items = element.get('data', {}).get('items', [])
            html_parts.append('            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">')
            for item in items:
                title = item.get('title', '') if isinstance(item, dict) else item
                desc = item.get('desc', '') if isinstance(item, dict) else ''
                html_parts.append(f'                <div class="card" style="background: var(--card-bg); padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary);">')
                html_parts.append(f'                    <strong>{html_escape(title)}</strong>')
                if desc:
                    html_parts.append(f'                    <p>{html_escape(desc)}</p>')
                html_parts.append(f'                </div>')
            html_parts.append('            </div>')

        elif elem_type == 'code':
            # Code block
            code = element.get('data', {}).get('code', '')
            lang = element.get('data', {}).get('lang', 'text')
            html_parts.append(f'            <pre style="background: var(--code-bg); padding: 15px; border-radius: 8px; overflow-x: auto;"><code class="language-{lang}">{html_escape(code)}</code></pre>')

        elif elem_type == 'html':
            # Escape hatch: raw HTML (warned in lint)
            raw_html = element.get('data', {}).get('html', '')
            html_parts.append(f'            {raw_html}')

        elif elem_type == 'composite':
            # Multiple elements
            components = element.get('data', {}).get('components', [])
            for comp in components:
                # Recursively render each component
                comp_type = comp.get('type', 'statement')
                if comp_type == 'statement':
                    html_parts.append(f'            <p>{html_escape(comp.get("text", ""))}</p>')

    # Add speaker notes if present (data-cheat trigger)
    if notes:
        slide_key = slide_id.replace('-', '_')
        html_parts.append(f'            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border); color: var(--text-muted); cursor: pointer;" data-cheat="{html_escape(slide_key)}">📌 Notes available</p>')

    html_parts.append('        </div>')
    return '\n'.join(html_parts)


def render_full_html(deck: Dict[str, Any]) -> str:
    """Render complete HTML deck."""
    template = load_template()
    meta = deck.get('meta', {})
    slides = deck.get('slides', [])

    # Build slide HTML
    slides_html = []
    cheat_sheets = {}

    for i, slide in enumerate(slides):
        slides_html.append(render_slide_html(slide, i))

        # Collect speaker notes for cheat sheets
        notes = slide.get('notes', '').strip()
        if notes:
            slide_key = slide.get('id', f'slide-{i}').replace('-', '_')
            cheat_sheets[slide_key] = {
                'title': f"Notes: {slide.get('claim', 'Slide')[:40]}",
                'content': html_escape(notes)
            }

    slides_content = '\n'.join(slides_html)

    # Build cheat sheet JS
    cheat_sheets_js = 'const cheatSheets = ' + str(cheat_sheets).replace("'", '"') + ';'

    # Replace placeholder in template
    title = meta.get('title', 'Slide Deck')
    lang = meta.get('lang', 'zh-Hant')

    # Inject custom CSS if present
    custom_css = meta.get('custom_css', '').strip()
    custom_css_block = ''
    if custom_css:
        custom_css_block = f'\n    <style>\n{custom_css}\n    </style>'

    # Replace example slides block (comment + 2 example divs) with actual slides
    template_slides_pattern = r'<!-- Example slide structure: fill with your content -->.*?<!-- Example SAR slide -->.*?</div>\s*</div>'
    html = re.sub(
        template_slides_pattern,
        slides_content,
        template,
        flags=re.DOTALL
    )

    html = html.replace(
        '<title>Slide Deck Template</title>',
        f'<title>{html_escape(title)}</title>'
    ).replace(
        'const cheatSheets = {\n            example: {',
        f'const cheatSheets = {{\n            {cheat_sheets_js};'
    )

    # Inject custom CSS after template styles (find </style> tag and insert after it)
    if custom_css_block:
        html = html.replace('    </style>', f'    </style>{custom_css_block}')

    return html


def check_facts(deck: Dict[str, Any], check: bool = False) -> Tuple[List[str], List[str]]:
    """
    Verify facts[].source paths exist (if --check-facts flag).
    Returns (missing_files, valid_sources).
    """
    missing = []
    valid = []

    if not check:
        return missing, valid

    slides = deck.get('slides', [])
    for i, slide in enumerate(slides):
        slide_id = slide.get('id', f'slide-{i}')
        facts = slide.get('facts', [])

        for fact in facts:
            if isinstance(fact, dict):
                source = fact.get('source', '')
                if source:
                    # Parse source as path:line
                    if ':' in source:
                        fpath = source.split(':')[0]
                    else:
                        fpath = source

                    if not Path(fpath).exists():
                        missing.append(f"Slide {i} ({slide_id}): source file not found: {fpath}")
                    else:
                        valid.append(f"{slide_id}: {source}")

    return missing, valid


def main():
    parser = argparse.ArgumentParser(
        description='Render YAML deck to HTML with storyboard/draft/full modes'
    )
    parser.add_argument('deck', help='Path to deck.yaml')
    parser.add_argument('--storyboard', action='store_true', help='Output storyboard table (phase 1)')
    parser.add_argument('--check-facts', action='store_true', help='Verify facts[] source files exist')
    parser.add_argument('-o', '--output', help='Output HTML file (defaults to deck.html)')

    args = parser.parse_args()

    # Load and lint
    deck = load_deck(args.deck)
    failures, warnings = lint_deck(deck)

    # Report warnings
    for w in warnings:
        print(f"WARN: {w}", file=sys.stderr)

    # Hard-fail on lint errors
    if failures:
        for f in failures:
            print(f"FAIL: {f}", file=sys.stderr)
        sys.exit(1)

    # Storyboard mode: output table and exit
    if args.storyboard:
        print(render_storyboard(deck))
        return

    # Check facts if requested
    if args.check_facts:
        missing, _ = check_facts(deck, check=True)
        if missing:
            for m in missing:
                print(f"FAIL: {m}", file=sys.stderr)
            sys.exit(1)

    # Draft mode: approved: false or missing element
    approved = deck.get('approved', False)
    slides = deck.get('slides', [])
    has_elements = all('element' in s for s in slides)

    if not approved or not has_elements:
        if not approved:
            msg = "Deck not approved (approved: false) — storyboard review pending"
        else:
            msg = "Some slides missing element — draft mode (add elements to all slides)"
        print(f"DRAFT: {msg}", file=sys.stderr)
        sys.exit(0)

    # Full build mode
    html = render_full_html(deck)
    output_path = args.output or args.deck.replace('.yaml', '.html')

    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"OK: Rendered {len(slides)} slides to {output_path}", file=sys.stderr)
    except IOError as e:
        print(f"ERROR: Cannot write output: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
