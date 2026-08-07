#!/usr/bin/env bash
# install.sh — initialize Awesome-CV project for local development
#
# Idempotent. Run once after `git clone`, and after any `git pull` that
# adds new skills or bumps Node deps.
#
# What it does:
#   1. Verify required binaries are installed (xelatex, pdfinfo, node, npm).
#      Missing binaries → print platform-specific install hint, then exit.
#   2. Run `npm install` inside src/present/ so the slide assembler and
#      pptx generator can run.
#   3. Symlink Awesome-CV Claude Code skills into ~/.claude/skills/.
#
# Conflict policy for skills:
#   - If ~/.claude/skills/<name> exists and is NOT already a symlink to
#     OUR copy, refuse and warn. Never overwrite real directories or
#     unrelated symlinks. Resolve manually, then re-run.

if (( BASH_VERSINFO[0] < 4 )); then
  for b in /opt/homebrew/bin/bash /usr/local/bin/bash; do
    [[ -x "$b" ]] && exec "$b" "$0" "$@"
  done
  echo "error: bash 4+ required; brew install bash" >&2
  exit 1
fi

set -euo pipefail

# ── Colors ───────────────────────────────────────────────────────────────
if [[ -t 1 ]] && command -v tput >/dev/null 2>&1 && [[ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]]; then
  BOLD=$(tput bold); DIM=$(tput dim); RESET=$(tput sgr0)
  GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3); RED=$(tput setaf 1); BLUE=$(tput setaf 4)
else
  BOLD=""; DIM=""; RESET=""; GREEN=""; YELLOW=""; RED=""; BLUE=""
fi

# ── Resolve ROOT ─────────────────────────────────────────────────────────
resolve_path() {
  local target="$1"
  cd "$(dirname "$target")"
  target="$(basename "$target")"
  while [[ -L "$target" ]]; do
    target="$(readlink "$target")"
    cd "$(dirname "$target")"
    target="$(basename "$target")"
  done
  printf '%s/%s' "$(pwd -P)" "$target"
}
ROOT="$(dirname "$(resolve_path "${BASH_SOURCE[0]}")")"
USER_SKILLS_DIR="${HOME}/.claude/skills"
REPO_SKILLS_DIR="$ROOT/.claude/skills"
PRESENT_DIR="$ROOT/src/present"

TOTAL_STEPS=3
CURRENT_STEP=0

step() {
  (( ++CURRENT_STEP ))
  printf '\n%s%s[%s/%s]%s %s\n' "$BOLD" "$BLUE" "$CURRENT_STEP" "$TOTAL_STEPS" "$RESET" "$1"
}

ok()   { printf '  %s✓%s %s\n' "$GREEN" "$RESET" "$1"; }
skip() { printf '  %s-%s %s\n' "$DIM" "$RESET" "$1"; }
warn() { printf '  %s⚠ %s%s\n' "$YELLOW" "$1" "$RESET"; }
fail() { printf '  %s✗ %s%s\n' "$RED" "$1" "$RESET"; }

# ----------------------------------------------------------------------
# Step 1: check required binaries
# ----------------------------------------------------------------------
detect_platform() {
  case "$(uname -s)" in
    Darwin)  echo "macos" ;;
    Linux)   echo "linux" ;;
    *)       echo "other" ;;
  esac
}

declare -A INSTALL_HINTS=(
  [xelatex:macos]="brew install --cask mactex-no-gui   # or: brew install --cask basictex"
  [xelatex:linux]="sudo apt-get install texlive-xetex texlive-fonts-extra"
  [pdfinfo:macos]="brew install poppler"
  [pdfinfo:linux]="sudo apt-get install poppler-utils"
  [node:macos]="brew install node"
  [npm:macos]="brew install node"
  [node:linux]="sudo apt-get install nodejs npm   # or use nvm: https://github.com/nvm-sh/nvm"
  [npm:linux]="sudo apt-get install nodejs npm   # or use nvm: https://github.com/nvm-sh/nvm"
)

