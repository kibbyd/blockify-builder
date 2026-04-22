/**
 * Default Toggle Consistency Tests
 *
 * Detects mismatches between getDefaultStyle/getDefaultProps and getDefaultSchemaToggles.
 *
 * The pattern: for a property to be pre-toggled on when an element is dragged to canvas,
 * TWO pieces are required:
 *   1. A value in getDefaultStyle (styleProps) or getDefaultProps (contentProps)
 *   2. An entry in getDefaultSchemaToggles set to true
 *
 * Without the value, the property shows as disabled.
 * Without the schema toggle, "Editable in Shopify" is unchecked.
 *
 * These tests catch gaps where one piece exists without the other.
 */

// Mock all heavy dependencies that BlockBuilder imports
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
jest.mock('@/app/_utils/licenseManager', () => ({
  __esModule: true,
  default: { isActive: () => true },
}));

import { elementDefinitions } from '@/app/_config/elementDefinitions';
import { getDefaultStyle, getDefaultProps, getDefaultSchemaToggles } from '@/app/_components/BlockBuilder';

// Element types that are structural/layout containers — these may intentionally
// have no schema toggles because they aren't directly customized in Shopify
const STRUCTURAL_TYPES = ['column'];

const elementTypes = Object.keys(elementDefinitions).filter(
  (type) => !STRUCTURAL_TYPES.includes(type)
);

describe('Default Toggle Consistency', () => {
  describe('Every schema toggle should have a corresponding default value', () => {
    elementTypes.forEach((type) => {
      const toggles = getDefaultSchemaToggles(type);
      if (!toggles || Object.keys(toggles).length === 0) return;

      const defaultStyle = getDefaultStyle(type);
      const defaultProps = getDefaultProps(type);
      const elementDef = elementDefinitions[type];

      const allStylePropNames = (elementDef.styleProps || []).map((p) => p.name);
      const allContentPropNames = (elementDef.contentProps || []).map((p) => p.name);

      Object.keys(toggles).forEach((propName) => {
        test(`${type}: toggle "${propName}" has a default value`, () => {
          const hasStyleValue = defaultStyle && defaultStyle[propName] !== undefined;
          const hasPropsValue = defaultProps && defaultProps[propName] !== undefined;
          const isStyleProp = allStylePropNames.includes(propName);
          const isContentProp = allContentPropNames.includes(propName);

          // Find the elementDef default as fallback
          const propDef = [...(elementDef.styleProps || []), ...(elementDef.contentProps || [])].find(
            (p) => p.name === propName
          );
          const hasElementDefDefault = propDef && propDef.default !== undefined && propDef.default !== null;

          const hasValue = hasStyleValue || hasPropsValue || hasElementDefDefault;

          if (!hasValue) {
            throw new Error(
              `${type}: "${propName}" is in getDefaultSchemaToggles but has no value in ` +
              `getDefaultStyle, getDefaultProps, or elementDefinitions default. ` +
              `${isStyleProp ? '(styleProp — add to getDefaultStyle)' : ''}` +
              `${isContentProp ? '(contentProp — add to getDefaultProps)' : ''}` +
              `${!isStyleProp && !isContentProp ? '(NOT FOUND in elementDefinitions!)' : ''}`
            );
          }
        });
      });
    });
  });

  describe('Every default style value should have a schema toggle (if canBeSchemaEditable)', () => {
    elementTypes.forEach((type) => {
      const defaultStyle = getDefaultStyle(type);
      if (!defaultStyle || Object.keys(defaultStyle).length === 0) return;

      const toggles = getDefaultSchemaToggles(type);
      const elementDef = elementDefinitions[type];
      const styleProps = elementDef.styleProps || [];

      Object.keys(defaultStyle).forEach((propName) => {
        const propDef = styleProps.find((p) => p.name === propName);

        // Only test properties that are defined in elementDefinitions and can be schema-editable
        if (!propDef || !propDef.canBeSchemaEditable) return;

        test(`${type}: style "${propName}" has a schema toggle`, () => {
          const hasToggle = toggles && toggles[propName] === true;

          if (!hasToggle) {
            throw new Error(
              `${type}: "${propName}" has value "${defaultStyle[propName]}" in getDefaultStyle ` +
              `but is missing from getDefaultSchemaToggles. Add \`${propName}: true\` to the ` +
              `"${type}" entry in getDefaultSchemaToggles.`
            );
          }
        });
      });
    });
  });

  describe('Every default content prop should have a schema toggle (if canBeSchemaEditable)', () => {
    elementTypes.forEach((type) => {
      const defaultProps = getDefaultProps(type);
      if (!defaultProps || Object.keys(defaultProps).length === 0) return;

      const toggles = getDefaultSchemaToggles(type);
      const elementDef = elementDefinitions[type];
      const contentProps = elementDef.contentProps || [];

      Object.keys(defaultProps).forEach((propName) => {
        const propDef = contentProps.find((p) => p.name === propName);

        // Only test properties that are defined in elementDefinitions and can be schema-editable
        if (!propDef || !propDef.canBeSchemaEditable) return;

        test(`${type}: prop "${propName}" has a schema toggle`, () => {
          const hasToggle = toggles && toggles[propName] === true;

          if (!hasToggle) {
            throw new Error(
              `${type}: "${propName}" has value in getDefaultProps ` +
              `but is missing from getDefaultSchemaToggles. Add \`${propName}: true\` to the ` +
              `"${type}" entry in getDefaultSchemaToggles.`
            );
          }
        });
      });
    });
  });
});
