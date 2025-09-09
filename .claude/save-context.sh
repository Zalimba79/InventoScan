#!/bin/bash
# Speichert aktuellen Kontext

CONTEXT_FILE=".claude/context.json"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Backup aktueller Kontext
cp "$CONTEXT_FILE" ".claude/checkpoints/context_$TIMESTAMP.json"

# Update lastUpdate Timestamp
jq --arg time "$(date -Iseconds)" '.project.lastUpdate = $time' "$CONTEXT_FILE" > tmp.json && mv tmp.json "$CONTEXT_FILE"

echo "✅ Kontext gespeichert: checkpoint_$TIMESTAMP"
