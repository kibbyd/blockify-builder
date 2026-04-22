/**
 * Liquid Export Validator
 *
 * Programmatically validates exported Liquid code for correctness.
 * Catches bugs like mismatched schema IDs, invalid Liquid syntax, etc.
 */

/**
 * Extract all {{ section.settings.XXX }} references from CSS + HTML (not schema)
 */
const extractSettingRefs = (liquid) => {
  // Split off the schema block — only check CSS + HTML
  const schemaStart = liquid.indexOf('{% schema %}');
  const codeSection = schemaStart > -1 ? liquid.substring(0, schemaStart) : liquid;

  const refs = new Set();
  const regex = /section\.settings\.([a-zA-Z0-9_]+)/g;
  let match;
  while ((match = regex.exec(codeSection)) !== null) {
    refs.add(match[1]);
  }
  return refs;
};

/**
 * Parse the schema JSON from the Liquid template
 */
const parseSchema = (liquid) => {
  const schemaMatch = liquid.match(/{% schema %}\s*([\s\S]*?)\s*{% endschema %}/);
  if (!schemaMatch) return null;
  try {
    return JSON.parse(schemaMatch[1]);
  } catch (e) {
    return { _parseError: e.message };
  }
};

/**
 * Extract all setting IDs from the schema
 */
const extractSchemaIds = (schema) => {
  if (!schema || !schema.settings) return new Set();
  return new Set(schema.settings.filter(s => s.id).map(s => s.id));
};

/**
 * Extract all data-element-id values from HTML
 */
const extractHtmlElementIds = (liquid) => {
  const ids = new Set();
  const regex = /data-element-id="([^"]+)"/g;
  let match;
  while ((match = regex.exec(liquid)) !== null) {
    ids.add(match[1]);
  }
  return ids;
};

/**
 * Collect all element IDs from input elements (recursive)
 */
const collectInputElementIds = (elements) => {
  const ids = new Set();
  const walk = (el) => {
    if (el.id) ids.add(el.id);
    if (el.children) el.children.forEach(walk);
    if (el.columns) el.columns.forEach(col => {
      if (Array.isArray(col)) col.forEach(walk);
    });
  };
  elements.forEach(walk);
  return ids;
};

// ─── Individual Validators ───────────────────────────────────

/**
 * 1. Every {{ section.settings.XXX }} in CSS/HTML has a matching schema setting ID
 */
const validateRefsHaveSettings = (liquid) => {
  const refs = extractSettingRefs(liquid);
  const schema = parseSchema(liquid);
  if (!schema || schema._parseError) {
    return { pass: false, errors: [`Schema parse error: ${schema?._parseError || 'not found'}`] };
  }
  const schemaIds = extractSchemaIds(schema);
  const errors = [];
  for (const ref of refs) {
    if (!schemaIds.has(ref)) {
      errors.push(`Referenced in CSS/HTML but missing from schema: "${ref}"`);
    }
  }
  return { pass: errors.length === 0, errors };
};

/**
 * 2. No {{ }} output tags inside {% %} logic tags
 */
const validateNoOutputInsideLogic = (liquid) => {
  const errors = [];
  // Match {% ... %} blocks and check for {{ inside them
  const regex = /\{%[^%]*\{\{[^}]*\}\}[^%]*%\}/g;
  let match;
  while ((match = regex.exec(liquid)) !== null) {
    // Find approximate line number
    const before = liquid.substring(0, match.index);
    const line = (before.match(/\n/g) || []).length + 1;
    errors.push(`Line ~${line}: Output tags {{ }} inside logic tags {% %}: "${match[0].substring(0, 80)}..."`);
  }
  return { pass: errors.length === 0, errors };
};

/**
 * 3. Every select-type schema setting has an options array
 */
