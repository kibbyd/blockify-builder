/**
 * HTML Generation - Schema Toggle System
 *
 * Generates Liquid HTML with data-element-id and schema-aware content
 */

import { elementDefinitions } from '@/app/_config/elementDefinitions';
import { generateSettingId } from '@/app/_utils/idGenerator';

/**
 * Check if a property should be enabled in schema (matches backend logic)
 * This ensures HTML, CSS, and Schema are all consistent!
 */
const alwaysEnabledProperties = {};

const shouldEnableInSchema = (elementType, propertyName, schemaToggles) => {
  if (schemaToggles?.[propertyName] === true) return true;
  const alwaysEnabled = alwaysEnabledProperties[elementType] || [];
  if (alwaysEnabled.includes(propertyName)) return true;
  return false;
};

/**
 * Generate Liquid variable reference for content
 */
const generateContentLiquidVar = (elementId, propertyName, breakpoint = null) => {
  const settingId = generateSettingId(elementId, propertyName, breakpoint);
  return `{{ section.settings.${settingId} }}`;
};

/**
 * Build data-entrance attribute string for entrance animations
 */
const buildEntranceAttr = (element) => {
  const isAnimSchemaEnabled = shouldEnableInSchema(element.type, 'entranceAnimation', element.schemaToggles, element.style);
  const animValue = element.style?.entranceAnimation;
  if (isAnimSchemaEnabled) {
    const animSettingId = generateSettingId(element.id, 'entranceAnimation');
    return ` data-entrance="{{ section.settings.${animSettingId} | default: '${animValue || 'none'}' }}"`;
  } else if (animValue && animValue !== 'none') {
    return ` data-entrance="${animValue}"`;
  }
  return '';
};

/**
 * Sanitize and escape HTML content
 */
const escapeHtml = (text) => {
  if (!text) return '';
  return text.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
};

/**
 * Generate HTML for a single element
 */
