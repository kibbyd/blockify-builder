/**
 * MANUAL OBSERVATION TEST
 * Opens browser and pauses for manual testing
 */

const { test } = require('@playwright/test');

test.describe('Manual Observation', () => {

  test('Add container and text, then wait for manual adjustments', async ({ page }) => {
    test.setTimeout(600000); // 10 minutes

    console.log('\n🔍 Opening browser for manual testing...');

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

    // Add container with text
    await page.evaluate(async () => {
      await window.blockifyTestHelpers.clearCanvas();
      await new Promise(r => setTimeout(r, 300));
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 500));

      const elements = window.blockifyTestHelpers.getElements();
      await window.blockifyTestHelpers.addChildElement(elements[0].id, 'text');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(2000);

    console.log('✅ Container and text added');
    console.log('⏸️  Pausing for manual interaction...');
    console.log('   Adjust the controls as needed');
    console.log('   Press Resume when ready to screenshot\n');

    // Pause for manual interaction
    await page.pause();

    // Take screenshot after resuming
    await page.screenshot({ path: 'test-results/manual-observation.png', fullPage: true });
    console.log('📸 Screenshot saved to test-results/manual-observation.png');
  });

});
