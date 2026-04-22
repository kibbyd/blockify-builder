/**
 * Schema Validation Tests
 *
 * Tests for the enhanced validation system for schema-enabled properties
 */

import schemaValidation from '@/app/_utils/schemaValidation';

const {
  validateSchemaToggles,
  formatValidationResult,
  quickValidateProperty,
  ValidationResult
} = schemaValidation;

describe('Schema Validation System', () => {
  describe('ValidationResult Class', () => {
    test('initializes with empty arrays and stats', () => {
      const result = new ValidationResult();
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
      expect(result.suggestions).toEqual([]);
      expect(result.stats).toEqual({});
      expect(result.isValid).toBe(true);
      expect(result.hasIssues).toBe(false);
    });

    test('tracks errors correctly', () => {
      const result = new ValidationResult();
      result.addError('Test error', 'element-1', 'prop1');

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        message: 'Test error',
        elementId: 'element-1',
        propertyName: 'prop1',
        severity: 'error'
      });
      expect(result.isValid).toBe(false);
      expect(result.hasIssues).toBe(true);
    });

    test('tracks warnings correctly', () => {
      const result = new ValidationResult();
      result.addWarning('Test warning', 'element-2', 'prop2');

      expect(result.warnings).toHaveLength(1);
      expect(result.isValid).toBe(true);
      expect(result.hasIssues).toBe(true);
    });

    test('tracks suggestions correctly', () => {
      const result = new ValidationResult();
      result.addSuggestion('Test suggestion', 'element-3', 'prop3');

      expect(result.suggestions).toHaveLength(1);
      expect(result.isValid).toBe(true);
      expect(result.hasIssues).toBe(false);
    });
  });

  describe('Element ID Validation', () => {
    test('validates missing element ID', () => {
      const elements = [{
        type: 'text',
        schemaToggles: { text: true }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.errors.some(e => e.message.includes('missing ID'))).toBe(true);
    });

    test('warns about short element IDs', () => {
      const elements = [{
        id: 'abc',
        type: 'text',
        schemaToggles: { text: true }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.warnings.some(w => w.message.includes('very short'))).toBe(true);
    });

    test('validates element ID with special characters', () => {
      const elements = [{
        id: 'element@#$',
        type: 'text',
        schemaToggles: { text: true }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.errors.some(e => e.message.includes('invalid characters'))).toBe(true);
    });

    test('accepts valid element IDs', () => {
      const elements = [{
        id: 'element-123_test',
        type: 'text',
        schemaToggles: { text: true },
        props: { text: 'Test' }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.errors.filter(e => e.message.includes('ID')).length).toBe(0);
    });
  });

  describe('Property Validation', () => {
    test('validates toggled properties exist in element definition', () => {
      const elements = [{
        id: 'test-element',
        type: 'text',
        schemaToggles: {
          nonExistentProp: true
        }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.errors.some(e =>
        e.message.includes('not defined in element definition')
      )).toBe(true);
    });

    test('validates properties can be schema-enabled', () => {
      const elements = [{
        id: 'test-element',
        type: 'heading',
        schemaToggles: {
          text: true,  // This should be valid (can be schema-enabled)
          someInvalidProp: true    // This property doesn't exist in definition
        },
        props: { text: 'Test Heading' },
        style: { display: 'block' }  // display exists but canBeSchemaEditable is false
      }];

      const result = validateSchemaToggles(elements);
      // Check for the non-existent property error
      expect(result.errors.some(e =>
        e.message.includes('not defined in element definition') &&
        e.propertyName === 'someInvalidProp'
      )).toBe(true);
    });

    test('warns about structural CSS properties', () => {
      const elements = [{
        id: 'test-element',
        type: 'container',
        schemaToggles: {
          display: true,
          position: true
        },
        style: { display: 'flex', position: 'relative' }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.warnings.some(w =>
        w.message.includes('Structural CSS properties')
      )).toBe(true);
    });
  });

  describe('Responsive Property Validation', () => {
    test('warns about responsive properties without values', () => {
      const elements = [{
        id: 'test-element',
        type: 'text',
        schemaToggles: {
          paddingTop: true  // This is a responsive property
        },
        style: { paddingTop: '10px' }
        // No responsiveStyles defined
      }];

      const result = validateSchemaToggles(elements);
      expect(result.warnings.some(w =>
        w.message.includes('no responsive values defined')
      )).toBe(true);
    });

    test('validates responsive properties with values', () => {
      const elements = [{
        id: 'test-element',
        type: 'text',
        schemaToggles: {
          paddingTop: true
        },
        style: { paddingTop: '10px' },
        responsiveStyles: {
          paddingTop: {
            mobile: '5px',
            desktop: '10px',
            fullscreen: '15px'
          }
        }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.warnings.filter(w =>
        w.message.includes('responsive') && w.propertyName === 'paddingTop'
      ).length).toBe(0);
    });
  });

  describe('Property Relationship Validation', () => {
    test('suggests related button properties', () => {
      const elements = [{
        id: 'test-button',
        type: 'button',
        schemaToggles: {
          text: true
          // URL not toggled
        },
        props: { text: 'Click me', url: '#' }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.suggestions.some(s =>
        s.message.includes('button URL')
      )).toBe(true);
    });

    test('suggests related image properties', () => {
      const elements = [{
        id: 'test-image',
        type: 'image',
        schemaToggles: {
          src: true
          // Alt not toggled
        },
        props: { src: 'image.jpg' }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.suggestions.some(s =>
        s.message.includes('alt text')
      )).toBe(true);
    });

    test('suggests related color properties', () => {
      const elements = [{
        id: 'test-element',
        type: 'text',
        schemaToggles: {
          backgroundColor: true
          // Text color not toggled
        },
        style: { backgroundColor: '#fff' }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.suggestions.some(s =>
        s.message.includes('text color')
      )).toBe(true);
    });
  });

  describe('Schema Complexity Validation', () => {
    test('warns about too many toggles on single element', () => {
      const toggles = {};
      // Create 12 toggles
      for (let i = 1; i <= 12; i++) {
        toggles[`prop${i}`] = true;
      }

      const elements = [{
        id: 'over-toggled',
        type: 'container',
        schemaToggles: toggles
      }];

      const result = validateSchemaToggles(elements);
      expect(result.warnings.some(w =>
        w.message.includes('toggled properties - consider reducing')
      )).toBe(true);
    });

    test('warns about too many total toggles', () => {
      const elements = [];
      // Create 60 elements with 1 toggle each
      for (let i = 0; i < 60; i++) {
        elements.push({
          id: `element-${i}`,
          type: 'text',
          schemaToggles: { text: true },
          props: { text: `Text ${i}` }
        });
      }

      const result = validateSchemaToggles(elements);
      expect(result.warnings.some(w =>
        w.message.includes('total toggles - this may be overwhelming')
      )).toBe(true);
    });

    test('suggests enabling toggles when none exist', () => {
      const elements = [{
        id: 'no-toggles',
        type: 'text',
        props: { text: 'Some text' }
        // No schemaToggles
      }];

      const result = validateSchemaToggles(elements);
      expect(result.suggestions.some(s =>
        s.message.includes('No schema toggles are enabled')
      )).toBe(true);
    });

    test('calculates statistics correctly', () => {
      const elements = [
        {
          id: 'element-1',
          type: 'text',
          schemaToggles: { text: true, fontSize: true },
          props: { text: 'Text 1' }
        },
        {
          id: 'element-2',
          type: 'button',
          schemaToggles: { text: true },
          props: { text: 'Button' }
        },
        {
          id: 'element-3',
          type: 'image',
          // No toggles
          props: { src: 'image.jpg' }
        }
      ];

      const result = validateSchemaToggles(elements);
      expect(result.stats.totalElements).toBe(3);
      expect(result.stats.elementsWithToggles).toBe(2);
      expect(result.stats.totalToggles).toBe(3);
      expect(result.stats.maxTogglesPerElement).toBe(2);
      expect(result.stats.averageTogglesPerElement).toBe('1.0');
    });
  });

  describe('Setting ID Collision Detection', () => {
    test('detects setting ID collisions', () => {
      const elements = [
        {
          id: 'element-1',
          type: 'text',
          schemaToggles: { text: true },
          props: { text: 'Text 1' }
        },
        {
          id: 'element-1',  // Same ID
          type: 'heading',
          schemaToggles: { text: true },
          props: { text: 'Heading' }
        }
      ];

      const result = validateSchemaToggles(elements);
      expect(result.errors.some(e =>
        e.message.includes('Setting ID collision')
      )).toBe(true);
    });
  });

  describe('Media Property Validation', () => {
    test('warns about missing image alt text', () => {
      const elements = [{
        id: 'test-image',
        type: 'image',
        schemaToggles: { src: true },
        props: { src: 'image.jpg' }  // No alt
      }];

      const result = validateSchemaToggles(elements);
      expect(result.warnings.some(w =>
        w.message.includes('missing alt text')
      )).toBe(true);
    });

    test('warns about autoplay videos without mute', () => {
      const elements = [{
        id: 'test-video',
        type: 'video',
        schemaToggles: { src: true },
        props: {
          src: 'video.mp4',
          autoplay: true,
          muted: false
        }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.warnings.some(w =>
        w.message.includes('should be muted')
      )).toBe(true);
    });

    test('counts base64 images', () => {
      const elements = [{
        id: 'test-image',
        type: 'image',
        schemaToggles: { src: true },
        props: {
          src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          alt: 'Test'
        }
      }];

      const result = validateSchemaToggles(elements);
      expect(result.stats.base64ImagesFound).toBe(1);
    });
  });

  describe('Nested Element Validation', () => {
    test('validates nested children', () => {
      const elements = [{
        id: 'container',
        type: 'container',
        children: [
          {
            id: 'child-1',
            type: 'text',
            schemaToggles: { text: true },
            props: { text: 'Child text' }
          },
          {
            id: 'child-2',
            type: 'button',
            schemaToggles: { invalidProp: true }
          }
        ]
      }];

      const result = validateSchemaToggles(elements);
      // Should find error in nested child
      expect(result.errors.some(e =>
        e.elementId === 'child-2'
      )).toBe(true);
    });

    test('validates column elements', () => {
      const elements = [{
        id: 'columns',
        type: 'columns-2',
        columns: [
          [
            {
              id: 'col-1-elem',
              type: 'text',
              schemaToggles: { text: true },
              props: { text: 'Column 1' }
            }
          ],
          [
            {
              id: 'col-2-elem',
              type: 'image',
              schemaToggles: { src: true }
              // Missing alt text should trigger warning
            }
          ]
        ]
      }];

      const result = validateSchemaToggles(elements);
      expect(result.warnings.some(w =>
        w.elementId === 'col-2-elem' && w.message.includes('alt text')
      )).toBe(true);
    });
  });

  describe('Quick Validation', () => {
    test('validates property can be schema-enabled', () => {
      const element = {
        id: 'test-element',
        type: 'text'
      };

      const result1 = quickValidateProperty(element, 'text', 'content');
      expect(result1.valid).toBe(true);

      const result2 = quickValidateProperty(element, 'nonExistent', 'content');
      expect(result2.valid).toBe(false);
    });

    test('warns about structural properties', () => {
      const element = {
        id: 'test-element',
        type: 'container'
      };

      const result = quickValidateProperty(element, 'display', 'style');
      expect(result.valid).toBe(true);
      expect(result.warning).toContain('may break layouts');
    });

    test('validates element has ID', () => {
      const element1 = {
        type: 'text'
        // No ID
      };

      const result1 = quickValidateProperty(element1, 'text', 'content');
      expect(result1.valid).toBe(false);
      expect(result1.message).toContain('needs a valid ID');

      const element2 = {
        id: 'ab',  // Too short
        type: 'text'
      };

      const result2 = quickValidateProperty(element2, 'text', 'content');
      expect(result2.valid).toBe(false);
    });
  });

  describe('Format Validation Result', () => {
    test('formats clean result correctly', () => {
      const result = new ValidationResult();
      result.stats = {
        totalElements: 5,
        elementsWithToggles: 3,
        totalToggles: 7,
        averageTogglesPerElement: '1.4',
        maxTogglesPerElement: 3,
        totalSettings: 7
      };

      const formatted = formatValidationResult(result);
      expect(formatted).toContain('✅ Schema validation passed');
      expect(formatted).toContain('Total elements: 5');
    });

    test('formats errors, warnings, and suggestions', () => {
      const result = new ValidationResult();
      result.addError('Test error', 'elem-1', 'prop1');
      result.addWarning('Test warning', 'elem-2', 'prop2');
      result.addSuggestion('Test suggestion', 'elem-3', 'prop3');
      result.stats = {
        totalElements: 1,
        elementsWithToggles: 1,
        totalToggles: 1,
        averageTogglesPerElement: '1.0',
        maxTogglesPerElement: 1,
        totalSettings: 1
      };

      const formatted = formatValidationResult(result);
      expect(formatted).toContain('❌ ERRORS');
      expect(formatted).toContain('Test error');
      expect(formatted).toContain('⚠️  WARNINGS');
      expect(formatted).toContain('Test warning');
      expect(formatted).toContain('💡 SUGGESTIONS');
      expect(formatted).toContain('Test suggestion');
    });

    test('includes element and property info in formatting', () => {
      const result = new ValidationResult();
      result.addError('Error message', 'element-abc-123', 'fontSize');
      result.stats = {
        totalElements: 1,
        elementsWithToggles: 1,
        totalToggles: 1,
        averageTogglesPerElement: '1.0',
        maxTogglesPerElement: 1,
        totalSettings: 1
      };

      const formatted = formatValidationResult(result);
      expect(formatted).toContain('[element-');  // Truncated element ID
      expect(formatted).toContain('(fontSize)');  // Property name
    });
  });
});