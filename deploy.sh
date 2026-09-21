#!/usr/bin/env bash
#
# One-command publish to Cloudflare Pages.
# Uploads this folder as a new deployment — works even when the Cloudflare
# project is not connected to Git, so your changes go live immediately.
#
#   Usage:  ./deploy.sh
#   First run opens a browser to log into Cloudflare (you approve it there;
#   your credentials are never stored in this repo).
#
set -euo pipefail
cd "$(dirname "$0")"

# ---- EDIT THIS if your Cloudflare Pages project has a different name ----
PROJECT="books-hamcodes"
# ------------------------------------------------------------------------

echo "→ Publishing this folder to Cloudflare Pages project: $PROJECT"
npx --yes wrangler@latest pages deploy . \
  --project-name="$PROJECT" \
  --branch=main \
  --commit-dirty=true

echo "✓ Done. The deployment URL is printed above; your custom domain updates within ~1 minute."
