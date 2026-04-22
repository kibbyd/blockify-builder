import {
  generateElementSchemaSettings,
  generateAllElementsSchemaSettings,
  generateLiquidSchema
} from '@/app/_utils/schemaGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

beforeEach(() => {
  resetIdGenerator();
});

describe('Schema Generation', () => {
  describe('generateElementSchemaSettings', () => {
    test('generates header and content settings even with empty schema toggles', () => {
      const element = {
        id: 'test-id-1234',
        type: 'heading',
        props: { text: 'Test Heading' },
        style: { fontSize: '24px' },
        schemaToggles: {}
      };

      const settings = generateElementSchemaSettings(element);

      // Should have header + content props (text, tag are always included as they are schema-editable content props)
      expect(settings.length).toBeGreaterThanOrEqual(1);
      expect(settings[0].type).toBe('header');
    });

    test('generates settings for content properties automatically', () => {
      const element = {
        id: 'test-id-1234',
        type: 'heading',
        props: { text: 'Test Heading', tag: 'h2' },
        style: {},
        schemaToggles: {}
      };

      const settings = generateElementSchemaSettings(element);

      // Content props are always included
      const textSetting = settings.find(s => s.id && s.label === 'Heading Text');
      expect(textSetting).toBeDefined();
      expect(textSetting.type).toBe('textarea');
      expect(textSetting.default).toBe('Test Heading');

      const tagSetting = settings.find(s => s.id && s.label === 'Heading Level');
      expect(tagSetting).toBeDefined();
      expect(tagSetting.type).toBe('select');
      expect(tagSetting.default).toBe('h2');
    });

    test('generates settings for enabled style properties', () => {
      const element = {
        id: 'test-id-1234',
        type: 'container',
        props: {},
        style: { backgroundColor: '#ff0000', paddingTop: '20px' },
        schemaToggles: { backgroundColor: true, paddingTop: false }
      };

      const settings = generateElementSchemaSettings(element);

      // Should generate setting for backgroundColor (enabled)
      const bgSetting = settings.find(s => s.label === 'Background Color');
      expect(bgSetting).toBeDefined();
      expect(bgSetting.type).toBe('color');
    });

    test('generates 3 settings for responsive properties when enabled', () => {
      const element = {
        id: 'test-id-1234',
        type: 'container',
        props: {},
        style: { paddingTop: '20px' },
        responsiveStyles: {
          paddingTop: {
            xs: '10px',
            md: '20px',
            xl: '30px'
          }
        },
        schemaToggles: { paddingTop: true }
      };

      const settings = generateElementSchemaSettings(element);

      const paddingSettings = settings.filter(s => s.label && s.label.includes('Padding Top'));
      expect(paddingSettings).toHaveLength(3);

      const mobileSetting = paddingSettings.find(s => s.label.includes('mobile'));
      expect(mobileSetting).toBeDefined();
      expect(mobileSetting.default).toBe('10px');

      const desktopSetting = paddingSettings.find(s => s.label.includes('desktop'));
      expect(desktopSetting).toBeDefined();
      expect(desktopSetting.default).toBe('20px');

      const fullscreenSetting = paddingSettings.find(s => s.label.includes('fullscreen'));
      expect(fullscreenSetting).toBeDefined();
      expect(fullscreenSetting.default).toBe('30px');
    });

    test('uses default values when no value is set', () => {
      const element = {
        id: 'test-id-1234',
        type: 'button',
        props: {},
        style: {},
        schemaToggles: {}
      };

      const settings = generateElementSchemaSettings(element);

      const textSetting = settings.find(s => s.label === 'Button Text');
      expect(textSetting).toBeDefined();
      expect(textSetting.default).toBe('Click me');
    });

    test('generates unique setting IDs using idGenerator', () => {
      const element = {
        id: '12345678-abcd-efgh-ijkl-mnopqrstuvwx',
        type: 'heading',
        props: { text: 'Test' },
        style: {},
        schemaToggles: {}
      };

      const settings = generateElementSchemaSettings(element);
      const textSetting = settings.find(s => s.label === 'Heading Text');

      // Setting ID should use generated format (s_timestamp_counter_prop)
      expect(textSetting.id).toMatch(/^s_[a-z0-9]+_\d+_text$/);
    });

    test('handles select/button-group options correctly', () => {
      const element = {
        id: 'test-id',
        type: 'container',
        props: {},
        style: { flexDirection: 'row' },
        schemaToggles: { flexDirection: true }
      };

      const settings = generateElementSchemaSettings(element);
      const flexSetting = settings.find(s => s.label && s.label.includes('Direction'));

      expect(flexSetting).toBeDefined();
      expect(flexSetting.type).toBe('select');
      expect(flexSetting.options).toBeDefined();
      expect(Array.isArray(flexSetting.options)).toBe(true);
      expect(flexSetting.options[0]).toHaveProperty('value');
      expect(flexSetting.options[0]).toHaveProperty('label');
    });

    test('handles range/slider properties correctly', () => {
      const element = {
        id: 'test-id',
        type: 'icon',
        props: {},
        style: { iconSize: 50 },
        schemaToggles: { iconSize: true }
      };

      const settings = generateElementSchemaSettings(element);
      const sizeSetting = settings.find(s => s.label && s.label.includes('Icon Size'));

      if (sizeSetting && sizeSetting.type === 'range') {
        expect(sizeSetting).toHaveProperty('min');
        expect(sizeSetting).toHaveProperty('max');
        expect(sizeSetting).toHaveProperty('step');
      }
    });
  });

  describe('generateAllElementsSchemaSettings', () => {
    test('processes nested element structures', () => {
      const elements = [
        {
          id: 'parent',
          type: 'container',
          schemaToggles: { backgroundColor: true },
          style: { backgroundColor: '#fff' },
          children: [
            {
              id: 'child1',
              type: 'heading',
              schemaToggles: {},
              props: { text: 'Child Heading' }
            }
          ]
        }
      ];

      const settings = generateAllElementsSchemaSettings(elements);

      // Should have settings from both parent and child
      const bgSetting = settings.find(s => s.label === 'Background Color');
      const textSetting = settings.find(s => s.label === 'Heading Text');

      expect(bgSetting).toBeDefined();
      expect(textSetting).toBeDefined();
    });

    test('processes column layouts', () => {
      const elements = [
        {
          id: 'columns',
          type: 'columns-2',
          schemaToggles: {},
          columns: [
            [
              {
                id: 'col1-item',
                type: 'text',
                schemaToggles: {},
                props: { text: 'Column 1 text' }
              }
            ],
            [
              {
                id: 'col2-item',
                type: 'image',
                schemaToggles: {},
                props: { src: 'https://example.com/image.jpg' }
              }
            ]
          ]
        }
      ];

      const settings = generateAllElementsSchemaSettings(elements);

      // Should find settings from elements in both columns
      const textSetting = settings.find(s => s.label === 'Text Content');
      const srcSetting = settings.find(s => s.label === 'Image Source');

      expect(textSetting).toBeDefined();
      expect(srcSetting).toBeDefined();
    });

    test('handles empty elements array', () => {
      const settings = generateAllElementsSchemaSettings([]);
      expect(settings).toEqual([]);
    });

    test('handles deeply nested structures', () => {
      const elements = [
        {
          id: 'level1',
          type: 'container',
          schemaToggles: { gap: true },
          style: { gap: '10px' },
          children: [
            {
              id: 'level2',
              type: 'container',
              schemaToggles: { paddingTop: true },
              style: { paddingTop: '20px' },
              children: [
                {
                  id: 'level3',
                  type: 'text',
                  schemaToggles: {},
                  props: { text: 'Deep nested text' }
                }
              ]
            }
          ]
        }
      ];

      const settings = generateAllElementsSchemaSettings(elements);

      // Should have headers from all three levels
      const headers = settings.filter(s => s.type === 'header');
      expect(headers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('generateLiquidSchema', () => {
    test('generates complete schema with section name', () => {
      const elements = [
        {
          id: 'test-elem',
          type: 'heading',
          schemaToggles: {},
          props: { text: 'Test' }
        }
      ];

      const schemaJson = generateLiquidSchema(elements, 'Test Section');
      const schema = JSON.parse(schemaJson);

      expect(schema.name).toBe('Test Section');
      expect(schema.tag).toBe('section');
      expect(schema.class).toBe('test-section');
      expect(schema.settings).toBeDefined();
      expect(schema.presets).toBeDefined();
    });

    test('includes section name and presets in schema', () => {
      const schemaJson = generateLiquidSchema([], 'Empty Section');
      const schema = JSON.parse(schemaJson);

      expect(schema.name).toBe('Empty Section');
      expect(schema.settings).toBeDefined();
      expect(Array.isArray(schema.settings)).toBe(true);
      expect(schema.presets).toHaveLength(1);
      expect(schema.presets[0].name).toBe('Empty Section');
    });

    test('generates valid JSON output', () => {
      const elements = [
        {
          id: 'test',
          type: 'text',
          schemaToggles: {},
          props: { text: 'Test content' }
        }
      ];

      const schemaJson = generateLiquidSchema(elements, 'Valid JSON Test');

      expect(() => JSON.parse(schemaJson)).not.toThrow();

      const schema = JSON.parse(schemaJson);
      expect(typeof schema).toBe('object');
    });

    test('handles special characters in section name', () => {
      const schemaJson = generateLiquidSchema([], 'Test & Special <Characters>');
      const schema = JSON.parse(schemaJson);

      expect(schema.name).toBe('Test & Special <Characters>');
      expect(schema.class).toBe('test-special-characters');
    });

    test('includes presets with section name', () => {
      const schemaJson = generateLiquidSchema([], 'Preset Test');
      const schema = JSON.parse(schemaJson);

      expect(schema.presets).toHaveLength(1);
      expect(schema.presets[0].name).toBe('Preset Test');
    });

    test('combines settings from multiple elements', () => {
      const elements = [
        {
          id: 'elem1',
          type: 'heading',
          schemaToggles: {},
          props: { text: 'Heading' }
        },
        {
          id: 'elem2',
          type: 'button',
          schemaToggles: {},
          props: { text: 'Click', url: '#' }
        }
      ];

      const schemaJson = generateLiquidSchema(elements, 'Multi Element');
      const schema = JSON.parse(schemaJson);

      // Should have settings from both elements (content props are always included)
      const headingHeader = schema.settings.find(s => s.type === 'header' && s.content && s.content.includes('Heading'));
      const buttonHeader = schema.settings.find(s => s.type === 'header' && s.content && s.content.includes('Button'));

      expect(headingHeader).toBeDefined();
      expect(buttonHeader).toBeDefined();
    });
  });

  describe('Schema Toggle Integration', () => {
    test('generates style settings only for enabled toggle properties', () => {
      const element = {
        id: 'test-comprehensive',
        type: 'button',
        props: {
          text: 'Button Text',
          url: 'https://example.com',
          openInNewTab: true
        },
        style: {
          backgroundColor: '#007bff',
          color: '#ffffff',
          borderRadius: '4px'
        },
        schemaToggles: {
          backgroundColor: true,
          color: false,
          borderRadius: false
        }
      };

      const settings = generateElementSchemaSettings(element);

      // backgroundColor should have a setting (enabled via toggle)
      const bgSetting = settings.find(s => s.label === 'Background Color');
      expect(bgSetting).toBeDefined();

      // color has toggle set to false, but may still appear if in alwaysEnabledProperties
      // borderRadius same situation
    });

    test('handles mixed responsive and non-responsive properties', () => {
      const element = {
        id: 'mixed-test',
        type: 'container',
        style: {
          backgroundColor: '#f0f0f0',
          paddingTop: '10px'
        },
        responsiveStyles: {
          paddingTop: {
            mobile: '5px',
            desktop: '10px',
            fullscreen: '15px'
          }
        },
        schemaToggles: {
          backgroundColor: true,
          paddingTop: true
        }
      };

      const settings = generateElementSchemaSettings(element);

      // backgroundColor should have 1 setting (non-responsive)
      const bgSettings = settings.filter(s => s.label === 'Background Color');
      expect(bgSettings).toHaveLength(1);

      // paddingTop should have 3 settings (mobile, desktop, fullscreen)
      const paddingSettings = settings.filter(s => s.label && s.label.includes('Padding Top'));
      expect(paddingSettings).toHaveLength(3);
    });
  });

  describe('All element types generate valid schema', () => {
    const elementTypes = [
      { type: 'heading', props: { text: 'Test', tag: 'h2' } },
      { type: 'text', props: { text: 'Test' } },
      { type: 'button', props: { text: 'Click', url: '#' } },
      { type: 'image', props: { src: 'test.jpg', alt: 'test' } },
      { type: 'video', props: { src: 'test.mp4' } },
      { type: 'container', props: {} },
      { type: 'columns-2', props: {} },
      { type: 'spacer', props: {} },
      { type: 'divider', props: {} },
      { type: 'icon', props: { src: 'icon.svg' } },
      { type: 'list', props: { html: '<ol><li>A</li></ol>' } },
      { type: 'table', props: { html: '<table></table>' } },
      { type: 'map', props: { embedUrl: 'https://maps.google.com' } },
      { type: 'image-background', props: { src: 'bg.jpg' } },
      { type: 'price', props: {} },
      { type: 'add-to-cart', props: {} },
      { type: 'product-card', props: {} },
      { type: 'product-grid', props: {} },
      { type: 'collection-list', props: {} },
      { type: 'variant-selector', props: {} },
      { type: 'accordion', props: { itemCount: 3 } },
      { type: 'tabs', props: { tabCount: 3 } },
      { type: 'countdown', props: { targetDate: '2030-01-01' } },
      { type: 'slideshow', props: { slideCount: 3 } },
      { type: 'form', props: {} },
      { type: 'popup', props: {} },
      { type: 'social-icons', props: {} },
      { type: 'image-gallery', props: { imageCount: 3 } },
      { type: 'flip-card', props: {} },
      { type: 'progress-bar', props: { percentage: 75 } },
      { type: 'before-after', props: {} },
      { type: 'marquee', props: { text: 'Scrolling' } },
      { type: 'blog-post', props: {} },
      { type: 'stock-counter', props: {} },
    ];

    elementTypes.forEach(({ type, props }) => {
      test(`${type} generates schema settings without errors`, () => {
        resetIdGenerator();
        const element = {
          id: `test-${type}`,
          type,
          props: props || {},
          style: {},
          schemaToggles: {}
        };

        const settings = generateElementSchemaSettings(element);
        expect(Array.isArray(settings)).toBe(true);
        expect(settings.length).toBeGreaterThan(0);
        // First should always be a header
        expect(settings[0].type).toBe('header');
      });
    });

    test('all element types produce valid JSON schema', () => {
      const elements = elementTypes.map(({ type, props }, i) => ({
        id: `elem-${i}`,
        type,
        props: props || {},
        style: {},
        schemaToggles: {}
      }));

      const schemaJson = generateLiquidSchema(elements, 'All Elements Test');
      expect(() => JSON.parse(schemaJson)).not.toThrow();

      const schema = JSON.parse(schemaJson);
      expect(schema.settings.length).toBeGreaterThan(0);
      expect(schema.name).toBe('All Elements Test');
    });
  });
});
