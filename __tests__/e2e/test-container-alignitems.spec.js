/**
 * CONTAINER ALIGN ITEMS TEST
 * Test what happens when alignItems is set on a container with a heading child
 */

const { test } = require('@playwright/test');

test.describe('Container Align Items Test', () => {

  test('Set alignItems center on container and observe heading position', async ({ page }) => {
    test.setTimeout(60000);

    console.log('\n🎯 CONTAINER ALIGN ITEMS TEST');

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

    console.log('\n1️⃣ Initial state - before setting alignItems...');

    // Get initial heading position
    const heading = page.locator('.canvas h1, .canvas h2, .canvas h3').first();
    const container = page.locator('.canvas > div').first();

    const initialState = await page.evaluate(() => {
      const heading = document.querySelector('.canvas h1, .canvas h2, .canvas h3');
      const container = document.querySelector('.canvas > div');
      const headingRect = heading.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const containerStyles = window.getComputedStyle(container);

      return {
        containerAlignItems: containerStyles.alignItems,
        containerFlexDirection: containerStyles.flexDirection,
        containerDisplay: containerStyles.display,
        containerHeight: containerRect.height,
        headingTop: headingRect.top,
        headingHeight: headingRect.height,
        headingOffsetFromContainer: headingRect.top - containerRect.top
      };
    });

    console.log(`   Container alignItems: ${initialState.containerAlignItems}`);
    console.log(`   Container flexDirection: ${initialState.containerFlexDirection}`);
    console.log(`   Container display: ${initialState.containerDisplay}`);
    console.log(`   Container height: ${initialState.containerHeight}px`);
    console.log(`   Heading offset from container top: ${initialState.headingOffsetFromContainer}px`);

    await page.screenshot({ path: 'test-results/container-alignitems-01-before.png', fullPage: true });

    console.log('\n2️⃣ Selecting container...');

    // Click directly on container div - use force to bypass interception
    await container.click({ force: true });
    await page.waitForTimeout(1500);

    // Verify we're showing container properties
    const panelTitle = await page.locator('.property-panel').textContent();
    console.log(`   Property panel shows: ${panelTitle.includes('Container') ? 'Container ✅' : 'NOT Container ❌'}`);

    await page.screenshot({ path: 'test-results/container-alignitems-02-selected.png', fullPage: true });

    console.log('\n3️⃣ Enabling Align Items and setting to center...');

    // Enable Align Items checkbox
    await page.locator('input[type="checkbox"]').evaluateAll((checkboxes) => {
      for (const cb of checkboxes) {
        const label = cb.closest('label') || cb.parentElement;
        if (label && label.textContent.includes('Align Items')) {
          if (!cb.checked) {
            cb.click();
          }
        }
      }
    });

    await page.waitForTimeout(1000);

    // Click center button
    const centerBtn = page.locator('button[title="center"]');
    if (await centerBtn.isVisible({ timeout: 2000 })) {
      await centerBtn.click();
      await page.waitForTimeout(1500);
    } else {
      console.log('   ❌ Center button not found');
    }

    await page.screenshot({ path: 'test-results/container-alignitems-03-after.png', fullPage: true });

    console.log('\n4️⃣ After setting alignItems center...');

    const afterState = await page.evaluate(() => {
      const heading = document.querySelector('.canvas h1, .canvas h2, .canvas h3');
      const container = document.querySelector('.canvas > div');
      const headingRect = heading.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const containerStyles = window.getComputedStyle(container);

      return {
        containerAlignItems: containerStyles.alignItems,
        containerFlexDirection: containerStyles.flexDirection,
        containerDisplay: containerStyles.display,
        containerHeight: containerRect.height,
        headingTop: headingRect.top,
        headingHeight: headingRect.height,
        headingOffsetFromContainer: headingRect.top - containerRect.top
      };
    });

    console.log(`   Container alignItems: ${afterState.containerAlignItems}`);
    console.log(`   Container height: ${afterState.containerHeight}px`);
    console.log(`   Heading offset from container top: ${afterState.headingOffsetFromContainer}px`);

    // Calculate if heading is centered vertically
    const expectedOffset = (afterState.containerHeight - afterState.headingHeight) / 2;
    console.log(`   Expected offset for vertical centering: ${expectedOffset}px`);

    if (afterState.containerAlignItems === 'center') {
      console.log('   ✅ alignItems CSS is set to center');
    } else {
      console.log(`   ❌ alignItems CSS is NOT center (it's: ${afterState.containerAlignItems})`);
    }

    // Check if heading moved
    const positionChanged = Math.abs(afterState.headingOffsetFromContainer - initialState.headingOffsetFromContainer) > 1;
    if (positionChanged) {
      console.log(`   📍 Heading position CHANGED by ${afterState.headingOffsetFromContainer - initialState.headingOffsetFromContainer}px`);
    } else {
      console.log('   📍 Heading position DID NOT CHANGE');
    }

    console.log('\n✅ Test complete\n');
  });

});
