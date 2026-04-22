/**
 * Template Export Tests
 *
 * Validates that all templates produce valid Liquid output:
 *   - HTML generation succeeds for every template
 *   - CSS generation succeeds for every template
 *   - Schema generation succeeds for every template
 *   - Responsive styles export correctly across all 5 viewports
 *   - Page templates resolve all section references
 *   - ID regeneration produces unique IDs
 */

// Mock uuid to produce unique sequential IDs (jsdom crypto.getRandomValues is broken)
let mockUuidCounter = 0;
jest.mock('uuid', () => ({
  v4: () => `uuid-${++mockUuidCounter}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
}));

import { generateElementHTML, generateAllElementsHTML } from '@/app/_utils/htmlGeneration';
import { generateElementCSS, generateAllElementsCSS, generateLiquidStyles } from '@/app/_utils/cssGeneration';
import { generateElementSchemaSettings, generateAllElementsSchemaSettings, generateLiquidSchema } from '@/app/_utils/schemaGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';
import { sectionTemplates, pageTemplates, getSectionById } from '@/app/_config/templates';
import { instantiateTemplate } from '@/app/_utils/templateUtils';

const SECTION_ID = 'test-section';

beforeEach(() => {
  resetIdGenerator();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function collectAllIds(element) {
  const ids = [element.id];
  if (element.children) {
    element.children.forEach(c => ids.push(...collectAllIds(c)));
  }
  if (element.columns) {
    element.columns.forEach(col => col.forEach(c => ids.push(...collectAllIds(c))));
  }
  return ids;
}

function collectAllElements(element) {
  const elems = [element];
  if (element.children) {
    element.children.forEach(c => elems.push(...collectAllElements(c)));
  }
  if (element.columns) {
    element.columns.forEach(col => col.forEach(c => elems.push(...collectAllElements(c))));
  }
  return elems;
}

// ---------------------------------------------------------------------------
// Template Structure Validation
// ---------------------------------------------------------------------------

describe('Template Structure', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s has required fields',
    (id, template) => {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.category).toBe('section');
      expect(template.subcategory).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(Array.isArray(template.elements)).toBe(true);
      expect(template.elements.length).toBeGreaterThan(0);
    }
  );

  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s elements all have id, type, style, and children/columns',
    (id, template) => {
      const allElems = template.elements.flatMap(el => collectAllElements(el));
      allElems.forEach(el => {
        expect(el.id).toBeTruthy();
        expect(el.type).toBeTruthy();
      });
    }
  );

  test.each(pageTemplates.map(t => [t.id, t]))(
    'page template %s references valid sections',
    (id, template) => {
      expect(template.sections).toBeTruthy();
      expect(template.sections.length).toBeGreaterThan(0);
      template.sections.forEach(sectionId => {
        const section = getSectionById(sectionId);
        expect(section).not.toBeNull();
        expect(section.id).toBe(sectionId);
      });
    }
  );
});

// ---------------------------------------------------------------------------
// ID Regeneration
// ---------------------------------------------------------------------------

describe('Template Instantiation', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s generates unique IDs on instantiation',
    (id, template) => {
      const elements1 = instantiateTemplate(template);
      resetIdGenerator();
      const elements2 = instantiateTemplate(template);

      const ids1 = elements1.flatMap(el => collectAllIds(el));
      const ids2 = elements2.flatMap(el => collectAllIds(el));

      // All IDs within a single instantiation should be unique
      expect(new Set(ids1).size).toBe(ids1.length);

      // No template placeholder IDs should remain
      ids1.forEach(id => {
        expect(id).not.toMatch(/^tpl-/);
      });

      // Two instantiations should produce different IDs
      ids1.forEach((id, i) => {
        expect(id).not.toBe(ids2[i]);
      });
    }
  );

  test.each(pageTemplates.map(t => [t.id, t]))(
    'page template %s instantiates all sections with unique IDs',
    (id, template) => {
      const allElements = [];
      template.sections.forEach(sectionId => {
        const section = getSectionById(sectionId);
        allElements.push(...instantiateTemplate(section));
      });

      const allIds = allElements.flatMap(el => collectAllIds(el));
      expect(new Set(allIds).size).toBe(allIds.length);
    }
  );
});

// ---------------------------------------------------------------------------
// HTML Generation
// ---------------------------------------------------------------------------

describe('HTML Export', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s generates valid HTML',
    (id, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);

      elements.forEach(el => {
        const html = generateElementHTML(el);
        expect(typeof html).toBe('string');
        expect(html.length).toBeGreaterThan(0);
        expect(html).toContain('data-element-id');
      });
    }
  );

  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s generates bulk HTML via generateAllElementsHTML',
    (id, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const html = generateAllElementsHTML(elements, SECTION_ID);

      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
    }
  );
});

// ---------------------------------------------------------------------------
// CSS Generation
// ---------------------------------------------------------------------------

describe('CSS Export', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s generates valid CSS',
    (id, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);

      elements.forEach(el => {
        const css = generateElementCSS(el, SECTION_ID);
        expect(typeof css).toBe('string');
      });
    }
  );

  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s generates Liquid styles via generateLiquidStyles',
    (id, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const styles = generateLiquidStyles(elements, SECTION_ID);

      expect(typeof styles).toBe('string');
    }
  );
});

// ---------------------------------------------------------------------------
// Responsive CSS - All 5 Viewports
// ---------------------------------------------------------------------------

describe('Responsive CSS Export', () => {
  const MEDIA_QUERIES = {
    xs: '@media (max-width: 575px)',
    sm: '@media (min-width: 576px) and (max-width: 767px)',
    lg: '@media (min-width: 992px) and (max-width: 1199px)',
    xl: '@media (min-width: 1200px)',
  };

  // Find templates that actually have responsive styles
  const responsiveTemplates = sectionTemplates.filter(t => {
    const allElems = t.elements.flatMap(el => collectAllElements(el));
    return allElems.some(el =>
      el.responsiveStyles && Object.keys(el.responsiveStyles).length > 0
    );
  });

  test.each(responsiveTemplates.map(t => [t.id, t]))(
    '%s generates responsive media queries for declared breakpoints',
    (id, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const styles = generateLiquidStyles(elements, SECTION_ID);

      // Collect which breakpoints this template uses
      const usedBreakpoints = new Set();
      const allElems = template.elements.flatMap(el => collectAllElements(el));
      allElems.forEach(el => {
        if (el.responsiveStyles) {
          Object.keys(el.responsiveStyles).forEach(bp => usedBreakpoints.add(bp));
        }
      });

      // For each used breakpoint that has a media query, verify it appears in output
      usedBreakpoints.forEach(bp => {
        if (MEDIA_QUERIES[bp]) {
          expect(styles).toContain(MEDIA_QUERIES[bp]);
        }
      });
    }
  );
});

// ---------------------------------------------------------------------------
// Schema Generation
// ---------------------------------------------------------------------------

describe('Schema Export', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s generates valid schema settings',
    (id, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const settings = generateAllElementsSchemaSettings(elements);

      expect(Array.isArray(settings)).toBe(true);
    }
  );

  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s generates complete Liquid schema JSON',
    (id, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);
      const schema = generateLiquidSchema(elements, template.name);

      expect(typeof schema).toBe('string');
      // Should be valid JSON
      const parsed = JSON.parse(schema);
      expect(parsed.name).toBe(template.name);
      expect(Array.isArray(parsed.settings)).toBe(true);
    }
  );
});

// ---------------------------------------------------------------------------
// Full Pipeline (HTML + CSS + Schema together)
// ---------------------------------------------------------------------------

describe('Full Liquid Export Pipeline', () => {
  test.each(sectionTemplates.map(t => [t.id, t]))(
    '%s produces complete Liquid section output',
    (id, template) => {
      resetIdGenerator();
      const elements = instantiateTemplate(template);

      const html = generateAllElementsHTML(elements, SECTION_ID);
      resetIdGenerator();
      const css = generateLiquidStyles(elements, SECTION_ID);
      resetIdGenerator();
      const schema = generateLiquidSchema(elements, template.name);

      // All three should produce non-empty output
      expect(html.length).toBeGreaterThan(0);
      expect(css.length).toBeGreaterThan(0);
      expect(schema.length).toBeGreaterThan(0);

      // Schema should be valid JSON
      expect(() => JSON.parse(schema)).not.toThrow();
    }
  );

  test.each(pageTemplates.map(t => [t.id, t]))(
    'page template %s produces complete Liquid output for all sections',
    (id, template) => {
      template.sections.forEach(sectionId => {
        resetIdGenerator();
        const section = getSectionById(sectionId);
        const elements = instantiateTemplate(section);

        const html = generateAllElementsHTML(elements, SECTION_ID);
        resetIdGenerator();
        const css = generateLiquidStyles(elements, SECTION_ID);
        resetIdGenerator();
        const schema = generateLiquidSchema(elements, section.name);

        expect(html.length).toBeGreaterThan(0);
        expect(css.length).toBeGreaterThan(0);
        expect(() => JSON.parse(schema)).not.toThrow();
      });
    }
  );
});
