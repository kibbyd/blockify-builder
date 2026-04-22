/**
 * Background Overlay Element Tests
 *
 * Tests for the background-overlay element type across all pipeline stages:
 * - Element definition (elementDefinitions.js)
 * - Default styles/props/toggles (BlockBuilder.jsx)
 * - CSS generation (cssGeneration.js)
 * - HTML generation (htmlGeneration.js)
 * - Schema generation (schemaGeneration.js)
 */

// Mock heavy dependencies for BlockBuilder imports
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
}));
jest.mock('@/app/_hooks/useSubscription', () => () => ({
  isActive: true,
  plan: 'pro',
}));
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('uuid', () => ({
  v4: () => `test-uuid-${Date.now()}`,
}));

import { elementDefinitions } from '@/app/_config/elementDefinitions';
import { getDefaultStyle, getDefaultProps, getDefaultSchemaToggles } from '@/app/_components/BlockBuilder';
import { generateElementCSS, generateLiquidStyles } from '@/app/_utils/cssGeneration';
import { generateElementHTML } from '@/app/_utils/htmlGeneration';
import { generateElementSchemaSettings } from '@/app/_utils/schemaGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

beforeEach(() => {
  resetIdGenerator();
});

// ---------------------------------------------------------------------------
// Element Definition
// ---------------------------------------------------------------------------

describe('Background Overlay - Element Definition', () => {
  const def = elementDefinitions['background-overlay'];

  test('element definition exists', () => {
    expect(def).toBeDefined();
    expect(def.type).toBe('background-overlay');
    expect(def.displayName).toBe('Background Overlay');
    expect(def.category).toBe('layout');
  });

  test('has src and alt content props', () => {
    const srcProp = def.contentProps.find(p => p.name === 'src');
    const altProp = def.contentProps.find(p => p.name === 'alt');

    expect(srcProp).toBeDefined();
    expect(srcProp.schemaType).toBe('image_picker');
    expect(srcProp.canBeSchemaEditable).toBe(true);

    expect(altProp).toBeDefined();
    expect(altProp.schemaType).toBe('text');
    expect(altProp.canBeSchemaEditable).toBe(true);
  });

  test('has required style props', () => {
    const requiredStyleProps = [
      'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'backgroundAttachment',
      'minHeight', 'height', 'backgroundColor',
      'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
      'alignItems', 'justifyContent', 'opacity',
    ];

    requiredStyleProps.forEach(propName => {
      const prop = def.styleProps.find(p => p.name === propName);
      expect(prop).toBeDefined();
      expect(prop.canBeSchemaEditable).toBe(true);
    });
  });

  test('responsive props are marked responsive', () => {
    const responsiveProps = [
      'minHeight', 'height',
      'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
      'alignItems', 'justifyContent',
    ];

    responsiveProps.forEach(propName => {
      const prop = def.styleProps.find(p => p.name === propName);
      expect(prop.responsive).toBe(true);
    });
  });

  test('non-responsive props are not marked responsive', () => {
    const nonResponsiveProps = [
      'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
      'backgroundAttachment', 'backgroundColor', 'opacity',
    ];

    nonResponsiveProps.forEach(propName => {
      const prop = def.styleProps.find(p => p.name === propName);
      expect(prop.responsive).toBe(false);
    });
  });

  test('select/button-group props have options', () => {
    const propsWithOptions = [
      'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
      'backgroundAttachment', 'alignItems', 'justifyContent',
    ];

    propsWithOptions.forEach(propName => {
      const prop = def.styleProps.find(p => p.name === propName);
      expect(Array.isArray(prop.options)).toBe(true);
      expect(prop.options.length).toBeGreaterThan(0);
    });
  });
});

// ---------------------------------------------------------------------------
// Default Styles, Props, Schema Toggles
// ---------------------------------------------------------------------------

