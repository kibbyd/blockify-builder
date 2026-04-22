/**
 * Schema Generation - Schema Toggle System
 *
 * Generates Shopify schema based on element definitions and schema toggles
 */

import { elementDefinitions, getElementDef } from "@/app/_config/elementDefinitions";
import { generateSettingId } from "@/app/_utils/idGenerator";

/**
 * Sanitize a color default for Shopify schema.
 * Shopify color settings require hex codes (#rgb or #rrggbb) or blank.
 * Named CSS colors and "transparent" are not valid.
 */
const namedColorToHex = {
  white: "#ffffff", black: "#000000", red: "#ff0000", blue: "#0000ff",
  green: "#008000", gray: "#808080", grey: "#808080", yellow: "#ffff00",
  orange: "#ffa500", purple: "#800080", pink: "#ffc0cb", navy: "#000080",
};

const sanitizeColorDefault = (value, settingType) => {
  if (settingType !== "color" || !value) return value;
  const lower = String(value).toLowerCase().trim();
  if (lower === "transparent" || lower === "inherit" || lower === "initial") return undefined;
  if (namedColorToHex[lower]) return namedColorToHex[lower];
  return value;
};

/**
 * Map control types to Shopify schema types
 */
const controlTypeToSchemaType = {
  text: "text",
  textarea: "textarea",
  color: "color",
  select: "select",
  toggle: "checkbox",
  slider: "range",
  "button-group": "select",
  dropdown: "select",
  file: "image_picker",
  number: "number",
};

/**
 * Properties that should ALWAYS be in schema for specific element types
 * REVOLUTIONARY APPROACH: Maximum merchant flexibility
 * Build it perfect in Blockify Builder, tweak it easy in Shopify - NO DEVELOPERS NEEDED!
 */
const alwaysEnabledProperties = {};

/**
 * Check if a property should be enabled in schema
 */
const shouldEnableInSchema = (elementType, propertyName, schemaToggles) => {
  // Check if explicitly toggled
  if (schemaToggles?.[propertyName] === true) return true;

  // Check if it's an always-enabled property for this element type
  const alwaysEnabled = alwaysEnabledProperties[elementType] || [];
  if (alwaysEnabled.includes(propertyName)) return true;

  return false;
};

/**
 * Generate meaningful element label for schema header
 */
const truncateHeader = (str) => {
  if (str.length <= 50) return str;
  return str.substring(0, 47) + "...";
};

const generateElementLabel = (element, elementDef) => {
  const type = elementDef.displayName;

  // For text/heading elements, use first 30 chars of content
  if (element.props?.text) {
    const text = element.props.text.substring(0, 30);
    return truncateHeader(`${type}: "${text}${element.props.text.length > 30 ? "..." : ""}"`);
  }

  // For images, use alt text or filename
  if (element.type === "image" && element.props?.alt) {
    return truncateHeader(`Image: ${element.props.alt}`);
  }

  // For icons, use alt or icon name
  if (element.type === "icon") {
    if (element.props?.alt && element.props.alt !== "Icon") {
      return truncateHeader(`Icon: ${element.props.alt}`);
    }
    return `Icon`;
  }

  // For columns, just say the type
  if (element.type.startsWith("columns-") || element.type === "grid-2x2") {
    const colCount =
      element.type === "grid-2x2"
        ? "2x2 Grid"
        : `${element.type.split("-")[1]} Columns`;
    return colCount;
  }

  // For containers, skip header (they're just structural)
  if (element.type === "container") {
    return "Container Settings";
  }

  // For synthetic column elements, include column number
  if (element.type === "column" && element.id?.includes("-col-")) {
    const colIndex = parseInt(element.id.split("-col-")[1]) + 1;
    return `Column ${colIndex} Settings`;
  }

  // Default: just use type
  return truncateHeader(type);
};

/**
 * Generate schema settings for a single element
 */
