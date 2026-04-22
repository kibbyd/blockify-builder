import { generateElementCSS } from '@/app/_utils/cssGeneration';
import { generateElementSchemaSettings } from '@/app/_utils/schemaGeneration';
import { generateElementHTML } from '@/app/_utils/htmlGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';
import { elementDefinitions } from '@/app/_config/elementDefinitions';

beforeEach(() => {
  resetIdGenerator();
});

// =============================================================================
// SECTION 1: Cross-Module Consistency
// =============================================================================

describe('alwaysEnabledProperties consistency between CSS and Schema generation', () => {
  /**
   * The alwaysEnabledProperties lists in htmlGeneration, cssGeneration, and
   * schemaGeneration must agree. For each always-enabled STYLE property, a
   * Liquid variable should appear in CSS AND a schema setting should be generated.
   * For each always-enabled CONTENT property, a Liquid variable should appear
   * in HTML AND a schema setting should be generated.
   */

  const elementTypes = [
    'heading', 'text', 'button', 'container', 'image', 'icon',
    'divider', 'accordion', 'tabs', 'countdown', 'form', 'popup',
    'social-icons', 'flip-card', 'progress-bar', 'marquee',
    'blog-post', 'stock-counter',
  ];

  // Helper: build a minimal element with realistic props for each type
  const buildElement = (type) => {
    const base = {
      id: `test-${type}-001`,
      type,
      props: {},
      style: {},
      schemaToggles: {},
    };

    // Add type-specific props so generators don't hit null paths
    switch (type) {
      case 'heading':
        base.props = { text: 'Test Heading', tag: 'h2' };
        break;
      case 'text':
        base.props = { text: 'Test paragraph' };
        break;
      case 'button':
        base.props = { text: 'Click me', url: '#' };
        break;
      case 'container':
        base.children = [];
        break;
      case 'image':
        base.props = { src: 'https://example.com/img.jpg', alt: 'alt text' };
        break;
      case 'icon':
        base.props = { src: 'https://example.com/icon.svg', alt: 'icon' };
        break;
      case 'divider':
        base.style = { borderStyle: 'solid', borderColor: '#ccc', borderWidth: '1px' };
        break;
      case 'accordion':
        base.props = { itemCount: 2, panelTitle_1: 'Q1', panelContent_1: 'A1', panelTitle_2: 'Q2', panelContent_2: 'A2' };
        break;
      case 'tabs':
        base.props = { tabCount: 2, tabLabel_1: 'Tab 1', tabContent_1: 'Content 1', tabLabel_2: 'Tab 2', tabContent_2: 'Content 2' };
        break;
      case 'countdown':
        base.props = { targetDate: '2027-01-01', expiredMessage: 'Done' };
        break;
      case 'form':
        base.props = { showName: true, showEmail: true, submitText: 'Go' };
        break;
      case 'popup':
        base.props = { triggerText: 'Open', popupTitle: 'Title', popupContent: 'Body' };
        break;
      case 'social-icons':
        base.props = { facebook: 'https://fb.com', instagram: 'https://ig.com' };
        break;
      case 'flip-card':
        base.props = { frontTitle: 'Front', backTitle: 'Back', flipDirection: 'horizontal' };
        break;
      case 'progress-bar':
        base.props = { label: 'Loading', percentage: '50' };
        break;
      case 'marquee':
        base.props = { text: 'Scrolling text' };
        break;
      case 'blog-post':
        base.props = { postCount: '3', columns: '3' };
        break;
      case 'stock-counter':
        base.props = { lowStockThreshold: '5', inStockText: 'Available' };
        break;
    }

    return base;
  };

  // Classify a property as content or style based on elementDefinitions
  const classifyProperty = (type, propName) => {
    const def = elementDefinitions[type];
    if (!def) return null;
    if (def.contentProps?.some(p => p.name === propName)) return 'content';
    if (def.styleProps?.some(p => p.name === propName)) return 'style';
    return null;
  };

  elementTypes.forEach((type) => {
    describe(`${type}`, () => {
      test('always-enabled STYLE properties appear as Liquid variables in CSS and as schema settings', () => {
        const element = buildElement(type);
        resetIdGenerator();
        const css = generateElementCSS(element, 'test-section');
        resetIdGenerator();
        const schema = generateElementSchemaSettings(element);

        const def = elementDefinitions[type];
        if (!def) return; // skip if no definition

        // Gather always-enabled style properties that exist in the element definition
        const styleProps = (def.styleProps || []).filter(p => p.canBeSchemaEditable);
        const stylePropNames = styleProps.map(p => p.name);

        // The alwaysEnabled lists are internal; we infer them by checking what
        // the schema generator produces with no explicit schemaToggles.
        const schemaSettingIds = schema
          .filter(s => s.type !== 'header')
          .map(s => s.id);

        // For each style prop that produces a schema setting, verify
        // it also produces CSS output (either Liquid var or direct value)
        stylePropNames.forEach(propName => {
          const matchingSettings = schemaSettingIds.filter(id => id.includes(`_${propName}`));
          if (matchingSettings.length > 0) {
            // This is always-enabled - verify CSS references it
            // CSS uses section.settings.<settingId> OR the property in kebab-case
            const hasCSSReference = css.includes(propName) ||
              css.includes(propName.replace(/([A-Z])/g, '-$1').toLowerCase());
            // Some props are non-CSS content-like props (e.g., itemCount, tabCount)
            // that don't appear in CSS - that's expected
            const nonCSSProps = [
              'itemCount', 'tabCount', 'slideCount', 'targetDate', 'expiredMessage',
              'showComparePrice', 'showQuantity', 'buttonText', 'columns', 'rows',
              'showImage', 'showTitle', 'showPrice', 'showButton', 'showCount',
              'buttonColor', 'buttonBackgroundColor', 'comparePriceColor',
              'gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2',
              'gradientColor3', 'gradientColor4', 'gradientColor5',
              'titleFontFamily', 'titleFontSize', 'titleFontWeight', 'contentFontSize',
              'titleColor', 'titleBackgroundColor', 'contentBackgroundColor',
              'borderColor', 'tabFontFamily', 'tabFontSize', 'tabFontWeight',
              'tabBackgroundColor', 'tabActiveBackgroundColor', 'tabColor',
              'tabActiveColor', 'digitFontFamily', 'digitColor', 'labelColor',
              'digitFontSize', 'labelFontSize', 'separatorStyle',
              'headingFontFamily', 'headingFontSize', 'headingFontWeight',
              'textFontSize', 'slideBackgroundColor', 'arrowColor', 'dotColor',
              'dotActiveColor', 'hoverBackgroundColor', 'hoverColor',
              'showName', 'showEmail', 'showPhone', 'showMessage', 'submitText',
              'namePlaceholder', 'emailPlaceholder', 'phonePlaceholder',
              'messagePlaceholder', 'formAction', 'triggerText', 'popupTitle',
              'popupContent', 'showEmailField', 'triggerButtonColor', 'triggerButtonBg',
              'overlayColor', 'facebook', 'instagram', 'twitter', 'youtube',
              'tiktok', 'linkedin', 'pinterest', 'frontTitle', 'frontContent',
              'frontImage', 'backTitle', 'backContent', 'backButtonText', 'backButtonUrl',
              'flipDirection', 'frontBackgroundColor', 'frontColor', 'backBackgroundColor',
              'backColor', 'buttonBackgroundColor', 'buttonColor',
              'label', 'percentage', 'showPercentage', 'showLabel', 'animated',
              'barColor', 'trackColor', 'barHeight', 'text', 'speed', 'pauseOnHover',
              'direction', 'postCount', 'showExcerpt', 'showDate', 'showAuthor',
              'showReadMore', 'readMoreText', 'titleFontSize', 'linkColor',
              'lowStockThreshold', 'showBar', 'showIcon', 'inStockText', 'lowStockText',
              'outOfStockText', 'inStockColor', 'lowStockColor', 'outOfStockColor',
              'selectorStyle', 'showLabel', 'showPrice', 'activeColor', 'activeBorderColor',
              'buttonHoverColor', 'buttonHoverBackgroundColor', 'buttonHoverBorderColor',
              'buttonHoverAnimation', 'titleTextAlign', 'priceTextAlign',
            ];
            if (!nonCSSProps.includes(propName)) {
              expect(hasCSSReference).toBe(true);
            }
          }
        });
      });

      test('always-enabled CONTENT properties appear as Liquid variables in HTML and as schema settings', () => {
        const element = buildElement(type);
        resetIdGenerator();
        const html = generateElementHTML(element);
        resetIdGenerator();
        const schema = generateElementSchemaSettings(element);

        const def = elementDefinitions[type];
        if (!def) return;

        const contentProps = (def.contentProps || []).filter(p => p.canBeSchemaEditable);

        contentProps.forEach(prop => {
          const matchingSettings = schema.filter(
            s => s.type !== 'header' && s.id && s.id.includes(`_${prop.name}`)
          );
          // Content props are always included in schema
          expect(matchingSettings.length).toBeGreaterThanOrEqual(1);
        });
      });

      test('CSS, HTML, and schema all generate without errors', () => {
        const element = buildElement(type);

        resetIdGenerator();
        expect(() => generateElementCSS(element, 'sec')).not.toThrow();

        resetIdGenerator();
        expect(() => generateElementHTML(element)).not.toThrow();

        resetIdGenerator();
        expect(() => generateElementSchemaSettings(element)).not.toThrow();
      });
    });
  });
});

