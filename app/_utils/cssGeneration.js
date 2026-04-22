/**
 * CSS Generation - Schema Toggle System
 *
 * Generates CSS based on element definitions and schema toggles
 */

import { elementDefinitions, getElementDef } from '@/app/_config/elementDefinitions';
import { generateSettingId } from '@/app/_utils/idGenerator';
import { templateCSSGenerators, resetTemplateCounters } from '@/app/_utils/templateCSS';

/**
 * Convert camelCase to kebab-case
 */
const camelToKebab = (str) => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
};

/**
 * Check if a property needs special CSS handling
 * Returns array of CSS properties to generate
 */
const getCSSPropsForProperty = (propName, value, isSchemaEnabled, elementId, breakpoint = null) => {
  const props = [];

  // Skip hover properties - they're handled separately via :hover pseudo-class
  if (propName.startsWith('hover')) {
    return props;
  }

  // Skip non-CSS content properties
  if (['showImage', 'showTitle', 'showPrice', 'showButton', 'showCount', 'buttonText', 'columns', 'rows', 'buttonColor', 'buttonBackgroundColor', 'buttonHoverColor', 'buttonHoverBackgroundColor', 'buttonHoverBorderColor', 'buttonHoverAnimation', 'titleTextAlign', 'priceTextAlign', 'gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2', 'gradientColor3', 'gradientColor4', 'gradientColor5', 'hideOnMobile', 'hideOnFullscreen', 'hideOnDesktop', 'entranceAnimation', 'entranceDelay', 'entranceDuration', 'itemCount', 'tabCount', 'slideCount', 'targetDate', 'expiredMessage', 'showDays', 'showHours', 'showMinutes', 'showSeconds', 'autoplay', 'autoplayInterval', 'showArrows', 'showDots', 'tabBackgroundColor', 'tabActiveBackgroundColor', 'tabColor', 'tabActiveColor', 'tabFontFamily', 'tabFontSize', 'tabFontWeight', 'contentFontSize', 'titleFontFamily', 'titleFontSize', 'titleFontWeight', 'titleColor', 'titleBackgroundColor', 'contentBackgroundColor', 'digitFontFamily', 'digitColor', 'labelColor', 'digitFontSize', 'labelFontSize', 'separatorStyle', 'headingFontFamily', 'headingFontSize', 'headingFontWeight', 'textFontSize', 'slideBackgroundColor', 'arrowColor', 'dotColor', 'dotActiveColor', 'textShadowOffsetX', 'textShadowOffsetY', 'textShadowBlur', 'textShadowColor', 'boxShadowOffsetX', 'boxShadowOffsetY', 'boxShadowBlur', 'boxShadowSpread', 'boxShadowColor'].includes(propName)) {
    return props;
  }

  // iconSize needs to be converted to width and height
  if (propName === 'iconSize') {
    if (isSchemaEnabled) {
      const liquidVar = generateLiquidVar(elementId, propName, breakpoint);
      const settingId = generateSettingId(elementId, propName, breakpoint);
      props.push(`{% if section.settings.${settingId} != blank %}width: ${liquidVar};{% endif %}`);
      props.push(`{% if section.settings.${settingId} != blank %}height: ${liquidVar};{% endif %}`);
    } else {
      props.push(`width: ${value};`);
      props.push(`height: ${value};`);
    }
  } else {
    // Regular property - just convert to kebab-case
    const cssPropName = camelToKebab(propName);
    if (isSchemaEnabled) {
      const liquidVar = generateLiquidVar(elementId, propName, breakpoint);
      const settingId = generateSettingId(elementId, propName, breakpoint);
      props.push(`{% if section.settings.${settingId} != blank %}${cssPropName}: ${liquidVar};{% endif %}`);
    } else {
      props.push(`${cssPropName}: ${value};`);
    }
  }

  return props;
};

/**
 * Generate Liquid variable reference for schema-enabled properties
 */
const generateLiquidVar = (elementId, propertyName, breakpoint = null) => {
  const settingId = generateSettingId(elementId, propertyName, breakpoint);
  return `{{ section.settings.${settingId} }}`;
};

/**
 * Check if a property should be enabled in schema (matches backend logic)
 */
const alwaysEnabledProperties = {};

const shouldEnableInSchema = (elementType, propertyName, schemaToggles) => {
  if (schemaToggles?.[propertyName] === true) return true;
  const alwaysEnabled = alwaysEnabledProperties[elementType] || [];
  if (alwaysEnabled.includes(propertyName)) return true;
  return false;
};

/**
 * Generate CSS for a single element
 * REVOLUTIONARY APPROACH: Output Liquid variables for ALL schema-enabled properties
 * This bridges the gap between static builder and dynamic Shopify customizer
 */
