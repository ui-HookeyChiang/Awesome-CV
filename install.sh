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

set -euo pipefail

ROOT="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || echo "${BASH_SOURCE[0]}")")" && pwd)"
USER_SKILLS_DIR="${HOME}/.claude/skills"
REPO_SKILLS_DIR="$ROOT/.claude/skills"
PRESENT_DIR="$ROOT/src/present"

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

install_hint() {
    # $1 = binary name, $2 = platform
    local bin="$1" platform="$2"
    case "$bin:$platform" in
        xelatex:macos)   echo "  brew install --cask mactex-no-gui   # or: brew install --cask basictex" ;;
        xelatex:linux)   echo "  sudo apt-get install texlive-xetex texlive-fonts-extra" ;;
        pdfinfo:macos)   echo "  brew install poppler" ;;
        pdfinfo:linux)   echo "  sudo apt-get install poppler-utils" ;;
        node:macos|npm:macos)   echo "  brew install node" ;;
        node:linux|npm:linux)   echo "  sudo apt-get install nodejs npm   # or use nvm: https://github.com/nvm-sh/nvm" ;;
        *)               echo "  install '$bin' via your system package manager" ;;
    esac
}

check_deps() {
    local platform missing=()
    platform="$(detect_platform)"

    echo "==> checking required binaries (platform: $platform)"
    for bin in xelatex pdfinfo node npm; do
        if command -v "$bin" >/dev/null 2>&1; then
            printf "ok:     %-10s → %s\n" "$bin" "$(command -v "$bin")"
        else
            printf "MISS:   %s\n" "$bin"
            missing+=("$bin")
        fi
    done

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "" >&2
        echo "error: missing ${#missing[@]} required binar$([[ ${#missing[@]} -eq 1 ]] && echo 'y' || echo 'ies'):" >&2
        for bin in "${missing[@]}"; do
            echo "  - $bin" >&2
            install_hint "$bin" "$platform" >&2
        done
        echo "" >&2
        echo "install the missing binaries, then re-run ./install.sh" >&2
        exit 1
    fi
}

# ----------------------------------------------------------------------
# Step 2: install Node deps for the slide assembler / pptx generator
# ----------------------------------------------------------------------
npm_install_present() {
    if [[ ! -f "$PRESENT_DIR/package.json" ]]; then
        echo "skip:   no package.json in $PRESENT_DIR (skipping npm install)"
        return
    fi
    echo ""
    echo "==> installing Node deps in src/present/"
    (cd "$PRESENT_DIR" && npm install --no-audit --no-fund)
}

# ----------------------------------------------------------------------
# Step 3: symlink skills
# ----------------------------------------------------------------------
link_skills() {
    if [[ ! -d "$REPO_SKILLS_DIR" ]]; then
        echo "error: $REPO_SKILLS_DIR not found" >&2
        exit 1
    fi

    echo ""
    echo "==> linking Awesome-CV skills → $USER_SKILLS_DIR"
    mkdir -p "$USER_SKILLS_DIR"

    local skill_count=0 collision_count=0
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
                echo "ok:     $name (already linked)"
                continue
            fi
            echo "relink: $name (was → $existing)"
            rm "$dst"
            ln -s "$src" "$dst"
        elif [[ -e "$dst" ]]; then
            echo "SKIP:   $name — $dst exists and is not our symlink (refusing to overwrite)" >&2
            collision_count=$((collision_count + 1))
            continue
        else
            echo "link:   $name → $src"
            ln -s "$src" "$dst"
        fi
        skill_count=$((skill_count + 1))
    done

    echo ""
    echo "==> done. linked $skill_count skill(s); $collision_count collision(s)."
    if [[ $collision_count -gt 0 ]]; then
        echo "    resolve collisions manually before re-running." >&2
        exit 1
    fi
}

# ----------------------------------------------------------------------
# main
# ----------------------------------------------------------------------
check_deps
npm_install_present
link_skills
