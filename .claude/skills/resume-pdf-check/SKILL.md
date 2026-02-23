---
name: resume-pdf-check
description: Build resume PDF and validate. Handles backup/copy/xelatex/restore for resumes/ builds, enforces 2-page limit, auto-shrinks scholar on overflow. Use when building or checking a resume.
---

# Resume Build & Check

Use this skill to build a resume PDF and validate it. Covers two scenarios:

- **GP build** — build directly from canonical `src/resume/` (no sync needed)
- **Job-targeted build** — build from customized `.tex` files under `resumes/<company>/`

## Layout Rule

| Page | Sections |
|------|----------|
| 1 | Summary, Work Experience |
| 2 | Education, Scholarship, Leadership |

## Source Files

| File | Role |
|------|------|
| `src/resume/*.tex` | **Canonical GP** (all 5 .tex files — edit here) |
| `src/resume.tex` | Main document (page layout, imports) |
| `awesome-cv.cls` | Class file (do not modify) |

**Rule:** `src/resume/` is the source of truth and build directory. For job-targeted builds, backup `src/resume/` before overwriting, then restore after build.

---

## GP Build Procedure

Edit GP files directly in `src/resume/` (canonical), then build:

```bash
cd src && xelatex resume.tex
```

`resumes/general/resume.pdf` is a symlink to `../../src/resume.pdf` — no copy needed.

## Job-Targeted Build Procedure

Job-targeted resumes store all 5 `.tex` files (summary, experience, education, scholar, leadership) under `resumes/<company>/resume/`. Education, scholar, and leadership are typically copied from GP unchanged.

When building from `resumes/<company>/resume/`:

```bash
# Backup entire GP mirror
cp -r src/resume src/resume.bak

# Copy all tailored versions
cp resumes/<company>/resume/*.tex src/resume/

# Build
cd src && xelatex resume.tex

# Copy output
cp resume.pdf ../resumes/<company>/resume.pdf

# Restore GP mirror
rm -rf resume && mv resume.bak resume
```

---

## Validation

### 1. Verify Page Count

```bash
pdfinfo src/resume.pdf | grep Pages
```

- **Expected**: `Pages: 2`
- If pages > 2: content has overflowed and must be trimmed
- If pages < 2: content may be too sparse or `\newpage` is missing

### 2. Auto-Shrink Scholar Section (Page 2 Overflow)

When page 2 overflows, **automatically shrink scholar** before asking the user to trim. Apply in order until the PDF fits:

1. **Remove the least relevant project** (currently only 2 entries remain: Phase-based Profiling and Thread Cluster Memory)
2. **Shorten remaining descriptions** to single-line summaries
3. **Remove another project** if still overflowing (keep top 1)
4. **Collapse to minimal format** — remove `\begin{cvitems}` and use empty description braces `{}`

After each reduction, rebuild and re-check page count.

For jobs builds, save the shrunk version to `resumes/<target>/resume/scholar.tex`.

### 3. Tight Margin Warning

The current resume is at the **absolute 2-page limit**. Even tiny text changes can push it to 3 pages due to LaTeX line-breaking differences. Key lessons:

- **Summary `\\` line breaks can cause overflow** — each `\\` forces a new rendered line, potentially adding vertical space. If adding `\\` to a summary pushes to 3 pages, shorten sentences (fewer words, shorter synonyms) rather than removing the `\\`. The left-margin rule is more important than word count.

- **Reordering bullets is NOT always safe** — while it doesn't change total content, different word-break patterns after reordering can change rendered line counts and push to 3 pages. Always build-verify after reordering.
- **Summary structure is critical** — the GP summary uses exactly 4 lines with `\\`. Changing to 3 lines (even shorter text) can overflow because `cvparagraph` renders differently. Always match the 4-line `\\` structure.
- **Rewriting sub-bullet text is allowed but must be incremental** — even same-length text can render differently (e.g., "streamlined the dev" vs "enabling secure" break at different points, adding an extra rendered line)
- **Always build-and-check after each edit** — rewrite one sub-bullet, build, verify `Pages: 2`. If overflow, shorten that bullet before moving to the next.
- **Start from GP text** — for job-targeted resumes, copy the proven-fitting GP text, reorder bullets, then rewrite sub-bullets one at a time with build verification after each.

### 4. Other Fixes for Overflow

| Overflow Source | File to Trim | Common Fixes |
|----------------|--------------|--------------|
| Page 1 (summary + experience) | `src/resume/summary.tex` | Shorten summary bullets |
| Page 1 (summary + experience) | `src/resume/experience.tex` | Remove oldest role, reduce bullet points |
| Page 2 (education + scholar + leadership) | `src/resume/scholar.tex` | Already auto-shrunk above |
| Page 2 (education + scholar + leadership) | `src/resume/leadership.tex` | Consolidate entries |

### 5. Check for LaTeX Warnings

```bash
grep -E 'Overfull|Underfull' src/resume.log
```

- **Overfull hbox**: line is too wide, needs rewording or spacing adjustment
- **Underfull hbox**: usually harmless, but check if content looks odd

### 6. Final Gate

**Exactly 2 pages, zero warnings.** Repeat build/fix cycle until both pass.

## Quick One-Liner

```bash
cd src && xelatex resume.tex && echo "---" && pdfinfo resume.pdf | grep Pages && grep -E 'Overfull|Underfull' resume.log || echo "No box warnings"
```
