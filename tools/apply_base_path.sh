#!/usr/bin/env bash
set -euo pipefail

# Rewrites root-absolute paths (src="/...", href="/...", `/...` template
# literals) in a built docs/ dir to be prefixed with a base path, for
# GitHub Pages subpath deploys. Only touches static hand-written files
# (docs/scripts/*.js, **/*.html) — webpack output (docs/dist) already
# bakes BASE_PATH in at build time via DefinePlugin.
#
# Usage: apply_base_path.sh <docs_dir> <base_path>
# Intended for CI use against a throwaway copy of docs/, never the
# checked-in source.

docs_dir="$1"
base_path="$2"

if [ -z "$base_path" ]; then
  echo "No base path given, nothing to rewrite."
  exit 0
fi

find "$docs_dir" \( -name '*.html' -o -path "$docs_dir/scripts/*.js" \) -print0 |
  while IFS= read -r -d '' f; do
    perl -pi -e "s{([\"'\`])/(?!/)}{\$1${base_path}/}g" "$f"
  done
