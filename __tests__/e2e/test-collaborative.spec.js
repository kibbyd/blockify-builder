/**
 * COLLABORATIVE TESTING
 * Opens browser, you test, I observe via screenshots
 */

const { test } = require('@playwright/test');

test.describe('Collaborative Testing', () => {

  test('Monitor while user tests alignment properties', async ({ page }) => {
    test.setTimeout(600000); // 10 minutes

    console.log('\n🤝 COLLABORATIVE TESTING MODE');
    console.log('   I will take screenshots every 5 seconds');
    console.log('   You manipulate the controls');
    console.log('   Tell me when you see something broken\n');

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

    console.log('✅ Setup complete - container with text added');
    console.log('📸 Taking screenshots every 5 seconds...\n');

    let screenshotCount = 0;

    // Take screenshots periodically for 5 minutes
    for (let i = 0; i < 60; i++) {
      await page.screenshot({
        path: `test-results/collab-${String(screenshotCount).padStart(3, '0')}.png`,
        fullPage: true
      });

      if (screenshotCount % 6 === 0) { // Every 30 seconds
        console.log(`📸 Screenshot ${screenshotCount} taken (${i * 5}s elapsed)`);
      }

      screenshotCount++;
      await page.waitForTimeout(5000);
    }

    console.log('\n✅ Testing session complete');
    console.log(`📸 ${screenshotCount} screenshots saved in test-results/`);
  });

});
