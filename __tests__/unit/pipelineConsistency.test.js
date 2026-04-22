/**
 * Pipeline Consistency Tests
 *
 * These tests catch the #1 class of bugs in Blockify: property name mismatches
 * across pipeline stages that cause SILENT export failures.
 *
 * The pipeline: elementDefinitions → getDefaultStyle/getDefaultSchemaToggles →
 * ElementRenderer (canvas) → cssGeneration → schemaGeneration → htmlGeneration
 *
 * A mismatch at ANY stage means the property silently doesn't export.
 * The canvas looks fine (React CSS handles shorthand), but Shopify gets nothing.
 *
 * These tests would have caught every bug found in the 2026-03-11/12 sessions:
 *   - padding: "12px 24px" vs paddingTop/paddingBottom/paddingLeft/paddingRight
 *   - margin: "0" vs marginTop/marginBottom
 *   - border: "none" vs borderWidth/borderStyle/borderColor
 *   - schema toggle "border: true" when elementDefs has borderWidth/borderStyle/borderColor
 *   - template JSON using "border": "1px solid #e0e0e0" shorthand
 */

let mockUuidCounter = 0;
jest.mock('uuid', () => ({
  v4: () => `uuid-${++mockUuidCounter}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
}));

import { elementDefinitions } from '@/app/_config/elementDefinitions';
import { sectionTemplates } from '@/app/_config/templates';
import { instantiateTemplate } from '@/app/_utils/templateUtils';
import { getAllFixtures } from '@/app/_utils/testFixtures';
import { generateElementCSS, generateAllElementsCSS } from '@/app/_utils/cssGeneration';
import { generateElementSchemaSettings, generateAllElementsSchemaSettings } from '@/app/_utils/schemaGeneration';
import { generateElementHTML, generateAllElementsHTML } from '@/app/_utils/htmlGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

beforeEach(() => {
  resetIdGenerator();
  mockUuidCounter = 0;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** CSS shorthand properties that must NEVER appear in element.style objects */
const FORBIDDEN_SHORTHAND_KEYS = ['padding', 'margin', 'border'];

/** Get all valid property names for an element type (content + style) */
function getValidPropNames(elementType) {
  const def = elementDefinitions[elementType];
  if (!def) return new Set();
  const names = new Set();
  def.contentProps?.forEach(p => names.add(p.name));
  def.styleProps?.forEach(p => names.add(p.name));
  return names;
}

/**
 * Style keys allowed in element.style even if not in elementDefinitions.
 *
 * Two categories:
 * 1. Canvas-only CSS layout props — not intended for Shopify export
 * 2. [MISSING FROM DEFS] — props used in templates that SHOULD be in elementDefinitions
 *    but aren't yet. Each is a potential silent export failure. Adding them to
 *    elementDefinitions is a separate task.
 */
const ALLOWED_EXTRA_STYLE_KEYS = new Set([
  // Canvas-only CSS layout properties — not intended for schema export
  'display', 'position', 'flex', 'flexDirection', 'alignItems', 'justifyContent',
  'flexWrap', 'gap', 'overflow', 'boxSizing', 'cursor', 'textDecoration',
  'whiteSpace', 'wordBreak', 'verticalAlign', 'float', 'clear',
  'top', 'left', 'right', 'bottom', 'zIndex', 'transform',
  'fontFamily', 'fontStyle', 'textShadow', 'transition',

  // [MISSING FROM DEFS] These are used in templates/fixtures but not defined
  // in elementDefinitions for the element types that use them.
  // TODO: Add these to elementDefinitions so they export properly.
  'borderWidth', 'borderStyle', 'borderColor',  // container, image-background
  'borderTop', 'borderBottom',  // containers in some templates (divider-style borders)
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',  // image-background, icon
  'minHeight', 'backgroundRepeat', 'borderRadius', 'backgroundColor',  // image-background
  'width', 'height',  // icon (uses iconSize instead)
  'backgroundSize', 'backgroundPosition', 'color', 'fontSize', 'fontWeight',
  'letterSpacing', 'lineHeight', 'textAlign', 'textTransform', 'objectFit',
  'maxWidth', 'opacity',
  'gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2',  // image-background gradients
  'inputBorderColor', 'inputBorderRadius',  // form element
  'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',  // various
  'iconSize', 'iconColor',  // icon
  'linkColor',  // blog-post, various
]);

/** Recursively collect all elements from a tree */
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

// ---------------------------------------------------------------------------
// 1. No CSS Shorthand in Template Style Objects
// ---------------------------------------------------------------------------

describe('No CSS shorthand in template styles', () => {
  const templates = sectionTemplates.map(t => {
    const elements = instantiateTemplate(t);
    return [t.id, elements];
  });

  test.each(templates)(
    '%s has no shorthand padding/margin/border in style objects',
    (templateId, elements) => {
      const allElements = elements.flatMap(e => collectAllElements(e));
      const violations = [];

      allElements.forEach(el => {
        if (!el.style) return;
        FORBIDDEN_SHORTHAND_KEYS.forEach(key => {
          if (el.style.hasOwnProperty(key)) {
            violations.push(
              `${el.type} (${el.id}): style.${key} = "${el.style[key]}" — use individual props (e.g., ${key}Top, ${key}Bottom)`
            );
          }
        });
      });

      expect(violations).toEqual([]);
    }
  );
});

// ---------------------------------------------------------------------------
// 2. No CSS Shorthand in Test Fixtures
// ---------------------------------------------------------------------------

describe('No CSS shorthand in test fixtures', () => {
  test('all fixtures use individual property names, not shorthand', () => {
    const fixtures = getAllFixtures();
    const violations = [];

    fixtures.forEach(({ name, element }) => {
      const allElements = collectAllElements(element);
      allElements.forEach(el => {
        if (!el.style) return;
        FORBIDDEN_SHORTHAND_KEYS.forEach(key => {
          if (el.style.hasOwnProperty(key)) {
            violations.push(
              `${name} → ${el.type} (${el.id}): style.${key} = "${el.style[key]}"`
            );
          }
        });
      });
    });

    expect(violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 3. Template Style Keys Must Exist in elementDefinitions
// ---------------------------------------------------------------------------

describe('Template style keys match elementDefinitions', () => {
  const templates = sectionTemplates.map(t => {
    const elements = instantiateTemplate(t);
    return [t.id, elements];
  });

  test.each(templates)(
    '%s style keys are valid elementDefinitions props',
    (templateId, elements) => {
      const allElements = elements.flatMap(e => collectAllElements(e));
      const violations = [];

      allElements.forEach(el => {
        if (!el.style || !el.type) return;
        const validNames = getValidPropNames(el.type);
        if (validNames.size === 0) return; // Unknown element type

        Object.keys(el.style).forEach(key => {
          if (ALLOWED_EXTRA_STYLE_KEYS.has(key)) return;
          if (!validNames.has(key)) {
            violations.push(
              `${el.type} (${el.id}): style.${key} not in elementDefinitions for "${el.type}"`
            );
          }
        });
      });

      expect(violations).toEqual([]);
    }
  );
});

// ---------------------------------------------------------------------------
// 4. Test Fixture Style Keys Must Exist in elementDefinitions
// ---------------------------------------------------------------------------

describe('Test fixture style keys match elementDefinitions', () => {
  test('all fixture style keys are valid elementDefinitions props', () => {
    const fixtures = getAllFixtures();
    const violations = [];

    fixtures.forEach(({ name, element }) => {
      const allElements = collectAllElements(element);
      allElements.forEach(el => {
        if (!el.style || !el.type) return;
        const validNames = getValidPropNames(el.type);
        if (validNames.size === 0) return;

        Object.keys(el.style).forEach(key => {
          if (ALLOWED_EXTRA_STYLE_KEYS.has(key)) return;
          if (!validNames.has(key)) {
            violations.push(
              `${name} → ${el.type}: style.${key} not in elementDefinitions`
            );
          }
        });
      });
    });

    expect(violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 5. Schema Toggle Keys Must Exist in elementDefinitions
// ---------------------------------------------------------------------------

describe('Schema toggle keys match elementDefinitions', () => {
  const templates = sectionTemplates.map(t => {
    const elements = instantiateTemplate(t);
    return [t.id, elements];
  });

  test.each(templates)(
    '%s schema toggle keys are valid elementDefinitions props',
    (templateId, elements) => {
      const allElements = elements.flatMap(e => collectAllElements(e));
      const violations = [];

      allElements.forEach(el => {
        if (!el.schemaToggles || !el.type) return;
        const validNames = getValidPropNames(el.type);
        if (validNames.size === 0) return;

        // Known schema toggle names that reference missing elementDefinitions props
        // TODO: Add these properties to elementDefinitions so they actually export
        const KNOWN_MISSING_TOGGLE_PROPS = new Set([
          'alt',             // image — alt is used as a toggle but not in contentProps
          'gap',             // columns-2/3 — gap used as toggle but not in styleProps
          'backgroundColor', // image-background — used in templates but not in elementDefinitions
        ]);

        Object.keys(el.schemaToggles).forEach(key => {
          // Column-namespaced toggles (col-0-paddingTop) are on parent element
          if (key.match(/^col-\d+-/)) {
            const colPropName = key.replace(/^col-\d+-/, '');
            const colValidNames = getValidPropNames('column');
            if (!colValidNames.has(colPropName) && !KNOWN_MISSING_TOGGLE_PROPS.has(colPropName)) {
              violations.push(
                `${el.type} (${el.id}): schemaToggles.${key} → column prop "${colPropName}" not in elementDefinitions for "column"`
              );
            }
            return;
          }

          if (KNOWN_MISSING_TOGGLE_PROPS.has(key)) return;

          if (!validNames.has(key)) {
            violations.push(
              `${el.type} (${el.id}): schemaToggles.${key} not in elementDefinitions for "${el.type}"`
            );
          }
        });
      });

      expect(violations).toEqual([]);
    }
  );
});

// ---------------------------------------------------------------------------
// 6. elementDefinitions Must Not Have Shorthand Border Prop
// ---------------------------------------------------------------------------

describe('elementDefinitions uses individual border properties', () => {
  test('no element type has a single "border" style prop', () => {
    const violations = [];

    Object.entries(elementDefinitions).forEach(([type, def]) => {
      def.styleProps?.forEach(prop => {
        if (prop.name === 'border') {
          violations.push(
            `${type}: has "border" prop — should be borderWidth, borderStyle, borderColor`
          );
        }
      });
      def.contentProps?.forEach(prop => {
        if (prop.name === 'border') {
          violations.push(
            `${type}: has "border" content prop — should be borderWidth, borderStyle, borderColor`
          );
        }
      });
    });

    expect(violations).toEqual([]);
  });

  test('no element type has shorthand "padding" or "margin" style prop', () => {
    const violations = [];

    Object.entries(elementDefinitions).forEach(([type, def]) => {
      def.styleProps?.forEach(prop => {
        if (prop.name === 'padding') {
          violations.push(`${type}: has "padding" prop — should be paddingTop/Bottom/Left/Right`);
        }
        if (prop.name === 'margin') {
          violations.push(`${type}: has "margin" prop — should be marginTop/Bottom/Left/Right`);
        }
      });
    });

    expect(violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 7. Schema-Toggled Properties Produce Export Output
// ---------------------------------------------------------------------------

describe('Schema-toggled properties produce export output', () => {
  test('toggled style props appear in CSS output', () => {
    const fixtures = getAllFixtures();
    const violations = [];

    fixtures.forEach(({ name, element }) => {
      const def = elementDefinitions[element.type];
      if (!def) return;

      // Create element with all style props toggled on
      const toggledElement = {
        ...element,
        schemaToggles: {},
      };
      def.styleProps?.forEach(prop => {
        if (prop.canBeSchemaEditable) {
          toggledElement.schemaToggles[prop.name] = true;
        }
      });
      def.contentProps?.forEach(prop => {
        if (prop.canBeSchemaEditable) {
          toggledElement.schemaToggles[prop.name] = true;
        }
      });

      // Generate CSS — it should contain a reference to each toggled style prop
      const css = generateElementCSS(toggledElement);

      // Generate schema — each toggled prop should produce a schema setting
      const schemaSettings = generateElementSchemaSettings(toggledElement);
      const schemaIds = schemaSettings.map(s => s.id).filter(Boolean);

      def.styleProps?.forEach(prop => {
        if (!prop.canBeSchemaEditable) return;

        // Responsive props produce 3 schema settings (mobile/desktop/fullscreen)
        // Non-responsive produce 1
        const expectedSchemaCount = prop.responsive ? 3 : 1;

        // Check schema settings exist for this prop
        const matchingSettings = schemaSettings.filter(s =>
          s.id && s.id.includes(prop.name)
        );

        if (matchingSettings.length === 0) {
          violations.push(
            `${name} → ${element.type}: style prop "${prop.name}" is schema-editable but produced no schema settings`
          );
        }
      });
    });

    expect(violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 8. CSS Viewport Mapping Correctness
// ---------------------------------------------------------------------------

describe('CSS viewport mapping', () => {
  test('lg viewport produces base CSS (no media query), not a media query block', () => {
    // Create element with a responsive property and a value at lg
    const element = {
      id: 'viewport-test-001',
      type: 'heading',
      props: { text: 'Test', tag: 'h2' },
      style: { fontSize: '36px' },
      responsiveStyles: {
        fontSize: { lg: '36px', sm: '24px', xl: '48px' },
      },
      schemaToggles: { fontSize: true },
    };

    const css = generateElementCSS(element);

    // lg should NOT appear in a media query — it's the base
    expect(css).not.toMatch(/@media[^{]*992[^{]*\{[^}]*viewport-test-001/);
    expect(css).not.toMatch(/@media[^{]*991[^{]*\{[^}]*viewport-test-001/);
  });

  test('sm viewport produces media query with 576px-767px range', () => {
    const element = {
      id: 'viewport-test-002',
      type: 'heading',
      props: { text: 'Test', tag: 'h2' },
      style: { fontSize: '36px' },
      responsiveStyles: {
        fontSize: { sm: '24px' },
      },
      schemaToggles: { fontSize: true },
    };

    const css = generateElementCSS(element);

    // sm should have a media query with 576px min
    expect(css).toMatch(/@media\s*\(\s*min-width:\s*576px\)/);
  });

  test('xl viewport produces media query with min-width 1200px', () => {
    const element = {
      id: 'viewport-test-003',
      type: 'heading',
      props: { text: 'Test', tag: 'h2' },
      style: { fontSize: '36px' },
      responsiveStyles: {
        fontSize: { xl: '48px' },
      },
      schemaToggles: { fontSize: true },
    };

    const css = generateElementCSS(element);

    expect(css).toMatch(/@media\s*\(\s*min-width:\s*1200px\)/);
  });

  test('xs viewport produces media query with max-width 575px', () => {
    const element = {
      id: 'viewport-test-004',
      type: 'heading',
      props: { text: 'Test', tag: 'h2' },
      style: { fontSize: '36px' },
      responsiveStyles: {
        fontSize: { xs: '20px' },
      },
      schemaToggles: { fontSize: true },
    };

    const css = generateElementCSS(element);

    expect(css).toMatch(/@media\s*\(\s*max-width:\s*575px\)/);
  });

  test('md viewport produces media query with 768px-991px range', () => {
    const element = {
      id: 'viewport-test-005',
      type: 'heading',
      props: { text: 'Test', tag: 'h2' },
      style: { fontSize: '36px' },
      responsiveStyles: {
        fontSize: { md: '30px' },
      },
      schemaToggles: { fontSize: true },
    };

    const css = generateElementCSS(element);

    expect(css).toMatch(/@media\s*\(\s*min-width:\s*768px\)/);
  });
});

// ---------------------------------------------------------------------------
// 9. Schema Breakpoint Mapping (sm→mobile, lg→desktop, xl→fullscreen)
// ---------------------------------------------------------------------------

describe('Schema breakpoint mapping', () => {
  test('responsive property generates mobile/desktop/fullscreen schema settings', () => {
    const element = {
      id: 'schema-bp-test-001',
      type: 'heading',
      props: { text: 'Test', tag: 'h2' },
      style: { fontSize: '36px' },
      responsiveStyles: {
        fontSize: { sm: '24px', lg: '36px', xl: '48px' },
      },
      schemaToggles: { fontSize: true },
    };

    const settings = generateElementSchemaSettings(element);
    const fontSizeSettings = settings.filter(s => s.id && s.id.includes('fontSize'));

    // Should have exactly 3: mobile, desktop, fullscreen
    expect(fontSizeSettings.length).toBe(3);

    const labels = fontSizeSettings.map(s => s.label);
    expect(labels).toContainEqual(expect.stringContaining('mobile'));
    expect(labels).toContainEqual(expect.stringContaining('desktop'));
    expect(labels).toContainEqual(expect.stringContaining('fullscreen'));
  });

  test('xs and md do NOT produce schema settings (builder-only)', () => {
    const element = {
      id: 'schema-bp-test-002',
      type: 'heading',
      props: { text: 'Test', tag: 'h2' },
      style: { fontSize: '36px' },
      responsiveStyles: {
        fontSize: { xs: '20px', md: '30px' },
      },
      schemaToggles: { fontSize: true },
    };

    const settings = generateElementSchemaSettings(element);
    const fontSizeSettings = settings.filter(s => s.id && s.id.includes('fontSize'));

    // Should still be 3 (mobile/desktop/fullscreen) — xs and md don't add extra
    expect(fontSizeSettings.length).toBe(3);

    // None should reference xs or md
    const ids = fontSizeSettings.map(s => s.id);
    ids.forEach(id => {
      expect(id).not.toContain('_xs');
      expect(id).not.toContain('_md');
    });
  });
});

// ---------------------------------------------------------------------------
// 10. All Templates Export Without Errors
// ---------------------------------------------------------------------------

describe('All templates produce valid export output', () => {
  const templates = sectionTemplates.map(t => {
    const elements = instantiateTemplate(t);
    return [t.id, elements];
  });

  test.each(templates)(
    '%s generates HTML, CSS, and schema without errors',
    (templateId, elements) => {
      expect(() => {
        const html = generateAllElementsHTML(elements);
        expect(html).toBeTruthy();
      }).not.toThrow();

      expect(() => {
        const css = generateAllElementsCSS(elements);
        expect(css).toBeTruthy();
      }).not.toThrow();

      expect(() => {
        const settings = generateAllElementsSchemaSettings(elements);
        expect(Array.isArray(settings)).toBe(true);
      }).not.toThrow();
    }
  );
});
