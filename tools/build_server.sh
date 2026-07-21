#!/usr/bin/env bash
set -euo pipefail

# Copies core/server/ into sites/<site>/docs/server/, overwriting shared files only.
# Usage: tools/build_server.sh <site>

site="$1"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
site_server_dir="$repo_root/sites/$site/docs/server"

if [ ! -d "$repo_root/sites/$site" ]; then
  echo "No such site: $site"
  exit 1
fi

mkdir -p "$site_server_dir"
cp -r "$repo_root/core/server/." "$site_server_dir/"

echo "Assembled core/server/ into sites/$site/docs/server/"
