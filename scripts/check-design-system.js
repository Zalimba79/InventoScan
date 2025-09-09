#!/usr/bin/env node

/**
 * Design System Validation Script
 * Prüft automatisch ob alle Komponenten dem Design System entsprechen
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Farben für Terminal-Output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

let errors = [];
let warnings = [];
let passed = [];

// Patterns die NICHT erlaubt sind
const forbiddenPatterns = {
  hardcodedColors: {
    pattern: /#[0-9a-fA-F]{3,6}(?![0-9a-fA-F])/g,
    message: 'Hardcoded color found. Use CSS variables from design-tokens.css',
    exclude: ['design-tokens.css', '.svg', '.md', 'check-design-system.js']
  },
  rgbColors: {
    pattern: /rgba?\([^)]+\)/g,
    message: 'RGB color found. Use CSS variables instead',
    exclude: ['design-tokens.css', '.svg', '.md', 'check-design-system.js']
  },
  hardcodedSpacing: {
    pattern: /padding:\s*\d+px|margin:\s*\d+px/g,
    message: 'Hardcoded spacing found. Use var(--space-*) variables',
    exclude: ['design-tokens.css']
  },
  oldComponents: {
    pattern: /from\s+['"].*BaseComponents['"]/g,
    message: 'Old BaseComponents import found. Use @/components/ui instead',
    exclude: []
  }
};

// Required patterns die vorhanden sein SOLLTEN
const requiredPatterns = {
  cssVariables: {
    pattern: /var\(--[\w-]+\)/g,
    message: 'CSS variables should be used',
    minCount: 1
  },
  transitions: {
    pattern: /transition.*var\(--transition-[\w]+\)/g,
    message: 'Transitions should use design system variables',
    minCount: 0
  }
};

// Dateien durchsuchen
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath);
  
  // Skip bestimmte Dateien
  if (fileName === 'check-design-system.js') return;
  
  let fileErrors = [];
  let fileWarnings = [];
  
  // Check forbidden patterns
  Object.entries(forbiddenPatterns).forEach(([name, rule]) => {
    // Skip wenn Datei ausgeschlossen ist
    if (rule.exclude.some(exc => filePath.includes(exc))) return;
    
    const matches = content.match(rule.pattern);
    if (matches) {
      matches.forEach(match => {
        // Spezielle Ausnahmen
        if (name === 'rgbColors' && match.includes('rgba(141, 123, 251')) {
          // Purple glow ist OK in bestimmten Fällen
          return;
        }
        
        fileErrors.push({
          file: filePath,
          issue: rule.message,
          found: match,
          line: getLineNumber(content, match)
        });
      });
    }
  });
  
  // Check required patterns für CSS/TSX Dateien
  if (fileExt === '.css' || fileExt === '.tsx') {
    Object.entries(requiredPatterns).forEach(([name, rule]) => {
      const matches = content.match(rule.pattern);
      const matchCount = matches ? matches.length : 0;
      
      if (matchCount < rule.minCount) {
        fileWarnings.push({
          file: filePath,
          issue: rule.message,
          expected: `at least ${rule.minCount}`,
          found: matchCount
        });
      }
    });
  }
  
  // UI Components Import Check
  if (fileExt === '.tsx' && !filePath.includes('/ui/')) {
    if (content.includes('Button') || content.includes('Card') || content.includes('Input')) {
      if (!content.includes("from '@/components/ui'") && 
          !content.includes('from "./ui"') &&
          !content.includes("from '../ui")) {
        fileWarnings.push({
          file: filePath,
          issue: 'UI components used but not imported from @/components/ui',
        });
      }
    }
  }
  
  errors = errors.concat(fileErrors);
  warnings = warnings.concat(fileWarnings);
  
  if (fileErrors.length === 0 && fileWarnings.length === 0) {
    passed.push(filePath);
  }
}

// Zeilennummer finden
function getLineNumber(content, searchStr) {
  const index = content.indexOf(searchStr);
  if (index === -1) return -1;
  return content.substring(0, index).split('\n').length;
}

// Hauptfunktion
function main() {
  console.log(`${colors.blue}🔍 Design System Validation Check${colors.reset}\n`);
  
  // Finde alle relevanten Dateien
  const componentFiles = glob.sync('frontend/src/components/**/*.{css,tsx}', {
    ignore: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/*.test.*',
      '**/*.spec.*'
    ]
  });
  
  console.log(`Checking ${componentFiles.length} files...\n`);
  
  // Prüfe jede Datei
  componentFiles.forEach(checkFile);
  
  // Report ausgeben
  console.log('═'.repeat(80));
  
  if (errors.length > 0) {
    console.log(`\n${colors.red}❌ ERRORS (${errors.length})${colors.reset}\n`);
    errors.forEach(error => {
      console.log(`${colors.red}✗${colors.reset} ${error.file}`);
      console.log(`  Line ${error.line}: ${error.issue}`);
      console.log(`  Found: "${error.found}"`);
      console.log();
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}⚠️  WARNINGS (${warnings.length})${colors.reset}\n`);
    warnings.forEach(warning => {
      console.log(`${colors.yellow}!${colors.reset} ${warning.file}`);
      console.log(`  ${warning.issue}`);
      if (warning.expected) {
        console.log(`  Expected: ${warning.expected}, Found: ${warning.found}`);
      }
      console.log();
    });
  }
  
  if (passed.length > 0) {
    console.log(`\n${colors.green}✅ PASSED (${passed.length} files)${colors.reset}\n`);
  }
  
  // Zusammenfassung
  console.log('═'.repeat(80));
  console.log('\n📊 SUMMARY:\n');
  console.log(`  ${colors.green}✓ Passed:${colors.reset} ${passed.length} files`);
  console.log(`  ${colors.yellow}⚠ Warnings:${colors.reset} ${warnings.length} issues`);
  console.log(`  ${colors.red}✗ Errors:${colors.reset} ${errors.length} issues`);
  
  if (errors.length === 0) {
    console.log(`\n${colors.green}🎉 All design system checks passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}❌ Design system validation failed!${colors.reset}`);
    console.log(`\nPlease fix the errors above and ensure:`);
    console.log(`- Use CSS variables from design-tokens.css`);
    console.log(`- Import UI components from @/components/ui`);
    console.log(`- No hardcoded colors or spacings\n`);
    process.exit(1);
  }
}

// Script ausführen
if (require.main === module) {
  main();
}

module.exports = { checkFile, forbiddenPatterns };