export const generateElementCSS = (element, sectionId) => {
  if (!element || !element.type) return '';

  const elementDef = getElementDef(element.type, element.fromTemplate);
  if (!elementDef) return '';

  // Scope selector to section ID to prevent conflicts
  const selector = `#${sectionId}-{{ section.id }} [data-element-id="${element.id}"]`;

  let css = '';

  // Template hardcoded CSS (non-editable properties)
  // Falls through to normal pipeline below for editable properties (Liquid vars)
  if (element.fromTemplate && templateCSSGenerators[element.fromTemplate]) {
    css += templateCSSGenerators[element.fromTemplate](element, elementDef, selector, sectionId);
  }

  // Collect CSS properties
  const cssProps = [];

  // BRIDGE THE GAP: Process ALL schema-enabled style properties
  // Not just properties with values - this makes Shopify customizer work!
  if (elementDef.styleProps) {
    elementDef.styleProps.forEach(propDef => {
      const propName = propDef.name;
      const isSchemaEnabled = shouldEnableInSchema(element.type, propName, element.schemaToggles, element.style);

      // Skip if not schema-enabled and has no value
      if (!isSchemaEnabled && !element.style?.[propName] && !element.responsiveStyles?.[propName]) {
        return;
      }

      // lg is the desktop Shopify breakpoint — check it first, then base style
      const value = element.responsiveStyles?.[propName]?.lg
                   || element.style?.[propName]
                   || propDef.default
                   || '';

      // For responsive properties
      if (propDef.responsive) {
        // Only output md/desktop value in base selector if schema-enabled OR has value
        if (isSchemaEnabled || value) {
          const breakpoint = isSchemaEnabled ? 'desktop' : null;
          const generatedProps = getCSSPropsForProperty(propName, value, isSchemaEnabled, element.id, breakpoint);
          cssProps.push(...generatedProps);
        }
      } else {
        // Non-responsive property
        if (isSchemaEnabled || value) {
          const generatedProps = getCSSPropsForProperty(propName, value, isSchemaEnabled, element.id, null);
          cssProps.push(...generatedProps);
        }
      }
    });
  }

  // Assemble box-shadow from individual sub-properties
  const bsSubProps = ['boxShadowOffsetX', 'boxShadowOffsetY', 'boxShadowBlur', 'boxShadowSpread', 'boxShadowColor'];
  const bsHasAny = bsSubProps.some(p =>
    shouldEnableInSchema(element.type, p, element.schemaToggles, element.style) || element.style?.[p]
  );
  if (bsHasAny) {
    const bsAnySchema = bsSubProps.some(p => shouldEnableInSchema(element.type, p, element.schemaToggles, element.style));
    if (bsAnySchema) {
      const bsGetVal = (prop) => {
        if (shouldEnableInSchema(element.type, prop, element.schemaToggles, element.style)) {
          return generateLiquidVar(element.id, prop);
        }
        return element.style?.[prop];
      };
      const bsX = bsGetVal('boxShadowOffsetX');
      const bsY = bsGetVal('boxShadowOffsetY');
      const bsBlur = bsGetVal('boxShadowBlur');
      const bsSpread = bsGetVal('boxShadowSpread');
      const bsColor = bsGetVal('boxShadowColor');
      cssProps.push(`box-shadow: ${bsX} ${bsY} ${bsBlur} ${bsSpread} ${bsColor};`);
    } else {
      const bsX = element.style?.boxShadowOffsetX;
      const bsY = element.style?.boxShadowOffsetY;
      const bsBlur = element.style?.boxShadowBlur;
      const bsSpread = element.style?.boxShadowSpread;
      const bsColor = element.style?.boxShadowColor;
      cssProps.push(`box-shadow: ${bsX} ${bsY} ${bsBlur} ${bsSpread} ${bsColor};`);
    }
  }

  // Assemble text-shadow from individual sub-properties
  const tsSubProps = ['textShadowOffsetX', 'textShadowOffsetY', 'textShadowBlur', 'textShadowColor'];
  const tsHasAny = tsSubProps.some(p =>
    shouldEnableInSchema(element.type, p, element.schemaToggles, element.style) || element.style?.[p]
  );
  if (tsHasAny) {
    const tsAnySchema = tsSubProps.some(p => shouldEnableInSchema(element.type, p, element.schemaToggles, element.style));
    if (tsAnySchema) {
      // Use Liquid variables for schema-enabled sub-props, hardcoded values for others
      const tsGetVal = (prop) => {
        if (shouldEnableInSchema(element.type, prop, element.schemaToggles, element.style)) {
          return generateLiquidVar(element.id, prop);
        }
        return element.style?.[prop];
      };
      const tsX = tsGetVal('textShadowOffsetX');
      const tsY = tsGetVal('textShadowOffsetY');
      const tsBlur = tsGetVal('textShadowBlur');
      const tsColor = tsGetVal('textShadowColor');
      cssProps.push(`text-shadow: ${tsX} ${tsY} ${tsBlur} ${tsColor};`);
    } else {
      const tsX = element.style?.textShadowOffsetX;
      const tsY = element.style?.textShadowOffsetY;
      const tsBlur = element.style?.textShadowBlur;
      const tsColor = element.style?.textShadowColor;
      cssProps.push(`text-shadow: ${tsX} ${tsY} ${tsBlur} ${tsColor};`);
    }
  }

  // Generate base CSS rule
  if (cssProps.length > 0) {
    css += `${selector} {\n`;
    cssProps.forEach(prop => {
      css += `  ${prop}\n`;
    });
    css += `}\n\n`;
  }

  // Generate per-column CSS as proper elements with schema support
  if (element.type?.startsWith('columns-') || element.type === 'grid-2x2') {
    const columnCount = element.type === 'grid-2x2' ? 4 : parseInt(element.type.split('-')[1] || '2');
    const columnDef = getElementDef('column', element.fromTemplate);
    if (columnDef?.styleProps) {
      for (let i = 0; i < columnCount; i++) {
        const colId = `${element.id}-col-${i}`;
        const colSelector = `#${sectionId}-{{ section.id }} [data-element-id="${colId}"]`;
        const colStyles = element.columnStyles?.[i] || {};
        // Column schema toggles are stored on parent with namespaced keys: col-0-propName
        const colSchemaToggles = {};
        const nsPrefix = `col-${i}-`;
        if (element.schemaToggles) {
          Object.keys(element.schemaToggles).forEach(key => {
            if (key.startsWith(nsPrefix)) {
              colSchemaToggles[key.substring(nsPrefix.length)] = element.schemaToggles[key];
            }
          });
        }

        // Generate base/desktop CSS
        const colCssProps = [];
        columnDef.styleProps.forEach(propDef => {
          const propName = propDef.name;
          const isSchemaEnabled = shouldEnableInSchema('column', propName, colSchemaToggles, colStyles);
          const value = colStyles[propName] || propDef.default || '';

          if (!isSchemaEnabled && !value) return;

          if (propDef.responsive) {
            if (isSchemaEnabled || value) {
              const breakpoint = isSchemaEnabled ? 'desktop' : null;
              const generatedProps = getCSSPropsForProperty(propName, value, isSchemaEnabled, colId, breakpoint);
              colCssProps.push(...generatedProps);
            }
          } else {
            if (isSchemaEnabled || value) {
              const generatedProps = getCSSPropsForProperty(propName, value, isSchemaEnabled, colId, null);
              colCssProps.push(...generatedProps);
            }
          }
        });

        if (colCssProps.length > 0) {
          css += `${colSelector} {\n`;
          colCssProps.forEach(prop => {
            css += `  ${prop}\n`;
          });
          css += `}\n\n`;
        }

        // Generate responsive CSS for columns — same viewport mapping as main elements
        const viewportBreakpoints = [
          { viewport: 'xs', media: '@media (max-width: 575px)', schemaBreakpoint: null },
          { viewport: 'sm', media: '@media (min-width: 576px) and (max-width: 767px)', schemaBreakpoint: 'mobile' },
          { viewport: 'md', media: '@media (min-width: 768px) and (max-width: 991px)', schemaBreakpoint: null },
          { viewport: 'xl', media: '@media (min-width: 1200px)', schemaBreakpoint: 'fullscreen' },
        ];

        viewportBreakpoints.forEach(({ viewport, media, schemaBreakpoint }) => {
          const responsiveProps = [];
          columnDef.styleProps.forEach(propDef => {
            if (!propDef.responsive) return;
            const propName = propDef.name;
            const isSchemaEnabled = schemaBreakpoint !== null && shouldEnableInSchema('column', propName, colSchemaToggles, colStyles);
            // Column responsive styles are stored on parent with namespaced keys: col-0-propName
            const viewportValue = element.responsiveStyles?.[`col-${i}-${propName}`]?.[viewport];
            if (!isSchemaEnabled && !viewportValue) return;
            const value = viewportValue || colStyles[propName] || propDef.default || '';
            if (isSchemaEnabled || value) {
              const generatedProps = getCSSPropsForProperty(propName, value, isSchemaEnabled, colId, schemaBreakpoint);
              responsiveProps.push(...generatedProps);
            }
          });

          if (responsiveProps.length > 0) {
            css += `${media} {\n`;
            css += `  ${colSelector} {\n`;
            responsiveProps.forEach(prop => {
              css += `    ${prop}\n`;
            });
            css += `  }\n`;
            css += `}\n\n`;
          }
        });

      }
    }
  }

  // Generate gradient background for container/image-background/background-overlay elements
  if (element.type === 'container' || element.type === 'image-background' || element.type === 'background-overlay') {
    const hasGradient = shouldEnableInSchema(element.type, 'gradientType', element.schemaToggles, element.style);
    if (hasGradient || element.style?.gradientType) {
      const gradTypeSetting = generateSettingId(element.id, 'gradientType');
      const gradAngleVar = generateLiquidVar(element.id, 'gradientAngle');
      const gradColor1Var = generateLiquidVar(element.id, 'gradientColor1');
      const gradColor2Var = generateLiquidVar(element.id, 'gradientColor2');
      const gradColor3Setting = generateSettingId(element.id, 'gradientColor3');
      const gradColor3Var = generateLiquidVar(element.id, 'gradientColor3');
      const gradColor4Setting = generateSettingId(element.id, 'gradientColor4');
      const gradColor4Var = generateLiquidVar(element.id, 'gradientColor4');
      const gradColor5Setting = generateSettingId(element.id, 'gradientColor5');
      const gradColor5Var = generateLiquidVar(element.id, 'gradientColor5');

      // Build color stops string with optional colors 3-5
      const colorStopsLinear = `${gradColor1Var}, ${gradColor2Var}{% if section.settings.${gradColor3Setting} != blank %}, ${gradColor3Var}{% endif %}{% if section.settings.${gradColor4Setting} != blank %}, ${gradColor4Var}{% endif %}{% if section.settings.${gradColor5Setting} != blank %}, ${gradColor5Var}{% endif %}`;
      const colorStopsRadial = `${gradColor1Var}, ${gradColor2Var}{% if section.settings.${gradColor3Setting} != blank %}, ${gradColor3Var}{% endif %}{% if section.settings.${gradColor4Setting} != blank %}, ${gradColor4Var}{% endif %}{% if section.settings.${gradColor5Setting} != blank %}, ${gradColor5Var}{% endif %}`;

      css += `{% if section.settings.${gradTypeSetting} == 'linear' %}\n`;
      css += `${selector} {\n`;
      css += `  background: linear-gradient(${gradAngleVar}deg, ${colorStopsLinear});\n`;
      css += `}\n`;
      css += `{% elsif section.settings.${gradTypeSetting} == 'radial' %}\n`;
      css += `${selector} {\n`;
      css += `  background: radial-gradient(circle, ${colorStopsRadial});\n`;
      css += `}\n`;
      css += `{% endif %}\n\n`;
    }
  }

  // Generate :hover pseudo-class for hover properties
  const hoverProps = [];
  let elementHoverAnimation = null;
  if (elementDef.styleProps) {
    elementDef.styleProps.forEach(propDef => {
      if (!propDef.name.startsWith('hover')) return;
      const isSchemaEnabled = shouldEnableInSchema(element.type, propDef.name, element.schemaToggles, element.style);
      if (!isSchemaEnabled && !element.style?.[propDef.name]) return;

      // hoverAnimation needs special keyframe handling, not a simple CSS property map
      if (propDef.name === 'hoverAnimation') {
        const val = element.style?.[propDef.name];
        if (isSchemaEnabled) {
          elementHoverAnimation = generateLiquidVar(element.id, propDef.name, null);
        } else if (val) {
          elementHoverAnimation = val;
        }
        return;
      }

      // Skip hoverBoxShadow sub-props — assembled separately below
      if (['hoverBoxShadowOffsetX', 'hoverBoxShadowOffsetY', 'hoverBoxShadowBlur', 'hoverBoxShadowSpread', 'hoverBoxShadowColor'].includes(propDef.name)) {
        return;
      }

      // Map hover prop name to actual CSS property (e.g., hoverBackgroundColor -> background-color)
      const actualPropName = propDef.name.replace(/^hover/, '');
      const cssPropName = camelToKebab(actualPropName.charAt(0).toLowerCase() + actualPropName.slice(1));
      const value = element.style?.[propDef.name];

      if (isSchemaEnabled) {
        const liquidVar = generateLiquidVar(element.id, propDef.name, null);
        const settingId = generateSettingId(element.id, propDef.name, null);
        hoverProps.push(`{% if section.settings.${settingId} != blank %}${cssPropName}: ${liquidVar};{% endif %}`);
      } else if (value) {
        hoverProps.push(`${cssPropName}: ${value};`);
      }
    });
  }

  // Assemble hover box-shadow from individual sub-properties
  const hbsSubProps = ['hoverBoxShadowOffsetX', 'hoverBoxShadowOffsetY', 'hoverBoxShadowBlur', 'hoverBoxShadowSpread', 'hoverBoxShadowColor'];
  const hbsHasAny = hbsSubProps.some(p =>
    shouldEnableInSchema(element.type, p, element.schemaToggles, element.style) || element.style?.[p]
  );
  if (hbsHasAny) {
    const hbsAnySchema = hbsSubProps.some(p => shouldEnableInSchema(element.type, p, element.schemaToggles, element.style));
    if (hbsAnySchema) {
      const hbsGetVal = (prop) => {
        if (shouldEnableInSchema(element.type, prop, element.schemaToggles, element.style)) {
          return generateLiquidVar(element.id, prop);
        }
        return element.style?.[prop];
      };
      const hbsX = hbsGetVal('hoverBoxShadowOffsetX');
      const hbsY = hbsGetVal('hoverBoxShadowOffsetY');
      const hbsBlur = hbsGetVal('hoverBoxShadowBlur');
      const hbsSpread = hbsGetVal('hoverBoxShadowSpread');
      const hbsColor = hbsGetVal('hoverBoxShadowColor');
      // Guard: collect all schema-enabled setting IDs and wrap in blank check
      const hbsSchemaIds = hbsSubProps
        .filter(p => shouldEnableInSchema(element.type, p, element.schemaToggles, element.style))
        .map(p => generateSettingId(element.id, p));
      const hbsGuardConditions = hbsSchemaIds.map(id => `section.settings.${id} != blank`).join(' and ');
      hoverProps.push(`{% if ${hbsGuardConditions} %}box-shadow: ${hbsX} ${hbsY} ${hbsBlur} ${hbsSpread} ${hbsColor};{% endif %}`);
    } else {
      const hbsX = element.style?.hoverBoxShadowOffsetX;
      const hbsY = element.style?.hoverBoxShadowOffsetY;
      const hbsBlur = element.style?.hoverBoxShadowBlur;
      const hbsSpread = element.style?.hoverBoxShadowSpread;
      const hbsColor = element.style?.hoverBoxShadowColor;
      hoverProps.push(`box-shadow: ${hbsX} ${hbsY} ${hbsBlur} ${hbsSpread} ${hbsColor};`);
    }
  }

  if (hoverProps.length > 0 || elementHoverAnimation) {
    css += `${selector} {\n  transition: all 0.3s ease;\n}\n`;
    css += `${selector}:hover {\n`;
    hoverProps.forEach(prop => {
      css += `  ${prop}\n`;
    });

    if (elementHoverAnimation) {
      const animName = `el-hover-${element.id}`;
      const animMap = {
        grow: `@keyframes ${animName} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`,
        shrink: `@keyframes ${animName} { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.95); } }`,
        shake: `@keyframes ${animName} { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`,
        pulse: `@keyframes ${animName} { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.9; } }`,
        bounce: `@keyframes ${animName} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`,
        rotate: `@keyframes ${animName} { 0% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } 100% { transform: rotate(0deg); } }`,
      };
      const durationMap = { grow: '0.3s', shrink: '0.3s', shake: '0.3s', pulse: '0.6s', bounce: '0.4s', rotate: '0.4s' };
      const isLiquidVar = elementHoverAnimation.includes('section.settings.');
      if (isLiquidVar) {
        // Schema-enabled: output Liquid conditionals for each animation value
        const settingId = generateSettingId(element.id, 'hoverAnimation', null);
        Object.entries(animMap).forEach(([key, keyframes]) => {
          css += `{% if section.settings.${settingId} == '${key}' %}  animation: ${animName} ${durationMap[key]} ease;\n{% endif %}\n`;
          css = `{% if section.settings.${settingId} == '${key}' %}${keyframes}{% endif %}\n${css}`;
        });
      } else if (animMap[elementHoverAnimation]) {
        css += `  animation: ${animName} ${durationMap[elementHoverAnimation]} ease;\n`;
        css = `${animMap[elementHoverAnimation]}\n${css}`;
      }
    }

    css += `}\n\n`;
  }

  // Generate product-grid CSS
  if (element.type === 'product-grid') {
    const pgGap = shouldEnableInSchema(element.type, 'gap', element.schemaToggles)
      ? generateLiquidVar(element.id, 'gap', 'desktop') : (element.style?.gap);
    const pgBg = shouldEnableInSchema(element.type, 'backgroundColor', element.schemaToggles)
      ? generateLiquidVar(element.id, 'backgroundColor') : (element.style?.backgroundColor);
    const pgClr = shouldEnableInSchema(element.type, 'color', element.schemaToggles)
      ? generateLiquidVar(element.id, 'color') : (element.style?.color);
    const pgBw = '1px';
    const pgBs = 'solid';
    const pgBc = '#e0e0e0';
    const pgBr = '8px';
    const pgPt = shouldEnableInSchema(element.type, 'paddingTop', element.schemaToggles)
      ? generateLiquidVar(element.id, 'paddingTop', 'desktop') : (element.style?.paddingTop);
    const pgPb = shouldEnableInSchema(element.type, 'paddingBottom', element.schemaToggles)
      ? generateLiquidVar(element.id, 'paddingBottom', 'desktop') : (element.style?.paddingBottom);
    const pgPl = shouldEnableInSchema(element.type, 'paddingLeft', element.schemaToggles)
      ? generateLiquidVar(element.id, 'paddingLeft', 'desktop') : (element.style?.paddingLeft);
    const pgPr = shouldEnableInSchema(element.type, 'paddingRight', element.schemaToggles)
      ? generateLiquidVar(element.id, 'paddingRight', 'desktop') : (element.style?.paddingRight);
    const pgBtnClr = shouldEnableInSchema(element.type, 'buttonColor', element.schemaToggles)
      ? generateLiquidVar(element.id, 'buttonColor') : (element.style?.buttonColor);
    const pgBtnBg = shouldEnableInSchema(element.type, 'buttonBackgroundColor', element.schemaToggles)
      ? generateLiquidVar(element.id, 'buttonBackgroundColor') : (element.style?.buttonBackgroundColor);

    css += `${selector} {\n  display: grid;\n  gap: ${pgGap};\n  width: 100%;\n}\n`;
    css += `${selector}.product-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }\n`;
    css += `${selector}.product-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }\n`;
    css += `${selector}.product-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }\n`;
    css += `${selector} .product-grid__item {\n  background-color: ${pgBg};\n  border-width: ${pgBw};\n  border-style: ${pgBs};\n  border-color: ${pgBc};\n  border-radius: ${pgBr};\n  overflow: hidden;\n}\n`;
    css += `${selector} .product-grid__image {\n  width: 100%;\n  aspect-ratio: 1;\n  object-fit: cover;\n}\n`;
    css += `${selector} .product-grid__placeholder {\n  width: 100%;\n  aspect-ratio: 1;\n}\n`;
    css += `${selector} .product-grid__info {\n  padding: ${pgPt} ${pgPr} ${pgPb} ${pgPl};\n}\n`;
    css += `${selector} .product-grid__title {\n  margin-top: 0;\n  margin-bottom: 4px;\n  margin-left: 0;\n  margin-right: 0;\n  font-size: 14px;\n  color: ${pgClr};\n}\n`;
    css += `${selector} .product-grid__title a {\n  color: inherit;\n  text-decoration: none;\n}\n`;
    css += `${selector} .product-grid__price {\n  margin-top: 0;\n  margin-bottom: 8px;\n  margin-left: 0;\n  margin-right: 0;\n  font-size: 14px;\n  font-weight: bold;\n  color: ${pgClr};\n}\n`;
    css += `${selector} .product-grid__button {\n  display: block;\n  width: 100%;\n  padding: 8px;\n  background-color: ${pgBtnBg};\n  color: ${pgBtnClr};\n  border-width: 1px;\n  border-style: solid;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 12px;\n  font-weight: bold;\n  text-align: center;\n  text-decoration: none;\n}\n`;
    // Responsive product-grid props
    const pgResponsiveProps = [
      { name: 'gap', css: 'gap', target: '' },
      { name: 'paddingTop', css: 'padding-top', target: ' .product-grid__info' },
      { name: 'paddingBottom', css: 'padding-bottom', target: ' .product-grid__info' },
      { name: 'paddingLeft', css: 'padding-left', target: ' .product-grid__info' },
      { name: 'paddingRight', css: 'padding-right', target: ' .product-grid__info' },
    ];
    pgResponsiveProps.forEach(({ name, css: cssProp, target }) => {
      if (shouldEnableInSchema(element.type, name, element.schemaToggles)) {
        const mobile = generateLiquidVar(element.id, name, 'mobile');
        const full = generateLiquidVar(element.id, name, 'fullscreen');
        css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector}${target} { ${cssProp}: ${mobile}; }\n}\n`;
        css += `@media (min-width: 1200px) {\n  ${selector}${target} { ${cssProp}: ${full}; }\n}\n`;
      }
    });
    css += `\n`;
  }

  // Generate collection-list CSS
  if (element.type === 'collection-list') {
    const clGap = shouldEnableInSchema(element.type, 'gap', element.schemaToggles)
      ? generateLiquidVar(element.id, 'gap', 'desktop') : (element.style?.gap);
    const clBg = shouldEnableInSchema(element.type, 'backgroundColor', element.schemaToggles)
      ? generateLiquidVar(element.id, 'backgroundColor') : (element.style?.backgroundColor);
    const clClr = shouldEnableInSchema(element.type, 'color', element.schemaToggles)
      ? generateLiquidVar(element.id, 'color') : (element.style?.color);
    const clBw = '1px';
    const clBs = 'solid';
    const clBc = '#e0e0e0';
    const clBr = '8px';
    const clPt = shouldEnableInSchema(element.type, 'paddingTop', element.schemaToggles)
      ? generateLiquidVar(element.id, 'paddingTop', 'desktop') : (element.style?.paddingTop);
    const clPb = shouldEnableInSchema(element.type, 'paddingBottom', element.schemaToggles)
      ? generateLiquidVar(element.id, 'paddingBottom', 'desktop') : (element.style?.paddingBottom);
    const clPl = shouldEnableInSchema(element.type, 'paddingLeft', element.schemaToggles)
      ? generateLiquidVar(element.id, 'paddingLeft', 'desktop') : (element.style?.paddingLeft);
    const clPr = shouldEnableInSchema(element.type, 'paddingRight', element.schemaToggles)
      ? generateLiquidVar(element.id, 'paddingRight', 'desktop') : (element.style?.paddingRight);

    css += `${selector} {\n  display: grid;\n  gap: ${clGap};\n  width: 100%;\n}\n`;
    css += `${selector}.collection-list--cols-2 { grid-template-columns: repeat(2, 1fr); }\n`;
    css += `${selector}.collection-list--cols-3 { grid-template-columns: repeat(3, 1fr); }\n`;
    css += `${selector}.collection-list--cols-4 { grid-template-columns: repeat(4, 1fr); }\n`;
    css += `${selector}.collection-list--cols-6 { grid-template-columns: repeat(6, 1fr); }\n`;
    css += `${selector} .collection-list__item {\n  background-color: ${clBg};\n  border-width: ${clBw};\n  border-style: ${clBs};\n  border-color: ${clBc};\n  border-radius: ${clBr};\n  overflow: hidden;\n  text-align: center;\n}\n`;
    css += `${selector} .collection-list__image {\n  width: 100%;\n  aspect-ratio: 16/9;\n  object-fit: cover;\n}\n`;
    css += `${selector} .collection-list__placeholder {\n  width: 100%;\n  aspect-ratio: 16/9;\n}\n`;
    css += `${selector} .collection-list__item > div {\n  padding: ${clPt} ${clPr} ${clPb} ${clPl};\n}\n`;
    css += `${selector} .collection-list__title {\n  margin: 0 0 4px;\n  font-size: 14px;\n  font-weight: 600;\n  color: ${clClr};\n}\n`;
    css += `${selector} .collection-list__title a {\n  color: inherit;\n  text-decoration: none;\n}\n`;
    css += `${selector} .collection-list__count {\n  margin: 0;\n  font-size: 12px;\n  color: #999;\n}\n`;
    // Responsive collection-list props
    const clResponsiveProps = [
      { name: 'gap', css: 'gap', target: '' },
      { name: 'paddingTop', css: 'padding-top', target: ' .collection-list__item > div' },
      { name: 'paddingBottom', css: 'padding-bottom', target: ' .collection-list__item > div' },
      { name: 'paddingLeft', css: 'padding-left', target: ' .collection-list__item > div' },
      { name: 'paddingRight', css: 'padding-right', target: ' .collection-list__item > div' },
    ];
    clResponsiveProps.forEach(({ name, css: cssProp, target }) => {
      if (shouldEnableInSchema(element.type, name, element.schemaToggles)) {
        const mobile = generateLiquidVar(element.id, name, 'mobile');
        const full = generateLiquidVar(element.id, name, 'fullscreen');
        css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector}${target} { ${cssProp}: ${mobile}; }\n}\n`;
        css += `@media (min-width: 1200px) {\n  ${selector}${target} { ${cssProp}: ${full}; }\n}\n`;
      }
    });
    css += `\n`;
  }

  // Generate text-align for product-card title and price
  if (element.type === 'product-card' || element.type === 'product-grid') {
    const isGrid = element.type === 'product-grid';
    const textAlignMap = {
      titleTextAlign: isGrid ? `${selector} .product-grid__title` : `${selector} .product-card__title`,
      priceTextAlign: isGrid ? `${selector} .product-grid__price` : `${selector} .product-card__price`,
    };
    if (elementDef.styleProps) {
      elementDef.styleProps.forEach(propDef => {
        const childSelector = textAlignMap[propDef.name];
        if (!childSelector) return;
        const isSchemaEnabled = shouldEnableInSchema(element.type, propDef.name, element.schemaToggles, element.style);
        if (!isSchemaEnabled && !element.style?.[propDef.name]) return;

        if (isSchemaEnabled) {
          const liquidVar = generateLiquidVar(element.id, propDef.name, null);
          const settingId = generateSettingId(element.id, propDef.name, null);
          css += `{% if section.settings.${settingId} != blank %}${childSelector} {\n  text-align: ${liquidVar};\n}{% endif %}\n`;
        } else {
          const value = element.style?.[propDef.name];
          if (value) {
            css += `${childSelector} {\n  text-align: ${value};\n}\n`;
          }
        }
      });
    }
  }

  // Generate :hover pseudo-class for button hover properties (product-card, product-grid)
  if (element.type === 'product-card' || element.type === 'product-grid') {
    const btnHoverPropMap = {
      buttonHoverColor: 'color',
      buttonHoverBackgroundColor: 'background-color',
      buttonHoverBorderColor: 'border-color',
    };
    const btnHoverProps = [];
    let btnHoverAnimation = null;

    if (elementDef.styleProps) {
      elementDef.styleProps.forEach(propDef => {
        if (!propDef.name.startsWith('buttonHover')) return;

        if (propDef.name === 'buttonHoverAnimation') {
          const val = element.style?.[propDef.name];
          const isSchemaEnabled = shouldEnableInSchema(element.type, propDef.name, element.schemaToggles, element.style);
          if (isSchemaEnabled) {
            btnHoverAnimation = generateLiquidVar(element.id, propDef.name, null);
          } else if (val) {
            btnHoverAnimation = val;
          }
          return;
        }

        const isSchemaEnabled = shouldEnableInSchema(element.type, propDef.name, element.schemaToggles, element.style);
        if (!isSchemaEnabled && !element.style?.[propDef.name]) return;

        const cssPropName = btnHoverPropMap[propDef.name];
        if (!cssPropName) return;
        const value = element.style?.[propDef.name];

        if (isSchemaEnabled) {
          const liquidVar = generateLiquidVar(element.id, propDef.name, null);
          const settingId = generateSettingId(element.id, propDef.name, null);
          btnHoverProps.push(`{% if section.settings.${settingId} != blank %}${cssPropName}: ${liquidVar};{% endif %}`);
        } else if (value) {
          btnHoverProps.push(`${cssPropName}: ${value};`);
        }
      });
    }

    const btnSelector = element.type === 'product-card'
      ? `${selector} .product-card__button`
      : `${selector} .product-grid__button`;

    if (btnHoverProps.length > 0 || btnHoverAnimation) {
      css += `${btnSelector} {\n  transition: all 0.3s ease;\n}\n`;
      css += `${btnSelector}:hover {\n  border-width: 1px;\n  border-style: solid;\n`;
      btnHoverProps.forEach(prop => {
        css += `  ${prop}\n`;
      });

      if (btnHoverAnimation) {
        const animName = `pc-btn-hover-${element.id}`;
        const animMap = {
          grow: `@keyframes ${animName} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`,
          shrink: `@keyframes ${animName} { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.95); } }`,
          shake: `@keyframes ${animName} { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`,
          pulse: `@keyframes ${animName} { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.9; } }`,
          bounce: `@keyframes ${animName} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`,
          rotate: `@keyframes ${animName} { 0% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } 100% { transform: rotate(0deg); } }`,
        };
        const durationMap = { grow: '0.3s', shrink: '0.3s', shake: '0.3s', pulse: '0.6s', bounce: '0.4s', rotate: '0.4s' };
        if (animMap[btnHoverAnimation]) {
          css += `  animation: ${animName} ${durationMap[btnHoverAnimation]} ease;\n`;
          css = `${animMap[btnHoverAnimation]}\n${css}`;
        }
      }

      css += `}\n\n`;
    }
  }

  // Generate hide/show per breakpoint using Liquid conditionals
  const visibilityBreakpoints = {
    hideOnMobile: '@media (max-width: 575px)',
    hideOnDesktop: '@media (min-width: 576px) and (max-width: 1199px)',
    hideOnFullscreen: '@media (min-width: 1200px)',
  };

  Object.entries(visibilityBreakpoints).forEach(([propName, mediaQuery]) => {
    const isSchemaEnabled = shouldEnableInSchema(element.type, propName, element.schemaToggles, element.style);
    const value = element.style?.[propName];

    if (isSchemaEnabled) {
      const settingId = generateSettingId(element.id, propName);
      css += `{% if section.settings.${settingId} %}\n`;
      css += `${mediaQuery} {\n`;
      css += `  ${selector} {\n    display: none !important;\n  }\n`;
      css += `}\n`;
      css += `{% endif %}\n\n`;
    } else if (value === true || value === 'true') {
      css += `${mediaQuery} {\n`;
      css += `  ${selector} {\n    display: none !important;\n  }\n`;
      css += `}\n\n`;
    }
  });


  // Generate divider CSS
  if (element.type === 'divider') {
    const bw = shouldEnableInSchema(element.type, 'borderWidth', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'borderWidth') : element.style?.borderWidth;
    const bc = shouldEnableInSchema(element.type, 'borderColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'borderColor') : element.style?.borderColor;
    const w = shouldEnableInSchema(element.type, 'width', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'width', 'desktop') : element.style?.width;
    const mt = shouldEnableInSchema(element.type, 'marginTop', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'marginTop', 'desktop') : element.style?.marginTop;
    const mb = shouldEnableInSchema(element.type, 'marginBottom', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'marginBottom', 'desktop') : element.style?.marginBottom;
    const ml = shouldEnableInSchema(element.type, 'marginLeft', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'marginLeft', 'desktop') : element.style?.marginLeft;
    const mr = shouldEnableInSchema(element.type, 'marginRight', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'marginRight', 'desktop') : element.style?.marginRight;
    css += `${selector} {\n  border: none;\n  border-top: ${bw} solid ${bc};\n  width: ${w};\n  margin-top: ${mt};\n  margin-bottom: ${mb};\n  margin-left: ${ml};\n  margin-right: ${mr};\n}\n\n`;
  }

  // Generate accordion CSS
  if (element.type === 'accordion') {
    const titleBg = shouldEnableInSchema(element.type, 'titleBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'titleBackgroundColor') : element.style?.titleBackgroundColor;
    const titleClr = shouldEnableInSchema(element.type, 'titleColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'titleColor') : element.style?.titleColor;
    const titleFs = shouldEnableInSchema(element.type, 'titleFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'titleFontSize', 'desktop') : element.style?.titleFontSize;
    const titleFw = shouldEnableInSchema(element.type, 'titleFontWeight', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'titleFontWeight') : element.style?.titleFontWeight;
    const contentBg = shouldEnableInSchema(element.type, 'contentBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'contentBackgroundColor') : element.style?.contentBackgroundColor;
    const bdrClr = shouldEnableInSchema(element.type, 'borderColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'borderColor') : element.style?.borderColor;
    const bdrRad = shouldEnableInSchema(element.type, 'borderRadius', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'borderRadius') : element.style?.borderRadius;
    const accGap = shouldEnableInSchema(element.type, 'gap', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'gap') : element.style?.gap;
    css += `${selector} {\n  display: flex;\n  flex-direction: column;\n  gap: ${accGap};\n}\n`;
    css += `${selector} .accordion__item {\n  border-width: 1px;\n  border-style: solid;\n  border-color: ${bdrClr};\n  border-radius: ${bdrRad};\n  overflow: hidden;\n}\n`;
    const titleFf = shouldEnableInSchema(element.type, 'titleFontFamily', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'titleFontFamily') : element.style?.titleFontFamily;
    const contentFs = shouldEnableInSchema(element.type, 'contentFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'contentFontSize', 'desktop') : element.style?.contentFontSize;
    css += `${selector} .accordion__title {\n  padding: 12px 16px;\n  background: ${titleBg};\n  color: ${titleClr};\n  font-family: ${titleFf};\n  font-size: ${titleFs};\n  font-weight: ${titleFw};\n  cursor: pointer;\n  list-style: none;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n`;
    css += `${selector} .accordion__title::-webkit-details-marker { display: none; }\n`;
    css += `${selector} .accordion__chevron-down,\n${selector} .accordion__chevron-up {\n  width: 16px;\n  height: 16px;\n  flex-shrink: 0;\n}\n`;
    css += `${selector} details:not([open]) .accordion__chevron-up { display: none; }\n`;
    css += `${selector} details[open] .accordion__chevron-down { display: none; }\n`;
    css += `${selector} .accordion__content {\n  padding: 12px 16px;\n  background: ${contentBg};\n  font-size: ${contentFs};\n}\n`;
    // Responsive font sizes for accordion
    if (shouldEnableInSchema(element.type, 'titleFontSize', element.schemaToggles, element.style)) {
      const titleFsMobile = generateLiquidVar(element.id, 'titleFontSize', 'mobile');
      const titleFsFull = generateLiquidVar(element.id, 'titleFontSize', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} .accordion__title { font-size: ${titleFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .accordion__title { font-size: ${titleFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .accordion__title { font-size: ${titleFsFull}; }\n}\n`;
    }
    if (shouldEnableInSchema(element.type, 'contentFontSize', element.schemaToggles, element.style)) {
      const contentFsMobile = generateLiquidVar(element.id, 'contentFontSize', 'mobile');
      const contentFsFull = generateLiquidVar(element.id, 'contentFontSize', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} .accordion__content { font-size: ${contentFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .accordion__content { font-size: ${contentFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .accordion__content { font-size: ${contentFsFull}; }\n}\n`;
    }
    css += `\n`;
  }

  // Generate tabs CSS
  if (element.type === 'tabs') {
    const tabBg = shouldEnableInSchema(element.type, 'tabBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tabBackgroundColor') : element.style?.tabBackgroundColor;
    const tabActiveBg = shouldEnableInSchema(element.type, 'tabActiveBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tabActiveBackgroundColor') : element.style?.tabActiveBackgroundColor;
    const tabClr = shouldEnableInSchema(element.type, 'tabColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tabColor') : element.style?.tabColor;
    const tabActiveClr = shouldEnableInSchema(element.type, 'tabActiveColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tabActiveColor') : element.style?.tabActiveColor;
    const tabFs = shouldEnableInSchema(element.type, 'tabFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tabFontSize', 'desktop') : element.style?.tabFontSize;
    const contentBg = shouldEnableInSchema(element.type, 'contentBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'contentBackgroundColor') : element.style?.contentBackgroundColor;
    const bdrClr = shouldEnableInSchema(element.type, 'borderColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'borderColor') : element.style?.borderColor;
    css += `${selector} .tabs__nav {\n  display: flex;\n  border-bottom-width: 1px;\n  border-bottom-style: solid;\n  border-bottom-color: ${bdrClr};\n}\n`;
    const tabFf = shouldEnableInSchema(element.type, 'tabFontFamily', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tabFontFamily') : element.style?.tabFontFamily;
    const tabFw = shouldEnableInSchema(element.type, 'tabFontWeight', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tabFontWeight') : element.style?.tabFontWeight;
    const tabContentFs = shouldEnableInSchema(element.type, 'contentFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'contentFontSize', 'desktop') : element.style?.contentFontSize;
    css += `${selector} .tabs__button {\n  padding: 10px 20px;\n  border: none;\n  background: ${tabBg};\n  color: ${tabClr};\n  font-family: ${tabFf};\n  font-size: ${tabFs};\n  font-weight: ${tabFw};\n  cursor: pointer;\n  border-bottom: 2px solid transparent;\n  transition: all 0.2s;\n}\n`;
    css += `${selector} .tabs__button.active {\n  background: ${tabActiveBg};\n  color: ${tabActiveClr};\n  border-bottom-color: ${tabActiveClr};\n}\n`;
    css += `${selector} .tabs__panel {\n  display: none;\n  padding: 16px;\n  background: ${contentBg};\n  font-size: ${tabContentFs};\n}\n`;
    css += `${selector} .tabs__panel.active {\n  display: block;\n}\n`;
    // Responsive font sizes for tabs
    if (shouldEnableInSchema(element.type, 'tabFontSize', element.schemaToggles, element.style)) {
      const tabFsMobile = generateLiquidVar(element.id, 'tabFontSize', 'mobile');
      const tabFsFull = generateLiquidVar(element.id, 'tabFontSize', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} .tabs__button { font-size: ${tabFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .tabs__button { font-size: ${tabFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .tabs__button { font-size: ${tabFsFull}; }\n}\n`;
    }
    if (shouldEnableInSchema(element.type, 'contentFontSize', element.schemaToggles, element.style)) {
      const contentFsMobile = generateLiquidVar(element.id, 'contentFontSize', 'mobile');
      const contentFsFull = generateLiquidVar(element.id, 'contentFontSize', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} .tabs__panel { font-size: ${contentFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .tabs__panel { font-size: ${contentFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .tabs__panel { font-size: ${contentFsFull}; }\n}\n`;
    }
    css += `\n`;
  }

  // Generate countdown CSS
  if (element.type === 'countdown') {
    const digitClr = shouldEnableInSchema(element.type, 'digitColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'digitColor') : element.style?.digitColor;
    const labelClr = shouldEnableInSchema(element.type, 'labelColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'labelColor') : element.style?.labelColor;
    const digitFs = shouldEnableInSchema(element.type, 'digitFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'digitFontSize', 'desktop') : element.style?.digitFontSize;
    const labelFs = shouldEnableInSchema(element.type, 'labelFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'labelFontSize', 'desktop') : element.style?.labelFontSize;
    const sepStyleEnabled = shouldEnableInSchema(element.type, 'separatorStyle', element.schemaToggles, element.style);
    const bgClr = shouldEnableInSchema(element.type, 'backgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'backgroundColor') : element.style?.backgroundColor;
    css += `${selector} {\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 8px;${bgClr ? `\n  background-color: ${bgClr};` : ''}\n  padding: 16px;\n}\n`;
    css += `${selector} .countdown__unit {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n`;
    const digitFf = shouldEnableInSchema(element.type, 'digitFontFamily', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'digitFontFamily') : element.style?.digitFontFamily;
    css += `${selector} .countdown__digit {\n  font-family: ${digitFf};\n  font-size: ${digitFs};\n  font-weight: 700;\n  color: ${digitClr};\n  line-height: 1;\n}\n`;
    css += `${selector} .countdown__label {\n  font-size: ${labelFs};\n  color: ${labelClr};\n  text-transform: uppercase;\n}\n`;
    css += `${selector} .countdown__separator {\n  font-size: ${digitFs};\n  font-weight: 700;\n  color: ${digitClr};\n  line-height: 1;\n}\n`;
    if (sepStyleEnabled) {
      const sepStyleSetting = generateSettingId(element.id, 'separatorStyle');
      css += `{% if section.settings.${sepStyleSetting} == 'none' %}\n`;
      css += `${selector} .countdown__separator {\n  display: none;\n}\n`;
      css += `{% endif %}\n`;
    }
    // Responsive font sizes for countdown
    if (shouldEnableInSchema(element.type, 'digitFontSize', element.schemaToggles, element.style)) {
      const digitFsMobile = generateLiquidVar(element.id, 'digitFontSize', 'mobile');
      const digitFsFull = generateLiquidVar(element.id, 'digitFontSize', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} .countdown__digit, ${selector} .countdown__separator { font-size: ${digitFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .countdown__digit, ${selector} .countdown__separator { font-size: ${digitFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .countdown__digit, ${selector} .countdown__separator { font-size: ${digitFsFull}; }\n}\n`;
    }
    if (shouldEnableInSchema(element.type, 'labelFontSize', element.schemaToggles, element.style)) {
      const labelFsMobile = generateLiquidVar(element.id, 'labelFontSize', 'mobile');
      const labelFsFull = generateLiquidVar(element.id, 'labelFontSize', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} .countdown__label { font-size: ${labelFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .countdown__label { font-size: ${labelFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .countdown__label { font-size: ${labelFsFull}; }\n}\n`;
    }
    css += `\n`;
  }

  // Generate slideshow CSS
  if (element.type === 'slideshow') {
    const h = shouldEnableInSchema(element.type, 'height', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'height', 'desktop') : element.style?.height;
    const slideBg = shouldEnableInSchema(element.type, 'slideBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'slideBackgroundColor') : element.style?.slideBackgroundColor;
    const arrowClr = shouldEnableInSchema(element.type, 'arrowColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'arrowColor') : element.style?.arrowColor;
    const dotClr = shouldEnableInSchema(element.type, 'dotColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'dotColor') : element.style?.dotColor;
    const dotActiveClr = shouldEnableInSchema(element.type, 'dotActiveColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'dotActiveColor') : element.style?.dotActiveColor;
    css += `${selector} {\n  position: relative;\n  width: 100%;\n  height: ${h};\n  overflow: hidden;\n}\n`;
    css += `${selector} .slideshow__track {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  transition: transform 0.5s ease;\n}\n`;
    css += `${selector} .slideshow__slide {\n  min-width: 100%;\n  height: 100%;\n  display: none;\n  position: relative;\n  background: ${slideBg};\n}\n`;
    css += `${selector} .slideshow__slide.active {\n  display: block;\n}\n`;
    css += `${selector} .slideshow__image {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n`;
    const headFf = shouldEnableInSchema(element.type, 'headingFontFamily', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'headingFontFamily') : element.style?.headingFontFamily;
    const headFs = shouldEnableInSchema(element.type, 'headingFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'headingFontSize', 'desktop') : element.style?.headingFontSize;
    const headFw = shouldEnableInSchema(element.type, 'headingFontWeight', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'headingFontWeight') : element.style?.headingFontWeight;
    const textFs = shouldEnableInSchema(element.type, 'textFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'textFontSize', 'desktop') : element.style?.textFontSize;
    css += `${selector} .slideshow__content {\n  position: absolute;\n  bottom: 20%;\n  left: 5%;\n  color: #fff;\n  text-shadow: 0 2px 4px rgba(0,0,0,0.5);\n}\n`;
    css += `${selector} .slideshow__heading {\n  font-family: ${headFf};\n  font-size: ${headFs};\n  font-weight: ${headFw};\n  margin: 0;\n}\n`;
    css += `${selector} .slideshow__text {\n  font-size: ${textFs};\n  margin: 8px 0 0;\n}\n`;
    css += `${selector} .slideshow__arrow {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  background: none;\n  color: ${arrowClr};\n  border: none;\n  padding: 16px 12px;\n  cursor: pointer;\n  font-size: 20px;\n  z-index: 2;\n}\n`;
    css += `${selector} .slideshow__arrow--prev { left: 8px; }\n`;
    css += `${selector} .slideshow__arrow--next { right: 8px; }\n`;
    css += `${selector} .slideshow__dots {\n  position: absolute;\n  bottom: 16px;\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;\n  gap: 8px;\n  z-index: 2;\n}\n`;
    css += `${selector} .slideshow__dot {\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  border: none;\n  background: ${dotClr};\n  cursor: pointer;\n}\n`;
    css += `${selector} .slideshow__dot.active {\n  background: ${dotActiveClr};\n}\n`;
    // Responsive font sizes for slideshow
    if (shouldEnableInSchema(element.type, 'headingFontSize', element.schemaToggles, element.style)) {
      const headFsMobile = generateLiquidVar(element.id, 'headingFontSize', 'mobile');
      const headFsFull = generateLiquidVar(element.id, 'headingFontSize', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} .slideshow__heading { font-size: ${headFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .slideshow__heading { font-size: ${headFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .slideshow__heading { font-size: ${headFsFull}; }\n}\n`;
    }
    if (shouldEnableInSchema(element.type, 'textFontSize', element.schemaToggles, element.style)) {
      const textFsMobile = generateLiquidVar(element.id, 'textFontSize', 'mobile');
      const textFsFull = generateLiquidVar(element.id, 'textFontSize', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} .slideshow__text { font-size: ${textFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .slideshow__text { font-size: ${textFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .slideshow__text { font-size: ${textFsFull}; }\n}\n`;
    }
    css += `\n`;
  }

  // Generate popup CSS
  if (element.type === 'popup') {
    const overlayClr = shouldEnableInSchema(element.type, 'overlayColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'overlayColor') : element.style?.overlayColor;
    const popBg = shouldEnableInSchema(element.type, 'backgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'backgroundColor') : element.style?.backgroundColor;
    const popClr = shouldEnableInSchema(element.type, 'color', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'color') : element.style?.color;
    const trigBg = shouldEnableInSchema(element.type, 'triggerButtonBg', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'triggerButtonBg') : element.style?.triggerButtonBg;
    const trigClr = shouldEnableInSchema(element.type, 'triggerButtonColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'triggerButtonColor') : element.style?.triggerButtonColor;
    const popFf = shouldEnableInSchema(element.type, 'fontFamily', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'fontFamily') : element.style?.fontFamily;
    const popFs = shouldEnableInSchema(element.type, 'fontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'fontSize', 'desktop') : element.style?.fontSize;
    const popBr = element.style?.borderRadius;
    css += `${selector} {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n`;
    css += `${selector} .popup-trigger {\n  padding: 12px 24px;\n  font-size: ${popFs};\n  font-family: ${popFf};\n  font-weight: 600;\n  background-color: ${trigBg};\n  color: ${trigClr};\n  border: none;\n  border-radius: ${popBr};\n  cursor: pointer;\n}\n`;
    css += `${selector} .popup-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: ${overlayClr};\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n}\n`;
    const popW = shouldEnableInSchema(element.type, 'width', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'width', 'desktop') : element.style?.width;
    const popPt = shouldEnableInSchema(element.type, 'paddingTop', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'paddingTop', 'desktop') : element.style?.paddingTop;
    const popPb = shouldEnableInSchema(element.type, 'paddingBottom', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'paddingBottom', 'desktop') : element.style?.paddingBottom;
    const popPl = shouldEnableInSchema(element.type, 'paddingLeft', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'paddingLeft', 'desktop') : element.style?.paddingLeft;
    const popPr = shouldEnableInSchema(element.type, 'paddingRight', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'paddingRight', 'desktop') : element.style?.paddingRight;
    css += `${selector} .popup-modal {\n  background-color: ${popBg};\n  color: ${popClr};\n  border-radius: ${popBr};\n  box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n  width: ${popW};\n  max-width: 90vw;\n  padding: ${popPt} ${popPr} ${popPb} ${popPl};\n  position: relative;\n  font-family: ${popFf};\n}\n`;
    css += `${selector} .popup-close {\n  position: absolute;\n  top: 12px;\n  right: 12px;\n  background: none;\n  border: none;\n  font-size: 20px;\n  cursor: pointer;\n  color: #999;\n  line-height: 1;\n}\n`;
    css += `${selector} .popup-title {\n  margin: 0 0 12px 0;\n}\n`;
    css += `${selector} .popup-content {\n  margin: 0 0 20px 0;\n  line-height: 1.6;\n}\n`;
    css += `${selector} .popup-email-row {\n  display: flex;\n  gap: 8px;\n}\n`;
    css += `${selector} .popup-email-input {\n  flex: 1;\n  padding: 10px 12px;\n  font-size: 14px;\n  border: 1px solid #dee2e6;\n  border-radius: 4px;\n}\n`;
    css += `${selector} .popup-submit {\n  padding: 10px 20px;\n  font-size: 14px;\n  font-weight: 600;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n`;
    css += `${selector} .popup-success {\n  text-align: center;\n  padding: 12px 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: ${popClr};\n}\n`;
    // Responsive popup modal props
    const popupModalProps = [
      { name: 'width', css: 'width' },
      { name: 'paddingTop', css: 'padding-top' },
      { name: 'paddingBottom', css: 'padding-bottom' },
      { name: 'paddingLeft', css: 'padding-left' },
      { name: 'paddingRight', css: 'padding-right' },
      { name: 'fontSize', css: 'font-size' },
    ];
    popupModalProps.forEach(({ name, css: cssProp }) => {
      if (shouldEnableInSchema(element.type, name, element.schemaToggles, element.style)) {
        const mobile = generateLiquidVar(element.id, name, 'mobile');
        const full = generateLiquidVar(element.id, name, 'fullscreen');
        css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .popup-modal { ${cssProp}: ${mobile}; }\n}\n`;
        css += `@media (min-width: 1200px) {\n  ${selector} .popup-modal { ${cssProp}: ${full}; }\n}\n`;
      }
    });
    css += `\n`;
  }

  // Generate product-card structural CSS (border, button)
  if (element.type === 'product-card') {
    css += `${selector} {\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  border-width: 1px;\n  border-style: solid;\n  border-color: #e0e0e0;\n}\n`;
  }

  // Generate product-card button CSS (buttonColor, buttonBackgroundColor)
  if (element.type === 'product-card') {
    const pcBtnClr = shouldEnableInSchema(element.type, 'buttonColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonColor') : (element.style?.buttonColor);
    const pcBtnBg = shouldEnableInSchema(element.type, 'buttonBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonBackgroundColor') : (element.style?.buttonBackgroundColor);
    css += `${selector} .product-card__button {\n  color: ${pcBtnClr};\n  background-color: ${pcBtnBg};\n  display: block;\n  width: 100%;\n  padding: 8px;\n  border-width: 1px;\n  border-style: solid;\n  cursor: pointer;\n  font-size: 12px;\n  font-weight: bold;\n  text-align: center;\n  text-decoration: none;\n}\n`;
    css += `\n`;
  }

  // Generate form button CSS (buttonColor, buttonBackgroundColor)
  if (element.type === 'form') {
    const frmBtnClr = shouldEnableInSchema(element.type, 'buttonColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonColor') : element.style?.buttonColor;
    const frmBtnBg = shouldEnableInSchema(element.type, 'buttonBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonBackgroundColor') : element.style?.buttonBackgroundColor;
    const frmBtnBdrRad = shouldEnableInSchema(element.type, 'buttonBorderRadius', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonBorderRadius') : element.style?.buttonBorderRadius;
    const frmBtnBdrClr = shouldEnableInSchema(element.type, 'buttonBorderColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonBorderColor') : element.style?.buttonBorderColor;
    css += `${selector} .form-submit {\n  color: ${frmBtnClr};\n  background-color: ${frmBtnBg};\n  border-radius: ${frmBtnBdrRad};\n  border-width: 1px;\n  border-style: solid;\n  border-color: ${frmBtnBdrClr};\n}\n`;
    css += `${selector} .form-field input,\n${selector} .form-field textarea {\n  border-width: 1px;\n  border-style: solid;\n  border-color: #d3d3d3;\n  border-radius: 4px;\n}\n`;

    // Form button hover states
    const frmBtnHoverPropMap = {
      buttonHoverColor: 'color',
      buttonHoverBackgroundColor: 'background-color',
      buttonHoverBorderColor: 'border-color',
    };
    const frmBtnHoverProps = [];
    let frmBtnHoverAnimation = null;

    if (elementDef.styleProps) {
      elementDef.styleProps.forEach(propDef => {
        if (!propDef.name.startsWith('buttonHover')) return;

        if (propDef.name === 'buttonHoverAnimation') {
          const val = element.style?.[propDef.name];
          const isSchemaEnabled = shouldEnableInSchema(element.type, propDef.name, element.schemaToggles, element.style);
          if (isSchemaEnabled) {
            frmBtnHoverAnimation = generateLiquidVar(element.id, propDef.name, null);
          } else if (val) {
            frmBtnHoverAnimation = val;
          }
          return;
        }

        const isSchemaEnabled = shouldEnableInSchema(element.type, propDef.name, element.schemaToggles, element.style);
        if (!isSchemaEnabled && !element.style?.[propDef.name]) return;

        const cssPropName = frmBtnHoverPropMap[propDef.name];
        if (!cssPropName) return;
        const value = element.style?.[propDef.name];

        if (isSchemaEnabled) {
          const liquidVar = generateLiquidVar(element.id, propDef.name, null);
          const settingId = generateSettingId(element.id, propDef.name, null);
          frmBtnHoverProps.push(`{% if section.settings.${settingId} != blank %}${cssPropName}: ${liquidVar};{% endif %}`);
        } else if (value) {
          frmBtnHoverProps.push(`${cssPropName}: ${value};`);
        }
      });
    }

    css += `${selector} .form-submit {\n  transition: all 0.3s ease;\n}\n`;
    css += `${selector} .form-submit:hover {\n  border-width: 1px;\n  border-style: solid;\n`;

    frmBtnHoverProps.forEach(prop => {
      css += `  ${prop}\n`;
    });

    if (frmBtnHoverAnimation) {
      const animName = `frm-btn-hover-${element.id}`;
      const animMap = {
        grow: `@keyframes ${animName} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`,
        shrink: `@keyframes ${animName} { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.95); } }`,
        shake: `@keyframes ${animName} { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`,
        pulse: `@keyframes ${animName} { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.9; } }`,
        bounce: `@keyframes ${animName} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`,
        rotate: `@keyframes ${animName} { 0% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } 100% { transform: rotate(0deg); } }`,
      };
      const durationMap = { grow: '0.3s', shrink: '0.3s', shake: '0.3s', pulse: '0.6s', bounce: '0.4s', rotate: '0.4s' };
      if (animMap[frmBtnHoverAnimation]) {
        css += `  animation: ${animName} ${durationMap[frmBtnHoverAnimation]} ease;\n`;
        css = `${animMap[frmBtnHoverAnimation]}\n${css}`;
      }
    }

    css += `}\n\n`;

    css += `\n`;
  }

  // Generate popup title/button CSS (titleFontSize, buttonColor, buttonBackgroundColor)
  if (element.type === 'popup') {
    const popTitleFs = shouldEnableInSchema(element.type, 'titleFontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'titleFontSize', 'desktop') : element.style?.titleFontSize;
    const popBtnClr = shouldEnableInSchema(element.type, 'buttonColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonColor') : element.style?.buttonColor;
    const popBtnBg = shouldEnableInSchema(element.type, 'buttonBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonBackgroundColor') : element.style?.buttonBackgroundColor;
    css += `${selector} .popup-title {\n  font-size: ${popTitleFs};\n}\n`;
    css += `${selector} .popup-submit {\n  color: ${popBtnClr};\n  background-color: ${popBtnBg};\n}\n`;
    if (shouldEnableInSchema(element.type, 'titleFontSize', element.schemaToggles, element.style)) {
      const popTitleFsMobile = generateLiquidVar(element.id, 'titleFontSize', 'mobile');
      const popTitleFsFull = generateLiquidVar(element.id, 'titleFontSize', 'fullscreen');
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .popup-title { font-size: ${popTitleFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .popup-title { font-size: ${popTitleFsFull}; }\n}\n`;
    }
    css += `\n`;
  }

  // Generate flip-card button CSS (buttonColor, buttonBackgroundColor)
  if (element.type === 'flip-card') {
    const fcBtnClr = shouldEnableInSchema(element.type, 'buttonColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonColor') : element.style?.buttonColor;
    const fcBtnBg = shouldEnableInSchema(element.type, 'buttonBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'buttonBackgroundColor') : element.style?.buttonBackgroundColor;
    css += `${selector} .flip-card__btn {\n  color: ${fcBtnClr};\n  background-color: ${fcBtnBg};\n}\n`;
    css += `\n`;
  }

  // Generate before-after dedicated CSS (structural + sliderColor)
  if (element.type === 'before-after') {
    const baSliderClr = shouldEnableInSchema(element.type, 'sliderColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'sliderColor') : element.style?.sliderColor;
    css += `${selector} {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n  user-select: none;\n  cursor: ew-resize;\n}\n`;
    css += `${selector} .ba-after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n`;
    css += `${selector} .ba-after img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  pointer-events: none;\n  -webkit-user-drag: none;\n}\n`;
    css += `${selector} .ba-before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  overflow: hidden;\n}\n`;
    css += `${selector} .ba-before-inner {\n  height: 100%;\n}\n`;
    css += `${selector} .ba-before img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  pointer-events: none;\n  -webkit-user-drag: none;\n}\n`;
    css += `${selector} .ba-handle {\n  position: absolute;\n  top: 0;\n  transform: translateX(-50%);\n  width: 4px;\n  height: 100%;\n  background-color: ${baSliderClr};\n  cursor: ew-resize;\n  z-index: 2;\n}\n`;
    css += `${selector} .ba-handle > div {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  background-color: ${baSliderClr};\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 6px rgba(0,0,0,0.3);\n}\n`;
    css += `${selector} .ba-handle > div svg {\n  width: 16px;\n  height: 16px;\n  fill: #333;\n}\n`;
    css += `\n`;
  }

  // Generate table CSS (cell padding, border, header colors via CSS custom properties)
  if (element.type === 'table') {
    const tblCellPad = shouldEnableInSchema(element.type, 'tableCellPadding', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tableCellPadding') : element.style?.tableCellPadding;
    const tblBw = shouldEnableInSchema(element.type, 'tableBorderWidth', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tableBorderWidth') : element.style?.tableBorderWidth;
    const tblBc = shouldEnableInSchema(element.type, 'tableBorderColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'tableBorderColor') : element.style?.tableBorderColor;
    const tblHeaderBg = shouldEnableInSchema(element.type, 'headerColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'headerColor') : element.style?.headerColor;
    const tblHeaderClr = shouldEnableInSchema(element.type, 'headerTextColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'headerTextColor') : element.style?.headerTextColor;
    const tblTextAlign = shouldEnableInSchema(element.type, 'textAlign', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'textAlign') : element.style?.textAlign;
    css += `${selector} {\n  --table-cell-padding: ${tblCellPad};\n  --table-border-width: ${tblBw};\n  --table-border-color: ${tblBc};\n  --table-header-bg: ${tblHeaderBg};\n  --table-header-color: ${tblHeaderClr};\n  --table-text-align: ${tblTextAlign};\n}\n`;
    css += `${selector} table {\n  border-collapse: collapse;\n}\n`;
    css += `${selector} table th,\n${selector} table td {\n  border: var(--table-border-width) solid var(--table-border-color);\n  padding: var(--table-cell-padding);\n  text-align: var(--table-text-align);\n}\n`;
    css += `${selector} table thead {\n  background-color: var(--table-header-bg);\n  color: var(--table-header-color);\n}\n`;
    css += `${selector} table th {\n  font-weight: bold;\n}\n`;
    css += `${selector}.table--striped table tbody tr:nth-child(even) {\n  background-color: #f9f9f9;\n}\n`;
    css += `${selector}.table--hover table tbody tr:hover {\n  background-color: #f0f0f0;\n}\n`;
    css += `\n`;
  }

  // Generate image-background/background-overlay CSS (background-image URL)
  if (element.type === 'image-background' || element.type === 'background-overlay') {
    const isSrcEnabled = shouldEnableInSchema(element.type, 'src', element.schemaToggles, element.style);
    if (isSrcEnabled) {
      const srcSettingId = generateSettingId(element.id, 'src');
      css += `{% if section.settings.${srcSettingId} != blank %}${selector} {\n  background-image: url('{{ section.settings.${srcSettingId} | image_url: width: 1920 }}');\n}{% endif %}\n`;
    } else {
      const src = element.props?.src;
      if (src && !src.startsWith('data:')) {
        css += `${selector} {\n  background-image: url('${src}');\n}\n`;
      }
    }
    css += `\n`;
  }

  // Generate image-gallery CSS (grid columns)
  if (element.type === 'image-gallery') {
    const galCols = element.props?.columns;
    const isGalColsEnabled = shouldEnableInSchema(element.type, 'columns', element.schemaToggles, element.style);
    const galColsVal = isGalColsEnabled
      ? generateLiquidVar(element.id, 'columns', 'desktop') : galCols;
    css += `${selector} {\n  display: grid;\n  grid-template-columns: repeat(${galColsVal}, 1fr);\n}\n`;
    css += `\n`;
  }

  // Generate blog-post grid CSS (columns)
  if (element.type === 'blog-post') {
    const bpCols = element.style?.columns;
    const isBpColsEnabled = shouldEnableInSchema(element.type, 'columns', element.schemaToggles, element.style);
    const bpColsVal = isBpColsEnabled
      ? generateLiquidVar(element.id, 'columns', 'desktop') : bpCols;
    css += `${selector} {\n  display: grid;\n  grid-template-columns: repeat(${bpColsVal}, 1fr);\n}\n`;
    css += `\n`;
  }

  // Generate marquee CSS
  if (element.type === 'marquee') {
    const mqBg = shouldEnableInSchema(element.type, 'backgroundColor', element.schemaToggles)
      ? generateLiquidVar(element.id, 'backgroundColor') : element.style?.backgroundColor;
    const mqClr = shouldEnableInSchema(element.type, 'color', element.schemaToggles)
      ? generateLiquidVar(element.id, 'color') : element.style?.color;
    const mqFf = shouldEnableInSchema(element.type, 'fontFamily', element.schemaToggles)
      ? generateLiquidVar(element.id, 'fontFamily') : element.style?.fontFamily;
    const mqFs = shouldEnableInSchema(element.type, 'fontSize', element.schemaToggles)
      ? generateLiquidVar(element.id, 'fontSize', 'desktop') : element.style?.fontSize;
    const mqFw = shouldEnableInSchema(element.type, 'fontWeight', element.schemaToggles)
      ? generateLiquidVar(element.id, 'fontWeight') : element.style?.fontWeight;
    const mqPt = '12px';
    const mqPb = '12px';
    const mqSpeed = shouldEnableInSchema(element.type, 'speed', element.schemaToggles)
      ? `{{ section.settings.${generateSettingId(element.id, 'speed')} }}` : element.props?.speed;
    const mqDir = shouldEnableInSchema(element.type, 'direction', element.schemaToggles)
      ? `{{ section.settings.${generateSettingId(element.id, 'direction')} }}` : element.props?.direction;
    const mqPauseEnabled = shouldEnableInSchema(element.type, 'pauseOnHover', element.schemaToggles);

    css += `@keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }\n`;
    css += `@keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }\n`;
    css += `${selector} {\n  overflow: hidden;\n  width: 100%;\n  background-color: ${mqBg};\n  padding-top: ${mqPt};\n  padding-bottom: ${mqPb};\n}\n`;
    css += `${selector} .marquee-track {\n  display: flex;\n  white-space: nowrap;\n  width: max-content;\n  animation: marquee-${mqDir} ${mqSpeed}s linear infinite;\n}\n`;
    css += `${selector} .marquee-track span {\n  color: ${mqClr};\n  font-size: ${mqFs};\n  font-family: ${mqFf};\n  font-weight: ${mqFw};\n  padding-right: 40px;\n}\n`;
    if (mqPauseEnabled) {
      css += `{% if section.settings.${generateSettingId(element.id, 'pauseOnHover')} %}${selector}:hover .marquee-track { animation-play-state: paused; }\n{% endif %}\n`;
    } else if (element.props?.pauseOnHover !== false) {
      css += `${selector}:hover .marquee-track { animation-play-state: paused; }\n`;
    }
    // Responsive marquee props
    const marqueeResponsiveProps = [
      { name: 'fontSize', css: 'font-size', target: ' .marquee-track span' },
      { name: 'paddingTop', css: 'padding-top', target: '' },
      { name: 'paddingBottom', css: 'padding-bottom', target: '' },
    ];
    marqueeResponsiveProps.forEach(({ name, css: cssProp, target }) => {
      if (shouldEnableInSchema(element.type, name, element.schemaToggles)) {
        const mobile = generateLiquidVar(element.id, name, 'mobile');
        const full = generateLiquidVar(element.id, name, 'fullscreen');
        css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector}${target} { ${cssProp}: ${mobile}; }\n}\n`;
        css += `@media (min-width: 1200px) {\n  ${selector}${target} { ${cssProp}: ${full}; }\n}\n`;
      }
    });
    css += `\n`;
  }

  // Generate responsive CSS for image-gallery columns
  if (element.type === 'image-gallery' && shouldEnableInSchema(element.type, 'columns', element.schemaToggles, element.style)) {
    const galColsMobile = generateLiquidVar(element.id, 'columns', 'mobile');
    const galColsFull = generateLiquidVar(element.id, 'columns', 'fullscreen');
    css += `@media (max-width: 575px) {\n  ${selector} { grid-template-columns: repeat(${galColsMobile}, 1fr) !important; }\n}\n`;
    css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} { grid-template-columns: repeat(${galColsMobile}, 1fr) !important; }\n}\n`;
    css += `@media (min-width: 1200px) {\n  ${selector} { grid-template-columns: repeat(${galColsFull}, 1fr) !important; }\n}\n\n`;
  }

  // Generate blog-post CSS
  if (element.type === 'blog-post') {
    const bpGap = shouldEnableInSchema(element.type, 'gap', element.schemaToggles)
      ? generateLiquidVar(element.id, 'gap', 'desktop') : element.style?.gap;
    const bpFf = shouldEnableInSchema(element.type, 'fontFamily', element.schemaToggles)
      ? generateLiquidVar(element.id, 'fontFamily') : element.style?.fontFamily;
    const bpCols = shouldEnableInSchema(element.type, 'columns', element.schemaToggles)
      ? generateLiquidVar(element.id, 'columns', 'desktop') : element.style?.columns;
    const bpBg = shouldEnableInSchema(element.type, 'backgroundColor', element.schemaToggles)
      ? generateLiquidVar(element.id, 'backgroundColor') : element.style?.backgroundColor;
    const bpClr = shouldEnableInSchema(element.type, 'color', element.schemaToggles)
      ? generateLiquidVar(element.id, 'color') : element.style?.color;
    const bpLinkClr = shouldEnableInSchema(element.type, 'linkColor', element.schemaToggles)
      ? generateLiquidVar(element.id, 'linkColor') : element.style?.linkColor;
    const bpFs = shouldEnableInSchema(element.type, 'fontSize', element.schemaToggles)
      ? generateLiquidVar(element.id, 'fontSize', 'desktop') : element.style?.fontSize;
    const bpTitleFs = shouldEnableInSchema(element.type, 'titleFontSize', element.schemaToggles)
      ? generateLiquidVar(element.id, 'titleFontSize', 'desktop') : element.style?.titleFontSize;
    const bpBr = shouldEnableInSchema(element.type, 'borderRadius', element.schemaToggles)
      ? generateLiquidVar(element.id, 'borderRadius') : element.style?.borderRadius;

    css += `${selector} {\n  display: grid;\n  grid-template-columns: repeat(${bpCols}, 1fr);\n  gap: ${bpGap};\n  width: 100%;\n  box-sizing: border-box;\n  font-family: ${bpFf};\n}\n`;
    css += `${selector} .blog-post-card {\n  background-color: ${bpBg};\n  border-width: 1px;\n  border-style: solid;\n  border-color: #e0e0e0;\n  border-radius: ${bpBr};\n  overflow: hidden;\n}\n`;
    css += `${selector} .blog-post__image {\n  width: 100%;\n  aspect-ratio: 16/9;\n  object-fit: cover;\n}\n`;
    css += `${selector} .blog-post__content {\n  padding: 16px;\n}\n`;
    css += `${selector} .blog-post__date {\n  font-size: 12px;\n  color: #999;\n  margin-bottom: 4px;\n}\n`;
    css += `${selector} .blog-post__author {\n  font-size: 12px;\n  color: #999;\n  margin-bottom: 8px;\n}\n`;
    css += `${selector} .blog-post__title {\n  margin: 0 0 8px 0;\n  font-size: ${bpTitleFs};\n  color: ${bpClr};\n}\n`;
    css += `${selector} .blog-post__title a {\n  color: inherit;\n  text-decoration: none;\n}\n`;
    css += `${selector} .blog-post__excerpt {\n  margin: 0 0 12px 0;\n  font-size: ${bpFs};\n  color: #666;\n  line-height: 1.5;\n}\n`;
    css += `${selector} .blog-post__link {\n  font-size: ${bpFs};\n  color: ${bpLinkClr};\n  text-decoration: none;\n  font-weight: 600;\n}\n`;
    css += `\n`;
  }

  // Generate responsive CSS for blog-post columns and titleFontSize
  if (element.type === 'blog-post') {
    if (shouldEnableInSchema(element.type, 'columns', element.schemaToggles, element.style)) {
      const bpColsMobile = generateLiquidVar(element.id, 'columns', 'mobile');
      const bpColsFull = generateLiquidVar(element.id, 'columns', 'fullscreen');
      css += `@media (max-width: 575px) {\n  ${selector} { grid-template-columns: repeat(${bpColsMobile}, 1fr) !important; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} { grid-template-columns: repeat(${bpColsMobile}, 1fr) !important; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} { grid-template-columns: repeat(${bpColsFull}, 1fr) !important; }\n}\n`;
    }
    if (shouldEnableInSchema(element.type, 'titleFontSize', element.schemaToggles, element.style)) {
      const bpTitleFsMobile = generateLiquidVar(element.id, 'titleFontSize', 'mobile');
      const bpTitleFsDesktop = generateLiquidVar(element.id, 'titleFontSize', 'desktop');
      const bpTitleFsFull = generateLiquidVar(element.id, 'titleFontSize', 'fullscreen');
      css += `${selector} .blog-post__title { font-size: ${bpTitleFsDesktop}; }\n`;
      css += `@media (max-width: 575px) {\n  ${selector} .blog-post__title { font-size: ${bpTitleFsMobile}; }\n}\n`;
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} .blog-post__title { font-size: ${bpTitleFsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} .blog-post__title { font-size: ${bpTitleFsFull}; }\n}\n`;
    }
    css += `\n`;
  }

  // Generate flip-card CSS
  if (element.type === 'flip-card') {
    const fcAspectRatioEnabled = shouldEnableInSchema(element.type, 'cardAspectRatio', element.schemaToggles, element.style);
    const fcBr = shouldEnableInSchema(element.type, 'borderRadius', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'borderRadius') : element.style?.borderRadius;
    const fcFf = shouldEnableInSchema(element.type, 'fontFamily', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'fontFamily') : element.style?.fontFamily;
    const fcFs = shouldEnableInSchema(element.type, 'fontSize', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'fontSize', 'desktop') : element.style?.fontSize;
    const fcFrontBg = shouldEnableInSchema(element.type, 'frontBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'frontBackgroundColor') : element.style?.frontBackgroundColor;
    const fcFrontClr = shouldEnableInSchema(element.type, 'frontColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'frontColor') : element.style?.frontColor;
    const fcBackBg = shouldEnableInSchema(element.type, 'backBackgroundColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'backBackgroundColor') : element.style?.backBackgroundColor;
    const fcBackClr = shouldEnableInSchema(element.type, 'backColor', element.schemaToggles, element.style)
      ? generateLiquidVar(element.id, 'backColor') : element.style?.backColor;
    const fcShadowX = element.style?.boxShadowOffsetX;
    const fcShadowY = element.style?.boxShadowOffsetY;
    const fcShadowBlur = element.style?.boxShadowBlur;
    const fcShadowSpread = element.style?.boxShadowSpread;
    const fcShadowColor = element.style?.boxShadowColor;
    const fcShadow = `${fcShadowX} ${fcShadowY} ${fcShadowBlur} ${fcShadowSpread} ${fcShadowColor}`;
    if (fcAspectRatioEnabled) {
      const arSettingId = generateSettingId(element.id, 'cardAspectRatio');
      css += `${selector} {\n  perspective: 1000px;\n  cursor: pointer;\n  font-family: ${fcFf};\n}\n`;
      css += `{% if section.settings.${arSettingId} == '9/16' %}\n${selector} { width: 143px; height: 200px; }\n{% else %}\n${selector} { width: 200px; height: 200px; }\n{% endif %}\n`;
    } else {
      const arVal = element.style?.cardAspectRatio;
      const fcW = arVal === '9/16' ? '143px' : '200px';
      css += `${selector} {\n  width: ${fcW};\n  height: 200px;\n  perspective: 1000px;\n  cursor: pointer;\n  font-family: ${fcFf};\n}\n`;
    }
    css += `${selector} .flip-card__inner {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transition: transform 0.6s ease;\n  transform-style: preserve-3d;\n}\n`;
    css += `${selector}:hover .flip-card__inner {\n  transform: rotateY(180deg);\n}\n`;
    css += `${selector}[data-flip-direction="vertical"]:hover .flip-card__inner {\n  transform: rotateX(180deg);\n}\n`;
    css += `${selector} .flip-card__front,\n${selector} .flip-card__back {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  backface-visibility: hidden;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  box-sizing: border-box;\n  border-radius: ${fcBr};\n  box-shadow: ${fcShadow};\n}\n`;
    css += `${selector} .flip-card__front {\n  background-color: ${fcFrontBg};\n  color: ${fcFrontClr};\n}\n`;
    css += `${selector} .flip-card__back {\n  background-color: ${fcBackBg};\n  color: ${fcBackClr};\n  transform: rotateY(180deg);\n}\n`;
    css += `${selector}[data-flip-direction="vertical"] .flip-card__back {\n  transform: rotateX(180deg);\n}\n`;
    css += `${selector} .flip-card__image {\n  width: 60px;\n  height: 60px;\n  object-fit: cover;\n  border-radius: 50%;\n  margin-bottom: 12px;\n}\n`;
    css += `${selector} h4 {\n  margin: 0 0 8px 0;\n}\n`;
    css += `${selector} p {\n  margin: 0;\n  font-size: ${fcFs};\n  text-align: center;\n}\n`;
    css += `${selector} .flip-card__btn {\n  padding: 8px 20px;\n  text-decoration: none;\n  border-radius: 4px;\n  font-size: 13px;\n  font-weight: 600;\n  margin-top: 16px;\n  display: inline-block;\n}\n`;
    if (shouldEnableInSchema(element.type, 'fontSize', element.schemaToggles, element.style)) {
      const fsMobile = generateLiquidVar(element.id, 'fontSize', 'mobile');
      const fsFull = generateLiquidVar(element.id, 'fontSize', 'fullscreen');
      css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} p { font-size: ${fsMobile}; }\n}\n`;
      css += `@media (min-width: 1200px) {\n  ${selector} p { font-size: ${fsFull}; }\n}\n`;
    }
    css += `\n`;
  }

  // Generate responsive CSS for flip-card titleFontSize
  if (element.type === 'flip-card' && shouldEnableInSchema(element.type, 'titleFontSize', element.schemaToggles, element.style)) {
    const fcTitleFsMobile = generateLiquidVar(element.id, 'titleFontSize', 'mobile');
    const fcTitleFsDesktop = generateLiquidVar(element.id, 'titleFontSize', 'desktop');
    const fcTitleFsFull = generateLiquidVar(element.id, 'titleFontSize', 'fullscreen');
    css += `${selector} h4 { font-size: ${fcTitleFsDesktop}; }\n`;
    css += `@media (max-width: 575px) {\n  ${selector} h4 { font-size: ${fcTitleFsMobile}; }\n}\n`;
    css += `@media (min-width: 576px) and (max-width: 767px) {\n  ${selector} h4 { font-size: ${fcTitleFsMobile}; }\n}\n`;
    css += `@media (min-width: 1200px) {\n  ${selector} h4 { font-size: ${fcTitleFsFull}; }\n}\n\n`;
  }

  // Generate entrance animation CSS
  const entranceAnim = element.style?.entranceAnimation;
  const isEntranceSchemaEnabled = shouldEnableInSchema(element.type, 'entranceAnimation', element.schemaToggles, element.style);
  if (isEntranceSchemaEnabled || (entranceAnim && entranceAnim !== 'none')) {
    if (isEntranceSchemaEnabled) {
      const animSettingId = generateSettingId(element.id, 'entranceAnimation');
      const delayVar = generateLiquidVar(element.id, 'entranceDelay');
      const durVar = generateLiquidVar(element.id, 'entranceDuration');
      css += `{% unless section.settings.${animSettingId} == 'none' or section.settings.${animSettingId} == blank %}\n`;
      css += `${selector}[data-entrance] {\n  opacity: 0;\n  transition-duration: ${durVar};\n  transition-delay: ${delayVar};\n}\n`;
      css += `${selector}[data-entrance].animated {\n  opacity: 1;\n  transform: none;\n}\n`;
      css += `${selector}[data-entrance="flip"].animated {\n  transform: perspective(600px) rotateY(0deg);\n}\n`;
      css += `{% endunless %}\n\n`;
    } else {
      const delay = element.style?.entranceDelay;
      const dur = element.style?.entranceDuration;
      css += `${selector}[data-entrance] {\n  opacity: 0;\n  transition: opacity ${dur} ${delay}, transform ${dur} ${delay};\n}\n`;
      css += `${selector}[data-entrance].animated {\n  opacity: 1;\n  transform: none;\n}\n`;
      css += `${selector}[data-entrance="flip"].animated {\n  transform: perspective(600px) rotateY(0deg);\n}\n\n`;
    }
  }

  // Generate responsive CSS for schema-enabled responsive properties
  const responsiveCSS = generateResponsiveCSS(element, elementDef, selector);
  css += responsiveCSS;

  return css;
};

// templateCSSGenerators imported from templateCSS.js

/**
 * Generate responsive CSS with media queries
 * REVOLUTIONARY APPROACH: Output Liquid variables for ALL schema-enabled responsive properties
 * This ensures Shopify customizer works for mobile/fullscreen breakpoints too!
 */
const generateResponsiveCSS = (element, elementDef, selector) => {
  let css = '';

  // 5 viewports — lg is base/desktop (handled above), 4 get media queries
  // Schema: sm→mobile, lg→desktop (base), xl→fullscreen
  // xs and md are builder-only (hardcoded CSS, no Liquid vars)
  const viewportBreakpoints = [
    { viewport: 'xs', media: '@media (max-width: 575px)', schemaBreakpoint: null },
    { viewport: 'sm', media: '@media (min-width: 576px) and (max-width: 767px)', schemaBreakpoint: 'mobile' },
    { viewport: 'md', media: '@media (min-width: 768px) and (max-width: 991px)', schemaBreakpoint: null },
    { viewport: 'xl', media: '@media (min-width: 1200px)', schemaBreakpoint: 'fullscreen' },
  ];

  viewportBreakpoints.forEach(({ viewport, media, schemaBreakpoint }) => {
    const props = [];

    if (elementDef.styleProps) {
      elementDef.styleProps.forEach(propDef => {
        if (!propDef.responsive) return;

        const propName = propDef.name;

        // Popup routes these props to .popup-modal, not the wrapper
        if (element.type === 'popup' && ['width', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'fontSize'].includes(propName)) return;

        // Flip-card handles responsive width/height/fontSize in its own CSS block
        if (element.type === 'flip-card' && ['cardAspectRatio', 'fontSize'].includes(propName)) return;

        // Only use Liquid vars for viewports that map to a Shopify schema breakpoint
        const hasSchemaMapping = schemaBreakpoint !== null;
        const isSchemaEnabled = hasSchemaMapping && shouldEnableInSchema(element.type, propName, element.schemaToggles, element.style);

        // Get the value the user explicitly set for this viewport
        const viewportValue = element.responsiveStyles?.[propName]?.[viewport];

        // For builder-only breakpoints (xs, md): ONLY emit if user explicitly set a
        // value for this viewport. No fallback — avoids overriding base CSS with wrong defaults.
        if (!hasSchemaMapping && !viewportValue) return;

        // For Shopify breakpoints (sm→mobile, xl→fullscreen): fall back through
        // base style → propDef.default so schema Liquid vars always have a value
        const value = viewportValue
                     || element.style?.[propName]
                     || propDef.default
                     || '';

        if (isSchemaEnabled || value) {
          const generatedProps = getCSSPropsForProperty(propName, value, isSchemaEnabled, element.id, schemaBreakpoint);
          props.push(...generatedProps);
        }
      });
    }

    if (props.length > 0) {
      css += `${media} {\n`;
      css += `  ${selector} {\n`;
      props.forEach(prop => {
        css += `    ${prop}\n`;
      });
      css += `  }\n`;
      css += `}\n\n`;
    }
  });

  return css;
};

/**
 * Generate CSS for all elements recursively
 */
export const generateAllElementsCSS = (elements, sectionId) => {
  let css = '';

  const processElement = (element) => {
    // Generate CSS for this element
    css += generateElementCSS(element, sectionId);

    // Process children
    if (element.children && element.children.length > 0) {
      element.children.forEach(child => processElement(child));
    }

    // Process columns
    if (element.columns && element.columns.length > 0) {
      element.columns.forEach(column => {
        if (column && Array.isArray(column)) {
          column.forEach(child => processElement(child));
        }
      });
    }
  };

  elements.forEach(element => processElement(element));

  return css;
};

/**
 * Generate complete Liquid styles with base styles + element styles
 */
export const generateLiquidStyles = (elements, sectionId) => {
  // Reset template element index counters for each export
  resetTemplateCounters();

  let styles = `<style>\n`;

  // Add base styles for column layouts - ALL scoped to section ID
  const baseStyles = `
  #${sectionId}-{{ section.id }} {
    width: 100%;
  }

  /* Reset default browser margins for text elements - WYSIWYG accuracy */

  #${sectionId}-{{ section.id }} h1,
  #${sectionId}-{{ section.id }} h2,
  #${sectionId}-{{ section.id }} h3,
  #${sectionId}-{{ section.id }} h4,
  #${sectionId}-{{ section.id }} h5,
  #${sectionId}-{{ section.id }} h6 {
    display: block;
  }

  #${sectionId}-{{ section.id }} p {
    display: block;
  }

  #${sectionId}-{{ section.id }} img {
    display: block;
  }

  #${sectionId}-{{ section.id }} video {
    display: block;
  }

  #${sectionId}-{{ section.id }} .columns {
    display: flex;
    gap: 20px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  #${sectionId}-{{ section.id }} .column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  #${sectionId}-{{ section.id }} .block-container {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    flex: 1;
  }

  #${sectionId}-{{ section.id }} .background-image-container {
    display: flex;
    overflow: hidden;
    position: relative;
  }

  #${sectionId}-{{ section.id }} .background-overlay-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  #${sectionId}-{{ section.id }} .background-overlay-container > .bg-overlay-content {
    display: flex;
    flex-direction: column;
    align-items: inherit;
    justify-content: inherit;
    width: 100%;
    flex: 1;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }

  #${sectionId}-{{ section.id }} ol,
  #${sectionId}-{{ section.id }} ul {
    display: block;
  }

  #${sectionId}-{{ section.id }} .spacer {
    display: block;
  }

  #${sectionId}-{{ section.id }} a[data-element-id] {
    display: inline-block;
    cursor: pointer;
    text-decoration: none;
    border-width: 1px;
    border-style: solid;
  }

  #${sectionId}-{{ section.id }} .icon-element {
    display: inline-block;
  }

  #${sectionId}-{{ section.id }} .image-placeholder-wrapper {
    position: relative;
    width: 100%;
    min-height: 300px;
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  #${sectionId}-{{ section.id }} .image-placeholder-wrapper .placeholder-image {
    width: 100%;
    height: 100%;
    max-width: 150px;
    max-height: 150px;
    color: #ccc;
  }

  #${sectionId}-{{ section.id }} .image-placeholder-text {
    position: absolute;
    bottom: 20px;
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    font-size: 14px;
    color: #666;
    text-align: center;
  }

  #${sectionId}-{{ section.id }} .icon-placeholder-wrapper {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background-color: #f4f4f4;
    border-radius: 4px;
    min-width: 80px;
    min-height: 80px;
  }

  #${sectionId}-{{ section.id }} .icon-placeholder-wrapper .placeholder-icon {
    color: #ccc;
    stroke-width: 1.5;
  }

  #${sectionId}-{{ section.id }} .icon-placeholder-wrapper .icon-placeholder-text {
    margin-top: 8px;
    font-size: 11px;
    color: #999;
    text-align: center;
    white-space: nowrap;
  }

  #${sectionId}-{{ section.id }} .blockify-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  #${sectionId}-{{ section.id }} .blockify-form .form-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  #${sectionId}-{{ section.id }} .blockify-form .form-field label {
    font-size: 14px;
    font-weight: 500;
  }

  #${sectionId}-{{ section.id }} .blockify-form .form-field input,
  #${sectionId}-{{ section.id }} .blockify-form .form-field textarea {
    padding: 10px 14px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }

  #${sectionId}-{{ section.id }} .blockify-form .form-submit {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: inline-block;
    align-self: flex-start;
  }

  /* Entrance animation initial states */
  [data-entrance="fade-in"] { opacity: 0; }
  [data-entrance="slide-up"] { opacity: 0; transform: translateY(40px); }
  [data-entrance="slide-left"] { opacity: 0; transform: translateX(-40px); }
  [data-entrance="slide-right"] { opacity: 0; transform: translateX(40px); }
  [data-entrance="zoom-in"] { opacity: 0; transform: scale(0.8); }
  [data-entrance="flip"] { opacity: 0; transform: perspective(600px) rotateY(90deg); }
  [data-entrance].animated { opacity: 1; transform: none; }
  [data-entrance="flip"].animated { transform: perspective(600px) rotateY(0deg); }
`;

  styles += baseStyles;

  // Generate element-specific CSS
  const elementCSS = generateAllElementsCSS(elements, sectionId);

  if (elementCSS.trim()) {
    // Indent element CSS
    const indentedCSS = elementCSS.split('\n').map(line =>
      line ? `  ${line}` : ''
    ).join('\n');

    styles += indentedCSS;
  }

  styles += `</style>`;

  return styles;
};