export const generateElementSchemaSettings = (element) => {
  if (!element || !element.type) return [];

  const elementDef = getElementDef(element.type, element.fromTemplate);
  if (!elementDef) return [];

  const settings = [];

  // Generate meaningful header label
  const headerLabel = generateElementLabel(element, elementDef);

  // Only add header for elements that will have settings
  // We'll check this later and remove if no settings were added
  const headerIndex = settings.length;
  settings.push({
    type: "header",
    content: headerLabel,
  });

  // Generate settings for content properties (if they're schema-editable AND toggled)
  elementDef.contentProps?.forEach((prop) => {
    if (!prop.canBeSchemaEditable) return;

    // Content props require schemaToggle — same as style props
    if (!shouldEnableInSchema(element.type, prop.name, element.schemaToggles)) return;

    const settingType =
      prop.schemaType || controlTypeToSchemaType[prop.controlType] || "text";
    const setting = {
      type: settingType,
      id: generateSettingId(element.id, prop.name),
      label: prop.label,
    };

    // Handle default values based on setting type
    const defaultValue = element.props?.[prop.name] || prop.default || "";

    // Add options for select/range types
    if (
      prop.options &&
      (prop.controlType === "select" || prop.controlType === "button-group" || prop.controlType === "dropdown")
    ) {
      setting.options = prop.options.map((opt) => ({
        value: opt,
        label: opt,
      }));
    }

    if (prop.controlType === "slider" || prop.schemaType === "range") {
      setting.min = prop.min || 0;
      setting.max = prop.max || 100;
      setting.step = prop.step || 1;
      // Only add unit if defined (don't set empty string for unitless values like opacity)
      if (prop.unit) {
        setting.unit = prop.unit;
      }
      // Range inputs REQUIRE a default value - use sensible defaults
      if (
        defaultValue !== "" &&
        defaultValue !== null &&
        defaultValue !== undefined
      ) {
        setting.default = parseFloat(defaultValue);
      } else {
        // Sensible defaults for common range properties
        if (prop.name === "opacity") {
          setting.default = 1; // Fully opaque
        } else {
          setting.default = prop.min || 0; // Use min or 0
        }
      }
    } else if (settingType !== "image_picker" && defaultValue !== "") {
      // image_picker doesn't support default, other types only if not empty
      const sanitized = sanitizeColorDefault(defaultValue, settingType);
      if (sanitized !== undefined) {
        // For select types, ensure default is one of the options
        if (setting.options && !setting.options.some(o => o.value === sanitized)) {
          // Skip invalid default
        } else {
          setting.default = sanitized;
        }
      }
    }

    settings.push(setting);
  });

  // Generate settings for style properties (if they're schema-editable)
  elementDef.styleProps?.forEach((prop) => {
    if (!prop.canBeSchemaEditable) return;

    // Check if this property should be in schema (either toggled or always-enabled)
    const isEnabled = shouldEnableInSchema(
      element.type,
      prop.name,
      element.schemaToggles,
      element.style,
    );
    if (!isEnabled) return;

    if (prop.responsive) {
      // Generate 3 schema settings (mobile, desktop, fullscreen) for Shopify customizer
      // Values are read from the 5-viewport system (xs/sm/md/lg/xl)
      const schemaBreakpoints = [
        { schema: "mobile", viewports: ["sm", "xs"] },
        { schema: "desktop", viewports: ["lg", "md"] },
        { schema: "fullscreen", viewports: ["xl"] },
      ];

      schemaBreakpoints.forEach(({ schema: breakpoint, viewports }) => {
        // Find value from viewport keys (prefer first match)
        let value;
        for (const vp of viewports) {
          value = element.responsiveStyles?.[prop.name]?.[vp];
          if (value) break;
        }
        value = value || element.style?.[prop.name] || prop.default;

        const settingType =
          prop.schemaType ||
          controlTypeToSchemaType[prop.controlType] ||
          "text";
        const setting = {
          type: settingType,
          id: generateSettingId(element.id, prop.name, breakpoint),
          label: `${prop.label} (${breakpoint})`,
        };

        // Add options for select/range types
        if (
          prop.options &&
          (prop.controlType === "select" || prop.controlType === "button-group" || prop.controlType === "dropdown")
        ) {
          setting.options = prop.options.map((opt) => ({
            value: opt,
            label: opt,
          }));
        }

        if (prop.controlType === "slider" || prop.schemaType === "range") {
          setting.min = prop.min || 0;
          setting.max = prop.max || 100;
          setting.step = prop.step || 1;
          // Only add unit if defined (don't set empty string for unitless values like opacity)
          if (prop.unit) {
            setting.unit = prop.unit;
          }
          // Range inputs REQUIRE a default value - use sensible defaults
          if (value !== "" && value !== null && value !== undefined) {
            setting.default = parseFloat(value);
          } else {
            // Sensible defaults for common range properties
            if (prop.name === "opacity") {
              setting.default = 1; // Fully opaque
            } else {
              setting.default = prop.min || 0; // Use min or 0
            }
          }
        } else if (value !== "" && value !== null && value !== undefined) {
          // Other types only if not empty
          const sanitized = sanitizeColorDefault(value, settingType);
          if (sanitized !== undefined) {
            if (setting.options && !setting.options.some(o => o.value === sanitized)) {
              // Skip invalid default for select types
            } else {
              setting.default = sanitized;
            }
          }
        }

        if (prop.controlType === "text") {
          setting.info = `CSS value (e.g., 20px, 1rem, 50%)`;
        }

        settings.push(setting);
      });
    } else {
      // Non-responsive property - single setting
      const value = element.style?.[prop.name] || prop.default;

      const settingType =
        prop.schemaType || controlTypeToSchemaType[prop.controlType] || "text";
      const setting = {
        type: settingType,
        id: generateSettingId(element.id, prop.name),
        label: prop.label,
      };

      // Add options for select/range types
      if (
        prop.options &&
        (prop.controlType === "select" || prop.controlType === "button-group" || prop.controlType === "dropdown")
      ) {
        setting.options = prop.options.map((opt) => ({
          value: opt,
          label: opt,
        }));
      }

      if (prop.controlType === "slider" || prop.schemaType === "range") {
        setting.min = prop.min || 0;
        setting.max = prop.max || 100;
        setting.step = prop.step || 1;
        // Only add unit if defined (don't set empty string for unitless values like opacity)
        if (prop.unit) {
          setting.unit = prop.unit;
        }
        // Range inputs REQUIRE a default value - use sensible defaults
        if (value !== "" && value !== null && value !== undefined) {
          setting.default = parseFloat(value);
        } else {
          // Sensible defaults for common range properties
          if (prop.name === "opacity") {
            setting.default = 1; // Fully opaque
          } else {
            setting.default = prop.min || 0; // Use min or 0
          }
        }
      } else if (value !== "" && value !== null && value !== undefined) {
        // Other types only if not empty
        const sanitized = sanitizeColorDefault(value, settingType);
        if (sanitized !== undefined) {
          if (setting.options && !setting.options.some(o => o.value === sanitized)) {
            // Skip invalid default for select types
          } else {
            setting.default = sanitized;
          }
        }
      }

      if (prop.controlType === "text") {
        setting.info = `CSS value (e.g., 20px, 1rem, 50%)`;
      }

      settings.push(setting);
    }
  });

  // Add special Shopify picker settings for product/collection elements
  if (element.type === 'product-card') {
    settings.push({
      type: 'product',
      id: generateSettingId(element.id, 'product'),
      label: 'Product',
    });
  }

  if (element.type === 'product-grid') {
    settings.push({
      type: 'collection',
      id: 'collection',
      label: 'Collection',
    });
  }

  if (element.type === 'collection-list') {
    for (let i = 1; i <= 6; i++) {
      settings.push({
        type: 'collection',
        id: generateSettingId(element.id, `collection_${i}`),
        label: `Collection ${i}`,
      });
    }
  }

  return settings;
};

