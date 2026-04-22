/**
 * Liquid Resolver
 *
 * Resolves exported Liquid templates by substituting schema defaults,
 * evaluating conditionals, and producing renderable HTML+CSS.
 * Used for visual preview testing — verifies exported Liquid renders correctly.
 */

/**
 * Parse the schema JSON from a Liquid template
 */
const parseSchema = (liquid) => {
  const match = liquid.match(/{% schema %}\s*([\s\S]*?)\s*{% endschema %}/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
};

/**
 * Build a settings map from schema defaults
 * { settingId: defaultValue }
 */
const buildSettingsMap = (schema) => {
  const map = {};
  if (!schema?.settings) return map;
  for (const setting of schema.settings) {
    if (!setting.id) continue; // headers
    if (setting.default !== undefined && setting.default !== null) {
      map[setting.id] = setting.default;
    } else {
      // No default — set type-appropriate empty
      switch (setting.type) {
        case 'checkbox': map[setting.id] = false; break;
        case 'number': case 'range': map[setting.id] = 0; break;
        case 'color': map[setting.id] = ''; break;
        case 'image_picker': map[setting.id] = ''; break;
        default: map[setting.id] = ''; break;
      }
    }
  }
  return map;
};

/**
 * Evaluate a Liquid value against the settings map
 * Handles: section.settings.XXX, 'literal', number, true, false, blank
 */
const resolveValue = (expr, settings, mockSectionId) => {
  expr = expr.trim();

  if (expr === 'blank') return '';
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  if (expr === 'nil' || expr === 'null') return null;

  // String literal
  if ((expr.startsWith("'") && expr.endsWith("'")) || (expr.startsWith('"') && expr.endsWith('"'))) {
    return expr.slice(1, -1);
  }

  // Number
  if (/^-?\d+(\.\d+)?$/.test(expr)) {
    return parseFloat(expr);
  }

  // section.settings.XXX
  if (expr.startsWith('section.settings.')) {
    const key = expr.substring('section.settings.'.length);
    return settings[key] !== undefined ? settings[key] : '';
  }

  // section.id
  if (expr === 'section.id') return mockSectionId;

  return expr;
};

/**
 * Apply Liquid filters to a value
 * Handles: default, escape, money, replace, strip_html, truncatewords, times, url_encode, date
 */
const applyFilters = (value, filterChain) => {
  let result = value;

  for (const filter of filterChain) {
    const filterName = filter.name.trim();
    const args = filter.args || [];

    switch (filterName) {
      case 'default': {
        if (result === '' || result === null || result === undefined || result === false) {
          result = args[0] || '';
        }
        break;
      }
      case 'escape': {
        result = String(result).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        break;
      }
      case 'money': {
        const num = parseFloat(result);
        result = isNaN(num) ? '$0.00' : `$${(num / 100).toFixed(2)}`;
        break;
      }
      case 'times': {
        const multiplier = parseFloat(args[0]);
        result = (parseFloat(result) || 0) * (isNaN(multiplier) ? 1 : multiplier);
        break;
      }
      case 'replace': {
        if (args.length >= 2) {
          result = String(result).replace(args[0], args[1]);
        }
        break;
      }
      case 'strip_html': {
        result = String(result).replace(/<[^>]*>/g, '');
        break;
      }
      case 'truncatewords': {
        const limit = parseInt(args[0]) || 20;
        const words = String(result).split(/\s+/);
        result = words.length > limit ? words.slice(0, limit).join(' ') + '...' : result;
        break;
      }
      case 'url_encode': {
        result = encodeURIComponent(String(result));
        break;
      }
      case 'date': {
        // Simplified date formatting
        result = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        break;
      }
      case 'image_url': {
        // Mock image URL — use placeholder
        if (result && String(result).length > 0) {
          result = `https://placehold.co/600x400/e2e2e2/999?text=Image`;
        }
        break;
      }
      case 'placeholder_svg_tag': {
        const cls = args[0] || 'placeholder';
        result = `<div class="${cls}" style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;min-height:200px;color:#999;font-size:14px;">Placeholder</div>`;
        break;
      }
      // Ignore unknown filters
      default: break;
    }
  }

  return result;
};

/**
 * Parse a filter chain string like "| default: 'value' | escape"
 * Returns array of { name, args }
 */
const parseFilterChain = (filterStr) => {
  const filters = [];
  // Split by | but not inside quotes
  const parts = filterStr.split(/\s*\|\s*/);

  for (const part of parts) {
    if (!part.trim()) continue;
    const colonIdx = part.indexOf(':');
    if (colonIdx === -1) {
      filters.push({ name: part.trim(), args: [] });
    } else {
      const name = part.substring(0, colonIdx).trim();
      const argsStr = part.substring(colonIdx + 1).trim();
      // Parse args — split by comma, strip quotes
      const args = argsStr.split(/,\s*/).map(a => {
        a = a.trim();
        if ((a.startsWith("'") && a.endsWith("'")) || (a.startsWith('"') && a.endsWith('"'))) {
          return a.slice(1, -1);
        }
        // Handle key: value pairs (like width: 600)
        if (a.includes(':')) {
          return a; // Keep as-is for complex args
        }
        return a;
      });
      filters.push({ name, args });
    }
  }

  return filters;
};

/**
 * Resolve {{ output tags }}
 */
const resolveOutputTags = (liquid, settings, mockSectionId) => {
  return liquid.replace(/\{\{([\s\S]*?)\}\}/g, (match, inner) => {
    inner = inner.trim();

    // Split expression from filters
    const parts = inner.split('|');
    const expr = parts[0].trim();
    const filterStr = parts.slice(1).join('|');

    let value = resolveValue(expr, settings, mockSectionId);
    if (filterStr.trim()) {
      const filters = parseFilterChain(filterStr);
      value = applyFilters(value, filters);
    }

    return value !== undefined && value !== null ? String(value) : '';
  });
};

/**
 * Evaluate a Liquid condition expression
 * Handles: ==, !=, >, <, >=, <=, and, or, blank, true/false
 */
const evaluateCondition = (condStr, settings, mockSectionId) => {
  condStr = condStr.trim();

  // Handle 'and' / 'or' (split at lowest precedence first)
  // Simple approach: split on ' or ' first, then ' and '
  if (condStr.includes(' or ')) {
    const parts = condStr.split(/\s+or\s+/);
    return parts.some(p => evaluateCondition(p.trim(), settings, mockSectionId));
  }
  if (condStr.includes(' and ')) {
    const parts = condStr.split(/\s+and\s+/);
    return parts.every(p => evaluateCondition(p.trim(), settings, mockSectionId));
  }

  // Comparison operators
  const ops = ['!=', '>=', '<=', '==', '>', '<'];
  for (const op of ops) {
    const idx = condStr.indexOf(` ${op} `);
    if (idx !== -1) {
      const left = resolveValue(condStr.substring(0, idx).trim(), settings, mockSectionId);
      const right = resolveValue(condStr.substring(idx + op.length + 2).trim(), settings, mockSectionId);

      switch (op) {
        case '==': return left == right;
        case '!=': return left != right;
        case '>': return Number(left) > Number(right);
        case '<': return Number(left) < Number(right);
        case '>=': return Number(left) >= Number(right);
        case '<=': return Number(left) <= Number(right);
      }
    }
  }

  // Single value — check truthiness
  const val = resolveValue(condStr, settings, mockSectionId);
  return val !== '' && val !== false && val !== null && val !== undefined && val !== 0;
};

/**
 * Process {% logic tags %} — if/elsif/else/endif, unless/endunless, assign, for
 * This is the core resolver that evaluates control flow.
 */
const resolveLogicTags = (liquid, settings, mockSectionId) => {
  let result = '';
  let pos = 0;

  // Stack-based processor for nested conditionals
  const process = (input) => {
    let output = '';
    let i = 0;

    while (i < input.length) {
      const tagStart = input.indexOf('{%', i);
      if (tagStart === -1) {
        output += input.substring(i);
        break;
      }

      // Add text before tag
      output += input.substring(i, tagStart);

      const tagEnd = input.indexOf('%}', tagStart);
      if (tagEnd === -1) {
        output += input.substring(i);
        break;
      }

      const tagContent = input.substring(tagStart + 2, tagEnd).trim();
      i = tagEnd + 2;

      // Handle different tag types
      if (tagContent.startsWith('if ')) {
        const condition = tagContent.substring(3).trim();
        const { body, elseBody, endIdx } = extractConditionalBlock(input, i);
        i = endIdx;

        if (evaluateCondition(condition, settings, mockSectionId)) {
          output += process(body);
        } else if (elseBody !== null) {
          output += process(elseBody);
        }
      } else if (tagContent.startsWith('unless ')) {
        const condition = tagContent.substring(7).trim();
        const { body, elseBody, endIdx } = extractUnlessBlock(input, i);
        i = endIdx;

        if (!evaluateCondition(condition, settings, mockSectionId)) {
          output += process(body);
        }
      } else if (tagContent.startsWith('assign ')) {
        // Handle assign — add to settings map
        const assignMatch = tagContent.match(/^assign\s+(\w+)\s*=\s*(.+)$/);
        if (assignMatch) {
          const varName = assignMatch[1];
          let valueExpr = assignMatch[2].trim();

          // Handle filters on assign
          const parts = valueExpr.split('|');
          const expr = parts[0].trim();
          let value = resolveValue(expr, settings, mockSectionId);

          if (parts.length > 1) {
            const filterStr = parts.slice(1).join('|');
            const filters = parseFilterChain(filterStr);
            value = applyFilters(value, filters);
          }

          settings[varName] = value;
        }
      } else if (tagContent.startsWith('for ')) {
        // For loops — render placeholder content
        const { body, endIdx } = extractForBlock(input, i);
        i = endIdx;
        // Render loop body once with mock data as a preview
        output += `<!-- loop preview -->\n`;
        output += process(body);
      } else if (tagContent === 'endfor' || tagContent === 'endif' || tagContent === 'endunless') {
        // Stray end tags (shouldn't happen with correct nesting)
      } else if (tagContent.startsWith('form ')) {
        // Shopify form tag — just output as HTML form
        output += `<form>`;
      } else if (tagContent === 'endform') {
        output += `</form>`;
      } else if (tagContent.startsWith('render ')) {
        // {% render 'icon-xxx' %} — output SVG placeholder
        const renderMatch = tagContent.match(/render\s+'([^']+)'/);
        if (renderMatch) {
          const snippet = renderMatch[1];
          if (snippet.startsWith('icon-')) {
            const platform = snippet.replace('icon-', '');
            output += `<span style="display:inline-block;width:20px;height:20px;background:#666;border-radius:3px;" title="${platform}"></span>`;
          }
        }
      } else if (tagContent === 'schema' || tagContent === 'endschema') {
        // Skip schema blocks
        if (tagContent === 'schema') {
          const schemaEnd = input.indexOf('{% endschema %}', i);
          if (schemaEnd !== -1) {
            i = schemaEnd + '{% endschema %}'.length;
          }
        }
      }
      // Ignore elsif/else as standalone (handled by extractConditionalBlock)
    }

    return output;
  };

  return process(liquid);
};

