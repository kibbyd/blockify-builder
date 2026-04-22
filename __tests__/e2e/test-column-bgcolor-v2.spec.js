const { test } = require('@playwright/test');

test('Find and click background color for columns-2', async ({ page }) => {
  test.setTimeout(300000);

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
  await page.waitForTimeout(2000);

  // Take initial screenshot
  await page.screenshot({ path: 'test-results/columns-initial.png', fullPage: true });
  console.log('📸 Initial screenshot');

  // Scroll down in the property panel to find Background Color
  const propertyPanel = page.locator('.property-panel, [class*="property"], [class*="panel"]').first();

  // Scroll down multiple times
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: 'test-results/columns-scrolled.png', fullPage: true });
  console.log('📸 After scrolling');

  // Pause for manual inspection
  await page.pause();
});
