#!/usr/bin/env node
/**
 * Generate decision tables for each template.
 * One table per template — each row is a property on an element.
 * Daniel marks each as editable or hardcoded.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/template_styles_output.json'), 'utf8'));

let md = '# Template Decision Tables\n\n';
md += 'For each property: mark **E** (editable in Shopify) or **H** (hardcoded).\n';
md += 'Content props (text, src, alt, url) listed separately.\n\n';

Object.values(data).forEach(template => {
  md += `---\n\n## ${template.name} (\`${template.id}\`)\n\n`;

  // Content props table
  const contentRows = [];
  template.elements.forEach(el => {
    const overrides = el.propOverrides || {};
    Object.entries(overrides).forEach(([key, value]) => {
      const preview = typeof value === 'string' && value.length > 40
        ? value.substring(0, 40) + '...'
        : value;
      contentRows.push({ element: el.type, label: el.label, prop: key, value: preview });
    });
  });

  if (contentRows.length > 0) {
    md += '**Content Props:**\n\n';
    md += '| Element | Property | Value | E/H |\n';
    md += '|---------|----------|-------|-----|\n';
    contentRows.forEach(r => {
      md += `| ${r.element} | ${r.prop} | ${r.value} | |\n`;
    });
    md += '\n';
  }

  // Style props table — group by element, show property + value + responsive
  md += '**Style Props:**\n\n';
  md += '| Element | Property | Base Value | Responsive | E/H |\n';
  md += '|---------|----------|------------|------------|-----|\n';

  template.elements.forEach(el => {
    const base = el.baseStyle || {};
    const responsive = el.responsive || {};

    // Collect responsive info per property
    const responsiveInfo = {};
    Object.entries(responsive).forEach(([vp, styles]) => {
      Object.entries(styles).forEach(([prop, val]) => {
        if (!responsiveInfo[prop]) responsiveInfo[prop] = [];
        responsiveInfo[prop].push(`${vp}:${val}`);
      });
    });

    // All properties (base + responsive-only)
    const allProps = new Set([...Object.keys(base), ...Object.keys(responsiveInfo)]);

    // Sort: put visually important props first
    const sorted = [...allProps].sort((a, b) => a.localeCompare(b));

    sorted.forEach(prop => {
      const baseVal = base[prop] !== undefined ? base[prop] : '—';
      const respVal = responsiveInfo[prop] ? responsiveInfo[prop].join(', ') : '—';
      // Shorten the element label for readability
      const shortLabel = el.label.length > 30 ? '...' + el.label.slice(-27) : el.label;
      md += `| ${shortLabel} | ${prop} | ${baseVal} | ${respVal} | |\n`;
    });
  });

  md += '\n';

  // Column styles if any
  const colElements = template.elements.filter(el => el.columnStyles);
  if (colElements.length > 0) {
    md += '**Column Styles:**\n\n';
    md += '| Element | Column | Property | Value | E/H |\n';
    md += '|---------|--------|----------|-------|-----|\n';
    colElements.forEach(el => {
      Object.entries(el.columnStyles).forEach(([colIdx, styles]) => {
        Object.entries(styles).forEach(([prop, val]) => {
          md += `| ${el.type} | ${colIdx} | ${prop} | ${val} | |\n`;
        });
      });
    });
    md += '\n';
  }
});

const outputPath = path.join(ROOT, 'scripts/template_decision_tables.md');
fs.writeFileSync(outputPath, md);
console.log(`Decision tables written to: ${outputPath}`);
console.log(`${Object.keys(data).length} templates`);
