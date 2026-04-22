/**
 * Schema Validation System
 *
 * Enhanced validation for schema-enabled properties to ensure
 * correct Liquid generation and provide helpful user feedback
 */

import { elementDefinitions } from '@/app/_config/elementDefinitions';

/**
 * Validation result structure
 */
class ValidationResult {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
    this.stats = {};
  }

  addError(message, elementId, propertyName) {
    this.errors.push({ message, elementId, propertyName, severity: 'error' });
  }

  addWarning(message, elementId, propertyName) {
    this.warnings.push({ message, elementId, propertyName, severity: 'warning' });
  }

  addSuggestion(message, elementId, propertyName) {
    this.suggestions.push({ message, elementId, propertyName, severity: 'suggestion' });
  }

  get isValid() {
    return this.errors.length === 0;
  }

  get hasIssues() {
    return this.errors.length > 0 || this.warnings.length > 0;
  }
}

/**
 * Validate Shopify setting ID format
 */
const isValidSettingId = (id) => {
  // Shopify setting IDs must be alphanumeric with underscores, no hyphens
  return /^[a-zA-Z0-9_]+$/.test(id);
};

/**
 * Validate that a property can be schema-enabled
 */
const canPropertyBeSchemaEnabled = (elementType, propertyName, propertyCategory) => {
  const elementDef = elementDefinitions[elementType];
  if (!elementDef) return false;

  // Check content properties
  if (propertyCategory === 'content') {
    const prop = elementDef.contentProps?.find(p => p.name === propertyName);
    return prop?.canBeSchemaEditable === true;
  }

  // Check style properties
  if (propertyCategory === 'style') {
    const prop = elementDef.styleProps?.find(p => p.name === propertyName);
    return prop?.canBeSchemaEditable === true;
  }

  return false;
};

/**
 * Check for property conflicts
 */
const checkPropertyConflicts = (element, result) => {
  const toggledProps = Object.keys(element.schemaToggles || {})
    .filter(key => element.schemaToggles[key] === true);

  // Check for conflicting properties
  if (toggledProps.includes('display') || toggledProps.includes('position')) {
    result.addWarning(
      'Structural CSS properties (display, position) should not be schema-enabled as they may break layouts',
      element.id,
      'display/position'
    );
  }

  // Check for related properties that should be toggled together
  if (toggledProps.includes('text') && element.type === 'button' && !toggledProps.includes('url')) {
    result.addSuggestion(
      'Consider enabling schema toggle for button URL along with button text',
      element.id,
      'url'
    );
  }

  if (toggledProps.includes('src') && element.type === 'image' && !toggledProps.includes('alt')) {
    result.addSuggestion(
      'Consider enabling schema toggle for image alt text along with image source',
      element.id,
      'alt'
    );
  }

  if (toggledProps.includes('backgroundColor') && !toggledProps.includes('color')) {
    result.addSuggestion(
      'Consider enabling text color toggle when background color is toggled',
      element.id,
      'color'
    );
  }
};

/**
 * Validate element ID format
 */
const validateElementId = (element, result) => {
  if (!element.id) {
    result.addError('Element missing ID', element.id, null);
    return;
  }

  // Check if ID is too short (may cause collisions)
  if (element.id.length < 6) {
    result.addWarning(
      'Element ID is very short - consider using longer IDs to avoid collisions',
      element.id,
      null
    );
  }

  // Check for special characters that might cause issues
  if (!/^[a-zA-Z0-9-_]+$/.test(element.id)) {
    result.addError(
      'Element ID contains invalid characters - use only letters, numbers, hyphens, and underscores',
      element.id,
      null
    );
  }
};

/**
 * Validate responsive properties
 */
const validateResponsiveProperties = (element, result) => {
  const elementDef = elementDefinitions[element.type];
  if (!elementDef) return;

  const toggledProps = Object.keys(element.schemaToggles || {})
    .filter(key => element.schemaToggles[key] === true);

  toggledProps.forEach(propName => {
    const styleProp = elementDef.styleProps?.find(p => p.name === propName);

    if (styleProp?.responsive === true) {
      // Check if responsive styles exist for this property
      if (!element.responsiveStyles?.[propName]) {
        result.addWarning(
          `Responsive property "${propName}" is toggled but has no responsive values defined`,
          element.id,
          propName
        );
      } else {
        // Check if at least one breakpoint has a value
        const hasAnyValue = Object.values(element.responsiveStyles[propName]).some(v => v !== undefined);
        if (!hasAnyValue) {
          result.addWarning(
            `Responsive property "${propName}" is toggled but has no values for any breakpoint`,
            element.id,
            propName
          );
        }
      }
    }
  });
};

/**
 * Validate schema value types and formats
 */
