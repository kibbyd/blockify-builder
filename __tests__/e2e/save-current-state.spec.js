/**
 * Save Current Canvas State
 * Run this while your browser has the elements on canvas
 */

const { test } = require('@playwright/test');
const fs = require('fs');

test('Save current canvas state', async ({ page }) => {
  console.log('\n📸 Capturing current canvas state...');

  // Connect to your browser
  await page.goto('http://localhost:3000/builder');
  await page.waitForTimeout(2000);

  // Extract state from localStorage
  const state = await page.evaluate(() => {
    return {
      elements: localStorage.getItem('blockify_builder_elements'),
      responsiveStyles: localStorage.getItem('blockify_builder_responsive_styles'),
      license: localStorage.getItem('blockify_builder_license'),
      licenseExpires: localStorage.getItem('blockify_builder_license_expires')
    };
  });

  console.log('State captured:', {
    hasElements: !!state.elements,
    hasResponsiveStyles: !!state.responsiveStyles,
    hasLicense: !!state.license
  });

  if (state.elements) {
    const elements = JSON.parse(state.elements);
    console.log(`Elements count: ${elements.length}`);
    console.log('Element types:', elements.map(el => el.type));
  }

  // Save to file
  fs.writeFileSync(
    'tests/e2e/saved-state.json',
    JSON.stringify(state, null, 2)
  );

  console.log('✅ State saved to tests/e2e/saved-state.json');
  console.log('✅ You can now run automated tests!');
});
