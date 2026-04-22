/**
 * Element Route Auditor
 *
 * Parses elementDefinitions.js and BlockBuilder.jsx to check
 * every property against the 3 route rules.
 *
 * Route 1: Panel, no default, no toggle (user opt-in)
 * Route 2: Panel, default value, toggle on, canBeSchemaEditable (requires all 3)
 * Route 3: Structural, hardcoded only, not in panel
 *
 * Violation: Route 2 missing a requirement
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const edContent = fs.readFileSync(path.join(dataDir, 'elementDefinitions.js'), 'utf8');
const bbContent = fs.readFileSync(path.join(dataDir, 'BlockBuilder.jsx'), 'utf8');

// --- Extract switch/case blocks from arrow functions ---
function extractSwitchCases(content, fnName) {
  const results = {};
  // Find the arrow function
  const fnRegex = new RegExp(`const ${fnName} = \\(.*?\\) => \\{\\s*switch \\(type\\) \\{([\\s\\S]*?)\\n\\};`, 'm');
  const fnMatch = content.match(fnRegex);
  if (!fnMatch) {
    console.log(`WARNING: Could not find ${fnName}`);
    return results;
  }
  const body = fnMatch[1];

  // Match each case and its return object
  const caseRegex = /case\s+["']([\w-]+)["']:\s*return\s*\{([^}]*)\}/g;
  let m;
  while ((m = caseRegex.exec(body)) !== null) {
    const type = m[1];
    const propsStr = m[2];
    const props = {};
    // Match key: "value" or key: 'value' or key: number or key: true/false
    const propRegex = /(\w+)\s*:\s*(?:"([^"]*)"|'([^']*)'|(true|false)|(\d[\w.%]*))/g;
    let pm;
    while ((pm = propRegex.exec(propsStr)) !== null) {
      const val = pm[2] !== undefined ? pm[2] : pm[3] !== undefined ? pm[3] : pm[4] !== undefined ? pm[4] : pm[5];
      props[pm[1]] = val;
    }
    results[type] = props;
  }
  return results;
}

// --- Extract element definitions (styleProps/contentProps with canBeSchemaEditable) ---
function extractElementDefs(content) {
  const results = {};

  // Find each element type block: key: { type: "...", ... styleProps: [...], contentProps: [...] }
  // We need to find top-level keys of elementDefinitions
  const typeBlocks = content.match(/export const elementDefinitions = \{([\s\S]*)\n\};/);
  if (!typeBlocks) {
    console.log('WARNING: Could not find elementDefinitions');
    return results;
  }

  const body = typeBlocks[1];

  // Find each element type by looking for type: "xxx" pattern
  const typeNameRegex = /(\w[\w-]*)\s*:\s*\{\s*\n?\s*type:\s*["']([\w-]+)["']/g;
  let tm;
  const typePositions = [];
  while ((tm = typeNameRegex.exec(body)) !== null) {
    typePositions.push({ key: tm[1], type: tm[2], start: tm.index });
  }

  for (let i = 0; i < typePositions.length; i++) {
    const start = typePositions[i].start;
    const end = i + 1 < typePositions.length ? typePositions[i + 1].start : body.length;
    const block = body.substring(start, end);
    const type = typePositions[i].type;

    // Extract styleProps
    const styleProps = [];
    const styleMatch = block.match(/styleProps:\s*\[([\s\S]*?)\](?:\s*\.concat)/s) ||
                       block.match(/styleProps:\s*\[([\s\S]*?)\],?\s*(?:contentProps|$)/s);
    if (styleMatch) {
      const nameRegex = /name:\s*["'](\w+)["']/g;
      const schemaRegex = /\{[^}]*?name:\s*["'](\w+)["'][^}]*?canBeSchemaEditable:\s*(true|false)[^}]*\}/g;

      // Build a map of canBeSchemaEditable per prop
      const schemaMap = {};
      let sr;
      while ((sr = schemaRegex.exec(styleMatch[1])) !== null) {
        schemaMap[sr[1]] = sr[2] === 'true';
      }

      // Also check reverse order (canBeSchemaEditable before name)
      const schemaRegex2 = /\{[^}]*?canBeSchemaEditable:\s*(true|false)[^}]*?name:\s*["'](\w+)["'][^}]*\}/g;
      while ((sr = schemaRegex2.exec(styleMatch[1])) !== null) {
        if (!(sr[2] in schemaMap)) {
          schemaMap[sr[2]] = sr[1] === 'true';
        }
      }

      let nm;
      const nameRegex2 = /name:\s*["'](\w+)["']/g;
      while ((nm = nameRegex2.exec(styleMatch[1])) !== null) {
        styleProps.push({
          name: nm[1],
          canBeSchemaEditable: schemaMap[nm[1]] || false
        });
      }
    }

    // Extract contentProps
    const contentProps = [];
    const contentMatch = block.match(/contentProps:\s*\[([\s\S]*?)\](?:\s*\.concat|\s*,?\s*\n?\s*\})/s);
    if (contentMatch) {
      const schemaMap = {};
      const schemaRegex = /\{[^}]*?name:\s*["'](\w+)["'][^}]*?canBeSchemaEditable:\s*(true|false)[^}]*\}/g;
      let sr;
      while ((sr = schemaRegex.exec(contentMatch[1])) !== null) {
        schemaMap[sr[1]] = sr[2] === 'true';
      }
      const schemaRegex2 = /\{[^}]*?canBeSchemaEditable:\s*(true|false)[^}]*?name:\s*["'](\w+)["'][^}]*\}/g;
      while ((sr = schemaRegex2.exec(contentMatch[1])) !== null) {
        if (!(sr[2] in schemaMap)) {
          schemaMap[sr[2]] = sr[1] === 'true';
        }
      }

      const nameRegex = /name:\s*["'](\w+)["']/g;
      let nm;
      while ((nm = nameRegex.exec(contentMatch[1])) !== null) {
        contentProps.push({
          name: nm[1],
          canBeSchemaEditable: schemaMap[nm[1]] || false
        });
      }
    }

    results[type] = { styleProps, contentProps };
  }
  return results;
}

// --- Run ---
const defaultStyles = extractSwitchCases(bbContent, 'getDefaultStyle');
const defaultToggles = extractSwitchCases(bbContent, 'getDefaultSchemaToggles');
const defaultProps = extractSwitchCases(bbContent, 'getDefaultProps');
const elementDefs = extractElementDefs(edContent);

console.log(`\n=== ELEMENT ROUTE AUDIT ===\n`);
console.log(`Elements parsed: ${Object.keys(elementDefs).length}`);
console.log(`Default styles found for: ${Object.keys(defaultStyles).length} types`);
console.log(`Default toggles found for: ${Object.keys(defaultToggles).length} types`);
console.log(`Default props found for: ${Object.keys(defaultProps).length} types\n`);

const violations = [];
const report = [];

Object.keys(elementDefs).forEach(type => {
  const def = elementDefs[type];
  const styles = defaultStyles[type] || {};
  const toggles = defaultToggles[type] || {};
  const props = defaultProps[type] || {};

  const allProps = [
    ...def.styleProps.map(p => ({ ...p, kind: 'style' })),
    ...def.contentProps.map(p => ({ ...p, kind: 'content' }))
  ];

  allProps.forEach(prop => {
    const name = prop.name;
    const hasDefault = prop.kind === 'style' ? (name in styles) : (name in props);
    const hasToggle = toggles[name] === 'true' || toggles[name] === true;
    const canBeSchema = prop.canBeSchemaEditable;

    const route2count = [hasDefault, hasToggle, canBeSchema].filter(Boolean).length;

    let route;
    if (route2count === 3) {
      route = 2;
    } else if (canBeSchema && !hasDefault && !hasToggle) {
      route = 1;
    } else if (!canBeSchema && !hasDefault && !hasToggle) {
      route = 'panel-only';
    } else if (route2count > 0 && route2count < 3) {
      route = '2-PARTIAL';
      violations.push({
        type, property: name, kind: prop.kind,
        issue: `Partial Route 2: hasDefault=${hasDefault}, hasToggle=${hasToggle}, canBeSchema=${canBeSchema}`
      });
    }

    report.push({
      type, property: name, kind: prop.kind, route,
      hasDefault, hasToggle, canBeSchema
    });
  });
});

console.log(`Total properties audited: ${report.length}`);
console.log(`Violations: ${violations.length}\n`);

if (violations.length > 0) {
  console.log('--- VIOLATIONS ---\n');
  violations.forEach(v => {
    console.log(`  ${v.type}.${v.property} (${v.kind}): ${v.issue}`);
  });
}

// Write results
fs.writeFileSync(
  path.join(dataDir, 'element-audit-results.json'),
  JSON.stringify({ report, violations }, null, 2)
);
console.log('\nFull report: tests/data/element-audit-results.json');
