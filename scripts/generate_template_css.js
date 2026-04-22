#!/usr/bin/env node
/**
 * Generate templateCSSGenerators code from extracted template styles.
 * Outputs a JS module that cssGeneration imports.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/template_styles_output.json'), 'utf8'));
const edContent = fs.readFileSync(path.join(ROOT, 'app/_config/elementDefinitions.js'), 'utf8');

// Parse templatePropertyMaps to know which properties are editable (skip in hardcoded output)
function parseTemplatePropertyMaps(content) {
  const match = content.match(/const templatePropertyMaps\s*=\s*(\{[\s\S]*?\n\});/);
  if (!match) return {};
  return eval('(' + match[1] + ')');
}
const templatePropertyMaps = parseTemplatePropertyMaps(edContent);

const camelToKebab = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

// Properties that are not valid standalone CSS (handled specially or skipped)
const skipProps = new Set([
  'showImage', 'showTitle', 'showPrice', 'showButton', 'showCount', 'buttonText',
  'columns', 'rows', 'buttonColor', 'buttonBackgroundColor', 'buttonHoverColor',
  'buttonHoverBackgroundColor', 'buttonHoverBorderColor', 'buttonHoverAnimation',
  'titleTextAlign', 'priceTextAlign', 'gradientType', 'gradientAngle',
  'gradientColor1', 'gradientColor2', 'gradientColor3', 'gradientColor4', 'gradientColor5',
  'hideOnMobile', 'hideOnFullscreen', 'hideOnDesktop', 'backgroundVideoOpacity',
  'entranceAnimation', 'entranceDelay', 'entranceDuration',
  'itemCount', 'tabCount', 'slideCount', 'targetDate', 'expiredMessage',
  'showDays', 'showHours', 'showMinutes', 'showSeconds',
  'autoplay', 'autoplayInterval', 'showArrows', 'showDots',
  'tabBackgroundColor', 'tabActiveBackgroundColor', 'tabColor', 'tabActiveColor',
  'tabFontFamily', 'tabFontSize', 'tabFontWeight', 'contentFontSize',
  'titleFontFamily', 'titleFontSize', 'titleFontWeight', 'titleColor',
  'titleBackgroundColor', 'contentBackgroundColor',
  'digitFontFamily', 'digitColor', 'labelColor', 'digitFontSize', 'labelFontSize',
  'separatorStyle', 'headingFontFamily', 'headingFontSize', 'headingFontWeight',
  'textFontSize', 'slideBackgroundColor', 'arrowColor', 'dotColor', 'dotActiveColor',
  'textShadowOffsetX', 'textShadowOffsetY', 'textShadowBlur', 'textShadowColor',
  'boxShadowOffsetX', 'boxShadowOffsetY', 'boxShadowBlur', 'boxShadowSpread', 'boxShadowColor',
  'iconSize', 'iconColor',
]);

// Hover props need special handling — collect separately
const isHoverProp = (name) => name.startsWith('hover') && name !== 'height';

const viewportMedia = {
  xs: '@media (max-width: 575px)',
  sm: '@media (min-width: 576px) and (max-width: 767px)',
  md: '@media (min-width: 768px) and (max-width: 991px)',
  xl: '@media (min-width: 1200px)',
};

function generateCSSForElement(el, editableProps) {
  const lines = [];
  const responsiveLines = {}; // viewport -> [css lines]
  const hoverLines = [];

  // Base styles
  Object.entries(el.baseStyle || {}).forEach(([prop, value]) => {
    if (skipProps.has(prop)) return;
    if (editableProps.has(prop)) return; // handled by normal pipeline
    if (value === '' || value === undefined || value === null) return;

    if (isHoverProp(prop)) {
      if (editableProps.has(prop)) return; // editable hover props handled by pipeline
      const actualProp = prop.replace(/^hover/, '');
      const cssProp = camelToKebab(actualProp.charAt(0).toLowerCase() + actualProp.slice(1));
      hoverLines.push(`${cssProp}: ${value};`);
      return;
    }

    // iconSize maps to width + height
    if (prop === 'iconSize') {
      lines.push(`width: ${value};`);
      lines.push(`height: ${value};`);
      return;
    }

    lines.push(`${camelToKebab(prop)}: ${value};`);
  });

  // Responsive styles
  Object.entries(el.responsive || {}).forEach(([viewport, styles]) => {
    if (!viewportMedia[viewport]) return;
    Object.entries(styles).forEach(([prop, value]) => {
      if (skipProps.has(prop) || isHoverProp(prop)) return;
      if (editableProps.has(prop)) return; // handled by normal pipeline
      if (value === '' || value === undefined || value === null) return;
      if (!responsiveLines[viewport]) responsiveLines[viewport] = [];
      responsiveLines[viewport].push(`${camelToKebab(prop)}: ${value};`);
    });
  });

  return { lines, responsiveLines, hoverLines };
}

function generateFunctionBody(template) {
  let code = '';
  const filterMap = templatePropertyMaps[template.id] || {};

  template.elements.forEach((el, idx) => {
    // Get editable props for this element type from the filter map
    const elementFilter = filterMap[el.type];
    const editableProps = new Set(elementFilter ? elementFilter.styleProps || [] : []);
    const { lines, responsiveLines, hoverLines } = generateCSSForElement(el, editableProps);

    // Skip elements with no CSS to output
    if (lines.length === 0 && Object.keys(responsiveLines).length === 0 && hoverLines.length === 0) return;

    // Use element index to disambiguate same-type elements
    // The generator receives one element at a time, so we use a counter on the template
    // Actually, each element call is independent — we use element.type to match
    // But multiple elements of same type need disambiguation
    // Solution: track by index in the template's element order
    // We'll output all CSS in one function that receives the element and its index

    const comment = el.propOverrides?.text
      ? ` // "${String(el.propOverrides.text).replace(/[\n\r]+/g, ' ').substring(0, 30)}"`
      : '';

    if (lines.length > 0) {
      code += `    // [${idx}] ${el.label}${comment}\n`;
      code += `    if (elementIndex === ${idx}) {\n`;
      code += `      css += \`\${selector} {\n`;
      lines.forEach(line => {
        code += `        ${line}\n`;
      });
      code += `      }\n\`;\n`;

      // Responsive
      Object.entries(responsiveLines).forEach(([vp, vpLines]) => {
        code += `      css += \`${viewportMedia[vp]} {\n`;
        code += `        \${selector} {\n`;
        vpLines.forEach(line => {
          code += `          ${line}\n`;
        });
        code += `        }\n`;
        code += `      }\n\`;\n`;
      });

      // Hover
      if (hoverLines.length > 0) {
        code += `      css += \`\${selector}:hover {\n`;
        code += `        transition: all 0.3s ease;\n`;
        hoverLines.forEach(line => {
          code += `        ${line}\n`;
        });
        code += `      }\n\`;\n`;
      }

      code += `    }\n\n`;
    }
  });

  return code;
}

// ========== GENERATE THE MODULE ==========
let output = `/**
 * Template CSS Generators — AUTO-GENERATED
 *
 * Generated by scripts/generate_template_css.js from template_styles_output.json.
 * Each template has a generator function that outputs hardcoded CSS for all elements.
 *
 * DO NOT EDIT MANUALLY — re-run the generator script to update.
 */

