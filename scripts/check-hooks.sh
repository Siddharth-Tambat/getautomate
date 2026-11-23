#!/usr/bin/env bash
# Claude Code SessionStart hook: tell the agent (and the user) when the gitleaks pre-commit hook is missing.
# Silent when everything is set up. Never fails the session: it only reports.
cd "$(dirname "$0")/.." || exit 0

problems=()
command -v gitleaks >/dev/null || problems+=("gitleaks is not installed (brew install gitleaks)")
hook="$(git rev-parse --git-path hooks/pre-commit 2>/dev/null)"
if [[ -z "$hook" || ! -f "$hook" ]] || ! grep -q "pre-commit" "$hook" 2>/dev/null; then
  problems+=("the pre-commit hook is not installed in this clone")
fi
[[ ${#problems[@]} -eq 0 ]] && exit 0

msg="Secret scanning is not set up: $(IFS=';'; echo "${problems[*]}"). Run scripts/setup-hooks.sh once."
ctx="$msg BEFORE doing anything else this session, tell the user this, ask them to confirm, and run scripts/setup-hooks.sh (install gitleaks with brew first if missing). Do not commit or continue other work until the hook is installed. Never bypass it with --no-verify."
python3 - "$msg" "$ctx" <<'PY'
import json, sys
print(json.dumps({"systemMessage": sys.argv[1],
  "hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": sys.argv[2]}}))
PY
