/**
 * Liquid to HTML Converter
 * Strips all liquid syntax and converts to static HTML + CSS
 */

export const convertLiquidToHtml = (liquidContent) => {
  let html = liquidContent;
  let css = '';
  let externalCssFiles = [];

  // Step 1: Extract external CSS file references
  const cssReferenceRegex = /\{\{\s*['"]([^'"]*\.css)['"]\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}/g;
  let match;
  while ((match = cssReferenceRegex.exec(liquidContent)) !== null) {
    externalCssFiles.push(match[1]);
  }

  // Remove external CSS references from HTML
  html = html.replace(cssReferenceRegex, `<!-- External CSS: $1 (upload required) -->`);

  // Step 2: Extract CSS from {% style %} blocks
  const styleBlockMatch = html.match(/\{%\s*style\s*%\}([\s\S]*?)\{%\s*endstyle\s*%\}/);
  if (styleBlockMatch) {
    css = processLiquidCss(styleBlockMatch[1]);
    html = html.replace(styleBlockMatch[0], ''); // Remove {% style %} block
  }

  // Step 3: Extract inline <style> tags
  const inlineStyleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
  if (inlineStyleMatches) {
    inlineStyleMatches.forEach(styleTag => {
      const styleContent = styleTag.match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
      css += '\n' + processLiquidCss(styleContent);
    });
  }

  // Step 4: Process liquid loops - keep first iteration
  html = processLiquidLoops(html);

  // Step 5: Process liquid conditionals
  html = processLiquidConditionals(html);

  // Step 6: Replace liquid variables with placeholders
  html = replaceLiquidVariables(html);

  // Step 7: Remove remaining liquid tags
  html = html.replace(/\{%-?\s*[^%]*-?%\}/g, '');

  // Step 8: Clean up whitespace
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  return {
    html,
    css,
    externalCssFiles
  };
};

/**
 * Process CSS that contains liquid variables
 */
const processLiquidCss = (cssContent) => {
  let css = cssContent;

  // Replace liquid variables with default values
  css = css.replace(/\{\{\s*section\.settings\.([^}|]+)(\|[^}]*)?\s*\}\}/g, (match, setting) => {
    return getDefaultCssValue(setting);
  });

  css = css.replace(/\{\{\s*settings\.([^}|]+)(\|[^}]*)?\s*\}\}/g, (match, setting) => {
    return getDefaultCssValue(setting);
  });

  // Remove liquid control flow from CSS
  css = css.replace(/\{%\s*if[^%]*%\}/g, '');
  css = css.replace(/\{%\s*endif\s*%\}/g, '');
  css = css.replace(/\{%\s*elsif[^%]*%\}/g, '');
  css = css.replace(/\{%\s*else\s*%\}/g, '');

  return css;
};

/**
 * Get default CSS values for common settings
 */
const getDefaultCssValue = (setting) => {
  const lowerSetting = setting.toLowerCase().trim();

  // Colors
  if (lowerSetting.includes('color') || lowerSetting.includes('background')) {
    if (lowerSetting.includes('white') || lowerSetting.includes('light')) return '#ffffff';
    if (lowerSetting.includes('black') || lowerSetting.includes('dark')) return '#000000';
    if (lowerSetting.includes('primary')) return '#0066cc';
    if (lowerSetting.includes('secondary')) return '#6c757d';
    return '#333333';
  }

  // Sizes
  if (lowerSetting.includes('size') || lowerSetting.includes('width') || lowerSetting.includes('height')) {
    if (lowerSetting.includes('heading')) return '32px';
    if (lowerSetting.includes('text') || lowerSetting.includes('body')) return '16px';
    if (lowerSetting.includes('container')) return '1200px';
    return '100%';
  }

  // Spacing
  if (lowerSetting.includes('padding') || lowerSetting.includes('margin')) {
    return '20px';
  }

  // Opacity
  if (lowerSetting.includes('opacity')) {
    return '1';
  }

  // Font family
  if (lowerSetting.includes('font')) {
    if (lowerSetting.includes('family')) return 'Arial, sans-serif';
    if (lowerSetting.includes('weight')) return '400';
    if (lowerSetting.includes('line-height') || lowerSetting.includes('line_height')) return '1.5';
    if (lowerSetting.includes('letter-spacing') || lowerSetting.includes('letter_spacing')) return '0';
  }

  // Border radius
  if (lowerSetting.includes('radius')) {
    return '8px';
  }

  // Default
  return 'auto';
};

