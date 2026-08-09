# Test stages

Declares which flow test stages exist in this repo. A stage that is not listed
here is undeclared, and flow reports it as SKIPPED rather than as a failure.

| Stage | Command | Needs | Gate |
|-------|---------|-------|------|
| integration | `make test-integration` | TeX Live with `lualatex`, the Source Sans Pro and FontAwesome 6 fonts | Every example document (`coverletter`, `cv`, `resume`) compiles to a PDF; non-zero exit fails the stage. |

## Undeclared stages

`unit` and `e2e` are deliberately absent. This is a LaTeX document repository:
there are no units to test in isolation, and the rendered PDF is the final
artifact, so there is no end-to-end layer beyond compilation. The build-compiles
check above is the only meaningful automated tier, and it is what CI already
runs (`.github/workflows/main.yml`).

## Note on `make check`

`make check` builds `src/resume.tex` with `xelatex` and asserts a two-page
result. It is not wired as a test stage because it resolves fonts through
fontconfig, which needs a font family named exactly "Source Sans Pro"; machines
that carry the "Source Sans 3" packaging fail it for environment reasons rather
than because the document is wrong. `test-integration` uses `lualatex`, which
resolves the font from the TeX Live tree and is therefore portable.
