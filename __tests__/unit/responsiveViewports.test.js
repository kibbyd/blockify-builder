/**
 * Responsive Viewport Tests
 *
 * Comprehensive coverage for responsive properties across all element types.
 *
 * Architecture:
 *   - Builder uses 5 viewports: xs, sm, md, lg, xl
 *   - CSS export generates 5 media queries (4 + base for md)
 *   - Schema export generates 3 Shopify settings: mobile, desktop, fullscreen
 *   - Liquid vars only in xs (→mobile), md (→desktop), xl (→fullscreen)
 *   - sm and lg always output hardcoded CSS values
 */

import { generateElementCSS } from '@/app/_utils/cssGeneration';
import { generateElementSchemaSettings } from '@/app/_utils/schemaGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';
import { elementDefinitions } from '@/app/_config/elementDefinitions';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// 5 viewport breakpoints
const VIEWPORTS = ['xs', 'sm', 'md', 'lg', 'xl'];

// CSS media queries per viewport (md is base — no media query)
const MEDIA_QUERIES = {
  xs: '@media (max-width: 575px)',
  sm: '@media (min-width: 576px) and (max-width: 767px)',
  lg: '@media (min-width: 992px) and (max-width: 1199px)',
  xl: '@media (min-width: 1200px)',
};

// Viewport → Shopify schema breakpoint mapping (null = hardcoded only)
const SCHEMA_MAP = {
  xs: 'mobile',
  sm: null,
  md: 'desktop',
  lg: null,
  xl: 'fullscreen',
};

