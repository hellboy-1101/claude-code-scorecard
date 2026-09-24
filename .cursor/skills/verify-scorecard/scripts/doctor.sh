#!/usr/bin/env bash
# Read-only health check for a verify-scorecard instance.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="${SKILL_DIR}/run"
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"

fail() { echo "DOCTOR FAIL: $*" >&2; exit 1; }
ok() { echo "DOCTOR OK: $*"; }

[[ -f "${RUN_DIR}/base_url.txt" ]] || fail "missing ${RUN_DIR}/base_url.txt — run launch first"
[[ -f "${RUN_DIR}/dev.pid" ]] || fail "missing ${RUN_DIR}/dev.pid — run launch first"

BASE_URL="$(cat "${RUN_DIR}/base_url.txt")"
PID="$(cat "${RUN_DIR}/dev.pid")"
PORT="$(cat "${RUN_DIR}/port.txt" 2>/dev/null || echo "")"

kill -0 "${PID}" 2>/dev/null || fail "tracked pid ${PID} is not running"

CODE="$(curl -s -o /tmp/verify-scorecard-doctor-body.html -w '%{http_code}' "${BASE_URL}/" || true)"
[[ "${CODE}" == "200" ]] || fail "GET ${BASE_URL}/ returned HTTP ${CODE}"

BODY="$(cat /tmp/verify-scorecard-doctor-body.html)"
echo "${BODY}" | grep -q "Claude Code" || fail "home page missing expected 'Claude Code' branding"
echo "${BODY}" | grep -qE "無料で診断する|診断を始める" || fail "home page missing diagnosis CTA text"

# Port ownership: the listening process should be a descendant of our npm/next tree
if [[ -n "${PORT}" ]]; then
  LISTEN_INFO="$(ss -ltnp "sport = :${PORT}" 2>/dev/null || true)"
  echo "${LISTEN_INFO}" | grep -q ":${PORT}" || fail "nothing listening on port ${PORT}"
fi

# Package identity
PKG_NAME="$(node -p "require('${ROOT}/package.json').name")"
[[ "${PKG_NAME}" == "claude-code-scorecard" ]] || fail "unexpected package name: ${PKG_NAME}"

ok "url=${BASE_URL} pid=${PID} package=${PKG_NAME}"
ok "home contains Claude Code branding and diagnosis CTA"
exit 0
