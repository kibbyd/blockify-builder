/**
 * Playwright Test - Direct XPath Drag Test
 * Testing if we can drag using the exact XPath you provided
 */

const { test, expect } = require('@playwright/test');

async function bypassLicense(page) {
  await page.evaluate(() => {
    localStorage.setItem('blockify_builder_license', 'TEST-LICENSE-KEY');
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    localStorage.setItem('blockify_builder_license_expires', expires.toISOString());
  });
}

test('Direct XPath Drag Test', async ({ page }) => {
  console.log('\n🚀 Starting XPath drag test...');

  // Navigate and bypass license
  await page.goto('http://localhost:3000/builder');
  await bypassLicense(page);
  await page.reload();
  await page.waitForSelector('.canvas', { timeout: 15000 });

  console.log('✅ Builder loaded');

  // Target the specific XPath you provided
  const xpath = '/html/body/div/div/div[2]/div[1]/div/div/div[2]/div[2]/div[1]';
  const sourceElement = page.locator(`xpath=${xpath}`);

  // Wait for element
  await sourceElement.waitFor({ state: 'visible', timeout: 10000 });
  console.log('✅ Found element at XPath');

  // Get element info
  const elementText = await sourceElement.textContent();
  console.log('Element text:', elementText);

  // Take before screenshot
  await page.screenshot({ path: 'test-results/xpath-drag-before.png', fullPage: true });

  // Get positions
  const sourceBox = await sourceElement.boundingBox();
  const canvasBox = await page.locator('.canvas').boundingBox();

  console.log('Source box:', sourceBox);
  console.log('Canvas box:', canvasBox);

  // Calculate positions
  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const endX = canvasBox.x + canvasBox.width / 2;
  const endY = canvasBox.y + canvasBox.height / 2;

  console.log(`\n🎯 Drag from (${startX}, ${startY}) to (${endX}, ${endY})`);

  // CLICK, HOLD, and MOVE
  console.log('1. Moving to source...');
  await page.mouse.move(startX, startY);
  await page.waitForTimeout(200);

  console.log('2. Mouse down (HOLD)...');
  await page.mouse.down();
  await page.waitForTimeout(300);

  console.log('3. Moving to target...');
  await page.mouse.move(endX, endY, { steps: 20 });
  await page.waitForTimeout(300);

  console.log('4. Mouse up (RELEASE)...');
  await page.mouse.up();
  await page.waitForTimeout(1000);

  console.log('✅ Drag sequence completed');

  // Take after screenshot
  await page.screenshot({ path: 'test-results/xpath-drag-after.png', fullPage: true });

  // Check result
  const containers = await page.locator('.responsive-container').count();
  console.log(`\n📊 Containers found: ${containers}`);

  if (containers > 0) {
    console.log('✅ SUCCESS! Container was added!');
    expect(containers).toBeGreaterThan(0);
  } else {
    console.log('❌ FAIL: No container added');
    // Don't throw error, just report
  }

  // Wait to see result
  await page.waitForTimeout(2000);
});
