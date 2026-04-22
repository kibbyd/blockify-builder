/**
 * MANUAL TEST - Align Items
 * Opens browser and pauses for manual testing
 */

const { test } = require('@playwright/test');

test.describe('Manual Align Items Test', () => {

  test('Open builder for manual testing', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes

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

    // Add container with heading
    await page.evaluate(async () => {
      await window.blockifyTestHelpers.clearCanvas();
      await new Promise(r => setTimeout(r, 300));
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 500));

      const elements = window.blockifyTestHelpers.getElements();
      await window.blockifyTestHelpers.addChildElement(elements[0].id, 'heading');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(2000);

    console.log('\n🔍 Browser is ready for manual testing');
    console.log('   1. Click on the container (blue dashed border)');
    console.log('   2. Enable "Align Items" checkbox');
    console.log('   3. Click "center" button');
    console.log('   4. Observe what happens to the heading text\n');

    // Pause for manual interaction
    await page.pause();
  });

});
