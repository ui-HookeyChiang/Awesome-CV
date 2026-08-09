# Ticket: `make check` fails off-CI — font name mismatch

Status: needs-triage

## Description

`awesome-cv.cls:85` requests the font family `Source Sans Pro`, but at least one
local machine provides only `Source Sans 3`. `make check` builds through
`xelatex`, which resolves fonts via fontconfig, so it aborts there. `make
examples` builds through `lualatex`, which resolves the same font from the TeX
Live tree (`texmf-dist/fonts/opentype/adobe/sourcesanspro/`), and passes.

CI does not catch this: `.github/workflows/main.yml` installs
`fonts-adobe-sourcesans3` and runs `make` (the `examples` target), never `make
check`. The failure therefore only appears on developer machines.

Discovered while wiring `make test-integration`
(`docs/agents/test-stages.md`); `make check` was skipped as the integration
gate for this reason.

## Evidence

`make check` on macOS, TeX Live 2025:

```
! Package fontspec Error:
(fontspec)                The font "Source Sans Pro" cannot be found; this
...
No pages of output.
make: *** [resume] Error 1
```

Families actually installed on that machine:

```
$ fc-list : family | tr ',' '\n' | grep -i "source sans" | sort -u
Source Sans 3
Source Sans 3 ExtraLight
```

## Open questions for triage

- Is `make check` still intended to run locally, or has `make examples` become
  the real gate? If the latter, `check`/`resume` may be dead targets.
- Fix direction: make the class fall back across family names, pin the xelatex
  path to the TeX Live font file, or document a required font install in
  `install.sh`.
- The two build paths disagree on engine (`xelatex` vs `lualatex`) and source
  tree (`src/resume.tex` vs `examples/`). Worth deciding whether both should
  survive.

## Non-goals

Not fixed here. This ticket only records the failure; the
`feat/test-layout-migration` branch deliberately left `awesome-cv.cls` and the
`check`/`resume` targets untouched.
