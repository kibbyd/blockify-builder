#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const edContent = fs.readFileSync(path.join(ROOT, 'app/_config/elementDefinitions.js'), 'utf8');
const bbContent = fs.readFileSync(path.join(ROOT, 'app/_components/BlockBuilder.jsx'), 'utf8');

// ========== 1. PARSE elementDefinitions ==========
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

  if (!elemDefs[elType]) {
    elemDefs[elType] = { styleProps: [], contentProps: [] };
  }

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

// ========== 2. PARSE getDefaultStyle ==========
const defaultStyles = {};
const dsMatch = bbContent.match(/const getDefaultStyle\s*=\s*\(type\)\s*=>\s*\{([\s\S]*?)\n\};/);
if (dsMatch) {
  const dsBody = dsMatch[1];
  const caseRegex = /case\s+['"]([^'"]+)['"]:[\s\S]*?return\s*\{([\s\S]*?)\};/g;
  let cm;
  while ((cm = caseRegex.exec(dsBody)) !== null) {
    const props = {};
    const propMatches = cm[2].matchAll(/(\w+):\s*['"]([^'"]*?)['"]/g);
    for (const pm of propMatches) props[pm[1]] = pm[2];
    const nullMatches = cm[2].matchAll(/(\w+):\s*null/g);
    for (const nm of nullMatches) props[nm[1]] = null;

    // Find all case labels before this return
    const beforeReturn = dsBody.substring(0, cm.index + cm[0].length);
    const lastReturn = beforeReturn.lastIndexOf('return');
    // Look backwards from cm.index to find all consecutive case labels
    let searchStart = cm.index;
    const allTypes = [cm[1]];
    const priorText = dsBody.substring(0, cm.index);
    const caseLines = priorText.split('\n').reverse();
    for (const line of caseLines) {
      const caseMatch = line.match(/^\s*case\s+['"]([^'"]+)['"]\s*:\s*$/);
      if (caseMatch) {
        allTypes.push(caseMatch[1]);
      } else if (line.trim() && !line.trim().startsWith('//')) {
        break;
      }
    }

    for (const t of allTypes) {
      defaultStyles[t] = props;
    }
  }
}

// ========== 3. PARSE getDefaultProps ==========
const defaultProps = {};
const dpMatch = bbContent.match(/const getDefaultProps\s*=\s*\(type[\s\S]*?\)\s*=>\s*\{([\s\S]*?)\n\};/);
if (dpMatch) {
  const dpBody = dpMatch[1];
  const caseRegex = /case\s+['"]([^'"]+)['"]:[\s\S]*?return\s*\{([\s\S]*?)\};/g;
  let cm;
  while ((cm = caseRegex.exec(dpBody)) !== null) {
    const props = {};
    const propMatches = cm[2].matchAll(/(\w+):\s*['"]([^'"]*?)['"]/g);
    for (const pm of propMatches) props[pm[1]] = pm[2];
    const boolMatches = cm[2].matchAll(/(\w+):\s*(true|false)/g);
    for (const bm of boolMatches) props[bm[1]] = bm[2] === 'true';

    const allTypes = [cm[1]];
    const priorText = dpBody.substring(0, cm.index);
    const caseLines = priorText.split('\n').reverse();
    for (const line of caseLines) {
      const caseMatch = line.match(/^\s*case\s+['"]([^'"]+)['"]\s*:\s*$/);
      if (caseMatch) allTypes.push(caseMatch[1]);
      else if (line.trim() && !line.trim().startsWith('//')) break;
    }

    for (const t of allTypes) defaultProps[t] = props;
  }
}

