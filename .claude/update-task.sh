#!/bin/bash
# Aktualisiert Task-Status

CONTEXT_FILE=".claude/context.json"
ACTION=$1
TASK=$2

case $ACTION in
    "start")
        jq --arg task "$TASK" '.currentState.activeTask = $task' "$CONTEXT_FILE" > tmp.json && mv tmp.json "$CONTEXT_FILE"
        echo "▶️ Gestartet: $TASK"
        ;;
    "complete")
        jq --arg task "$TASK" '
            .currentState.completedTasks += [$task] |
            .currentState.pendingTasks -= [$task] |
            .currentState.activeTask = ""
        ' "$CONTEXT_FILE" > tmp.json && mv tmp.json "$CONTEXT_FILE"
        ./save-context.sh
        echo "✅ Abgeschlossen: $TASK"
        ;;
    "add")
        jq --arg task "$TASK" '.currentState.pendingTasks += [$task]' "$CONTEXT_FILE" > tmp.json && mv tmp.json "$CONTEXT_FILE"
        echo "➕ Hinzugefügt: $TASK"
        ;;
    "block")
        jq --arg task "$TASK" '.currentState.blockers += [$task]' "$CONTEXT_FILE" > tmp.json && mv tmp.json "$CONTEXT_FILE"
        echo "🚫 Blockiert: $TASK"
        ;;
esac
