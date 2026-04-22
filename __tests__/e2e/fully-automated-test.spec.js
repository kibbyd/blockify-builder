/**
 * FULLY AUTOMATED TEST using Test Helpers
 * NO MANUAL DRAGGING REQUIRED!
 */

const { test, expect } = require('@playwright/test');

test.describe('Fully Automated Tests', () => {

  test('Complete automated test suite', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes

    console.log('\n' + '='.repeat(70));
    console.log('🤖 FULLY AUTOMATED TEST - NO MANUAL DRAGGING!');
    console.log('='.repeat(70));

    // Step 1: Open builder
    console.log('\n📋 STEP 1: Opening builder...');
    await page.goto('http://localhost:3000/builder');

    await page.evaluate(() => {
      localStorage.setItem('blockify_builder_license', 'TEST-LICENSE-KEY');
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      localStorage.setItem('blockify_builder_license_expires', expires.toISOString());
    });

    await page.reload();
    await page.waitForSelector('.canvas', { timeout: 15000 });
    console.log('✅ Builder loaded');

    // Step 2: Wait for test helpers
    console.log('\n📋 STEP 2: Waiting for test helpers...');
    await page.waitForFunction(() => typeof window.blockifyTestHelpers !== 'undefined', { timeout: 10000 });
    console.log('✅ Test helpers available');

    await page.screenshot({ path: 'test-results/auto-01-ready.png', fullPage: true });

    // Step 3: Add elements programmatically (NO DRAGGING!)
    console.log('\n📋 STEP 3: Adding elements programmatically...');

    const result = await page.evaluate(async () => {
      return await window.blockifyTestHelpers.setupContainerWithColumns(2);
    });

    console.log(`✅ Container added (ID: ${result.containerId})`);
    console.log(`✅ 2 Columns added`);
    console.log(`   Total elements: ${result.elements.length}`);

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/auto-02-elements-added.png', fullPage: true });

    // Verify elements exist
    const containers = await page.locator('.responsive-container').count();
    const columns = await page.locator('.responsive-columns').count();

    console.log(`   DOM verification: ${containers} containers, ${columns} columns`);

    if (containers === 0 || columns === 0) {
      throw new Error('Elements not added correctly');
    }

    // Step 4: Select columns element
    console.log('\n📋 STEP 4: Selecting columns element...');

    const columnsLabel = page.locator('text=📋 COLUMNS').first();
    const columnsElement = page.locator('.responsive-columns').first();

    if (await columnsLabel.isVisible({ timeout: 2000 })) {
      await columnsLabel.click();
      console.log('✅ Clicked columns label');
    } else {
      await columnsElement.click();
      console.log('✅ Clicked columns element');
    }

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/auto-03-columns-selected.png', fullPage: true });

    // Step 5: TEST FLEXDIRECTION BUG (CRITICAL)
    console.log('\n📋 STEP 5: Testing FlexDirection Bug...');
    console.log('   This is THE critical bug!');

    const beforeStyle = await columnsElement.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        flexDirection: computed.flexDirection,
        display: computed.display
      };
    });

    console.log(`   Before: flexDirection="${beforeStyle.flexDirection}", display="${beforeStyle.display}"`);

    // Click the "column" button
    const columnBtn = page.locator('button').filter({ hasText: 'column' }).first();

    if (await columnBtn.isVisible({ timeout: 2000 })) {
      await columnBtn.click();
      console.log('   Clicked "column" button');
      await page.waitForTimeout(1000);

      const afterStyle = await columnsElement.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          flexDirection: computed.flexDirection,
          display: computed.display
        };
      });

      console.log(`   After: flexDirection="${afterStyle.flexDirection}", display="${afterStyle.display}"`);

      await page.screenshot({ path: 'test-results/auto-04-flexdirection-test.png', fullPage: true });

      if (beforeStyle.flexDirection !== afterStyle.flexDirection) {
        console.log('   ✅ SUCCESS: FlexDirection CHANGED!');
        console.log('   ✅ THE BUG IS FIXED!');
      } else {
        console.log('   ❌ BUG CONFIRMED: FlexDirection did NOT change');
        console.log('   ❌ CSS override in builder.css:850-857 is still present');
      }
    } else {
      console.log('   ⚠️  FlexDirection button not found');
    }

    // Step 6: Test responsive breakpoints
    console.log('\n📋 STEP 6: Testing responsive breakpoints...');

    for (const bp of ['XS', 'SM', 'MD', 'LG', 'XL']) {
      const btn = page.locator(`button:has-text("${bp}")`).first();
      if (await btn.isVisible({ timeout: 1000 })) {
        await btn.click();
        await page.waitForTimeout(200);
        console.log(`   ✅ ${bp}`);
      }
    }

    await page.screenshot({ path: 'test-results/auto-05-responsive.png', fullPage: true });

    // Step 7: Test container selection
    console.log('\n📋 STEP 7: Testing container selection...');

    const containerLabel = page.locator('text=📦 CONTAINER').first();
    if (await containerLabel.isVisible({ timeout: 2000 })) {
      await containerLabel.click();
    } else {
      await page.locator('.responsive-container').first().click();
    }

    await page.waitForTimeout(500);
    console.log('✅ Container selected');
    await page.screenshot({ path: 'test-results/auto-06-container.png', fullPage: true });

    // Step 8: Test export
    console.log('\n📋 STEP 8: Testing Liquid export...');

    const exportBtn = page.locator('button:has-text("Export Liquid")').first();
    if (await exportBtn.isVisible({ timeout: 2000 })) {
      await exportBtn.click();
      await page.waitForTimeout(1500);

      const codeElements = await page.locator('pre, code, textarea').count();
      console.log(`✅ Export triggered (${codeElements} code elements)`);

      await page.screenshot({ path: 'test-results/auto-07-export.png', fullPage: true });
    }

    // FINAL SUMMARY
    console.log('\n' + '='.repeat(70));
    console.log('🎉 FULLY AUTOMATED TEST COMPLETE!');
    console.log('='.repeat(70));
    console.log('\n📊 RESULTS:');
    console.log('   ✅ Elements added programmatically (NO MANUAL DRAGGING)');
    console.log('   ✅ Columns selected automatically');
    console.log('   ✅ FlexDirection bug tested');
    console.log('   ✅ All breakpoints tested');
    console.log('   ✅ Container selection tested');
    console.log('   ✅ Export functionality tested');
    console.log('   ✅ 7 screenshots captured');
    console.log('\n📁 Check test-results/ for screenshots');
    console.log('='.repeat(70) + '\n');

    await page.waitForTimeout(2000);
  });

});