// 3 Shopify schema breakpoints
const SCHEMA_BREAKPOINTS = ['mobile', 'desktop', 'fullscreen'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getResponsivePropsMap = () => {
  const map = {};
  Object.entries(elementDefinitions).forEach(([type, def]) => {
    const responsiveProps = (def.styleProps || []).filter(p => p.responsive);
    if (responsiveProps.length > 0) {
      map[type] = responsiveProps.map(p => p.name);
    }
  });
  return map;
};

const makeElement = (type, overrides = {}) => ({
  id: `test-${type}-viewport`,
  type,
  props: {},
  style: {},
  responsiveStyles: {},
  schemaToggles: {},
  ...overrides,
});

/** Build responsiveStyles for a single prop using viewport keys (xs/sm/md/lg/xl) */
const makeResponsiveStyle = (propName) => ({
  [propName]: {
    xs: '10px',
    md: '20px',
    xl: '30px',
  },
});

/** Build responsiveStyles for a single prop with ALL 5 viewports */
const makeFullResponsiveStyle = (propName) => ({
  [propName]: {
    xs: '8px',
    sm: '12px',
    md: '20px',
    lg: '28px',
    xl: '36px',
  },
});

/** Build responsiveStyles for ALL responsive props of an element type (xs/md/xl) */
const makeAllResponsiveStyles = (type) => {
  const props = responsivePropsMap[type] || [];
  const styles = {};
  props.forEach(propName => {
    styles[propName] = { xs: '10px', md: '20px', xl: '30px' };
  });
  return styles;
};

/** Build responsiveStyles for ALL responsive props with ALL 5 viewports */
const makeAllFullResponsiveStyles = (type) => {
  const props = responsivePropsMap[type] || [];
  const styles = {};
  props.forEach(propName => {
    styles[propName] = { xs: '8px', sm: '12px', md: '20px', lg: '28px', xl: '36px' };
  });
  return styles;
};

const makeAllToggles = (type) => {
  const props = responsivePropsMap[type] || [];
  const toggles = {};
  props.forEach(p => { toggles[p] = true; });
  return toggles;
};

const responsivePropsMap = getResponsivePropsMap();
const responsiveTypes = Object.keys(responsivePropsMap);

// CSS always-enabled props
const cssAlwaysEnabled = {
  'image': ['src', 'alt', 'width', 'height', 'maxWidth', 'objectFit', 'borderRadius', 'opacity', 'alignSelf'],
  'icon': ['src', 'iconSize', 'width', 'height', 'iconColor', 'opacity'],
  'image-background': ['src', 'backgroundSize', 'backgroundPosition', 'opacity', 'gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2', 'gradientColor3', 'gradientColor4', 'gradientColor5'],
  'heading': ['text', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'color', 'lineHeight', 'letterSpacing', 'textTransform', 'marginTop', 'marginBottom'],
  'text': ['text', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'color', 'lineHeight', 'marginTop', 'marginBottom'],
  'button': ['text', 'url', 'fontFamily', 'backgroundColor', 'color', 'padding', 'fontSize', 'fontWeight', 'borderRadius', 'border', 'hoverBackgroundColor', 'hoverColor'],
  'container': ['backgroundColor', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom', 'borderRadius', 'border', 'maxWidth', 'display', 'justifyContent', 'alignItems', 'gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2', 'gradientColor3', 'gradientColor4', 'gradientColor5'],
  'columns-1': ['flexDirection', 'gap', 'alignItems', 'justifyContent'],
  'columns-2': ['flexDirection', 'gap', 'alignItems', 'justifyContent'],
  'columns-3': ['flexDirection', 'gap', 'alignItems', 'justifyContent'],
  'columns-4': ['flexDirection', 'gap', 'alignItems', 'justifyContent'],
  'columns-5': ['flexDirection', 'gap', 'alignItems', 'justifyContent'],
  'columns-6': ['flexDirection', 'gap', 'alignItems', 'justifyContent'],
  'grid-2x2': ['flexDirection', 'gap', 'alignItems', 'justifyContent'],
  'column': ['flexDirection', 'justifyContent', 'alignItems', 'alignSelf', 'gap', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'backgroundColor'],
  'price': ['fontSize', 'fontWeight', 'color', 'comparePriceColor', 'textAlign', 'showComparePrice', 'marginTop', 'marginBottom'],
  'add-to-cart': ['buttonText', 'showQuantity', 'backgroundColor', 'color', 'fontSize', 'fontWeight', 'borderRadius', 'border', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'hoverBackgroundColor', 'hoverColor'],
  'product-card': ['showImage', 'showTitle', 'showPrice', 'showButton', 'buttonText', 'backgroundColor', 'color', 'titleTextAlign', 'priceTextAlign', 'buttonColor', 'buttonBackgroundColor', 'buttonHoverColor', 'buttonHoverBackgroundColor', 'buttonHoverAnimation', 'border', 'borderRadius', 'boxShadowOffsetX', 'boxShadowOffsetY', 'boxShadowBlur', 'boxShadowSpread', 'boxShadowColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
  'product-grid': ['columns', 'rows', 'showPrice', 'showButton', 'buttonText', 'gap', 'backgroundColor', 'color', 'buttonColor', 'buttonBackgroundColor', 'border', 'borderRadius', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
  'collection-list': ['columns', 'showImage', 'showTitle', 'showCount', 'gap', 'backgroundColor', 'color', 'border', 'borderRadius', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
  'divider': ['borderStyle', 'borderColor', 'borderWidth', 'width', 'marginTop', 'marginBottom', 'alignSelf'],
  'accordion': ['itemCount', 'titleFontFamily', 'titleFontSize', 'titleFontWeight', 'contentFontSize', 'titleColor', 'titleBackgroundColor', 'contentBackgroundColor', 'borderColor', 'borderRadius', 'gap'],
  'tabs': ['tabCount', 'tabFontFamily', 'tabFontSize', 'tabFontWeight', 'contentFontSize', 'tabBackgroundColor', 'tabActiveBackgroundColor', 'tabColor', 'tabActiveColor', 'contentBackgroundColor', 'borderColor'],
  'countdown': ['targetDate', 'expiredMessage', 'digitFontFamily', 'digitColor', 'labelColor', 'digitFontSize', 'labelFontSize', 'separatorStyle', 'backgroundColor'],
  'slideshow': ['slideCount', 'headingFontFamily', 'headingFontSize', 'headingFontWeight', 'textFontSize', 'height', 'slideBackgroundColor', 'arrowColor', 'dotColor', 'dotActiveColor'],
};

// Props skipped by getCSSPropsForProperty (custom CSS handling, not in media queries)
const nonCSSProps = [
  'showComparePrice', 'showQuantity', 'showImage', 'showTitle', 'showPrice', 'showButton',
  'showCount', 'buttonText', 'columns', 'rows', 'buttonColor', 'buttonBackgroundColor',
  'buttonHoverColor', 'buttonHoverBackgroundColor', 'buttonHoverBorderColor', 'buttonHoverAnimation',
  'titleTextAlign', 'priceTextAlign', 'comparePriceColor', 'gradientType', 'gradientAngle',
  'gradientColor1', 'gradientColor2', 'gradientColor3', 'gradientColor4', 'gradientColor5',
  'hideOnMobile', 'hideOnTablet', 'hideOnDesktop', 'positionSticky', 'stickyTop',
  'backgroundVideoOpacity', 'entranceAnimation', 'entranceDelay', 'entranceDuration',
  'itemCount', 'tabCount', 'slideCount', 'targetDate', 'expiredMessage',
  'showDays', 'showHours', 'showMinutes', 'showSeconds', 'autoplay', 'autoplayInterval',
  'showArrows', 'showDots', 'tabBackgroundColor', 'tabActiveBackgroundColor', 'tabColor',
  'tabActiveColor', 'tabFontFamily', 'tabFontSize', 'tabFontWeight', 'contentFontSize',
  'titleFontFamily', 'titleFontSize', 'titleFontWeight', 'titleColor', 'titleBackgroundColor',
  'contentBackgroundColor', 'digitFontFamily', 'digitColor', 'labelColor', 'digitFontSize',
  'labelFontSize', 'separatorStyle', 'headingFontFamily', 'headingFontSize', 'headingFontWeight',
  'textFontSize', 'slideBackgroundColor', 'arrowColor', 'dotColor', 'dotActiveColor',
];

const getAlwaysEnabledResponsiveProps = (type) => {
  const alwaysEnabled = cssAlwaysEnabled[type] || [];
  const responsive = responsivePropsMap[type] || [];
  return responsive.filter(p => alwaysEnabled.includes(p) && !nonCSSProps.includes(p));
};

const getCSSResponsiveProps = (type) => {
  const responsive = responsivePropsMap[type] || [];
  return responsive.filter(p => !nonCSSProps.includes(p) && !p.startsWith('hover'));
};

const cssResponsiveTypes = responsiveTypes.filter(type => getCSSResponsiveProps(type).length > 0);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetIdGenerator();
});

// ===========================================================================
// 1. SCHEMA: 3 settings per responsive prop (mobile/desktop/fullscreen)
// ===========================================================================

describe('Schema: 3 settings per responsive property', () => {

  describe.each(responsiveTypes)('%s', (type) => {
    const props = responsivePropsMap[type];

    test.each(props)('responsive prop "%s" generates 3 breakpoint settings', (propName) => {
      resetIdGenerator();

      const element = makeElement(type, {
        responsiveStyles: makeResponsiveStyle(propName),
        schemaToggles: { [propName]: true },
      });

      const settings = generateElementSchemaSettings(element);

      const propSettings = settings.filter(
        s => s.id && (
          s.id.endsWith(`_${propName}_mobile`) ||
          s.id.endsWith(`_${propName}_desktop`) ||
          s.id.endsWith(`_${propName}_fullscreen`)
        )
      );

      expect(propSettings).toHaveLength(3);

      SCHEMA_BREAKPOINTS.forEach(bp => {
        const match = propSettings.find(s => s.id.endsWith(`_${propName}_${bp}`));
        expect(match).toBeDefined();
        expect(match.label).toContain(`(${bp})`);
      });
    });

    test.each(props)('responsive prop "%s" setting IDs have breakpoint suffixes', (propName) => {
      resetIdGenerator();

      const element = makeElement(type, {
        responsiveStyles: makeResponsiveStyle(propName),
        schemaToggles: { [propName]: true },
      });

      const settings = generateElementSchemaSettings(element);

      SCHEMA_BREAKPOINTS.forEach(bp => {
        const match = settings.find(s => s.id && s.id.endsWith(`_${propName}_${bp}`));
        expect(match).toBeDefined();
      });
    });

    test.each(props)('responsive prop "%s" reads defaults from viewport keys (xs→mobile, md→desktop, xl→fullscreen)', (propName) => {
      resetIdGenerator();

      const element = makeElement(type, {
        responsiveStyles: {
          [propName]: { xs: '10px', md: '20px', xl: '30px' },
        },
        schemaToggles: { [propName]: true },
      });

      const settings = generateElementSchemaSettings(element);

      const mobileSetting = settings.find(s => s.id && s.id.endsWith(`_${propName}_mobile`));
      const desktopSetting = settings.find(s => s.id && s.id.endsWith(`_${propName}_desktop`));
      const fullscreenSetting = settings.find(s => s.id && s.id.endsWith(`_${propName}_fullscreen`));

      expect(mobileSetting.default).toBe('10px');
      expect(desktopSetting.default).toBe('20px');
      expect(fullscreenSetting.default).toBe('30px');
    });
  });
});

// ===========================================================================
// 2. CSS: 5 viewport media queries
// ===========================================================================

describe('CSS: 5 viewport media queries', () => {

  describe.each(cssResponsiveTypes)('%s', (type) => {

    test('generates all 4 media queries (xs, sm, lg, xl) when all viewports have values', () => {
      const element = makeElement(type, {
        responsiveStyles: makeAllFullResponsiveStyles(type),
        schemaToggles: makeAllToggles(type),
      });

      const css = generateElementCSS(element, 'section-test');

      expect(css).toContain(MEDIA_QUERIES.xs);
      expect(css).toContain(MEDIA_QUERIES.sm);
      expect(css).toContain(MEDIA_QUERIES.lg);
      expect(css).toContain(MEDIA_QUERIES.xl);
    });

    test('element selector appears inside each media query', () => {
      const element = makeElement(type, {
        responsiveStyles: makeAllFullResponsiveStyles(type),
        schemaToggles: makeAllToggles(type),
      });

      const css = generateElementCSS(element, 'section-test');

      Object.values(MEDIA_QUERIES).forEach(mq => {
        const block = css.split(mq)[1];
        if (block) {
          expect(block).toContain(`[data-element-id="${element.id}"]`);
        }
      });
    });
  });
});

// ===========================================================================
// 3. CSS: Liquid vars in xs/xl, hardcoded in sm/lg
// ===========================================================================

describe('CSS: Liquid variables only in schema-mapped viewports (xs→mobile, xl→fullscreen)', () => {

  const typesWithAlwaysEnabledResponsive = responsiveTypes.filter(
    type => getAlwaysEnabledResponsiveProps(type).length > 0
  );

  describe.each(typesWithAlwaysEnabledResponsive)('%s', (type) => {
    const alwaysEnabledResponsive = getAlwaysEnabledResponsiveProps(type);

    test.each(alwaysEnabledResponsive)(
      'always-enabled responsive prop "%s" uses Liquid vars in xs (→mobile) and xl (→fullscreen)',
      (propName) => {
        resetIdGenerator();

        const element = makeElement(type, {
          responsiveStyles: makeFullResponsiveStyle(propName),
          schemaToggles: {},
        });

        const css = generateElementCSS(element, 'section-test');

        // xs maps to schema 'mobile' — should have Liquid var
        expect(css).toContain(`_${propName}_mobile`);
        // xl maps to schema 'fullscreen' — should have Liquid var
        expect(css).toContain(`_${propName}_fullscreen`);
        expect(css).toContain('{{ section.settings.');
      }
    );
  });
});

describe('CSS: sm and lg viewports use hardcoded values (no Liquid vars)', () => {

  test('sm media query contains hardcoded value, not Liquid var', () => {
    resetIdGenerator();

    const element = makeElement('container', {
      responsiveStyles: {
        paddingTop: { xs: '8px', sm: '12px', md: '20px', lg: '28px', xl: '36px' },
      },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');

    const smMatch = css.match(/@media \(min-width: 576px\) and \(max-width: 767px\)\s*\{[\s\S]*?\n\}/);
    expect(smMatch).not.toBeNull();
    expect(smMatch[0]).toContain('padding-top: 12px');
    expect(smMatch[0]).not.toContain('section.settings.');
  });

  test('lg media query contains hardcoded value, not Liquid var', () => {
    resetIdGenerator();

    const element = makeElement('container', {
      responsiveStyles: {
        paddingTop: { xs: '8px', sm: '12px', md: '20px', lg: '28px', xl: '36px' },
      },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');

    const lgMatch = css.match(/@media \(min-width: 992px\) and \(max-width: 1199px\)\s*\{[\s\S]*?\n\}/);
    expect(lgMatch).not.toBeNull();
    expect(lgMatch[0]).toContain('padding-top: 28px');
    expect(lgMatch[0]).not.toContain('section.settings.');
  });

  test('xs media query uses Liquid var (maps to schema mobile)', () => {
    resetIdGenerator();

    const element = makeElement('container', {
      responsiveStyles: {
        paddingTop: { xs: '8px', sm: '12px', md: '20px', lg: '28px', xl: '36px' },
      },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');

    const xsMatch = css.match(/@media \(max-width: 575px\)\s*\{[\s\S]*?\n\}/);
    expect(xsMatch).not.toBeNull();
    expect(xsMatch[0]).toContain('section.settings.');
    expect(xsMatch[0]).toContain('_paddingTop_mobile');
  });

  test('xl media query uses Liquid var (maps to schema fullscreen)', () => {
    resetIdGenerator();

    const element = makeElement('container', {
      responsiveStyles: {
        paddingTop: { xs: '8px', sm: '12px', md: '20px', lg: '28px', xl: '36px' },
      },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');

    const xlMatch = css.match(/@media \(min-width: 1200px\)\s*\{[\s\S]*?\n\}/);
    expect(xlMatch).not.toBeNull();
    expect(xlMatch[0]).toContain('section.settings.');
    expect(xlMatch[0]).toContain('_paddingTop_fullscreen');
  });
});

// ===========================================================================
// 4. Schema: non-responsive props generate single setting (no suffix)
// ===========================================================================

describe('Schema: non-responsive properties generate single setting without breakpoint suffix', () => {

  const typesWithNonResponsive = Object.entries(elementDefinitions)
    .filter(([, def]) =>
      (def.styleProps || []).some(p => !p.responsive && p.canBeSchemaEditable)
    )
    .map(([type]) => type);

  test.each(typesWithNonResponsive)('%s non-responsive prop generates 1 setting', (type) => {
    resetIdGenerator();

    const def = elementDefinitions[type];
    const nonResponsiveProp = def.styleProps.find(p => !p.responsive && p.canBeSchemaEditable);
    if (!nonResponsiveProp) return;

    const element = makeElement(type, {
      style: { [nonResponsiveProp.name]: 'test-value' },
      schemaToggles: { [nonResponsiveProp.name]: true },
    });

    const settings = generateElementSchemaSettings(element);

    const propSettings = settings.filter(
      s => s.label && s.label === nonResponsiveProp.label
    );

    expect(propSettings).toHaveLength(1);
    expect(propSettings[0].label).not.toContain('(mobile)');
    expect(propSettings[0].label).not.toContain('(desktop)');
    expect(propSettings[0].label).not.toContain('(fullscreen)');

    expect(propSettings[0].id).not.toMatch(/_mobile$/);
    expect(propSettings[0].id).not.toMatch(/_desktop$/);
    expect(propSettings[0].id).not.toMatch(/_fullscreen$/);
  });
});

// ===========================================================================
// 5. Edge cases
// ===========================================================================

describe('Edge cases: partial viewports', () => {

  test('element with only xs value generates xs media query', () => {
    const element = makeElement('container', {
      responsiveStyles: { paddingTop: { xs: '5px' } },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');
    expect(css).toContain(MEDIA_QUERIES.xs);
  });

  test('element with only xl value generates xl media query', () => {
    const element = makeElement('container', {
      responsiveStyles: { paddingTop: { xl: '50px' } },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');
    expect(css).toContain(MEDIA_QUERIES.xl);
  });

  test('element with only sm value generates sm media query (hardcoded)', () => {
    const element = makeElement('container', {
      responsiveStyles: { paddingTop: { sm: '15px' } },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');
    expect(css).toContain(MEDIA_QUERIES.sm);
  });

  test('element with only lg value generates lg media query (hardcoded)', () => {
    const element = makeElement('container', {
      responsiveStyles: { paddingTop: { lg: '25px' } },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');
    expect(css).toContain(MEDIA_QUERIES.lg);
  });

  test('element with xs + xl but no md generates both outer media queries', () => {
    const element = makeElement('container', {
      responsiveStyles: { paddingTop: { xs: '5px', xl: '50px' } },
      schemaToggles: { paddingTop: true },
    });

    const css = generateElementCSS(element, 'section-test');
    expect(css).toContain(MEDIA_QUERIES.xs);
    expect(css).toContain(MEDIA_QUERIES.xl);
  });

  test('schema still generates 3 settings even when only xs viewport has a value', () => {
    const element = makeElement('container', {
      responsiveStyles: { paddingTop: { xs: '5px' } },
      schemaToggles: { paddingTop: true },
    });

    const settings = generateElementSchemaSettings(element);
    const paddingSettings = settings.filter(s => s.label && s.label.includes('Padding Top'));
    expect(paddingSettings).toHaveLength(3);
  });

  test('schema reads sm as fallback for mobile when xs is absent', () => {
    const element = makeElement('container', {
      responsiveStyles: { paddingTop: { sm: '15px', md: '20px', xl: '30px' } },
      schemaToggles: { paddingTop: true },
    });

    const settings = generateElementSchemaSettings(element);
    const mobileSetting = settings.find(s => s.id && s.id.endsWith('_paddingTop_mobile'));
    // sm is fallback for mobile schema setting
    expect(mobileSetting.default).toBe('15px');
  });

  test('schema reads lg as fallback for desktop when md is absent', () => {
    const element = makeElement('container', {
      responsiveStyles: { paddingTop: { xs: '10px', lg: '25px', xl: '30px' } },
      schemaToggles: { paddingTop: true },
    });

    const settings = generateElementSchemaSettings(element);
    const desktopSetting = settings.find(s => s.id && s.id.endsWith('_paddingTop_desktop'));
    // lg is fallback for desktop schema setting
    expect(desktopSetting.default).toBe('25px');
  });

  test('multiple responsive props in same xs media query block', () => {
    const element = makeElement('container', {
      responsiveStyles: {
        paddingTop: { xs: '5px', md: '10px', xl: '20px' },
        paddingBottom: { xs: '8px', md: '16px', xl: '24px' },
        maxWidth: { xs: '100%', md: '800px', xl: '1200px' },
      },
      schemaToggles: { paddingTop: true, paddingBottom: true, maxWidth: true },
    });

    const css = generateElementCSS(element, 'section-test');

    const xsMatch = css.match(/@media \(max-width: 575px\)\s*\{[\s\S]*?\n\}/);
    expect(xsMatch).not.toBeNull();
    const xsBlock = xsMatch[0];
    expect(xsBlock).toContain('padding-top');
    expect(xsBlock).toContain('padding-bottom');
    expect(xsBlock).toContain('max-width');
  });

  test('non-schema-toggled responsive prop with value still generates CSS', () => {
    const element = makeElement('container', {
      responsiveStyles: {
        paddingTop: { xs: '5px', md: '10px', xl: '20px' },
      },
      schemaToggles: {},
    });

    const css = generateElementCSS(element, 'section-test');
    expect(css).toContain(MEDIA_QUERIES.xs);
    expect(css).toContain('padding-top');
  });

  test('non-responsive prop value does not appear in media queries', () => {
    const element = makeElement('container', {
      style: { backgroundColor: '#ff0000' },
      responsiveStyles: {},
      schemaToggles: { backgroundColor: true },
    });

    const css = generateElementCSS(element, 'section-test');

    expect(css).toContain('background-color');
    expect(css).not.toContain('_backgroundColor_mobile');
    expect(css).not.toContain('_backgroundColor_fullscreen');
  });
});

// ===========================================================================
// 6. Count validation
// ===========================================================================

describe('Responsive property count validation', () => {

  test('responsivePropsMap covers all element types with responsive props', () => {
    expect(responsiveTypes.length).toBeGreaterThan(0);

    responsiveTypes.forEach(type => {
      expect(elementDefinitions[type]).toBeDefined();
    });
  });

  test('total responsive property count across all types matches definitions', () => {
    let totalFromMap = 0;
    Object.values(responsivePropsMap).forEach(props => {
      totalFromMap += props.length;
    });

    let totalFromDefs = 0;
    Object.entries(elementDefinitions).forEach(([, def]) => {
      (def.styleProps || []).forEach(p => {
        if (p.responsive) totalFromDefs++;
      });
    });

    expect(totalFromMap).toBe(totalFromDefs);
    expect(totalFromMap).toBeGreaterThanOrEqual(200);
  });
});
