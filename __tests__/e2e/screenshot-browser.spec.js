const { test } = require('@playwright/test');

test('Screenshot current browser state', async ({ page }) => {
  await page.goto('http://localhost:3000/builder');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'test-results/current-browser-state.png', fullPage: true });

  console.log('✅ Screenshot saved to test-results/current-browser-state.png');

  // Check what's on the page
  const containers = await page.locator('.responsive-container').count();
  const columns = await page.locator('.responsive-columns').count();

  console.log('Containers on page:', containers);
  console.log('Columns on page:', columns);
});