describe('Background Overlay - Defaults', () => {
  test('getDefaultProps returns src and alt', () => {
    const props = getDefaultProps('background-overlay');
    expect(props).toBeDefined();
    expect(props.src).toBeDefined();
    expect(props).toHaveProperty('alt');
  });

  test('getDefaultStyle returns expected values', () => {
    const style = getDefaultStyle('background-overlay');
    expect(style).toBeDefined();
    expect(style.paddingTop).toBe('80px');
    expect(style.paddingBottom).toBe('80px');
    expect(style.paddingLeft).toBe('20px');
    expect(style.paddingRight).toBe('20px');
    expect(style.minHeight).toBe('500px');
    expect(style.backgroundSize).toBe('cover');
    expect(style.backgroundPosition).toBe('center center');
    expect(style.backgroundRepeat).toBe('no-repeat');
    expect(style.backgroundColor).toBe('#1a1a1a');
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('center');
  });

  test('getDefaultSchemaToggles has all Route 2 properties set to true', () => {
    const toggles = getDefaultSchemaToggles('background-overlay');
    expect(toggles).toBeDefined();

    const expectedToggles = [
      'src', 'alt',
      'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
      'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
      'minHeight', 'backgroundColor', 'alignItems', 'justifyContent',
    ];

    expectedToggles.forEach(prop => {
      expect(toggles[prop]).toBe(true);
    });
  });

  test('every schema toggle has a matching default value or content prop', () => {
    const toggles = getDefaultSchemaToggles('background-overlay');
    const style = getDefaultStyle('background-overlay');
    const props = getDefaultProps('background-overlay');

    Object.keys(toggles).forEach(prop => {
      if (toggles[prop]) {
        const hasStyle = style[prop] !== undefined;
        const hasProp = props[prop] !== undefined;
        expect(hasStyle || hasProp).toBe(true);
      }
    });
  });
});

// ---------------------------------------------------------------------------
// CSS Generation
// ---------------------------------------------------------------------------

describe('Background Overlay - CSS Generation', () => {
  const baseElement = {
    id: 'bg-overlay-test',
    type: 'background-overlay',
    props: { src: 'https://example.com/bg.jpg', alt: 'Test background' },
    style: {
      paddingTop: '80px',
      paddingBottom: '80px',
      paddingLeft: '20px',
      paddingRight: '20px',
      minHeight: '500px',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
    },
    schemaToggles: {
      src: true,
      alt: true,
      backgroundSize: true,
      backgroundPosition: true,
      backgroundRepeat: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
      minHeight: true,
      backgroundColor: true,
      alignItems: true,
      justifyContent: true,
    },
    children: [],
  };

  test('generates CSS with data-element-id selector', () => {
    const css = generateElementCSS(baseElement, 'section-id');
    expect(css).toContain('[data-element-id="bg-overlay-test"]');
  });

  test('generates background-image URL with Liquid var when schema enabled', () => {
    const css = generateElementCSS(baseElement, 'section-id');
    expect(css).toContain('background-image:');
    expect(css).toContain('image_url');
    expect(css).toContain('section.settings.');
  });

  test('generates Liquid variables for schema-enabled style properties', () => {
    const css = generateElementCSS(baseElement, 'section-id');
    expect(css).toContain('padding-top:');
    expect(css).toContain('padding-bottom:');
    expect(css).toContain('min-height:');
    expect(css).toContain('background-size:');
    expect(css).toContain('background-position:');
    expect(css).toContain('background-color:');
    expect(css).toContain('align-items:');
    expect(css).toContain('justify-content:');
  });

  test('generates responsive media queries for responsive props', () => {
    const element = {
      ...baseElement,
      responsiveStyles: {
        paddingTop: { sm: '40px', xl: '100px' },
        minHeight: { sm: '300px', xl: '600px' },
      },
    };

    const css = generateElementCSS(element, 'section-id');
    // sm breakpoint
    expect(css).toContain('@media (min-width: 576px) and (max-width: 767px)');
    // xl breakpoint
    expect(css).toContain('@media (min-width: 1200px)');
  });

  test('global CSS includes structural classes', () => {
    const elements = [{
      ...baseElement,
      children: [],
    }];

    const allCSS = generateLiquidStyles(elements, 'test-section');
    expect(allCSS).toContain('.background-overlay-container');
    expect(allCSS).toContain('.bg-overlay-content');
    expect(allCSS).toContain('align-items: inherit');
    expect(allCSS).toContain('justify-content: inherit');
  });
});

// ---------------------------------------------------------------------------
// HTML Generation
// ---------------------------------------------------------------------------