const validateSelectHasOptions = (liquid) => {
  const schema = parseSchema(liquid);
  if (!schema || schema._parseError) {
    return { pass: false, errors: [`Schema parse error: ${schema?._parseError || 'not found'}`] };
  }
  const errors = [];
  for (const setting of schema.settings || []) {
    if (setting.type === 'select') {
      if (!setting.options || !Array.isArray(setting.options) || setting.options.length === 0) {
        errors.push(`Select setting "${setting.id}" (${setting.label}) is missing options array`);
      }
    }
  }
  return { pass: errors.length === 0, errors };
};

/**
 * 4. Every range-type schema setting has min, max, step, default
 */
const validateRangeHasRequired = (liquid) => {
  const schema = parseSchema(liquid);
  if (!schema || schema._parseError) {
    return { pass: false, errors: [`Schema parse error: ${schema?._parseError || 'not found'}`] };
  }
  const errors = [];
  for (const setting of schema.settings || []) {
    if (setting.type === 'range') {
      const missing = [];
      if (setting.min === undefined) missing.push('min');
      if (setting.max === undefined) missing.push('max');
      if (setting.step === undefined) missing.push('step');
      if (setting.default === undefined) missing.push('default');
      if (missing.length > 0) {
        errors.push(`Range setting "${setting.id}" (${setting.label}) missing: ${missing.join(', ')}`);
      }
    }
  }
  return { pass: errors.length === 0, errors };
};

/**
 * 5. Color-type schema settings don't have invalid defaults
 */
const validateColorDefaults = (liquid) => {
  const schema = parseSchema(liquid);
  if (!schema || schema._parseError) {
    return { pass: false, errors: [`Schema parse error: ${schema?._parseError || 'not found'}`] };
  }
  const invalidColorValues = ['transparent', 'inherit', 'initial', 'unset', 'none', 'currentColor'];
  const errors = [];
  for (const setting of schema.settings || []) {
    if (setting.type === 'color' && setting.default) {
      if (invalidColorValues.includes(setting.default)) {
        errors.push(`Color setting "${setting.id}" (${setting.label}) has invalid default: "${setting.default}"`);
      }
    }
  }
  return { pass: errors.length === 0, errors };
};

/**
 * 6. Every input element appears as data-element-id in HTML output
 */
const validateElementsInHTML = (liquid, inputElements) => {
  const htmlIds = extractHtmlElementIds(liquid);
  const inputIds = collectInputElementIds(inputElements);
  const errors = [];
  for (const id of inputIds) {
    if (!htmlIds.has(id)) {
      errors.push(`Element "${id}" exists in input but missing from HTML output`);
    }
  }
  return { pass: errors.length === 0, errors };
};

/**
 * 7. No duplicate schema setting IDs
 */
const validateNoDuplicateIds = (liquid) => {
  const schema = parseSchema(liquid);
  if (!schema || schema._parseError) {
    return { pass: false, errors: [`Schema parse error: ${schema?._parseError || 'not found'}`] };
  }
  const seen = new Map();
  const errors = [];
  for (const setting of schema.settings || []) {
    if (!setting.id) continue;
    if (seen.has(setting.id)) {
      errors.push(`Duplicate schema ID: "${setting.id}" (labels: "${seen.get(setting.id)}" and "${setting.label}")`);
    }
    seen.set(setting.id, setting.label);
  }
  return { pass: errors.length === 0, errors };
};

/**
 * 8. Orphaned schema settings — settings that exist in schema but aren't referenced in CSS/HTML
 */
const validateNoOrphanedSettings = (liquid) => {
  const refs = extractSettingRefs(liquid);
  const schema = parseSchema(liquid);
  if (!schema || schema._parseError) {
    return { pass: false, errors: [`Schema parse error: ${schema?._parseError || 'not found'}`] };
  }
  const errors = [];
  for (const setting of schema.settings || []) {
    if (!setting.id) continue; // headers don't have IDs
    if (!refs.has(setting.id)) {
      errors.push(`Schema setting "${setting.id}" (${setting.label}) is never referenced in CSS/HTML`);
    }
  }
  return { pass: errors.length === 0, errors };
};

