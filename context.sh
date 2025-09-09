#!/bin/bash

# Claude Context Manager - Einfaches Kontext-System für Claude Code
# Setup-Script für persistente Projektkontexte

PROJECT_DIR=".claude"
CONTEXT_FILE="$PROJECT_DIR/context.json"
CHECKPOINT_DIR="$PROJECT_DIR/checkpoints"
DECISIONS_FILE="$PROJECT_DIR/decisions.md"

# Initialisiere Kontext-System
init_context() {
    echo "🚀 Initialisiere Claude Context System..."
    
    # Erstelle Verzeichnisstruktur
    mkdir -p "$PROJECT_DIR"
    mkdir -p "$CHECKPOINT_DIR"
    
    # Erstelle initiale context.json
    cat > "$CONTEXT_FILE" << 'EOF'
{
  "project": {
    "name": "",
    "description": "",
    "startDate": "",
    "lastUpdate": ""
  },
  "currentState": {
    "phase": "initialization",
    "activeTask": "",
    "completedTasks": [],
    "pendingTasks": [],
    "blockers": []
  },
  "technicalContext": {
    "stack": [],
    "dependencies": {},
    "environment": {},
    "kritischeEntscheidungen": []
  },
  "checkpoints": {
    "latest": null,
    "autoSave": true,
    "interval": "after_major_changes"
  }
}
EOF
    
    # Erstelle Entscheidungs-Log
    cat > "$DECISIONS_FILE" << 'EOF'
# Projekt-Entscheidungen

## Format für Einträge:
<!-- 
Datum: YYYY-MM-DD
Entscheidung: Was wurde entschieden
Begründung: Warum diese Entscheidung
Alternativen: Welche anderen Optionen wurden erwogen
Auswirkungen: Was bedeutet das für das Projekt
-->

---
EOF
    
    # Erstelle Helper-Skripte
    create_helper_scripts
    
    echo "✅ Context System initialisiert!"
    echo "📁 Struktur erstellt in $PROJECT_DIR/"
}

# Erstelle Helper-Skripte für Claude Code
create_helper_scripts() {
    # Save Context Script
    cat > "$PROJECT_DIR/save-context.sh" << 'EOF'
#!/bin/bash
# Speichert aktuellen Kontext

CONTEXT_FILE=".claude/context.json"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Backup aktueller Kontext
cp "$CONTEXT_FILE" ".claude/checkpoints/context_$TIMESTAMP.json"

# Update lastUpdate Timestamp
jq --arg time "$(date -Iseconds)" '.project.lastUpdate = $time' "$CONTEXT_FILE" > tmp.json && mv tmp.json "$CONTEXT_FILE"

echo "✅ Kontext gespeichert: checkpoint_$TIMESTAMP"
EOF
    
    # Load Context Script  
    cat > "$PROJECT_DIR/load-context.sh" << 'EOF'
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
EOF
    
    # Update Task Script
    cat > "$PROJECT_DIR/update-task.sh" << 'EOF'
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
EOF
    
    # Add Decision Script
    cat > "$PROJECT_DIR/add-decision.sh" << 'EOF'
#!/bin/bash
# Fügt wichtige Entscheidung hinzu

DECISION=$1
REASON=$2
DECISIONS_FILE=".claude/decisions.md"
DATE=$(date +"%Y-%m-%d")

cat >> "$DECISIONS_FILE" << EOD

---
**Datum:** $DATE  
**Entscheidung:** $DECISION  
**Begründung:** $REASON  
**Status:** Aktiv  

EOD

# Auch in JSON speichern
jq --arg dec "$DECISION" --arg date "$DATE" \
   '.technicalContext.kritischeEntscheidungen += [{date: $date, decision: $dec}]' \
   ".claude/context.json" > tmp.json && mv tmp.json ".claude/context.json"

echo "📝 Entscheidung dokumentiert"
EOF
    
    # Crash Recovery Script
    cat > "$PROJECT_DIR/recover.sh" << 'EOF'
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
EOF
    
    # Mache Scripts ausführbar
    chmod +x "$PROJECT_DIR"/*.sh
}

# Status Anzeige Funktion
show_status() {
    cat << 'EOF'

📦 Claude Context Manager - Verwendung:
=========================================

INITIALISIERUNG:
  ./init-context.sh                 # Einmalig pro Projekt

WÄHREND DER ARBEIT:
  .claude/load-context.sh           # Kontext laden (nach Crash/Neustart)
  .claude/update-task.sh start "Task" # Task starten
  .claude/update-task.sh complete "Task" # Task abschließen
  .claude/save-context.sh           # Checkpoint erstellen
  .claude/add-decision.sh "Was" "Warum" # Entscheidung dokumentieren

BEI PROBLEMEN:
  .claude/recover.sh                # Letzten Checkpoint wiederherstellen

KONTEXT-DATEIEN:
  .claude/context.json              # Aktueller Zustand
  .claude/decisions.md              # Entscheidungs-Historie
  .claude/checkpoints/               # Automatische Backups

BEISPIEL-WORKFLOW:
  1. ./init-context.sh
  2. .claude/update-task.sh add "API erstellen"
  3. .claude/update-task.sh start "API erstellen"
  4. # ... Arbeit ...
  5. .claude/add-decision.sh "REST statt GraphQL" "Einfacher für MVP"
  6. .claude/update-task.sh complete "API erstellen"
  7. .claude/save-context.sh

TIPP: Füge zu deiner .gitignore hinzu:
  .claude/checkpoints/
  # aber NICHT .claude/context.json und .claude/decisions.md

EOF
}

# Hauptprogramm
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    show_status
else
    init_context
    show_status
fi