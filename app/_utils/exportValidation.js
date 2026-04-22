/**
 * Export Validation — runs before export, flags issues without changing output.
 *
 * Route definitions:
 *   route 1 — in panel, no defaults, no toggles. User manually toggles on.
 *   route 2 — in panel, toggled on, has default value, editable in Shopify.
 *   route 3 — hardcoded in cssGeneration, not in panel, not editable.
 *   unclassified — doesn't fit any route cleanly. Always a warning.
 */

import { elementDefinitions, getElementDef } from '@/app/_config/elementDefinitions';

/**
 * Classify a style property into route 1, 2, 3, or unclassified.
 */
const classifyStyleProp = (prop, element, inFilteredSet, isTemplate) => {
  const hasValue = element.style?.[prop.name] !== undefined && element.style?.[prop.name] !== '';
  const hasResponsive = element.responsiveStyles?.[prop.name] !== undefined;
  const hasToggle = element.schemaToggles?.[prop.name] === true;
  const hasDefault = prop.default !== undefined && prop.default !== null;

  // Route 3: not schema-editable by design — structural/hardcoded
  if (!prop.canBeSchemaEditable) {
    return { route: 3, reason: 'not canBeSchemaEditable — structural' };
  }

  // Template: property outside filtered set — should not be in output
  if (isTemplate && !inFilteredSet) {
    if (hasValue || hasResponsive) {
      return { route: 'unclassified', reason: 'has value but outside template filter' };
    }
    return null; // not in output at all, skip
  }

  // Route 2: toggle on + has value or default
  if (hasToggle && (hasValue || hasResponsive || hasDefault)) {
    return { route: 2, reason: 'toggle on, value present — editable in Shopify' };
  }

  // Route 1: in panel, no toggle, no value — user hasn't opted in
  if (!hasToggle && !hasValue && !hasResponsive) {
    return { route: 1, reason: 'available in panel, not active' };
  }

  // Route 1 active: user toggled on without a pre-set default
  if (hasToggle && !hasDefault && (hasValue || hasResponsive)) {
    return { route: 1, reason: 'user toggled on, no preset default' };
  }

  // Toggle on but no value anywhere
  if (hasToggle && !hasValue && !hasResponsive && !hasDefault) {
    return { route: 'unclassified', reason: 'toggle on but no value or default' };
  }

  // Value exists, editable, but no toggle — hardcoded when it should be editable
  if ((hasValue || hasResponsive) && !hasToggle) {
    return { route: 'unclassified', reason: 'has value and canBeSchemaEditable but no toggle — hardcoded instead of editable' };
  }

  return { route: 'unclassified', reason: 'does not match any defined route' };
};

/**
 * Classify a content property into route 1, 2, 3, or unclassified.
 */
const classifyContentProp = (prop, element, inFilteredSet, isTemplate) => {
  const hasValue = element.props?.[prop.name] !== undefined && element.props?.[prop.name] !== '';
  const hasToggle = element.schemaToggles?.[prop.name] === true;
  const hasDefault = prop.default !== undefined && prop.default !== null;

  if (!prop.canBeSchemaEditable) {
    return { route: 3, reason: 'not canBeSchemaEditable — structural' };
  }

  if (isTemplate && !inFilteredSet) {
    if (hasValue) {
      return { route: 'unclassified', reason: 'has value but outside template filter' };
    }
    return null;
  }

  if (hasToggle && (hasValue || hasDefault)) {
    return { route: 2, reason: 'toggle on, value present — editable in Shopify' };
  }

  if (!hasToggle && !hasValue) {
    return { route: 1, reason: 'available in panel, not active' };
  }

  if (hasToggle && !hasValue && !hasDefault) {
    return { route: 'unclassified', reason: 'toggle on but no value or default' };
  }

  if (hasValue && !hasToggle) {
    return { route: 'unclassified', reason: 'has value and canBeSchemaEditable but no toggle' };
  }

  return { route: 'unclassified', reason: 'does not match any defined route' };
};

