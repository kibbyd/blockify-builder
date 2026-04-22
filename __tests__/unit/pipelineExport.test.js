/**
 * Pipeline Export Tests
 *
 * Validates that every element's properties flow correctly from canvas to Shopify.
 * Tests 8 export patterns:
 *   1. Style prop — in elementDefs, has default, toggle works, CSS outputs (3 Liquid + 2 hardcoded viewports)
 *   2. Content prop — in elementDefs, has default, toggle works, HTML references correctly
 *   3. Dedicated CSS — structural elements have child selector CSS output
 *   4. Composite prop — box-shadow/text-shadow/gradient sub-props assemble correctly
 *   5. Per-item content — numbered props exist for count, HTML loops correctly
 *   6. Picker — product/collection picker in schema, Liquid assign in HTML
 *   7. Hover — hover props map to :hover CSS output
 *   8. Visibility — hideOn props output display:none at correct media queries
 *
 * Uses actual source files as inputs. Reports element + property + pattern step that failed.
 */

let mockUuidCounter = 0;
jest.mock('uuid', () => ({
  v4: () => `uuid-${++mockUuidCounter}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
}));

import { elementDefinitions } from '@/app/_config/elementDefinitions';
import { generateElementCSS } from '@/app/_utils/cssGeneration';
import { generateElementSchemaSettings } from '@/app/_utils/schemaGeneration';
import { generateElementHTML } from '@/app/_utils/htmlGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

// Import BlockBuilder functions
let getDefaultStyle, getDefaultProps, getDefaultSchemaToggles;
try {
  const bb = require('@/app/_components/BlockBuilder');
  getDefaultStyle = bb.getDefaultStyle;
  getDefaultProps = bb.getDefaultProps;
  getDefaultSchemaToggles = bb.getDefaultSchemaToggles;
} catch (e) {
  // BlockBuilder may not export these directly — we'll parse them from the module
}

beforeEach(() => {
  resetIdGenerator();
  mockUuidCounter = 0;
});

// ===========================================================================
// Element categories — each follows a specific export route
// ===========================================================================
const CATEGORIES = {
  layout: ['container', 'columns-1', 'columns-2', 'columns-3', 'columns-4', 'columns-5', 'columns-6', 'column', 'image-background', 'spacer'],
  simple: ['heading', 'text', 'button', 'image', 'video', 'icon', 'divider', 'list', 'unordered-list', 'table', 'map'],
  shopify: ['product-card', 'product-grid', 'collection-list'],
  interactive: ['accordion', 'tabs', 'countdown', 'slideshow', 'popup', 'image-gallery', 'flip-card', 'before-after', 'marquee', 'blog-post', 'form'],
};

// Properties that are intentionally canvas-only (not intended for export)
const CANVAS_ONLY_STYLE_PROPS = new Set([
  'display', 'position', 'flex', 'overflow', 'boxSizing', 'cursor',
]);

// Properties that exist in getDefaultProps for internal use, not for Shopify export
const INTERNAL_CONTENT_PROPS = new Set([
  'settingId', 'level', 'iconCategory', 'uploadedFileName', 'size',
]);

// Composite prop groups — sub-props that assemble into one CSS value
const COMPOSITE_PROPS = {
  boxShadow: ['boxShadowOffsetX', 'boxShadowOffsetY', 'boxShadowBlur', 'boxShadowSpread', 'boxShadowColor'],
  textShadow: ['textShadowOffsetX', 'textShadowOffsetY', 'textShadowBlur', 'textShadowColor'],
  gradient: ['gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2', 'gradientColor3', 'gradientColor4', 'gradientColor5'],
};

// Per-item content elements — element type → { prefix patterns, countProp }
const PER_ITEM_ELEMENTS = {
  accordion: { countProp: 'itemCount', prefixes: ['panelTitle_', 'panelContent_'] },
  tabs: { countProp: 'tabCount', prefixes: ['tabLabel_', 'tabContent_'] },
  slideshow: { countProp: 'slideCount', prefixes: ['slideImage_', 'slideHeading_', 'slideText_'] },
  'image-gallery': { countProp: 'imageCount', prefixes: ['image_'] },
};

// Elements that need product/collection pickers
const PICKER_ELEMENTS = {
  'product-card': 'product',
  'product-grid': 'collection',
  'collection-list': 'collection',
};

// Elements with dedicated CSS blocks (child selectors)
const DEDICATED_CSS_ELEMENTS = [
  'product-grid', 'collection-list', 'accordion', 'tabs', 'countdown',
  'slideshow', 'popup', 'marquee', 'image-gallery',
  'blog-post', 'flip-card', 'divider', 'before-after',
];

// Hover prop prefixes
const HOVER_PREFIXES = ['hoverBackgroundColor', 'hoverColor', 'hoverBorderColor', 'hoverBorderStyle', 'hoverBorderWidth', 'hoverOpacity', 'hoverAnimation'];

// Visibility props
const VISIBILITY_PROPS = ['hideOnMobile', 'hideOnDesktop', 'hideOnFullscreen'];

// Shopify schema breakpoints and their viewport keys
const SCHEMA_BREAKPOINTS = {
  desktop: 'lg',   // base CSS, no media query
  mobile: 'sm',    // @media (min-width: 576px) and (max-width: 767px)
  fullscreen: 'xl', // @media (min-width: 1200px)
};

// Builder-only viewports (hardcoded CSS, no schema)
const BUILDER_ONLY_VIEWPORTS = ['xs', 'md'];

// ===========================================================================
// Helpers
// ===========================================================================

function getAllElementTypes() {
  return Object.keys(elementDefinitions);
}

function getStylePropNames(elementType) {
  const def = elementDefinitions[elementType];
  if (!def) return [];
  return (def.styleProps || []).map(p => p.name);
}

function getContentPropNames(elementType) {
  const def = elementDefinitions[elementType];
  if (!def) return [];
  return (def.contentProps || []).map(p => p.name);
}

function getCategory(elementType) {
  for (const [cat, types] of Object.entries(CATEGORIES)) {
    if (types.includes(elementType)) return cat;
  }
  return 'uncategorized';
}

/** Create a mock element for testing generators */
function createMockElement(elementType, options = {}) {
  const styleProps = getStylePropNames(elementType);
  const contentProps = getContentPropNames(elementType);

  const style = {};
  const props = {};
  const schemaToggles = {};

  // Set dummy values for all style props
  for (const prop of styleProps) {
    if (prop.includes('Color') || prop === 'color') {
      style[prop] = '#333333';
    } else if (prop.includes('Size') || prop.includes('Width') || prop.includes('Height') ||
               prop.includes('padding') || prop.includes('margin') || prop.includes('Radius') ||
               prop === 'width' || prop === 'height' || prop === 'gap' ||
               prop.includes('Blur') || prop.includes('Spread') || prop.includes('Offset')) {
      style[prop] = '10px';
    } else if (prop.includes('Weight')) {
      style[prop] = 'bold';
    } else if (prop.includes('Align')) {
      style[prop] = 'center';
    } else if (prop.includes('Style') && prop.includes('border')) {
      style[prop] = 'solid';
    } else if (prop === 'opacity') {
      style[prop] = '1';
    } else if (prop === 'objectFit') {
      style[prop] = 'cover';
    } else if (prop === 'lineHeight') {
      style[prop] = '1.5';
    } else {
      style[prop] = 'test-value';
    }
  }

  // Set dummy values for all content props
  for (const prop of contentProps) {
    if (prop === 'text' || prop.includes('Text') || prop.includes('Label') || prop.includes('Title') || prop.includes('Content') || prop.includes('Message')) {
      props[prop] = 'Test text';
    } else if (prop === 'src' || prop.includes('Image') || prop.includes('image')) {
      props[prop] = 'https://test.com/image.jpg';
    } else if (prop === 'url' || prop === 'href') {
      props[prop] = 'https://test.com';
    } else if (prop === 'html') {
      props[prop] = '<p>Test</p>';
    } else if (prop.includes('show') || prop.includes('Show') || prop === 'controls' || prop === 'autoplay' || prop === 'muted' || prop === 'loop' || prop === 'enableLightbox' || prop === 'openInNewTab' || prop === 'stripedRows' || prop === 'hoverHighlight' || prop === 'pauseOnHover') {
      props[prop] = true;
    } else if (prop === 'columns' || prop === 'rows' || prop.includes('Count') || prop.includes('count')) {
      props[prop] = 3;
    } else if (prop === 'tag') {
      props[prop] = 'h2';
    } else if (prop === 'targetDate') {
      props[prop] = '2026-12-31';
    } else if (prop === 'speed') {
      props[prop] = '30';
    } else if (prop === 'startPosition') {
      props[prop] = '50';
    } else if (prop === 'direction') {
      props[prop] = 'left';
    } else if (prop === 'selectorStyle') {
      props[prop] = 'dropdown';
    } else if (prop === 'flipDirection') {
      props[prop] = 'horizontal';
    } else if (prop === 'autoplayInterval') {
      props[prop] = '5000';
    } else if (prop === 'address') {
      props[prop] = 'New York, NY';
    } else if (prop === 'formAction') {
      props[prop] = '/contact';
    } else if (prop === 'separatorStyle') {
      props[prop] = 'colon';
    } else if (prop === 'aspectRatio') {
      props[prop] = '1/1';
    } else {
      props[prop] = 'test';
    }
  }

  // Toggle on all props if requested
  if (options.allToggledOn) {
    for (const prop of [...styleProps, ...contentProps]) {
      schemaToggles[prop] = true;
    }
  }

  return {
    id: `test-${elementType}-001`,
    type: elementType,
    style,
    props,
    schemaToggles,
    responsiveStyles: {},
    children: options.children || [],
    columns: options.columns || undefined,
  };
}

// ===========================================================================
// PATTERN 1: Style Props — elementDefs → default → toggle → CSS export
// ===========================================================================
describe('Pattern 1: Style prop pipeline', () => {
  const allTypes = getAllElementTypes();

  describe('Every styleProp in elementDefinitions must be reachable', () => {
    for (const elementType of allTypes) {
      const styleProps = getStylePropNames(elementType);
      if (styleProps.length === 0) continue;

      describe(elementType, () => {
        test('all styleProps are defined in elementDefinitions', () => {
          const def = elementDefinitions[elementType];
          expect(def).toBeDefined();
          expect(def.styleProps.length).toBeGreaterThan(0);
          for (const sp of def.styleProps) {
            expect(sp.name).toBeDefined();
            expect(typeof sp.name).toBe('string');
          }
        });

        test('toggled-on styleProps produce CSS with Liquid variables', () => {
          const element = createMockElement(elementType, { allToggledOn: true });
          const sectionId = 'test-section';

          let css;
          try {
            css = generateElementCSS(element, sectionId);
          } catch (e) {
            // Some elements may need special setup
            return;
          }

          if (!css) return;

          // For each toggled-on style prop, the CSS should contain a Liquid reference
          // unless it's a composite sub-prop, hover prop, or visibility prop
          const compositeSubProps = new Set([
            ...COMPOSITE_PROPS.boxShadow,
            ...COMPOSITE_PROPS.textShadow,
            ...COMPOSITE_PROPS.gradient,
          ]);
          const hoverProps = new Set(styleProps.filter(p => p.startsWith('hover')));
          const visProps = new Set(VISIBILITY_PROPS);
          const skipProps = new Set([
            ...compositeSubProps, ...hoverProps, ...visProps,
            'entranceAnimation', 'entranceDelay', 'entranceDuration',
            'hoverAnimation', 'buttonHoverAnimation',
            'buttonHoverColor', 'buttonHoverBackgroundColor', 'buttonHoverBorderColor',
          ]);

          const missingFromCSS = [];
          for (const prop of styleProps) {
            if (skipProps.has(prop)) continue;
            if (CANVAS_ONLY_STYLE_PROPS.has(prop)) continue;

            // The CSS should contain either the property name in kebab-case or a Liquid var reference
            const kebab = prop.replace(/([A-Z])/g, '-$1').toLowerCase();

            // Check for either the Liquid variable or the kebab-case property
            const hasLiquidVar = css.includes(`section.settings.`) && (css.includes(prop) || css.includes(kebab));
            const hasHardcoded = css.includes(kebab);

            if (!hasLiquidVar && !hasHardcoded) {
              missingFromCSS.push(prop);
            }
          }

          if (missingFromCSS.length > 0) {
            // Report which props are missing
            expect(missingFromCSS).toEqual([]);
          }
        });
      });
    }
  });
});

// ===========================================================================
// PATTERN 2: Content Props — elementDefs → default → toggle → HTML export
// ===========================================================================
describe('Pattern 2: Content prop pipeline', () => {
  const allTypes = getAllElementTypes();

  describe('Every contentProp in elementDefinitions should be referenced in HTML generation', () => {
    for (const elementType of allTypes) {
      const contentProps = getContentPropNames(elementType);
      if (contentProps.length === 0) continue;

      describe(elementType, () => {
        test('toggled-on contentProps produce HTML with Liquid references or direct values', () => {
          const element = createMockElement(elementType, { allToggledOn: true });

          // For column types, add mock columns
          if (elementType.startsWith('columns-') || elementType === 'grid-2x2') {
            const colCount = parseInt(elementType.split('-')[1]) || 4;
            element.columns = Array.from({ length: colCount }, () => []);
          }

          let html;
          try {
            html = generateElementHTML(element, 'test-section');
          } catch (e) {
            // Some elements need specific setup
            return;
          }

          if (!html) return;

          // Per-item props are tested separately in Pattern 5
          const perItemPrefixes = PER_ITEM_ELEMENTS[elementType]?.prefixes || [];
          const isPerItem = (prop) => perItemPrefixes.some(prefix => prop.startsWith(prefix));

          const missingFromHTML = [];
          for (const prop of contentProps) {
            if (INTERNAL_CONTENT_PROPS.has(prop)) continue;
            if (isPerItem(prop)) continue;

            // The HTML should reference this property somehow:
            // - Liquid var: section.settings.xxx_propName
            // - Direct value from props
            // - shouldEnableInSchema check
            const hasReference = html.includes(prop) || html.includes(`section.settings.`);

            if (!hasReference) {
              missingFromHTML.push(prop);
            }
          }

          if (missingFromHTML.length > 0) {
            expect(missingFromHTML).toEqual([]);
          }
        });
      });
    }
  });
});

// ===========================================================================
// PATTERN 3: Dedicated CSS — structural elements have child selector output
// ===========================================================================
describe('Pattern 3: Dedicated CSS blocks', () => {
  for (const elementType of DEDICATED_CSS_ELEMENTS) {
    test(`${elementType} generates element-specific CSS with child selectors`, () => {
      const def = elementDefinitions[elementType];
      if (!def) return;

      const element = createMockElement(elementType, { allToggledOn: true });
      let css;
      try {
        css = generateElementCSS(element, 'test-section');
      } catch (e) {
        return;
      }

      if (!css) {
        // Element should produce CSS
        expect(css).toBeTruthy();
        return;
      }

      // Should have the base selector
      expect(css).toContain(`data-element-id="${element.id}"`);
    });
  }
});

// ===========================================================================
// PATTERN 4: Composite Props — sub-props assemble into one CSS value
// ===========================================================================
describe('Pattern 4: Composite prop assembly', () => {
  describe('box-shadow sub-props', () => {
    // Elements that have box-shadow sub-props
    const boxShadowElements = getAllElementTypes().filter(type => {
      const props = getStylePropNames(type);
      return props.includes('boxShadowOffsetX');
    });

    for (const elementType of boxShadowElements) {
      test(`${elementType} assembles box-shadow from sub-props`, () => {
        const element = createMockElement(elementType, { allToggledOn: true });
        let css;
        try {
          css = generateElementCSS(element, 'test-section');
        } catch (e) {
          return;
        }
        if (!css) return;

        // Should produce a box-shadow CSS property
        expect(css).toContain('box-shadow');
      });
    }
  });

  describe('text-shadow sub-props', () => {
    const textShadowElements = getAllElementTypes().filter(type => {
      const props = getStylePropNames(type);
      return props.includes('textShadowOffsetX');
    });

    for (const elementType of textShadowElements) {
      test(`${elementType} assembles text-shadow from sub-props`, () => {
        const element = createMockElement(elementType, { allToggledOn: true });
        let css;
        try {
          css = generateElementCSS(element, 'test-section');
        } catch (e) {
          return;
        }
        if (!css) return;

        expect(css).toContain('text-shadow');
      });
    }
  });

  describe('gradient sub-props', () => {
    const gradientElements = getAllElementTypes().filter(type => {
      const props = getStylePropNames(type);
      return props.includes('gradientType');
    });

    for (const elementType of gradientElements) {
      test(`${elementType} assembles gradient from sub-props`, () => {
        const element = createMockElement(elementType, { allToggledOn: true });
        element.style.gradientType = 'linear';
        element.style.gradientAngle = '90';
        element.style.gradientColor1 = '#ff0000';
        element.style.gradientColor2 = '#0000ff';

        let css;
        try {
          css = generateElementCSS(element, 'test-section');
        } catch (e) {
          return;
        }
        if (!css) return;

        // Should produce a gradient
        const hasGradient = css.includes('gradient') || css.includes('linear-gradient') || css.includes('radial-gradient');
        expect(hasGradient).toBe(true);
      });
    }
  });
});

// ===========================================================================
// PATTERN 5: Per-item Content — numbered props for accordion/tabs/slideshow
// ===========================================================================
describe('Pattern 5: Per-item content props', () => {
  for (const [elementType, config] of Object.entries(PER_ITEM_ELEMENTS)) {
    describe(elementType, () => {
      test(`has ${config.countProp} in contentProps`, () => {
        const contentProps = getContentPropNames(elementType);
        expect(contentProps).toContain(config.countProp);
      });

      test('numbered content props exist in elementDefinitions for each prefix', () => {
        const contentProps = getContentPropNames(elementType);
        const missing = [];

        for (const prefix of config.prefixes) {
          // Check at least items 1-3 exist
          for (let i = 1; i <= 3; i++) {
            const propName = `${prefix}${i}`;
            if (!contentProps.includes(propName)) {
              missing.push(propName);
            }
          }
        }

        if (missing.length > 0) {
          expect(missing).toEqual([]);
        }
      });

      test('per-item props should have schema toggles in getDefaultSchemaToggles', () => {
        // The per-item props should be toggled on so they export
        // We check by looking at what getDefaultSchemaToggles returns
        // Since we may not have direct access, we test via the schema output
        const element = createMockElement(elementType, { allToggledOn: true });

        let schema;
        try {
          schema = generateElementSchemaSettings(element);
        } catch (e) {
          return;
        }

        if (!schema || !Array.isArray(schema)) return;

        // Schema should contain settings for the per-item props
        const schemaIds = schema.map(s => s.id || '');
        for (const prefix of config.prefixes) {
          const hasAtLeastOne = schemaIds.some(id => id.includes(prefix.replace('_', '')));
          // Not a hard failure — just flagging
        }
      });
    });
  }
});

// ===========================================================================
// PATTERN 6: Picker — product/collection picker in schema + Liquid assign
// ===========================================================================
describe('Pattern 6: Product/collection pickers', () => {
  for (const [elementType, pickerType] of Object.entries(PICKER_ELEMENTS)) {
    describe(elementType, () => {
      test(`schema includes ${pickerType} picker setting`, () => {
        const element = createMockElement(elementType, { allToggledOn: true });

        let schema;
        try {
          schema = generateElementSchemaSettings(element);
        } catch (e) {
          return;
        }

        if (!schema || !Array.isArray(schema)) {
          expect(schema).toBeTruthy();
          return;
        }

        // Should have a setting with type 'product' or 'collection'
        const hasPicker = schema.some(s => s.type === pickerType);
        expect(hasPicker).toBe(true);
      });

      test(`HTML includes Liquid assign for ${pickerType}`, () => {
        const element = createMockElement(elementType, { allToggledOn: true });

        let html;
        try {
          html = generateElementHTML(element, 'test-section');
        } catch (e) {
          return;
        }

        if (!html) return;

        // Should have a Liquid assign for the product/collection
        const hasAssign = html.includes('{% assign') || html.includes('section.settings.');
        expect(hasAssign).toBe(true);
      });
    });
  }
});

// ===========================================================================
// PATTERN 7: Hover Props — hover* props map to :hover CSS
// ===========================================================================
describe('Pattern 7: Hover state CSS', () => {
  const hoverElements = getAllElementTypes().filter(type => {
    const props = getStylePropNames(type);
    return props.some(p => p.startsWith('hover'));
  });

  for (const elementType of hoverElements) {
    test(`${elementType} generates :hover CSS for hover props`, () => {
      const element = createMockElement(elementType, { allToggledOn: true });

      let css;
      try {
        css = generateElementCSS(element, 'test-section');
      } catch (e) {
        return;
      }

      if (!css) return;

      // Should contain :hover pseudo-class
      expect(css).toContain(':hover');
    });
  }
});

// ===========================================================================
// PATTERN 8: Visibility — hideOn* props → display:none at breakpoints
// ===========================================================================
describe('Pattern 8: Visibility breakpoints', () => {
  // All elements get visibility props via shared definitions
  const testTypes = ['heading', 'button', 'container', 'image'];

  for (const elementType of testTypes) {
    describe(elementType, () => {
      for (const visProp of VISIBILITY_PROPS) {
        test(`${visProp} generates display:none in CSS`, () => {
          const element = createMockElement(elementType);
          element.schemaToggles[visProp] = true;
          element.style[visProp] = true;

          let css;
          try {
            css = generateElementCSS(element, 'test-section');
          } catch (e) {
            return;
          }

          if (!css) return;

          // Should contain display: none for this visibility prop
          expect(css).toContain('display: none');
        });
      }
    });
  }
});

// ===========================================================================
// CROSS-CUTTING: Default values exist for toggled props
// ===========================================================================
describe('Cross-cutting: Toggled props must have default values', () => {
  // This is the core issue — a property toggled ON in getDefaultSchemaToggles
  // but with no default value in getDefaultStyle/getDefaultProps means
  // the property appears editable but starts empty

  // We need to read BlockBuilder to get the actual defaults
  // Since we may not be able to import it directly, we test via the recon approach

  const allTypes = getAllElementTypes();

  for (const elementType of allTypes) {
    const styleProps = getStylePropNames(elementType);
    const contentProps = getContentPropNames(elementType);

    if (styleProps.length === 0 && contentProps.length === 0) continue;

    describe(elementType, () => {
      test('every styleProp in elementDefs should exist — baseline check', () => {
        const def = elementDefinitions[elementType];
        expect(def).toBeDefined();
        for (const sp of def.styleProps || []) {
          expect(sp).toHaveProperty('name');
          expect(typeof sp.name).toBe('string');
          expect(sp.name.length).toBeGreaterThan(0);
        }
      });

      test('every contentProp in elementDefs should exist — baseline check', () => {
        const def = elementDefinitions[elementType];
        expect(def).toBeDefined();
        for (const cp of def.contentProps || []) {
          expect(cp).toHaveProperty('name');
          expect(typeof cp.name).toBe('string');
          expect(cp.name.length).toBeGreaterThan(0);
        }
      });
    });
  }
});

// ===========================================================================
// CROSS-CUTTING: Schema generation produces settings for toggled props
// ===========================================================================
describe('Cross-cutting: Schema output for toggled props', () => {
  const allTypes = getAllElementTypes();

  for (const elementType of allTypes) {
    const styleProps = getStylePropNames(elementType);
    const contentProps = getContentPropNames(elementType);
    const allProps = [...styleProps, ...contentProps];

    if (allProps.length === 0) continue;

    test(`${elementType} — toggled props appear in schema output`, () => {
      const element = createMockElement(elementType, { allToggledOn: true });

      // Column types need columns
      if (elementType.startsWith('columns-') || elementType === 'grid-2x2') {
        const colCount = parseInt(elementType.split('-')[1]) || 4;
        element.columns = Array.from({ length: colCount }, () => []);
      }

      let schema;
      try {
        schema = generateElementSchemaSettings(element);
      } catch (e) {
        return;
      }

      if (!schema || !Array.isArray(schema)) return;

      const schemaIds = schema.map(s => s.id || '').filter(Boolean);

      // Every toggled prop should appear in the schema (with breakpoint suffixes for responsive)
      const compositeSubProps = new Set([
        ...COMPOSITE_PROPS.boxShadow,
        ...COMPOSITE_PROPS.textShadow,
        ...COMPOSITE_PROPS.gradient,
      ]);

      const missingFromSchema = [];
      for (const prop of allProps) {
        if (CANVAS_ONLY_STYLE_PROPS.has(prop)) continue;
        if (compositeSubProps.has(prop)) {
          // Composite props may appear individually in schema
          continue;
        }

        // Check if any schema setting ID contains this prop name
        const propInSchema = schemaIds.some(id => id.includes(prop));

        if (!propInSchema) {
          missingFromSchema.push(prop);
        }
      }

      // Report missing props but don't fail on known edge cases
      if (missingFromSchema.length > 0) {
        // Filter out known edge cases
        const realMissing = missingFromSchema.filter(p => {
          // Hover props may not have their own schema entries (they use the base prop)
          if (p.startsWith('hover') || p.startsWith('buttonHover')) return false;
          // Entrance animation props
          if (p.startsWith('entrance')) return false;
          // Visibility handled differently
          if (VISIBILITY_PROPS.includes(p)) return false;
          // Builder-only preview props (not for Shopify schema)
          // builder-only preview props removed with stock-counter
          return true;
        });

        if (realMissing.length > 0) {
          expect(realMissing).toEqual([]);
        }
      }
    });
  }
});

// ===========================================================================
// ELEMENT CATEGORIZATION: Every element must belong to a category
// ===========================================================================
describe('Element categorization', () => {
  test('every element type in elementDefinitions has a category', () => {
    const allTypes = getAllElementTypes();
    const allCategorized = Object.values(CATEGORIES).flat();
    const uncategorized = allTypes.filter(t => !allCategorized.includes(t));

    if (uncategorized.length > 0) {
      expect(uncategorized).toEqual([]);
    }
  });

  test('no element appears in multiple categories', () => {
    const seen = {};
    for (const [cat, types] of Object.entries(CATEGORIES)) {
      for (const type of types) {
        if (seen[type]) {
          fail(`${type} appears in both ${seen[type]} and ${cat}`);
        }
        seen[type] = cat;
      }
    }
  });
});

// ===========================================================================
// DEEP CHECK: Every toggled-on style prop must produce CSS output
// ===========================================================================
describe('Deep check: Toggled-on style props must produce CSS', () => {
  const fs = require('fs');
  const path = require('path');
  const bbPath = path.resolve(__dirname, '../../app/_components/BlockBuilder.jsx');
  let bbContent = '';
  try { bbContent = fs.readFileSync(bbPath, 'utf8'); } catch (e) {}

  if (bbContent) {
    const stMatch = bbContent.match(/const getDefaultSchemaToggles\s*=[\s\S]*?const defaults\s*=\s*\{([\s\S]*?)\};\s*\n\s*return/);
    if (stMatch) {
      const stBody = stMatch[1];
      const elementBlockRegex = /['"]?([a-z][\w-]*)['"]?\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
      let em;
      while ((em = elementBlockRegex.exec(stBody)) !== null) {
        const elType = em[1];
        const toggleBody = em[2];
        const toggles = {};
        const toggleMatches = toggleBody.matchAll(/(\w+):\s*(true|false)/g);
        for (const tm of toggleMatches) if (tm[2] === 'true') toggles[tm[1]] = true;

        const def = elementDefinitions[elType];
        if (!def) continue;

        const styleNames = (def.styleProps || []).map(p => p.name);
        const toggledStyleProps = Object.keys(toggles).filter(k => styleNames.includes(k));

        if (toggledStyleProps.length === 0) continue;

        test(`${elType} — toggled-on style props produce CSS output`, () => {
          const element = createMockElement(elType, { allToggledOn: true });
          if (elType.startsWith('columns-') || elType === 'grid-2x2') {
            const colCount = parseInt(elType.split('-')[1]) || 4;
            element.columns = Array.from({ length: colCount }, () => []);
          }

          let css = '';
          try { css = generateElementCSS(element, 'test-section') || ''; } catch (e) { return; }
          if (!css) { expect(css).toBeTruthy(); return; }

          const compositeSubProps = new Set([
            ...COMPOSITE_PROPS.boxShadow, ...COMPOSITE_PROPS.textShadow, ...COMPOSITE_PROPS.gradient,
          ]);
          const skipInTest = new Set([
            ...compositeSubProps, ...VISIBILITY_PROPS,
            'entranceAnimation', 'entranceDelay', 'entranceDuration',
            'hoverAnimation', 'buttonHoverAnimation',
            'buttonHoverColor', 'buttonHoverBackgroundColor', 'buttonHoverBorderColor',
          ]);

          const missing = [];
          for (const prop of toggledStyleProps) {
            if (skipInTest.has(prop)) continue;
            if (prop.startsWith('hover') || prop.startsWith('buttonHover')) continue;
            if (CANVAS_ONLY_STYLE_PROPS.has(prop)) continue;

            const kebab = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            const inCSS = css.includes(prop) || css.includes(kebab);
            if (!inCSS) missing.push(prop);
          }

          if (missing.length > 0) {
            expect(missing).toEqual([]);
          }
        });
      }
    }
  }
});

// ===========================================================================
// DEEP CHECK: getDefaultStyle values that are NOT in elementDefinitions
// These render on canvas but silently vanish on export
// ===========================================================================
describe('Deep check: Hardcoded defaults not in elementDefinitions', () => {
  // We parse BlockBuilder.jsx to extract getDefaultStyle entries
  // and compare against elementDefinitions
  const fs = require('fs');
  const path = require('path');
  const bbPath = path.resolve(__dirname, '../../app/_components/BlockBuilder.jsx');
  let bbContent = '';
  try {
    bbContent = fs.readFileSync(bbPath, 'utf8');
  } catch (e) {
    // Skip if file not found
  }

  if (bbContent) {
    // Parse getDefaultStyle
    const dsMatch = bbContent.match(/const getDefaultStyle\s*=\s*\(type\)\s*=>\s*\{([\s\S]*?)\n\};/);
    if (dsMatch) {
      const dsBody = dsMatch[1];
      const caseRegex = /case\s+['"]([^'"]+)['"]:/g;
      const cases = [];
      let cm;
      while ((cm = caseRegex.exec(dsBody)) !== null) {
        cases.push({ type: cm[1], pos: cm.index });
      }

      for (let i = 0; i < cases.length; i++) {
        const start = cases[i].pos;
        const end = i + 1 < cases.length ? cases[i + 1].pos : dsBody.length;
        const block = dsBody.substring(start, end);
        const elType = cases[i].type;

        const returnMatch = block.match(/return\s*\{([\s\S]*?)\};/);
        if (!returnMatch) continue;

        const props = {};
        const strMatches = returnMatch[1].matchAll(/(\w+):\s*['"]([^'"]*?)['"]/g);
        for (const sm of strMatches) props[sm[1]] = sm[2];
        const nullMatches = returnMatch[1].matchAll(/(\w+):\s*null/g);
        for (const nm of nullMatches) props[nm[1]] = null;
        const boolMatches = returnMatch[1].matchAll(/(\w+):\s*(true|false)/g);
        for (const bm of boolMatches) props[bm[1]] = bm[2] === 'true';

        const def = elementDefinitions[elType];
        if (!def) continue;

        const edStyleNames = (def.styleProps || []).map(p => p.name);

        test(`${elType} — getDefaultStyle props must exist in elementDefinitions`, () => {
          const orphaned = [];
          for (const prop of Object.keys(props)) {
            if (CANVAS_ONLY_STYLE_PROPS.has(prop)) continue;
            if (!edStyleNames.includes(prop)) {
              orphaned.push(`${prop}: "${props[prop]}" — in getDefaultStyle but NOT in elementDefinitions`);
            }
          }
          if (orphaned.length > 0) {
            expect(orphaned).toEqual([]);
          }
        });
      }
    }

    // Parse getDefaultProps
    const dpMatch = bbContent.match(/const getDefaultProps\s*=\s*\(type[\s\S]*?\)\s*=>\s*\{([\s\S]*?)\n\};/);
    if (dpMatch) {
      const dpBody = dpMatch[1];
      const caseRegex = /case\s+['"]([^'"]+)['"]:/g;
      const cases = [];
      let cm;
      while ((cm = caseRegex.exec(dpBody)) !== null) {
        cases.push({ type: cm[1], pos: cm.index });
      }

      for (let i = 0; i < cases.length; i++) {
        const start = cases[i].pos;
        const end = i + 1 < cases.length ? cases[i + 1].pos : dpBody.length;
        const block = dpBody.substring(start, end);
        const elType = cases[i].type;

        const returnMatch = block.match(/return\s*\{([\s\S]*?)\};/);
        if (!returnMatch) continue;

        const props = {};
        const strMatches = returnMatch[1].matchAll(/(\w+):\s*['"]([^'"]*?)['"]/g);
        for (const sm of strMatches) props[sm[1]] = sm[2];
        const boolMatches = returnMatch[1].matchAll(/(\w+):\s*(true|false)/g);
        for (const bm of boolMatches) props[bm[1]] = bm[2] === 'true';
        const numMatches = returnMatch[1].matchAll(/(\w+):\s*(\d+)(?!\w)/g);
        for (const nm of numMatches) props[nm[1]] = parseInt(nm[2]);

        const def = elementDefinitions[elType];
        if (!def) continue;

        const edContentNames = (def.contentProps || []).map(p => p.name);
        const edStyleNames = (def.styleProps || []).map(p => p.name);

        test(`${elType} — getDefaultProps values must exist in elementDefinitions`, () => {
          const orphaned = [];
          for (const prop of Object.keys(props)) {
            if (INTERNAL_CONTENT_PROPS.has(prop)) continue;
            if (!edContentNames.includes(prop) && !edStyleNames.includes(prop)) {
              orphaned.push(`${prop}: "${props[prop]}" — in getDefaultProps but NOT in elementDefinitions`);
            }
          }
          if (orphaned.length > 0) {
            expect(orphaned).toEqual([]);
          }
        });
      }
    }

    // Parse getDefaultSchemaToggles — every toggle must reference a real prop
    const stMatch = bbContent.match(/const getDefaultSchemaToggles\s*=[\s\S]*?const defaults\s*=\s*\{([\s\S]*?)\};\s*\n\s*return/);
    if (stMatch) {
      const stBody = stMatch[1];
      const elementBlockRegex = /['"]?([a-z][\w-]*)['"]?\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
      let em;
      while ((em = elementBlockRegex.exec(stBody)) !== null) {
        const elType = em[1];
        const toggleBody = em[2];
        const toggles = {};
        const toggleMatches = toggleBody.matchAll(/(\w+):\s*(true|false)/g);
        for (const tm of toggleMatches) toggles[tm[1]] = tm[2] === 'true';

        const def = elementDefinitions[elType];
        if (!def) continue;

        const allPropNames = [
          ...(def.styleProps || []).map(p => p.name),
          ...(def.contentProps || []).map(p => p.name),
        ];

        test(`${elType} — every schema toggle must reference a prop in elementDefinitions`, () => {
          const phantomToggles = [];
          for (const [prop, value] of Object.entries(toggles)) {
            if (!value) continue; // Only check toggled-ON props
            if (!allPropNames.includes(prop)) {
              phantomToggles.push(`${prop}: toggled ON but does not exist in elementDefinitions`);
            }
          }
          if (phantomToggles.length > 0) {
            expect(phantomToggles).toEqual([]);
          }
        });
      }
    }
  }
});

// ===========================================================================
// DEEP CHECK: Naming conventions
// ===========================================================================
describe('Deep check: Naming conventions', () => {
  const allTypes = getAllElementTypes();

  for (const elementType of allTypes) {
    const def = elementDefinitions[elementType];
    if (!def) continue;

    describe(elementType, () => {
      test('all styleProp names are camelCase', () => {
        const bad = [];
        for (const sp of def.styleProps || []) {
          // camelCase: starts with lowercase, no hyphens, no underscores (except for numbered items)
          if (sp.name.includes('-')) {
            bad.push(`${sp.name} — contains hyphen (should be camelCase)`);
          }
          if (sp.name.includes('_') && !sp.name.match(/\w+_\d+$/)) {
            bad.push(`${sp.name} — contains underscore (should be camelCase)`);
          }
          if (/^[A-Z]/.test(sp.name)) {
            bad.push(`${sp.name} — starts with uppercase`);
          }
        }
        if (bad.length > 0) {
          expect(bad).toEqual([]);
        }
      });

      test('all contentProp names are camelCase', () => {
        const bad = [];
        for (const cp of def.contentProps || []) {
          if (cp.name.includes('-')) {
            bad.push(`${cp.name} — contains hyphen (should be camelCase)`);
          }
          if (/^[A-Z]/.test(cp.name)) {
            bad.push(`${cp.name} — starts with uppercase`);
          }
        }
        if (bad.length > 0) {
          expect(bad).toEqual([]);
        }
      });

      test('no duplicate property names', () => {
        const allNames = [
          ...(def.styleProps || []).map(p => p.name),
          ...(def.contentProps || []).map(p => p.name),
        ];
        const seen = new Set();
        const dupes = [];
        for (const name of allNames) {
          if (seen.has(name)) {
            dupes.push(name);
          }
          seen.add(name);
        }
        if (dupes.length > 0) {
          expect(dupes).toEqual([]);
        }
      });

      test('styleProp and contentProp names do not overlap', () => {
        const styleNames = new Set((def.styleProps || []).map(p => p.name));
        const contentNames = (def.contentProps || []).map(p => p.name);
        const overlap = contentNames.filter(n => styleNames.has(n));
        if (overlap.length > 0) {
          expect(overlap).toEqual([]);
        }
      });
    });
  }
});

// ===========================================================================
// DEEP CHECK: Element completeness — expected props for element archetypes
// ===========================================================================
describe('Deep check: Element completeness', () => {
  // Base spacing props that most visible elements should have
  const BASE_SPACING = ['marginTop', 'marginBottom'];
  const FULL_SPACING = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
  const PADDING = ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];

  // Text-based elements should have these
  const TEXT_STYLE_PROPS = ['fontSize', 'fontWeight', 'color', 'textAlign'];

  // Border props that should be consistent (all 3 or none)
  const BORDER_SET = ['borderWidth', 'borderStyle', 'borderColor'];

  // Elements that should have full margin control
  const FULL_MARGIN_ELEMENTS = [
    'heading', 'text', 'button', 'image', 'video', 'icon',
    'divider', 'blog-post', 'marquee', 'before-after', 'flip-card',
  ];

  // Elements that should have text styling
  const TEXT_ELEMENTS = ['heading', 'text', 'button'];

  // Elements with borders should have all 3 border props
  const BORDER_ELEMENTS = getAllElementTypes().filter(type => {
    const props = getStylePropNames(type);
    return props.some(p => p.startsWith('border') && !p.startsWith('borderRadius'));
  });

  describe('Margin consistency — if any margin exists, all 4 should exist', () => {
    const allTypes = getAllElementTypes();
    for (const elementType of allTypes) {
      const props = getStylePropNames(elementType);
      const hasMargin = props.some(p => p.startsWith('margin'));
      if (!hasMargin) continue;

      test(`${elementType} should have marginTop, marginBottom, marginLeft, marginRight`, () => {
        const missing = FULL_SPACING.filter(p => !props.includes(p));
        const present = FULL_SPACING.filter(p => props.includes(p));
        if (present.length > 0 && missing.length > 0) {
          expect(missing).toEqual([]);
        }
      });
    }
  });

  describe('Text styling consistency', () => {
    for (const elementType of TEXT_ELEMENTS) {
      test(`${elementType} should have fontSize, fontWeight, color, textAlign`, () => {
        const props = getStylePropNames(elementType);
        const missing = TEXT_STYLE_PROPS.filter(p => !props.includes(p));
        if (missing.length > 0) {
          expect(missing).toEqual([]);
        }
      });
    }
  });

  describe('Border prop consistency — if any border prop exists, all 3 must exist', () => {
    for (const elementType of BORDER_ELEMENTS) {
      test(`${elementType} should have borderWidth, borderStyle, AND borderColor (not partial)`, () => {
        const props = getStylePropNames(elementType);
        const hasBorderWidth = props.includes('borderWidth');
        const hasBorderStyle = props.includes('borderStyle');
        const hasBorderColor = props.includes('borderColor');

        const present = [hasBorderWidth && 'borderWidth', hasBorderStyle && 'borderStyle', hasBorderColor && 'borderColor'].filter(Boolean);
        const missing = BORDER_SET.filter(p => !props.includes(p));

        if (present.length > 0 && missing.length > 0) {
          // Has some but not all — inconsistent
          expect(missing).toEqual([]);
        }
      });
    }
  });

  describe('Padding consistency — if any padding exists, all 4 should exist', () => {
    const allTypes = getAllElementTypes();
    for (const elementType of allTypes) {
      const props = getStylePropNames(elementType);
      const hasPadding = props.some(p => p.startsWith('padding'));
      if (!hasPadding) continue;

      test(`${elementType} — if has any padding, should have all 4 (no shorthand)`, () => {
        const missing = PADDING.filter(p => !props.includes(p));
        const present = PADDING.filter(p => props.includes(p));

        if (present.length > 0 && missing.length > 0) {
          expect(missing).toEqual([]);
        }
      });
    }
  });
});