/**
 * Generate schema settings for all elements recursively
 */
export const generateAllElementsSchemaSettings = (elements) => {
  const settings = [];

  const processElement = (element) => {
    const elementSettings = generateElementSchemaSettings(element);
    settings.push(...elementSettings);

    // Process children
    if (element.children && element.children.length > 0) {
      element.children.forEach((child) => processElement(child));
    }

    // Process columns - generate schema for column properties, then process children
    if (element.columns && element.columns.length > 0) {
      const columnCount = element.columns.length;
      for (let i = 0; i < columnCount; i++) {
        // Generate schema for this column's toggled properties
        const colId = `${element.id}-col-${i}`;
        const nsPrefix = `col-${i}-`;
        const colSchemaToggles = {};
        if (element.schemaToggles) {
          Object.keys(element.schemaToggles).forEach(key => {
            if (key.startsWith(nsPrefix)) {
              colSchemaToggles[key.substring(nsPrefix.length)] = element.schemaToggles[key];
            }
          });
        }

        // Create synthetic column element for schema generation
        const colElement = {
          id: colId,
          type: 'column',
          fromTemplate: element.fromTemplate,
          style: element.columnStyles?.[i] || {},
          schemaToggles: colSchemaToggles,
          responsiveStyles: {},
        };

        // Extract column responsive styles from parent's namespaced keys
        if (element.responsiveStyles) {
          Object.keys(element.responsiveStyles).forEach(key => {
            if (key.startsWith(nsPrefix)) {
              colElement.responsiveStyles[key.substring(nsPrefix.length)] = element.responsiveStyles[key];
            }
          });
        }

        const colSettings = generateElementSchemaSettings(colElement);
        settings.push(...colSettings);

        // Process children inside column
        const column = element.columns[i];
        if (column && Array.isArray(column)) {
          column.forEach((child) => processElement(child));
        }
      }
    }
  };

  elements.forEach((element) => processElement(element));

  return settings;
};

/**
 * Generate complete Shopify schema
 */
export const generateLiquidSchema = (elements, sectionName) => {
  const settings = generateAllElementsSchemaSettings(elements);

  // No useless base settings - just use element settings

  const schema = {
    name: sectionName,
    tag: "section",
    class: sectionName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    settings: settings, // Just the actual element settings
    presets: [
      {
        name: sectionName,
      },
    ],
  };

  return JSON.stringify(schema, null, 2);
};