/**
 * Helper: determine element index within a template instantiation.
 * Elements are rendered in document order — we track which index this element is
 * by storing a counter on the element's fromTemplate + type sequence.
 */
const elementIndexMap = new WeakMap();
let currentTemplateCounters = {};
let currentTemplateId = null;

export function resetTemplateCounters() {
  currentTemplateCounters = {};
  currentTemplateId = null;
}

function getElementIndex(element) {
  if (elementIndexMap.has(element)) return elementIndexMap.get(element);

  const templateId = element.fromTemplate;
  if (templateId !== currentTemplateId) {
    currentTemplateCounters = {};
    currentTemplateId = templateId;
  }

  if (currentTemplateCounters[templateId] === undefined) {
    currentTemplateCounters[templateId] = 0;
  }

  const idx = currentTemplateCounters[templateId]++;
  elementIndexMap.set(element, idx);
  return idx;
}

`;

// Generate per-template functions
const templateIds = Object.keys(data);
templateIds.forEach(templateId => {
  const template = data[templateId];
  const fnName = 'generate_' + templateId.replace(/-/g, '_') + '_CSS';

  output += `const ${fnName} = (element, elementDef, selector, sectionId) => {\n`;
  output += `  let css = '';\n`;
  output += `  const elementIndex = getElementIndex(element);\n\n`;
  output += generateFunctionBody(template);
  output += `  return css;\n`;
  output += `};\n\n`;
});

// Generate the registry
output += `/**\n * Template CSS generators registry.\n */\n`;
output += `export const templateCSSGenerators = {\n`;
templateIds.forEach(templateId => {
  const fnName = 'generate_' + templateId.replace(/-/g, '_') + '_CSS';
  output += `  '${templateId}': ${fnName},\n`;
});
output += `};\n`;

const outputPath = path.join(ROOT, 'app/_utils/templateCSS.js');
fs.writeFileSync(outputPath, output);
console.log(`Generated ${templateIds.length} template CSS generators`);
console.log(`Output: ${outputPath}`);
