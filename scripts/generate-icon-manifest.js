/**
 * Build-time icon manifest generator
 * Scans public/icons/ (flat directory) and writes manifest.json
 * Run before next build: node scripts/generate-icon-manifest.js
 */

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const outputPath = path.join(iconsDir, 'manifest.json');

const files = fs.readdirSync(iconsDir);
const icons = files
  .filter(file => file.endsWith('.svg') || file.endsWith('.png'))
  .map(file => {
    const name = file.replace(/\.(svg|png)$/, '');
    const extension = file.split('.').pop();
    return { name, path: `/icons/${file}`, extension };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(outputPath, JSON.stringify(icons, null, 2));
console.log(`Icon manifest generated: ${icons.length} icons`);
