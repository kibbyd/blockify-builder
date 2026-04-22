#!/usr/bin/env node
/**
 * Restore styleOverrides to template JSONs from extracted data.
 * Canvas needs element.style populated via styleOverrides for rendering.
 * Uses template_styles_output.json as the source of truth.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'app/_config/templates/sections');
const extracted = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/template_styles_output.json'), 'utf8'));

const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));

let totalRestored = 0;

templateFiles.forEach(filename => {
  const filepath = path.join(TEMPLATES_DIR, filename);
  const template = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  const extractedTemplate = extracted[template.id];

  if (!extractedTemplate) {
    console.log(`SKIP: ${template.id} — no extracted data`);
    return;
  }

  let elementIndex = 0;

  function restoreElement(el) {
    const idx = elementIndex++;
    const extractedEl = extractedTemplate.elements.find(e => e.index === idx);

    if (extractedEl && extractedEl.baseStyle && Object.keys(extractedEl.baseStyle).length > 0) {
      el.styleOverrides = { ...extractedEl.baseStyle };
    }

    // Recurse children
    if (Array.isArray(el.children)) {
      el.children.forEach(restoreElement);
    }

    // Recurse columns
    if (Array.isArray(el.columns)) {
      el.columns.forEach(column => {
        column.forEach(restoreElement);
      });
    }
  }

  template.elements.forEach(restoreElement);

  fs.writeFileSync(filepath, JSON.stringify(template, null, 2) + '\n');
  totalRestored++;
});

console.log(`Restored styleOverrides for ${totalRestored} templates`);