const validateSchemaValues = (element, result) => {
  const elementDef = elementDefinitions[element.type];
  if (!elementDef) return;

  const toggledProps = Object.keys(element.schemaToggles || {})
    .filter(key => element.schemaToggles[key] === true);

  toggledProps.forEach(propName => {
    // Find the property definition
    const contentProp = elementDef.contentProps?.find(p => p.name === propName);
    const styleProp = elementDef.styleProps?.find(p => p.name === propName);
    const prop = contentProp || styleProp;

    if (!prop) {
      result.addError(
        `Property "${propName}" is toggled but not defined in element definition`,
        element.id,
        propName
      );
      return;
    }

    // Check if property can be schema-enabled
    if (!prop.canBeSchemaEditable) {
      result.addError(
        `Property "${propName}" cannot be made schema-editable`,
        element.id,
        propName
      );
    }

    // Validate value types
    const value = contentProp ? element.props?.[propName] : element.style?.[propName];

    if (prop.controlType === 'color' && value) {
      // Validate color format
      if (!/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^rgb|^rgba|^hsl|^hsla/.test(value)) {
        result.addWarning(
          `Color value "${value}" may not be in a valid format`,
          element.id,
          propName
        );
      }
    }

    if (prop.controlType === 'slider' || prop.schemaType === 'range') {
      // Check if value is within range
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (prop.min !== undefined && numValue < prop.min) {
          result.addWarning(
            `Value ${numValue} is below minimum ${prop.min}`,
            element.id,
            propName
          );
        }
        if (prop.max !== undefined && numValue > prop.max) {
          result.addWarning(
            `Value ${numValue} is above maximum ${prop.max}`,
            element.id,
            propName
          );
        }
      }
    }

    // Check for excessively long text values
    if (prop.controlType === 'text' && value && value.length > 255) {
      result.addWarning(
        `Text value is very long (${value.length} chars) - consider using textarea instead`,
        element.id,
        propName
      );
    }
  });
};

/**
 * Check for setting ID collisions
 */
const checkSettingIdCollisions = (elements, result) => {
  const settingIds = new Map();

  const processElement = (element) => {
    const toggledProps = Object.keys(element.schemaToggles || {})
      .filter(key => element.schemaToggles[key] === true);

    toggledProps.forEach(propName => {
      const elementDef = elementDefinitions[element.type];
      const styleProp = elementDef?.styleProps?.find(p => p.name === propName);
      const isResponsive = styleProp?.responsive === true;

      if (isResponsive) {
        // Responsive properties generate 3 settings
        ['mobile', 'desktop', 'fullscreen'].forEach(breakpoint => { // Schema breakpoint names (Shopify)
          const settingId = `${element.id.substring(0, 8)}_${propName}_${breakpoint}`;

          if (settingIds.has(settingId)) {
            result.addError(
              `Setting ID collision detected: "${settingId}" is used by multiple elements`,
              element.id,
              propName
            );
          } else {
            settingIds.set(settingId, { elementId: element.id, propName, breakpoint });
          }
        });
      } else {
        // Non-responsive property
        const cleanId = element.id ? element.id.replace(/-/g, '_') : 'unknown';
        const settingId = `${cleanId}_${propName}`;

        if (settingIds.has(settingId)) {
          result.addError(
            `Setting ID collision detected: "${settingId}" is used by multiple elements`,
            element.id,
            propName
          );
        } else {
          settingIds.set(settingId, { elementId: element.id, propName });
        }
      }
    });

    // Process children
    if (element.children) {
      element.children.forEach(processElement);
    }

    // Process columns
    if (element.columns) {
      element.columns.forEach(column => {
        if (Array.isArray(column)) {
          column.forEach(processElement);
        }
      });
    }
  };

  elements.forEach(processElement);

  result.stats.totalSettings = settingIds.size;
};

/**
 * Calculate and validate schema complexity
 */
const validateSchemaComplexity = (elements, result) => {
  let totalToggles = 0;
  let elementsWithToggles = 0;
  let maxTogglesPerElement = 0;
  let totalElements = 0;

  const processElement = (element) => {
    totalElements++;

    const toggleCount = Object.values(element.schemaToggles || {})
      .filter(v => v === true).length;

    if (toggleCount > 0) {
      elementsWithToggles++;
      totalToggles += toggleCount;
      maxTogglesPerElement = Math.max(maxTogglesPerElement, toggleCount);

      // Warn if single element has too many toggles
      if (toggleCount > 10) {
        result.addWarning(
          `Element has ${toggleCount} toggled properties - consider reducing for better UX`,
          element.id,
          null
        );
      }
    }

    // Process children
    if (element.children) {
      element.children.forEach(processElement);
    }

    // Process columns
    if (element.columns) {
      element.columns.forEach(column => {
        if (Array.isArray(column)) {
          column.forEach(processElement);
        }
      });
    }
  };

  elements.forEach(processElement);

  // Store stats
  result.stats.totalElements = totalElements;
  result.stats.elementsWithToggles = elementsWithToggles;
  result.stats.totalToggles = totalToggles;
  result.stats.maxTogglesPerElement = maxTogglesPerElement;
  result.stats.averageTogglesPerElement = totalElements > 0
    ? (totalToggles / totalElements).toFixed(1)
    : 0;

  // Overall complexity warnings
  if (totalToggles > 50) {
    result.addWarning(
      `Section has ${totalToggles} total toggles - this may be overwhelming in theme customizer`,
      null,
      null
    );
  }

  if (totalToggles === 0) {
    result.addSuggestion(
      'No schema toggles are enabled - consider making some properties editable',
      null,
      null
    );
  }
};

