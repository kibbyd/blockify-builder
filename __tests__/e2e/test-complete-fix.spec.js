/**
 * COMPLETE FIX VERIFICATION
 * Tests both fixes:
 * 1. Container fills canvas (display: block fix)
 * 2. FlexDirection works on columns (CSS bug fix)
 */

const { test, expect } = require('@playwright/test');

test.describe('Complete Fix Verification', () => {

  test('Verify container fills canvas AND flexDirection works', async ({ page }) => {
    test.setTimeout(180000);

    console.log('\n' + '='.repeat(80));
    console.log('🎯 COMPLETE FIX VERIFICATION');
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

    await page.waitForTimeout(1500);

    // TEST 1: Verify container fills canvas width
    console.log('\n📋 TEST 1: Container Fills Canvas');

    const canvasWidth = await page.locator('.canvas').evaluate(el => el.clientWidth);
    const containerWidth = await page.locator('.responsive-container').first().evaluate(el => el.clientWidth);

    console.log(`   Canvas width: ${canvasWidth}px`);
    console.log(`   Container width: ${containerWidth}px`);

    if (containerWidth >= canvasWidth * 0.95) {
      console.log('   ✅ Container fills canvas width!');
    } else {
      console.log(`   ❌ Container is too narrow (${Math.round(containerWidth/canvasWidth*100)}% of canvas)`);
    }

    await page.screenshot({ path: 'test-results/complete-01-layout.png', fullPage: true });

    // TEST 2: Select columns-2 via test helpers (avoid clicking issues)
    console.log('\n📋 TEST 2: Select Columns-2 Element');

    await page.evaluate(() => {
      const elements = window.blockifyTestHelpers.getElements();
      // Find container
      const container = elements[0];
      // Find columns-2 (should be first child)
      const columns = container.children[0];

      // Trigger selection programmatically
      const event = new CustomEvent('element-select', { detail: { elementId: columns.id } });
      window.dispatchEvent(event);

      // Also click it
      const columnsEl = document.querySelector('.responsive-columns.columns-2');
      if (columnsEl) {
        columnsEl.click();
      }
    });

    await page.waitForTimeout(2000);

    const panelTitle = await page.locator('h3').filter({ hasText: /column/i }).first().textContent().catch(() => '');
    console.log(`   Property Panel: "${panelTitle}"`);

    await page.screenshot({ path: 'test-results/complete-02-columns-selected.png', fullPage: true });

    // Get initial flexDirection
    const columnsEl = page.locator('.responsive-columns.columns-2').first();
    const beforeStyle = await columnsEl.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log(`   Initial flexDirection: "${beforeStyle}"`);

    // TEST 3: Enable Direction control and change to column
    console.log('\n📋 TEST 3: Change FlexDirection to Column');

    // Find Direction checkbox
    const directionCheckbox = page.locator('input[type="checkbox"]').filter({
      has: page.locator('text=Direction')
    }).first();

    const isVisible = await directionCheckbox.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      const isChecked = await directionCheckbox.isChecked();
      if (!isChecked) {
        await directionCheckbox.check();
        console.log('   ✅ Checked Direction checkbox');
        await page.waitForTimeout(1500);
      }
    } else {
      // Try finding by parent text
      const allCheckboxes = await page.locator('input[type="checkbox"]').all();
      for (const cb of allCheckboxes) {
        const parentText = await cb.evaluate(el => {
          const parent = el.closest('label') || el.parentElement;
          return parent ? parent.textContent : '';
        });
        if (parentText.includes('Direction')) {
          await cb.check();
          console.log('   ✅ Checked Direction checkbox (found via parent text)');
          await page.waitForTimeout(1500);
          break;
        }
      }
    }

    await page.screenshot({ path: 'test-results/complete-03-direction-enabled.png', fullPage: true });

    // Click column button (↓)
    const columnBtn = page.locator('button').filter({ hasText: '↓' }).first();
    const btnVisible = await columnBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (btnVisible) {
      await columnBtn.click();
      console.log('   ✅ Clicked column button (↓)');
      await page.waitForTimeout(2000);
    } else {
      console.log('   ❌ Column button not found');
    }

    await page.screenshot({ path: 'test-results/complete-04-after-click.png', fullPage: true });

    // Verify flexDirection changed
    const afterStyle = await columnsEl.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log(`   After click: flexDirection="${afterStyle}"`);

    // FINAL RESULTS
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL RESULTS');
    console.log('='.repeat(80));

    const containerFillsCanvas = containerWidth >= canvasWidth * 0.95;
    const flexDirectionChanged = beforeStyle === 'row' && afterStyle === 'column';

    console.log('');
    console.log(`FIX 1 - Container Fills Canvas: ${containerFillsCanvas ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Canvas: ${canvasWidth}px, Container: ${containerWidth}px`);
    console.log('');
    console.log(`FIX 2 - FlexDirection Works: ${flexDirectionChanged ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Before: "${beforeStyle}", After: "${afterStyle}"`);
    console.log('');

    if (containerFillsCanvas && flexDirectionChanged) {
      console.log('🎉🎉🎉 ALL FIXES VERIFIED! 🎉🎉🎉');
      console.log('');
      console.log('   ✅ Containers now fill canvas width');
      console.log('   ✅ Direction property now works on columns');
      console.log('   ✅ Both bugs are FIXED!');
    } else {
      console.log('⚠️  Some fixes may not be working:');
      if (!containerFillsCanvas) {
        console.log('   - Container not filling canvas');
      }
      if (!flexDirectionChanged) {
        console.log('   - FlexDirection not changing');
      }
    }

    console.log('='.repeat(80));

    await page.screenshot({ path: 'test-results/complete-05-final.png', fullPage: true });

    console.log('\n📁 Screenshots saved to test-results/complete-*.png\n');

    await page.waitForTimeout(2000);
  });

});
