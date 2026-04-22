import { elementDefinitions, getPropertyDef } from '@/app/_config/elementDefinitions';

describe('Element Definitions', () => {
  // All element types that should exist
  const requiredElements = [
    'button', 'column', 'columns-1', 'columns-2', 'columns-3', 'columns-4',
    'columns-5', 'columns-6', 'container', 'heading', 'icon', 'image',
    'image-background', 'list', 'map', 'spacer', 'table', 'text',
    'unordered-list', 'video', 'divider',
    // Shopify elements
    'price', 'add-to-cart', 'product-card', 'product-grid', 'collection-list', 'variant-selector',
    // Interactive elements
    'accordion', 'tabs', 'countdown', 'slideshow', 'form', 'popup',
    // New elements
    'social-icons', 'image-gallery', 'flip-card', 'progress-bar',
    'before-after', 'marquee', 'blog-post', 'stock-counter'
  ];

  requiredElements.forEach(elementType => {
    test(`${elementType} element definition exists`, () => {
      expect(elementDefinitions[elementType]).toBeDefined();
      expect(elementDefinitions[elementType].type).toBe(elementType);
      expect(elementDefinitions[elementType].displayName).toBeDefined();
    });
  });

  describe('Element Structure Validation', () => {
    Object.keys(elementDefinitions).forEach(elementType => {
      describe(`${elementType} element`, () => {
        const element = elementDefinitions[elementType];

        test('has required base properties', () => {
          expect(element.type).toBe(elementType);
          expect(element.displayName).toBeDefined();
          expect(element.category).toBeDefined();
          expect(Array.isArray(element.contentProps)).toBe(true);
          expect(Array.isArray(element.styleProps)).toBe(true);
        });

        test('content properties have required fields', () => {
          element.contentProps.forEach(prop => {
            expect(prop.name).toBeDefined();
            expect(prop.label).toBeDefined();
            expect(prop.controlType).toBeDefined();

            if (prop.canBeSchemaEditable) {
              expect(prop.schemaType).toBeDefined();
            }
          });
        });

        test('style properties have required fields', () => {
          element.styleProps.forEach(prop => {
            expect(prop.name).toBeDefined();
            expect(prop.label).toBeDefined();
            expect(prop.controlType).toBeDefined();
            expect(prop.category).toBeDefined();

            if (prop.canBeSchemaEditable) {
              expect(prop.schemaType).toBeDefined();
            }

            if (prop.responsive === true) {
              expect(typeof prop.responsive).toBe('boolean');
            }
          });
        });

        test('select/button-group properties have options', () => {
          [...element.contentProps, ...element.styleProps].forEach(prop => {
            if (['select', 'button-group', 'dropdown'].includes(prop.controlType)) {
              expect(Array.isArray(prop.options)).toBe(true);
              expect(prop.options.length).toBeGreaterThan(0);
            }
          });
        });

        test('slider properties have min/max/step', () => {
          [...element.contentProps, ...element.styleProps].forEach(prop => {
            if (prop.controlType === 'slider') {
              expect(typeof prop.min).toBe('number');
              expect(typeof prop.max).toBe('number');
              expect(typeof prop.step).toBe('number');
            }
          });
        });
      });
    });
  });

  describe('getPropertyDef helper function', () => {
    test('finds content properties', () => {
      const prop = getPropertyDef('heading', 'text');
      expect(prop).toBeDefined();
      expect(prop.name).toBe('text');
      expect(prop.label).toBe('Heading Text');
    });

    test('finds style properties', () => {
      const prop = getPropertyDef('container', 'backgroundColor');
      expect(prop).toBeDefined();
      expect(prop.name).toBe('backgroundColor');
      expect(prop.controlType).toBe('color');
    });

    test('returns null for non-existent properties', () => {
      const prop = getPropertyDef('heading', 'nonExistentProp');
      expect(prop).toBeNull();
    });

    test('returns null for non-existent element types', () => {
      const prop = getPropertyDef('nonExistentType', 'text');
      expect(prop).toBeNull();
    });
  });

  describe('Schema-editable Properties', () => {
    const validSchemaTypes = [
      'text', 'textarea', 'color', 'select', 'checkbox',
      'range', 'number', 'image_picker', 'video_picker',
      'html', 'url', 'article', 'blog', 'collection', 'page', 'product'
    ];

    Object.keys(elementDefinitions).forEach(elementType => {
      const element = elementDefinitions[elementType];

      test(`${elementType} has schema-editable properties configured correctly`, () => {
        const schemaEditableProps = [
          ...element.contentProps.filter(p => p.canBeSchemaEditable),
          ...element.styleProps.filter(p => p.canBeSchemaEditable)
        ];

        schemaEditableProps.forEach(prop => {
          expect(prop.schemaType).toBeDefined();
          expect(validSchemaTypes).toContain(prop.schemaType);
        });
      });
    });
  });

  describe('Responsive Properties', () => {
    test('all responsive properties are marked correctly', () => {
      Object.keys(elementDefinitions).forEach(elementType => {
        const element = elementDefinitions[elementType];

        element.styleProps.forEach(prop => {
          const responsiveProps = [
            'fontSize', 'lineHeight', 'width', 'height', 'minHeight',
            'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
            'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
            'gap', 'flexDirection', 'justifyContent', 'alignItems',
            'justifySelf', 'alignSelf', 'display', 'maxWidth'
          ];

          if (responsiveProps.includes(prop.name) && prop.responsive === true) {
            expect(prop.canBeSchemaEditable).toBeDefined();
          }
        });
      });
    });
  });

  describe('Control Type Validation', () => {
    const validControlTypes = [
      'text', 'textarea', 'color', 'select', 'toggle', 'dropdown',
      'slider', 'button-group', 'file', 'number', 'size', 'size-px'
    ];

    Object.keys(elementDefinitions).forEach(elementType => {
      const element = elementDefinitions[elementType];

      test(`${elementType} uses valid control types`, () => {
        [...element.contentProps, ...element.styleProps].forEach(prop => {
          expect(validControlTypes).toContain(prop.controlType);
        });
      });
    });
  });

  describe('Category Organization', () => {
    const validCategories = [
      'typography', 'colors', 'spacing', 'sizing',
      'layout', 'borders', 'effects', 'other',
      'animations', 'hover', 'visibility', 'position'
    ];

    Object.keys(elementDefinitions).forEach(elementType => {
      const element = elementDefinitions[elementType];

      test(`${elementType} style properties have valid categories`, () => {
        element.styleProps.forEach(prop => {
          expect(validCategories).toContain(prop.category);
        });
      });
    });
  });

  describe('Special Element Properties', () => {
    test('heading element has tag property', () => {
      const tagProp = elementDefinitions.heading.contentProps.find(p => p.name === 'tag');
      expect(tagProp).toBeDefined();
      expect(tagProp.options).toEqual(['h2', 'h3', 'h4', 'h5', 'h6']);
    });

    test('button element has url and openInNewTab properties', () => {
      const button = elementDefinitions.button;
      expect(button.contentProps.find(p => p.name === 'url')).toBeDefined();
      expect(button.contentProps.find(p => p.name === 'openInNewTab')).toBeDefined();
    });

    test('image element has src property', () => {
      const image = elementDefinitions.image;
      expect(image.contentProps.find(p => p.name === 'src')).toBeDefined();
    });

    test('video element has src property', () => {
      const video = elementDefinitions.video;
      expect(video.contentProps.find(p => p.name === 'src')).toBeDefined();
    });

    test('table element has HTML and styling properties', () => {
      const table = elementDefinitions.table;
      expect(table.contentProps.find(p => p.name === 'html')).toBeDefined();
      expect(table.contentProps.find(p => p.name === 'cellPadding')).toBeDefined();
      expect(table.contentProps.find(p => p.name === 'borderColor')).toBeDefined();
      expect(table.contentProps.find(p => p.name === 'stripedRows')).toBeDefined();
    });

    test('list elements have HTML property', () => {
      expect(elementDefinitions.list.contentProps.find(p => p.name === 'html')).toBeDefined();
      expect(elementDefinitions['unordered-list'].contentProps.find(p => p.name === 'html')).toBeDefined();
    });

    test('accordion has itemCount property', () => {
      const accordion = elementDefinitions.accordion;
      expect(accordion.contentProps.find(p => p.name === 'itemCount')).toBeDefined();
    });

    test('tabs has tabCount property', () => {
      const tabs = elementDefinitions.tabs;
      expect(tabs.contentProps.find(p => p.name === 'tabCount')).toBeDefined();
    });

    test('countdown has targetDate property', () => {
      const countdown = elementDefinitions.countdown;
      expect(countdown.contentProps.find(p => p.name === 'targetDate')).toBeDefined();
    });

    test('form has submit text and field toggles', () => {
      const form = elementDefinitions.form;
      expect(form.contentProps.find(p => p.name === 'submitText')).toBeDefined();
      expect(form.contentProps.find(p => p.name === 'showName')).toBeDefined();
      expect(form.contentProps.find(p => p.name === 'showEmail')).toBeDefined();
    });

    test('social-icons has platform URLs', () => {
      const socialIcons = elementDefinitions['social-icons'];
      expect(socialIcons.contentProps.find(p => p.name === 'facebook')).toBeDefined();
      expect(socialIcons.contentProps.find(p => p.name === 'instagram')).toBeDefined();
      expect(socialIcons.contentProps.find(p => p.name === 'twitter')).toBeDefined();
    });

    test('flip-card has front and back content', () => {
      const flipCard = elementDefinitions['flip-card'];
      expect(flipCard.contentProps.find(p => p.name === 'frontTitle')).toBeDefined();
      expect(flipCard.contentProps.find(p => p.name === 'backTitle')).toBeDefined();
    });

    test('progress-bar has percentage and label', () => {
      const progressBar = elementDefinitions['progress-bar'];
      expect(progressBar.contentProps.find(p => p.name === 'percentage')).toBeDefined();
      expect(progressBar.contentProps.find(p => p.name === 'label')).toBeDefined();
    });

    test('before-after has image props', () => {
      const beforeAfter = elementDefinitions['before-after'];
      expect(beforeAfter.contentProps.find(p => p.name === 'beforeImage')).toBeDefined();
      expect(beforeAfter.contentProps.find(p => p.name === 'afterImage')).toBeDefined();
    });

    test('marquee has text and speed', () => {
      const marquee = elementDefinitions.marquee;
      expect(marquee.contentProps.find(p => p.name === 'text')).toBeDefined();
      expect(marquee.contentProps.find(p => p.name === 'speed')).toBeDefined();
    });

    test('container has backgroundVideo prop', () => {
      const container = elementDefinitions.container;
      expect(container.contentProps.find(p => p.name === 'backgroundVideo')).toBeDefined();
    });

    test('variant-selector has selectorStyle', () => {
      const vs = elementDefinitions['variant-selector'];
      expect(vs.contentProps.find(p => p.name === 'selectorStyle')).toBeDefined();
    });

    test('stock-counter has threshold and stock text', () => {
      const sc = elementDefinitions['stock-counter'];
      expect(sc.contentProps.find(p => p.name === 'lowStockThreshold')).toBeDefined();
      expect(sc.contentProps.find(p => p.name === 'inStockText')).toBeDefined();
    });
  });

  describe('All element types have unique types', () => {
    test('no duplicate type values', () => {
      const types = Object.values(elementDefinitions).map(e => e.type);
      const uniqueTypes = new Set(types);
      expect(uniqueTypes.size).toBe(types.length);
    });
  });

  describe('All element types have at least one prop', () => {
    Object.keys(elementDefinitions).forEach(elementType => {
      test(`${elementType} has content or style props`, () => {
        const el = elementDefinitions[elementType];
        const totalProps = el.contentProps.length + el.styleProps.length;
        expect(totalProps).toBeGreaterThan(0);
      });
    });
  });
});
