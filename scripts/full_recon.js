#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const edContent = fs.readFileSync(path.join(ROOT, 'app/_config/elementDefinitions.js'), 'utf8');
const bbContent = fs.readFileSync(path.join(ROOT, 'app/_components/BlockBuilder.jsx'), 'utf8');
const htmlContent = fs.readFileSync(path.join(ROOT, 'app/_utils/htmlGeneration.js'), 'utf8');
const cssContent = fs.readFileSync(path.join(ROOT, 'app/_utils/cssGeneration.js'), 'utf8');
const schemaContent = fs.readFileSync(path.join(ROOT, 'app/_utils/schemaGeneration.js'), 'utf8');

// ========== ELEMENT CATEGORIES ==========
const categories = {
  'layout': {
    description: 'Structural elements that contain other elements',
    route: 'Container/layout route: structural CSS, child positioning, flex/grid, no content export',
    elements: ['container', 'columns-1', 'columns-2', 'columns-3', 'columns-4', 'columns-5', 'columns-6', 'column', 'image-background', 'spacer']
  },
  'simple': {
    description: 'Basic visual elements with direct style-to-CSS mapping',
    route: 'Simple route: style → CSS, content → HTML, direct property mapping',
    elements: ['heading', 'text', 'button', 'image', 'video', 'icon', 'divider', 'list', 'unordered-list', 'table', 'map']
  },
  'shopify': {
    description: 'Shopify-specific elements that need product/collection pickers and Liquid logic',
    route: 'Shopify route: product/collection picker, Liquid-specific variables, structural child CSS, forloop logic',
    elements: ['product-card', 'product-grid', 'collection-list']
  },
  'interactive': {
    description: 'Elements with JS behavior, per-item content, and structural CSS',
    route: 'Interactive route: per-item content props, JS behavior, structural CSS, dedicated CSS blocks',
    elements: ['accordion', 'tabs', 'countdown', 'slideshow', 'popup', 'image-gallery', 'flip-card', 'before-after', 'marquee', 'blog-post', 'form']
  }
};

// ========== PARSE elementDefinitions ==========
function parseElementDefs() {
  const elemDefs = {};
  const typePositions = [];
  const typeRegex = /type:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = typeRegex.exec(edContent)) !== null) {
    typePositions.push({ type: m[1], pos: m.index });
  }

  for (let i = 0; i < typePositions.length; i++) {
    const start = typePositions[i].pos;
    const end = i + 1 < typePositions.length ? typePositions[i + 1].pos : edContent.length;
    const block = edContent.substring(start, end);
    const elType = typePositions[i].type;

    if (!elemDefs[elType]) elemDefs[elType] = { styleProps: [], contentProps: [] };

    const stylePropsSectionMatch = block.match(/styleProps:\s*\[([\s\S]*?)\](?=\s*,?\s*(?:contentProps|controlTypes|\}))/);
    if (stylePropsSectionMatch) {
      const nameMatches = stylePropsSectionMatch[1].matchAll(/name:\s*['"]([^'"]+)['"]/g);
      for (const nm of nameMatches) {
        if (!elemDefs[elType].styleProps.includes(nm[1])) elemDefs[elType].styleProps.push(nm[1]);
      }
    }

    const contentPropsSectionMatch = block.match(/contentProps:\s*\[([\s\S]*?)\](?=\s*,?\s*(?:styleProps|controlTypes|\}))/);
    if (contentPropsSectionMatch) {
      const nameMatches = contentPropsSectionMatch[1].matchAll(/name:\s*['"]([^'"]+)['"]/g);
      for (const nm of nameMatches) {
        if (!elemDefs[elType].contentProps.includes(nm[1])) elemDefs[elType].contentProps.push(nm[1]);
      }
    }
  }
  return elemDefs;
}