/**
 * Process liquid loops - keep first iteration
 */
const processLiquidLoops = (html) => {
  // Handle {% for %} loops
  const forLoopRegex = /\{%\s*for\s+(\w+)\s+in\s+\((\d+)\.\.(\d+)\)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g;

  html = html.replace(forLoopRegex, (match, variable, start, end, content) => {
    // Keep one iteration of the loop content
    let processed = content;
    // Replace the loop variable with the start value
    processed = processed.replace(new RegExp(`\\b${variable}\\b`, 'g'), start);
    return processed;
  });

  // Handle {% for item in collection %} style loops
  const collectionLoopRegex = /\{%\s*for\s+(\w+)\s+in\s+([^\s%]+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g;

  html = html.replace(collectionLoopRegex, (match, variable, collection, content) => {
    // Keep one iteration
    return content;
  });

  return html;
};

/**
 * Process liquid conditionals - keep content
 */
const processLiquidConditionals = (html) => {
  // Remove {% if %} but keep content
  html = html.replace(/\{%\s*if\s+[^%]*%\}/g, '');
  html = html.replace(/\{%\s*elsif\s+[^%]*%\}/g, '');
  html = html.replace(/\{%\s*else\s*%\}/g, '');
  html = html.replace(/\{%\s*endif\s*%\}/g, '');
  html = html.replace(/\{%-\s*if\s+[^%]*-%\}/g, '');
  html = html.replace(/\{%-\s*endif\s*-%\}/g, '');

  // Remove {% unless %}
  html = html.replace(/\{%\s*unless\s+[^%]*%\}/g, '');
  html = html.replace(/\{%\s*endunless\s*%\}/g, '');

  return html;
};

/**
 * Replace liquid variables with placeholders
 */
const replaceLiquidVariables = (html) => {
  // Replace section settings variables
  html = html.replace(/\{\{\s*section\.settings\.([^}|]+)(\|[^}]*)?\s*\}\}/g, (match, setting) => {
    return getPlaceholderValue(setting);
  });

  // Replace block settings
  html = html.replace(/\{\{\s*block\.settings\.([^}|]+)(\|[^}]*)?\s*\}\}/g, (match, setting) => {
    return getPlaceholderValue(setting);
  });

  // Replace theme settings
  html = html.replace(/\{\{\s*settings\.([^}|]+)(\|[^}]*)?\s*\}\}/g, (match, setting) => {
    return getPlaceholderValue(setting);
  });

  // Replace product/collection variables
  html = html.replace(/\{\{\s*product\.([^}|]+)(\|[^}]*)?\s*\}\}/g, 'Product $1');
  html = html.replace(/\{\{\s*collection\.([^}|]+)(\|[^}]*)?\s*\}\}/g, 'Collection $1');

  // Replace image filters with placeholder images
  html = html.replace(/\{\{\s*([^}]*)\|\s*image_url[^}]*\}\}/g, 'https://via.placeholder.com/400x300');
  html = html.replace(/\{\{\s*([^}]*)\|\s*img_url[^}]*\}\}/g, 'https://via.placeholder.com/400x300');

  // Replace asset URLs
  html = html.replace(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*asset_url\s*\}\}/g, '/assets/$1');

  // Replace remaining variables
  html = html.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, variable) => {
    return `[${variable.trim()}]`;
  });

  return html;
};

/**
 * Get placeholder values for settings
 */
const getPlaceholderValue = (setting) => {
  const lowerSetting = setting.toLowerCase().trim();

  if (lowerSetting.includes('heading') || lowerSetting.includes('title')) {
    return 'Sample Heading';
  }
  if (lowerSetting.includes('text') || lowerSetting.includes('description')) {
    return 'Sample text content goes here';
  }
  if (lowerSetting.includes('button')) {
    return 'Click Here';
  }
  if (lowerSetting.includes('label')) {
    return 'Label';
  }
  if (lowerSetting.includes('subtitle')) {
    return 'Subtitle text';
  }

  return `[${setting}]`;
};