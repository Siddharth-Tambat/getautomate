#!/usr/bin/env bash
# pre-push: scan every commit that is about to leave this machine (not yet on origin) with gitleaks.
set -euo pipefail

if ! command -v gitleaks >/dev/null; then
  echo "gitleaks not found. Install it: brew install gitleaks" >&2
  exit 1
fi

to="${PRE_COMMIT_TO_REF:-HEAD}"
# Deleting a remote branch pushes the zero sha: nothing to scan.
if [[ "$to" =~ ^0+$ ]]; then exit 0; fi

exec gitleaks git --log-opts="$to --not --remotes=origin" --redact --no-banner --verbose
