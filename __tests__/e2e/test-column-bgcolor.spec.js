const { test } = require('@playwright/test');

test('Test column background color checkbox', async ({ page }) => {
  test.setTimeout(120000);

  // Setup
  await page.goto('http://localhost:3000/builder');
  await page.evaluate(() => {
    localStorage.setItem('blockify_builder_license', 'TEST-LICENSE-KEY');
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    localStorage.setItem('blockify_builder_license_expires', expires.toISOString());
  });
  await page.reload();
  await page.waitForSelector('.canvas', { timeout: 15000 });
  await page.waitForFunction(() => typeof window.blockifyTestHelpers !== 'undefined');

  // Add a columns-2 element
  await page.evaluate(async () => {
    await window.blockifyTestHelpers.clearCanvas();
    await new Promise(r => setTimeout(r, 300));
    await window.blockifyTestHelpers.addElement('columns-2');
    await new Promise(r => setTimeout(r, 500));
  });

  console.log('✅ Added columns-2 element');

  // Click on the first column to select it
  await page.waitForTimeout(1000);
  const column = await page.locator('[data-element-id]').first();
  await column.click();
  await page.waitForTimeout(1000);

  console.log('✅ Clicked on column element');

  // Take screenshot of property panel
  await page.screenshot({ path: 'test-results/column-before-bgcolor.png', fullPage: true });
  console.log('📸 Screenshot before clicking checkbox');

  // Try to find and click the Background Color checkbox
  const bgColorCheckbox = await page.locator('input[type="checkbox"]').filter({ hasText: /Background Color/i }).first();

  if (await bgColorCheckbox.count() > 0) {
    console.log('✅ Found Background Color checkbox');
    await bgColorCheckbox.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/column-after-bgcolor.png', fullPage: true });
    console.log('📸 Screenshot after clicking checkbox');
  } else {
    console.log('❌ Could not find Background Color checkbox');

    // List all checkboxes
    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    console.log(`Found ${allCheckboxes.length} total checkboxes`);
  }

  // Pause to inspect
  await page.pause();
});
