#!/bin/bash
# SessionStart hook for Claude Code on the web.
# Installs the dev dependencies (HTML linter + Playwright + three.js) so future
# sessions can immediately run `npm run lint` and `npm test` against the site.
set -euo pipefail

# Only run in the remote (web) environment; local dev is left untouched.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Chromium is pre-installed in the web environment; don't let npm fetch browsers.
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# `install` (not `ci`) so the cached container layer is reused on later runs.
npm install --no-audit --no-fund
