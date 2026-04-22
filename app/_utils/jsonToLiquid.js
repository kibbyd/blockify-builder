/**
 * JSON to Liquid Converter - Schema Toggle System
 *
 * Main entry point that orchestrates CSS, HTML, and schema generation
 */

import { generateLiquidStyles } from '@/app/_utils/cssGeneration';
import { generateAllElementsHTML } from '@/app/_utils/htmlGeneration';
import { generateLiquidSchema } from '@/app/_utils/schemaGeneration';
import { generateLiquidScripts } from '@/app/_utils/jsGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';
import { validateExport } from '@/app/_utils/exportValidation';

/**
 * Main conversion function
 */
export const convertJSONToLiquid = (jsonData, sectionName = 'custom-section') => {
  // Reset ID generation for each conversion to ensure unique, consistent IDs
  resetIdGenerator();

  const { elements, responsiveStyles } = jsonData;

  // Merge global responsiveStyles into elements
  const mergedElements = mergeResponsiveStyles(elements, responsiveStyles || {});

  // Generate section ID for Liquid
  const sectionId = sectionName
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/^(\d)/, 's-$1');

  // Generate the four parts
  const liquidStyles = generateLiquidStyles(mergedElements, sectionId);
  const liquidHTML = generateAllElementsHTML(mergedElements, sectionId);
  const liquidScripts = generateLiquidScripts(mergedElements);
  const liquidSchema = generateLiquidSchema(mergedElements, sectionName);

  // Combine all parts into final Liquid template
  return combineLiquidTemplate(liquidStyles, liquidHTML, liquidScripts, liquidSchema);
};

/**
 * Validate export data without generating Liquid.
 * Returns { warnings[], info: { schemaCount, elementCount, schemaLimit, schemaUtilization } }
 */
export const validateExportData = (jsonData) => {
  const { elements, responsiveStyles } = jsonData;
  const mergedElements = mergeResponsiveStyles(elements, responsiveStyles || {});
  return validateExport(mergedElements);
};

/**
 * Merge global responsiveStyles into elements
 * Passes all 5 viewports (xs/sm/md/lg/xl) through directly
 */
const mergeResponsiveStyles = (elements, globalResponsiveStyles) => {
  const viewports = ['xs', 'sm', 'md', 'lg', 'xl'];

  const mergeElementStyles = (element) => {
    // Create a copy of the element to avoid mutation
    const mergedElement = { ...element };

    // Restructure element's own responsiveStyles from viewport-first to property-first
    // Templates store as { xs: { fontSize: "14px" } }, schema needs { fontSize: { xs: "14px" } }
    const elementResponsive = element.responsiveStyles || {};
    const restructured = {};
    viewports.forEach(vp => {
      if (elementResponsive[vp] && typeof elementResponsive[vp] === 'object') {
        Object.entries(elementResponsive[vp]).forEach(([prop, value]) => {
          restructured[prop] = { ...(restructured[prop] || {}), [vp]: value };
        });
      }
    });

    mergedElement.responsiveStyles = { ...restructured };

    // Merge global responsive styles (already viewport-first from builder state)
    const globalStyles = globalResponsiveStyles[element.id];
    if (globalStyles) {
      viewports.forEach(vp => {
        if (globalStyles[vp]) {
          Object.entries(globalStyles[vp]).forEach(([prop, value]) => {
            mergedElement.responsiveStyles[prop] = {
              ...(mergedElement.responsiveStyles[prop] || {}),
              [vp]: value
            };
          });
        }
      });
    }

    // Recursively process children
    if (mergedElement.children) {
      mergedElement.children = mergedElement.children.map(mergeElementStyles);
    }

    // Recursively process columns
    if (mergedElement.columns) {
      mergedElement.columns = mergedElement.columns.map(column =>
        Array.isArray(column) ? column.map(mergeElementStyles) : column
      );
    }

    return mergedElement;
  };

  return elements.map(mergeElementStyles);
};

/**
 * Combine styles, HTML, and schema into complete Liquid template
 */
const combineLiquidTemplate = (styles, html, scripts, schema) => {
  let template = '';

  // Add styles
  template += styles;
  template += '\n';

  // Add HTML
  template += html;
  template += '\n';

  // Add scripts (between HTML and schema)
  if (scripts) {
    template += scripts;
    template += '\n';
  }

  // Add schema
  template += '{% schema %}\n';
  template += schema;
  template += '\n{% endschema %}\n';

  return template;
};