/**
 * Extract the body and else-body of an if block, handling nesting
 */
const extractConditionalBlock = (input, startIdx) => {
  let depth = 1;
  let i = startIdx;
  let body = '';
  let elseBody = null;
  let inElse = false;

  while (i < input.length && depth > 0) {
    const nextTag = input.indexOf('{%', i);
    if (nextTag === -1) break;

    const tagEnd = input.indexOf('%}', nextTag);
    if (tagEnd === -1) break;

    const tagContent = input.substring(nextTag + 2, tagEnd).trim();

    if (tagContent.startsWith('if ') || tagContent.startsWith('unless ') || tagContent.startsWith('for ')) {
      if (!inElse) body += input.substring(i, tagEnd + 2);
      else elseBody += input.substring(i, tagEnd + 2);
      depth++;
      i = tagEnd + 2;
    } else if (tagContent === 'endif') {
      depth--;
      if (depth === 0) {
        if (!inElse) body += input.substring(i, nextTag);
        else elseBody += input.substring(i, nextTag);
        i = tagEnd + 2;
      } else {
        if (!inElse) body += input.substring(i, tagEnd + 2);
        else elseBody += input.substring(i, tagEnd + 2);
        i = tagEnd + 2;
      }
    } else if (tagContent === 'endunless') {
      depth--;
      if (!inElse) body += input.substring(i, tagEnd + 2);
      else elseBody += input.substring(i, tagEnd + 2);
      i = tagEnd + 2;
    } else if (tagContent === 'endfor') {
      depth--;
      if (!inElse) body += input.substring(i, tagEnd + 2);
      else elseBody += input.substring(i, tagEnd + 2);
      i = tagEnd + 2;
    } else if ((tagContent === 'else' || tagContent.startsWith('elsif ')) && depth === 1) {
      if (!inElse) {
        body += input.substring(i, nextTag);
        inElse = true;
        elseBody = '';
      }
      if (tagContent.startsWith('elsif ')) {
        // Treat elsif as a nested if within else
        const elsifCondition = tagContent.substring(6).trim();
        elseBody += `{% if ${elsifCondition} %}`;
      }
      i = tagEnd + 2;
    } else {
      if (!inElse) body += input.substring(i, tagEnd + 2);
      else elseBody += input.substring(i, tagEnd + 2);
      i = tagEnd + 2;
    }
  }

  // Close any elsif chains
  if (elseBody !== null && elseBody.includes('{% if ')) {
    elseBody += '{% endif %}';
  }

  return { body, elseBody, endIdx: i };
};