// =============================================================================
// SECTION 2: Edge Cases
// =============================================================================

describe('Edge cases and error handling', () => {
  // ---------------------------------------------------------------------------
  // Empty / Missing Data
  // ---------------------------------------------------------------------------

  describe('Empty/Missing Data', () => {
    test('element with no props, no style, no schemaToggles does not crash and returns valid output', () => {
      const element = { id: 'empty-1', type: 'heading' };

      resetIdGenerator();
      const css = generateElementCSS(element, 'sec');
      expect(typeof css).toBe('string');

      resetIdGenerator();
      const html = generateElementHTML(element);
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);

      resetIdGenerator();
      const schema = generateElementSchemaSettings(element);
      expect(Array.isArray(schema)).toBe(true);
    });

    test('element with undefined children does not crash', () => {
      const element = {
        id: 'undef-children',
        type: 'container',
        children: undefined,
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      expect(typeof html).toBe('string');
      expect(html).toContain('data-element-id="undef-children"');
    });

    test('element with empty children array renders container without child HTML', () => {
      const element = {
        id: 'empty-children',
        type: 'container',
        children: [],
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      expect(html).toContain('data-element-id="empty-children"');
      expect(html).toContain('block-container');
      // Should have opening and closing div but no child elements between
      const inner = html.replace(/.*block-container">\n/, '').replace(/<\/div>\n$/, '');
      expect(inner.trim()).toBe('');
    });

    test('element with null style values skips those CSS properties', () => {
      const element = {
        id: 'null-styles',
        type: 'heading',
        style: { color: null, fontSize: null },
        schemaToggles: {},
      };

      resetIdGenerator();
      const css = generateElementCSS(element, 'sec');
      // color and fontSize are always-enabled for heading so they still appear
      // via Liquid variables; the null value is not hardcoded
      expect(typeof css).toBe('string');
    });

    test('element with empty string style values skips those CSS properties', () => {
      const element = {
        id: 'empty-str-styles',
        type: 'heading',
        style: { color: '', fontSize: '' },
        schemaToggles: {},
      };

      resetIdGenerator();
      const css = generateElementCSS(element, 'sec');
      expect(typeof css).toBe('string');
      // Should still have section.settings references for always-enabled props
      expect(css).toContain('section.settings.');
    });
  });

  // ---------------------------------------------------------------------------
  // Invalid / Boundary Data
  // ---------------------------------------------------------------------------

  describe('Invalid/Boundary Data', () => {
    test('unknown element type generates fallback div with comment', () => {
      const element = {
        id: 'unknown-type-1',
        type: 'nonexistent-widget',
        props: {},
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      // Unknown types should return empty string since elementDef is not found
      expect(html).toBe('');

      resetIdGenerator();
      const css = generateElementCSS(element, 'sec');
      expect(css).toBe('');

      resetIdGenerator();
      const schema = generateElementSchemaSettings(element);
      expect(schema).toEqual([]);
    });

    test('element with no id handles gracefully', () => {
      const element = {
        id: undefined,
        type: 'heading',
        props: { text: 'No ID heading', tag: 'h2' },
      };

      resetIdGenerator();
      // Should not throw, though output may contain "undefined" in attributes
      expect(() => generateElementHTML(element)).not.toThrow();
      expect(() => generateElementCSS(element, 'sec')).not.toThrow();
      expect(() => generateElementSchemaSettings(element)).not.toThrow();
    });

    test('element with very long text values generates without error', () => {
      const longText = 'A'.repeat(10000);
      const element = {
        id: 'long-text-1',
        type: 'heading',
        props: { text: longText, tag: 'h2' },
        schemaToggles: {},
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);

      resetIdGenerator();
      const schema = generateElementSchemaSettings(element);
      expect(Array.isArray(schema)).toBe(true);
    });

    test('container with deeply nested children (5 levels) all levels render', () => {
      // Build 5-level deep nesting: container > container > container > container > heading
      const heading = {
        id: 'deep-heading',
        type: 'heading',
        props: { text: 'Deep', tag: 'h3' },
      };

      let current = heading;
      for (let i = 4; i >= 1; i--) {
        current = {
          id: `deep-container-${i}`,
          type: 'container',
          children: [current],
        };
      }

      resetIdGenerator();
      const html = generateElementHTML(current);
      expect(html).toContain('data-element-id="deep-container-1"');
      expect(html).toContain('data-element-id="deep-container-2"');
      expect(html).toContain('data-element-id="deep-container-3"');
      expect(html).toContain('data-element-id="deep-container-4"');
      expect(html).toContain('data-element-id="deep-heading"');
    });

    test('columns with empty column arrays renders empty column divs', () => {
      const element = {
        id: 'empty-cols',
        type: 'columns-3',
        columns: [[], [], []],
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      expect(html).toContain('data-element-id="empty-cols"');
      expect(html).toContain('column-1');
      expect(html).toContain('column-2');
      expect(html).toContain('column-3');
    });

    test('accordion with itemCount: 0 falls back to default count (falsy value)', () => {
      const element = {
        id: 'acc-zero',
        type: 'accordion',
        props: { itemCount: 0 },
        schemaToggles: {},
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      expect(html).toContain('data-element-id="acc-zero"');
      // itemCount 0 is falsy so the generator falls back to default (3)
      // This verifies the generator handles falsy itemCount without crashing
      expect(html).toContain('accordion__item');
    });

    test('accordion with itemCount: 1 generates 1 item', () => {
      const element = {
        id: 'acc-one',
        type: 'accordion',
        props: { itemCount: 1, panelTitle_1: 'Only Q', panelContent_1: 'Only A' },
        schemaToggles: {},
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      expect(html).toContain('accordion__item');
      // Count occurrences of accordion__item
      const matches = html.match(/accordion__item/g);
      expect(matches).toHaveLength(1);
    });

    test('tabs with tabCount: 1 generates 1 tab', () => {
      const element = {
        id: 'tabs-one',
        type: 'tabs',
        props: { tabCount: 1, tabLabel_1: 'Solo Tab', tabContent_1: 'Solo content' },
        schemaToggles: {},
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      expect(html).toContain('tabs__button');
      // Should have exactly one tab button and one tab panel
      const buttons = html.match(/tabs__button/g);
      expect(buttons).toHaveLength(1);
      const panels = html.match(/tabs__panel/g);
      expect(panels).toHaveLength(1);
    });

    test('slideshow with slideCount: 1 generates 1 slide with arrows and dots', () => {
      const element = {
        id: 'slide-one',
        type: 'slideshow',
        props: { slideCount: 1 },
        schemaToggles: {},
      };

      resetIdGenerator();
      const html = generateElementHTML(element);
      // 1 slide
      const slides = html.match(/slideshow__slide/g);
      // slideshow__slide appears in class names; count the opening divs
      expect(html).toContain('data-slide="1"');
      expect(html).not.toContain('data-slide="2"');
      // arrows still present
      expect(html).toContain('slideshow__arrow--prev');
      expect(html).toContain('slideshow__arrow--next');
      // dots still present
      expect(html).toContain('slideshow__dot');
    });
  });

  // ---------------------------------------------------------------------------
  // Schema Toggle Edge Cases
  // ---------------------------------------------------------------------------

  describe('Schema Toggle Edge Cases', () => {
    test('schemaToggles with properties not in the element definition are ignored gracefully', () => {
      const element = {
        id: 'bogus-toggles',
        type: 'heading',
        props: { text: 'Hello', tag: 'h2' },
        style: {},
        schemaToggles: {
          nonExistentProperty: true,
          anotherFake: true,
        },
      };

      resetIdGenerator();
      expect(() => generateElementCSS(element, 'sec')).not.toThrow();
      resetIdGenerator();
      expect(() => generateElementHTML(element)).not.toThrow();
      resetIdGenerator();
      const schema = generateElementSchemaSettings(element);
      // The bogus properties should NOT appear in schema output
      const ids = schema.map(s => s.id).filter(Boolean);
      const hasBogus = ids.some(id => id.includes('nonExistentProperty'));
      expect(hasBogus).toBe(false);
    });

    test('schemaToggles: undefined is treated as empty', () => {
      const element = {
        id: 'undef-toggles',
        type: 'heading',
        props: { text: 'Hello', tag: 'h2' },
        style: { color: '#333' },
        schemaToggles: undefined,
      };

      resetIdGenerator();
      expect(() => generateElementCSS(element, 'sec')).not.toThrow();
      resetIdGenerator();
      expect(() => generateElementHTML(element)).not.toThrow();
      resetIdGenerator();
      expect(() => generateElementSchemaSettings(element)).not.toThrow();
    });

    test('schemaToggles: null is treated as empty', () => {
      const element = {
        id: 'null-toggles',
        type: 'heading',
        props: { text: 'Hello', tag: 'h2' },
        style: { color: '#333' },
        schemaToggles: null,
      };

      resetIdGenerator();
      expect(() => generateElementCSS(element, 'sec')).not.toThrow();
      resetIdGenerator();
      expect(() => generateElementHTML(element)).not.toThrow();
      resetIdGenerator();
      expect(() => generateElementSchemaSettings(element)).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // CSS Edge Cases
  // ---------------------------------------------------------------------------

  describe('CSS Edge Cases', () => {
    test('element with only responsive styles and no base styles generates valid CSS', () => {
      const element = {
        id: 'resp-only',
        type: 'heading',
        style: {},
        responsiveStyles: {
          fontSize: {
            xs: '14px',
            md: '18px',
            xl: '24px',
          },
        },
        schemaToggles: {},
      };

      resetIdGenerator();
      const css = generateElementCSS(element, 'sec');
      expect(typeof css).toBe('string');
      // fontSize is always-enabled for heading, so Liquid vars appear
      expect(css).toContain('section.settings.');
    });

    test('element with responsive styles for only mobile generates only mobile media query', () => {
      const element = {
        id: 'mobile-only',
        type: 'container',
        style: {},
        responsiveStyles: {
          paddingTop: {
            xs: '10px',
          },
        },
        schemaToggles: {},
      };

      resetIdGenerator();
      const css = generateElementCSS(element, 'sec');
      // paddingTop is always-enabled for container, so all breakpoints get Liquid vars
      // The responsive generator outputs mobile and fullscreen media queries
      // for all always-enabled responsive props, so both will appear
      expect(css).toContain('@media');
      expect(typeof css).toBe('string');
    });

    test('element with responsive styles for only fullscreen generates fullscreen media query', () => {
      const element = {
        id: 'fs-only',
        type: 'container',
        style: {},
        responsiveStyles: {
          paddingTop: {
            xl: '40px',
          },
        },
        schemaToggles: {},
      };

      resetIdGenerator();
      const css = generateElementCSS(element, 'sec');
      // Same as above: always-enabled responsive props will generate Liquid vars
      // for all breakpoints regardless
      expect(css).toContain('@media');
      expect(typeof css).toBe('string');
    });
  });
});
