import { Liquid } from 'liquidjs';
import path from 'path';

const engine = new Liquid({
  root: [path.resolve(process.cwd(), 'blocks'), path.resolve(process.cwd(), 'snippets')],
  extname: '.liquid'
});

// Register custom Shopify tags
engine.registerTag('style', {
  parse: function(tagToken, remainTokens) {
    this.templates = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream
      .on('tag:endstyle', () => stream.stop())
      .on('template', (tpl) => this.templates.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`);
      });
    stream.start();
  },
  render: function(scope) {
    return this.liquid.renderer.renderTemplates(this.templates, scope)
      .then(html => `<style>${html}</style>`);
  }
});

engine.registerTag('form', {
  parse: function(tagToken, remainTokens) {
    this.args = tagToken.args;
    this.templates = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream
      .on('tag:endform', () => stream.stop())
      .on('template', (tpl) => this.templates.push(tpl))
      .on('end', () => {
        throw new Error(`tag ${tagToken.getText()} not closed`);
      });
    stream.start();
  },
  render: function(scope) {
    return this.liquid.renderer.renderTemplates(this.templates, scope)
      .then(html => `<div class="form-wrapper" data-form-type="${this.args}">${html}</div>`);
  }
});

export const mockShopifyData = {
  shop: {
    name: 'Test Store',
    url: 'https://test-store.myshopify.com',
    currency: 'USD',
    logo: 'https://via.placeholder.com/200x60?text=Your+Logo'
  },
  settings: {
    color_primary: '#000000',
    color_secondary: '#666666',
    color_accent: '#0066cc',
    font_heading: 'Helvetica, Arial, sans-serif',
    font_body: 'Georgia, serif'
  },
  collections: [
    {
      title: 'Summer Collection',
      handle: 'summer-collection',
      products_count: 25,
      image: 'https://via.placeholder.com/400x300?text=Summer+Collection'
    },
    {
      title: 'Winter Collection',
      handle: 'winter-collection',
      products_count: 30,
      image: 'https://via.placeholder.com/400x300?text=Winter+Collection'
    }
  ],
  products: [
    {
      title: 'Sample Product 1',
      price: '29.99',
      compare_at_price: '39.99',
      vendor: 'Sample Vendor',
      image: 'https://via.placeholder.com/300x300?text=Product+1',
      available: true,
      handle: 'sample-product-1'
    },
    {
      title: 'Sample Product 2',
      price: '49.99',
      compare_at_price: '59.99',
      vendor: 'Sample Vendor',
      image: 'https://via.placeholder.com/300x300?text=Product+2',
      available: true,
      handle: 'sample-product-2'
    },
    {
      title: 'Sample Product 3',
      price: '19.99',
      compare_at_price: null,
      vendor: 'Another Vendor',
      image: 'https://via.placeholder.com/300x300?text=Product+3',
      available: false,
      handle: 'sample-product-3'
    }
  ],
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com'
  }
};

export function fixLiquidSyntax(template) {
  // Fix unclosed {% style %} tags
  const styleMatches = (template.match(/\{%\s*style\s*%\}/g) || []).length;
  const endStyleMatches = (template.match(/\{%\s*endstyle\s*%\}/g) || []).length;
  if (styleMatches > endStyleMatches) {
    for (let i = 0; i < (styleMatches - endStyleMatches); i++) {
      template += '\n{% endstyle %}';
    }
  }

  // Fix unclosed {% form %} tags
  const formMatches = (template.match(/\{%\s*form\s+/g) || []).length;
  const endFormMatches = (template.match(/\{%\s*endform\s*%\}/g) || []).length;
  if (formMatches > endFormMatches) {
    for (let i = 0; i < (formMatches - endFormMatches); i++) {
      template += '\n{% endform %}';
    }
  }

  // Fix unclosed {% if %} tags
  const ifMatches = (template.match(/\{%\s*if\s+/g) || []).length;
  const endIfMatches = (template.match(/\{%\s*endif\s*%\}/g) || []).length;
  if (ifMatches > endIfMatches) {
    for (let i = 0; i < (ifMatches - endIfMatches); i++) {
      template += '\n{% endif %}';
    }
  }

  // Fix unclosed {% for %} tags
  const forMatches = (template.match(/\{%\s*for\s+/g) || []).length;
  const endForMatches = (template.match(/\{%\s*endfor\s*%\}/g) || []).length;
  if (forMatches > endForMatches) {
    for (let i = 0; i < (forMatches - endForMatches); i++) {
      template += '\n{% endfor %}';
    }
  }

  return template;
}

export default engine;
