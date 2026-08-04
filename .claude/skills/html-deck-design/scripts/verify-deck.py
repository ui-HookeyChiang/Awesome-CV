#!/usr/bin/env python3
"""
verify-deck.py — 4-layer equivalence/sanity audit for rendered HTML decks.

Layers:
  1. Slide structure — slide count, cover count (class="slide cover" variants counted)
  2. Class coverage  — every class used in <body> is defined in some <style>
  3. JS wiring       — unique ids; every getElementById target exists;
                       exactly one cheat-sheet modal; single <script> system
  4. Text parity     — with --reference: per-slide visible-text difflib ratio
                       (tag-stripped, notes-label-normalized) >= --min-ratio

Usage:
  verify-deck.py deck.html                      # layers 1-3
  verify-deck.py deck.html --reference old.html # + layer 4
Exit: 0 all pass, 1 failures (each printed as FAIL:), warnings printed as WARN:.
"""
import re
import sys
import difflib
import argparse
from collections import Counter

SLIDE_RE = re.compile(r'<div class="slide[ "][^>]*>')
LABEL_RE = re.compile('\U0001F4CC Notes available|\U0001F4CC Notes|講者備註|Notes')


def visible_slides(html):
    parts = SLIDE_RE.split(html)[1:]
    out = []
    for s in parts:
        t = re.sub(r'<[^>]+>', ' ', s.split('<script')[0])
        t = LABEL_RE.sub('', t)
        out.append(re.sub(r'\s+', '', t))
    return out


def audit(path, reference=None, min_ratio=0.95):
    html = open(path, encoding='utf-8').read()
    fails, warns = [], []

    # 1. structure
    slides = SLIDE_RE.findall(html)
    covers = re.findall(r'class="slide cover"', html)
    if not slides:
        fails.append('no slides found')

    # 1b. nesting: every slide wrapper must sit at the same div depth,
    # and total <div>/</div> must balance (unbalanced escape-hatch blobs
    # cascade every following slide out of the container)
    depth, wrapper_depths = 0, set()
    for m in re.finditer(r'<div\b[^>]*>|</div>', html):
        if m.group().startswith('</'):
            depth -= 1
        else:
            if re.match(r'<div class="slide[ "]', m.group()):
                wrapper_depths.add(depth)
            depth += 1
    if depth != 0:
        fails.append(f'unbalanced divs in document: net depth {depth}')
    if len(wrapper_depths) > 1:
        fails.append(f'slide wrappers at mixed nesting depths: {sorted(wrapper_depths)} — some slides are nested inside others')

    # 2. class coverage
    body = html.split('<body', 1)[1] if '<body' in html else html
    used = {c for cls in re.findall(r'class="([^"]+)"', body) for c in cls.split()}
    css = ' '.join(re.findall(r'<style[^>]*>(.*?)</style>', html, re.S))
    defined = set(re.findall(r'\.([a-zA-Z][\w-]*)', css))
    missing_css = sorted(used - defined)
    if missing_css:
        fails.append(f'classes used but undefined in CSS: {missing_css}')

    # 3. JS wiring
    ids = re.findall(r'id="([^"]+)"', html)
    dups = [k for k, v in Counter(ids).items() if v > 1]
    if dups:
        fails.append(f'duplicate ids: {dups}')
    js = '\n'.join(re.findall(r'<script[^>]*>(.*?)</script>', html, re.S))
    refs = set(re.findall(r"getElementById\('([^']+)'\)", js))
    missing_ids = sorted(refs - set(ids))
    if missing_ids:
        fails.append(f'JS references missing ids: {missing_ids}')
    n_scripts = len(re.findall(r'<script', html))
    n_modals = len(re.findall(r'id="cheatSheetModal"', html))
    if n_modals != 1:
        fails.append(f'expected exactly 1 cheat-sheet modal, found {n_modals}')
    if n_scripts != 1:
        warns.append(f'{n_scripts} <script> blocks (expected 1; check for duplicated nav/modal JS)')
    n_keydown = len(re.findall(r"addEventListener\('keydown'", js))
    if n_keydown > 2:
        fails.append(f'{n_keydown} keydown listeners — likely double-bound navigation')

    # 4. reference parity
    if reference:
        ref_html = open(reference, encoding='utf-8').read()
        a = visible_slides(ref_html)
        b = visible_slides(html)
        if len(a) != len(b):
            fails.append(f'slide count mismatch vs reference: {len(b)} vs {len(a)}')
        ref_covers = len(re.findall(r'class="slide cover"', ref_html))
        if len(covers) != ref_covers:
            fails.append(f'cover count mismatch vs reference: {len(covers)} vs {ref_covers}')
        low = []
        for i, (x, y) in enumerate(zip(a, b)):
            r = difflib.SequenceMatcher(None, x, y).ratio()
            if r < min_ratio:
                low.append((i + 1, round(r, 4)))
        if low:
            fails.append(f'slides below text-parity {min_ratio}: {low}')

    print(f'INFO: {len(slides)} slides ({len(covers)} covers), '
          f'{n_scripts} script(s), {n_modals} modal(s)')
    for w in warns:
        print(f'WARN: {w}')
    for f in fails:
        print(f'FAIL: {f}')
    return 1 if fails else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('deck')
    ap.add_argument('--reference')
    ap.add_argument('--min-ratio', type=float, default=0.95)
    args = ap.parse_args()
    sys.exit(audit(args.deck, args.reference, args.min_ratio))


if __name__ == '__main__':
    main()
