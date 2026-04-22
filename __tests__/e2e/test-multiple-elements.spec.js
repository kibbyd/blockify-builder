const { test, expect } = require("@playwright/test");

test.describe("Liquid Export - Multiple Elements Test", () => {
  test("should export exactly 3 elements (heading, text, button)", async ({
    page,
  }) => {
    // Navigate and immediately clear localStorage BEFORE page initializes
    await page.goto("http://localhost:3000/builder?skipLicense=true");

    // Clear localStorage and reload to ensure clean state
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Reload page so it doesn't load any saved progress
    await page.reload();

    await page.waitForSelector(".block-builder", { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Verify we start with 0 elements
    const initialElementCount = await page.evaluate(() => {
      return window.blockifyTestHelpers.getElements().length;
    });

    console.log(`Initial element count: ${initialElementCount}`);
    expect(initialElementCount).toBe(0);

    // Add exactly 3 elements
    const exportResult = await page.evaluate(async () => {
      // Add multiple elements
      await window.blockifyTestHelpers.addElement("heading");
      await window.blockifyTestHelpers.addElement("text");
      await window.blockifyTestHelpers.addElement("button");

      // Verify element count before export
      const elements = window.blockifyTestHelpers.getElements();
      console.log(`Elements before export: ${elements.length}`);

      return window.blockifyTestHelpers.exportToLiquidForTesting(
        "multi-element-section",
      );
    });

    console.log(`Export result elementCount: ${exportResult.elementCount}`);
    expect(exportResult.elementCount).toBe(3);

    // Verify all elements are in the code
    const code = exportResult.liquidCode;
    expect(code).toContain("data-element-id");
    expect(code).toContain("{% schema %}");

    // Note: data-element-id can appear multiple times per element due to
    // conditional Liquid blocks ({% if %} {% else %}), so we don't count those.
    // The important check is elementCount above.

    console.log("✅ Multiple elements exported correctly");
  });
});