// ========== 4. PARSE getDefaultSchemaToggles ==========
const schemaToggles = {};
const stMatch = bbContent.match(/const getDefaultSchemaToggles\s*=[\s\S]*?const defaults\s*=\s*\{([\s\S]*?)\};\s*\n\s*return/);
if (stMatch) {
  const stBody = stMatch[1];
  const elementBlockRegex = /['"]?([a-z][\w-]*)['"]?\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
  let em;
  while ((em = elementBlockRegex.exec(stBody)) !== null) {
    const elType = em[1];
    const toggleBody = em[2];
    const toggles = {};
    const toggleMatches = toggleBody.matchAll(/(\w+):\s*(true|false)/g);
    for (const tm of toggleMatches) toggles[tm[1]] = tm[2] === 'true';
    schemaToggles[elType] = toggles;
  }
}

// ========== 5. Build the full pipeline map ==========
const allTypes = [...new Set([
  ...Object.keys(elemDefs),
  ...Object.keys(defaultStyles),
  ...Object.keys(defaultProps),
  ...Object.keys(schemaToggles)
])].sort();

const pipelineMap = {
  _meta: {
    generated: new Date().toISOString(),
    description: 'Full pipeline map for every element: elementDefinitions -> getDefaultStyle -> getDefaultProps -> getDefaultSchemaToggles',
    files: {
      elementDefinitions: 'app/_config/elementDefinitions.js',
      getDefaultStyle: 'app/_components/BlockBuilder.jsx',
      getDefaultProps: 'app/_components/BlockBuilder.jsx',
      getDefaultSchemaToggles: 'app/_components/BlockBuilder.jsx',
      htmlGeneration: 'app/_utils/htmlGeneration.js',
      cssGeneration: 'app/_utils/cssGeneration.js',
      schemaGeneration: 'app/_utils/schemaGeneration.js',
    },
    rule: 'Property names must be IDENTICAL across all stages. A property missing from any stage = silent failure on export.'
  },
  elements: {}
};

for (const type of allTypes) {
  const ed = elemDefs[type] || { styleProps: [], contentProps: [] };
  const ds = defaultStyles[type] || {};
  const dp = defaultProps[type] || {};
  const st = schemaToggles[type] || {};

  // Analyze each styleProp
  const styleAnalysis = {};
  for (const prop of ed.styleProps) {
    styleAnalysis[prop] = {
      inElementDefs: true,
      hasDefault: prop in ds,
      defaultValue: ds[prop] !== undefined ? ds[prop] : null,
      schemaToggled: st[prop] === true,
    };
  }

  // Defaults not in elementDefs
  for (const prop of Object.keys(ds)) {
    if (!ed.styleProps.includes(prop)) {
      styleAnalysis[prop] = {
        inElementDefs: false,
        hasDefault: true,
        defaultValue: ds[prop],
        schemaToggled: st[prop] === true,
        WARNING: 'Has default value but NOT in elementDefinitions styleProps - will not export'
      };
    }
  }

  // Toggles not in elementDefs (check if it is a contentProp first)
  for (const prop of Object.keys(st)) {
    if (!ed.styleProps.includes(prop) && !ed.contentProps.includes(prop) && !styleAnalysis[prop]) {
      styleAnalysis[prop] = {
        inElementDefs: false,
        hasDefault: prop in ds || prop in dp,
        defaultValue: ds[prop] || dp[prop] || null,
        schemaToggled: true,
        WARNING: 'Schema toggled ON but NOT in elementDefinitions - toggle has no effect'
      };
    }
  }

  // Analyze each contentProp
  const contentAnalysis = {};
  for (const prop of ed.contentProps) {
    contentAnalysis[prop] = {
      inElementDefs: true,
      hasDefault: prop in dp,
      defaultValue: dp[prop] !== undefined ? dp[prop] : null,
      schemaToggled: st[prop] === true,
    };
  }

  // Content defaults not in elementDefs
  for (const prop of Object.keys(dp)) {
    if (!ed.contentProps.includes(prop) && !ed.styleProps.includes(prop)) {
      contentAnalysis[prop] = {
        inElementDefs: false,
        hasDefault: true,
        defaultValue: dp[prop],
        schemaToggled: st[prop] === true,
        WARNING: 'Has default value but NOT in elementDefinitions contentProps - will not export'
      };
    }
  }

  const warnings = [
    ...Object.entries(styleAnalysis).filter(([k, v]) => v.WARNING).map(([k, v]) => `${k}: ${v.WARNING}`),
    ...Object.entries(contentAnalysis).filter(([k, v]) => v.WARNING).map(([k, v]) => `${k}: ${v.WARNING}`)
  ];

  pipelineMap.elements[type] = {
    styleProps: styleAnalysis,
    contentProps: contentAnalysis,
    summary: {
      totalStyleProps: ed.styleProps.length,
      totalContentProps: ed.contentProps.length,
      stylePropsWithDefaults: Object.values(styleAnalysis).filter(v => v.hasDefault && v.inElementDefs).length,
      contentPropsWithDefaults: Object.values(contentAnalysis).filter(v => v.hasDefault && v.inElementDefs).length,
      schemaToggledStyleProps: Object.keys(st).filter(k => ed.styleProps.includes(k)).length,
      schemaToggledContentProps: Object.keys(st).filter(k => ed.contentProps.includes(k)).length,
      totalSchemaToggles: Object.keys(st).length,
      warnings: warnings
    }
  };
}

// ========== 6. TEMPLATES ==========
const templatesDir = path.join(ROOT, 'app/_config/templates/sections');
const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
const templates = {};

function extractElementProps(element) {
  const result = {
    type: element.type,
    style: element.style ? Object.keys(element.style) : [],
    props: element.props ? Object.keys(element.props) : [],
    schemaToggles: element.schemaToggles ? Object.keys(element.schemaToggles).filter(k => element.schemaToggles[k]) : [],
    responsiveStyles: element.responsiveStyles ? Object.keys(element.responsiveStyles) : [],
    children: []
  };

  if (element.children) {
    for (const child of element.children) {
      result.children.push(extractElementProps(child));
    }
  }
  if (element.columns) {
    for (const col of element.columns) {
      const colResult = { type: 'column', children: [] };
      if (col.children) {
        for (const child of col.children) {
          colResult.children.push(extractElementProps(child));
        }
      }
      result.children.push(colResult);
    }
  }

  return result;
}

for (const file of templateFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
  const templateElements = [];
  if (content.elements) {
    for (const el of content.elements) {
      templateElements.push(extractElementProps(el));
    }
  }
  templates[content.id || file.replace('.json', '')] = {
    name: content.name,
    category: content.subcategory,
    elements: templateElements
  };
}

pipelineMap.templates = templates;

// Write output
fs.writeFileSync(path.join(ROOT, 'pipeline_map.json'), JSON.stringify(pipelineMap, null, 2));

// Print summary
console.log('Pipeline map generated: pipeline_map.json');
console.log(`Elements: ${allTypes.length}`);
console.log(`Templates: ${templateFiles.length}`);
console.log('');

// Print all warnings
let totalWarnings = 0;
for (const [type, data] of Object.entries(pipelineMap.elements)) {
  if (data.summary.warnings.length > 0) {
    console.log(`\n${type}:`);
    for (const w of data.summary.warnings) {
      console.log(`  - ${w}`);
      totalWarnings++;
    }
  }
}
console.log(`\nTotal warnings: ${totalWarnings}`);
