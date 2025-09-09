#!/bin/bash
# Lädt und zeigt aktuellen Kontext

CONTEXT_FILE=".claude/context.json"

if [ ! -f "$CONTEXT_FILE" ]; then
    echo "❌ Kein Kontext gefunden. Führe init aus."
    exit 1
fi

echo "📋 Aktueller Projekt-Kontext:"
echo "================================"
jq -r '
"Projekt: \(.project.name)
Phase: \(.currentState.phase)
Aktive Aufgabe: \(.currentState.activeTask)

✅ Erledigt (\(.currentState.completedTasks | length)):
\(.currentState.completedTasks | map("  - " + .) | join("\n"))

📝 Ausstehend (\(.currentState.pendingTasks | length)):
\(.currentState.pendingTasks | map("  - " + .) | join("\n"))

⚠️ Blocker:
\(.currentState.blockers | map("  - " + .) | join("\n"))

Tech-Stack: \(.technicalContext.stack | join(", "))
Letztes Update: \(.project.lastUpdate)"
' "$CONTEXT_FILE"
