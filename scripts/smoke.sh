#!/bin/sh
# Manual smoke check — run while server is up: sh scripts/smoke.sh
set -e
BASE="${1:-http://127.0.0.1:5000}"
echo "Health..."
curl -sf "$BASE/api/v1/health" | head -c 200
echo ""
echo "Index..."
curl -sf -o /dev/null -w "%{http_code}\n" "$BASE/"
echo "Admin page..."
curl -sf -o /dev/null -w "%{http_code}\n" "$BASE/admin"
echo "OK"
