---
name: resume-pdf-check
description: Build resume PDF and validate. Handles backup/copy/xelatex/restore for resumes/ builds, enforces 2-page limit, auto-shrinks scholar on overflow. Use when building or checking a resume.
---

# Resume Build & Check

Use this skill to build a resume PDF and validate it. Covers two scenarios:

- **Jobs build** — build from customized `.tex` files under `resumes/<target>/`
- **Direct build** — build from `src/resume/` as-is (e.g., after manual edits)

## Layout Rule

| Page | Sections |
|------|----------|
| 1 | Summary, Work Experience |
| 2 | Education, Scholarship, Leadership |

## Source Files (Read-Only During Build)

Never modify `src/resume/*.tex` permanently — always restore from `.bak` after build.

| File | Role |
|------|------|
| `src/resume/summary.tex` | Default summary template |
| `src/resume/experience.tex` | Default experience template |
| `src/resume/scholar.tex` | Default scholar template |
| `src/resume.tex` | Main document (page layout, imports) |
| `awesome-cv.cls` | Class file (do not modify) |

---

## Jobs Build Procedure

When building from `resumes/<target>/resume/` (where `<target>` is `general` or a company name):

```bash
# Backup originals
cp src/resume/summary.tex src/resume/summary.tex.bak
cp src/resume/experience.tex src/resume/experience.tex.bak
cp src/resume/scholar.tex src/resume/scholar.tex.bak

# Copy tailored versions
cp resumes/<target>/resume/summary.tex src/resume/summary.tex
cp resumes/<target>/resume/experience.tex src/resume/experience.tex

# If scholar was customized
if [ -f resumes/<target>/resume/scholar.tex ]; then
  cp resumes/<target>/resume/scholar.tex src/resume/scholar.tex
fi

# Build
cd src && xelatex resume.tex

# Copy output
cp resume.pdf ../resumes/<target>/resume.pdf

# Restore originals
mv resume/summary.tex.bak resume/summary.tex
mv resume/experience.tex.bak resume/experience.tex
mv resume/scholar.tex.bak resume/scholar.tex
```

## Direct Build

When building after manual edits to `src/resume/*.tex`:

```bash
cd src && xelatex resume.tex
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

1. **Remove the least relevant project** (e.g., Pharmacy POS System)
2. **Shorten remaining descriptions** to single-line summaries
3. **Remove another project** if still overflowing (keep top 2)
4. **Collapse to minimal format** — remove `\begin{cvitems}` and use empty description braces `{}`

After each reduction, rebuild and re-check page count.

For jobs builds, save the shrunk version to `resumes/<target>/resume/scholar.tex`.

### 3. Tight Margin Warning

The current resume is at the **absolute 2-page limit**. Even tiny text changes can push it to 3 pages due to LaTeX line-breaking differences. Key lessons:

- **Reordering bullets is safe** — swapping the order of top-level bullet groups (with their sub-bullets intact) does not change rendered length
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
