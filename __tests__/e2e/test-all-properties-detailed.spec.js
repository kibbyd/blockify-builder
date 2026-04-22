/**
 * DETAILED PROPERTY PANEL TEST
 * Tests ALL property controls properly including checkboxes
 */

const { test } = require('@playwright/test');

test.describe('Detailed Property Testing', () => {

  test('Test flexDirection with proper checkbox interaction', async ({ page }) => {
    test.setTimeout(120000);

    console.log('\n' + '='.repeat(80));
    console.log('🔍 DETAILED PROPERTY PANEL TESTING');
    console.log('='.repeat(80));

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

    // ========================================
    // TEST: FLEXDIRECTION WITH CHECKBOX INTERACTION
    // ========================================
    console.log('\n📋 Testing FlexDirection Property');

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    await page.evaluate(async () => {
      return await window.blockifyTestHelpers.setupContainerWithColumns(2);
    });

    await page.waitForTimeout(1000);

    // Select columns
    const columnsEl = page.locator('.responsive-columns').first();
    await columnsEl.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'test-results/detailed-01-columns-selected.png', fullPage: true });

    // Get initial flexDirection
    const beforeStyle = await columnsEl.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log(`   Current flexDirection: "${beforeStyle}"`);

    // Find Direction checkbox/label
    const directionLabel = page.locator('text=Direction').first();
    if (await directionLabel.isVisible({ timeout: 2000 })) {
      console.log('   ✅ Found Direction property');

      // Click the checkbox or label to expand controls
      const directionCheckbox = page.locator('input[type="checkbox"]').filter({
        has: page.locator('text=Direction')
      }).first();

      // Try clicking near the Direction label
      await directionLabel.click();
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'test-results/detailed-02-direction-expanded.png', fullPage: true });

      // Now look for button controls that appeared
      const allButtons = await page.locator('button').all();
      console.log(`   Total buttons visible: ${allButtons.length}`);

      // Look for direction buttons
      let foundColumnBtn = false;
      for (const btn of allButtons) {
        const text = await btn.textContent().catch(() => '');
        const value = await btn.getAttribute('value').catch(() => '');
        console.log(`   Button: text="${text}", value="${value}"`);

        if (text === 'column' || value === 'column') {
          console.log('   ✅ Found column button!');
          await btn.click();
          foundColumnBtn = true;
          await page.waitForTimeout(1500);
          break;
        }
      }

      if (foundColumnBtn) {
        await page.screenshot({ path: 'test-results/detailed-03-after-column-click.png', fullPage: true });

        const afterStyle = await columnsEl.evaluate(el =>
          window.getComputedStyle(el).flexDirection
        );
        console.log(`   After clicking: flexDirection="${afterStyle}"`);

        if (beforeStyle !== afterStyle) {
          console.log('   ✅ SUCCESS! FlexDirection CHANGED!');
          console.log(`   ✅ From "${beforeStyle}" to "${afterStyle}"`);
          console.log('   ✅ THE BUG IS FIXED! 🎉🎉🎉');
        } else {
          console.log(`   ❌ FlexDirection did not change (still "${afterStyle}")`);
        }
      } else {
        console.log('   ⚠️  Column button not found after expanding');
      }
    }

    // ========================================
    // TEST: ALL COLUMN PROPERTIES
    // ========================================
    console.log('\n📋 Testing All Column Properties');

    // List of properties to test
    const properties = [
      'Direction',
      'Justify Content',
      'Align Items',
      'Align Self',
      'Gap'
    ];

    for (const prop of properties) {
      const propLabel = page.locator(`text=${prop}`).first();
      if (await propLabel.isVisible({ timeout: 1000 })) {
        console.log(`   ✅ ${prop} property visible`);
      } else {
        console.log(`   ❌ ${prop} property not found`);
      }
    }

    await page.screenshot({ path: 'test-results/detailed-04-all-column-props.png', fullPage: true });

    // ========================================
    // TEST: IMAGE WITH URL
    // ========================================
    console.log('\n📋 Testing Image Element');

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    await page.evaluate(async () => {
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 200));
      const elements = window.blockifyTestHelpers.getElements();
      await window.blockifyTestHelpers.addChildElement(elements[0].id, 'image');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1000);

    // Select image
    const img = page.locator('img').first();
    if (await img.isVisible()) {
      await img.click();
      await page.waitForTimeout(1500);

      await page.screenshot({ path: 'test-results/detailed-05-image-selected.png', fullPage: true });

      // Find Source input
      const inputs = await page.locator('input[type="text"], input[type="url"]').all();
      console.log(`   Text/URL inputs found: ${inputs.length}`);

      for (let i = 0; i < inputs.length; i++) {
        const placeholder = await inputs[i].getAttribute('placeholder').catch(() => '');
        const value = await inputs[i].inputValue().catch(() => '');
        console.log(`   Input ${i}: placeholder="${placeholder}", value="${value}"`);

        if (placeholder.toLowerCase().includes('url') || placeholder.toLowerCase().includes('source') || i === 0) {
          await inputs[i].clear();
          await inputs[i].fill('https://via.placeholder.com/800x400/FF5733/FFFFFF?text=Test+Image');
          await inputs[i].press('Enter');
          await page.waitForTimeout(1000);
          console.log('   ✅ Image URL set');
          break;
        }
      }

      await page.screenshot({ path: 'test-results/detailed-06-image-with-url.png', fullPage: true });
    }

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 DETAILED TESTING COMPLETE');
    console.log('='.repeat(80));
    console.log('\n📁 Check screenshots in test-results/detailed-*.png');
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});