export const generateElementHTML = (element, indent = '  ') => {
  if (!element || !element.type) return '';

  const elementDef = elementDefinitions[element.type];
  if (!elementDef) return '';

  let html = '';

  // Helper closures for element prop access
  const getVal = (propName) => element.props?.[propName];
  const getSchemaOrDefault = (propName, defaultVal) => {
    const settingId = generateSettingId(element.id, propName);
    return `section.settings.${settingId}`;
  };

  switch (element.type) {
    case 'heading': {
      const tag = element.props?.tag || element.props?.level || 'h2';
      const textProp = elementDef.contentProps?.find(p => p.name === 'text');
      const isTextSchemaEnabled = shouldEnableInSchema(element.type, 'text', element.schemaToggles, element.style);
      const isTagSchemaEnabled = shouldEnableInSchema(element.type, 'tag', element.schemaToggles, element.style);

      const content = isTextSchemaEnabled
        ? generateContentLiquidVar(element.id, 'text')
        : (element.props?.text || textProp?.default || 'Heading');

      const entranceAttr = buildEntranceAttr(element);

      if (isTagSchemaEnabled) {
        const tagSettingId = generateSettingId(element.id, 'tag');
        html += `${indent}<{{ section.settings.${tagSettingId} | default: '${tag}' }} data-element-id="${element.id}"${entranceAttr}>${content}</{{ section.settings.${tagSettingId} | default: '${tag}' }}>\n`;
      } else {
        html += `${indent}<${tag} data-element-id="${element.id}"${entranceAttr}>${content}</${tag}>\n`;
      }
      break;
    }

    case 'text': {
      const textProp = elementDef.contentProps?.find(p => p.name === 'text');
      const isTextSchemaEnabled = shouldEnableInSchema(element.type, 'text', element.schemaToggles, element.style);

      let content = '';
      if (isTextSchemaEnabled) {
        content = generateContentLiquidVar(element.id, 'text');
      } else if (element.props?.text !== undefined) {
        content = element.props.text;
      } else if (!element.props || Object.keys(element.props).length === 0) {
        // Empty props - leave content empty
        content = '';
      } else {
        content = textProp?.default || 'Your text here';
      }

      const textEntranceAttr = buildEntranceAttr(element);
      if (content) {
        html += `${indent}<p data-element-id="${element.id}"${textEntranceAttr}>${content}</p>\n`;
      } else {
        html += `${indent}<p data-element-id="${element.id}"${textEntranceAttr}></p>\n`;
      }
      break;
    }

    case 'button': {
      const textProp = elementDef.contentProps?.find(p => p.name === 'text');
      const urlProp = elementDef.contentProps?.find(p => p.name === 'url');

      const isTextSchemaEnabled = shouldEnableInSchema(element.type, 'text', element.schemaToggles, element.style);
      const isUrlSchemaEnabled = shouldEnableInSchema(element.type, 'url', element.schemaToggles, element.style);

      const text = isTextSchemaEnabled
        ? generateContentLiquidVar(element.id, 'text')
        : (element.props?.text || textProp?.default || 'Button');

      const url = isUrlSchemaEnabled
        ? generateContentLiquidVar(element.id, 'url')
        : (element.props?.url || urlProp?.default || '#');

      const isOpenInNewTabEnabled = shouldEnableInSchema(element.type, 'openInNewTab', element.schemaToggles, element.style);
      let targetAttr = '';
      if (isOpenInNewTabEnabled) {
        const openInNewTabSettingId = generateSettingId(element.id, 'openInNewTab');
        targetAttr = `{% if section.settings.${openInNewTabSettingId} %} target="_blank" rel="noopener noreferrer"{% endif %}`;
      } else if (element.props?.openInNewTab) {
        targetAttr = ' target="_blank" rel="noopener noreferrer"';
      }

      const btnEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<a href="${url}" data-element-id="${element.id}"${btnEntranceAttr}${targetAttr}>${text}</a>\n`;
      break;
    }

    case 'image': {
      const srcProp = elementDef.contentProps?.find(p => p.name === 'src');

      // REVOLUTIONARY: Check alwaysEnabledProperties too, not just explicit toggles!
      const isSrcSchemaEnabled = shouldEnableInSchema(element.type, 'src', element.schemaToggles, element.style);
      const src = element.props?.src || '';
      const alt = element.props?.alt || '';
      const uploadedFileName = element.props?.uploadedFileName || '';
      const imgWidth = '100%';
      const imgHeight = 'auto';
      const imgEntranceAttr = buildEntranceAttr(element);

      // If schema is enabled, use Liquid variable
      const isAltSchemaEnabled = shouldEnableInSchema(element.type, 'alt', element.schemaToggles, element.style);
      const altValue = isAltSchemaEnabled ? `{{ section.settings.${generateSettingId(element.id, 'alt')} }}` : alt;

      if (isSrcSchemaEnabled) {
        const settingId = generateSettingId(element.id, 'src');

        // Use conditional Liquid to show image only when setting has a value
        // Otherwise show Shopify placeholder with wrapper and message
        html += `${indent}{% if section.settings.${settingId} != blank %}\n`;
        html += `${indent}  <img data-element-id="${element.id}"${imgEntranceAttr} src="{{ section.settings.${settingId} | image_url: width: 1920 }}" alt="${altValue}" width="${imgWidth}" height="${imgHeight}" loading="lazy" />\n`;
        html += `${indent}{% else %}\n`;
        html += `${indent}  <div class="image-placeholder-wrapper" data-element-id="${element.id}"${imgEntranceAttr}>\n`;
        html += `${indent}    {{ 'image' | placeholder_svg_tag: 'placeholder-image' }}\n`;
        html += `${indent}    <div class="image-placeholder-text">Add your image</div>\n`;
        html += `${indent}  </div>\n`;
        html += `${indent}{% endif %}`;
      }
      // If we have a base64 image with an uploaded file, keep data URL for asset extraction
      else if (src && src.startsWith('data:image') && uploadedFileName) {
        // Keep the data URL for downloadWithAssets to find and extract
        // It will be replaced with asset_url in the final package
        html += `<img data-element-id="${element.id}"${imgEntranceAttr} src="${src}" alt="${alt}" width="${imgWidth}" height="${imgHeight}" loading="lazy" />`;
      }
      // Regular URL
      else if (src) {
        html += `<img data-element-id="${element.id}"${imgEntranceAttr} src="${src}" alt="${alt}" width="${imgWidth}" height="${imgHeight}" loading="lazy" />`;
      }
      // No source and schema not enabled - render empty img tag
      else {
        html += `<img data-element-id="${element.id}"${imgEntranceAttr} src="" alt="${alt}" width="${imgWidth}" height="${imgHeight}" loading="lazy" />`;
      }
      break;
    }

    case 'video': {
      const srcProp = elementDef.contentProps?.find(p => p.name === 'src');
      const isSrcSchemaEnabled = shouldEnableInSchema(element.type, 'src', element.schemaToggles, element.style);
      const uploadedFileName = element.props?.uploadedFileName || '';

      let src = element.props?.src || '';

      // If schema is enabled, always use Liquid variable — strip base64 for video
      if (isSrcSchemaEnabled) {
        src = generateContentLiquidVar(element.id, 'src');
      }

      if (src) {
        // Fall back to element definition defaults when props are undefined
        const getPropDefault = (name) => elementDef.contentProps?.find(p => p.name === name)?.default;
        const autoplay = element.props?.autoplay ?? getPropDefault('autoplay');
        const muted = element.props?.muted ?? getPropDefault('muted');
        const loop = element.props?.loop ?? getPropDefault('loop');
        const controls = element.props?.controls ?? getPropDefault('controls');

        const vidEntranceAttr = buildEntranceAttr(element);
        html += `${indent}<video data-element-id="${element.id}"${vidEntranceAttr} src="${src}"`;
        if (autoplay) html += ' autoplay';
        if (muted) html += ' muted';
        if (loop) html += ' loop';
        if (controls) html += ' controls';
        if (element.props?.poster) html += ` poster="${element.props.poster}"`;
        html += `></video>\n`;
      }
      break;
    }

    case 'icon': {
      const srcProp = elementDef.contentProps?.find(p => p.name === 'src');
      // REVOLUTIONARY: Check alwaysEnabledProperties too, not just explicit toggles!
      const isSrcSchemaEnabled = shouldEnableInSchema(element.type, 'src', element.schemaToggles, element.style);
      const src = element.props?.src || '';
      const alt = element.props?.alt || 'Icon';
      const uploadedFileName = element.props?.uploadedFileName || '';

      // Default dimensions for icons (required by Shopify) - remove 'px' from size value
      const sizeValue = element.props?.size || '48';
      const width = sizeValue.replace('px', '');
      const height = sizeValue.replace('px', '');
      const iconEntranceAttr = buildEntranceAttr(element);

      // If schema is enabled, use Liquid variable
      if (isSrcSchemaEnabled) {
        const settingId = generateSettingId(element.id, 'src');

        // Use conditional Liquid to show icon only when setting has a value
        // Otherwise show placeholder
        html += `${indent}{% if section.settings.${settingId} != blank %}\n`;
        html += `${indent}  <img data-element-id="${element.id}"${iconEntranceAttr} class="icon-element" src="{{ section.settings.${settingId} | image_url: width: 200 }}" alt="${alt}" width="${width}" height="${height}" />\n`;
        html += `${indent}{% else %}\n`;
        html += `${indent}  <div class="icon-placeholder-wrapper" data-element-id="${element.id}"${iconEntranceAttr}>\n`;
        html += `${indent}    <svg class="placeholder-icon" width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>\n`;
        html += `${indent}    <div class="icon-placeholder-text">Add your icon</div>\n`;
        html += `${indent}  </div>\n`;
        html += `${indent}{% endif %}`;
      }
      // If we have a base64 or data URL with an uploaded file, keep it for asset extraction
      else if (src && (src.startsWith('data:image') || src.startsWith('http')) && uploadedFileName) {
        html += `${indent}<img data-element-id="${element.id}"${iconEntranceAttr} class="icon-element" src="${src}" alt="${alt}" width="${width}" height="${height}" />\n`;
      }
      // Regular URL or asset
      else if (src) {
        html += `${indent}<img data-element-id="${element.id}"${iconEntranceAttr} class="icon-element" src="${src}" alt="${alt}" width="${width}" height="${height}" />\n`;
      }
      // No source and schema not enabled - render empty placeholder
      else {
        html += `${indent}<div class="icon-placeholder-wrapper" data-element-id="${element.id}"${iconEntranceAttr}>\n`;
        html += `${indent}  <svg class="placeholder-icon" width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>\n`;
        html += `${indent}  <div class="icon-placeholder-text">Add your icon</div>\n`;
        html += `${indent}</div>\n`;
      }
      break;
    }

    case 'product-card': {
      const pcBtnText = shouldEnableInSchema(element.type, 'buttonText', element.schemaToggles, element.style)
        ? generateContentLiquidVar(element.id, 'buttonText')
        : (element.props?.buttonText || 'Add to Cart');
      const pcProductId = generateSettingId(element.id, 'product');
      const pcBtnHoverAnimEnabled = shouldEnableInSchema(element.type, 'buttonHoverAnimation', element.schemaToggles, element.style);
      const pcBtnHoverAnimAttr = pcBtnHoverAnimEnabled
        ? ` data-btn-hover-anim="{{ section.settings.${generateSettingId(element.id, 'buttonHoverAnimation')} }}"`
        : '';

      const isShowImageEnabled = shouldEnableInSchema(element.type, 'showImage', element.schemaToggles, element.style);
      const isShowTitleEnabled = shouldEnableInSchema(element.type, 'showTitle', element.schemaToggles, element.style);
      const isShowPriceEnabled = shouldEnableInSchema(element.type, 'showPrice', element.schemaToggles, element.style);
      const isShowButtonEnabled = shouldEnableInSchema(element.type, 'showButton', element.schemaToggles, element.style);

      const pcEntranceAttr = buildEntranceAttr(element);
      html += `${indent}{% assign pc_product = section.settings.${pcProductId} %}\n`;
      html += `${indent}{% if pc_product != blank %}\n`;
      html += `${indent}<div data-element-id="${element.id}"${pcEntranceAttr} class="product-card"${pcBtnHoverAnimAttr}>\n`;

      // showImage
      if (isShowImageEnabled) {
        html += `${indent}  {% if section.settings.${generateSettingId(element.id, 'showImage')} %}\n`;
      }
      if (isShowImageEnabled || element.props?.showImage !== false) {
        html += `${indent}    {% if pc_product.featured_image %}\n`;
        html += `${indent}      <img src="{{ pc_product.featured_image | image_url: width: 600 }}" alt="{{ pc_product.title | escape }}" width="{{ pc_product.featured_image.width }}" height="{{ pc_product.featured_image.height }}" loading="lazy" class="product-card__image" />\n`;
        html += `${indent}    {% else %}\n`;
        html += `${indent}      {{ 'product-1' | placeholder_svg_tag: 'product-card__placeholder' }}\n`;
        html += `${indent}    {% endif %}\n`;
        if (isShowImageEnabled) html += `${indent}  {% endif %}\n`;
      }

      html += `${indent}  <div class="product-card__info">\n`;

      // showTitle
      if (isShowTitleEnabled) {
        html += `${indent}    {% if section.settings.${generateSettingId(element.id, 'showTitle')} %}\n`;
        html += `${indent}      <h3 class="product-card__title">{{ pc_product.title }}</h3>\n`;
        html += `${indent}    {% endif %}\n`;
      } else if (element.props?.showTitle !== false) {
        html += `${indent}    <h3 class="product-card__title">{{ pc_product.title }}</h3>\n`;
      }

      // showPrice
      if (isShowPriceEnabled) {
        html += `${indent}    {% if section.settings.${generateSettingId(element.id, 'showPrice')} %}\n`;
        html += `${indent}      <p class="product-card__price">{{ pc_product.price | money }}</p>\n`;
        html += `${indent}    {% endif %}\n`;
      } else if (element.props?.showPrice !== false) {
        html += `${indent}    <p class="product-card__price">{{ pc_product.price | money }}</p>\n`;
      }

      // showButton
      if (isShowButtonEnabled) {
        html += `${indent}    {% if section.settings.${generateSettingId(element.id, 'showButton')} %}\n`;
        html += `${indent}      <a href="{{ pc_product.url }}" class="product-card__button">${pcBtnText}</a>\n`;
        html += `${indent}    {% endif %}\n`;
      } else if (element.props?.showButton !== false) {
        html += `${indent}    <a href="{{ pc_product.url }}" class="product-card__button">${pcBtnText}</a>\n`;
      }

      html += `${indent}  </div>\n`;
      html += `${indent}</div>\n`;
      html += `${indent}{% endif %}\n`;
      break;
    }

    case 'product-grid': {
      const pgBtnText = shouldEnableInSchema(element.type, 'buttonText', element.schemaToggles, element.style)
        ? generateContentLiquidVar(element.id, 'buttonText')
        : (element.props?.buttonText || 'Add to Cart');
      const pgCols = element.props?.columns || '3';
      const pgRowsId = generateSettingId(element.id, 'rows');
      const isPgColsEnabled = shouldEnableInSchema(element.type, 'columns', element.schemaToggles, element.style);
      const isPgRowsEnabled = shouldEnableInSchema(element.type, 'rows', element.schemaToggles, element.style);
      const isPgShowPriceEnabled = shouldEnableInSchema(element.type, 'showPrice', element.schemaToggles, element.style);
      const isPgShowButtonEnabled = shouldEnableInSchema(element.type, 'showButton', element.schemaToggles, element.style);

      if (isPgColsEnabled) {
        html += `${indent}{% assign pg_cols = section.settings.${generateSettingId(element.id, 'columns')} | default: ${pgCols} %}\n`;
      } else {
        html += `${indent}{% assign pg_cols = ${pgCols} %}\n`;
      }
      if (isPgRowsEnabled) {
        html += `${indent}{% assign pg_rows = section.settings.${pgRowsId} | default: 2 %}\n`;
      } else {
        html += `${indent}{% assign pg_rows = ${element.props?.rows || 2} %}\n`;
      }
      html += `${indent}{% assign pg_limit = pg_cols | times: pg_rows %}\n`;
      const pgEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${pgEntranceAttr} class="product-grid product-grid--cols-{{ pg_cols }}">\n`;
      html += `${indent}  {% for product in collections[section.settings.collection].products limit: pg_limit %}\n`;
      html += `${indent}    <div class="product-grid__item">\n`;
      html += `${indent}      {% if product.featured_image %}\n`;
      html += `${indent}        <a href="{{ product.url }}">\n`;
      html += `${indent}          <img src="{{ product.featured_image | image_url: width: 480 }}" alt="{{ product.title | escape }}" width="{{ product.featured_image.width }}" height="{{ product.featured_image.height }}" loading="lazy" class="product-grid__image" />\n`;
      html += `${indent}        </a>\n`;
      html += `${indent}      {% else %}\n`;
      html += `${indent}        {{ 'product-1' | placeholder_svg_tag: 'product-grid__placeholder' }}\n`;
      html += `${indent}      {% endif %}\n`;
      html += `${indent}      <div class="product-grid__info">\n`;
      html += `${indent}        <h4 class="product-grid__title"><a href="{{ product.url }}">{{ product.title }}</a></h4>\n`;

      // showPrice
      if (isPgShowPriceEnabled) {
        html += `${indent}        {% if section.settings.${generateSettingId(element.id, 'showPrice')} %}\n`;
        html += `${indent}          <p class="product-grid__price">{{ product.price | money }}</p>\n`;
        html += `${indent}        {% endif %}\n`;
      } else if (element.props?.showPrice !== false) {
        html += `${indent}        <p class="product-grid__price">{{ product.price | money }}</p>\n`;
      }

      // showButton
      if (isPgShowButtonEnabled) {
        html += `${indent}        {% if section.settings.${generateSettingId(element.id, 'showButton')} %}\n`;
        html += `${indent}          <a href="{{ product.url }}" class="product-grid__button">${pgBtnText}</a>\n`;
        html += `${indent}        {% endif %}\n`;
      } else if (element.props?.showButton !== false) {
        html += `${indent}        <a href="{{ product.url }}" class="product-grid__button">${pgBtnText}</a>\n`;
      }

      html += `${indent}      </div>\n`;
      html += `${indent}    </div>\n`;
      html += `${indent}  {% endfor %}\n`;
      html += `${indent}</div>\n`;
      break;
    }

    case 'collection-list': {
      const clCols = element.props?.columns || '3';
      const isClColsEnabled = shouldEnableInSchema(element.type, 'columns', element.schemaToggles, element.style);
      const isClShowImageEnabled = shouldEnableInSchema(element.type, 'showImage', element.schemaToggles, element.style);
      const isClShowTitleEnabled = shouldEnableInSchema(element.type, 'showTitle', element.schemaToggles, element.style);
      const isClShowCountEnabled = shouldEnableInSchema(element.type, 'showCount', element.schemaToggles, element.style);

      const clColsVal = isClColsEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'columns')} | default: '${clCols}' }}`
        : clCols;

      const clEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${clEntranceAttr} class="collection-list collection-list--cols-${clColsVal}">\n`;
      // Use up to 6 collection pickers
      for (let i = 1; i <= 6; i++) {
        html += `${indent}  {% assign cl_${i} = section.settings.${generateSettingId(element.id, `collection_${i}`)} %}\n`;
        html += `${indent}  {% if cl_${i} != blank %}\n`;
        html += `${indent}    {% assign collection = collections[cl_${i}] %}\n`;
        html += `${indent}    <div class="collection-list__item">\n`;

        // showImage
        if (isClShowImageEnabled) {
          html += `${indent}      {% if section.settings.${generateSettingId(element.id, 'showImage')} %}\n`;
        }
        if (isClShowImageEnabled || element.props?.showImage !== false) {
          html += `${indent}        {% if collection.image %}\n`;
          html += `${indent}          <a href="{{ collection.url }}">\n`;
          html += `${indent}            <img src="{{ collection.image | image_url: width: 600 }}" alt="{{ collection.title | escape }}" width="{{ collection.image.width }}" height="{{ collection.image.height }}" loading="lazy" class="collection-list__image" />\n`;
          html += `${indent}          </a>\n`;
          html += `${indent}        {% else %}\n`;
          html += `${indent}          {{ 'collection-1' | placeholder_svg_tag: 'collection-list__placeholder' }}\n`;
          html += `${indent}        {% endif %}\n`;
          if (isClShowImageEnabled) html += `${indent}      {% endif %}\n`;
        }

        // showTitle
        if (isClShowTitleEnabled) {
          html += `${indent}      {% if section.settings.${generateSettingId(element.id, 'showTitle')} %}\n`;
          html += `${indent}        <h4 class="collection-list__title"><a href="{{ collection.url }}">{{ collection.title }}</a></h4>\n`;
          html += `${indent}      {% endif %}\n`;
        } else if (element.props?.showTitle !== false) {
          html += `${indent}      <h4 class="collection-list__title"><a href="{{ collection.url }}">{{ collection.title }}</a></h4>\n`;
        }

        // showCount
        if (isClShowCountEnabled) {
          html += `${indent}      {% if section.settings.${generateSettingId(element.id, 'showCount')} %}\n`;
          html += `${indent}        <p class="collection-list__count">{{ collection.products_count }} products</p>\n`;
          html += `${indent}      {% endif %}\n`;
        } else if (element.props?.showCount !== false) {
          html += `${indent}      <p class="collection-list__count">{{ collection.products_count }} products</p>\n`;
        }

        html += `${indent}    </div>\n`;
        html += `${indent}  {% endif %}\n`;
      }
      html += `${indent}</div>\n`;
      break;
    }

    case 'spacer': {
      html += `${indent}<div data-element-id="${element.id}" class="spacer"></div>\n`;
      break;
    }

    case 'divider': {
      html += `${indent}<hr data-element-id="${element.id}" />\n`;
      break;
    }

    case 'accordion': {
      const maxAccItems = 15;
      const isItemCountEnabled = shouldEnableInSchema(element.type, 'itemCount', element.schemaToggles, element.style);
      const defaultItemCount = element.props?.itemCount || 5;
      const accEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${accEntranceAttr} class="accordion">\n`;
      for (let i = 1; i <= maxAccItems; i++) {
        if (isItemCountEnabled) {
          const itemCountId = generateSettingId(element.id, 'itemCount');
          html += `${indent}  {% if section.settings.${itemCountId} >= ${i} %}\n`;
        } else if (i > defaultItemCount) {
          break; // Don't render items beyond the default count
        }
        const isPanelTitleEnabled = shouldEnableInSchema(element.type, `panelTitle_${i}`, element.schemaToggles, element.style);
        const isPanelContentEnabled = shouldEnableInSchema(element.type, `panelContent_${i}`, element.schemaToggles, element.style);
        const title = isPanelTitleEnabled
          ? generateContentLiquidVar(element.id, `panelTitle_${i}`)
          : (element.props?.[`panelTitle_${i}`] || `Question ${i}`);
        const content = isPanelContentEnabled
          ? generateContentLiquidVar(element.id, `panelContent_${i}`)
          : (element.props?.[`panelContent_${i}`] || `Answer ${i}`);
        html += `${indent}    <details class="accordion__item">\n`;
        html += `${indent}      <summary class="accordion__title"><span>${title}</span><svg class="accordion__chevron-down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg><svg class="accordion__chevron-up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg></summary>\n`;
        html += `${indent}      <div class="accordion__content">${content}</div>\n`;
        html += `${indent}    </details>\n`;
        if (isItemCountEnabled) html += `${indent}  {% endif %}\n`;
      }
      html += `${indent}</div>\n`;
      break;
    }

    case 'tabs': {
      const maxTabs = 10;
      const isTabCountEnabled = shouldEnableInSchema(element.type, 'tabCount', element.schemaToggles, element.style);
      const defaultTabCount = element.props?.tabCount || 3;

      const tabsEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${tabsEntranceAttr} class="tabs-container">\n`;
      html += `${indent}  <div class="tabs__nav">\n`;
      for (let i = 1; i <= maxTabs; i++) {
        if (isTabCountEnabled) {
          const tabCountId = generateSettingId(element.id, 'tabCount');
          html += `${indent}    {% if section.settings.${tabCountId} >= ${i} %}\n`;
        } else if (i > defaultTabCount) {
          break;
        }
        const isLabelEnabled = shouldEnableInSchema(element.type, `tabLabel_${i}`, element.schemaToggles, element.style);
        const label = isLabelEnabled
          ? generateContentLiquidVar(element.id, `tabLabel_${i}`)
          : (element.props?.[`tabLabel_${i}`] || `Tab ${i}`);
        html += `${indent}      <button class="tabs__button${i === 1 ? ' active' : ''}" data-tab="${i}">${label}</button>\n`;
        if (isTabCountEnabled) html += `${indent}    {% endif %}\n`;
      }
      html += `${indent}  </div>\n`;
      for (let i = 1; i <= (isTabCountEnabled ? maxTabs : defaultTabCount); i++) {
        if (isTabCountEnabled) {
          const tabCountId = generateSettingId(element.id, 'tabCount');
          html += `${indent}  {% if section.settings.${tabCountId} >= ${i} %}\n`;
        }
        const isContentEnabled = shouldEnableInSchema(element.type, `tabContent_${i}`, element.schemaToggles, element.style);
        const content = isContentEnabled
          ? generateContentLiquidVar(element.id, `tabContent_${i}`)
          : (element.props?.[`tabContent_${i}`] || `Content for tab ${i}`);
        html += `${indent}    <div class="tabs__panel${i === 1 ? ' active' : ''}" data-tab-panel="${i}">${content}</div>\n`;
        if (isTabCountEnabled) html += `${indent}  {% endif %}\n`;
      }
      html += `${indent}</div>\n`;
      break;
    }

    case 'countdown': {
      const targetDate = element.props?.targetDate || '';
      const expiredMsg = element.props?.expiredMessage || 'Offer has ended!';
      const isTargetSchemaEnabled = shouldEnableInSchema(element.type, 'targetDate', element.schemaToggles, element.style);
      const isExpiredSchemaEnabled = shouldEnableInSchema(element.type, 'expiredMessage', element.schemaToggles, element.style);
      const targetVal = isTargetSchemaEnabled ? generateContentLiquidVar(element.id, 'targetDate') : targetDate;
      const expiredVal = isExpiredSchemaEnabled ? generateContentLiquidVar(element.id, 'expiredMessage') : expiredMsg;

      const isShowDaysEnabled = shouldEnableInSchema(element.type, 'showDays', element.schemaToggles, element.style);
      const isShowHoursEnabled = shouldEnableInSchema(element.type, 'showHours', element.schemaToggles, element.style);
      const isShowMinutesEnabled = shouldEnableInSchema(element.type, 'showMinutes', element.schemaToggles, element.style);
      const isShowSecondsEnabled = shouldEnableInSchema(element.type, 'showSeconds', element.schemaToggles, element.style);

      const cdEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${cdEntranceAttr} class="countdown" data-countdown-target="${targetVal}" data-countdown-expired="${expiredVal}">\n`;

      const showDaysDefault = element.props?.showDays !== false;
      if (isShowDaysEnabled) {
        html += `${indent}  {% if section.settings.${generateSettingId(element.id, 'showDays')} %}\n`;
      }
      if (isShowDaysEnabled || showDaysDefault) {
        html += `${indent}    <div class="countdown__unit"><span class="countdown__digit" data-countdown-days>00</span><span class="countdown__label">Days</span></div>\n`;
        html += `${indent}    <span class="countdown__separator">:</span>\n`;
        if (isShowDaysEnabled) html += `${indent}  {% endif %}\n`;
      }

      const showHoursDefault = element.props?.showHours !== false;
      if (isShowHoursEnabled) {
        html += `${indent}  {% if section.settings.${generateSettingId(element.id, 'showHours')} %}\n`;
      }
      if (isShowHoursEnabled || showHoursDefault) {
        html += `${indent}    <div class="countdown__unit"><span class="countdown__digit" data-countdown-hours>00</span><span class="countdown__label">Hours</span></div>\n`;
        html += `${indent}    <span class="countdown__separator">:</span>\n`;
        if (isShowHoursEnabled) html += `${indent}  {% endif %}\n`;
      }

      const showMinutesDefault = element.props?.showMinutes !== false;
      if (isShowMinutesEnabled) {
        html += `${indent}  {% if section.settings.${generateSettingId(element.id, 'showMinutes')} %}\n`;
      }
      if (isShowMinutesEnabled || showMinutesDefault) {
        html += `${indent}    <div class="countdown__unit"><span class="countdown__digit" data-countdown-minutes>00</span><span class="countdown__label">Min</span></div>\n`;
        html += `${indent}    <span class="countdown__separator">:</span>\n`;
        if (isShowMinutesEnabled) html += `${indent}  {% endif %}\n`;
      }

      const showSecondsDefault = element.props?.showSeconds !== false;
      if (isShowSecondsEnabled) {
        html += `${indent}  {% if section.settings.${generateSettingId(element.id, 'showSeconds')} %}\n`;
      }
      if (isShowSecondsEnabled || showSecondsDefault) {
        html += `${indent}    <div class="countdown__unit"><span class="countdown__digit" data-countdown-seconds>00</span><span class="countdown__label">Sec</span></div>\n`;
        if (isShowSecondsEnabled) html += `${indent}  {% endif %}\n`;
      }

      html += `${indent}</div>\n`;
      break;
    }

    case 'slideshow': {
      const defaultSlideCount = element.props?.slideCount || 3;
      const maxSlides = 6;
      const isSlideCountEnabled = shouldEnableInSchema(element.type, 'slideCount', element.schemaToggles, element.style);
      const isAutoplayEnabled = shouldEnableInSchema(element.type, 'autoplay', element.schemaToggles, element.style);
      const isAutoplayIntervalEnabled = shouldEnableInSchema(element.type, 'autoplayInterval', element.schemaToggles, element.style);
      const isShowArrowsEnabled = shouldEnableInSchema(element.type, 'showArrows', element.schemaToggles, element.style);
      const isShowDotsEnabled = shouldEnableInSchema(element.type, 'showDots', element.schemaToggles, element.style);

      const autoplayAttr = isAutoplayEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'autoplay')} }}`
        : (element.props?.autoplay ? 'true' : 'false');
      const autoplayIntervalAttr = isAutoplayIntervalEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'autoplayInterval')} | default: 5000 }}`
        : (element.props?.autoplayInterval || '5000');

      const ssEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${ssEntranceAttr} class="slideshow" data-autoplay="${autoplayAttr}" data-autoplay-interval="${autoplayIntervalAttr}">\n`;
      html += `${indent}  <div class="slideshow__track">\n`;

      const slideLimit = isSlideCountEnabled ? maxSlides : defaultSlideCount;
      for (let i = 1; i <= slideLimit; i++) {
        if (isSlideCountEnabled) {
          const slideCountId = generateSettingId(element.id, 'slideCount');
          html += `${indent}    {% if section.settings.${slideCountId} >= ${i} %}\n`;
        }

        const isImgEnabled = shouldEnableInSchema(element.type, `slideImage_${i}`, element.schemaToggles, element.style);
        const isHeadingEnabled = shouldEnableInSchema(element.type, `slideHeading_${i}`, element.schemaToggles, element.style);
        const isTextEnabled = shouldEnableInSchema(element.type, `slideText_${i}`, element.schemaToggles, element.style);

        const headingVar = isHeadingEnabled
          ? generateContentLiquidVar(element.id, `slideHeading_${i}`)
          : (element.props?.[`slideHeading_${i}`] || `Slide ${i} Heading`);
        const textVar = isTextEnabled
          ? generateContentLiquidVar(element.id, `slideText_${i}`)
          : (element.props?.[`slideText_${i}`] || `Slide ${i} text`);

        html += `${indent}      <div class="slideshow__slide${i === 1 ? ' active' : ''}" data-slide="${i}">\n`;
        if (isImgEnabled) {
          const imgSettingId = generateSettingId(element.id, `slideImage_${i}`);
          html += `${indent}        {% if section.settings.${imgSettingId} != blank %}\n`;
          html += `${indent}          <img src="{{ section.settings.${imgSettingId} | image_url: width: 1920 }}" alt="${headingVar}" width="{{ section.settings.${imgSettingId}.width }}" height="{{ section.settings.${imgSettingId}.height }}" loading="lazy" class="slideshow__image" />\n`;
          html += `${indent}        {% endif %}\n`;
        }
        html += `${indent}        <div class="slideshow__content">\n`;
        html += `${indent}          <h2 class="slideshow__heading">${headingVar}</h2>\n`;
        html += `${indent}          <p class="slideshow__text">${textVar}</p>\n`;
        html += `${indent}        </div>\n`;
        html += `${indent}      </div>\n`;
        if (isSlideCountEnabled) html += `${indent}    {% endif %}\n`;
      }
      html += `${indent}  </div>\n`;

      // showArrows
      if (isShowArrowsEnabled) {
        const showArrowsId = generateSettingId(element.id, 'showArrows');
        html += `${indent}  {% if section.settings.${showArrowsId} %}\n`;
        html += `${indent}    <button class="slideshow__arrow slideshow__arrow--prev" data-slide-prev>&#10094;</button>\n`;
        html += `${indent}    <button class="slideshow__arrow slideshow__arrow--next" data-slide-next>&#10095;</button>\n`;
        html += `${indent}  {% endif %}\n`;
      } else if (element.props?.showArrows !== false) {
        html += `${indent}  <button class="slideshow__arrow slideshow__arrow--prev" data-slide-prev>&#10094;</button>\n`;
        html += `${indent}  <button class="slideshow__arrow slideshow__arrow--next" data-slide-next>&#10095;</button>\n`;
      }

      // showDots
      if (isShowDotsEnabled) {
        const showDotsId = generateSettingId(element.id, 'showDots');
        html += `${indent}  {% if section.settings.${showDotsId} %}\n`;
        html += `${indent}    <div class="slideshow__dots">\n`;
        for (let i = 1; i <= (isSlideCountEnabled ? maxSlides : defaultSlideCount); i++) {
          if (isSlideCountEnabled) {
            const slideCountId = generateSettingId(element.id, 'slideCount');
            html += `${indent}      {% if section.settings.${slideCountId} >= ${i} %}\n`;
          }
          html += `${indent}        <button class="slideshow__dot${i === 1 ? ' active' : ''}" data-slide-dot="${i}"></button>\n`;
          if (isSlideCountEnabled) html += `${indent}      {% endif %}\n`;
        }
        html += `${indent}    </div>\n`;
        html += `${indent}  {% endif %}\n`;
      } else if (element.props?.showDots !== false) {
        html += `${indent}  <div class="slideshow__dots">\n`;
        for (let i = 1; i <= defaultSlideCount; i++) {
          html += `${indent}    <button class="slideshow__dot${i === 1 ? ' active' : ''}" data-slide-dot="${i}"></button>\n`;
        }
        html += `${indent}  </div>\n`;
      }

      html += `${indent}</div>\n`;
      break;
    }

    case 'form': {
      const isFormActionEnabled = shouldEnableInSchema(element.type, 'formAction', element.schemaToggles, element.style);
      const formActionVar = isFormActionEnabled
        ? generateContentLiquidVar(element.id, 'formAction')
        : (element.props?.formAction || '');
      const isNamePlaceholderEnabled = shouldEnableInSchema(element.type, 'namePlaceholder', element.schemaToggles, element.style);
      const namePlaceholderVar = isNamePlaceholderEnabled
        ? generateContentLiquidVar(element.id, 'namePlaceholder')
        : (element.props?.namePlaceholder || 'Your name');
      const isEmailPlaceholderEnabled = shouldEnableInSchema(element.type, 'emailPlaceholder', element.schemaToggles, element.style);
      const emailPlaceholderVar = isEmailPlaceholderEnabled
        ? generateContentLiquidVar(element.id, 'emailPlaceholder')
        : (element.props?.emailPlaceholder || 'Your email');
      const isPhonePlaceholderEnabled = shouldEnableInSchema(element.type, 'phonePlaceholder', element.schemaToggles, element.style);
      const phonePlaceholderVar = isPhonePlaceholderEnabled
        ? generateContentLiquidVar(element.id, 'phonePlaceholder')
        : (element.props?.phonePlaceholder || 'Your phone');
      const isMessagePlaceholderEnabled = shouldEnableInSchema(element.type, 'messagePlaceholder', element.schemaToggles, element.style);
      const messagePlaceholderVar = isMessagePlaceholderEnabled
        ? generateContentLiquidVar(element.id, 'messagePlaceholder')
        : (element.props?.messagePlaceholder || 'Your message');
      const isSubmitTextEnabled = shouldEnableInSchema(element.type, 'submitText', element.schemaToggles, element.style);
      const submitTextVar = isSubmitTextEnabled
        ? generateContentLiquidVar(element.id, 'submitText')
        : (element.props?.submitText || 'Submit');

      const formEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<form data-element-id="${element.id}"${formEntranceAttr} class="blockify-form" method="post" action="${formActionVar}">\n`;

      const isShowNameEnabled = shouldEnableInSchema(element.type, 'showName', element.schemaToggles, element.style);
      const showNameDefault = element.props?.showName !== false;
      if (isShowNameEnabled) {
        html += `${indent}  {% if ${getSchemaOrDefault('showName', showNameDefault ? 'true' : 'false')} == true %}\n`;
      }
      if (!isShowNameEnabled && !showNameDefault) {
        // showName is false and not toggled — skip field entirely
      } else {
        if (!isShowNameEnabled && showNameDefault) html += `${indent}  <!-- Name field -->\n`;
        html += `${indent}    <div class="form-field">\n`;
        html += `${indent}      <label>Name</label>\n`;
        html += `${indent}      <input type="text" name="contact[name]" placeholder="${namePlaceholderVar}" />\n`;
        html += `${indent}    </div>\n`;
        if (isShowNameEnabled) html += `${indent}  {% endif %}\n`;
      }

      const isShowEmailEnabled = shouldEnableInSchema(element.type, 'showEmail', element.schemaToggles, element.style);
      const showEmailDefault = element.props?.showEmail !== false;
      if (isShowEmailEnabled) {
        html += `${indent}  {% if ${getSchemaOrDefault('showEmail', showEmailDefault ? 'true' : 'false')} == true %}\n`;
      }
      if (!isShowEmailEnabled && !showEmailDefault) {
        // skip
      } else {
        html += `${indent}    <div class="form-field">\n`;
        html += `${indent}      <label>Email</label>\n`;
        html += `${indent}      <input type="email" name="contact[email]" placeholder="${emailPlaceholderVar}" required />\n`;
        html += `${indent}    </div>\n`;
        if (isShowEmailEnabled) html += `${indent}  {% endif %}\n`;
      }

      const isShowPhoneEnabled = shouldEnableInSchema(element.type, 'showPhone', element.schemaToggles, element.style);
      const showPhoneDefault = element.props?.showPhone === true;
      if (isShowPhoneEnabled) {
        html += `${indent}  {% if ${getSchemaOrDefault('showPhone', showPhoneDefault ? 'true' : 'false')} == true %}\n`;
      }
      if (!isShowPhoneEnabled && !showPhoneDefault) {
        // skip
      } else {
        html += `${indent}    <div class="form-field">\n`;
        html += `${indent}      <label>Phone</label>\n`;
        html += `${indent}      <input type="tel" name="contact[phone]" placeholder="${phonePlaceholderVar}" />\n`;
        html += `${indent}    </div>\n`;
        if (isShowPhoneEnabled) html += `${indent}  {% endif %}\n`;
      }

      const isShowMessageEnabled = shouldEnableInSchema(element.type, 'showMessage', element.schemaToggles, element.style);
      const showMessageDefault = element.props?.showMessage !== false;
      if (isShowMessageEnabled) {
        html += `${indent}  {% if ${getSchemaOrDefault('showMessage', showMessageDefault ? 'true' : 'false')} == true %}\n`;
      }
      if (!isShowMessageEnabled && !showMessageDefault) {
        // skip
      } else {
        html += `${indent}    <div class="form-field">\n`;
        html += `${indent}      <label>Message</label>\n`;
        html += `${indent}      <textarea name="contact[body]" rows="4" placeholder="${messagePlaceholderVar}"></textarea>\n`;
        html += `${indent}    </div>\n`;
        if (isShowMessageEnabled) html += `${indent}  {% endif %}\n`;
      }
      html += `${indent}  <button type="submit" class="form-submit">${submitTextVar}</button>\n`;
      html += `${indent}</form>\n`;
      break;
    }

    case 'popup': {
      const popupId = element.id.replace(/[^a-zA-Z0-9]/g, '_');
      const isTriggerTextEnabled = shouldEnableInSchema(element.type, 'triggerText', element.schemaToggles, element.style);
      const isPopupTitleEnabled = shouldEnableInSchema(element.type, 'popupTitle', element.schemaToggles, element.style);
      const isPopupContentEnabled = shouldEnableInSchema(element.type, 'popupContent', element.schemaToggles, element.style);
      const isEmailPlaceholderEnabled = shouldEnableInSchema(element.type, 'emailPlaceholder', element.schemaToggles, element.style);
      const isSubmitTextEnabled = shouldEnableInSchema(element.type, 'submitText', element.schemaToggles, element.style);
      const isShowEmailFieldEnabled = shouldEnableInSchema(element.type, 'showEmailField', element.schemaToggles, element.style);
      const triggerTextVal = isTriggerTextEnabled
        ? generateContentLiquidVar(element.id, 'triggerText')
        : (element.props?.triggerText || 'Open');
      const popupTitleVal = isPopupTitleEnabled
        ? generateContentLiquidVar(element.id, 'popupTitle')
        : (element.props?.popupTitle || 'Popup Title');
      const popupContentVal = isPopupContentEnabled
        ? generateContentLiquidVar(element.id, 'popupContent')
        : (element.props?.popupContent || 'Popup content goes here.');
      const popupEmailPlaceholderVal = isEmailPlaceholderEnabled
        ? generateContentLiquidVar(element.id, 'emailPlaceholder')
        : (element.props?.emailPlaceholder || 'Enter your email');
      const popupSubmitTextVal = isSubmitTextEnabled
        ? generateContentLiquidVar(element.id, 'submitText')
        : (element.props?.submitText || 'Subscribe');

      const popEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${popEntranceAttr} class="blockify-popup-wrapper">\n`;
      html += `${indent}  <button type="button" class="popup-trigger">${triggerTextVal}</button>\n`;
      html += `${indent}  <div id="popup-${popupId}" class="popup-overlay" style="display:none">\n`;
      html += `${indent}    <div class="popup-modal">\n`;
      html += `${indent}      <button type="button" class="popup-close">&times;</button>\n`;

      html += `${indent}      <h3 class="popup-title">${popupTitleVal}</h3>\n`;

      html += `${indent}      <p class="popup-content">${popupContentVal}</p>\n`;

      // showEmailField
      if (isShowEmailFieldEnabled) {
        const showEmailFieldId = generateSettingId(element.id, 'showEmailField');
        html += `${indent}      {% if section.settings.${showEmailFieldId} %}\n`;
        html += `${indent}        <form method="post" action="/contact" class="popup-email-form">\n`;
        html += `${indent}          <input type="hidden" name="form_type" value="customer" />\n`;
        html += `${indent}          <input type="hidden" name="utf8" value="✓" />\n`;
        html += `${indent}          <input type="hidden" name="contact[tags]" value="newsletter" />\n`;
        html += `${indent}          <div class="popup-email-row">\n`;
        html += `${indent}            <input type="email" name="contact[email]" class="popup-email-input" placeholder="${popupEmailPlaceholderVal}" required />\n`;
        html += `${indent}            <button type="submit" class="popup-submit">${popupSubmitTextVal}</button>\n`;
        html += `${indent}          </div>\n`;
        html += `${indent}        </form>\n`;
        html += `${indent}        <div class="popup-success" style="display:none">\n`;
        html += `${indent}          <p>Thanks for subscribing!</p>\n`;
        html += `${indent}        </div>\n`;
        html += `${indent}      {% endif %}\n`;
      } else if (element.props?.showEmailField !== false) {
        html += `${indent}      <form method="post" action="/contact" class="popup-email-form">\n`;
        html += `${indent}        <input type="hidden" name="form_type" value="customer" />\n`;
        html += `${indent}        <input type="hidden" name="utf8" value="✓" />\n`;
        html += `${indent}        <input type="hidden" name="contact[tags]" value="newsletter" />\n`;
        html += `${indent}        <div class="popup-email-row">\n`;
        html += `${indent}          <input type="email" name="contact[email]" class="popup-email-input" placeholder="${popupEmailPlaceholderVal}" required />\n`;
        html += `${indent}          <button type="submit" class="popup-submit">${popupSubmitTextVal}</button>\n`;
        html += `${indent}        </div>\n`;
        html += `${indent}      </form>\n`;
        html += `${indent}      <div class="popup-success" style="display:none">\n`;
        html += `${indent}        <p>Thanks for subscribing!</p>\n`;
        html += `${indent}      </div>\n`;
      }

      html += `${indent}    </div>\n`;
      html += `${indent}  </div>\n`;
      html += `${indent}</div>\n`;
      break;
    }

    case 'flip-card': {
      const isFlipDirEnabled = shouldEnableInSchema(element.type, 'flipDirection', element.schemaToggles, element.style);
      const isFrontTitleEnabled = shouldEnableInSchema(element.type, 'frontTitle', element.schemaToggles, element.style);
      const isFrontContentEnabled = shouldEnableInSchema(element.type, 'frontContent', element.schemaToggles, element.style);
      const isFrontImageEnabled = shouldEnableInSchema(element.type, 'frontImage', element.schemaToggles, element.style);
      const isBackTitleEnabled = shouldEnableInSchema(element.type, 'backTitle', element.schemaToggles, element.style);
      const isBackContentEnabled = shouldEnableInSchema(element.type, 'backContent', element.schemaToggles, element.style);
      const isBackBtnTextEnabled = shouldEnableInSchema(element.type, 'backButtonText', element.schemaToggles, element.style);
      const isBackBtnUrlEnabled = shouldEnableInSchema(element.type, 'backButtonUrl', element.schemaToggles, element.style);
      const flipDirVal = isFlipDirEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'flipDirection')} | default: 'horizontal' }}`
        : (element.props?.flipDirection || 'horizontal');
      const frontTitleVal = isFrontTitleEnabled
        ? generateContentLiquidVar(element.id, 'frontTitle')
        : (element.props?.frontTitle || 'Front Title');
      const frontContentVal = isFrontContentEnabled
        ? generateContentLiquidVar(element.id, 'frontContent')
        : (element.props?.frontContent || 'Front content');
      const backTitleVal = isBackTitleEnabled
        ? generateContentLiquidVar(element.id, 'backTitle')
        : (element.props?.backTitle || 'Back Title');
      const backContentVal = isBackContentEnabled
        ? generateContentLiquidVar(element.id, 'backContent')
        : (element.props?.backContent || 'Back content');
      const backBtnTextVal = isBackBtnTextEnabled
        ? generateContentLiquidVar(element.id, 'backButtonText')
        : (element.props?.backButtonText || '');
      const backBtnUrlVal = isBackBtnUrlEnabled
        ? generateContentLiquidVar(element.id, 'backButtonUrl')
        : (element.props?.backButtonUrl || '#');
      const fcEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${fcEntranceAttr} class="flip-card" style="perspective:1000px" data-flip-direction="${flipDirVal}">\n`;
      html += `${indent}  <div class="flip-card__inner">\n`;
      html += `${indent}    <div class="flip-card__front">\n`;

      // frontImage
      if (isFrontImageEnabled) {
        const frontImageId = generateSettingId(element.id, 'frontImage');
        html += `${indent}      {% if section.settings.${frontImageId} != blank %}\n`;
        html += `${indent}        <img src="{{ section.settings.${frontImageId} | image_url: width: 800 }}" alt="${frontTitleVal}" width="{{ section.settings.${frontImageId}.width }}" height="{{ section.settings.${frontImageId}.height }}" loading="lazy" class="flip-card__image" />\n`;
        html += `${indent}      {% endif %}\n`;
      }

      html += `${indent}      <h4>${frontTitleVal}</h4>\n`;

      html += `${indent}      <p>${frontContentVal}</p>\n`;
      html += `${indent}    </div>\n`;
      html += `${indent}    <div class="flip-card__back">\n`;
      html += `${indent}      <h4>${backTitleVal}</h4>\n`;
      html += `${indent}      <p>${backContentVal}</p>\n`;

      // backButtonText
      if (isBackBtnTextEnabled) {
        const backBtnTextId = generateSettingId(element.id, 'backButtonText');
        html += `${indent}      {% if section.settings.${backBtnTextId} != blank %}\n`;
        html += `${indent}        <a href="${backBtnUrlVal}" class="flip-card__btn">${backBtnTextVal}</a>\n`;
        html += `${indent}      {% endif %}\n`;
      } else if (backBtnTextVal) {
        html += `${indent}      <a href="${backBtnUrlVal}" class="flip-card__btn">${backBtnTextVal}</a>\n`;
      }

      html += `${indent}    </div>\n`;
      html += `${indent}  </div>\n`;
      html += `${indent}</div>\n`;
      break;
    }

    case 'before-after': {
      const isBeforeImageEnabled = shouldEnableInSchema(element.type, 'beforeImage', element.schemaToggles, element.style);
      const isAfterImageEnabled = shouldEnableInSchema(element.type, 'afterImage', element.schemaToggles, element.style);
      const isBeforeLabelEnabled = shouldEnableInSchema(element.type, 'beforeLabel', element.schemaToggles, element.style);
      const isAfterLabelEnabled = shouldEnableInSchema(element.type, 'afterLabel', element.schemaToggles, element.style);
      const isStartPosEnabled = shouldEnableInSchema(element.type, 'startPosition', element.schemaToggles, element.style);
      const beforeLabelVal = isBeforeLabelEnabled
        ? generateContentLiquidVar(element.id, 'beforeLabel')
        : (element.props?.beforeLabel || 'Before');
      const afterLabelVal = isAfterLabelEnabled
        ? generateContentLiquidVar(element.id, 'afterLabel')
        : (element.props?.afterLabel || 'After');
      const startPosVal = isStartPosEnabled
        ? generateContentLiquidVar(element.id, 'startPosition')
        : (element.props?.startPosition || '50');

      const baEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${baEntranceAttr} class="before-after-slider" data-start-position="${startPosVal}">\n`;

      // afterImage
      if (isAfterImageEnabled) {
        const afterImageId = generateSettingId(element.id, 'afterImage');
        html += `${indent}  <div class="ba-after">\n`;
        html += `${indent}    {% if section.settings.${afterImageId} != blank %}\n`;
        html += `${indent}      <img src="{{ section.settings.${afterImageId} | image_url: width: 1200 }}" alt="${afterLabelVal}" width="{{ section.settings.${afterImageId}.width }}" height="{{ section.settings.${afterImageId}.height }}" loading="lazy" draggable="false" />\n`;
        html += `${indent}    {% else %}\n`;
        html += `${indent}      <div class="image-placeholder-wrapper">\n`;
        html += `${indent}        {{ 'image' | placeholder_svg_tag: 'placeholder-image' }}\n`;
        html += `${indent}        <div class="image-placeholder-text">Add your image</div>\n`;
        html += `${indent}      </div>\n`;
        html += `${indent}    {% endif %}\n`;
        html += `${indent}  </div>\n`;
      } else {
        const afterImgSrc = element.props?.afterImage || '';
        html += `${indent}  <div class="ba-after">${afterImgSrc ? `<img src="${afterImgSrc}" alt="${afterLabelVal}" loading="lazy" draggable="false" />` : ''}</div>\n`;
      }

      // beforeImage
      if (isBeforeImageEnabled) {
        const beforeImageId = generateSettingId(element.id, 'beforeImage');
        html += `${indent}  <div class="ba-before"><div class="ba-before-inner">\n`;
        html += `${indent}    {% if section.settings.${beforeImageId} != blank %}\n`;
        html += `${indent}      <img src="{{ section.settings.${beforeImageId} | image_url: width: 1200 }}" alt="${beforeLabelVal}" width="{{ section.settings.${beforeImageId}.width }}" height="{{ section.settings.${beforeImageId}.height }}" loading="lazy" draggable="false" />\n`;
        html += `${indent}    {% else %}\n`;
        html += `${indent}      <div class="image-placeholder-wrapper">\n`;
        html += `${indent}        {{ 'image' | placeholder_svg_tag: 'placeholder-image' }}\n`;
        html += `${indent}        <div class="image-placeholder-text">Add your image</div>\n`;
        html += `${indent}      </div>\n`;
        html += `${indent}    {% endif %}\n`;
        html += `${indent}  </div></div>\n`;
      } else {
        const beforeImgSrc = element.props?.beforeImage || '';
        html += `${indent}  <div class="ba-before"><div class="ba-before-inner">${beforeImgSrc ? `<img src="${beforeImgSrc}" alt="${beforeLabelVal}" loading="lazy" draggable="false" />` : ''}</div></div>\n`;
      }

      html += `${indent}  <div class="ba-handle"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M470.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l41.4 41.4-357.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-41.4-41.4 357.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"/></svg></div></div>\n`;
      html += `${indent}</div>\n`;
      break;
    }

    case 'table': {
      const isHtmlEnabled = shouldEnableInSchema(element.type, 'html', element.schemaToggles, element.style);
      const isStripedRowsEnabled = shouldEnableInSchema(element.type, 'stripedRows', element.schemaToggles, element.style);
      const isHoverHighlightEnabled = shouldEnableInSchema(element.type, 'hoverHighlight', element.schemaToggles, element.style);

      const tableContent = isHtmlEnabled
        ? generateContentLiquidVar(element.id, 'html')
        : (element.props?.html || '<table><tr><th>Header</th></tr><tr><td>Cell</td></tr></table>');

      // Build class string
      let tableClasses = 'table-container';
      if (isStripedRowsEnabled) {
        const stripedRowsId = generateSettingId(element.id, 'stripedRows');
        tableClasses += `{% if section.settings.${stripedRowsId} %} table--striped{% endif %}`;
      } else if (element.props?.stripedRows) {
        tableClasses += ' table--striped';
      }
      if (isHoverHighlightEnabled) {
        const hoverHighlightId = generateSettingId(element.id, 'hoverHighlight');
        tableClasses += `{% if section.settings.${hoverHighlightId} %} table--hover{% endif %}`;
      } else if (element.props?.hoverHighlight) {
        tableClasses += ' table--hover';
      }

      const tblEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${tblEntranceAttr} class="${tableClasses}">\n`;
      html += `${indent}  ${tableContent}\n`;
      html += `${indent}</div>\n`;
      break;
    }

    case 'map': {
      const isAddressEnabled = shouldEnableInSchema(element.type, 'address', element.schemaToggles, element.style);

      const mapEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${mapEntranceAttr} class="map-container">\n`;
      if (isAddressEnabled) {
        const addressSettingId = generateSettingId(element.id, 'address');
        html += `${indent}  {% if section.settings.${addressSettingId} != blank %}\n`;
        html += `${indent}    <iframe src="https://maps.google.com/maps?q={{ section.settings.${addressSettingId} | url_encode }}&output=embed" width="100%" height="400" frameborder="0" allowfullscreen loading="lazy"></iframe>\n`;
        html += `${indent}  {% endif %}\n`;
      } else {
        const addressVal = element.props?.address || '';
        if (addressVal) {
          html += `${indent}  <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(addressVal)}&output=embed" width="100%" height="400" frameborder="0" allowfullscreen loading="lazy"></iframe>\n`;
        }
      }
      html += `${indent}</div>\n`;
      break;
    }

    case 'image-background': {
      const srcProp = elementDef.contentProps?.find(p => p.name === 'src');
      const isSrcSchemaEnabled = shouldEnableInSchema(element.type, 'src', element.schemaToggles, element.style);
      const uploadedFileName = element.props?.uploadedFileName || '';

      let src = element.props?.src || '';

      // If schema is enabled and it's not a data URL with a filename, use Liquid variable
      if (isSrcSchemaEnabled && !(src.startsWith('data:') && uploadedFileName)) {
        src = generateContentLiquidVar(element.id, 'src');
      }
      // Otherwise keep the original src (including data URLs) for asset extraction

      const ibgEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${ibgEntranceAttr} class="background-image-container">\n`;

      // Render children
      if (element.children && element.children.length > 0) {
        element.children.forEach(child => {
          html += generateElementHTML(child, indent + '  ');
        });
      }

      html += `${indent}</div>\n`;
      break;
    }

    case 'list':
    case 'unordered-list': {
      const htmlProp = elementDef.contentProps?.find(p => p.name === 'html');
      const isHtmlSchemaEnabled = shouldEnableInSchema(element.type, 'html', element.schemaToggles, element.style);

      const content = isHtmlSchemaEnabled
        ? generateContentLiquidVar(element.id, 'html')
        : (element.props?.html || htmlProp?.default || '<ul><li>Item 1</li></ul>');

      const listEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${listEntranceAttr}>\n`;
      html += `${indent}  ${content}\n`;
      html += `${indent}</div>\n`;
      break;
    }

    case 'container': {
      const contEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${contEntranceAttr} class="block-container">\n`;

      // Video background - only include if schema-enabled
      if (shouldEnableInSchema(element.type, 'backgroundVideo', element.schemaToggles)) {
        const bgVideoSettingId = generateSettingId(element.id, 'backgroundVideo');
        html += `${indent}  {% if section.settings.${bgVideoSettingId} != blank %}\n`;
        html += `${indent}    <video class="bg-video" src="{{ section.settings.${bgVideoSettingId} }}" autoplay muted loop playsinline></video>\n`;
        html += `${indent}  {% endif %}\n`;
      }

      // Render children
      if (element.children && element.children.length > 0) {
        element.children.forEach(child => {
          html += generateElementHTML(child, indent + '  ');
        });
      }

      html += `${indent}</div>\n`;
      break;
    }

    case 'column': {
      // Single column element
      const colEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${colEntranceAttr} class="column">\n`;

      // Render children
      if (element.children && element.children.length > 0) {
        element.children.forEach(child => {
          html += generateElementHTML(child, indent + '  ');
        });
      }

      html += `${indent}</div>\n`;
      break;
    }

    case 'columns-1':
    case 'columns-2':
    case 'columns-3':
    case 'columns-4':
    case 'columns-5':
    case 'columns-6':
    case 'grid-2x2': {
      const columnCount = element.type === 'grid-2x2' ? 4 : parseInt(element.type.split('-')[1] || '2');

      const colsEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${colsEntranceAttr} class="columns columns-${columnCount}">\n`;

      // Render columns with numbered classes
      const columns = element.columns || [];
      for (let i = 0; i < columnCount; i++) {
        html += `${indent}  <div data-element-id="${element.id}-col-${i}" class="column column-${i + 1}">\n`;

        const columnElements = columns[i] || [];
        columnElements.forEach(child => {
          html += generateElementHTML(child, indent + '    ');
        });

        html += `${indent}  </div>\n`;
      }

      html += `${indent}</div>\n`;
      break;
    }

    case 'image-gallery': {
      const galCols = element.props?.columns || '3';
      const isGalColsEnabled = shouldEnableInSchema(element.type, 'columns', element.schemaToggles, element.style);
      const isLightboxEnabled = shouldEnableInSchema(element.type, 'enableLightbox', element.schemaToggles, element.style);
      const maxGalImages = 12;

      const galColsVal = isGalColsEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'columns', 'desktop')} | default: '${galCols}' }}`
        : galCols;
      const lightboxAttr = isLightboxEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'enableLightbox')} }}`
        : (element.props?.enableLightbox ? 'true' : 'false');

      const galEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${galEntranceAttr} class="image-gallery" data-lightbox="${lightboxAttr}">\n`;
      for (let i = 1; i <= maxGalImages; i++) {
        const isImgEnabled = shouldEnableInSchema(element.type, `image_${i}`, element.schemaToggles, element.style);
        if (isImgEnabled) {
          const imgId = generateSettingId(element.id, `image_${i}`);
          html += `${indent}  {% if section.settings.${imgId} != blank %}\n`;
          html += `${indent}    <div class="gallery-item">\n`;
          html += `${indent}      <img src="{{ section.settings.${imgId} | image_url: width: section.settings.${imgId}.width }}" alt="Gallery image ${i}" width="{{ section.settings.${imgId}.width }}" height="{{ section.settings.${imgId}.height }}" loading="lazy" />\n`;
          html += `${indent}    </div>\n`;
          html += `${indent}  {% else %}\n`;
          html += `${indent}    <div class="gallery-item">\n`;
          html += `${indent}      <div class="image-placeholder-wrapper">\n`;
          html += `${indent}        {{ 'image' | placeholder_svg_tag: 'placeholder-image' }}\n`;
          html += `${indent}        <div class="image-placeholder-text">Add your image</div>\n`;
          html += `${indent}      </div>\n`;
          html += `${indent}    </div>\n`;
          html += `${indent}  {% endif %}\n`;
        }
      }
      html += `${indent}</div>\n`;
      break;
    }

    case 'marquee': {
      const isMqTextEnabled = shouldEnableInSchema(element.type, 'text', element.schemaToggles, element.style);
      const isMqSpeedEnabled = shouldEnableInSchema(element.type, 'speed', element.schemaToggles, element.style);
      const isMqPauseEnabled = shouldEnableInSchema(element.type, 'pauseOnHover', element.schemaToggles, element.style);
      const isMqDirEnabled = shouldEnableInSchema(element.type, 'direction', element.schemaToggles, element.style);

      const mqTextVal = isMqTextEnabled
        ? generateContentLiquidVar(element.id, 'text')
        : (element.props?.text || 'Scrolling text here');
      const mqSpeedAttr = isMqSpeedEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'speed')} | default: 50 }}`
        : (element.props?.speed || '50');
      const mqPauseAttr = isMqPauseEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'pauseOnHover')} }}`
        : (element.props?.pauseOnHover ? 'true' : 'false');
      const mqDirAttr = isMqDirEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'direction')} | default: 'left' }}`
        : (element.props?.direction || 'left');

      const mqEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${mqEntranceAttr} class="marquee-wrapper" data-speed="${mqSpeedAttr}" data-pause-on-hover="${mqPauseAttr}" data-direction="${mqDirAttr}">\n`;
      html += `${indent}  <div class="marquee-track">\n`;
      html += `${indent}    <span>${mqTextVal}</span>\n`;
      html += `${indent}    <span>${mqTextVal}</span>\n`;
      html += `${indent}  </div>\n`;
      html += `${indent}</div>\n`;
      break;
    }

    case 'blog-post': {
      const bpCols = element.props?.columns || '3';
      const isBpColsEnabled = shouldEnableInSchema(element.type, 'columns', element.schemaToggles, element.style);
      const isBpPostCountEnabled = shouldEnableInSchema(element.type, 'postCount', element.schemaToggles, element.style);
      const isBpShowImageEnabled = shouldEnableInSchema(element.type, 'showImage', element.schemaToggles, element.style);
      const isBpShowDateEnabled = shouldEnableInSchema(element.type, 'showDate', element.schemaToggles, element.style);
      const isBpShowAuthorEnabled = shouldEnableInSchema(element.type, 'showAuthor', element.schemaToggles, element.style);
      const isBpShowExcerptEnabled = shouldEnableInSchema(element.type, 'showExcerpt', element.schemaToggles, element.style);
      const isBpShowReadMoreEnabled = shouldEnableInSchema(element.type, 'showReadMore', element.schemaToggles, element.style);
      const isBpReadMoreTextEnabled = shouldEnableInSchema(element.type, 'readMoreText', element.schemaToggles, element.style);

      const bpColsVal = isBpColsEnabled
        ? `{{ section.settings.${generateSettingId(element.id, 'columns', 'desktop')} | default: '${bpCols}' }}`
        : bpCols;
      const readMoreTextVal = isBpReadMoreTextEnabled
        ? generateContentLiquidVar(element.id, 'readMoreText')
        : (element.props?.readMoreText || 'Read More');

      const bpEntranceAttr = buildEntranceAttr(element);
      html += `${indent}<div data-element-id="${element.id}"${bpEntranceAttr} class="blog-posts">\n`;

      if (isBpPostCountEnabled) {
        html += `${indent}  {% assign bp_limit = section.settings.${generateSettingId(element.id, 'postCount')} | default: 3 %}\n`;
      } else {
        html += `${indent}  {% assign bp_limit = ${element.props?.postCount || 3} %}\n`;
      }

      html += `${indent}  {% for article in blogs.news.articles limit: bp_limit %}\n`;
      html += `${indent}    <div class="blog-post-card">\n`;

      // showImage
      if (isBpShowImageEnabled) {
        const showImageId = generateSettingId(element.id, 'showImage');
        html += `${indent}      {% if section.settings.${showImageId} %}\n`;
      }
      if (isBpShowImageEnabled || element.props?.showImage !== false) {
        html += `${indent}        {% if article.image %}\n`;
        html += `${indent}          <img src="{{ article.image | image_url: width: 600 }}" alt="{{ article.title | escape }}" width="{{ article.image.width }}" height="{{ article.image.height }}" loading="lazy" class="blog-post__image" />\n`;
        html += `${indent}        {% endif %}\n`;
        if (isBpShowImageEnabled) html += `${indent}      {% endif %}\n`;
      }

      html += `${indent}      <div class="blog-post__content">\n`;

      // showDate
      if (isBpShowDateEnabled) {
        const showDateId = generateSettingId(element.id, 'showDate');
        html += `${indent}        {% if section.settings.${showDateId} %}\n`;
        html += `${indent}          <time class="blog-post__date">{{ article.published_at | date: "%B %d, %Y" }}</time>\n`;
        html += `${indent}        {% endif %}\n`;
      } else if (element.props?.showDate !== false) {
        html += `${indent}        <time class="blog-post__date">{{ article.published_at | date: "%B %d, %Y" }}</time>\n`;
      }

      html += `${indent}        <h4 class="blog-post__title"><a href="{{ article.url }}">{{ article.title }}</a></h4>\n`;

      // showAuthor
      if (isBpShowAuthorEnabled) {
        const showAuthorId = generateSettingId(element.id, 'showAuthor');
        html += `${indent}        {% if section.settings.${showAuthorId} %}\n`;
        html += `${indent}          <p class="blog-post__author">{{ article.author }}</p>\n`;
        html += `${indent}        {% endif %}\n`;
      } else if (element.props?.showAuthor !== false) {
        html += `${indent}        <p class="blog-post__author">{{ article.author }}</p>\n`;
      }

      // showExcerpt
      if (isBpShowExcerptEnabled) {
        const showExcerptId = generateSettingId(element.id, 'showExcerpt');
        html += `${indent}        {% if section.settings.${showExcerptId} %}\n`;
        html += `${indent}          <p class="blog-post__excerpt">{{ article.excerpt_or_content | strip_html | truncatewords: 20 }}</p>\n`;
        html += `${indent}        {% endif %}\n`;
      } else if (element.props?.showExcerpt !== false) {
        html += `${indent}        <p class="blog-post__excerpt">{{ article.excerpt_or_content | strip_html | truncatewords: 20 }}</p>\n`;
      }

      // showReadMore
      if (isBpShowReadMoreEnabled) {
        const showReadMoreId = generateSettingId(element.id, 'showReadMore');
        html += `${indent}        {% if section.settings.${showReadMoreId} %}\n`;
        html += `${indent}          <a href="{{ article.url }}" class="blog-post__link">${readMoreTextVal}</a>\n`;
        html += `${indent}        {% endif %}\n`;
      } else if (element.props?.showReadMore !== false) {
        html += `${indent}        <a href="{{ article.url }}" class="blog-post__link">${readMoreTextVal}</a>\n`;
      }

      html += `${indent}      </div>\n`;
      html += `${indent}    </div>\n`;
      html += `${indent}  {% endfor %}\n`;
      html += `${indent}</div>\n`;
      break;
    }

    default:
      // Unknown element type - render as div with content
      html += `${indent}<div data-element-id="${element.id}">\n`;
      html += `${indent}  <!-- Unknown element type: ${element.type} -->\n`;
      html += `${indent}</div>\n`;
      break;
  }

  return html;
};

/**
 * Generate HTML for all elements
 */
export const generateAllElementsHTML = (elements, sectionId) => {
  // Return empty string if no elements
  if (!elements || elements.length === 0) {
    return '';
  }

  let html = '';

  html += `<div id="${sectionId}-{{ section.id }}" class="${sectionId}-section">\n`;

  elements.forEach(element => {
    html += generateElementHTML(element, '  ');
  });

  html += `</div>\n`;

  return html;
};