/**
 * Extract unless block body
 */
const extractUnlessBlock = (input, startIdx) => {
  let depth = 1;
  let i = startIdx;
  let body = '';

  while (i < input.length && depth > 0) {
    const nextTag = input.indexOf('{%', i);
    if (nextTag === -1) { body += input.substring(i); break; }

    const tagEnd = input.indexOf('%}', nextTag);
    if (tagEnd === -1) { body += input.substring(i); break; }

    const tagContent = input.substring(nextTag + 2, tagEnd).trim();

    if (tagContent.startsWith('unless ') || tagContent.startsWith('if ') || tagContent.startsWith('for ')) {
      body += input.substring(i, tagEnd + 2);
      depth++;
    } else if (tagContent === 'endunless' || tagContent === 'endif' || tagContent === 'endfor') {
      depth--;
      if (depth === 0) {
        body += input.substring(i, nextTag);
        i = tagEnd + 2;
        break;
      }
      body += input.substring(i, tagEnd + 2);
    } else {
      body += input.substring(i, tagEnd + 2);
    }
    i = tagEnd + 2;
  }

  return { body, endIdx: i };
};

/**
 * Extract for block body
 */
const extractForBlock = (input, startIdx) => {
  let depth = 1;
  let i = startIdx;
  let body = '';

  while (i < input.length && depth > 0) {
    const nextTag = input.indexOf('{%', i);
    if (nextTag === -1) { body += input.substring(i); break; }

    const tagEnd = input.indexOf('%}', nextTag);
    if (tagEnd === -1) { body += input.substring(i); break; }

    const tagContent = input.substring(nextTag + 2, tagEnd).trim();

    if (tagContent.startsWith('for ')) {
      body += input.substring(i, tagEnd + 2);
      depth++;
    } else if (tagContent === 'endfor') {
      depth--;
      if (depth === 0) {
        body += input.substring(i, nextTag);
        i = tagEnd + 2;
        break;
      }
      body += input.substring(i, tagEnd + 2);
    } else {
      body += input.substring(i, tagEnd + 2);
    }
    i = tagEnd + 2;
  }

  return { body, endIdx: i };
};

