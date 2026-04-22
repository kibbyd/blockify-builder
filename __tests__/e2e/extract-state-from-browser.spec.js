/**
 * Extract state directly from the browser
 */

const { test } = require('@playwright/test');
const fs = require('fs');

test('Extract state from open browser', async ({ page }) => {
  console.log('\n📡 Connecting to your browser...');

  // Navigate to the page
  await page.goto('http://localhost:3000/builder', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('✅ Connected');

  // Extract state from React Fiber
  const state = await page.evaluate(() => {
    // First try localStorage
    let elementsStr = localStorage.getItem('blockify_builder_elements');
    let responsiveStylesStr = localStorage.getItem('blockify_builder_responsive_styles');

    // If localStorage is empty, extract from React state
    if (!elementsStr) {
      console.log('LocalStorage empty, trying React Fiber...');

      const canvas = document.querySelector('.canvas');
      if (canvas) {
        const fiberKey = Object.keys(canvas).find(key =>
          key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
        );

        if (fiberKey) {
          let fiber = canvas[fiberKey];
          let depth = 0;
          const maxDepth = 50;

          while (fiber && depth < maxDepth) {
            if (fiber.memoizedState?.elements) {
              console.log('Found elements in React state!');
              elementsStr = JSON.stringify(fiber.memoizedState.elements);
              responsiveStylesStr = JSON.stringify(fiber.memoizedState.responsiveStyles || {});
              break;
            }
            fiber = fiber.return;
            depth++;
          }
        }
      }
    }

    return {
      elements: elementsStr,
      responsiveStyles: responsiveStylesStr,
      license: 'TEST-LICENSE-KEY',
      licenseExpires: new Date(Date.now() + 30*24*60*60*1000).toISOString()
    };
  });

  console.log('\n📊 State extracted:');
  console.log('   Has elements:', !!state.elements);
  console.log('   Has responsive styles:', !!state.responsiveStyles);

  if (state.elements) {
    const elements = JSON.parse(state.elements);
    console.log('   Elements count:', elements.length);
    console.log('   Element types:', elements.map(el => el.type).join(', '));
  } else {
    console.log('   ⚠️  No elements found');
  }

  // Save to file
  const outputPath = 'tests/e2e/saved-state.json';
  fs.writeFileSync(outputPath, JSON.stringify(state, null, 2));

  console.log(`\n✅ State saved to ${outputPath}`);

  // Also log the full state
  console.log('\n📋 Full state:');
  console.log(JSON.stringify(state, null, 2));
});