/**
 * Validate image and media properties
 */
const validateMediaProperties = (element, result) => {
  if (element.type === 'image' || element.type === 'video') {
    const srcToggled = element.schemaToggles?.src === true;

    if (srcToggled && element.props?.src?.startsWith('data:')) {
      // Base64 image will be converted to image_picker
      result.stats.base64ImagesFound = (result.stats.base64ImagesFound || 0) + 1;
    }

    if (element.type === 'image' && !element.props?.alt) {
      result.addWarning(
        'Image missing alt text for accessibility',
        element.id,
        'alt'
      );
    }
  }

  if (element.type === 'video') {
    if (element.props?.autoplay && !element.props?.muted) {
      result.addWarning(
        'Autoplay videos should be muted for better user experience',
        element.id,
        'muted'
      );
    }
  }
};

/**
 * Main validation function
 */
export const validateSchemaToggles = (elements) => {
  const result = new ValidationResult();

  // Initialize stats
  result.stats = {
    totalElements: 0,
    elementsWithToggles: 0,
    totalToggles: 0,
    totalSettings: 0,
    maxTogglesPerElement: 0,
    averageTogglesPerElement: 0,
    base64ImagesFound: 0
  };

  // Validate individual elements
  const processElement = (element) => {
    validateElementId(element, result);
    validateSchemaValues(element, result);
    validateResponsiveProperties(element, result);
    checkPropertyConflicts(element, result);
    validateMediaProperties(element, result);

    // Process children
    if (element.children) {
      element.children.forEach(processElement);
    }

    // Process columns
    if (element.columns) {
      element.columns.forEach(column => {
        if (Array.isArray(column)) {
          column.forEach(processElement);
        }
      });
    }
  };

  elements.forEach(processElement);

  // Validate overall structure
  checkSettingIdCollisions(elements, result);
  validateSchemaComplexity(elements, result);

  return result;
};

/**
 * Format validation result for display
 */
export const formatValidationResult = (result) => {
  let output = [];

  if (result.isValid && !result.hasIssues && result.suggestions.length === 0) {
    output.push('✅ Schema validation passed - no issues found!');
    output.push('');
  }

  // Display errors
  if (result.errors.length > 0) {
    output.push('❌ ERRORS (must fix before export):');
    result.errors.forEach(error => {
      const location = error.elementId ? ` [${error.elementId.substring(0, 8)}]` : '';
      const property = error.propertyName ? ` (${error.propertyName})` : '';
      output.push(`  • ${error.message}${location}${property}`);
    });
    output.push('');
  }

  // Display warnings
  if (result.warnings.length > 0) {
    output.push('⚠️  WARNINGS (should review):');
    result.warnings.forEach(warning => {
      const location = warning.elementId ? ` [${warning.elementId.substring(0, 8)}]` : '';
      const property = warning.propertyName ? ` (${warning.propertyName})` : '';
      output.push(`  • ${warning.message}${location}${property}`);
    });
    output.push('');
  }

  // Display suggestions
  if (result.suggestions.length > 0) {
    output.push('💡 SUGGESTIONS (optional improvements):');
    result.suggestions.forEach(suggestion => {
      const location = suggestion.elementId ? ` [${suggestion.elementId.substring(0, 8)}]` : '';
      const property = suggestion.propertyName ? ` (${suggestion.propertyName})` : '';
      output.push(`  • ${suggestion.message}${location}${property}`);
    });
    output.push('');
  }

  // Display stats
  output.push('📊 STATISTICS:');
  output.push(`  • Total elements: ${result.stats.totalElements}`);
  output.push(`  • Elements with toggles: ${result.stats.elementsWithToggles}`);
  output.push(`  • Total toggles: ${result.stats.totalToggles}`);
  output.push(`  • Average toggles per element: ${result.stats.averageTogglesPerElement}`);
  output.push(`  • Max toggles on single element: ${result.stats.maxTogglesPerElement}`);
  output.push(`  • Total Shopify settings: ${result.stats.totalSettings}`);

  if (result.stats.base64ImagesFound > 0) {
    output.push(`  • Base64 images to convert: ${result.stats.base64ImagesFound}`);
  }

  return output.join('\n');
};

/**
 * Quick validation check (for real-time feedback)
 */
export const quickValidateProperty = (element, propertyName, propertyCategory) => {
  // Check if property can be schema-enabled
  if (!canPropertyBeSchemaEnabled(element.type, propertyName, propertyCategory)) {
    return {
      valid: false,
      message: 'This property cannot be made schema-editable'
    };
  }

  // Check for structural properties
  if (['display', 'position', 'flexDirection', 'gridTemplate'].includes(propertyName)) {
    return {
      valid: true,
      warning: 'Structural properties may break layouts if made editable'
    };
  }

  // Check element ID
  if (!element.id || element.id.length < 4) {
    return {
      valid: false,
      message: 'Element needs a valid ID for schema generation'
    };
  }

  return { valid: true };
};

export default {
  validateSchemaToggles,
  formatValidationResult,
  quickValidateProperty,
  ValidationResult
};