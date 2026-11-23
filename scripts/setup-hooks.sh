#!/usr/bin/env bash
# One-time setup per clone: .venv with pre-commit, then the gitleaks pre-commit and pre-push hooks.
set -euo pipefail
cd "$(dirname "$0")/.."

command -v gitleaks >/dev/null || { echo "Install gitleaks first: brew install gitleaks" >&2; exit 1; }
[[ -d .venv ]] || python3 -m venv .venv
.venv/bin/pip install -q -r requirements-dev.txt
.venv/bin/pre-commit install
echo "Hooks ready: gitleaks scans staged changes on commit and outgoing commits on push."
