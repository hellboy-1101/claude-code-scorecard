#!/usr/bin/env bash
# Tear down the verify-scorecard instance started by launch.sh.
# Never deletes evidence under artifacts/.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="${SKILL_DIR}/run"

if [[ ! -f "${RUN_DIR}/dev.pid" ]]; then
  echo "Nothing to clean (no ${RUN_DIR}/dev.pid)"
  exit 0
fi

PID="$(cat "${RUN_DIR}/dev.pid")"
PORT="$(cat "${RUN_DIR}/port.txt" 2>/dev/null || true)"

# Kill the process group rooted at the tracked npm pid, then any orphan next-server
# that still owns our recorded port. Never kill by process name globally.
if kill -0 "${PID}" 2>/dev/null; then
  # npm spawns next; kill the whole tree started from our shell job
  pkill -P "${PID}" 2>/dev/null || true
  kill "${PID}" 2>/dev/null || true
  sleep 0.5
  if kill -0 "${PID}" 2>/dev/null; then
    kill -9 "${PID}" 2>/dev/null || true
  fi
fi

# If a next-server still listens on our recorded port, kill only that listener pid
if [[ -n "${PORT:-}" ]]; then
  LISTENER_PIDS="$(ss -ltnp "sport = :${PORT}" 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u || true)"
  for LPID in ${LISTENER_PIDS}; do
    # Only kill if the command line looks like this repo's next server
    CMD="$(ps -p "${LPID}" -o args= 2>/dev/null || true)"
    if echo "${CMD}" | grep -q "claude-code-scorecard\|next-server\|next dev"; then
      kill "${LPID}" 2>/dev/null || true
      sleep 0.3
      kill -9 "${LPID}" 2>/dev/null || true
    fi
  done
fi

rm -f "${RUN_DIR}/dev.pid" "${RUN_DIR}/base_url.txt" "${RUN_DIR}/port.txt"
echo "Cleanup done. Evidence under ${SKILL_DIR}/artifacts/ is retained."
