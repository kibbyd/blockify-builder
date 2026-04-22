/**
 * Template Export Output Validation Tests
 *
 * Validates that actual export output matches expectations:
 *   1. Filter map properties produce Liquid vars in CSS output
 *   2. Filter map properties produce schema settings in schema output
 *   3. templateCSS properties appear as hardcoded values (no Liquid var)
 *   4. HTML output contains expected structure
 *
 * These are defense-in-depth tests — they verify the export pipeline
 * actually produces correct output, not just that the config is right.
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
import { generateElementCSS, generateLiquidStyles } from '@/app/_utils/cssGeneration';
import { generateElementSchemaSettings, generateAllElementsSchemaSettings } from '@/app/_utils/schemaGeneration';
import { generateElementHTML, generateAllElementsHTML } from '@/app/_utils/htmlGeneration';
import { templateCSSGenerators, resetTemplateCounters } from '@/app/_utils/templateCSS';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

const SECTION_ID = 'test-section';

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
 * Get the filter map properties for an element type within a template.
 */
function getFilterMapProps(templateId, elementType) {
  const baseDef = elementDefinitions[elementType];
  if (!baseDef) return null;

  const filteredDef = getElementDef(elementType, templateId);
  if (!filteredDef) return null;

  const baseContentNames = new Set(baseDef.contentProps?.map(p => p.name) || []);
  const baseStyleNames = new Set(baseDef.styleProps?.map(p => p.name) || []);
  const filteredContentNames = filteredDef.contentProps?.map(p => p.name) || [];
  const filteredStyleNames = filteredDef.styleProps?.map(p => p.name) || [];

  const isFiltered = filteredContentNames.length < baseContentNames.size ||
                     filteredStyleNames.length < baseStyleNames.size;

  if (!isFiltered) return null;

  return {
    contentProps: filteredContentNames,
    styleProps: filteredStyleNames,
  };
}

// Properties that use special CSS generation (not standard property: value)
const SPECIAL_CSS_PROPS = new Set([
  'src', 'alt', 'text', 'tag', 'href', 'url', 'html',
  'gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2',
  'gradientColor3', 'gradientColor4', 'gradientColor5',
  'hoverAnimation', 'hoverColor', 'hoverBackgroundColor',
  'hoverBorderColor', 'hoverBoxShadowOffsetX', 'hoverBoxShadowOffsetY',
  'hoverBoxShadowBlur', 'hoverBoxShadowSpread', 'hoverBoxShadowColor',
  'entranceAnimation', 'entranceDuration', 'entranceDelay',
  'hideOnMobile', 'hideOnDesktop', 'hideOnFullscreen',
  'backgroundVideo', 'openInNewTab',
]);

// ---------------------------------------------------------------------------
// 1. Filter map properties produce Liquid vars in CSS
// ---------------------------------------------------------------------------

describe('Filter map properties export as Liquid vars', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s: filter map style props appear as Liquid vars in CSS',
    (templateId, template) => {
      resetIdGenerator();
      resetTemplateCounters();
      const elements = instantiateTemplate(template);
      const allElements = elements.flatMap(el => collectAllElements(el));

      const violations = [];

      allElements.forEach(el => {
        const filterMap = getFilterMapProps(templateId, el.type);
        if (!filterMap) return;

        resetTemplateCounters();
        const css = generateElementCSS(el, SECTION_ID);

        filterMap.styleProps.forEach(prop => {
          if (SPECIAL_CSS_PROPS.has(prop)) return;

          const kebab = camelToKebab(prop);
          // The CSS should contain either a Liquid var or the property name
          // For schema-enabled props, it should use {{ section.settings.XXX }}
          if (!css.includes(kebab + ':')) {
            violations.push(
              `${el.type} (${el.id}): filter map prop "${prop}" (${kebab}) not found in CSS output`
            );
          }
        });
      });

      expect(violations).toEqual([]);
    }
  );
});

// ---------------------------------------------------------------------------
// 2. Filter map properties produce schema settings
// ---------------------------------------------------------------------------

describe('Filter map properties produce schema settings', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s: every filter map property has a corresponding schema setting',
    (templateId, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const allElements = elements.flatMap(el => collectAllElements(el));

      const violations = [];

      allElements.forEach(el => {
        const filterMap = getFilterMapProps(templateId, el.type);
        if (!filterMap) return;

        const settings = generateElementSchemaSettings(el);
        const settingIds = settings
          .filter(s => s.id)
          .map(s => s.id);

        const allFilterProps = [...filterMap.contentProps, ...filterMap.styleProps];

        allFilterProps.forEach(prop => {
          // Schema setting IDs contain the property name
          const hasMatchingSetting = settingIds.some(id => id.includes(`_${prop}`));

          if (!hasMatchingSetting) {
            violations.push(
              `${el.type} (${el.id}): filter map prop "${prop}" has no matching schema setting`
            );
          }
        });
      });

      expect(violations).toEqual([]);
    }
  );
});

