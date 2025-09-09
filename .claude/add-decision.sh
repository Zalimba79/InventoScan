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
