#!/usr/bin/env node
/**
 * Extract Template Canvas Render Styles
 *
 * Simulates what ElementRenderer does: merges getDefaultStyle + styleOverrides + responsiveStyles
 * Outputs the final computed styles per element per template — the exact CSS the canvas renders.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'app/_config/templates/sections');
const ED_PATH = path.join(ROOT, 'app/_config/elementDefinitions.js');

// ========== 1. PARSE elementDefinitions for styleProps defaults ==========
const edContent = fs.readFileSync(ED_PATH, 'utf8');

function parseElementDefinitions(content) {
  const defs = {};

  // Find each element type block
  const typeBlocks = content.match(/['"]([^'"]+)['"]\s*:\s*\{[^}]*type:\s*['"][^'"]+['"]/g);
  if (!typeBlocks) return defs;

  // Better approach: find all top-level keys of elementDefinitions
  // Match: "elementType": { ... type: "elementType" ... styleProps: [ ... ] }
  const elementRegex = /['"](\w[\w-]*)['"]:\s*\{\s*\n?\s*type:\s*['"]\1['"]/g;
  let match;
  const typePositions = [];

  while ((match = elementRegex.exec(content)) !== null) {
    typePositions.push({ type: match[1], pos: match.index });
  }

  for (let i = 0; i < typePositions.length; i++) {
    const start = typePositions[i].pos;
    const end = i + 1 < typePositions.length ? typePositions[i + 1].pos : content.length;
    const block = content.substring(start, end);
    const elType = typePositions[i].type;

    const defaults = {};

    // Extract styleProps with defaults
    const stylePropMatches = block.matchAll(/\{\s*name:\s*['"]([^'"]+)['"][^}]*?default:\s*(['"]([^'"]*?)['"]|(\d+(?:\.\d+)?))/g);
    for (const m of stylePropMatches) {
      const propName = m[1];
      const value = m[3] !== undefined ? m[3] : m[4];
      if (value !== undefined && value !== '') {
        defaults[propName] = value;
      }
    }

    defs[elType] = defaults;
  }

  return defs;
}

const elementDefaults = parseElementDefinitions(edContent);

// ========== 2. READ ALL TEMPLATE JSONs ==========
const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));
const templates = templateFiles.map(f => {
  const content = fs.readFileSync(path.join(TEMPLATES_DIR, f), 'utf8');
  return JSON.parse(content);
});

// ========== 3. MERGE STYLES (same as ElementRenderer) ==========
function getDefaultStyle(elementType) {
  return { ...(elementDefaults[elementType] || {}) };
}

function computeElementStyles(templateElement) {
  const { type } = templateElement;

  // Merge: getDefaultStyle + styleOverrides (same as templateUtils.buildElement)
  const baseStyle = {
    ...getDefaultStyle(type),
    ...(templateElement.styleOverrides || {}),
  };

  // Responsive styles (viewport-first format from template JSON)
  const responsive = templateElement.responsiveStyles || {};

  return { baseStyle, responsive };
}

// ========== 4. WALK TEMPLATE AND EXTRACT ==========
function extractTemplate(template) {
  const result = {
    id: template.id,
    name: template.name,
    elements: [],
  };

  let elementIndex = 0;

  function walkElement(templateElement, depth = 0, context = '') {
    const { type } = templateElement;
    const { baseStyle, responsive } = computeElementStyles(templateElement);
    const label = context ? `${context} > ${type}` : type;

    result.elements.push({
      index: elementIndex++,
      type,
      label,
      depth,
      baseStyle,
      responsive,
      propOverrides: templateElement.propOverrides || {},
      columnStyles: templateElement.columnStyles || null,
    });

    // Walk children
    if (Array.isArray(templateElement.children)) {
      templateElement.children.forEach(child => {
        walkElement(child, depth + 1, label);
      });
    }

    // Walk columns
    if (Array.isArray(templateElement.columns)) {
      templateElement.columns.forEach((column, colIdx) => {
        column.forEach(child => {
          walkElement(child, depth + 1, `${label} > col-${colIdx}`);
        });
      });
    }
  }

  template.elements.forEach(el => walkElement(el));
  return result;
}

// ========== 5. OUTPUT ==========
const output = {};

templates.forEach(template => {
  const extracted = extractTemplate(template);
  output[template.id] = extracted;
});

// Write full JSON output
const outputPath = path.join(ROOT, 'scripts/template_styles_output.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

// Write human-readable summary
let summary = '';
Object.values(output).forEach(template => {
  summary += `\n${'='.repeat(80)}\n`;
  summary += `TEMPLATE: ${template.id} (${template.name})\n`;
  summary += `${'='.repeat(80)}\n`;

  template.elements.forEach(el => {
    const indent = '  '.repeat(el.depth);
    summary += `\n${indent}[${el.index}] ${el.type}`;
    if (Object.keys(el.propOverrides).length > 0) {
      const textProp = el.propOverrides.text;
      if (textProp) {
        const preview = textProp.length > 30 ? textProp.substring(0, 30) + '...' : textProp;
        summary += ` — "${preview}"`;
      }
    }
    summary += `\n`;

    // Base styles
    const styleEntries = Object.entries(el.baseStyle);
    if (styleEntries.length > 0) {
      summary += `${indent}  BASE STYLE:\n`;
      styleEntries.forEach(([key, value]) => {
        summary += `${indent}    ${key}: ${value}\n`;
      });
    }

    // Responsive styles
    const responsiveEntries = Object.entries(el.responsive);
    if (responsiveEntries.length > 0) {
      responsiveEntries.forEach(([viewport, styles]) => {
        summary += `${indent}  @${viewport}:\n`;
        Object.entries(styles).forEach(([key, value]) => {
          summary += `${indent}    ${key}: ${value}\n`;
        });
      });
    }

    // Column styles
    if (el.columnStyles) {
      Object.entries(el.columnStyles).forEach(([colIdx, styles]) => {
        summary += `${indent}  COLUMN ${colIdx}:\n`;
        Object.entries(styles).forEach(([key, value]) => {
          summary += `${indent}    ${key}: ${value}\n`;
        });
      });
    }
  });
});

const summaryPath = path.join(ROOT, 'scripts/template_styles_output.txt');
fs.writeFileSync(summaryPath, summary);

console.log(`Extracted ${templates.length} templates`);
console.log(`JSON: ${outputPath}`);
console.log(`Summary: ${summaryPath}`);
console.log(`\nElement counts per template:`);
Object.values(output).forEach(t => {
  console.log(`  ${t.id}: ${t.elements.length} elements`);
});