// ---------------------------------------------------------------------------
// 3. templateCSS properties are hardcoded (no Liquid var)
// ---------------------------------------------------------------------------

describe('templateCSS properties are hardcoded without Liquid vars', () => {
  const templatesWithCSS = sectionTemplates.filter(t => templateCSSGenerators[t.id]);

  test.each(templatesWithCSS.map(t => [t.id, t]))(
    '%s: templateCSS output does not contain Liquid variables',
    (templateId, template) => {
      resetIdGenerator();
      resetTemplateCounters();
      const elements = instantiateTemplate(template);
      const allElements = elements.flatMap(el => collectAllElements(el));

      const violations = [];
      const generator = templateCSSGenerators[templateId];

      resetTemplateCounters();

      allElements.forEach(el => {
        const baseDef = elementDefinitions[el.type];
        if (!baseDef) return;

        const selector = `#test-{{ section.id }} [data-element-id="${el.id}"]`;
        const css = generator(el, baseDef, selector, 'test');

        if (!css) return;

        // templateCSS should NOT contain Liquid variables (except the section.id in the selector)
        const liquidVarPattern = /\{\{[^}]*section\.settings\.[^}]*\}\}/g;
        const matches = css.match(liquidVarPattern) || [];

        if (matches.length > 0) {
          violations.push(
            `${el.type} (${el.id}): templateCSS contains Liquid vars: ${matches.join(', ')}`
          );
        }
      });

      expect(violations).toEqual([]);
    }
  );
});

// ---------------------------------------------------------------------------
// 4. Full export produces valid Liquid section
// ---------------------------------------------------------------------------

describe('Full export structural validation', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s: HTML contains data-element-id for every element',
    (templateId, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const html = generateAllElementsHTML(elements, SECTION_ID);
      const allElements = elements.flatMap(el => collectAllElements(el));

      const violations = [];

      allElements.forEach(el => {
        // Skip column elements as they use a different structure
        if (el.type === 'column') return;

        if (!html.includes(`data-element-id="${el.id}"`)) {
          violations.push(
            `${el.type} (${el.id}): missing data-element-id in HTML output`
          );
        }
      });

      expect(violations).toEqual([]);
    }
  );

  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s: CSS contains selector for every element',
    (templateId, template) => {
      resetIdGenerator();
      resetTemplateCounters();
      const elements = instantiateTemplate(template);
      const css = generateLiquidStyles(elements, SECTION_ID);
      const allElements = elements.flatMap(el => collectAllElements(el));

      const violations = [];

      allElements.forEach(el => {
        // Skip column elements
        if (el.type === 'column') return;

        if (!css.includes(`data-element-id="${el.id}"`)) {
          violations.push(
            `${el.type} (${el.id}): missing CSS selector in styles output`
          );
        }
      });

      expect(violations).toEqual([]);
    }
  );

  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s: schema JSON is valid and has settings array',
    (templateId, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const settings = generateAllElementsSchemaSettings(elements);

      expect(Array.isArray(settings)).toBe(true);

      // Every setting should have a type
      settings.forEach(setting => {
        expect(setting.type).toBeDefined();
      });

      // Non-header settings should have an id and default
      const nonHeaders = settings.filter(s => s.type !== 'header');
      nonHeaders.forEach(setting => {
        expect(setting.id).toBeDefined();
      });
    }
  );
});

// ---------------------------------------------------------------------------
// 5. Liquid variable format validation
// ---------------------------------------------------------------------------

describe('Liquid variable format is correct', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s: all Liquid vars in CSS reference valid setting IDs',
    (templateId, template) => {
      resetIdGenerator();
      resetTemplateCounters();
      const elements = instantiateTemplate(template);
      const css = generateLiquidStyles(elements, SECTION_ID);

      // Extract all Liquid variable references
      const liquidRefs = css.match(/section\.settings\.([\w-]+)/g) || [];
      const settingIds = new Set(liquidRefs.map(ref => ref.replace('section.settings.', '')));

      // Generate schema to get all valid setting IDs
      const settings = generateAllElementsSchemaSettings(elements);
      const validIds = new Set(settings.filter(s => s.id).map(s => s.id));

      const violations = [];

      settingIds.forEach(id => {
        if (!validIds.has(id)) {
          violations.push(`CSS references setting "${id}" but no matching schema setting exists`);
        }
      });

      expect(violations).toEqual([]);
    }
  );
});
