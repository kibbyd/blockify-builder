#!/usr/bin/env node
/**
 * Clean Template JSONs
 *
 * For each template:
 *   - Remove toggleOverrides (dead code, never read by pipeline)
 *   - Remove styleOverrides not in templatePropertyMaps filter
 *   - Keep: propOverrides, responsiveStyles, columnStyles, composition, filtered styleOverrides
 *
 * Templates without a filter map get ALL styleOverrides removed.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'app/_config/templates/sections');
const ED_PATH = path.join(ROOT, 'app/_config/elementDefinitions.js');

// ========== 1. PARSE templatePropertyMaps ==========
const edContent = fs.readFileSync(ED_PATH, 'utf8');

function parseTemplatePropertyMaps(content) {
  const match = content.match(/const templatePropertyMaps\s*=\s*(\{[\s\S]*?\n\});/);
  if (!match) {
    console.error('Could not find templatePropertyMaps in elementDefinitions.js');
    return {};
  }

  // Evaluate the object (safe — it's our own code, only string literals and arrays)
  const maps = eval('(' + match[1] + ')');
  return maps;
}

const templatePropertyMaps = parseTemplatePropertyMaps(edContent);
console.log('Found filter maps for:', Object.keys(templatePropertyMaps).join(', ') || '(none)');

// ========== 2. CLEAN EACH TEMPLATE ==========
const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));

let totalCleaned = 0;
const report = [];

templateFiles.forEach(filename => {
  const filepath = path.join(TEMPLATES_DIR, filename);
  const template = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  const templateId = template.id;
  const filterMap = templatePropertyMaps[templateId] || {};
  const changes = [];

  function cleanElement(el) {
    const elementFilter = filterMap[el.type];
    const allowedStyleProps = elementFilter ? new Set(elementFilter.styleProps || []) : new Set();

    // Remove toggleOverrides
    if (el.toggleOverrides) {
      changes.push(`  ${el.type}: removed toggleOverrides`);
      delete el.toggleOverrides;
    }

    // Filter styleOverrides
    if (el.styleOverrides) {
      const original = Object.keys(el.styleOverrides);
      const kept = {};
      original.forEach(key => {
        if (allowedStyleProps.has(key)) {
          kept[key] = el.styleOverrides[key];
        }
      });

      const removed = original.filter(key => !allowedStyleProps.has(key));
      if (removed.length > 0) {
        changes.push(`  ${el.type}: removed ${removed.length} styleOverrides (${removed.join(', ')})`);
      }

      if (Object.keys(kept).length > 0) {
        el.styleOverrides = kept;
      } else {
        delete el.styleOverrides;
      }
    }

    // Recurse children
    if (Array.isArray(el.children)) {
      el.children.forEach(cleanElement);
    }

    // Recurse columns
    if (Array.isArray(el.columns)) {
      el.columns.forEach(column => {
        column.forEach(cleanElement);
      });
    }
  }

  template.elements.forEach(cleanElement);

  if (changes.length > 0) {
    fs.writeFileSync(filepath, JSON.stringify(template, null, 2) + '\n');
    totalCleaned++;
    report.push({ templateId, changes });
  }
});

// ========== 3. REPORT ==========
console.log(`\nCleaned ${totalCleaned} of ${templateFiles.length} templates\n`);
report.forEach(({ templateId, changes }) => {
  console.log(`${templateId}:`);
  changes.forEach(c => console.log(c));
  console.log('');
});

if (totalCleaned === 0) {
  console.log('All templates already clean.');
}
