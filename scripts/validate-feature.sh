#!/bin/bash

# InventoScan Feature Validation Script
# Automatische Validierung für neue Features

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 InventoScan Feature Validation"
echo "═══════════════════════════════════════════════════════════════"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Check for hardcoded colors
echo -e "\n${BLUE}1. Checking for hardcoded colors...${NC}"
HARDCODED_COLORS=$(grep -r "#[0-9a-fA-F]\{3,6\}" --include="*.css" --include="*.tsx" frontend/src/components/ 2>/dev/null | grep -v "design-tokens.css" | grep -v ".md" || true)

if [ -z "$HARDCODED_COLORS" ]; then
  echo -e "${GREEN}✅ No hardcoded colors found${NC}"
else
  echo -e "${RED}❌ Hardcoded colors found:${NC}"
  echo "$HARDCODED_COLORS"
  ERRORS=$((ERRORS + 1))
fi

# 2. Check for design token usage
echo -e "\n${BLUE}2. Checking design token usage...${NC}"
TOKEN_COUNT=$(grep -r "var(--" --include="*.css" --include="*.tsx" frontend/src/components/ 2>/dev/null | wc -l || echo 0)

if [ "$TOKEN_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Design tokens used: $TOKEN_COUNT instances${NC}"
else
  echo -e "${YELLOW}⚠️  No design tokens found - make sure to use CSS variables${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# 3. Check for UI component imports
echo -e "\n${BLUE}3. Checking UI component usage...${NC}"
UI_IMPORTS=$(grep -r "from.*['\"].*\/ui" --include="*.tsx" frontend/src/components/ 2>/dev/null | wc -l || echo 0)

if [ "$UI_IMPORTS" -gt 0 ]; then
  echo -e "${GREEN}✅ UI components imported: $UI_IMPORTS files${NC}"
else
  echo -e "${YELLOW}⚠️  No UI component imports found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# 4. Check for old BaseComponents usage
echo -e "\n${BLUE}4. Checking for old BaseComponents...${NC}"
OLD_IMPORTS=$(grep -r "BaseComponents" --include="*.tsx" --include="*.ts" frontend/src/ 2>/dev/null || true)

if [ -z "$OLD_IMPORTS" ]; then
  echo -e "${GREEN}✅ No old BaseComponents imports${NC}"
else
  echo -e "${RED}❌ Old BaseComponents still in use:${NC}"
  echo "$OLD_IMPORTS"
  ERRORS=$((ERRORS + 1))
fi

# 5. Run ESLint
echo -e "\n${BLUE}5. Running ESLint...${NC}"
if npm run lint --silent 2>/dev/null; then
  echo -e "${GREEN}✅ ESLint passed${NC}"
else
  echo -e "${RED}❌ ESLint failed${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 6. Run TypeScript check
echo -e "\n${BLUE}6. Running TypeScript check...${NC}"
if npm run typecheck --silent 2>/dev/null; then
  echo -e "${GREEN}✅ TypeScript check passed${NC}"
else
  echo -e "${RED}❌ TypeScript check failed${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 7. Check if design-tokens.css is imported
echo -e "\n${BLUE}7. Checking design-tokens.css import...${NC}"
MAIN_CSS=$(grep -l "design-tokens.css" frontend/src/main.tsx frontend/src/index.tsx frontend/src/App.tsx 2>/dev/null || true)

if [ -n "$MAIN_CSS" ]; then
  echo -e "${GREEN}✅ design-tokens.css is imported${NC}"
else
  echo -e "${YELLOW}⚠️  design-tokens.css might not be imported globally${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# 8. Build test
echo -e "\n${BLUE}8. Running build test...${NC}"
if npm run build --silent 2>/dev/null; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed${NC}"
  ERRORS=$((ERRORS + 1))
fi

# Summary
echo -e "\n═══════════════════════════════════════════════════════════════"
echo -e "📊 VALIDATION SUMMARY"
echo -e "═══════════════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}🎉 Perfect! All checks passed with no issues!${NC}"
  echo -e "\n✅ Feature is ready for deployment!"
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}✅ Validation passed with $WARNINGS warning(s)${NC}"
  echo -e "\nConsider addressing the warnings for better code quality."
else
  echo -e "${RED}❌ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
  echo -e "\nPlease fix the errors above before proceeding."
  echo -e "\nRemember to:"
  echo -e "- Use CSS variables from design-tokens.css"
  echo -e "- Import UI components from @/components/ui"
  echo -e "- Follow the InventoScan Design System"
  exit 1
fi

echo -e "\n═══════════════════════════════════════════════════════════════"