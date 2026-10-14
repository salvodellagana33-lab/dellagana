#!/usr/bin/env bash
# Copies exactly the files that ship into a fresh folder and checks them.
# Usage: tools/stage.sh [dest]   (default: a new temp folder). Prints the folder on success.
# It never deploys. See docs/deploy-staging.md for the deploy step.
set -euo pipefail
cd "$(dirname "$0")/.."

SHIP=(
  index.html styles.css main.js
  fonts/archivo-condensed-italic-850.woff2 fonts/inter-tight-var.woff2
  fonts/jetbrains-mono-var.woff2 fonts/instrument-serif-italic.woff2 fonts/OFL.txt
  cv.pdf og.jpg favicon.svg favicon.png apple-touch-icon.png robots.txt sitemap.xml _headers
)
# Project screenshots, once they exist, live in img/ and ship too.
[ -d img ] && while IFS= read -r f; do SHIP+=("$f"); done < <(find img -type f \( -name '*.avif' -o -name '*.webp' -o -name '*.jpg' \) | sort)

DEST="${1:-$(mktemp -d -t dellagana-stage-XXXXXX)}"
mkdir -p "$DEST"
[ -z "$(ls -A "$DEST")" ] || { echo "stage: $DEST is not empty" >&2; exit 1; }
for f in "${SHIP[@]}"; do
  [ -f "$f" ] || { echo "stage: missing $f" >&2; exit 1; }
  mkdir -p "$DEST/$(dirname "$f")"; cp "$f" "$DEST/$f"
done

fail=0
# 1. Nothing private or internal made it in.
for bad in docs DESIGN.md wrangler.jsonc tools .superpowers .git node_modules; do
  [ -e "$DEST/$bad" ] && { echo "FAIL: $bad is in the staged folder"; fail=1; }
done
# 2. No phone number anywhere, including the PDF text.
PHONE='(\+44[ -]?|(^|[^0-9])0)7[0-9]{3}[ -]?[0-9]{3}[ -]?[0-9]{3}'
if grep -rEIl "$PHONE" "$DEST"; then echo "FAIL: phone-like number in the files above"; fail=1; fi
if command -v pdftotext >/dev/null; then
  pdftotext "$DEST/cv.pdf" - | grep -Eq "$PHONE" && { echo "FAIL: phone-like number in cv.pdf"; fail=1; }
else
  echo "FAIL: install pdftotext (brew install poppler) so cv.pdf can be checked"; fail=1
fi
# 3. Content rules from the spec.
grep -rIil 'instagram' "$DEST" && { echo "FAIL: Instagram is mentioned"; fail=1; }
grep -rIil 'paying client' "$DEST" && { echo "FAIL: say '8 clients', not 'paying clients'"; fail=1; }

[ "$fail" = 0 ] || { echo "stage: checks failed, nothing to deploy" >&2; exit 1; }
echo "$DEST"
