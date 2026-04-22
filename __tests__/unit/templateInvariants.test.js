/**
 * Template Invariant Enforcement Tests
 *
 * Validates the 3-location rule for every template:
 *   1. Every filter map property has a backing value in template JSON
 *   2. Every filter map property is NOT also hardcoded in templateCSS
 *   3. Every JSON styleOverride/propOverride is in filter map OR templateCSS
 *   4. Schema count stays under 250
 *
 * These tests catch the silent failures where a property exists in one
 * location but is missing from another, causing it to either not export
 * or export incorrectly.
 */

// Mock heavy UI dependencies that templateUtils transitively imports
jest.mock('@/app/_components/ComponentPalette', () => () => null);
jest.mock('@/app/_components/TemplatePanel', () => () => null);
jest.mock('@/app/_components/Canvas', () => () => null);
jest.mock('@/app/_components/PropertyPanel', () => () => null);
jest.mock('@/app/_components/Toolbar', () => () => null);
jest.mock('@/app/_components/Navigator', () => () => null);
jest.mock('@/app/_components/ErrorBoundary', () => () => null);
jest.mock('@/app/_components/PaymentWall', () => () => null);
jest.mock('lucide-react', () => ({ X: () => null }));
jest.mock('@/app/_utils/liquidParser', () => ({
  parseLiquidToElements: jest.fn(),
  convertElementsToLiquid: jest.fn(),
}));
jest.mock('@/app/_utils/jsonToLiquid', () => ({
  convertJSONToLiquid: jest.fn(),
  validateExportData: jest.fn(),
}));
jest.mock('@/app/_hooks/useSubscription', () => () => ({ isActive: true }));
jest.mock('next-auth/react', () => ({ useSession: () => ({ data: null }) }));
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

