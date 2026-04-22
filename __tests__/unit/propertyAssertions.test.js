import { generateElementCSS } from '@/app/_utils/cssGeneration';
import { generateElementSchemaSettings } from '@/app/_utils/schemaGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

beforeEach(() => {
  resetIdGenerator();
});

// ============================================================================
// 1. CSS PROPERTY GENERATION TESTS
// ============================================================================

describe('CSS Property Generation', () => {

  // --------------------------------------------------------------------------
  // CONTAINER
  // --------------------------------------------------------------------------
  describe('container element', () => {
    const makeContainer = (style = {}, schemaToggles = {}) => ({
      id: 'container-001',
      type: 'container',
      style,
      schemaToggles,
    });

    test('always-enabled properties generate Liquid variables in base CSS', () => {
      const element = makeContainer({
        backgroundColor: '#ffffff',
        paddingTop: '20px',
        paddingBottom: '10px',
        paddingLeft: '15px',
        paddingRight: '15px',
        marginTop: '5px',
        marginBottom: '5px',
        maxWidth: '1200px',
      });

      const css = generateElementCSS(element, 'section-id');

      // Selector format
      expect(css).toContain('#section-id-{{ section.id }}');
      expect(css).toContain('[data-element-id="container-001"]');

      // Always-enabled props become Liquid variables with kebab-case CSS props
      expect(css).toContain('background-color: {{ section.settings.');
      expect(css).toContain('padding-top: {{ section.settings.');
      expect(css).toContain('padding-bottom: {{ section.settings.');
      expect(css).toContain('padding-left: {{ section.settings.');
      expect(css).toContain('padding-right: {{ section.settings.');
      expect(css).toContain('margin-top: {{ section.settings.');
      expect(css).toContain('margin-bottom: {{ section.settings.');
      expect(css).toContain('max-width: {{ section.settings.');
    });

    test('display, justifyContent, alignItems generate Liquid variables', () => {
      const element = makeContainer({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      });

      const css = generateElementCSS(element, 'section-id');

      // display, justifyContent, alignItems are always-enabled and responsive
      // Desktop breakpoint is used in base selector
      expect(css).toContain('display: {{ section.settings.');
      expect(css).toContain('justify-content: {{ section.settings.');
      expect(css).toContain('align-items: {{ section.settings.');
    });

    test('gradient CSS generates linear-gradient when gradientType is always-enabled', () => {
      const element = makeContainer({
        gradientType: 'linear',
        gradientAngle: '135',
        gradientColor1: '#667eea',
        gradientColor2: '#764ba2',
      });

      const css = generateElementCSS(element, 'section-id');

      // Gradient block should exist since gradientType is always-enabled for container
      expect(css).toContain('linear-gradient(');
      expect(css).toContain("{% if");
      expect(css).toContain("== 'linear' %}");
    });

    test('gradient CSS generates radial-gradient block', () => {
      const element = makeContainer({
        gradientType: 'radial',
        gradientColor1: '#ff0000',
        gradientColor2: '#0000ff',
      });

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain("{% elsif");
      expect(css).toContain("== 'radial' %}");
      expect(css).toContain('radial-gradient(circle,');
    });

    test('responsive properties generate mobile media query', () => {
      const element = makeContainer({
        paddingTop: '20px',
      });
      element.responsiveStyles = {
        paddingTop: { xs: '10px', md: '20px', xl: '30px' },
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('@media (max-width: 575px)');
      expect(css).toContain('@media (min-width: 1200px)');
    });

    test('responsive properties generate fullscreen media query', () => {
      const element = makeContainer({
        marginTop: '20px',
      });
      element.responsiveStyles = {
        marginTop: { xs: '5px', md: '20px', xl: '40px' },
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('@media (min-width: 1200px)');
    });
  });

  // --------------------------------------------------------------------------
  // HEADING
  // --------------------------------------------------------------------------
  describe('heading element', () => {
    const makeHeading = (style = {}, schemaToggles = {}) => ({
      id: 'heading-001',
      type: 'heading',
      props: { text: 'Test Heading' },
      style,
      schemaToggles,
    });

    test('always-enabled typography props generate Liquid variables', () => {
      const element = makeHeading({
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
        lineHeight: '1.5',
      });

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('font-family: {{ section.settings.');
      expect(css).toContain('font-weight: {{ section.settings.');
      expect(css).toContain('text-align: {{ section.settings.');
      expect(css).toContain('color: {{ section.settings.');
      expect(css).toContain('line-height: {{ section.settings.');
      // fontSize is responsive, should appear in base (desktop) and media queries
      expect(css).toContain('font-size: {{ section.settings.');
    });

    test('letterSpacing and textTransform generate Liquid variables', () => {
      const element = makeHeading({
        letterSpacing: '2px',
        textTransform: 'uppercase',
      });

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('letter-spacing: {{ section.settings.');
      expect(css).toContain('text-transform: {{ section.settings.');
    });

    test('marginTop and marginBottom generate Liquid variables', () => {
      const element = makeHeading({
        marginTop: '10px',
        marginBottom: '20px',
      });

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('margin-top: {{ section.settings.');
      expect(css).toContain('margin-bottom: {{ section.settings.');
    });
  });

  // --------------------------------------------------------------------------
  // TEXT
  // --------------------------------------------------------------------------
  describe('text element', () => {
    const makeText = (style = {}, schemaToggles = {}) => ({
      id: 'text-001',
      type: 'text',
      props: { text: 'Some text' },
      style,
      schemaToggles,
    });

    test('always-enabled text style props generate Liquid variables', () => {
      // Note: text element does NOT have textAlign in its styleProps definition,
      // so it won't appear in CSS even though it's in alwaysEnabledProperties
      const element = makeText({
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
        fontWeight: '400',
        color: '#555555',
        lineHeight: '1.6',
      });

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('font-family: {{ section.settings.');
      expect(css).toContain('font-size: {{ section.settings.');
      expect(css).toContain('font-weight: {{ section.settings.');
      expect(css).toContain('color: {{ section.settings.');
      expect(css).toContain('line-height: {{ section.settings.');
    });

    test('marginTop and marginBottom are always-enabled', () => {
      const element = makeText({
        marginTop: '10px',
        marginBottom: '15px',
      });

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('margin-top: {{ section.settings.');
      expect(css).toContain('margin-bottom: {{ section.settings.');
    });
  });

  // --------------------------------------------------------------------------
  // BUTTON
  // --------------------------------------------------------------------------
  describe('button element', () => {
    const makeButton = (style = {}, schemaToggles = {}) => ({
      id: 'button-001',
      type: 'button',
      props: { text: 'Click me', url: '#' },
      style,
      schemaToggles,
    });

    test('always-enabled button style props generate Liquid variables', () => {
      const element = makeButton({
        fontFamily: 'inherit',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#ffffff',
        backgroundColor: '#000000',
        borderRadius: '4px',
        border: 'none',
      });

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('font-family: {{ section.settings.');
      expect(css).toContain('font-size: {{ section.settings.');
      expect(css).toContain('font-weight: {{ section.settings.');
      expect(css).toContain('color: {{ section.settings.');
      expect(css).toContain('background-color: {{ section.settings.');
      expect(css).toContain('border-radius: {{ section.settings.');
      expect(css).toContain('border: {{ section.settings.');
    });

    test('hover styles generate :hover block with Liquid variables', () => {
      const element = makeButton({
        hoverBackgroundColor: '#333333',
        hoverColor: '#eeeeee',
      });

      const css = generateElementCSS(element, 'section-id');

      // Hover properties are always-enabled for button
      expect(css).toContain(':hover');
      expect(css).toContain('background-color: {{ section.settings.');
      expect(css).toContain('color: {{ section.settings.');
      // transition should be present for hover
      expect(css).toContain('transition: all 0.3s ease');
    });

    test('hover block includes Liquid variables for hoverBackgroundColor and hoverColor', () => {
      const element = makeButton({
        backgroundColor: '#007bff',
        color: '#ffffff',
        hoverBackgroundColor: '#0056b3',
        hoverColor: '#ffffff',
      });

      const css = generateElementCSS(element, 'section-id');

      // The :hover block should contain both hover properties as Liquid variables
      // Extract everything after ":hover" to check its contents
      const hoverIndex = css.indexOf(':hover');
      expect(hoverIndex).toBeGreaterThan(-1);
      const hoverSection = css.substring(hoverIndex);

      expect(hoverSection).toContain('background-color: {{ section.settings.');
      expect(hoverSection).toContain('color: {{ section.settings.');
    });
  });

  // --------------------------------------------------------------------------
  // DIVIDER
  // --------------------------------------------------------------------------
  describe('divider element', () => {
    const makeDivider = (style = {}, schemaToggles = {}) => ({
      id: 'divider-001',
      type: 'divider',
      style,
      schemaToggles,
    });

    test('always-enabled divider props generate Liquid variables in dedicated divider CSS', () => {
      const element = makeDivider({
        borderStyle: 'solid',
        borderColor: '#e0e0e0',
        borderWidth: '1px',
        width: '100%',
        marginTop: '20px',
        marginBottom: '20px',
      });

      const css = generateElementCSS(element, 'section-id');

      // Divider uses special CSS generation (border-top shorthand)
      expect(css).toContain('border-top:');
      expect(css).toContain('{{ section.settings.');
      expect(css).toContain('width:');
      expect(css).toContain('margin-top:');
      expect(css).toContain('margin-bottom:');
      expect(css).toContain('align-self:');
    });
  });

  // --------------------------------------------------------------------------
  // IMAGE
  // --------------------------------------------------------------------------
  describe('image element', () => {
    const makeImage = (style = {}, schemaToggles = {}) => ({
      id: 'image-001',
      type: 'image',
      props: { src: 'test.jpg' },
      style,
      schemaToggles,
    });

    test('always-enabled image style props generate Liquid variables', () => {
      const element = makeImage({
        width: '100%',
        height: 'auto',
        maxWidth: '600px',
        objectFit: 'cover',
        borderRadius: '8px',
      });

      const css = generateElementCSS(element, 'section-id');

      // width, height, maxWidth are responsive + always-enabled
      expect(css).toContain('{{ section.settings.');
      expect(css).toContain('object-fit: {{ section.settings.');
      expect(css).toContain('border-radius: {{ section.settings.');
    });

    test('opacity generates Liquid variable when always-enabled', () => {
      const element = makeImage({
        opacity: '0.8',
      });

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('opacity: {{ section.settings.');
    });
  });

  // --------------------------------------------------------------------------
  // ICON
  // --------------------------------------------------------------------------
  describe('icon element', () => {
    const makeIcon = (style = {}, schemaToggles = {}) => ({
      id: 'icon-001',
      type: 'icon',
      props: { src: null },
      style,
      schemaToggles,
    });

    test('iconSize generates width and height Liquid variables', () => {
      const element = makeIcon({
        iconSize: '48px',
      });

      const css = generateElementCSS(element, 'section-id');

      // iconSize is always-enabled and maps to width+height
      expect(css).toContain('width: {{ section.settings.');
      expect(css).toContain('height: {{ section.settings.');
    });

    test('iconColor generates Liquid variable', () => {
      const element = makeIcon({
        iconColor: '#ff0000',
      });

      const css = generateElementCSS(element, 'section-id');

      // iconColor is always-enabled for icon but is in the skip list for CSS
      // (it's in the non-CSS content properties skip list)
      // Actually let's check - iconColor is NOT in the skip list, so it should generate
      expect(css).toContain('{{ section.settings.');
    });
  });

  // --------------------------------------------------------------------------
  // CSS SELECTOR FORMAT
  // --------------------------------------------------------------------------
  describe('CSS selector format', () => {
    test('selector uses #sectionId-{{ section.id }} pattern', () => {
      const element = {
        id: 'elem-abc',
        type: 'heading',
        style: { color: '#000' },
        schemaToggles: {},
      };

      const css = generateElementCSS(element, 'my-section');

      expect(css).toContain('#my-section-{{ section.id }} [data-element-id="elem-abc"]');
    });
  });

  // --------------------------------------------------------------------------
  // LIQUID VARIABLE PATTERNS
  // --------------------------------------------------------------------------
  describe('Liquid variable patterns', () => {
    test('setting IDs follow s_xxx_counter_propName format', () => {
      const element = {
        id: 'test-123',
        type: 'heading',
        style: { color: '#000' },
        schemaToggles: {},
      };

      const css = generateElementCSS(element, 'section-id');

      // Setting ID pattern: s_{timestamp}_{counter}_{propName}
      const settingPattern = /\{\{ section\.settings\.(s_[a-z0-9]+_[a-z0-9]+_\w+) \}\}/;
      expect(css).toMatch(settingPattern);
    });

    test('responsive properties include breakpoint suffix in setting ID', () => {
      const element = {
        id: 'resp-test',
        type: 'container',
        style: { paddingTop: '20px' },
        responsiveStyles: {
          paddingTop: { xs: '10px', md: '20px', xl: '30px' },
        },
        schemaToggles: {},
      };

      const css = generateElementCSS(element, 'section-id');

      // Desktop in base selector
      expect(css).toContain('_paddingTop_desktop');
      // Mobile in @media (max-width: 767px)
      expect(css).toContain('_paddingTop_mobile');
      // Fullscreen in @media (min-width: 1200px)
      expect(css).toContain('_paddingTop_fullscreen');
    });
  });
});

// ============================================================================
// 2. SCHEMA SETTING GENERATION TESTS
// ============================================================================

describe('Schema Setting Generation', () => {

  // --------------------------------------------------------------------------
  // HEADING SCHEMA
  // --------------------------------------------------------------------------
  describe('heading element', () => {
    test('generates header with element display name', () => {
      const element = {
        id: 'heading-001',
        type: 'heading',
        props: { text: 'My Heading' },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      expect(settings[0]).toEqual({
        type: 'header',
        content: expect.stringContaining('Heading'),
      });
    });

    test('generates text content setting as textarea', () => {
      const element = {
        id: 'heading-001',
        type: 'heading',
        props: { text: 'Hello World' },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const textSetting = settings.find(s => s.label === 'Heading Text');

      expect(textSetting).toBeDefined();
      expect(textSetting.type).toBe('textarea');
      expect(textSetting.default).toBe('Hello World');
      expect(textSetting.id).toMatch(/^s_/);
    });

    test('generates tag setting as select with h2-h6 options', () => {
      const element = {
        id: 'heading-001',
        type: 'heading',
        props: { text: 'Test', tag: 'h3' },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const tagSetting = settings.find(s => s.label === 'Heading Level');

      expect(tagSetting).toBeDefined();
      expect(tagSetting.type).toBe('select');
      expect(tagSetting.default).toBe('h3');
      expect(tagSetting.options).toEqual(
        expect.arrayContaining([
          { value: 'h2', label: 'h2' },
          { value: 'h3', label: 'h3' },
          { value: 'h4', label: 'h4' },
          { value: 'h5', label: 'h5' },
          { value: 'h6', label: 'h6' },
        ])
      );
    });

    test('generates style settings for always-enabled typography props', () => {
      const element = {
        id: 'heading-001',
        type: 'heading',
        props: { text: 'Test' },
        style: {
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#333',
        },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      const fontFamilySetting = settings.find(s => s.label === 'Font Family');
      expect(fontFamilySetting).toBeDefined();
      expect(fontFamilySetting.type).toBe('select');
      // fontFamily uses controlType: 'dropdown' which does not add options in schema generation
      // (only 'select' and 'button-group' controlTypes add options)

      const colorSetting = settings.find(s => s.label === 'Text Color');
      expect(colorSetting).toBeDefined();
      expect(colorSetting.type).toBe('color');

      const fontWeightSetting = settings.find(s => s.label === 'Font Weight');
      expect(fontWeightSetting).toBeDefined();
      expect(fontWeightSetting.type).toBe('select');
    });

    test('responsive props generate 3 settings (mobile, desktop, fullscreen)', () => {
      const element = {
        id: 'heading-001',
        type: 'heading',
        props: { text: 'Test' },
        style: { fontSize: '24px' },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      // fontSize is responsive and always-enabled for heading
      const fontSizeSettings = settings.filter(s => s.label && s.label.startsWith('Font Size'));
      expect(fontSizeSettings.length).toBe(3);
      expect(fontSizeSettings.map(s => s.label)).toEqual(
        expect.arrayContaining([
          'Font Size (mobile)',
          'Font Size (desktop)',
          'Font Size (fullscreen)',
        ])
      );
    });
  });

  // --------------------------------------------------------------------------
  // TEXT SCHEMA
  // --------------------------------------------------------------------------
  describe('text element', () => {
    test('generates text content setting as textarea', () => {
      const element = {
        id: 'text-001',
        type: 'text',
        props: { text: 'Body text content' },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const textSetting = settings.find(s => s.label === 'Text Content');

      expect(textSetting).toBeDefined();
      expect(textSetting.type).toBe('textarea');
      expect(textSetting.default).toBe('Body text content');
    });

    test('generates style settings for fontFamily, fontSize, color, etc.', () => {
      const element = {
        id: 'text-001',
        type: 'text',
        props: { text: 'Test' },
        style: {
          fontFamily: 'Georgia, serif',
          color: '#555',
        },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      expect(settings.find(s => s.label === 'Font Family')).toBeDefined();
      expect(settings.find(s => s.label === 'Text Color')).toBeDefined();
      // fontSize is responsive, should produce 3 settings
      const fontSizeSettings = settings.filter(s => s.label && s.label.startsWith('Font Size'));
      expect(fontSizeSettings.length).toBe(3);
    });
  });

  // --------------------------------------------------------------------------
  // BUTTON SCHEMA
  // --------------------------------------------------------------------------
  describe('button element', () => {
    test('generates text, url, openInNewTab content settings', () => {
      const element = {
        id: 'button-001',
        type: 'button',
        props: { text: 'Buy Now', url: '/products', openInNewTab: false },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      const textSetting = settings.find(s => s.label === 'Button Text');
      expect(textSetting).toBeDefined();
      expect(textSetting.type).toBe('text');
      expect(textSetting.default).toBe('Buy Now');

      const urlSetting = settings.find(s => s.label === 'URL');
      expect(urlSetting).toBeDefined();
      expect(urlSetting.type).toBe('text');

      const newTabSetting = settings.find(s => s.label === 'Open in New Tab');
      expect(newTabSetting).toBeDefined();
      expect(newTabSetting.type).toBe('checkbox');
    });

    test('generates style settings for always-enabled button props', () => {
      const element = {
        id: 'button-001',
        type: 'button',
        props: { text: 'Click' },
        style: {
          backgroundColor: '#000',
          color: '#fff',
          borderRadius: '4px',
        },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      expect(settings.find(s => s.label === 'Background Color')).toBeDefined();
      expect(settings.find(s => s.label === 'Text Color')).toBeDefined();
      expect(settings.find(s => s.label === 'Border Radius')).toBeDefined();
      expect(settings.find(s => s.label === 'Border')).toBeDefined();
      expect(settings.find(s => s.label === 'Font Family')).toBeDefined();
    });

    test('generates hover style settings', () => {
      const element = {
        id: 'button-001',
        type: 'button',
        props: { text: 'Click' },
        style: { hoverBackgroundColor: '#333', hoverColor: '#eee' },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      expect(settings.find(s => s.label === 'Hover Background')).toBeDefined();
      expect(settings.find(s => s.label === 'Hover Text Color')).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // IMAGE SCHEMA
  // --------------------------------------------------------------------------
  describe('image element', () => {
    test('generates src setting as image_picker', () => {
      const element = {
        id: 'image-001',
        type: 'image',
        props: { src: 'test.jpg' },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const srcSetting = settings.find(s => s.label === 'Image Source');

      expect(srcSetting).toBeDefined();
      expect(srcSetting.type).toBe('image_picker');
      // image_picker doesn't support default
    });

    test('first setting is always a header', () => {
      const element = {
        id: 'image-001',
        type: 'image',
        props: {},
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      expect(settings[0].type).toBe('header');
    });
  });

  // --------------------------------------------------------------------------
  // CONTAINER SCHEMA
  // --------------------------------------------------------------------------
  describe('container element', () => {
    test('generates style-only settings (no content props)', () => {
      const element = {
        id: 'container-001',
        type: 'container',
        props: {},
        style: { backgroundColor: '#f0f0f0' },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      // First is header
      expect(settings[0].type).toBe('header');
      expect(settings[0].content).toContain('Container');

      // backgroundColor is color type
      const bgSetting = settings.find(s => s.label === 'Background Color');
      expect(bgSetting).toBeDefined();
      expect(bgSetting.type).toBe('color');
    });

    test('padding/margin settings are text type (for responsive)', () => {
      const element = {
        id: 'container-001',
        type: 'container',
        props: {},
        style: { paddingTop: '20px', marginTop: '10px' },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      // paddingTop is responsive, so 3 settings
      const ptSettings = settings.filter(s => s.label && s.label.startsWith('Padding Top'));
      expect(ptSettings.length).toBe(3);
      ptSettings.forEach(s => {
        expect(s.type).toBe('text');
      });
    });

    test('display/justifyContent/alignItems generate select settings when toggled on', () => {
      // display, justifyContent, alignItems are NOT in schema generation's
      // alwaysEnabledProperties for container (only in CSS generation's).
      // They must be explicitly toggled on via schemaToggles.
      const element = {
        id: 'container-001',
        type: 'container',
        props: {},
        style: { display: 'flex', justifyContent: 'center', alignItems: 'stretch' },
        schemaToggles: { display: true, justifyContent: true, alignItems: true },
      };

      const settings = generateElementSchemaSettings(element);

      // These are responsive, so each generates 3 settings
      const displaySettings = settings.filter(s => s.label && s.label.startsWith('Display'));
      expect(displaySettings.length).toBe(3);
      displaySettings.forEach(s => {
        expect(s.type).toBe('select');
        expect(s.options).toEqual(
          expect.arrayContaining([
            { value: 'block', label: 'block' },
            { value: 'flex', label: 'flex' },
          ])
        );
      });
    });
  });

  // --------------------------------------------------------------------------
  // ACCORDION SCHEMA
  // --------------------------------------------------------------------------
  describe('accordion element', () => {
    test('generates itemCount as range setting', () => {
      const element = {
        id: 'accordion-001',
        type: 'accordion',
        props: { itemCount: 3 },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const itemCountSetting = settings.find(s => s.label === 'Number of Items');

      expect(itemCountSetting).toBeDefined();
      expect(itemCountSetting.type).toBe('range');
      expect(itemCountSetting.min).toBe(1);
      expect(itemCountSetting.max).toBe(8);
      expect(itemCountSetting.step).toBe(1);
      expect(itemCountSetting.default).toBe(3);
    });

    test('generates dynamic panelTitle_N and panelContent_N settings', () => {
      const element = {
        id: 'accordion-001',
        type: 'accordion',
        props: {
          itemCount: 3,
          panelTitle_1: 'Question 1',
          panelContent_1: 'Answer 1',
          panelTitle_2: 'Question 2',
          panelContent_2: 'Answer 2',
        },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      const title1 = settings.find(s => s.label === 'Panel 1 Title');
      expect(title1).toBeDefined();
      expect(title1.type).toBe('text');
      expect(title1.default).toBe('Question 1');

      const content1 = settings.find(s => s.label === 'Panel 1 Content');
      expect(content1).toBeDefined();
      expect(content1.type).toBe('textarea');

      // Should have panelTitle and panelContent for multiple panels
      const title2 = settings.find(s => s.label === 'Panel 2 Title');
      expect(title2).toBeDefined();
    });

    test('generates style settings for title typography and colors', () => {
      const element = {
        id: 'accordion-001',
        type: 'accordion',
        props: {},
        style: {
          titleColor: '#333',
          titleBackgroundColor: '#f8f9fa',
          borderColor: '#dee2e6',
          borderRadius: '8px',
          gap: '8px',
        },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      expect(settings.find(s => s.label === 'Title Color')).toBeDefined();
      expect(settings.find(s => s.label === 'Title Background')).toBeDefined();
      expect(settings.find(s => s.label === 'Border Color')).toBeDefined();
      expect(settings.find(s => s.label === 'Border Radius')).toBeDefined();
      expect(settings.find(s => s.label === 'Gap Between Items')).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // FORM SCHEMA
  // --------------------------------------------------------------------------
  describe('form element', () => {
    test('generates showName, showEmail, showPhone, showMessage as checkbox settings', () => {
      const element = {
        id: 'form-001',
        type: 'form',
        props: {
          showName: true,
          showEmail: true,
          showPhone: false,
          showMessage: true,
        },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      const showName = settings.find(s => s.label === 'Show Name Field');
      expect(showName).toBeDefined();
      expect(showName.type).toBe('checkbox');
      expect(showName.default).toBe(true);

      const showEmail = settings.find(s => s.label === 'Show Email Field');
      expect(showEmail).toBeDefined();
      expect(showEmail.type).toBe('checkbox');

      const showPhone = settings.find(s => s.label === 'Show Phone Field');
      expect(showPhone).toBeDefined();
      expect(showPhone.type).toBe('checkbox');

      const showMessage = settings.find(s => s.label === 'Show Message Field');
      expect(showMessage).toBeDefined();
      expect(showMessage.type).toBe('checkbox');
    });

    test('generates submitText and placeholder settings', () => {
      const element = {
        id: 'form-001',
        type: 'form',
        props: {
          submitText: 'Send',
          namePlaceholder: 'Name',
          emailPlaceholder: 'Email',
        },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      const submitText = settings.find(s => s.label === 'Submit Button Text');
      expect(submitText).toBeDefined();
      expect(submitText.type).toBe('text');
      expect(submitText.default).toBe('Send');

      expect(settings.find(s => s.label === 'Name Placeholder')).toBeDefined();
      expect(settings.find(s => s.label === 'Email Placeholder')).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // COUNTDOWN SCHEMA
  // --------------------------------------------------------------------------
  describe('countdown element', () => {
    test('generates targetDate setting', () => {
      const element = {
        id: 'countdown-001',
        type: 'countdown',
        props: { targetDate: '2026-12-31T00:00:00' },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const targetDateSetting = settings.find(s => s.label === 'Target Date (ISO)');

      expect(targetDateSetting).toBeDefined();
      expect(targetDateSetting.type).toBe('text');
      expect(targetDateSetting.default).toBe('2026-12-31T00:00:00');
    });

    test('generates expiredMessage setting', () => {
      const element = {
        id: 'countdown-001',
        type: 'countdown',
        props: { expiredMessage: 'Time is up!' },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const expiredSetting = settings.find(s => s.label === 'Expired Message');

      expect(expiredSetting).toBeDefined();
      expect(expiredSetting.type).toBe('text');
      expect(expiredSetting.default).toBe('Time is up!');
    });

    test('generates show/hide checkbox settings for days, hours, minutes, seconds', () => {
      const element = {
        id: 'countdown-001',
        type: 'countdown',
        props: { showDays: true, showHours: true, showMinutes: true, showSeconds: true },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      expect(settings.find(s => s.label === 'Show Days')?.type).toBe('checkbox');
      expect(settings.find(s => s.label === 'Show Hours')?.type).toBe('checkbox');
      expect(settings.find(s => s.label === 'Show Minutes')?.type).toBe('checkbox');
      expect(settings.find(s => s.label === 'Show Seconds')?.type).toBe('checkbox');
    });
  });

  // --------------------------------------------------------------------------
  // PROGRESS-BAR SCHEMA
  // --------------------------------------------------------------------------
  describe('progress-bar element', () => {
    test('generates percentage as range setting', () => {
      const element = {
        id: 'progress-001',
        type: 'progress-bar',
        props: { percentage: 75 },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const percentageSetting = settings.find(s => s.label === 'Percentage');

      expect(percentageSetting).toBeDefined();
      expect(percentageSetting.type).toBe('range');
      expect(percentageSetting.min).toBe(0);
      expect(percentageSetting.max).toBe(100);
      expect(percentageSetting.step).toBe(1);
      expect(percentageSetting.default).toBe(75);
    });

    test('generates label, showPercentage, showLabel settings', () => {
      const element = {
        id: 'progress-001',
        type: 'progress-bar',
        props: {
          label: 'Skills',
          showPercentage: true,
          showLabel: true,
        },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      const labelSetting = settings.find(s => s.label === 'Label');
      expect(labelSetting).toBeDefined();
      expect(labelSetting.type).toBe('text');
      expect(labelSetting.default).toBe('Skills');

      const showPctSetting = settings.find(s => s.label === 'Show Percentage');
      expect(showPctSetting).toBeDefined();
      expect(showPctSetting.type).toBe('checkbox');

      const showLabelSetting = settings.find(s => s.label === 'Show Label');
      expect(showLabelSetting).toBeDefined();
      expect(showLabelSetting.type).toBe('checkbox');
    });

    test('generates animated checkbox setting', () => {
      const element = {
        id: 'progress-001',
        type: 'progress-bar',
        props: { animated: true },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const animatedSetting = settings.find(s => s.label === 'Animate on Load');

      expect(animatedSetting).toBeDefined();
      expect(animatedSetting.type).toBe('checkbox');
    });

    test('generates style settings for bar and track colors when toggled on', () => {
      // progress-bar is NOT in schema generation's alwaysEnabledProperties
      // Style props only generate schema settings when explicitly toggled
      const element = {
        id: 'progress-001',
        type: 'progress-bar',
        props: {},
        style: {
          barColor: '#000',
          trackColor: '#e9ecef',
          color: '#333',
          borderRadius: '999px',
        },
        schemaToggles: { barColor: true, trackColor: true, color: true, borderRadius: true },
      };

      const settings = generateElementSchemaSettings(element);

      const barColorSetting = settings.find(s => s.label === 'Bar Color');
      expect(barColorSetting).toBeDefined();
      expect(barColorSetting.type).toBe('color');

      const trackColorSetting = settings.find(s => s.label === 'Track Color');
      expect(trackColorSetting).toBeDefined();
      expect(trackColorSetting.type).toBe('color');

      const colorSetting = settings.find(s => s.label === 'Label Color');
      expect(colorSetting).toBeDefined();
      expect(colorSetting.type).toBe('color');
    });

    test('without schemaToggles, progress-bar style props do NOT generate settings', () => {
      // progress-bar is NOT in schema generation's alwaysEnabledProperties
      const element = {
        id: 'progress-002',
        type: 'progress-bar',
        props: {},
        style: { barColor: '#000', trackColor: '#e9ecef' },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      // Only header + content props, no style settings
      const barColorSetting = settings.find(s => s.label === 'Bar Color');
      expect(barColorSetting).toBeUndefined();
    });
  });

  // --------------------------------------------------------------------------
  // SOCIAL-ICONS SCHEMA
  // --------------------------------------------------------------------------
  describe('social-icons element', () => {
    test('generates platform URL settings', () => {
      const element = {
        id: 'social-001',
        type: 'social-icons',
        props: {
          facebook: 'https://facebook.com/test',
          instagram: 'https://instagram.com/test',
          twitter: 'https://x.com/test',
          youtube: '',
          tiktok: '',
          linkedin: '',
          pinterest: '',
        },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      const fbSetting = settings.find(s => s.label === 'Facebook URL');
      expect(fbSetting).toBeDefined();
      expect(fbSetting.type).toBe('text');
      expect(fbSetting.default).toBe('https://facebook.com/test');

      const igSetting = settings.find(s => s.label === 'Instagram URL');
      expect(igSetting).toBeDefined();
      expect(igSetting.type).toBe('text');

      const twSetting = settings.find(s => s.label === 'X (Twitter) URL');
      expect(twSetting).toBeDefined();
      expect(twSetting.type).toBe('text');

      expect(settings.find(s => s.label === 'YouTube URL')).toBeDefined();
      expect(settings.find(s => s.label === 'TikTok URL')).toBeDefined();
      expect(settings.find(s => s.label === 'LinkedIn URL')).toBeDefined();
      expect(settings.find(s => s.label === 'Pinterest URL')).toBeDefined();
    });

    test('generates icon style settings when toggled on', () => {
      // social-icons is NOT in schema generation's alwaysEnabledProperties
      // Style props only generate when explicitly toggled
      const element = {
        id: 'social-001',
        type: 'social-icons',
        props: {},
        style: {
          color: '#333',
          iconSize: '24px',
          gap: '12px',
        },
        schemaToggles: { color: true, iconSize: true, gap: true },
      };

      const settings = generateElementSchemaSettings(element);

      const colorSetting = settings.find(s => s.label === 'Icon Color');
      expect(colorSetting).toBeDefined();
      expect(colorSetting.type).toBe('color');
    });

    test('without schemaToggles, social-icons style props do NOT generate settings', () => {
      const element = {
        id: 'social-002',
        type: 'social-icons',
        props: {},
        style: { color: '#333' },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const colorSetting = settings.find(s => s.label === 'Icon Color');
      expect(colorSetting).toBeUndefined();
    });
  });

  // --------------------------------------------------------------------------
  // COMMON SCHEMA ASSERTIONS
  // --------------------------------------------------------------------------
  describe('common schema assertions', () => {
    test('first setting is always type header for every element type', () => {
      const types = [
        { type: 'heading', props: { text: 'Test' } },
        { type: 'text', props: { text: 'Test' } },
        { type: 'button', props: { text: 'Click' } },
        { type: 'image', props: {} },
        { type: 'container', props: {} },
        { type: 'divider', props: {} },
      ];

      types.forEach(({ type, props }) => {
        resetIdGenerator();
        const element = {
          id: `${type}-test`,
          type,
          props,
          style: {},
          schemaToggles: {},
        };

        const settings = generateElementSchemaSettings(element);
        expect(settings[0].type).toBe('header');
      });
    });

    test('setting IDs match s_xxx_counter_propName pattern', () => {
      const element = {
        id: 'pattern-test',
        type: 'heading',
        props: { text: 'Test' },
        style: { color: '#000' },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const settingsWithIds = settings.filter(s => s.id);

      settingsWithIds.forEach(setting => {
        expect(setting.id).toMatch(/^s_[a-z0-9]+_[a-z0-9]+_\w+$/);
      });
    });

    test('select settings from button-group controlType have options array with value/label objects', () => {
      // Only controlType 'select' and 'button-group' add options to schema settings.
      // controlType 'dropdown' maps to schemaType 'select' but does NOT add options.
      const element = {
        id: 'select-test',
        type: 'heading',
        props: { text: 'Test', tag: 'h2' },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);

      // The 'tag' contentProp uses controlType: 'button-group', schemaType: 'select'
      // so it should have options
      const tagSetting = settings.find(s => s.label === 'Heading Level');
      expect(tagSetting).toBeDefined();
      expect(tagSetting.type).toBe('select');
      expect(tagSetting.options).toBeDefined();
      expect(Array.isArray(tagSetting.options)).toBe(true);
      tagSetting.options.forEach(opt => {
        expect(opt).toHaveProperty('value');
        expect(opt).toHaveProperty('label');
      });
    });

    test('select settings from dropdown controlType do NOT have options', () => {
      // fontFamily uses controlType: 'dropdown' -> schemaType: 'select' but no options added
      const element = {
        id: 'dropdown-test',
        type: 'heading',
        props: { text: 'Test' },
        style: { fontFamily: 'Arial, sans-serif' },
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const fontFamilySetting = settings.find(s => s.label === 'Font Family');

      expect(fontFamilySetting).toBeDefined();
      expect(fontFamilySetting.type).toBe('select');
      // dropdown controlType does not add options to schema settings
      expect(fontFamilySetting.options).toBeUndefined();
    });

    test('range settings have min, max, step', () => {
      const element = {
        id: 'range-test',
        type: 'accordion',
        props: { itemCount: 3 },
        style: {},
        schemaToggles: {},
      };

      const settings = generateElementSchemaSettings(element);
      const rangeSettings = settings.filter(s => s.type === 'range');

      rangeSettings.forEach(setting => {
        expect(setting).toHaveProperty('min');
        expect(setting).toHaveProperty('max');
        expect(setting).toHaveProperty('step');
        expect(typeof setting.min).toBe('number');
        expect(typeof setting.max).toBe('number');
        expect(typeof setting.step).toBe('number');
      });
    });
  });
});

// ============================================================================
// 3. SCHEMA TOGGLE BEHAVIOR TESTS
// ============================================================================

describe('Schema Toggle Behavior', () => {

  test('when schemaToggles has a style prop set to true, it generates Liquid var in CSS', () => {
    const element = {
      id: 'toggle-test',
      type: 'heading',
      props: { text: 'Test' },
      style: { textShadow: '2px 2px 4px #000' },
      schemaToggles: { textShadow: true },
    };

    const css = generateElementCSS(element, 'section-id');

    // textShadow is NOT in alwaysEnabledProperties for heading,
    // but it is toggled on via schemaToggles
    expect(css).toContain('text-shadow: {{ section.settings.');
  });

  test('when schemaToggles has a style prop set to true, it generates a schema setting', () => {
    const element = {
      id: 'toggle-test',
      type: 'heading',
      props: { text: 'Test' },
      style: { textShadow: '2px 2px 4px #000' },
      schemaToggles: { textShadow: true },
    };

    const settings = generateElementSchemaSettings(element);
    const textShadowSetting = settings.find(s => s.label === 'Text Shadow');

    expect(textShadowSetting).toBeDefined();
    expect(textShadowSetting.type).toBe('text');
  });

  test('when schemaToggles has a style prop set to false but prop is always-enabled, it STILL generates Liquid var', () => {
    const element = {
      id: 'always-test',
      type: 'heading',
      props: { text: 'Test' },
      style: { color: '#ff0000' },
      schemaToggles: { color: false },
    };

    const css = generateElementCSS(element, 'section-id');

    // color is always-enabled for heading, so even with schemaToggles.color = false,
    // it should still use Liquid variable
    expect(css).toContain('color: {{ section.settings.');
  });

  test('when schemaToggles has a style prop set to false but prop is always-enabled, it STILL generates schema setting', () => {
    const element = {
      id: 'always-test',
      type: 'heading',
      props: { text: 'Test' },
      style: { color: '#ff0000' },
      schemaToggles: { color: false },
    };

    const settings = generateElementSchemaSettings(element);
    const colorSetting = settings.find(s => s.label === 'Text Color');

    expect(colorSetting).toBeDefined();
    expect(colorSetting.type).toBe('color');
  });

  test('when schemaToggles is empty, only alwaysEnabledProperties generate settings', () => {
    const element = {
      id: 'empty-toggles',
      type: 'heading',
      props: { text: 'Test' },
      style: {
        color: '#333',
        textShadow: '1px 1px 2px #000',
        textDecoration: 'underline',
      },
      schemaToggles: {},
    };

    const settings = generateElementSchemaSettings(element);

    // color is always-enabled -> should have a setting
    const colorSetting = settings.find(s => s.label === 'Text Color');
    expect(colorSetting).toBeDefined();

    // textShadow is NOT always-enabled for heading -> should NOT have a setting
    const textShadowSetting = settings.find(s => s.label === 'Text Shadow');
    expect(textShadowSetting).toBeUndefined();

    // textDecoration is NOT always-enabled for heading -> should NOT have a setting
    const textDecoSetting = settings.find(s => s.label === 'Text Decoration');
    expect(textDecoSetting).toBeUndefined();
  });

  test('when schemaToggles is empty, only alwaysEnabledProperties generate Liquid vars in CSS', () => {
    const element = {
      id: 'empty-toggles-css',
      type: 'heading',
      props: { text: 'Test' },
      style: {
        color: '#333',
        textShadow: '1px 1px 2px #000',
      },
      schemaToggles: {},
    };

    const css = generateElementCSS(element, 'section-id');

    // color is always-enabled -> Liquid var
    expect(css).toContain('color: {{ section.settings.');

    // textShadow is NOT always-enabled and not toggled -> static value
    expect(css).toContain('text-shadow: 1px 1px 2px #000');
    expect(css).not.toContain('text-shadow: {{ section.settings.');
  });

  test('CSS for container with empty schemaToggles still generates Liquid vars for always-enabled', () => {
    const element = {
      id: 'container-toggle',
      type: 'container',
      props: {},
      style: {
        backgroundColor: '#fff',
        paddingTop: '20px',
        overflow: 'hidden',
      },
      schemaToggles: {},
    };

    const css = generateElementCSS(element, 'section-id');

    // backgroundColor and paddingTop are always-enabled for container
    expect(css).toContain('background-color: {{ section.settings.');
    expect(css).toContain('padding-top: {{ section.settings.');

    // overflow is NOT always-enabled for container -> static value
    expect(css).toContain('overflow: hidden');
    expect(css).not.toContain('overflow: {{ section.settings.');
  });

  test('toggling a non-always-enabled property on a button generates Liquid var', () => {
    const element = {
      id: 'btn-toggle',
      type: 'button',
      props: { text: 'Click' },
      style: {
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '2px',
        boxShadowBlur: '4px',
        boxShadowSpread: '0px',
        boxShadowColor: 'rgba(0,0,0,0.2)',
      },
      schemaToggles: { boxShadowOffsetX: true, boxShadowOffsetY: true, boxShadowBlur: true, boxShadowSpread: true, boxShadowColor: true },
    };

    const css = generateElementCSS(element, 'section-id');

    // boxShadow sub-props are not in alwaysEnabledProperties for button,
    // but they are toggled on — assembled into single box-shadow declaration
    expect(css).toContain('box-shadow:');
  });

  test('schema settings for toggle-enabled prop include correct type', () => {
    const element = {
      id: 'btn-toggle-schema',
      type: 'button',
      props: { text: 'Click' },
      style: { boxShadowOffsetX: '0px', boxShadowOffsetY: '2px', boxShadowBlur: '4px', boxShadowSpread: '0px', boxShadowColor: 'rgba(0,0,0,0.2)' },
      schemaToggles: { boxShadowColor: true },
    };

    const settings = generateElementSchemaSettings(element);
    const boxShadowColorSetting = settings.find(s => s.label === 'Shadow Color');

    expect(boxShadowColorSetting).toBeDefined();
    expect(boxShadowColorSetting.type).toBe('color');
    expect(boxShadowColorSetting.default).toBe('rgba(0,0,0,0.2)');
  });
});