// ========== PARSE getDefaultStyle ==========
function parseDefaultStyles() {
  const defaultStyles = {};
  const dsMatch = bbContent.match(/const getDefaultStyle\s*=\s*\(type\)\s*=>\s*\{([\s\S]*?)\n\};/);
  if (!dsMatch) return defaultStyles;
  const dsBody = dsMatch[1];

  // Split by 'return' statements to find case blocks
  const caseRegex = /case\s+['"]([^'"]+)['"]:/g;
  const cases = [];
  let cm;
  while ((cm = caseRegex.exec(dsBody)) !== null) {
    cases.push({ type: cm[1], pos: cm.index });
  }

  for (let i = 0; i < cases.length; i++) {
    const start = cases[i].pos;
    const end = i + 1 < cases.length ? cases[i + 1].pos : dsBody.length;
    const block = dsBody.substring(start, end);

    const returnMatch = block.match(/return\s*\{([\s\S]*?)\};/);
    if (!returnMatch) continue;

    const props = {};
    // String values
    const strMatches = returnMatch[1].matchAll(/(\w+):\s*['"]([^'"]*?)['"]/g);
    for (const sm of strMatches) props[sm[1]] = sm[2];
    // null values
    const nullMatches = returnMatch[1].matchAll(/(\w+):\s*null/g);
    for (const nm of nullMatches) props[nm[1]] = null;
    // boolean values
    const boolMatches = returnMatch[1].matchAll(/(\w+):\s*(true|false)/g);
    for (const bm of boolMatches) props[bm[1]] = bm[2] === 'true';

    // Check if this case falls through (no return before next case)
    // For fall-through cases, look at consecutive case labels
    const allCasesInBlock = block.matchAll(/case\s+['"]([^'"]+)['"]\s*:/g);
    for (const ac of allCasesInBlock) {
      defaultStyles[ac[1]] = props;
    }
  }
  return defaultStyles;
}

// ========== PARSE getDefaultProps ==========
function parseDefaultProps() {
  const defaultProps = {};
  const dpMatch = bbContent.match(/const getDefaultProps\s*=\s*\(type[\s\S]*?\)\s*=>\s*\{([\s\S]*?)\n\};/);
  if (!dpMatch) return defaultProps;
  const dpBody = dpMatch[1];

  const caseRegex = /case\s+['"]([^'"]+)['"]:/g;
  const cases = [];
  let cm;
  while ((cm = caseRegex.exec(dpBody)) !== null) {
    cases.push({ type: cm[1], pos: cm.index });
  }

  for (let i = 0; i < cases.length; i++) {
    const start = cases[i].pos;
    const end = i + 1 < cases.length ? cases[i + 1].pos : dpBody.length;
    const block = dpBody.substring(start, end);

    const returnMatch = block.match(/return\s*\{([\s\S]*?)\};/);
    if (!returnMatch) continue;

    const props = {};
    const strMatches = returnMatch[1].matchAll(/(\w+):\s*['"]([^'"]*?)['"]/g);
    for (const sm of strMatches) props[sm[1]] = sm[2];
    const boolMatches = returnMatch[1].matchAll(/(\w+):\s*(true|false)/g);
    for (const bm of boolMatches) props[bm[1]] = bm[2] === 'true';
    const numMatches = returnMatch[1].matchAll(/(\w+):\s*(\d+)(?!\w)/g);
    for (const nm of numMatches) props[nm[1]] = parseInt(nm[2]);

    const allCasesInBlock = block.matchAll(/case\s+['"]([^'"]+)['"]\s*:/g);
    for (const ac of allCasesInBlock) {
      defaultProps[ac[1]] = props;
    }
  }
  return defaultProps;
}

