#!/usr/bin/env bash
# Launch Claude Code Scorecard (Next.js) for verification on an isolated port.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="${SKILL_DIR}/run"
PORT="${VERIFY_SCORECARD_PORT:-4310}"
HOST="${VERIFY_SCORECARD_HOST:-127.0.0.1}"
BASE_URL="http://${HOST}:${PORT}"

mkdir -p "${RUN_DIR}"

if [[ -f "${RUN_DIR}/dev.pid" ]]; then
  OLD_PID="$(cat "${RUN_DIR}/dev.pid")"
  if kill -0 "${OLD_PID}" 2>/dev/null; then
    echo "Already running: pid=${OLD_PID} url=${BASE_URL}"
    echo "${BASE_URL}" > "${RUN_DIR}/base_url.txt"
    exit 0
  fi
fi

# Refuse if something else already owns the port
if ss -ltn "sport = :${PORT}" 2>/dev/null | grep -q ":${PORT}"; then
  echo "ERROR: port ${PORT} is already in use by a process not tracked by this skill." >&2
  echo "Set VERIFY_SCORECARD_PORT to a free port, or stop the other process." >&2
  exit 1
fi

cd "${ROOT}"
if [[ ! -d node_modules ]]; then
  npm ci
fi

: > "${RUN_DIR}/dev.log"
PORT="${PORT}" npm run dev -- -p "${PORT}" -H "${HOST}" >> "${RUN_DIR}/dev.log" 2>&1 &
echo $! > "${RUN_DIR}/dev.pid"
echo "${BASE_URL}" > "${RUN_DIR}/base_url.txt"
echo "${PORT}" > "${RUN_DIR}/port.txt"

# Wait until ready (Ready log or HTTP 200)
for i in $(seq 1 60); do
  if curl -sf -o /dev/null "${BASE_URL}/"; then
    echo "Ready: ${BASE_URL} (pid=$(cat "${RUN_DIR}/dev.pid"))"
    exit 0
  fi
  sleep 0.5
done

echo "ERROR: app did not become ready within 30s. See ${RUN_DIR}/dev.log" >&2
exit 1