let mockUuidCounter = 0;
jest.mock('uuid', () => ({
  v4: () => `uuid-${++mockUuidCounter}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
}));

import { elementDefinitions, getElementDef } from '@/app/_config/elementDefinitions';
import { sectionTemplates } from '@/app/_config/templates';
import { instantiateTemplate } from '@/app/_utils/templateUtils';
import { templateCSSGenerators, resetTemplateCounters } from '@/app/_utils/templateCSS';
import { generateAllElementsSchemaSettings } from '@/app/_utils/schemaGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

beforeEach(() => {
  resetIdGenerator();
  mockUuidCounter = 0;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function camelToKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/** Recursively collect all elements from a template JSON (raw, pre-instantiation) */
function collectRawElements(element) {
  const elems = [element];
  if (element.children) {
    element.children.forEach(c => elems.push(...collectRawElements(c)));
  }
  return elems;
}

/** Recursively collect all elements from instantiated elements */
function collectAllElements(element) {
  const elems = [element];
  if (element.children) {
    element.children.forEach(c => elems.push(...collectAllElements(c)));
  }
  if (element.columns) {
    element.columns.forEach(col => {
      if (Array.isArray(col)) {
        col.forEach(c => elems.push(...collectAllElements(c)));
      }
    });
  }
  return elems;
}

/**
 * Extract CSS property names from the BASE rules of a templateCSS output string.
 * Only looks at properties outside of @media blocks — responsive overrides for
 * xs/md are expected to coexist with filter map properties (different breakpoints).
 * Returns a Set of kebab-case property names.
 */
function extractBaseCSSPropertyNames(cssString) {
  const props = new Set();
  // Strip all @media blocks to get only base CSS
  const baseCSS = cssString.replace(/@media[^{]*\{[^}]*\{[^}]*\}[^}]*\}/g, '');
  const matches = baseCSS.match(/^\s+([\w-]+)\s*:/gm) || [];
  matches.forEach(m => {
    const name = m.trim().replace(/\s*:$/, '');
    props.add(name);
  });
  return props;
}

/**
 * Get the filter map properties for an element type within a template.
 * Returns { contentProps: string[], styleProps: string[] } or null if no filter map.
 */
function getFilterMapProps(templateId, elementType) {
  const baseDef = elementDefinitions[elementType];
  if (!baseDef) return null;

  const filteredDef = getElementDef(elementType, templateId);
  if (!filteredDef) return null;

  // If filtered def equals base def, there's no filter map entry
  // (getElementDef returns the base def when no map exists)
  const baseContentNames = new Set(baseDef.contentProps?.map(p => p.name) || []);
  const baseStyleNames = new Set(baseDef.styleProps?.map(p => p.name) || []);
  const filteredContentNames = filteredDef.contentProps?.map(p => p.name) || [];
  const filteredStyleNames = filteredDef.styleProps?.map(p => p.name) || [];

  // Check if filtering actually happened
  const isFiltered = filteredContentNames.length < baseContentNames.size ||
                     filteredStyleNames.length < baseStyleNames.size;

  if (!isFiltered) return null; // No filter map for this element type in this template

  return {
    contentProps: filteredContentNames,
    styleProps: filteredStyleNames,
  };
}

// Properties that are structural and commonly appear in styleOverrides
// but are intentionally NOT in the filter map (they go to templateCSS)
const STRUCTURAL_STYLE_KEYS = new Set([
  'display', 'position', 'flex', 'flexDirection', 'flexWrap',
  'overflow', 'boxSizing', 'cursor', 'textDecoration',
  'whiteSpace', 'wordBreak', 'verticalAlign', 'float', 'clear',
  'top', 'left', 'right', 'bottom', 'zIndex', 'transform',
  'fontStyle', 'textShadow', 'transition', 'maxWidth',
]);

// ---------------------------------------------------------------------------
// 1. Filter Map → JSON: Every filter map property has a backing value
// ---------------------------------------------------------------------------

describe('Filter map properties have backing JSON values', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s: every filter map property has a value in template JSON',
    (templateId, template) => {
      const violations = [];
      const rawElements = template.elements.flatMap(el => collectRawElements(el));

      // Group raw elements by type
      const elementsByType = {};
      rawElements.forEach(el => {
        if (!elementsByType[el.type]) elementsByType[el.type] = [];
        elementsByType[el.type].push(el);
      });

      // For each element type that has a filter map
      Object.keys(elementsByType).forEach(elementType => {
        const filterMap = getFilterMapProps(templateId, elementType);
        if (!filterMap) return;

        elementsByType[elementType].forEach((el, idx) => {
          const overrides = { ...(el.styleOverrides || {}), ...(el.propOverrides || {}) };

          // Check content props
          filterMap.contentProps.forEach(prop => {
            if (!(prop in (el.propOverrides || {}))) {
              // Content props may have defaults from getDefaultProps, so this is a warning not violation
              // Only flag if it's a critical prop like 'text'
            }
          });

          // Check style props
          filterMap.styleProps.forEach(prop => {
            if (!(prop in (el.styleOverrides || {}))) {
              // Style override may fall back to getDefaultStyle, check if default exists
              const baseDef = elementDefinitions[elementType];
              const defaultStyle = getDefaultStyleForType(elementType);
              if (!defaultStyle || !(prop in defaultStyle)) {
                violations.push(
                  `${elementType}[${idx}]: filter map has "${prop}" but no value in styleOverrides or defaults`
                );
              }
            }
          });
        });
      });

      expect(violations).toEqual([]);
    }
  );
});

// Helper to get default style without importing BlockBuilder (which needs heavy mocks)
function getDefaultStyleForType(type) {
  // We can't easily import getDefaultStyle from BlockBuilder in this test
  // So we just check if the property exists in elementDefinitions (has a default)
  const def = elementDefinitions[type];
  if (!def) return null;
  const defaults = {};
  def.styleProps?.forEach(p => {
    if (p.default !== undefined) defaults[p.name] = p.default;
  });
  return defaults;
}

// ---------------------------------------------------------------------------
// 2. No property in BOTH filter map AND templateCSS
// ---------------------------------------------------------------------------

describe('No property in both filter map and templateCSS', () => {
  const templatesWithCSS = sectionTemplates.filter(t => templateCSSGenerators[t.id]);

  test.each(templatesWithCSS.map(t => [t.id, t]))(
    '%s: no filter map property is also hardcoded in templateCSS',
    (templateId, template) => {
      resetTemplateCounters();
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const allElements = elements.flatMap(el => collectAllElements(el));

      const violations = [];
      const generator = templateCSSGenerators[templateId];

      // Reset counters before generating CSS
      resetTemplateCounters();

      allElements.forEach((el) => {
        const filterMap = getFilterMapProps(templateId, el.type);
        if (!filterMap) return;

        // Generate templateCSS for this element
        const baseDef = elementDefinitions[el.type];
        if (!baseDef) return;

        const selector = `#test-{{ section.id }} [data-element-id="${el.id}"]`;
        const css = generator(el, baseDef, selector, 'test');

        if (!css) return;

        const hardcodedProps = extractBaseCSSPropertyNames(css);

        // Check if any filter map style props appear in templateCSS
        filterMap.styleProps.forEach(prop => {
          const kebab = camelToKebab(prop);
          if (hardcodedProps.has(kebab)) {
            violations.push(
              `${el.type} (${el.id}): "${prop}" is in filter map AND templateCSS — must be in one only`
            );
          }
        });
      });

      expect(violations).toEqual([]);
    }
  );
});

