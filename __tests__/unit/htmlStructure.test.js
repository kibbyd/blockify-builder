import { generateElementHTML } from '@/app/_utils/htmlGeneration';
import { resetIdGenerator } from '@/app/_utils/idGenerator';

beforeEach(() => {
  resetIdGenerator();
});

// ---------------------------------------------------------------------------
// heading
// ---------------------------------------------------------------------------
describe('heading', () => {
  test('renders h2 with data-element-id and Liquid text variable', () => {
    const html = generateElementHTML({
      id: 'h-1', type: 'heading',
      props: { text: 'Hello', tag: 'h2' },
      schemaToggles: {},
    });
    expect(html).toContain('<h2 data-element-id="h-1">');
    expect(html).toMatch(/\{\{ section\.settings\.\S+_text \}\}/);
    expect(html).toContain('</h2>');
  });

  test.each(['h3', 'h4', 'h5', 'h6'])('renders %s tag when tag prop is %s', (tag) => {
    resetIdGenerator();
    const html = generateElementHTML({
      id: `h-${tag}`, type: 'heading',
      props: { text: 'X', tag },
      schemaToggles: {},
    });
    expect(html).toContain(`<${tag} data-element-id="h-${tag}">`);
    expect(html).toContain(`</${tag}>`);
  });

  test('defaults to h2 when no tag prop', () => {
    const html = generateElementHTML({
      id: 'h-def', type: 'heading',
      props: { text: 'Default' },
      schemaToggles: {},
    });
    expect(html).toContain('<h2');
    expect(html).toContain('</h2>');
  });
});

// ---------------------------------------------------------------------------
// text
// ---------------------------------------------------------------------------
describe('text', () => {
  test('renders <p> with data-element-id and Liquid text variable', () => {
    const html = generateElementHTML({
      id: 't-1', type: 'text',
      props: { text: 'Paragraph' },
      schemaToggles: {},
    });
    expect(html).toContain('<p data-element-id="t-1">');
    expect(html).toMatch(/\{\{ section\.settings\.\S+_text \}\}/);
    expect(html).toContain('</p>');
  });

  test('renders empty <p> when props is empty', () => {
    const html = generateElementHTML({
      id: 't-empty', type: 'text',
      props: {},
      schemaToggles: { text: false },
    });
    expect(html).toContain('<p data-element-id="t-empty">');
    expect(html).toContain('</p>');
  });
});

