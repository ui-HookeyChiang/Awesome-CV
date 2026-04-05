---
name: journal-integrate
description: Top-level orchestrator for the full journal pipeline. Runs journal-integrate-milestones (enrich milestone docs from journal/git-sar data), then sar-extraction (extract SAR case studies from enriched milestones), then moves consumed git-sar dirs to integrated/. Use when the user says "integrate journals", "run the journal pipeline", "process journals and extract SARs", or invokes /journal-integrate. Also use when git-sar data exists in raw/ and both milestones and case studies need updating.
argument-hint: "[topics for sar-extraction, e.g. 'grpc-streamer system-perf']"
---

# Journal Integration Orchestrator

Coordinates the full journal-to-presentation pipeline by running two sub-skills in sequence, then cleaning up consumed data.

## Pipeline

```
journal/raw/git-sar/  ──┐
journal/raw/*.md      ──┤
                        ▼
           Step 1: journal-integrate-milestones
                   (enrich milestone/*.md + milestone/summary.md)
                        │
                        ▼
           Step 2: sar-extraction
                   (extract case studies → fragments/case-studies/*.html)
                        │
                        ▼
           Step 3: Move consumed git-sar/ to journal/integrated/
```

## Step 1: Milestone Integration

Invoke `/journal-integrate-milestones` — this runs the full pipeline:
- Triage raw files
- Refine weekly reports (translate, standardize)
- Integrate achievements into `milestone/<company>.md` (enriched with git-sar commit data)
- Extract highlights into `milestone/summary.md`
- Move refined weekly reports to `integrated/`
- **Do NOT move git-sar/ dirs yet** — Step 2 still needs them

After Step 1 completes, confirm with the user before proceeding to Step 2.

## Step 2: SAR Extraction

Invoke `/sar-extraction` with the user's topic arguments (if provided).

**If topics provided** (e.g., `grpc-streamer system-perf`): extract case studies for each topic.

**If no topics provided**: run sar-extraction in discover mode — scan milestones for new SAR candidates, present them, let user pick.

**Skip conditions**: If all git-sar categories already have case studies (check `src/present/fragments/case-studies/`), report this and skip to Step 3.

After Step 2 completes, confirm results with the user before proceeding to Step 3.

## Step 3: Move Consumed git-sar/

After both pipelines have run, move consumed `git-sar/<date>/` directories from `raw/` to `integrated/`:

```bash
# For each git-sar date directory that was consumed by both steps:
mv journal/raw/git-sar/<date>/ journal/integrated/git-sar/<date>/
```

**Pre-move checklist**:
1. Verify Step 1 completed (milestone sections updated for this date range)
2. Verify Step 2 completed (case studies extracted, or user explicitly skipped)
3. Check `journal/raw/git-sar/<date>/other.md` — if it has >5 commits with recurring themes, suggest a new category to `_shared/categories.md` before moving

**Do NOT move if**:
- Step 1 or Step 2 was skipped or failed
- User asked to keep files in `raw/` for further review

## Partial Runs

The sub-skills remain independently invocable. This orchestrator is for running the full pipeline:

| User Request | Action |
|---|---|
| "integrate journals" | Full pipeline (Steps 1-3) |
| "integrate journals, skip SAR" | Step 1 only, leave git-sar in raw/ |
| "extract SAR for X" | Use `/sar-extraction` directly (no orchestrator needed) |
| "update milestones from journals" | Use `/journal-integrate-milestones` directly |
| "process journals and extract SARs for X Y" | Full pipeline with topics X Y |

## Sub-skills

- `/journal-integrate-milestones` — Step 1 (milestone enrichment)
- `/sar-extraction` — Step 2 (case study extraction)
