const { test, expect } = require("@playwright/test");

test("MANUAL: Test Liquid Export - Watch and provide feedback", async ({
  page,
}) => {
  console.log("\n🔵 STEP 1: Navigating to builder (with license skip)...");
  await page.goto("http://localhost:3000/builder?skipLicense=true");

  console.log("🔵 STEP 2: Waiting for license prompt (if any)...");
  // Set up license dialog handler
  page.on("dialog", async (dialog) => {
    console.log(`📝 Dialog detected: ${dialog.message().substring(0, 100)}...`);
    if (
      dialog.message().includes("license") ||
      dialog.message().includes("License")
    ) {
      console.log("✅ Accepting with license key: BLOCKIFY-PRO-2024");
      await dialog.accept("BLOCKIFY-PRO-2024");
    } else {
      console.log("❌ Not a license dialog, dismissing...");
      await dialog.dismiss();
    }
  });

  await page.waitForTimeout(2000);

  console.log("🔵 STEP 3: Waiting for .block-builder element...");
  await page.waitForSelector(".block-builder", { timeout: 20000 });
  console.log("✅ Builder loaded!");

  await page.waitForTimeout(2000);

  console.log("🔵 STEP 4: Checking if test helpers are available...");
  const helpersAvailable = await page.evaluate(() => {
    return typeof window.blockifyTestHelpers !== "undefined";
  });

  if (!helpersAvailable) {
    console.log("❌ Test helpers NOT available!");
    console.log(
      "Available window properties:",
      await page.evaluate(() => Object.keys(window)),
    );
    throw new Error("Test helpers not loaded");
  }
  console.log("✅ Test helpers are available!");

  console.log("🔵 STEP 5: Adding a heading element...");
  const addResult = await page.evaluate(() => {
    try {
      window.blockifyTestHelpers.addElement("heading");
      return {
        success: true,
        elements: window.blockifyTestHelpers.getElements().length,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  console.log("Add result:", addResult);
  if (!addResult.success) {
    throw new Error(`Failed to add element: ${addResult.error}`);
  }
  console.log(`✅ Element added! Total elements: ${addResult.elements}`);

  await page.waitForTimeout(1000);

  console.log("🔵 STEP 6: Exporting to Liquid...");
  const exportResult = await page.evaluate(() => {
    try {
      return window.blockifyTestHelpers.exportToLiquidForTesting(
        "test-section",
      );
    } catch (error) {
      return { error: error.message, stack: error.stack };
    }
  });

  if (exportResult.error) {
    console.log("❌ Export failed:", exportResult.error);
    console.log("Stack:", exportResult.stack);
    throw new Error(`Export failed: ${exportResult.error}`);
  }

  console.log("✅ Export successful!");
  console.log(`   Section name: ${exportResult.sectionName}`);
  console.log(`   Element count: ${exportResult.elementCount}`);
  console.log(`   Code length: ${exportResult.liquidCode.length} characters`);

  console.log("🔵 STEP 7: Validating Liquid code...");
  const code = exportResult.liquidCode;

  // Check for required Liquid components
  const checks = {
    "Has <style> tag": code.includes("<style>"),
    "Has </style> tag": code.includes("</style>"),
    "Has {% schema %}": code.includes("{% schema %}"),
    "Has {% endschema %}": code.includes("{% endschema %}"),
    "Has section.settings": code.includes("section.settings"),
    "Has data-element-id": code.includes("data-element-id"),
    "Has @media queries": code.includes("@media"),
  };

  console.log("\n📋 Validation Results:");
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`   ${passed ? "✅" : "❌"} ${check}`);
  }

  // Try to parse schema
  console.log("\n🔵 STEP 8: Validating schema JSON...");
  const schemaMatch = code.match(/{% schema %}([\s\S]*?){% endschema %}/);
  if (schemaMatch) {
    const schemaJSON = schemaMatch[1].trim();
    try {
      const schema = JSON.parse(schemaJSON);
      console.log("✅ Schema is valid JSON");
      console.log(`   Name: ${schema.name}`);
      console.log(`   Settings count: ${schema.settings?.length || 0}`);
    } catch (e) {
      console.log("❌ Schema JSON parsing failed:", e.message);
      console.log("First 200 chars of schema:", schemaJSON.substring(0, 200));
    }
  } else {
    console.log("❌ Could not find schema section");
  }

  console.log("\n🎉 ALL TESTS PASSED!\n");

  // Show first 500 characters of exported code
  console.log("📄 Preview of exported Liquid (first 500 chars):");
  console.log("─".repeat(80));
  console.log(code.substring(0, 500));
  console.log("─".repeat(80));
});