/**
 * Validate all elements before export.
 * Returns { warnings[], classifications[], info: { schemaCount, elementCount, ... } }
 */
export const validateExport = (mergedElements) => {
  const warnings = [];
  const classifications = [];
  let schemaCount = 0;

  const processElement = (element) => {
    if (!element || !element.type) return;

    const rawDef = elementDefinitions[element.type];
    if (!rawDef) return;

    const filteredDef = getElementDef(element.type, element.fromTemplate);
    const filteredStyleNames = new Set(filteredDef?.styleProps?.map(p => p.name) || []);
    const filteredContentNames = new Set(filteredDef?.contentProps?.map(p => p.name) || []);
    const isTemplate = !!element.fromTemplate;

    // Classify style properties
    rawDef.styleProps?.forEach(prop => {
      const hasToggle = element.schemaToggles?.[prop.name] === true;
      if (hasToggle) {
        schemaCount += prop.responsive ? 3 : 1;
      }

      const result = classifyStyleProp(prop, element, filteredStyleNames.has(prop.name), isTemplate);
      if (!result) return; // not in output, skip

      classifications.push({
        elementId: element.id,
        elementType: element.type,
        property: prop.name,
        propKind: 'style',
        route: result.route,
        reason: result.reason,
      });

      if (result.route === 'unclassified') {
        warnings.push({
          type: 'route-unclassified',
          elementId: element.id,
          elementType: element.type,
          property: prop.name,
          message: `"${prop.name}" — ${result.reason}`,
        });
      }
    });

    // Classify content properties
    rawDef.contentProps?.forEach(prop => {
      const hasToggle = element.schemaToggles?.[prop.name] === true;
      if (hasToggle) {
        schemaCount += 1;
      }

      const result = classifyContentProp(prop, element, filteredContentNames.has(prop.name), isTemplate);
      if (!result) return;

      classifications.push({
        elementId: element.id,
        elementType: element.type,
        property: prop.name,
        propKind: 'content',
        route: result.route,
        reason: result.reason,
      });

      if (result.route === 'unclassified') {
        warnings.push({
          type: 'route-unclassified',
          elementId: element.id,
          elementType: element.type,
          property: prop.name,
          message: `"${prop.name}" — ${result.reason}`,
        });
      }
    });

    // Recurse children
    if (element.children) {
      element.children.forEach(processElement);
    }

    // Recurse columns — count column schema toggles
    if (element.columns) {
      for (let i = 0; i < element.columns.length; i++) {
        const nsPrefix = `col-${i}-`;
        const colDef = getElementDef('column', element.fromTemplate);
        if (colDef?.styleProps) {
          colDef.styleProps.forEach(prop => {
            const nsKey = `${nsPrefix}${prop.name}`;
            const hasToggle = element.schemaToggles?.[nsKey] === true;
            if (hasToggle) {
              schemaCount += prop.responsive ? 3 : 1;
            }
          });
        }

        const column = element.columns[i];
        if (Array.isArray(column)) {
          column.forEach(processElement);
        }
      }
    }
  };

  mergedElements.forEach(processElement);

  const routeCounts = { 1: 0, 2: 0, 3: 0, unclassified: 0 };
  classifications.forEach(c => { routeCounts[c.route] = (routeCounts[c.route] || 0) + 1; });

  return {
    warnings,
    classifications,
    info: {
      schemaCount,
      elementCount: countElements(mergedElements),
      schemaLimit: 250,
      schemaUtilization: `${Math.round((schemaCount / 250) * 100)}%`,
      routeCounts,
    },
  };
};

const countElements = (elements) => {
  let count = 0;
  const walk = (el) => {
    count++;
    el.children?.forEach(walk);
    el.columns?.forEach(col => {
      if (Array.isArray(col)) col.forEach(walk);
    });
  };
  elements.forEach(walk);
  return count;
};