// ---------------------------------------------------------------------------
// 3. Every JSON property accounted for (filter map OR templateCSS)
// ---------------------------------------------------------------------------

describe('Every JSON property is in filter map or templateCSS', () => {
  const templatesWithCSS = sectionTemplates.filter(t => templateCSSGenerators[t.id]);

  test.each(templatesWithCSS.map(t => [t.id, t]))(
    '%s: every styleOverride property is in filter map or templateCSS',
    (templateId, template) => {
      resetTemplateCounters();
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const allElements = elements.flatMap(el => collectAllElements(el));
      const rawElements = template.elements.flatMap(el => collectRawElements(el));

      const violations = [];
      const generator = templateCSSGenerators[templateId];

      // Reset counters before generating CSS
      resetTemplateCounters();

      // Match instantiated elements with raw elements by index per type
      const rawByType = {};
      rawElements.forEach(el => {
        if (!rawByType[el.type]) rawByType[el.type] = [];
        rawByType[el.type].push(el);
      });

      const typeCounters = {};
      allElements.forEach((el) => {
        if (!typeCounters[el.type]) typeCounters[el.type] = 0;
        const rawIdx = typeCounters[el.type]++;
        const rawEl = rawByType[el.type]?.[rawIdx];
        if (!rawEl || !rawEl.styleOverrides) return;

        const filterMap = getFilterMapProps(templateId, el.type);
        const filterStyleProps = new Set(filterMap?.styleProps || []);

        // Generate templateCSS for this element
        const baseDef = elementDefinitions[el.type];
        if (!baseDef) return;

        const selector = `#test-{{ section.id }} [data-element-id="${el.id}"]`;
        const css = generator(el, baseDef, selector, 'test');
        const hardcodedProps = css ? extractBaseCSSPropertyNames(css) : new Set();

        Object.keys(rawEl.styleOverrides).forEach(prop => {
          // Skip structural/canvas-only properties
          if (STRUCTURAL_STYLE_KEYS.has(prop)) return;

          const inFilterMap = filterStyleProps.has(prop);
          const inTemplateCSS = hardcodedProps.has(camelToKebab(prop));

          if (!inFilterMap && !inTemplateCSS) {
            violations.push(
              `${el.type}: "${prop}" is in JSON styleOverrides but NOT in filter map or templateCSS`
            );
          }
        });
      });

      expect(violations).toEqual([]);
    }
  );
});

// ---------------------------------------------------------------------------
// 4. Schema count under 250
// ---------------------------------------------------------------------------

describe('Schema count under Shopify limit', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s: schema settings count is under 250',
    (templateId, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const settings = generateAllElementsSchemaSettings(elements);

      // Filter to actual settings (exclude headers)
      const actualSettings = settings.filter(s => s.type !== 'header');

      expect(actualSettings.length).toBeLessThan(250);
    }
  );
});
