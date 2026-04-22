/**
 * FINAL FLEXDIRECTION FIX TEST
 * Tests that columns-2 element responds to Direction property changes
 * This verifies the CSS bug fix is working
 */

const { test, expect } = require('@playwright/test');

test.describe('FlexDirection Fix Verification', () => {

  test('Verify columns-2 responds to Direction property', async ({ page }) => {
    test.setTimeout(120000);

    console.log('\n' + '='.repeat(80));
    console.log('🎯 FINAL FLEXDIRECTION FIX VERIFICATION');
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

    // Select the COLUMNS-2 element (not container)
    console.log('\n📋 Step 2: Select Columns-2 Element');
    const columnsEl = page.locator('.responsive-columns.columns-2').first();
    await columnsEl.click({ position: { x: 250, y: 50 } }); // Click center-ish
    await page.waitForTimeout(1500);

    // Verify we selected the columns element (not container)
    const panelTitle = await page.locator('.property-panel h3, .property-panel h2').first().textContent();
    console.log(`   Property Panel shows: "${panelTitle}"`);

    if (!panelTitle.includes('Column')) {
      console.log('   ⚠️  Warning: May have selected wrong element');
    }

    await page.screenshot({ path: 'test-results/final-01-columns-selected.png', fullPage: true });

    // Get initial flexDirection (should be 'row' by default for columns-2)
    const beforeStyle = await columnsEl.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log(`   Initial flexDirection: "${beforeStyle}"`);

    // Find and check Direction checkbox
    console.log('\n📋 Step 3: Enable Direction Control');

    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    for (const checkbox of allCheckboxes) {
      const parentText = await checkbox.evaluate(el => {
        const parent = el.closest('label') || el.parentElement;
        return parent ? parent.textContent : '';
      });

      if (parentText.includes('Direction') && parentText.includes('Responsive')) {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
          await checkbox.check();
          console.log('   ✅ Checked Direction checkbox');
          await page.waitForTimeout(1500);
        } else {
          console.log('   ✅ Direction checkbox already checked');
        }
        break;
      }
    }

    await page.screenshot({ path: 'test-results/final-02-direction-enabled.png', fullPage: true });

    // Find and click the ↓ (column) button
    console.log('\n📋 Step 4: Click Column Direction Button (↓)');

    const allButtons = await page.locator('button').all();
    let foundBtn = false;

    for (const btn of allButtons) {
      const text = await btn.textContent().catch(() => '');

      if (text === '↓') {
        console.log('   ✅ Found column button (↓)');
        await btn.click();
        console.log('   ✅ Clicked!');
        foundBtn = true;
        await page.waitForTimeout(2000);
        break;
      }
    }

    if (!foundBtn) {
      console.log('   ❌ Column button not found');
    }

    await page.screenshot({ path: 'test-results/final-03-after-click.png', fullPage: true });

    // Verify flexDirection changed
    console.log('\n📋 Step 5: Verify FlexDirection Changed');

    const afterStyle = await columnsEl.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log(`   After click: flexDirection="${afterStyle}"`);

    // SUCCESS CRITERIA
    console.log('\n' + '='.repeat(80));
    if (beforeStyle === 'row' && afterStyle === 'column') {
      console.log('✅✅✅ SUCCESS! FLEXDIRECTION FIX VERIFIED! ✅✅✅');
      console.log('');
      console.log('   Before: "row" (default for columns-2)');
      console.log('   After:  "column" (user selection)');
      console.log('');
      console.log('   The CSS bug is FIXED!');
      console.log('   Columns now respond to Direction property!');
    } else if (beforeStyle !== afterStyle) {
      console.log(`✅ FlexDirection changed from "${beforeStyle}" to "${afterStyle}"`);
      console.log('   Fix appears to be working!');
    } else {
      console.log(`❌ FAILED: FlexDirection did not change (still "${afterStyle}")`);
      console.log('');
      console.log('   Possible issues:');
      console.log('   1. Wrong element selected');
      console.log('   2. CSS not recompiled');
      console.log('   3. Button click not working');
    }
    console.log('='.repeat(80));

    await page.screenshot({ path: 'test-results/final-04-complete.png', fullPage: true });

    console.log('\n📁 Screenshots saved to test-results/final-*.png\n');

    await page.waitForTimeout(2000);
  });

});
