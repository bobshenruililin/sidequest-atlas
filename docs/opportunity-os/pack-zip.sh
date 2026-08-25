#!/usr/bin/env bash
# Build docs/opportunity-os/opportunity-os.zip for one-shot attach to Grok.
# Unzip on the Bot computer in /workspace → /workspace/opportunity-os/CONSTITUTION.md
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/copy-to-grok"
OUT="$ROOT/opportunity-os.zip"
STAGING="$(mktemp -d)"
DEST="$STAGING/opportunity-os"

cleanup() { rm -rf "$STAGING"; }
trap cleanup EXIT

mkdir -p "$DEST"

# Bob-facing paste recipes stay in git; they are not the Bot disk.
cp -a "$SRC/." "$DEST/"
rm -f \
  "$DEST/START-HERE.md" \
  "$DEST/PASTE.md" \
  "$DEST/CORRECT-SCOUT.md" \
  "$DEST/PASTE-SCOUT-CORRECTIONS.md" \
  "$DEST/DO-NOT.md"
find "$DEST" -name '*.zip' -delete

(
  cd "$STAGING"
  rm -f "$OUT"
  zip -r -q "$OUT" opportunity-os
)

echo "Wrote $OUT ($(wc -c < "$OUT") bytes)"
unzip -l "$OUT" | head -80