/**
 * 9. Valid Liquid syntax basics — matching tags
 */
const validateLiquidSyntax = (liquid) => {
  const errors = [];

  // Check for unclosed {{ }}
  const openOutput = (liquid.match(/\{\{/g) || []).length;
  const closeOutput = (liquid.match(/\}\}/g) || []).length;
  if (openOutput !== closeOutput) {
    errors.push(`Mismatched output tags: ${openOutput} opening {{ vs ${closeOutput} closing }}`);
  }

  // Check for unclosed {% %}
  const openLogic = (liquid.match(/\{%/g) || []).length;
  const closeLogic = (liquid.match(/%\}/g) || []).length;
  if (openLogic !== closeLogic) {
    errors.push(`Mismatched logic tags: ${openLogic} opening {% vs ${closeLogic} closing %}`);
  }

  // Check if/endif balance
  const ifTags = (liquid.match(/\{% if /g) || []).length;
  const elsifTags = (liquid.match(/\{% elsif /g) || []).length;
  const endifTags = (liquid.match(/\{% endif %\}/g) || []).length;
  if (ifTags !== endifTags) {
    errors.push(`Mismatched if/endif: ${ifTags} {% if %} vs ${endifTags} {% endif %}`);
  }

  return { pass: errors.length === 0, errors };
};

/**
 * 10. Shopify schema limit — max 100 settings per section (Shopify enforced)
 */
const validateSettingsCount = (liquid) => {
  const schema = parseSchema(liquid);
  if (!schema || schema._parseError) {
    return { pass: false, errors: [`Schema parse error: ${schema?._parseError || 'not found'}`] };
  }
  const settingsWithId = (schema.settings || []).filter(s => s.id);
  const errors = [];
  // Shopify doesn't enforce a hard 100 limit on section settings, but warns above certain thresholds
  // The real hard limit is 256KB file size which we already check
  if (settingsWithId.length > 250) {
    errors.push(`Schema has ${settingsWithId.length} settings — exceeds Shopify's 250 limit`);
  } else if (settingsWithId.length > 200) {
    errors.push(`Schema has ${settingsWithId.length} settings — approaching Shopify's 250 limit`);
  }
  return { pass: errors.length === 0, errors, info: `${settingsWithId.length} settings` };
};

// ─── Main Runner ─────────────────────────────────────────────

/**
 * All validators in order
 */
export const validators = [
  { name: 'Schema ID consistency', fn: validateRefsHaveSettings, needsElements: false },
  { name: 'No {{ }} inside {% %}', fn: validateNoOutputInsideLogic, needsElements: false },
  { name: 'Select settings have options', fn: validateSelectHasOptions, needsElements: false },
  { name: 'Range settings have required fields', fn: validateRangeHasRequired, needsElements: false },
  { name: 'Color defaults are valid', fn: validateColorDefaults, needsElements: false },
  { name: 'All elements in HTML', fn: validateElementsInHTML, needsElements: true },
  { name: 'No duplicate schema IDs', fn: validateNoDuplicateIds, needsElements: false },
  { name: 'No orphaned schema settings', fn: validateNoOrphanedSettings, needsElements: false },
  { name: 'Liquid syntax basics', fn: validateLiquidSyntax, needsElements: false },
  { name: 'Settings count check', fn: validateSettingsCount, needsElements: false },
];

/**
 * Run all validators against a Liquid export
 * @param {string} liquidCode - The exported Liquid template
 * @param {Array} inputElements - The original elements array (for HTML checks)
 * @returns {Array} Results array: [{ name, pass, errors, info }]
 */
export const runAllValidations = (liquidCode, inputElements = []) => {
  return validators.map(v => {
    try {
      const result = v.needsElements
        ? v.fn(liquidCode, inputElements)
        : v.fn(liquidCode);
      return { name: v.name, ...result };
    } catch (e) {
      return { name: v.name, pass: false, errors: [`Validator crashed: ${e.message}`] };
    }
  });
};