describe('Background Overlay - HTML Generation', () => {
  test('generates two nested divs with correct classes', () => {
    const element = {
      id: 'bg-overlay-html',
      type: 'background-overlay',
      props: { src: 'https://example.com/bg.jpg', alt: '' },
      style: {},
      schemaToggles: { src: true },
      children: [],
    };

    const html = generateElementHTML(element);
    expect(html).toContain('class="background-overlay-container"');
    expect(html).toContain('class="bg-overlay-content"');
    expect(html).toContain('data-element-id="bg-overlay-html"');
  });

  test('renders children inside overlay div', () => {
    const element = {
      id: 'bg-overlay-parent',
      type: 'background-overlay',
      props: { src: 'https://example.com/bg.jpg', alt: '' },
      style: {},
      schemaToggles: { src: true },
      children: [
        {
          id: 'child-heading',
          type: 'heading',
          props: { text: 'Hero Title', tag: 'h1' },
          style: {},
          schemaToggles: {},
        },
        {
          id: 'child-text',
          type: 'text',
          props: { text: 'Subtitle text' },
          style: {},
          schemaToggles: {},
        },
      ],
    };

    const html = generateElementHTML(element);
    // Children are inside the overlay
    expect(html).toContain('data-element-id="child-heading"');
    expect(html).toContain('data-element-id="child-text"');
    // Outer div closes after inner overlay div
    const overlayOpen = html.indexOf('bg-overlay-content');
    const childHeading = html.indexOf('child-heading');
    const childText = html.indexOf('child-text');
    expect(childHeading).toBeGreaterThan(overlayOpen);
    expect(childText).toBeGreaterThan(overlayOpen);
  });

  test('uses Liquid variable for src when schema enabled', () => {
    const element = {
      id: 'bg-overlay-liquid',
      type: 'background-overlay',
      props: { src: 'https://example.com/bg.jpg', alt: '' },
      style: {},
      schemaToggles: { src: true },
      children: [],
    };

    const html = generateElementHTML(element);
    // Should NOT contain the raw URL when schema-enabled
    expect(html).not.toContain('https://example.com/bg.jpg');
  });
});

// ---------------------------------------------------------------------------
// Schema Generation
// ---------------------------------------------------------------------------

describe('Background Overlay - Schema Generation', () => {
  test('generates schema settings for content props', () => {
    const element = {
      id: 'bg-overlay-schema',
      type: 'background-overlay',
      props: { src: 'https://example.com/bg.jpg', alt: 'Test' },
      style: {
        backgroundSize: 'cover',
        paddingTop: '80px',
      },
      schemaToggles: {
        src: true,
        alt: true,
        backgroundSize: true,
        paddingTop: true,
      },
    };

    const settings = generateElementSchemaSettings(element);

    // Should have a header
    expect(settings[0].type).toBe('header');

    // Should have image_picker for src
    const srcSetting = settings.find(s => s.type === 'image_picker');
    expect(srcSetting).toBeDefined();

    // Should have text setting for alt
    const altSetting = settings.find(s => s.id && s.id.includes('_alt'));
    expect(altSetting).toBeDefined();
    expect(altSetting.type).toBe('text');
  });

  test('generates schema settings for style props', () => {
    const element = {
      id: 'bg-overlay-schema2',
      type: 'background-overlay',
      props: { src: '', alt: '' },
      style: {
        backgroundSize: 'cover',
        paddingTop: '80px',
        minHeight: '500px',
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
      },
      schemaToggles: {
        src: true,
        alt: true,
        backgroundSize: true,
        paddingTop: true,
        minHeight: true,
        backgroundColor: true,
        alignItems: true,
        justifyContent: true,
      },
    };

    const settings = generateElementSchemaSettings(element);

    // Check for select type (backgroundSize, alignItems, justifyContent)
    const selectSettings = settings.filter(s => s.type === 'select');
    expect(selectSettings.length).toBeGreaterThanOrEqual(3);

    // Check for color type (backgroundColor)
    const colorSettings = settings.filter(s => s.type === 'color');
    expect(colorSettings.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Pipeline Consistency
// ---------------------------------------------------------------------------

describe('Background Overlay - Pipeline Consistency', () => {
  test('every default style key exists in element definition styleProps', () => {
    const style = getDefaultStyle('background-overlay');
    const def = elementDefinitions['background-overlay'];
    const validStyleNames = new Set(def.styleProps.map(p => p.name));

    Object.keys(style).forEach(key => {
      expect(validStyleNames.has(key)).toBe(true);
    });
  });

  test('every default prop key exists in element definition contentProps', () => {
    const props = getDefaultProps('background-overlay');
    const def = elementDefinitions['background-overlay'];
    const validPropNames = new Set(def.contentProps.map(p => p.name));

    Object.keys(props).forEach(key => {
      expect(validPropNames.has(key)).toBe(true);
    });
  });

  test('every schema toggle key exists in element definition', () => {
    const toggles = getDefaultSchemaToggles('background-overlay');
    const def = elementDefinitions['background-overlay'];
    const allPropNames = new Set([
      ...def.contentProps.map(p => p.name),
      ...def.styleProps.map(p => p.name),
    ]);

    Object.keys(toggles).forEach(key => {
      expect(allPropNames.has(key)).toBe(true);
    });
  });

  test('no CSS shorthand properties in defaults', () => {
    const style = getDefaultStyle('background-overlay');
    const forbidden = ['padding', 'margin', 'border'];

    forbidden.forEach(shorthand => {
      expect(style).not.toHaveProperty(shorthand);
    });
  });
});
