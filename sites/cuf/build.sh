#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e 

echo "Building with webpack..."
webpack --config webpack.prod.js

echo "Copying build files into new releases folder"
mkdir -p releases/new_release
(
  GLOBIGNORE=".:.." # Exclude . and .. from glob matches
  cp -r -a ./docs/. ./releases/new_release/
)

echo "Deleting unnecesary files"
rm ./releases/new_release/.nojekyll
rm -r ./releases/new_release/data
rm ./releases/new_release/server/includes/config_path.php

echo "Zipping build files for deployment"
(
  read -p "Enter a name for the zip file: " zip_name
  if [ -z "$zip_name" ]; then
    echo "Error: Zip file name cannot be empty. Aborting."
    exit 1
  fi
  cd ./releases/new_release && zip -r "../${zip_name}.zip" .
)

echo "Deleting temp release files"
rm -r ./releases/new_release

echo "Finished successfully"