// ─── Main Export ──────────────────────────────────────────────

/**
 * Resolve a Liquid template to renderable HTML
 * @param {string} liquidCode - The exported Liquid template
 * @returns {{ html: string, css: string, settingsUsed: number }}
 */
export const resolveLiquid = (liquidCode) => {
  const schema = parseSchema(liquidCode);
  const settings = schema ? buildSettingsMap(schema) : {};
  const mockSectionId = 'preview-' + Math.random().toString(36).substring(2, 8);

  // Remove schema block from processing
  let code = liquidCode.replace(/{% schema %}[\s\S]*{% endschema %}/, '');

  // Step 1: Resolve logic tags (if/unless/assign/for)
  code = resolveLogicTags(code, settings, mockSectionId);

  // Step 2: Resolve remaining output tags {{ }}
  code = resolveOutputTags(code, settings, mockSectionId);

  // Step 3: Extract CSS and HTML
  let css = '';
  let html = '';

  const styleMatch = code.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    css = styleMatch[1];
    html = code.replace(/<style>[\s\S]*?<\/style>/, '').trim();
  } else {
    html = code.trim();
  }

  // Step 4: Clean up any remaining Liquid artifacts
  html = html.replace(/\{%[\s\S]*?%\}/g, ''); // Remove stray logic tags
  html = html.replace(/\{\{[\s\S]*?\}\}/g, ''); // Remove unresolved output tags
  css = css.replace(/\{%[\s\S]*?%\}/g, '');
  css = css.replace(/\{\{[\s\S]*?\}\}/g, '');

  return {
    html,
    css,
    settingsUsed: Object.keys(settings).length,
    sectionId: mockSectionId,
  };
};

/**
 * Build a complete HTML document for iframe preview
 */
export const buildPreviewDocument = (liquidCode) => {
  const { html, css, settingsUsed, sectionId } = resolveLiquid(liquidCode);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  img { max-width: 100%; height: auto; }
  a { text-decoration: none; color: inherit; }
  ${css}
</style>
</head>
<body>
${html}
</body>
</html>`;
};
