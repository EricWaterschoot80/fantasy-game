#!/bin/bash
# Regenereert de geobfusceerde .min.js uit de leesbare bron (.js).
# Bewerk altijd de leesbare js/<naam>.js; draai daarna dit script en bump de ?v= in index.html + sw.js.
set -e
for game in ravenholt ravenholt-deel2; do
  for f in sprites scenes data engine; do
    npx -y terser "games/$game/js/$f.js" -c -m -o "games/$game/js/$f.min.js"
  done
  echo "geobfusceerd: $game"
done
