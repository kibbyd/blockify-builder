/**
 * TEST: FlexDirection Fix - Checkbox Interaction
 * Tests clicking the Direction checkbox to reveal controls, then changing direction
 */

const { test, expect } = require('@playwright/test');

test.describe('FlexDirection Checkbox Interaction', () => {

  test('Check Direction checkbox and change flexDirection', async ({ page }) => {
    test.setTimeout(120000);

    console.log('\n' + '='.repeat(80));
    console.log('🔍 TESTING DIRECTION CHECKBOX → COLUMN BUTTON');
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

    // Add Container + Columns
    console.log('\n📋 Step 1: Add Container + 2 Columns');
    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    await page.evaluate(async () => {
      return await window.blockifyTestHelpers.setupContainerWithColumns(2);
    });

    await page.waitForTimeout(1000);

    // Select CONTAINER (not columns) to change direction of columns inside it
    console.log('\n📋 Step 2: Select Container Element');
    const containerEl = page.locator('.responsive-container').first();
    await containerEl.click();
    await page.waitForTimeout(1500);

    // Get initial flexDirection of the container
    const beforeStyle = await containerEl.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log(`   Container flexDirection: "${beforeStyle}"`);

    await page.screenshot({ path: 'test-results/checkbox-01-before.png', fullPage: true });

    // Find Direction checkbox - it should be next to the text "Direction"
    console.log('\n📋 Step 3: Find and Click Direction Checkbox');

    // Try multiple strategies to find the checkbox
    let directionCheckbox = null;

    // Strategy 1: Find checkbox by label text
    const directionLabel = page.locator('label').filter({ hasText: 'Direction' }).first();
    if (await directionLabel.isVisible({ timeout: 2000 })) {
      console.log('   ✅ Found Direction label');

      // The checkbox should be inside or near this label
      directionCheckbox = directionLabel.locator('input[type="checkbox"]').first();

      if (!await directionCheckbox.isVisible({ timeout: 1000 })) {
        // Try finding checkbox as sibling
        const labelBox = await directionLabel.boundingBox();
        if (labelBox) {
          console.log(`   Label position: x=${labelBox.x}, y=${labelBox.y}`);
          // Click near the label to toggle checkbox
          await directionLabel.click({ position: { x: 10, y: 10 } });
          console.log('   Clicked Direction label area');
          await page.waitForTimeout(1000);
        }
      } else {
        await directionCheckbox.check();
        console.log('   ✅ Checked Direction checkbox');
        await page.waitForTimeout(1000);
      }
    }

    await page.screenshot({ path: 'test-results/checkbox-02-after-click.png', fullPage: true });

    // Strategy 2: Look for ALL checkboxes and find the one near "Direction" text
    console.log('\n📋 Step 4: Search for Direction Controls');

    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    console.log(`   Total checkboxes found: ${allCheckboxes.length}`);

    for (let i = 0; i < allCheckboxes.length; i++) {
      const checkbox = allCheckboxes[i];
      const isChecked = await checkbox.isChecked();
      const parentText = await checkbox.evaluate(el => {
        const parent = el.closest('label') || el.parentElement;
        return parent ? parent.textContent : '';
      });
      console.log(`   Checkbox ${i}: checked=${isChecked}, nearText="${parentText.substring(0, 50)}"`);

      if (parentText.includes('Direction') && parentText.includes('Responsive')) {
        console.log(`   ✅ Found Direction checkbox at index ${i}`);
        if (!isChecked) {
          await checkbox.check();
          console.log('   ✅ Checked it!');
          await page.waitForTimeout(1500);
          break;
        }
      }
    }

    await page.screenshot({ path: 'test-results/checkbox-03-expanded.png', fullPage: true });

    // Step 5: Now look for the column button (down arrow ↓)
    console.log('\n📋 Step 5: Find Column Direction Button');

    const allButtons = await page.locator('button').all();
    console.log(`   Total buttons visible: ${allButtons.length}`);

    let foundColumnBtn = false;
    for (const btn of allButtons) {
      const text = await btn.textContent().catch(() => '');
      const value = await btn.getAttribute('value').catch(() => '');
      const classes = await btn.getAttribute('class').catch(() => '');

      // Direction buttons use arrow symbols: → (row), ↓ (column), ← (row-reverse), ↑ (column-reverse)
      if (text === '↓') {
        console.log('   ✅ FOUND COLUMN BUTTON (↓ down arrow)!');
        await btn.click();
        console.log('   ✅ Clicked column direction button!');
        foundColumnBtn = true;
        await page.waitForTimeout(2000);
        break;
      }
    }

    await page.screenshot({ path: 'test-results/checkbox-04-after-column.png', fullPage: true });

    // Step 6: Verify flexDirection changed on CONTAINER
    console.log('\n📋 Step 6: Verify Container FlexDirection Changed');

    const afterStyle = await containerEl.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log(`   After clicking: flexDirection="${afterStyle}"`);

    if (foundColumnBtn) {
      if (beforeStyle !== afterStyle) {
        console.log('\n' + '='.repeat(80));
        console.log('✅ SUCCESS! Container FlexDirection CHANGED!');
        console.log(`   From: "${beforeStyle}"`);
        console.log(`   To:   "${afterStyle}"`);
        console.log('✅ THE BUG IS FIXED! 🎉🎉🎉');
        console.log('='.repeat(80));
      } else {
        console.log('\n' + '='.repeat(80));
        console.log(`❌ FAILED: Container flexDirection did not change (still "${afterStyle}")`);
        console.log('='.repeat(80));
      }
    } else {
      console.log('\n' + '='.repeat(80));
      console.log('⚠️  Could not find column button after expanding checkbox');
      console.log('='.repeat(80));
    }

    await page.screenshot({ path: 'test-results/checkbox-05-final.png', fullPage: true });

    console.log('\n📁 Screenshots saved to test-results/checkbox-*.png\n');

    await page.waitForTimeout(2000);
  });

});