// ========== PARSE getDefaultSchemaToggles ==========
function parseSchemaToggles() {
  const schemaToggles = {};
  const stMatch = bbContent.match(/const getDefaultSchemaToggles\s*=[\s\S]*?const defaults\s*=\s*\{([\s\S]*?)\};\s*\n\s*return/);
  if (!stMatch) return schemaToggles;

  const stBody = stMatch[1];
  const elementBlockRegex = /['"]?([a-z][\w-]*)['"]?\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
  let em;
  while ((em = elementBlockRegex.exec(stBody)) !== null) {
    const toggles = {};
    const toggleMatches = em[2].matchAll(/(\w+):\s*(true|false)/g);
    for (const tm of toggleMatches) toggles[tm[1]] = tm[2] === 'true';
    schemaToggles[em[1]] = toggles;
  }
  return schemaToggles;
}

// ========== PARSE HTML GENERATION — what properties does each element reference ==========
function parseHtmlGeneration() {
  const htmlProps = {};
  // Find each case block in the switch
  const caseRegex = /case\s+['"]([^'"]+)['"]\s*:/g;
  const cases = [];
  let m;
  while ((m = caseRegex.exec(htmlContent)) !== null) {
    cases.push({ type: m[1], pos: m.index });
  }

  for (let i = 0; i < cases.length; i++) {
    const start = cases[i].pos;
    const end = i + 1 < cases.length ? cases[i + 1].pos : htmlContent.length;
    const block = htmlContent.substring(start, end);
    const elType = cases[i].type;

    const propsReferenced = new Set();
    const styleReferenced = new Set();

    // element.props?.X or element.props.X
    const propMatches = block.matchAll(/element\.props\??\.(\w+)/g);
    for (const pm of propMatches) propsReferenced.add(pm[1]);

    // element.style?.X or element.style.X
    const styleMatches = block.matchAll(/element\.style\??\.(\w+)/g);
    for (const sm of styleMatches) styleReferenced.add(sm[1]);

    // schemaToggles references
    const toggleRefs = new Set();
    const toggleMatches = block.matchAll(/schemaToggles\??\.(\w+)/g);
    for (const tm of toggleMatches) toggleRefs.add(tm[1]);
    const toggleMatches2 = block.matchAll(/schemaToggles\??\[['"](\w+)['"]\]/g);
    for (const tm of toggleMatches2) toggleRefs.add(tm[1]);

    // shouldEnableInSchema references
    const schemaPropMatches = block.matchAll(/shouldEnableInSchema\s*\([^,]+,\s*['"](\w+)['"]/g);
    for (const sp of schemaPropMatches) toggleRefs.add(sp[1]);

    // generateContentLiquidVar references
    const liquidVarMatches = block.matchAll(/generateContentLiquidVar\s*\([^,]+,\s*['"](\w+)['"]/g);
    for (const lv of liquidVarMatches) propsReferenced.add(lv[1]);

    // Hardcoded Liquid references (not from variables)
    const hardcodedLiquid = [];
    const liquidMatches = block.matchAll(/\{\{[^}]*\}\}/g);
    for (const lm of liquidMatches) hardcodedLiquid.push(lm[0]);

    htmlProps[elType] = {
      propsReferenced: [...propsReferenced],
      styleReferenced: [...styleReferenced],
      schemaTogglesChecked: [...toggleRefs],
    };
  }
  return htmlProps;
}

// ========== PARSE CSS GENERATION — what does each element get ==========
function parseCssGeneration() {
  const cssInfo = {};

  // Find dedicated CSS blocks for specific elements
  const dedicatedElements = [
    'product-grid', 'collection-list', 'product-card', 'accordion', 'tabs',
    'countdown', 'slideshow', 'popup', 'add-to-cart', 'marquee',
    'image-gallery', 'blog-post', 'flip-card', 'divider', 'before-after',
    'stock-counter', 'variant-selector', 'form', 'price'
  ];

  for (const elType of dedicatedElements) {
    const hasDedicatedCSS = cssContent.includes(`"${elType}"`) || cssContent.includes(`'${elType}'`);
    // Check for element-type-specific CSS blocks
    const hasChildSelectors = cssContent.includes(`.${elType}`) || cssContent.includes(`${elType}__`);

    cssInfo[elType] = {
      hasDedicatedCSSBlock: hasDedicatedCSS,
      hasChildSelectors: hasChildSelectors,
    };
  }

  // Check which properties are hardcoded in CSS blocks
  // Look for direct value assignments (not using Liquid vars)
  const hardcodedPatterns = cssContent.matchAll(/:\s*(\d+px|#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|solid|dashed|none|block|flex|grid|center|pointer|relative|absolute)\s*;/g);
  const hardcodedValues = [];
  for (const hp of hardcodedPatterns) {
    hardcodedValues.push(hp[1]);
  }

  return { elementInfo: cssInfo, totalHardcodedValues: hardcodedValues.length };
}

// ========== PARSE SCHEMA GENERATION — what pickers/special settings ==========
function parseSchemaGeneration() {
  const schemaInfo = {};

  // Check for product/collection pickers
  const pickerMatches = schemaContent.matchAll(/(?:type|element\.type)\s*===?\s*['"]([^'"]+)['"][\s\S]*?(?:product|collection)/g);
  for (const pm of pickerMatches) {
    if (!schemaInfo[pm[1]]) schemaInfo[pm[1]] = { pickers: [] };
  }

  // Manual check for known picker patterns
  if (schemaContent.includes('product-card') || schemaContent.includes('add-to-cart')) {
    schemaInfo['product-card'] = { pickers: ['product'] };
    schemaInfo['add-to-cart'] = { pickers: ['product'] };
  }
  if (schemaContent.includes('product-grid')) {
    schemaInfo['product-grid'] = { pickers: ['collection'] };
  }
  if (schemaContent.includes('collection-list')) {
    schemaInfo['collection-list'] = { pickers: ['collection (x6)'] };
  }

  return schemaInfo;
}

// ========== BUILD THE FULL RECON ==========
const elemDefs = parseElementDefs();
const defaultStyles = parseDefaultStyles();
const defaultProps = parseDefaultProps();
const schemaToggles = parseSchemaToggles();
const htmlProps = parseHtmlGeneration();
const cssInfo = parseCssGeneration();
const schemaInfo = parseSchemaGeneration();

const recon = {
  _meta: {
    generated: new Date().toISOString(),
    purpose: 'Full pipeline recon: categorize every element, map its route from canvas to Shopify, flag gaps and hardcoded values',
    files: {
      elementDefinitions: 'app/_config/elementDefinitions.js',
      BlockBuilder: 'app/_components/BlockBuilder.jsx (getDefaultStyle, getDefaultProps, getDefaultSchemaToggles)',
      htmlGeneration: 'app/_utils/htmlGeneration.js',
      cssGeneration: 'app/_utils/cssGeneration.js',
      schemaGeneration: 'app/_utils/schemaGeneration.js',
    },
    pipeline: [
      'STEP 1: elementDefinitions — defines property names, types, controls',
      'STEP 2: getDefaultStyle/getDefaultProps — sets initial values when element created',
      'STEP 3: getDefaultSchemaToggles — determines which props are toggled on for Shopify export',
      'STEP 4: Canvas renders from element.style + element.props (React)',
      'STEP 5: htmlGeneration — generates Liquid HTML referencing schema-toggled properties',
      'STEP 6: cssGeneration — generates CSS with Liquid variables for schema-toggled properties',
      'STEP 7: schemaGeneration — generates Shopify schema JSON settings for toggled properties',
    ],
    rule: 'What you see on canvas MUST equal what exports to Shopify. Every toggled-on property must flow through all 7 steps.'
  },
  categories: categories,
  elements: {}
};

// Process every element
const allTypes = [...new Set([
  ...Object.keys(elemDefs),
  ...Object.keys(defaultStyles),
  ...Object.keys(defaultProps),
  ...Object.keys(schemaToggles)
])].sort();

for (const type of allTypes) {
  const ed = elemDefs[type] || { styleProps: [], contentProps: [] };
  const ds = defaultStyles[type] || {};
  const dp = defaultProps[type] || {};
  const st = schemaToggles[type] || {};
  const html = htmlProps[type] || { propsReferenced: [], styleReferenced: [], schemaTogglesChecked: [] };
  const css = cssInfo.elementInfo[type] || { hasDedicatedCSSBlock: false, hasChildSelectors: false };
  const schema = schemaInfo[type] || {};

  // Determine category
  let category = 'uncategorized';
  for (const [cat, catData] of Object.entries(categories)) {
    if (catData.elements.includes(type)) {
      category = cat;
      break;
    }
  }

  // ===== STYLE PROPS ANALYSIS =====
  const styleProps = {};
  for (const prop of ed.styleProps) {
    const hasDefault = prop in ds;
    const isToggled = st[prop] === true;
    const inHtml = html.styleReferenced.includes(prop) || html.schemaTogglesChecked.includes(prop);
    const issues = [];

    if (!isToggled && hasDefault) {
      issues.push('HAS_DEFAULT_BUT_NOT_TOGGLED — value exists but wont export to Shopify schema by default');
    }
    if (isToggled && !hasDefault) {
      issues.push('TOGGLED_BUT_NO_DEFAULT — toggled on but no initial value in getDefaultStyle');
    }

    styleProps[prop] = {
      inElementDefs: true,
      defaultValue: hasDefault ? ds[prop] : 'NONE',
      schemaToggled: isToggled,
      referencedInHTML: inHtml,
      issues: issues.length > 0 ? issues : undefined
    };
  }

  // Check for defaults NOT in elementDefinitions
  for (const prop of Object.keys(ds)) {
    if (!ed.styleProps.includes(prop)) {
      styleProps[prop] = {
        inElementDefs: false,
        defaultValue: ds[prop],
        schemaToggled: st[prop] === true,
        HARDCODED: true,
        issue: 'DEFAULT_VALUE_SET_BUT_NOT_IN_ELEMENTDEFS — renders on canvas but WILL NOT export. Either add to elementDefinitions or remove default.'
      };
    }
  }

  // Check for toggles on non-existent props
  for (const prop of Object.keys(st)) {
    if (!ed.styleProps.includes(prop) && !ed.contentProps.includes(prop) && !styleProps[prop]) {
      styleProps[prop] = {
        inElementDefs: false,
        defaultValue: 'NONE',
        schemaToggled: true,
        issue: 'TOGGLE_ON_NONEXISTENT_PROP — toggled on but property does not exist in elementDefinitions. Toggle has no effect.'
      };
    }
  }

  // ===== CONTENT PROPS ANALYSIS =====
  const contentProps = {};
  for (const prop of ed.contentProps) {
    const hasDefault = prop in dp;
    const isToggled = st[prop] === true;
    const inHtml = html.propsReferenced.includes(prop) || html.schemaTogglesChecked.includes(prop);
    const issues = [];

    if (!isToggled && hasDefault) {
      issues.push('HAS_DEFAULT_BUT_NOT_TOGGLED — value exists but wont export to Shopify schema by default');
    }
    if (isToggled && !hasDefault) {
      issues.push('TOGGLED_BUT_NO_DEFAULT — toggled on but no initial value in getDefaultProps');
    }
    if (isToggled && !inHtml) {
      issues.push('TOGGLED_BUT_NOT_IN_HTML — toggled on but htmlGeneration doesnt reference this property');
    }

    contentProps[prop] = {
      inElementDefs: true,
      defaultValue: hasDefault ? dp[prop] : 'NONE',
      schemaToggled: isToggled,
      referencedInHTML: inHtml,
      issues: issues.length > 0 ? issues : undefined
    };
  }

  // Check for default props NOT in elementDefinitions
  for (const prop of Object.keys(dp)) {
    if (!ed.contentProps.includes(prop) && !ed.styleProps.includes(prop)) {
      contentProps[prop] = {
        inElementDefs: false,
        defaultValue: dp[prop],
        schemaToggled: st[prop] === true,
        HARDCODED: true,
        issue: 'DEFAULT_VALUE_SET_BUT_NOT_IN_ELEMENTDEFS — exists in getDefaultProps but not in elementDefinitions contentProps. Cannot be edited in PropertyPanel or exported.'
      };
    }
  }

  // ===== SUMMARY =====
  const allIssues = [];
  for (const [prop, data] of Object.entries(styleProps)) {
    if (data.issue) allIssues.push(`STYLE ${prop}: ${data.issue}`);
    if (data.issues) for (const iss of data.issues) allIssues.push(`STYLE ${prop}: ${iss}`);
  }
  for (const [prop, data] of Object.entries(contentProps)) {
    if (data.issue) allIssues.push(`CONTENT ${prop}: ${data.issue}`);
    if (data.issues) for (const iss of data.issues) allIssues.push(`CONTENT ${prop}: ${iss}`);
  }

  recon.elements[type] = {
    category: category,
    route: categories[category] ? categories[category].route : 'UNKNOWN',
    cssGeneration: {
      hasDedicatedCSSBlock: css.hasDedicatedCSSBlock,
      hasChildSelectors: css.hasChildSelectors,
      note: css.hasDedicatedCSSBlock ? 'Has element-specific CSS generation beyond generic pipeline' : 'Uses generic pipeline only'
    },
    schemaGeneration: {
      pickers: schema.pickers || [],
    },
    htmlGeneration: {
      propsReferenced: html.propsReferenced,
      styleReferenced: html.styleReferenced,
      schemaTogglesChecked: html.schemaTogglesChecked,
    },
    styleProps: styleProps,
    contentProps: contentProps,
    summary: {
      totalStyleProps: ed.styleProps.length,
      totalContentProps: ed.contentProps.length,
      toggledOnStyleProps: Object.entries(styleProps).filter(([k, v]) => v.schemaToggled && v.inElementDefs).length,
      toggledOnContentProps: Object.entries(contentProps).filter(([k, v]) => v.schemaToggled && v.inElementDefs).length,
      hardcodedDefaults: Object.entries(styleProps).filter(([k, v]) => v.HARDCODED).length +
                         Object.entries(contentProps).filter(([k, v]) => v.HARDCODED).length,
      issueCount: allIssues.length,
      issues: allIssues
    }
  };
}

// ===== GLOBAL SUMMARY =====
let totalIssues = 0;
let totalHardcoded = 0;
const issuesByCategory = {};

for (const [type, data] of Object.entries(recon.elements)) {
  totalIssues += data.summary.issueCount;
  totalHardcoded += data.summary.hardcodedDefaults;
  if (!issuesByCategory[data.category]) issuesByCategory[data.category] = { elements: 0, issues: 0, hardcoded: 0 };
  issuesByCategory[data.category].elements++;
  issuesByCategory[data.category].issues += data.summary.issueCount;
  issuesByCategory[data.category].hardcoded += data.summary.hardcodedDefaults;
}

recon.globalSummary = {
  totalElements: allTypes.length,
  totalIssues: totalIssues,
  totalHardcodedDefaults: totalHardcoded,
  byCategory: issuesByCategory
};

fs.writeFileSync(path.join(ROOT, 'pipeline_recon.json'), JSON.stringify(recon, null, 2));

// ===== CONSOLE OUTPUT =====
console.log('PIPELINE RECON COMPLETE');
console.log('======================');
console.log(`Elements: ${allTypes.length}`);
console.log(`Total issues: ${totalIssues}`);
console.log(`Hardcoded defaults (not in elementDefs): ${totalHardcoded}`);
console.log('');

for (const [cat, catData] of Object.entries(issuesByCategory)) {
  console.log(`${cat.toUpperCase()}: ${catData.elements} elements, ${catData.issues} issues, ${catData.hardcoded} hardcoded`);
}

console.log('');
console.log('ISSUES BY ELEMENT:');
console.log('==================');
for (const [type, data] of Object.entries(recon.elements)) {
  if (data.summary.issueCount > 0) {
    console.log(`\n${type} [${data.category}] — ${data.summary.issueCount} issues:`);
    for (const issue of data.summary.issues) {
      console.log(`  - ${issue}`);
    }
  }
}

console.log('\n\nCLEAN ELEMENTS (no issues):');
for (const [type, data] of Object.entries(recon.elements)) {
  if (data.summary.issueCount === 0) {
    console.log(`  ✓ ${type} [${data.category}]`);
  }
}
