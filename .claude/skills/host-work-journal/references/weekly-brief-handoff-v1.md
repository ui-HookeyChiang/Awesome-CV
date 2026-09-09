# Weekly brief handoff v1

This is the single producer contract for a weekly brief. It is deliberately
separate from the existing `log-entry` frontmatter so reports remain valid
for the journal pipeline and do not depend on the unavailable llm-wiki schema.

## Eligibility

An eligible artifact is exactly one integrated Markdown report at:

```text
journal/integrated/work-report_<HOST>_<START>-to-<END>.md
```

`<START>` and `<END>` are inclusive ISO calendar dates (`YYYY-MM-DD`), and
`START <= END`. The report's handoff block must repeat the same path and date
range. `journal/raw/` is an inbox: a raw report, an activity-only report, or a
report from any other directory is ineligible.

The artifact is produced by `host-work-journal`, including the journal
pipeline it invokes or owns (`journal-integrate-milestones`). That producer
owns collection, integration handoff, initiative/KD analysis, and canonical
work-report composition. `brief` is the consumer: it runs only for an
explicit weekly-brief presentation/transform request and transforms this
artifact. It does not collect, integrate, analyze initiatives/KD, or compose
another work report, and the producer does not emit a human-facing Slack
summary.

## Handoff block

Keep the report's existing `kind: log-entry` frontmatter unchanged. After the
frontmatter, include exactly one heading and YAML fence in this shape:

````markdown
## Weekly brief handoff v1

```yaml
weekly_brief_handoff:
  contract: weekly-brief-handoff
  version: 1
  stage: integrated
  artifact:
    path: journal/integrated/work-report_<HOST>_<START>-to-<END>.md
    pattern: journal/integrated/work-report_<HOST>_<START>-to-<END>.md
  producer:
    skill: host-work-journal
    pipeline: journal-integrate-milestones
  consumer:
    skill: brief
    mode: weekly-brief-presentation-transform
  date_range:
    start: <START>
    end: <END>
  outcomes: []
  evidence: []
  open_items: []
  risks: []
  decisions: []
  next_focus: []
```
````

The `pattern` value is a literal contract value, not a glob and not a
substitute for the concrete `artifact.path`.

Required semantic fields are `outcomes`, `evidence`, `open_items`, `risks`,
`decisions`, and `next_focus`. Each must exist as an array; an empty array is
valid. Each evidence item is a mapping with both non-empty `method` and
`verdict`. Each open item is a mapping with `item`, `status`, and `next_step`.
The only machine statuses are exactly:

```text
in_progress | blocked | decision_needed | done
```

An unknown status, missing field, missing evidence method/verdict pair,
activity-only input, raw path, wrong stage, or mismatched date range makes the
handoff invalid. Weekly-brief presentation fails closed rather than presenting
an unverified or visibly degraded report.

## Deterministic validation

Validate a report before handing it to `brief`:

```bash
python3 .claude/skills/host-work-journal/scripts/validate_weekly_brief_handoff.py \
  journal/integrated/work-report_<HOST>_<START>-to-<END>.md
```

The validator checks the existing `log-entry` frontmatter, the single v1 YAML
block, the exact artifact pattern, producer/consumer boundary, inclusive ISO
date range, required arrays, evidence pairing, and exact status enum. It must
return non-zero for any missing or malformed contract field. It does not run
collectors, integration jobs, or presentation transforms.
