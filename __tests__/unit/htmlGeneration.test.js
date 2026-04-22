import {
  generateElementHTML,
  generateAllElementsHTML
} from '@/app/_utils/htmlGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

// Reset ID generator before each test for deterministic output
beforeEach(() => {
  resetIdGenerator();
});

describe('HTML Generation', () => {
  describe('generateElementHTML', () => {
    test('generates HTML with data-element-id attribute', () => {
      const element = {
        id: 'test-id-1234',
        type: 'heading',
        props: { text: 'Test Heading', tag: 'h2' },
        schemaToggles: {}
      };

      const html = generateElementHTML(element);

      expect(html).toContain('data-element-id="test-id-1234"');
      expect(html).toContain('<h2');
      // text is in alwaysEnabledProperties for heading, so it generates a Liquid variable
      expect(html).toContain('{{ section.settings.');
      expect(html).toContain('</h2>');
    });

    test('generates heading with Liquid variables when schema enabled', () => {
      const element = {
        id: 'test-id-1234',
        type: 'heading',
        props: { text: 'Test Heading', tag: 'h2' },
        schemaToggles: { text: true }
      };

      const html = generateElementHTML(element);

      expect(html).toContain('{{ section.settings.');
      expect(html).toContain('_text }}');
      expect(html).not.toContain('Test Heading');
    });

    test('generates heading with correct tag level', () => {
      const testCases = ['h2', 'h3', 'h4', 'h5', 'h6'];

      testCases.forEach(tag => {
        resetIdGenerator();
        const element = {
          id: `heading-${tag}`,
          type: 'heading',
          props: { text: `${tag} Heading`, tag },
          schemaToggles: { text: false }
        };

        const html = generateElementHTML(element);
        expect(html).toContain(`<${tag}`);
        expect(html).toContain(`</${tag}>`);
      });
    });

    test('generates text element as paragraph', () => {
      const element = {
        id: 'text-elem',
        type: 'text',
        props: { text: 'This is a paragraph of text.' },
        schemaToggles: {}
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<p');
      // text is always-enabled for text elements, generates Liquid variable
      expect(html).toContain('{{ section.settings.');
      expect(html).toContain('</p>');
    });

    test('generates image with Liquid conditional (always-enabled)', () => {
      const element = {
        id: 'image-elem',
        type: 'image',
        props: {
          src: 'https://example.com/image.jpg',
          alt: 'Test image description'
        },
        schemaToggles: {}
      };

      const html = generateElementHTML(element);

      // src is always-enabled for image, so it generates Liquid conditional
      expect(html).toContain('{% if section.settings.');
      expect(html).toContain('image_url');
      expect(html).toContain('alt="Test image description"');
      expect(html).toContain('loading="lazy"');
    });

    test('generates video with all control attributes', () => {
      const element = {
        id: 'video-elem',
        type: 'video',
        props: {
          src: 'https://example.com/video.mp4',
          autoplay: true,
          muted: true,
          loop: true,
          controls: true,
          poster: 'https://example.com/poster.jpg'
        }
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<video');
      expect(html).toContain('src="https://example.com/video.mp4"');
      expect(html).toContain('autoplay');
      expect(html).toContain('muted');
      expect(html).toContain('loop');
      expect(html).toContain('controls');
      expect(html).toContain('poster="https://example.com/poster.jpg"');
      expect(html).toContain('</video>');
    });

    test('generates button with link attributes', () => {
      const element = {
        id: 'button-elem',
        type: 'button',
        props: {
          text: 'Click Me',
          url: 'https://example.com',
          openInNewTab: true
        },
        schemaToggles: {}
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<a');
      // text and url are always-enabled for button, so they generate Liquid variables
      expect(html).toContain('{{ section.settings.');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
      expect(html).toContain('</a>');
    });

    test('generates button without target for same-tab links', () => {
      const element = {
        id: 'button-elem',
        type: 'button',
        props: {
          text: 'Click Me',
          url: '/products',
          openInNewTab: false
        },
        schemaToggles: { text: false, url: false }
      };

      const html = generateElementHTML(element);

      expect(html).not.toContain('target="_blank"');
      expect(html).not.toContain('rel="noopener noreferrer"');
    });

    test('generates icon with SVG content', () => {
      const element = {
        id: 'icon-elem',
        type: 'icon',
        props: {
          src: 'data:image/svg+xml;base64,PHN2Zy4uLg==',
          alt: 'Icon'
        },
        schemaToggles: { src: false }
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<img');
      expect(html).toContain('alt="Icon"');
      expect(html).toContain('class="icon-element"');
    });

    test('generates spacer div', () => {
      const element = {
        id: 'spacer-elem',
        type: 'spacer'
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<div');
      expect(html).toContain('data-element-id="spacer-elem"');
      expect(html).toContain('class="spacer"');
      expect(html).toContain('</div>');
    });

    test('generates container with children', () => {
      const element = {
        id: 'container-elem',
        type: 'container',
        children: [
          {
            id: 'child-1',
            type: 'heading',
            props: { text: 'Child Heading', tag: 'h3' },
            schemaToggles: {}
          },
          {
            id: 'child-2',
            type: 'text',
            props: { text: 'Child text' },
            schemaToggles: {}
          }
        ]
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<div');
      expect(html).toContain('data-element-id="container-elem"');
      expect(html).toContain('class="block-container"');
      expect(html).toContain('data-element-id="child-1"');
      expect(html).toContain('data-element-id="child-2"');
      // Children content props are always-enabled, so they use Liquid variables
      expect(html).toContain('{{ section.settings.');
      expect(html).toContain('</div>');
    });

    test('generates column layouts', () => {
      const element = {
        id: 'columns-elem',
        type: 'columns-2',
        columns: [
          [
            {
              id: 'col1-item',
              type: 'text',
              props: { text: 'Column 1 content' },
              schemaToggles: {}
            }
          ],
          [
            {
              id: 'col2-item',
              type: 'text',
              props: { text: 'Column 2 content' },
              schemaToggles: {}
            }
          ]
        ]
      };

      const html = generateElementHTML(element);

      expect(html).toContain('class="columns columns-2"');
      expect(html).toContain('class="column column-1"');
      expect(html).toContain('class="column column-2"');
      expect(html).toContain('data-element-id="col1-item"');
      expect(html).toContain('data-element-id="col2-item"');
    });

    test('generates list with HTML content', () => {
      const element = {
        id: 'list-elem',
        type: 'list',
        props: {
          html: '<ol><li>First item</li><li>Second item</li></ol>'
        },
        schemaToggles: { html: false }
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<div');
      expect(html).toContain('data-element-id="list-elem"');
      expect(html).toContain('<ol><li>First item</li><li>Second item</li></ol>');
    });

    test('generates table with HTML content', () => {
      const element = {
        id: 'table-elem',
        type: 'table',
        props: {
          html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
        },
        schemaToggles: { html: false }
      };

      const html = generateElementHTML(element);

      expect(html).toContain('data-element-id="table-elem"');
      expect(html).toContain('<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>');
    });

    test('generates map iframe', () => {
      const element = {
        id: 'map-elem',
        type: 'map',
        props: {
          embedUrl: 'https://maps.google.com/maps?q=New+York&output=embed'
        },
        schemaToggles: { embedUrl: false }
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<div');
      expect(html).toContain('data-element-id="map-elem"');
      expect(html).toContain('<iframe');
      expect(html).toContain('src="https://maps.google.com/maps?q=New+York&output=embed"');
      expect(html).toContain('</iframe>');
    });

    test('generates background image container', () => {
      const element = {
        id: 'bg-image-elem',
        type: 'image-background',
        props: {
          src: 'https://example.com/background.jpg'
        },
        schemaToggles: {},
        children: [
          {
            id: 'overlay-text',
            type: 'heading',
            props: { text: 'Overlay Text', tag: 'h2' },
            schemaToggles: {}
          }
        ]
      };

      const html = generateElementHTML(element);

      expect(html).toContain('data-element-id="bg-image-elem"');
      expect(html).toContain('class="background-image-container"');
      // src is always-enabled, so it uses Liquid variable in the background-image url
      expect(html).toContain("background-image: url('{{ section.settings.");
      expect(html).toContain('data-element-id="overlay-text"');
    });

    test('handles schema-enabled content properties with Liquid variables', () => {
      const element = {
        id: 'schema-text',
        type: 'heading',
        props: { text: 'Default Text', tag: 'h2' },
        schemaToggles: { text: true }
      };

      const html = generateElementHTML(element);

      expect(html).toContain('{{ section.settings.');
      expect(html).toContain('_text }}');
      expect(html).not.toContain('Default Text');
    });

    test('handles missing or undefined props gracefully', () => {
      const element = {
        id: 'minimal-elem',
        type: 'text',
        props: {},
        schemaToggles: { text: false }
      };

      const html = generateElementHTML(element);

      expect(html).toContain('<p');
      expect(html).toContain('data-element-id="minimal-elem"');
    });

    test('handles divider element', () => {
      const element = {
        id: 'divider-elem',
        type: 'divider',
        schemaToggles: {}
      };

      const html = generateElementHTML(element);

      expect(html).toContain('data-element-id="divider-elem"');
      expect(html).toContain('<hr');
    });
  });

  describe('generateAllElementsHTML', () => {
    test('processes multiple top-level elements', () => {
      const elements = [
        {
          id: 'elem1',
          type: 'heading',
          props: { text: 'First', tag: 'h2' },
          schemaToggles: {}
        },
        {
          id: 'elem2',
          type: 'text',
          props: { text: 'Second' },
          schemaToggles: {}
        },
        {
          id: 'elem3',
          type: 'button',
          props: { text: 'Third', url: '#' },
          schemaToggles: {}
        }
      ];

      const html = generateAllElementsHTML(elements, 'section-id');

      expect(html).toContain('data-element-id="elem1"');
      expect(html).toContain('data-element-id="elem2"');
      expect(html).toContain('data-element-id="elem3"');
      // Content uses Liquid variables since these are always-enabled
      expect(html).toContain('{{ section.settings.');
    });

    test('maintains element order', () => {
      const elements = [
        { id: 'aaa', type: 'spacer', props: {}, schemaToggles: {} },
        { id: 'bbb', type: 'spacer', props: {}, schemaToggles: {} },
        { id: 'ccc', type: 'spacer', props: {}, schemaToggles: {} }
      ];

      const html = generateAllElementsHTML(elements, 'section-id');

      const indexA = html.indexOf('data-element-id="aaa"');
      const indexB = html.indexOf('data-element-id="bbb"');
      const indexC = html.indexOf('data-element-id="ccc"');

      expect(indexA).toBeLessThan(indexB);
      expect(indexB).toBeLessThan(indexC);
    });

    test('handles empty elements array', () => {
      const html = generateAllElementsHTML([], 'section-id');
      expect(html).toBe('');
    });

    test('handles deeply nested structures', () => {
      const elements = [
        {
          id: 'root',
          type: 'container',
          children: [
            {
              id: 'level-1',
              type: 'container',
              children: [
                {
                  id: 'level-2',
                  type: 'container',
                  children: [
                    {
                      id: 'level-3',
                      type: 'text',
                      props: { text: 'Deep content' },
                      schemaToggles: {}
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];

      const html = generateAllElementsHTML(elements, 'section-id');

      expect(html).toContain('data-element-id="root"');
      expect(html).toContain('data-element-id="level-1"');
      expect(html).toContain('data-element-id="level-2"');
      expect(html).toContain('data-element-id="level-3"');
      // text is always-enabled, generates Liquid variable
      expect(html).toContain('{{ section.settings.');
    });
  });

  describe('All element types generate valid HTML', () => {
    const elementTypes = [
      { type: 'heading', props: { text: 'Test', tag: 'h2' }, schemaToggles: { text: false } },
      { type: 'text', props: { text: 'Test' }, schemaToggles: { text: false } },
      { type: 'button', props: { text: 'Click', url: '#' }, schemaToggles: { text: false, url: false } },
      { type: 'image', props: { src: 'test.jpg', alt: 'test' }, schemaToggles: { src: false } },
      { type: 'video', props: { src: 'test.mp4' }, schemaToggles: {} },
      { type: 'icon', props: { src: 'icon.svg' }, schemaToggles: { src: false } },
      { type: 'spacer', props: {}, schemaToggles: {} },
      { type: 'divider', props: {}, schemaToggles: {} },
      { type: 'container', props: {}, children: [], schemaToggles: {} },
      { type: 'list', props: { html: '<ol><li>A</li></ol>' }, schemaToggles: { html: false } },
      { type: 'unordered-list', props: { html: '<ul><li>A</li></ul>' }, schemaToggles: { html: false } },
      { type: 'table', props: { html: '<table><tr><td>A</td></tr></table>' }, schemaToggles: { html: false } },
      { type: 'map', props: { embedUrl: 'https://maps.google.com' }, schemaToggles: { embedUrl: false } },
      { type: 'image-background', props: { src: 'bg.jpg' }, schemaToggles: { src: false }, children: [] },
      { type: 'columns-2', columns: [[], []], schemaToggles: {} },
      { type: 'price', props: {}, schemaToggles: {} },
      { type: 'add-to-cart', props: {}, schemaToggles: {} },
      { type: 'accordion', props: { itemCount: 3 }, schemaToggles: {} },
      { type: 'tabs', props: { tabCount: 3 }, schemaToggles: {} },
      { type: 'countdown', props: { targetDate: '2030-01-01' }, schemaToggles: {} },
      { type: 'slideshow', props: { slideCount: 3 }, schemaToggles: {} },
      { type: 'form', props: {}, schemaToggles: {} },
      { type: 'popup', props: {}, schemaToggles: {} },
      { type: 'social-icons', props: {}, schemaToggles: {} },
      { type: 'image-gallery', props: { imageCount: 3 }, schemaToggles: {} },
      { type: 'flip-card', props: {}, schemaToggles: {} },
      { type: 'progress-bar', props: { percentage: 75 }, schemaToggles: {} },
      { type: 'before-after', props: {}, schemaToggles: {} },
      { type: 'marquee', props: { text: 'Scrolling' }, schemaToggles: {} },
      { type: 'blog-post', props: {}, schemaToggles: {} },
      { type: 'stock-counter', props: {}, schemaToggles: {} },
      { type: 'product-card', props: {}, schemaToggles: {} },
      { type: 'product-grid', props: {}, schemaToggles: {} },
      { type: 'collection-list', props: {}, schemaToggles: {} },
      { type: 'variant-selector', props: {}, schemaToggles: {} },
    ];

    elementTypes.forEach(({ type, props, schemaToggles, children, columns }) => {
      test(`${type} generates HTML with data-element-id`, () => {
        resetIdGenerator();
        const element = {
          id: `test-${type}`,
          type,
          props: props || {},
          schemaToggles: schemaToggles || {},
          ...(children !== undefined ? { children } : {}),
          ...(columns !== undefined ? { columns } : {}),
        };

        const html = generateElementHTML(element);
        expect(html).toContain(`data-element-id="test-${type}"`);
        expect(html.length).toBeGreaterThan(0);
      });
    });
  });
});
