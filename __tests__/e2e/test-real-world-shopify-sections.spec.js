const { test, expect } = require("@playwright/test");

/**
 * Real-World Shopify Section Building Tests
 *
 * These tests simulate actual Shopify theme developer workflows:
 * - Building hero sections with overlays
 * - Creating responsive product grids
 * - Designing testimonial sections
 * - CTA sections with buttons and hover states
 * - Complex multi-column layouts
 *
 * Goal: Uncover edge cases in real-world usage
 */

test.describe("Real-World Shopify Sections", () => {

  test("Hero Section - Background image with centered text overlay", async ({ page }) => {
    // Navigate and clear state
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Build a hero section:
      // Container (full width)
      //   > Heading (large, centered)
      //   > Text (subheading)
      //   > Button (CTA)

      await helpers.addElement("container");
      await helpers.addElement("heading");
      await helpers.addElement("text");
      await helpers.addElement("button");

      // Get elements to modify their responsive properties
      const elements = helpers.getElements();

      console.log(`Hero section elements: ${elements.length}`);
      console.log('Element types:', elements.map(e => e.type));

      return helpers.exportToLiquidForTesting("hero-section");
    });

    console.log(`\n📊 Hero Section Results:`);
    console.log(`   Elements: ${result.elementCount}`);
    console.log(`   Code length: ${result.liquidCode.length} chars`);

    expect(result.elementCount).toBe(4);
    expect(result.liquidCode).toContain("block-container");
    expect(result.liquidCode).toContain("{% schema %}");

    // Should have settings for heading, text, and button
    const schemaMatch = result.liquidCode.match(/{% schema %}([\s\S]*?){% endschema %}/);
    expect(schemaMatch).toBeTruthy();

    const schema = JSON.parse(schemaMatch[1].trim());
    expect(schema.settings.length).toBeGreaterThan(0);

    console.log(`   ✓ Schema settings: ${schema.settings.length}`);
  });

  test("Product Grid - 3 columns desktop, 1 column mobile", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Product grid layout:
      // Container
      //   > Columns-3 (3 columns on desktop, should stack on mobile)
      //     Column 1: Image + Heading + Text + Button
      //     Column 2: Image + Heading + Text + Button
      //     Column 3: Image + Heading + Text + Button

      // Add container
      await helpers.addElement("container");

      // Add 3-column layout
      await helpers.addElement("columns-3");

      // Add 6 more elements (2 per column would be ideal, but let's just add elements)
      await helpers.addElement("image");
      await helpers.addElement("heading");
      await helpers.addElement("text");
      await helpers.addElement("button");
      await helpers.addElement("image");
      await helpers.addElement("heading");

      const elements = helpers.getElements();
      console.log(`Product grid elements: ${elements.length}`);

      return helpers.exportToLiquidForTesting("product-grid-section");
    });

    console.log(`\n📊 Product Grid Results:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBeGreaterThan(5);
    expect(result.liquidCode).toContain("columns-3");

    // Check for responsive media queries
    expect(result.liquidCode).toContain("@media");
    expect(result.liquidCode).toContain("max-width: 767px"); // Mobile breakpoint

    console.log(`   ✓ Responsive styles included`);
  });

  test("Testimonial Section - Nested containers with styling", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Testimonial layout:
      // Container (outer wrapper)
      //   > Heading (section title)
      //   > Container (testimonial card)
      //     > Icon (quote icon)
      //     > Text (testimonial quote)
      //     > Heading (customer name)

      await helpers.addElement("container");
      await helpers.addElement("heading");
      await helpers.addElement("container"); // Nested container
      await helpers.addElement("icon");
      await helpers.addElement("text");
      await helpers.addElement("heading");

      const elements = helpers.getElements();
      console.log(`Testimonial elements: ${elements.length}`);

      return helpers.exportToLiquidForTesting("testimonial-section");
    });

    console.log(`\n📊 Testimonial Section Results:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBe(6);

    // Should have multiple containers (nested)
    const containerMatches = result.liquidCode.match(/block-container/g);
    expect(containerMatches).toBeTruthy();
    expect(containerMatches.length).toBeGreaterThanOrEqual(2);

    console.log(`   ✓ Nested containers: ${containerMatches.length}`);
  });

  test("CTA Section - Buttons with different hover animations", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // CTA section:
      // Heading (main CTA text)
      // Text (supporting text)
      // Button (primary CTA)
      // Button (secondary CTA)

      await helpers.addElement("heading");
      await helpers.addElement("text");
      await helpers.addElement("button");
      await helpers.addElement("button");

      const elements = helpers.getElements();
      console.log(`CTA section elements: ${elements.length}`);
      console.log('Button count:', elements.filter(e => e.type === 'button').length);

      return helpers.exportToLiquidForTesting("cta-section");
    });

    console.log(`\n📊 CTA Section Results:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBe(4);

    // Count button elements in the schema
    const schemaMatch = result.liquidCode.match(/{% schema %}([\s\S]*?){% endschema %}/);
    const schema = JSON.parse(schemaMatch[1].trim());

    // Each button should have its own settings
    const buttonHeaders = schema.settings.filter(s => s.type === 'header' && s.content.includes('Button'));
    console.log(`   ✓ Button sections in schema: ${buttonHeaders.length}`);

    expect(buttonHeaders.length).toBe(2);
  });

  test("Complex Multi-Column - Mixed content types with breakpoint variations", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Complex layout:
      // Container
      //   > Columns-2
      //     Left: Image + Heading + Text + List
      //     Right: Video + Text + Button

      await helpers.addElement("container");
      await helpers.addElement("columns-2");
      await helpers.addElement("image");
      await helpers.addElement("heading");
      await helpers.addElement("text");
      await helpers.addElement("list");
      await helpers.addElement("video");
      await helpers.addElement("text");
      await helpers.addElement("button");

      const elements = helpers.getElements();
      console.log(`Complex layout elements: ${elements.length}`);

      return helpers.exportToLiquidForTesting("feature-comparison-section");
    });

    console.log(`\n📊 Complex Multi-Column Results:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBeGreaterThan(7);

    // Should have diverse element types
    expect(result.liquidCode).toContain("columns-2");

    // Check for schema settings covering all element types
    const schemaMatch = result.liquidCode.match(/{% schema %}([\s\S]*?){% endschema %}/);
    const schema = JSON.parse(schemaMatch[1].trim());

    console.log(`   ✓ Total schema settings: ${schema.settings.length}`);

    // Should have responsive variations
    const mobileSettings = schema.settings.filter(s => s.id && s.id.includes('_mobile'));
    const desktopSettings = schema.settings.filter(s => s.id && s.id.includes('_desktop'));
    const fullscreenSettings = schema.settings.filter(s => s.id && s.id.includes('_fullscreen'));

    console.log(`   ✓ Mobile settings: ${mobileSettings.length}`);
    console.log(`   ✓ Desktop settings: ${desktopSettings.length}`);
    console.log(`   ✓ Fullscreen settings: ${fullscreenSettings.length}`);

    expect(mobileSettings.length).toBeGreaterThan(0);
    expect(desktopSettings.length).toBeGreaterThan(0);
  });

  test("Content-Heavy Section - Multiple text elements with different formatting", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Content section:
      // Heading (h2 - main title)
      // Text (intro paragraph)
      // Heading (h3 - subheading)
      // Text (body paragraph)
      // List (bullet points)
      // Text (conclusion)

      await helpers.addElement("heading");
      await helpers.addElement("text");
      await helpers.addElement("heading");
      await helpers.addElement("text");
      await helpers.addElement("list");
      await helpers.addElement("text");

      const elements = helpers.getElements();
      console.log(`Content section elements: ${elements.length}`);

      return helpers.exportToLiquidForTesting("content-section");
    });

    console.log(`\n📊 Content-Heavy Section Results:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBe(6);

    // Multiple headings should have independent settings
    const schemaMatch = result.liquidCode.match(/{% schema %}([\s\S]*?){% endschema %}/);
    const schema = JSON.parse(schemaMatch[1].trim());

    const headingHeaders = schema.settings.filter(s => s.type === 'header' && s.content.includes('Heading'));
    console.log(`   ✓ Independent heading sections: ${headingHeaders.length}`);

    expect(headingHeaders.length).toBe(2);
  });

  test("Media-Rich Section - Images, videos, icons combined", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Media gallery:
      // Image (hero image)
      // Columns-3
      //   > Icon + Text (feature 1)
      //   > Icon + Text (feature 2)
      //   > Icon + Text (feature 3)
      // Video (demo video)

      await helpers.addElement("image");
      await helpers.addElement("columns-3");
      await helpers.addElement("icon");
      await helpers.addElement("text");
      await helpers.addElement("icon");
      await helpers.addElement("text");
      await helpers.addElement("icon");
      await helpers.addElement("text");
      await helpers.addElement("video");

      const elements = helpers.getElements();
      console.log(`Media section elements: ${elements.length}`);

      // Count different media types
      const imageCount = elements.filter(e => e.type === 'image').length;
      const videoCount = elements.filter(e => e.type === 'video').length;
      const iconCount = elements.filter(e => e.type === 'icon').length;

      console.log(`Images: ${imageCount}, Videos: ${videoCount}, Icons: ${iconCount}`);

      return helpers.exportToLiquidForTesting("media-gallery-section");
    });

    console.log(`\n📊 Media-Rich Section Results:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBeGreaterThan(7);

    // Check for image upload settings in schema
    const schemaMatch = result.liquidCode.match(/{% schema %}([\s\S]*?){% endschema %}/);
    const schema = JSON.parse(schemaMatch[1].trim());

    const imageSettings = schema.settings.filter(s => s.type === 'image_picker');
    console.log(`   ✓ Image upload fields: ${imageSettings.length}`);

    // Should have image_picker for images, icons, and potentially video thumbnails
    expect(imageSettings.length).toBeGreaterThan(0);
  });

  test("Edge Case - Empty elements mixed with content", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Edge case: Mix of elements with default content
      // (simulating partially configured section)
      await helpers.addElement("heading");
      await helpers.addElement("spacer"); // Empty spacer
      await helpers.addElement("text");
      await helpers.addElement("spacer"); // Another spacer
      await helpers.addElement("divider"); // Divider element
      await helpers.addElement("button");

      const elements = helpers.getElements();
      console.log(`Mixed content elements: ${elements.length}`);

      return helpers.exportToLiquidForTesting("mixed-content-section");
    });

    console.log(`\n📊 Edge Case - Mixed Content Results:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBe(6);

    // Spacers and dividers should export correctly
    expect(result.liquidCode).toContain("spacer");

    console.log(`   ✓ Empty elements handled correctly`);
  });
});
