import {
  generateElementCSS,
  generateAllElementsCSS,
  generateLiquidStyles
} from '@/app/_utils/cssGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

beforeEach(() => {
  resetIdGenerator();
});

describe('CSS Generation', () => {
  describe('generateElementCSS', () => {
    test('generates CSS with data-element-id selector', () => {
      const element = {
        id: 'test-id-1234',
        type: 'heading',
        style: { color: '#333' },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('[data-element-id="test-id-1234"]');
      // color is always-enabled for heading, generates Liquid variable
      expect(css).toContain('color:');
    });

    test('converts camelCase to kebab-case for CSS properties', () => {
      const element = {
        id: 'test-id',
        type: 'container',
        style: {
          backgroundColor: '#f0f0f0',
          paddingTop: '20px',
          marginBottom: '10px',
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      // These are all always-enabled for container, so they become Liquid variables
      // but the CSS property names should still be in kebab-case
      expect(css).toContain('background-color:');
      expect(css).toContain('padding-top:');
      expect(css).toContain('margin-bottom:');
    });

    test('uses Liquid variables for schema-enabled style properties', () => {
      const element = {
        id: 'test-elem',
        type: 'button',
        style: {
          backgroundColor: '#007bff',
          color: '#ffffff',
        },
        schemaToggles: {
          backgroundColor: true,
          color: false,
        }
      };

      const css = generateElementCSS(element, 'section-id');

      // Both backgroundColor and color are in alwaysEnabledProperties for button
      // so both should use Liquid variables
      expect(css).toContain('{{ section.settings.');
      expect(css).toContain('_backgroundColor');
      expect(css).toContain('_color');
    });

    test('handles empty styles gracefully', () => {
      const element = {
        id: 'empty-styles',
        type: 'container',
        style: {},
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('[data-element-id="empty-styles"]');
    });

    test('skips null/undefined style values', () => {
      const element = {
        id: 'test-id',
        type: 'text',
        style: {
          color: null,
          backgroundColor: undefined,
          padding: ''
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      // null and empty values should not produce hardcoded CSS
      // but always-enabled properties may still generate Liquid vars
      expect(css).toContain('[data-element-id="test-id"]');
    });

    test('handles responsive properties with md as base/default', () => {
      const element = {
        id: 'responsive-test',
        type: 'container',
        style: { width: '100%' },
        responsiveStyles: {
          width: {
            xs: '100%',
            md: '80%',
            xl: '1200px'
          }
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('width:');
    });
  });

  describe('Media Query Generation', () => {
    test('generates xs media query for responsive styles', () => {
      const element = {
        id: 'xs-test',
        type: 'container',
        responsiveStyles: {
          paddingTop: {
            xs: '10px',
            md: '20px'
          }
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('@media (max-width: 575px)');
      expect(css).toContain('[data-element-id="xs-test"]');
      // paddingTop is always-enabled for container, so it uses Liquid vars
      expect(css).toContain('padding-top:');
    });

    test('generates xl media query for responsive styles', () => {
      const element = {
        id: 'xl-test',
        type: 'container',
        responsiveStyles: {
          width: {
            md: '80%',
            xl: '1200px'
          }
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('@media (min-width: 1200px)');
      expect(css).toContain('[data-element-id="xl-test"]');
    });

    test('uses Liquid variables in xs/xl media queries for schema-enabled properties', () => {
      const element = {
        id: 'responsive-schema',
        type: 'heading',
        responsiveStyles: {
          fontSize: {
            xs: '18px',
            md: '24px',
            xl: '32px'
          }
        },
        schemaToggles: { fontSize: true }
      };

      const css = generateElementCSS(element, 'section-id');

      // xs maps to schema breakpoint 'mobile'
      expect(css).toContain('@media (max-width: 575px)');
      expect(css).toContain('{{ section.settings.');
      expect(css).toContain('_fontSize_mobile');
    });

    test('generates sm and lg media queries with hardcoded values', () => {
      const element = {
        id: 'mid-viewports',
        type: 'container',
        responsiveStyles: {
          paddingTop: { sm: '12px', lg: '28px' }
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('@media (min-width: 576px) and (max-width: 767px)');
      expect(css).toContain('@media (min-width: 992px) and (max-width: 1199px)');
    });

    test('sm/lg media queries use hardcoded values, not Liquid vars', () => {
      const element = {
        id: 'hardcoded-mid',
        type: 'container',
        responsiveStyles: {
          paddingTop: { sm: '15px', lg: '25px' }
        },
        schemaToggles: { paddingTop: true }
      };

      const css = generateElementCSS(element, 'section-id');

      // Extract sm media query block
      const smMatch = css.match(/@media \(min-width: 576px\) and \(max-width: 767px\)\s*\{[\s\S]*?\n\}/);
      expect(smMatch).not.toBeNull();
      expect(smMatch[0]).toContain('padding-top: 15px');
      expect(smMatch[0]).not.toContain('section.settings.');

      // Extract lg media query block
      const lgMatch = css.match(/@media \(min-width: 992px\) and \(max-width: 1199px\)\s*\{[\s\S]*?\n\}/);
      expect(lgMatch).not.toBeNull();
      expect(lgMatch[0]).toContain('padding-top: 25px');
      expect(lgMatch[0]).not.toContain('section.settings.');
    });

    test('generates multiple properties in single xs media query', () => {
      const element = {
        id: 'multi-prop',
        type: 'container',
        responsiveStyles: {
          paddingTop: { xs: '5px' },
          paddingBottom: { xs: '5px' },
          marginTop: { xs: '10px' }
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      const xsQueryCount = (css.match(/@media \(max-width: 575px\)/g) || []).length;
      expect(xsQueryCount).toBe(1);

      // These are always-enabled for container, so they generate Liquid vars in xs media queries
      expect(css).toContain('padding-top:');
      expect(css).toContain('padding-bottom:');
      expect(css).toContain('margin-top:');
    });

    test('generates base styles before media queries', () => {
      const element = {
        id: 'no-responsive',
        type: 'divider',
        style: { borderColor: '#333' },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('[data-element-id="no-responsive"]');
      expect(css).toContain('border-color:');
    });

    test('only generates media queries for viewports with values', () => {
      const element = {
        id: 'partial-responsive',
        type: 'spacer',
        style: { height: '40px' },
        responsiveStyles: {
          height: {
            xs: '20px',
          }
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('@media (max-width: 575px)');
    });
  });

  describe('generateLiquidStyles', () => {
    test('generates complete style tag with CSS', () => {
      const elements = [
        {
          id: 'elem1',
          type: 'heading',
          style: { fontSize: '24px' },
          schemaToggles: {}
        }
      ];

      const styles = generateLiquidStyles(elements, 'test-section');

      expect(styles).toContain('<style>');
      expect(styles).toContain('</style>');
      expect(styles).toContain('[data-element-id="elem1"]');
    });

    test('processes nested elements recursively', () => {
      const elements = [
        {
          id: 'parent',
          type: 'container',
          style: { padding: '20px' },
          schemaToggles: {},
          children: [
            {
              id: 'child1',
              type: 'heading',
              style: { fontSize: '20px' },
              schemaToggles: {}
            },
            {
              id: 'child2',
              type: 'divider',
              style: { borderColor: '#666' },
              schemaToggles: {}
            }
          ]
        }
      ];

      const styles = generateLiquidStyles(elements, 'test-section');

      expect(styles).toContain('[data-element-id="parent"]');
      expect(styles).toContain('[data-element-id="child1"]');
      expect(styles).toContain('[data-element-id="child2"]');
    });

    test('processes column layouts', () => {
      const elements = [
        {
          id: 'columns',
          type: 'columns-2',
          style: { display: 'flex' },
          schemaToggles: {},
          columns: [
            [
              {
                id: 'col1-item',
                type: 'spacer',
                style: { height: '20px' },
                schemaToggles: {}
              }
            ],
            [
              {
                id: 'col2-item',
                type: 'spacer',
                style: { height: '30px' },
                schemaToggles: {}
              }
            ]
          ]
        }
      ];

      const styles = generateLiquidStyles(elements, 'test-section');

      expect(styles).toContain('[data-element-id="columns"]');
      expect(styles).toContain('[data-element-id="col1-item"]');
      expect(styles).toContain('[data-element-id="col2-item"]');
    });

    test('includes media queries in output', () => {
      const elements = [
        {
          id: 'responsive-elem',
          type: 'container',
          style: {},
          responsiveStyles: {
            width: {
              xs: '100%',
              md: '80%',
              xl: '1200px'
            }
          },
          schemaToggles: {}
        }
      ];

      const styles = generateLiquidStyles(elements, 'test-section');

      expect(styles).toContain('@media (max-width: 575px)');
      expect(styles).toContain('@media (min-width: 1200px)');
    });

    test('handles empty elements array', () => {
      const styles = generateLiquidStyles([], 'empty-section');

      expect(styles).toContain('<style>');
      expect(styles).toContain('</style>');
    });

    test('combines styles from multiple top-level elements', () => {
      const elements = [
        {
          id: 'elem1',
          type: 'heading',
          style: { fontSize: '24px' },
          schemaToggles: {}
        },
        {
          id: 'elem2',
          type: 'spacer',
          style: { height: '40px' },
          schemaToggles: {}
        },
        {
          id: 'elem3',
          type: 'divider',
          style: { borderWidth: '2px' },
          schemaToggles: {}
        }
      ];

      const styles = generateLiquidStyles(elements, 'multi-section');

      expect(styles).toContain('[data-element-id="elem1"]');
      expect(styles).toContain('[data-element-id="elem2"]');
      expect(styles).toContain('[data-element-id="elem3"]');
    });

    test('maintains CSS order: base styles then media queries per element', () => {
      const element = {
        id: 'ordered-elem',
        type: 'container',
        style: { padding: '20px' },
        responsiveStyles: {
          paddingTop: {
            xs: '10px',
            md: '20px'
          }
        },
        schemaToggles: {}
      };

      // Test at the element CSS level, not the full liquid styles level
      const css = generateElementCSS(element, 'order-test');

      const baseStyleIndex = css.indexOf('data-element-id="ordered-elem"');
      const mediaQueryIndex = css.indexOf('@media');

      expect(baseStyleIndex).toBeGreaterThan(-1);
      expect(mediaQueryIndex).toBeGreaterThan(-1);
      expect(baseStyleIndex).toBeLessThan(mediaQueryIndex);
    });
  });

  describe('Hover CSS Generation', () => {
    test('generates hover styles for button elements', () => {
      const element = {
        id: 'hover-btn',
        type: 'button',
        style: {
          backgroundColor: '#007bff',
          hoverBackgroundColor: '#0056b3',
          hoverColor: '#fff'
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain(':hover');
      // hover props are always-enabled for button, so they use Liquid vars
      expect(css).toContain('_hoverBackgroundColor');
      expect(css).toContain('_hoverColor');
    });
  });

  describe('Gradient CSS Generation', () => {
    test('generates linear gradient for container', () => {
      const element = {
        id: 'gradient-container',
        type: 'container',
        style: {
          gradientType: 'linear',
          gradientAngle: '135',
          gradientColor1: '#667eea',
          gradientColor2: '#764ba2'
        },
        schemaToggles: {}
      };

      const css = generateElementCSS(element, 'section-id');

      expect(css).toContain('linear-gradient');
    });
  });
});