install_hint() {
  local key="$1:$2"
  echo "  ${INSTALL_HINTS[$key]:-install '$1' via your system package manager}"
}

check_deps() {
  local platform missing=()
  platform="$(detect_platform)"

  step "Checking required binaries (platform: $platform)"
  for bin in xelatex pdfinfo node npm; do
    if command -v "$bin" >/dev/null 2>&1; then
      ok "$(printf '%-10s → %s' "$bin" "$(command -v "$bin")")"
    else
      fail "$bin not found"
      missing+=("$bin")
    fi
  done

  if [[ ${#missing[@]} -gt 0 ]]; then
    echo "" >&2
    printf '%s%serror:%s missing %d required binar%s:\n' "$BOLD" "$RED" "$RESET" \
      "${#missing[@]}" "$([[ ${#missing[@]} -eq 1 ]] && echo 'y' || echo 'ies')" >&2
    for bin in "${missing[@]}"; do
      echo "  - $bin" >&2
      install_hint "$bin" "$platform" >&2
    done
    echo "" >&2
    echo "Install the missing binaries, then re-run ./install.sh" >&2
    exit 1
  fi
}

# ----------------------------------------------------------------------
# Step 2: install Node deps for the slide assembler / pptx generator
# ----------------------------------------------------------------------
npm_install_present() {
  step "Node dependencies (src/present/)"

  if [[ ! -f "$PRESENT_DIR/package.json" ]]; then
    skip "no package.json in src/present/ — nothing to install"
    return
  fi

  if [[ -d "$PRESENT_DIR/node_modules" ]] && \
     [[ "$PRESENT_DIR/node_modules/.package-lock.json" -nt "$PRESENT_DIR/package.json" ]]; then
    skip "node_modules up to date"
    return
  fi

  (cd "$PRESENT_DIR" && npm install --no-audit --no-fund)
  ok "npm install complete"
}

# ----------------------------------------------------------------------
# Step 3: symlink skills
# ----------------------------------------------------------------------
link_skills() {
  step "Linking skills → $USER_SKILLS_DIR"

  if [[ ! -d "$REPO_SKILLS_DIR" ]]; then
    fail "$REPO_SKILLS_DIR not found"
    exit 1
  fi

  mkdir -p "$USER_SKILLS_DIR"

  local linked=0 unchanged=0 collisions=0
  for skill_dir in "$REPO_SKILLS_DIR"/*/; do
    [[ -d "$skill_dir" ]] || continue
    local name src dst
    name="$(basename "$skill_dir")"
    src="${skill_dir%/}"
    dst="$USER_SKILLS_DIR/$name"

    if [[ -L "$dst" ]]; then
      local existing
      existing="$(readlink "$dst")"
      if [[ "$existing" == "$src" ]]; then
        (( ++unchanged )) || true
        continue
      fi
      rm "$dst"
      ln -s "$src" "$dst"
      ok "$name (relinked, was → $existing)"
      (( ++linked )) || true
    elif [[ -e "$dst" ]]; then
      warn "$name — $dst exists and is not our symlink (refusing to overwrite)"
      (( ++collisions )) || true
    else
      ln -s "$src" "$dst"
      ok "$name"
      (( ++linked )) || true
    fi
  done

  [[ $unchanged -gt 0 ]] && skip "$unchanged skill(s) already linked"
  [[ $linked -gt 0 ]]    && ok "$linked skill(s) linked"

  if [[ $collisions -gt 0 ]]; then
    fail "$collisions collision(s) — resolve manually, then re-run"
    exit 1
  fi
}

# ----------------------------------------------------------------------
# main
# ----------------------------------------------------------------------
printf '%s%s  Awesome-CV setup%s\n' "$BOLD" "$BLUE" "$RESET"

check_deps
npm_install_present
link_skills

printf '\n%s%s  ✓ All done%s\n\n' "$BOLD" "$GREEN" "$RESET"
