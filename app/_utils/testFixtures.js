/**
 * Test Fixtures — Mock elements for every Blockify element type
 *
 * Each fixture creates a minimal but realistic element that exercises
 * the key code paths in the Liquid export pipeline.
 */

let counter = 0;
const uid = () => `test-${(++counter).toString(36).padStart(4, '0')}`;

/**
 * Reset counter between runs for deterministic IDs
 */
export const resetFixtures = () => { counter = 0; };

// ─── Layout Elements ─────────────────────────────────────────

const containerWithChildren = () => {
  const textId = uid();
  const btnId = uid();
  return {
    id: uid(),
    type: 'container',
    props: {},
    style: {
      backgroundColor: '#1a1a2e',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      paddingTop: '10px',
      paddingBottom: '10px',
    },
    children: [
      {
        id: textId,
        type: 'text',
        props: { text: 'Free shipping on all orders over $50' },
        style: { color: '#ffffff', fontSize: '13px', fontWeight: '500' },
      },
      {
        id: btnId,
        type: 'button',
        props: { text: 'Shop Now', url: '#', openInNewTab: false },
        style: {
          color: '#ffffff',
          backgroundColor: '#000000',
          fontSize: '11px',
          fontWeight: '600',
          borderRadius: '3px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(255,255,255,0.4)',
          paddingTop: '12px',
          paddingBottom: '12px',
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    ],
  };
};

const emptyContainer = () => ({
  id: uid(),
  type: 'container',
  props: {},
  style: { backgroundColor: '#ffffff', display: 'flex' },
  children: [],
});

const columns2 = () => {
  const col1Text = uid();
  const col2Text = uid();
  const col1 = uid();
  const col2 = uid();
  return {
    id: uid(),
    type: 'columns-2',
    props: {},
    style: {},
    columns: [
      [{ id: col1Text, type: 'text', props: { text: 'Column 1 text' }, style: { color: '#333' } }],
      [{ id: col2Text, type: 'text', props: { text: 'Column 2 text' }, style: { color: '#333' } }],
    ],
  };
};

const columns3 = () => {
  return {
    id: uid(),
    type: 'columns-3',
    props: {},
    style: {},
    columns: [
      [{ id: uid(), type: 'heading', props: { text: 'Col 1', tag: 'h3' }, style: {} }],
      [{ id: uid(), type: 'heading', props: { text: 'Col 2', tag: 'h3' }, style: {} }],
      [{ id: uid(), type: 'heading', props: { text: 'Col 3', tag: 'h3' }, style: {} }],
    ],
  };
};

const imageBackground = () => ({
  id: uid(),
  type: 'image-background',
  props: { src: '' },
  style: {
    height: '400px',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    gradientType: 'linear',
    gradientAngle: '135',
    gradientColor1: '#667eea',
    gradientColor2: '#764ba2',
  },
  children: [
    { id: uid(), type: 'heading', props: { text: 'Hero Title', tag: 'h2' }, style: { color: '#fff', fontSize: '48px' } },
  ],
});

const spacer = () => ({
  id: uid(),
  type: 'spacer',
  props: {},
  style: { height: '40px' },
});

// ─── Basic Elements ──────────────────────────────────────────

const heading = () => ({
  id: uid(),
  type: 'heading',
  props: { text: 'Welcome to our store', tag: 'h2' },
  style: {
    fontFamily: 'inherit',
    fontSize: '36px',
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a1a1a',
    lineHeight: '1.2',
    marginBottom: '20px',
  },
});

const text = () => ({
  id: uid(),
  type: 'text',
  props: { text: 'This is a paragraph of text with some content.' },
  style: {
    fontFamily: 'inherit',
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#333333',
    lineHeight: '1.6',
  },
});

const button = () => ({
  id: uid(),
  type: 'button',
  props: { text: 'Add to Cart', url: '/cart', openInNewTab: false },
  style: {
    fontFamily: 'inherit',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#000000',
    borderRadius: '4px',
    borderWidth: '0px',
    borderStyle: 'none',
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '24px',
    paddingRight: '24px',
    hoverBackgroundColor: '#333333',
    hoverColor: '#ffffff',
  },
});

const image = () => ({
  id: uid(),
  type: 'image',
  props: { src: '', alt: 'Product image' },
  style: {
    width: '100%',
    maxWidth: '500px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
});

const icon = () => ({
  id: uid(),
  type: 'icon',
  props: { src: '' },
  style: { iconSize: '48px', iconColor: '#333333' },
});

const divider = () => ({
  id: uid(),
  type: 'divider',
  props: {},
  style: {
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    borderWidth: '1px',
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
    alignSelf: 'center',
  },
});

const list = () => ({
  id: uid(),
  type: 'list',
  props: { html: '<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>' },
  style: { fontSize: '16px', color: '#333' },
});

const unorderedList = () => ({
  id: uid(),
  type: 'unordered-list',
  props: { html: '<ul><li>Item A</li><li>Item B</li><li>Item C</li></ul>' },
  style: { fontSize: '16px', color: '#333' },
});

const table = () => ({
  id: uid(),
  type: 'table',
  props: {
    html: '<table><thead><tr><th>Name</th><th>Price</th></tr></thead><tbody><tr><td>Widget</td><td>$9.99</td></tr></tbody></table>',
    cellPadding: '10px',
    borderWidth: '1px',
    borderColor: '#ddd',
    headerColor: '#f5f5f5',
    headerTextColor: '#333',
    stripedRows: true,
    hoverHighlight: true,
  },
  style: { width: '100%', fontSize: '14px' },
});

const marquee = () => ({
  id: uid(),
  type: 'marquee',
  props: { text: 'Sale ends tonight!', speed: 50, pauseOnHover: true, direction: 'left' },
  style: { fontSize: '18px', color: '#ff0000', backgroundColor: '#fff3cd', paddingTop: '10px', paddingBottom: '10px' },
});

const map = () => ({
  id: uid(),
  type: 'map',
  props: { address: '1600 Pennsylvania Avenue, Washington DC' },
  style: { width: '100%', height: '300px' },
});

const video = () => ({
  id: uid(),
  type: 'video',
  props: { src: '' },
  style: { width: '100%', borderRadius: '8px' },
});

// ─── Interactive Elements ────────────────────────────────────

const accordion = () => ({
  id: uid(),
  type: 'accordion',
  props: {
    itemCount: 3,
    panelTitle_1: 'What is your return policy?',
    panelContent_1: 'We accept returns within 30 days.',
    panelTitle_2: 'How long does shipping take?',
    panelContent_2: '3-5 business days.',
    panelTitle_3: 'Do you ship internationally?',
    panelContent_3: 'Yes, we ship worldwide.',
  },
  style: {
    titleFontFamily: 'inherit',
    titleFontSize: '16px',
    titleFontWeight: '600',
    contentFontSize: '14px',
    titleColor: '#333333',
    titleBackgroundColor: '#f8f9fa',
    contentBackgroundColor: '#ffffff',
    borderColor: '#dee2e6',
    borderRadius: '8px',
    gap: '8px',
  },
});

const tabs = () => ({
  id: uid(),
  type: 'tabs',
  props: {
    tabCount: 3,
    tabLabel_1: 'Description',
    tabContent_1: 'Product description goes here.',
    tabLabel_2: 'Reviews',
    tabContent_2: 'Customer reviews will appear here.',
    tabLabel_3: 'Shipping',
    tabContent_3: 'Free shipping on orders over $50.',
  },
  style: {
    tabFontFamily: 'inherit',
    tabFontSize: '14px',
    tabFontWeight: '500',
    contentFontSize: '14px',
    tabBackgroundColor: '#f8f9fa',
    tabActiveBackgroundColor: '#ffffff',
    tabColor: '#666',
    tabActiveColor: '#333',
    contentBackgroundColor: '#ffffff',
    borderColor: '#dee2e6',
  },
});

const countdown = () => ({
  id: uid(),
  type: 'countdown',
  props: {
    targetDate: '2026-12-31T23:59:59',
    expiredMessage: 'Sale has ended!',
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
  },
  style: {
    digitFontFamily: 'inherit',
    digitColor: '#1a1a1a',
    labelColor: '#666',
    digitFontSize: '36px',
    labelFontSize: '12px',
    separatorStyle: 'colon',
    backgroundColor: '#f8f9fa',
  },
});

const slideshow = () => ({
  id: uid(),
  type: 'slideshow',
  props: {
    slideCount: 2,
    slideHeading_1: 'Slide 1 Heading',
    slideText_1: 'Slide 1 description text.',
    slideHeading_2: 'Slide 2 Heading',
    slideText_2: 'Slide 2 description text.',
    autoplay: true,
    autoplayInterval: 5,
    showArrows: true,
    showDots: true,
  },
  style: {
    headingFontFamily: 'inherit',
    headingFontSize: '28px',
    headingFontWeight: '700',
    textFontSize: '16px',
    height: '400px',
    slideBackgroundColor: '#1a1a2e',
    arrowColor: '#ffffff',
    dotColor: '#cccccc',
    dotActiveColor: '#ffffff',
  },
});

const popup = () => ({
  id: uid(),
  type: 'popup',
  props: {
    triggerText: 'Subscribe',
    popupTitle: 'Join Our Newsletter',
    popupContent: 'Get 10% off your first order.',
    showEmailField: true,
    emailPlaceholder: 'Enter your email',
    submitText: 'Subscribe',
  },
  style: {
    fontFamily: 'inherit',
    fontSize: '14px',
    titleFontSize: '24px',
    color: '#333',
    backgroundColor: '#ffffff',
    overlayColor: 'rgba(0,0,0,0.5)',
    buttonColor: '#ffffff',
    buttonBackgroundColor: '#000000',
    borderRadius: '12px',
  },
});

// ─── Form Elements ───────────────────────────────────────────

const form = () => ({
  id: uid(),
  type: 'form',
  props: {
    formAction: '/contact',
    showName: true,
    showEmail: true,
    showPhone: false,
    showMessage: true,
    submitText: 'Send Message',
    namePlaceholder: 'Your Name',
    emailPlaceholder: 'your@email.com',
    messagePlaceholder: 'Your message...',
  },
  style: {
    fontFamily: 'inherit',
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#ffffff',
    buttonColor: '#ffffff',
    buttonBackgroundColor: '#000000',
    inputBorderColor: '#ddd',
    inputBorderRadius: '4px',
  },
});

// ─── Shopify Product Elements ────────────────────────────────

const price = () => ({
  id: uid(),
  type: 'price',
  props: { showComparePrice: true },
  style: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    comparePriceColor: '#999',
    textAlign: 'left',
    marginTop: '10px',
    marginBottom: '10px',
  },
});

const addToCart = () => ({
  id: uid(),
  type: 'add-to-cart',
  props: { buttonText: 'Add to Cart', showQuantity: true },
  style: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#000000',
    borderRadius: '4px',
    paddingTop: '14px',
    paddingBottom: '14px',
  },
});

const productCard = () => ({
  id: uid(),
  type: 'product-card',
  props: {
    showImage: true,
    showTitle: true,
    showPrice: true,
    showButton: true,
    buttonText: 'View Product',
  },
  style: {
    backgroundColor: '#ffffff',
    color: '#333',
    buttonColor: '#ffffff',
    buttonBackgroundColor: '#000000',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#eeeeee',
  },
});

const productGrid = () => ({
  id: uid(),
  type: 'product-grid',
  props: {
    columns: '3',
    rows: '2',
    showPrice: true,
    showButton: true,
    buttonText: 'Quick View',
  },
  style: {
    gap: '20px',
    backgroundColor: '#ffffff',
    color: '#333',
    buttonColor: '#ffffff',
    buttonBackgroundColor: '#000000',
    borderRadius: '8px',
  },
});

const collectionList = () => ({
  id: uid(),
  type: 'collection-list',
  props: {
    columns: '3',
    showImage: true,
    showTitle: true,
    showCount: true,
  },
  style: {
    gap: '20px',
    backgroundColor: '#ffffff',
    color: '#333',
    borderRadius: '8px',
  },
});

const variantSelector = () => ({
  id: uid(),
  type: 'variant-selector',
  props: {
    selectorStyle: 'buttons',
    showLabel: true,
    showPrice: true,
  },
  style: {
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    backgroundColor: '#ffffff',
    activeColor: '#000000',
    activeBorderColor: '#000000',
    gap: '8px',
    borderRadius: '4px',
  },
});

// ─── Gallery & Display Elements ──────────────────────────────

const imageGallery = () => ({
  id: uid(),
  type: 'image-gallery',
  props: {
    imageCount: 4,
    enableLightbox: true,
  },
  style: {
    columns: '2',
    gap: '10px',
    borderRadius: '8px',
  },
});

const flipCard = () => ({
  id: uid(),
  type: 'flip-card',
  props: {
    frontTitle: 'Front Title',
    frontContent: 'Front side content',
    backTitle: 'Back Title',
    backContent: 'Back side content',
    backButtonText: 'Learn More',
    backButtonUrl: '#',
    flipDirection: 'horizontal',
  },
  style: {
    width: '300px',
    height: '400px',
    fontFamily: 'inherit',
    titleFontSize: '22px',
    fontSize: '14px',
    frontBackgroundColor: '#1a1a2e',
    frontColor: '#ffffff',
    backBackgroundColor: '#ffffff',
    backColor: '#333',
    borderRadius: '12px',
  },
});

const beforeAfter = () => ({
  id: uid(),
  type: 'before-after',
  props: {
    beforeLabel: 'Before',
    afterLabel: 'After',
    startPosition: 50,
  },
  style: {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    sliderColor: '#ffffff',
    labelColor: '#ffffff',
    labelBackgroundColor: 'rgba(0,0,0,0.5)',
  },
});

const progressBar = () => ({
  id: uid(),
  type: 'progress-bar',
  props: {
    label: 'Loading',
    percentage: 75,
    showPercentage: true,
    showLabel: true,
    animated: true,
  },
  style: {
    fontFamily: 'inherit',
    fontSize: '14px',
    color: '#333',
    barColor: '#000000',
    trackColor: '#e0e0e0',
    barHeight: '8px',
    borderRadius: '4px',
  },
});

// ─── Blog & Content Elements ─────────────────────────────────

const blogPost = () => ({
  id: uid(),
  type: 'blog-post',
  props: {
    postCount: 3,
    showImage: true,
    showExcerpt: true,
    showDate: true,
    showAuthor: true,
    showReadMore: true,
    readMoreText: 'Read More',
  },
  style: {
    columns: '3',
    gap: '20px',
    fontFamily: 'inherit',
    titleFontSize: '20px',
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#ffffff',
    linkColor: '#000000',
    borderRadius: '8px',
  },
});

// ─── Shopify Utility Elements ────────────────────────────────

const socialIcons = () => ({
  id: uid(),
  type: 'social-icons',
  props: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  style: {
    iconSize: '24px',
    gap: '12px',
    color: '#333',
    hoverColor: '#000',
    justifyContent: 'center',
  },
});

// stock-counter element removed

// ─── Export All Fixtures ─────────────────────────────────────

/**
 * Get all test fixtures organized by category
 */
export const getAllFixtures = () => {
  resetFixtures();
  return [
    // Layout
    { name: 'Container (with children)', element: containerWithChildren() },
    { name: 'Container (empty)', element: emptyContainer() },
    { name: 'Columns-2', element: columns2() },
    { name: 'Columns-3', element: columns3() },
    { name: 'Image Background', element: imageBackground() },
    { name: 'Spacer', element: spacer() },
    // Basic
    { name: 'Heading', element: heading() },
    { name: 'Text', element: text() },
    { name: 'Button', element: button() },
    { name: 'Image', element: image() },
    { name: 'Icon', element: icon() },
    { name: 'Divider', element: divider() },
    { name: 'Ordered List', element: list() },
    { name: 'Unordered List', element: unorderedList() },
    { name: 'Table', element: table() },
    { name: 'Marquee', element: marquee() },
    { name: 'Map', element: map() },
    { name: 'Video', element: video() },
    // Interactive
    { name: 'Accordion', element: accordion() },
    { name: 'Tabs', element: tabs() },
    { name: 'Countdown', element: countdown() },
    { name: 'Slideshow', element: slideshow() },
    { name: 'Popup', element: popup() },
    // Form
    { name: 'Form', element: form() },
    // Shopify Product
    { name: 'Product Card', element: productCard() },
    { name: 'Product Grid', element: productGrid() },
    { name: 'Collection List', element: collectionList() },
    // variant-selector removed (V2)
    // Gallery & Display
    { name: 'Image Gallery', element: imageGallery() },
    { name: 'Flip Card', element: flipCard() },
    { name: 'Before/After', element: beforeAfter() },
    { name: 'Progress Bar', element: progressBar() },
    // Blog & Content
    { name: 'Blog Post', element: blogPost() },
    // Utility
    { name: 'Social Icons', element: socialIcons() },
    // stock-counter removed
  ];
};

/**
 * Get a combined page fixture (all elements as top-level)
 */
export const getCombinedFixture = () => {
  const fixtures = getAllFixtures();
  return {
    elements: fixtures.map(f => f.element),
    responsiveStyles: {},
  };
};
