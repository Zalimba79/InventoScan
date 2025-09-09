#!/bin/bash
# Stellt letzten funktionierenden Zustand wieder her

CHECKPOINT_DIR=".claude/checkpoints"
LATEST=$(ls -t "$CHECKPOINT_DIR"/context_*.json 2>/dev/null | head -1)

if [ -z "$LATEST" ]; then
    echo "❌ Keine Checkpoints gefunden"
    exit 1
fi

echo "🔄 Stelle wieder her von: $(basename $LATEST)"
cp "$LATEST" ".claude/context.json"
./load-context.sh
