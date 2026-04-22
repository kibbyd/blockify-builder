/**
 * Responsive Styles Manager
 * Instantiated per-request in serverless environment (no persistent state)
 */

export default class ResponsiveStylesManager {
  constructor() {
    this.stylesRegistry = new Map();

    this.breakpoints = {
      xs: { min: 0, max: 575, name: 'xs', label: 'Extra Small (Mobile)' },
      sm: { min: 576, max: 767, name: 'sm', label: 'Small (Mobile Landscape)' },
      md: { min: 768, max: 991, name: 'md', label: 'Medium (Tablet)' },
      lg: { min: 992, max: 1199, name: 'lg', label: 'Large (Desktop)' },
      xl: { min: 1200, max: Infinity, name: 'xl', label: 'Extra Large (Large Desktop)' }
    };

    this.breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl'];
  }

  registerStyles(elementId, styles) {
    this.stylesRegistry.set(elementId, styles);
  }

  getStyles(elementId) {
    return this.stylesRegistry.get(elementId) || {};
  }

  updateBreakpointStyles(elementId, breakpoint, styles) {
    const existing = this.getStyles(elementId);
    existing[breakpoint] = { ...existing[breakpoint], ...styles };
    this.stylesRegistry.set(elementId, existing);
  }

  deleteStyles(elementId) {
    this.stylesRegistry.delete(elementId);
  }

  clearAll() {
    this.stylesRegistry.clear();
  }

  generateElementCSS(elementId) {
    const styles = this.getStyles(elementId);
    if (!styles || Object.keys(styles).length === 0) return '';

    let css = '';
    const selector = `[data-responsive-id="${elementId}"]`;

    this.breakpointOrder.forEach(breakpoint => {
      const breakpointStyles = styles[breakpoint];
      if (!breakpointStyles || Object.keys(breakpointStyles).length === 0) return;

      const bp = this.breakpoints[breakpoint];
      const cssRules = this._stylesToCSS(breakpointStyles);

      if (breakpoint === 'xs') {
        css += `${selector} {\n${cssRules}}\n\n`;
      } else {
        const mediaQuery = bp.max === Infinity
          ? `@media (min-width: ${bp.min}px)`
          : `@media (min-width: ${bp.min}px) and (max-width: ${bp.max}px)`;

        css += `${mediaQuery} {\n  ${selector} {\n${cssRules}  }\n}\n\n`;
      }
    });

    return css;
  }

  generateMultipleElementsCSS(elementIds) {
    let css = '';
    elementIds.forEach(id => {
      css += this.generateElementCSS(id);
    });
    return css;
  }

  generateAllCSS() {
    let css = '/* Responsive Styles */\n\n';
    this.stylesRegistry.forEach((_, elementId) => {
      css += this.generateElementCSS(elementId);
    });
    return css;
  }

  processRenderedHTML(html, sectionId = null) {
    const elementIds = this._extractResponsiveIds(html);
    if (elementIds.length === 0) return html;

    const css = this.generateMultipleElementsCSS(elementIds);
    if (!css.trim()) return html;

    const styleTag = `<style data-section="${sectionId || 'responsive'}">\n${css}</style>\n`;
    return styleTag + html;
  }

  _extractResponsiveIds(html) {
    const regex = /data-responsive-id=["']([^"']+)["']/g;
    const ids = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (!ids.includes(match[1])) {
        ids.push(match[1]);
      }
    }
    return ids;
  }

  _stylesToCSS(styles) {
    return Object.entries(styles)
      .map(([property, value]) => `  ${this._camelToKebab(property)}: ${value};`)
      .join('\n') + '\n';
  }

  _camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  exportJSON() {
    const data = {};
    this.stylesRegistry.forEach((styles, elementId) => {
      data[elementId] = styles;
    });
    return data;
  }

  importJSON(data) {
    Object.entries(data).forEach(([elementId, styles]) => {
      this.registerStyles(elementId, styles);
    });
  }

  getAllElementIds() {
    return Array.from(this.stylesRegistry.keys());
  }
}