// ---------------------------------------------------------------------------
// button
// ---------------------------------------------------------------------------
describe('button', () => {
  test('renders <a> with href Liquid variable, text Liquid variable, and data-element-id', () => {
    const html = generateElementHTML({
      id: 'btn-1', type: 'button',
      props: { text: 'Click', url: '/page' },
      schemaToggles: {},
    });
    expect(html).toContain('<a href=');
    expect(html).toContain('data-element-id="btn-1"');
    expect(html).toMatch(/href="\{\{ section\.settings\.\S+_url \}\}"/);
    expect(html).toMatch(/>\{\{ section\.settings\.\S+_text \}\}<\/a>/);
  });

  test('includes target="_blank" and rel when openInNewTab is true', () => {
    const html = generateElementHTML({
      id: 'btn-2', type: 'button',
      props: { text: 'Go', url: '#', openInNewTab: true },
      schemaToggles: {},
    });
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  test('omits target="_blank" when openInNewTab is false', () => {
    const html = generateElementHTML({
      id: 'btn-3', type: 'button',
      props: { text: 'Go', url: '#', openInNewTab: false },
      schemaToggles: {},
    });
    expect(html).not.toContain('target="_blank"');
    expect(html).not.toContain('rel="noopener noreferrer"');
  });
});

// ---------------------------------------------------------------------------
// image
// ---------------------------------------------------------------------------
describe('image', () => {
  test('renders Liquid conditional with image_url, placeholder fallback, and loading="lazy"', () => {
    const html = generateElementHTML({
      id: 'img-1', type: 'image',
      props: { src: 'https://example.com/photo.jpg', alt: 'Photo' },
      schemaToggles: {},
    });
    expect(html).toMatch(/\{% if section\.settings\.\S+ != blank %\}/);
    expect(html).toContain('image_url');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('alt="Photo"');
    expect(html).toContain('<img');
    expect(html).toContain('{% else %}');
    expect(html).toContain('placeholder');
    expect(html).toContain('{% endif %}');
  });

  test('data-element-id is on the <img> tag inside the conditional', () => {
    const html = generateElementHTML({
      id: 'img-2', type: 'image',
      props: { src: 'x.jpg', alt: '' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="img-2"');
  });
});

// ---------------------------------------------------------------------------
// video
// ---------------------------------------------------------------------------
describe('video', () => {
  test('renders <video> with src and control attributes', () => {
    const html = generateElementHTML({
      id: 'vid-1', type: 'video',
      props: { src: 'clip.mp4', autoplay: true, muted: true, loop: true, controls: true },
    });
    expect(html).toContain('<video data-element-id="vid-1"');
    expect(html).toContain('autoplay');
    expect(html).toContain('muted');
    expect(html).toContain('loop');
    expect(html).toContain('controls');
    expect(html).toContain('</video>');
  });

  test('renders poster attribute when provided', () => {
    const html = generateElementHTML({
      id: 'vid-2', type: 'video',
      props: { src: 'clip.mp4', poster: 'thumb.jpg' },
    });
    expect(html).toContain('poster="thumb.jpg"');
  });

  test('omits boolean attributes when false', () => {
    const html = generateElementHTML({
      id: 'vid-3', type: 'video',
      props: { src: 'clip.mp4', autoplay: false, muted: false, loop: false, controls: false },
    });
    expect(html).not.toContain('autoplay');
    expect(html).not.toContain('muted');
    expect(html).not.toContain(' loop');
    expect(html).not.toContain('controls');
  });
});

// ---------------------------------------------------------------------------
// icon
// ---------------------------------------------------------------------------
describe('icon', () => {
  test('renders Liquid conditional with icon-element class and placeholder SVG fallback', () => {
    const html = generateElementHTML({
      id: 'ico-1', type: 'icon',
      props: { src: 'icon.svg', alt: 'Star' },
      schemaToggles: {},
    });
    expect(html).toMatch(/\{% if section\.settings\.\S+ != blank %\}/);
    expect(html).toContain('class="icon-element"');
    expect(html).toContain('alt="Star"');
    expect(html).toContain('{% else %}');
    expect(html).toContain('<svg');
    expect(html).toContain('{% endif %}');
  });

  test('data-element-id present on icon img', () => {
    const html = generateElementHTML({
      id: 'ico-2', type: 'icon',
      props: { src: 'icon.svg' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="ico-2"');
  });
});

// ---------------------------------------------------------------------------
// spacer
// ---------------------------------------------------------------------------
describe('spacer', () => {
  test('renders <div> with class="spacer" and data-element-id', () => {
    const html = generateElementHTML({ id: 'sp-1', type: 'spacer' });
    expect(html).toContain('<div data-element-id="sp-1" class="spacer"></div>');
  });
});

// ---------------------------------------------------------------------------
// divider
// ---------------------------------------------------------------------------
describe('divider', () => {
  test('renders <hr> with data-element-id', () => {
    const html = generateElementHTML({ id: 'div-1', type: 'divider', schemaToggles: {} });
    expect(html).toContain('<hr data-element-id="div-1" />');
  });
});

// ---------------------------------------------------------------------------
// container
// ---------------------------------------------------------------------------
describe('container', () => {
  test('renders <div> with class="block-container" and data-element-id', () => {
    const html = generateElementHTML({
      id: 'ctn-1', type: 'container', children: [],
    });
    expect(html).toContain('<div data-element-id="ctn-1" class="block-container">');
    expect(html).toContain('</div>');
  });

  test('renders children inside the container', () => {
    const html = generateElementHTML({
      id: 'ctn-2', type: 'container',
      children: [
        { id: 'child-a', type: 'spacer' },
      ],
    });
    expect(html).toContain('data-element-id="child-a"');
    expect(html).toContain('class="spacer"');
  });

  test('renders background video when backgroundVideo prop is set', () => {
    const html = generateElementHTML({
      id: 'ctn-3', type: 'container',
      props: { backgroundVideo: 'bg.mp4' },
      schemaToggles: {},
      children: [],
    });
    expect(html).toContain('<video class="bg-video"');
    expect(html).toContain('autoplay');
    expect(html).toContain('muted');
    expect(html).toContain('loop');
    expect(html).toContain('playsinline');
  });
});

// ---------------------------------------------------------------------------
// columns (1-6)
// ---------------------------------------------------------------------------
describe.each([1, 2, 3, 4, 5, 6])('columns-%i', (n) => {
  test(`renders div.columns.columns-${n} with ${n} column children`, () => {
    resetIdGenerator();
    const columns = Array.from({ length: n }, () => []);
    const html = generateElementHTML({
      id: `col-${n}`, type: `columns-${n}`,
      columns,
      schemaToggles: {},
    });
    expect(html).toContain(`class="columns columns-${n}"`);
    expect(html).toContain(`data-element-id="col-${n}"`);
    for (let i = 1; i <= n; i++) {
      expect(html).toContain(`class="column column-${i}"`);
    }
  });
});

// ---------------------------------------------------------------------------
// list / unordered-list
// ---------------------------------------------------------------------------
describe('list', () => {
  test('renders <div> wrapping HTML content with data-element-id', () => {
    const html = generateElementHTML({
      id: 'list-1', type: 'list',
      props: { html: '<ol><li>A</li></ol>' },
      schemaToggles: { html: false },
    });
    expect(html).toContain('<div data-element-id="list-1">');
    expect(html).toContain('<ol><li>A</li></ol>');
    expect(html).toContain('</div>');
  });
});

describe('unordered-list', () => {
  test('renders <div> wrapping HTML content with data-element-id', () => {
    const html = generateElementHTML({
      id: 'ul-1', type: 'unordered-list',
      props: { html: '<ul><li>B</li></ul>' },
      schemaToggles: { html: false },
    });
    expect(html).toContain('<div data-element-id="ul-1">');
    expect(html).toContain('<ul><li>B</li></ul>');
    expect(html).toContain('</div>');
  });
});

// ---------------------------------------------------------------------------
// table
// ---------------------------------------------------------------------------
describe('table', () => {
  test('renders div.table-container wrapping HTML content', () => {
    const html = generateElementHTML({
      id: 'tbl-1', type: 'table',
      props: { html: '<table><tr><td>X</td></tr></table>' },
      schemaToggles: { html: false },
    });
    expect(html).toContain('<div data-element-id="tbl-1" class="table-container">');
    expect(html).toContain('<table><tr><td>X</td></tr></table>');
    expect(html).toContain('</div>');
  });
});

// ---------------------------------------------------------------------------
// map
// ---------------------------------------------------------------------------
describe('map', () => {
  test('renders div.map-container with <iframe> inside', () => {
    const html = generateElementHTML({
      id: 'map-1', type: 'map',
      props: { embedUrl: 'https://maps.google.com/embed' },
      schemaToggles: { embedUrl: false },
    });
    expect(html).toContain('data-element-id="map-1"');
    expect(html).toContain('class="map-container"');
    expect(html).toContain('<iframe');
    expect(html).toContain('src="https://maps.google.com/embed"');
    expect(html).toContain('</iframe>');
  });
});

// ---------------------------------------------------------------------------
// image-background
// ---------------------------------------------------------------------------
describe('image-background', () => {
  test('renders div.background-image-container with Liquid background-image url', () => {
    const html = generateElementHTML({
      id: 'ibg-1', type: 'image-background',
      props: { src: 'bg.jpg' },
      schemaToggles: {},
      children: [],
    });
    expect(html).toContain('data-element-id="ibg-1"');
    expect(html).toContain('class="background-image-container"');
    expect(html).toMatch(/style="background-image: url\('{{ section\.settings\.\S+_src }}'\)"/);
  });

  test('renders children inside the background container', () => {
    const html = generateElementHTML({
      id: 'ibg-2', type: 'image-background',
      props: { src: 'bg.jpg' },
      schemaToggles: {},
      children: [
        { id: 'ibg-child', type: 'spacer' },
      ],
    });
    expect(html).toContain('data-element-id="ibg-child"');
  });
});

// ---------------------------------------------------------------------------
// price
// ---------------------------------------------------------------------------
describe('price', () => {
  test('renders div.price-display with {{ product.price | money }}', () => {
    const html = generateElementHTML({
      id: 'prc-1', type: 'price',
      props: {},
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="prc-1"');
    expect(html).toContain('class="price-display"');
    expect(html).toContain('{{ product.price | money }}');
    expect(html).toContain('class="price-current"');
  });

  test('includes compare price conditional when showComparePrice is enabled', () => {
    const html = generateElementHTML({
      id: 'prc-2', type: 'price',
      props: { showComparePrice: true },
      schemaToggles: {},
    });
    expect(html).toContain('{% if product.compare_at_price > product.price %}');
    expect(html).toContain('{{ product.compare_at_price | money }}');
    expect(html).toContain('class="price-compare"');
  });
});

// ---------------------------------------------------------------------------
// add-to-cart
// ---------------------------------------------------------------------------
describe('add-to-cart', () => {
  test('renders {% form "product" %} with div.add-to-cart-wrapper, quantity input, submit button', () => {
    const html = generateElementHTML({
      id: 'atc-1', type: 'add-to-cart',
      props: { showQuantity: true },
      schemaToggles: {},
    });
    expect(html).toContain("{% form 'product', product %}");
    expect(html).toContain('data-element-id="atc-1"');
    expect(html).toContain('class="add-to-cart-wrapper"');
    expect(html).toContain('type="number"');
    expect(html).toContain('name="quantity"');
    expect(html).toContain('class="atc-quantity"');
    expect(html).toContain('type="submit"');
    expect(html).toContain('class="atc-button"');
    expect(html).toContain('{% endform %}');
  });

  test('button text uses Liquid variable (always-enabled)', () => {
    const html = generateElementHTML({
      id: 'atc-2', type: 'add-to-cart',
      props: { buttonText: 'Buy Now' },
      schemaToggles: {},
    });
    expect(html).toMatch(/\{\{ section\.settings\.\S+_buttonText \}\}/);
  });
});

// ---------------------------------------------------------------------------
// product-card
// ---------------------------------------------------------------------------
describe('product-card', () => {
  test('renders div.product-card with showImage/showTitle/showPrice/showButton conditionals', () => {
    const html = generateElementHTML({
      id: 'pc-1', type: 'product-card',
      props: {},
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="pc-1"');
    expect(html).toContain('class="product-card"');
    // showImage conditional
    expect(html).toMatch(/\{% if section\.settings\.\S+_showImage %\}/);
    expect(html).toContain('product.featured_image');
    expect(html).toContain('class="product-card__image"');
    // showTitle conditional
    expect(html).toMatch(/\{% if section\.settings\.\S+_showTitle %\}/);
    expect(html).toContain('class="product-card__title"');
    // showPrice conditional
    expect(html).toMatch(/\{% if section\.settings\.\S+_showPrice %\}/);
    expect(html).toContain('{{ product.price | money }}');
    expect(html).toContain('class="product-card__price"');
    // showButton conditional
    expect(html).toMatch(/\{% if section\.settings\.\S+_showButton %\}/);
    expect(html).toContain('class="product-card__button"');
  });
});

// ---------------------------------------------------------------------------
// product-grid
// ---------------------------------------------------------------------------
describe('product-grid', () => {
  test('renders div.product-grid with {% for product in collections... %} loop', () => {
    const html = generateElementHTML({
      id: 'pg-1', type: 'product-grid',
      props: { columns: '3', rows: '2' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="pg-1"');
    expect(html).toContain('class="product-grid');
    expect(html).toContain('{% for product in collections[section.settings.collection].products limit:');
    expect(html).toContain('class="product-grid__item"');
    expect(html).toContain('class="product-grid__image"');
    expect(html).toContain('class="product-grid__title"');
    expect(html).toContain('{% endfor %}');
  });

  test('showPrice and showButton conditionals use Liquid settings', () => {
    const html = generateElementHTML({
      id: 'pg-2', type: 'product-grid',
      props: {},
      schemaToggles: {},
    });
    expect(html).toMatch(/\{% if section\.settings\.\S+_showPrice %\}/);
    expect(html).toMatch(/\{% if section\.settings\.\S+_showButton %\}/);
    expect(html).toContain('{{ product.price | money }}');
    expect(html).toContain('class="product-grid__button"');
  });
});

// ---------------------------------------------------------------------------
// collection-list
// ---------------------------------------------------------------------------
describe('collection-list', () => {
  test('renders div.collection-list with collection picker assigns', () => {
    const html = generateElementHTML({
      id: 'cl-1', type: 'collection-list',
      props: {},
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="cl-1"');
    expect(html).toContain('class="collection-list');
    // collection picker assign blocks (6 total)
    expect(html).toContain('{% assign cl_1 = section.settings.');
    expect(html).toContain('{% assign cl_6 = section.settings.');
    expect(html).toContain('{% if cl_1 != blank %}');
    expect(html).toContain('class="collection-list__item"');
    // showImage conditional
    expect(html).toMatch(/\{% if section\.settings\.\S+_showImage %\}/);
    expect(html).toContain('class="collection-list__image"');
    // showTitle conditional
    expect(html).toMatch(/\{% if section\.settings\.\S+_showTitle %\}/);
    expect(html).toContain('class="collection-list__title"');
    // showCount conditional
    expect(html).toMatch(/\{% if section\.settings\.\S+_showCount %\}/);
    expect(html).toContain('class="collection-list__count"');
  });
});

// ---------------------------------------------------------------------------
// variant-selector
// ---------------------------------------------------------------------------
describe('variant-selector', () => {
  test('renders div.variant-selector with {% for option in product.options_with_values %} and dropdown select', () => {
    const html = generateElementHTML({
      id: 'vs-1', type: 'variant-selector',
      props: { selectorStyle: 'dropdown' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="vs-1"');
    expect(html).toContain('class="variant-selector"');
    expect(html).toContain('{% for option in product.options_with_values %}');
    expect(html).toContain('class="variant-selector__group"');
    expect(html).toContain('class="variant-selector__label"');
    expect(html).toContain('<select class="variant-selector__select"');
    expect(html).toContain('{% for value in option.values %}');
    expect(html).toContain('<option value="{{ value }}"');
    expect(html).toContain('{% endfor %}');
  });

  test('renders button options when selectorStyle is "buttons"', () => {
    const html = generateElementHTML({
      id: 'vs-2', type: 'variant-selector',
      props: { selectorStyle: 'buttons' },
      schemaToggles: {},
    });
    expect(html).toContain('class="variant-selector__options"');
    expect(html).toContain('class="variant-selector__btn');
    expect(html).not.toContain('<select');
  });
});

// ---------------------------------------------------------------------------
// accordion
// ---------------------------------------------------------------------------
describe('accordion', () => {
  test('renders div.accordion with <details> and <summary> for each item', () => {
    const html = generateElementHTML({
      id: 'acc-1', type: 'accordion',
      props: { itemCount: 3 },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="acc-1"');
    expect(html).toContain('class="accordion"');
    // 3 items
    const detailsCount = (html.match(/<details class="accordion__item">/g) || []).length;
    expect(detailsCount).toBe(3);
    const summaryCount = (html.match(/<summary class="accordion__title">/g) || []).length;
    expect(summaryCount).toBe(3);
    expect(html).toContain('class="accordion__content"');
  });

  test('respects itemCount prop', () => {
    const html = generateElementHTML({
      id: 'acc-2', type: 'accordion',
      props: { itemCount: 5 },
      schemaToggles: {},
    });
    const detailsCount = (html.match(/<details class="accordion__item">/g) || []).length;
    expect(detailsCount).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// tabs
// ---------------------------------------------------------------------------
describe('tabs', () => {
  test('renders div.tabs-container with .tabs__nav buttons and .tabs__panel divs', () => {
    const html = generateElementHTML({
      id: 'tab-1', type: 'tabs',
      props: { tabCount: 3 },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="tab-1"');
    expect(html).toContain('class="tabs-container"');
    expect(html).toContain('class="tabs__nav"');
    // 3 buttons
    const btnCount = (html.match(/class="tabs__button/g) || []).length;
    expect(btnCount).toBe(3);
    // 3 panels
    const panelCount = (html.match(/class="tabs__panel/g) || []).length;
    expect(panelCount).toBe(3);
  });

  test('first tab button and panel have "active" class', () => {
    const html = generateElementHTML({
      id: 'tab-2', type: 'tabs',
      props: { tabCount: 2 },
      schemaToggles: {},
    });
    expect(html).toContain('class="tabs__button active"');
    expect(html).toContain('class="tabs__panel active"');
  });

  test('non-first tabs do not have "active" class', () => {
    const html = generateElementHTML({
      id: 'tab-3', type: 'tabs',
      props: { tabCount: 2 },
      schemaToggles: {},
    });
    expect(html).toContain('class="tabs__button" data-tab="2"');
    expect(html).toContain('class="tabs__panel" data-tab-panel="2"');
  });
});

// ---------------------------------------------------------------------------
// countdown
// ---------------------------------------------------------------------------
describe('countdown', () => {
  test('renders div.countdown with data-countdown-target and unit/digit/label/separator elements', () => {
    const html = generateElementHTML({
      id: 'cd-1', type: 'countdown',
      props: { targetDate: '2030-01-01' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="cd-1"');
    expect(html).toContain('class="countdown"');
    expect(html).toContain('data-countdown-target=');
    expect(html).toContain('class="countdown__unit"');
    expect(html).toContain('class="countdown__digit"');
    expect(html).toContain('class="countdown__label"');
    expect(html).toContain('class="countdown__separator"');
    // Uses Liquid variable for targetDate (always-enabled)
    expect(html).toMatch(/data-countdown-target="\{\{ section\.settings\.\S+_targetDate \}\}"/);
  });

  test('renders days, hours, minutes, seconds units by default', () => {
    const html = generateElementHTML({
      id: 'cd-2', type: 'countdown',
      props: { targetDate: '2030-01-01' },
      schemaToggles: {},
    });
    expect(html).toContain('data-countdown-days');
    expect(html).toContain('data-countdown-hours');
    expect(html).toContain('data-countdown-minutes');
    expect(html).toContain('data-countdown-seconds');
    expect(html).toContain('Days');
    expect(html).toContain('Hours');
    expect(html).toContain('Min');
    expect(html).toContain('Sec');
  });
});

// ---------------------------------------------------------------------------
// slideshow
// ---------------------------------------------------------------------------
describe('slideshow', () => {
  test('renders div.slideshow with .slideshow__track, .slideshow__slide, arrows, and dots', () => {
    const html = generateElementHTML({
      id: 'ss-1', type: 'slideshow',
      props: { slideCount: 3 },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="ss-1"');
    expect(html).toContain('class="slideshow"');
    expect(html).toContain('class="slideshow__track"');
    // 3 slides
    const slideCount = (html.match(/class="slideshow__slide/g) || []).length;
    expect(slideCount).toBe(3);
    // First slide active
    expect(html).toContain('class="slideshow__slide active"');
    // Arrows
    expect(html).toContain('class="slideshow__arrow slideshow__arrow--prev"');
    expect(html).toContain('class="slideshow__arrow slideshow__arrow--next"');
    // Dots
    expect(html).toContain('class="slideshow__dots"');
    expect(html).toContain('class="slideshow__dot active"');
  });
});

// ---------------------------------------------------------------------------
// form
// ---------------------------------------------------------------------------
describe('form', () => {
  test('renders <form class="blockify-form"> with conditional fields and submit button', () => {
    const html = generateElementHTML({
      id: 'frm-1', type: 'form',
      props: {},
      schemaToggles: {},
    });
    expect(html).toContain('<form data-element-id="frm-1" class="blockify-form"');
    expect(html).toContain('method="post"');
    // showName conditional
    expect(html).toMatch(/\{% if .+ == true %\}/);
    expect(html).toContain('name="contact[name]"');
    // showEmail conditional
    expect(html).toContain('name="contact[email]"');
    expect(html).toContain('type="email"');
    // showPhone conditional
    expect(html).toContain('name="contact[phone]"');
    expect(html).toContain('type="tel"');
    // showMessage conditional
    expect(html).toContain('name="contact[body]"');
    expect(html).toContain('<textarea');
    // Submit button
    expect(html).toContain('type="submit"');
    expect(html).toContain('class="form-submit"');
    expect(html).toContain('</form>');
  });
});

// ---------------------------------------------------------------------------
// popup
// ---------------------------------------------------------------------------
describe('popup', () => {
  test('renders div.blockify-popup-wrapper with trigger, overlay, modal, close, title, content, email input', () => {
    const html = generateElementHTML({
      id: 'pop-1', type: 'popup',
      props: {},
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="pop-1"');
    expect(html).toContain('class="blockify-popup-wrapper"');
    expect(html).toContain('class="popup-trigger"');
    expect(html).toContain('class="popup-overlay"');
    expect(html).toContain('class="popup-modal"');
    expect(html).toContain('class="popup-close"');
    expect(html).toContain('class="popup-title"');
    expect(html).toContain('class="popup-content"');
    expect(html).toContain('class="popup-email-input"');
    expect(html).toContain('type="email"');
    expect(html).toContain('class="popup-submit"');
  });
});

// ---------------------------------------------------------------------------
// social-icons
// ---------------------------------------------------------------------------
describe('social-icons', () => {
  test('renders div.social-icons with <a> links per platform', () => {
    const html = generateElementHTML({
      id: 'soc-1', type: 'social-icons',
      props: {
        facebook: 'https://facebook.com/test',
        instagram: 'https://instagram.com/test',
      },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="soc-1"');
    expect(html).toContain('class="social-icons"');
    expect(html).toContain('class="social-icon-link social-icon--facebook"');
    expect(html).toContain('class="social-icon-link social-icon--instagram"');
    expect(html).toContain('href="https://facebook.com/test"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("{% render 'icon-facebook' %}");
    expect(html).toContain("{% render 'icon-instagram' %}");
  });

  test('does not render links for platforms without a URL', () => {
    const html = generateElementHTML({
      id: 'soc-2', type: 'social-icons',
      props: { facebook: 'https://facebook.com/test' },
      schemaToggles: {},
    });
    expect(html).not.toContain('social-icon--twitter');
    expect(html).not.toContain('social-icon--youtube');
  });
});

// ---------------------------------------------------------------------------
// flip-card
// ---------------------------------------------------------------------------
describe('flip-card', () => {
  test('renders div.flip-card with perspective style, __inner, __front, __back', () => {
    const html = generateElementHTML({
      id: 'fc-1', type: 'flip-card',
      props: { frontTitle: 'Front', backTitle: 'Back', backButtonText: 'Go' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="fc-1"');
    expect(html).toContain('class="flip-card"');
    expect(html).toContain('style="perspective:1000px"');
    expect(html).toContain('class="flip-card__inner"');
    expect(html).toContain('class="flip-card__front"');
    expect(html).toContain('class="flip-card__back"');
  });

  test('renders back button when backButtonText is set', () => {
    const html = generateElementHTML({
      id: 'fc-2', type: 'flip-card',
      props: { backButtonText: 'Learn More', backButtonUrl: '/page' },
      schemaToggles: {},
    });
    expect(html).toContain('class="flip-card__btn"');
    expect(html).toContain('Learn More');
    expect(html).toContain('href="/page"');
  });
});

// ---------------------------------------------------------------------------
// before-after
// ---------------------------------------------------------------------------
describe('before-after', () => {
  test('renders div.before-after-slider with .ba-after, .ba-before, .ba-handle, .ba-label', () => {
    const html = generateElementHTML({
      id: 'ba-1', type: 'before-after',
      props: { beforeLabel: 'Before', afterLabel: 'After' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="ba-1"');
    expect(html).toContain('class="before-after-slider"');
    expect(html).toContain('class="ba-after"');
    expect(html).toContain('class="ba-before"');
    expect(html).toContain('class="ba-handle"');
    expect(html).toContain('class="ba-label ba-label--before"');
    expect(html).toContain('class="ba-label ba-label--after"');
  });

  test('contains Liquid image_url for before and after images', () => {
    const html = generateElementHTML({
      id: 'ba-2', type: 'before-after',
      props: {},
      schemaToggles: {},
    });
    expect(html).toMatch(/\{\{ section\.settings\.\S+_afterImage \| image_url/);
    expect(html).toMatch(/\{\{ section\.settings\.\S+_beforeImage \| image_url/);
  });
});

// ---------------------------------------------------------------------------
// progress-bar
// ---------------------------------------------------------------------------
describe('progress-bar', () => {
  test('renders div.progress-bar-wrapper with header, label, track, fill', () => {
    const html = generateElementHTML({
      id: 'pb-1', type: 'progress-bar',
      props: { percentage: 75, label: 'Loading' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="pb-1"');
    expect(html).toContain('class="progress-bar-wrapper"');
    expect(html).toContain('class="progress-bar__header"');
    expect(html).toContain('class="progress-bar__label"');
    expect(html).toContain('Loading');
    expect(html).toContain('class="progress-bar__track"');
    expect(html).toContain('class="progress-bar__fill"');
    expect(html).toContain('style="width:75%"');
    expect(html).toContain('75%');
  });
});

// ---------------------------------------------------------------------------
// image-gallery
// ---------------------------------------------------------------------------
describe('image-gallery', () => {
  test('renders div.image-gallery with .gallery-item divs containing <img> with Liquid image_url', () => {
    const html = generateElementHTML({
      id: 'ig-1', type: 'image-gallery',
      props: { imageCount: 3 },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="ig-1"');
    expect(html).toContain('class="image-gallery"');
    const itemCount = (html.match(/class="gallery-item"/g) || []).length;
    expect(itemCount).toBe(3);
    expect(html).toMatch(/\{\{ section\.settings\.\S+_image_1 \| image_url/);
    expect(html).toMatch(/\{\{ section\.settings\.\S+_image_2 \| image_url/);
    expect(html).toMatch(/\{\{ section\.settings\.\S+_image_3 \| image_url/);
    expect(html).toContain('loading="lazy"');
  });
});

// ---------------------------------------------------------------------------
// marquee
// ---------------------------------------------------------------------------
describe('marquee', () => {
  test('renders div.marquee-wrapper with .marquee-track containing two <span> elements', () => {
    const html = generateElementHTML({
      id: 'mq-1', type: 'marquee',
      props: { text: 'Sale!' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="mq-1"');
    expect(html).toContain('class="marquee-wrapper"');
    expect(html).toContain('class="marquee-track"');
    const spanCount = (html.match(/<span>Sale!<\/span>/g) || []).length;
    expect(spanCount).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// blog-post
// ---------------------------------------------------------------------------
describe('blog-post', () => {
  test('renders div.blog-posts with {% for article in blogs.news.articles %} loop', () => {
    const html = generateElementHTML({
      id: 'bp-1', type: 'blog-post',
      props: { postCount: '3' },
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="bp-1"');
    expect(html).toContain('class="blog-posts"');
    expect(html).toContain('{% for article in blogs.news.articles limit: 3 %}');
    expect(html).toContain('class="blog-post-card"');
    expect(html).toContain('class="blog-post__image"');
    expect(html).toContain('class="blog-post__content"');
    expect(html).toContain('class="blog-post__date"');
    expect(html).toContain('class="blog-post__title"');
    expect(html).toContain('class="blog-post__excerpt"');
    expect(html).toContain('{% if article.image %}');
    expect(html).toContain('{{ article.title | escape }}');
    expect(html).toContain('{{ article.published_at | date:');
    expect(html).toContain('{{ article.excerpt_or_content | strip_html | truncatewords: 20 }}');
    expect(html).toContain('class="blog-post__link"');
    expect(html).toContain('{% endfor %}');
  });
});

// ---------------------------------------------------------------------------
// stock-counter
// ---------------------------------------------------------------------------
describe('stock-counter', () => {
  test('renders div.stock-counter with product.available conditional and inventory checks', () => {
    const html = generateElementHTML({
      id: 'sc-1', type: 'stock-counter',
      props: {},
      schemaToggles: {},
    });
    expect(html).toContain('data-element-id="sc-1"');
    expect(html).toContain('class="stock-counter"');
    expect(html).toContain('{% if product.available %}');
    expect(html).toContain('{% assign inventory = product.selected_or_first_available_variant.inventory_quantity %}');
    expect(html).toContain('stock-counter--low');
    expect(html).toContain('stock-counter--in-stock');
    expect(html).toContain('stock-counter--out');
    expect(html).toContain('{% else %}');
    expect(html).toContain('{% endif %}');
  });

  test('uses default threshold of 10 when not specified', () => {
    const html = generateElementHTML({
      id: 'sc-2', type: 'stock-counter',
      props: {},
      schemaToggles: {},
    });
    expect(html).toContain('{% if inventory <= 10 %}');
  });

  test('uses custom lowStockThreshold', () => {
    const html = generateElementHTML({
      id: 'sc-3', type: 'stock-counter',
      props: { lowStockThreshold: '5' },
      schemaToggles: {},
    });
    expect(html).toContain('{% if inventory <= 5 %}');
  });

  test('contains default low-stock, in-stock, and out-of-stock messages', () => {
    const html = generateElementHTML({
      id: 'sc-4', type: 'stock-counter',
      props: {},
      schemaToggles: {},
    });
    expect(html).toContain('In Stock');
    expect(html).toContain('Sold Out');
    expect(html).toContain('{{ inventory }}');
  });
});
