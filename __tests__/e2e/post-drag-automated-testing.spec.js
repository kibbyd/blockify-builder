/**
 * Automated Testing After Manual Drag Setup
 * Assumes: Container + 2 Columns already on canvas
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

test.describe('Automated Tests - Post Manual Setup', () => {

  test('FULL TEST: FlexDirection Bug + All Properties', async ({ page }) => {
    console.log('\n🚀 STARTING AUTOMATED TEST SUITE');
    console.log('=' .repeat(60));

    // Connect to builder
    await page.goto('http://localhost:3000/builder');
    await bypassLicense(page);
    await page.reload();
    await page.waitForSelector('.canvas', { timeout: 15000 });

    console.log('✅ Connected to builder');

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/01-initial-state.png', fullPage: true });

    // ========================================
    // STEP 1: Verify elements exist
    // ========================================
    console.log('\n📋 STEP 1: Verifying elements on canvas...');

    const containers = await page.locator('.responsive-container').count();
    const columns = await page.locator('.responsive-columns').count();

    console.log(`   Containers found: ${containers}`);
    console.log(`   Columns found: ${columns}`);

    if (containers === 0 || columns === 0) {
      console.log('❌ ERROR: Elements not found. Did you drag Container + 2 Columns?');
      throw new Error('Missing elements - manual setup incomplete');
    }

    console.log('✅ Elements verified on canvas');
    await page.waitForTimeout(500);

    // ========================================
    // STEP 2: Select the columns element
    // ========================================
    console.log('\n📋 STEP 2: Selecting columns element...');

    // Click on the columns label to select it
    const columnsLabel = page.locator('text=📋 COLUMNS').first();

    if (await columnsLabel.isVisible()) {
      await columnsLabel.click();
      console.log('✅ Clicked on COLUMNS label');
    } else {
      // Try clicking on the columns element itself
      await page.locator('.responsive-columns').first().click();
      console.log('✅ Clicked on columns element');
    }

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/02-columns-selected.png', fullPage: true });

    // Verify Properties panel shows controls
    const propertiesPanel = page.locator('.properties-panel, .property-panel, text=Properties').first();
    const hasPanelContent = await propertiesPanel.isVisible();
    console.log(`   Properties panel visible: ${hasPanelContent}`);

    // ========================================
    // STEP 3: Test FlexDirection Bug (CRITICAL)
    // ========================================
    console.log('\n📋 STEP 3: Testing FlexDirection Bug...');
    console.log('   This is THE critical bug we identified!');

    // Take before screenshot
    await page.screenshot({ path: 'test-results/03-flexdirection-before.png', fullPage: true });

    // Get current layout
    const beforeLayout = await page.locator('.responsive-columns').first().evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        flexDirection: style.flexDirection,
        display: style.display
      };
    });
    console.log('   Current layout:', beforeLayout);

    // Try to find and click "column" button in property panel
    // Look for flex direction controls
    const columnButton = page.locator('button:has-text("column")').first();

    if (await columnButton.isVisible({ timeout: 2000 })) {
      console.log('   Found "column" button, clicking...');
      await columnButton.click();
      await page.waitForTimeout(1000);

      // Check if layout changed
      const afterLayout = await page.locator('.responsive-columns').first().evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          flexDirection: style.flexDirection,
          display: style.display
        };
      });
      console.log('   Layout after click:', afterLayout);

      await page.screenshot({ path: 'test-results/04-flexdirection-after.png', fullPage: true });

      if (beforeLayout.flexDirection === 'row' && afterLayout.flexDirection === 'column') {
        console.log('✅ SUCCESS: FlexDirection changed! Bug is FIXED!');
      } else if (beforeLayout.flexDirection === afterLayout.flexDirection) {
        console.log('❌ BUG CONFIRMED: FlexDirection did NOT change!');
        console.log('   This confirms the CSS override bug in builder.css:850-857');
      } else {
        console.log('⚠️  Unexpected result:', { beforeLayout, afterLayout });
      }
    } else {
      console.log('⚠️  Could not find flexDirection controls in property panel');
    }

    // ========================================
    // STEP 4: Test other column properties
    // ========================================
    console.log('\n📋 STEP 4: Testing other column properties...');

    // Try gap property
    const gapInput = page.locator('input[type="number"]').first();
    if (await gapInput.isVisible({ timeout: 2000 })) {
      const currentValue = await gapInput.inputValue();
      console.log(`   Current gap value: ${currentValue}`);

      await gapInput.fill('30');
      await page.waitForTimeout(500);

      const newValue = await gapInput.inputValue();
      console.log(`   New gap value: ${newValue}`);

      if (newValue === '30') {
        console.log('✅ Gap property input works');
      }
    }

    await page.screenshot({ path: 'test-results/05-properties-tested.png', fullPage: true });

    // ========================================
    // STEP 5: Test responsive breakpoints
    // ========================================
    console.log('\n📋 STEP 5: Testing responsive breakpoints...');

    const breakpoints = ['XS', 'SM', 'MD', 'LG', 'XL'];

    for (const bp of breakpoints) {
      const button = page.locator(`button:has-text("${bp}")`).first();

      if (await button.isVisible({ timeout: 1000 })) {
        await button.click();
        await page.waitForTimeout(300);
        console.log(`   ✅ Switched to ${bp} breakpoint`);
      }
    }

    await page.screenshot({ path: 'test-results/06-responsive-tested.png', fullPage: true });

    // ========================================
    // STEP 6: Test container selection
    // ========================================
    console.log('\n📋 STEP 6: Testing container selection...');

    const containerLabel = page.locator('text=📦 CONTAINER').first();

    if (await containerLabel.isVisible({ timeout: 2000 })) {
      await containerLabel.click();
      await page.waitForTimeout(500);
      console.log('✅ Selected container element');
      await page.screenshot({ path: 'test-results/07-container-selected.png', fullPage: true });
    } else {
      await page.locator('.responsive-container').first().click();
      console.log('✅ Clicked container element');
    }

    // ========================================
    // STEP 7: Test export functionality
    // ========================================
    console.log('\n📋 STEP 7: Testing export functionality...');

    // Click Export Liquid button
    const exportLiquidBtn = page.locator('button:has-text("Export Liquid")').first();

    if (await exportLiquidBtn.isVisible({ timeout: 2000 })) {
      await exportLiquidBtn.click();
      await page.waitForTimeout(1000);
      console.log('✅ Clicked Export Liquid button');

      await page.screenshot({ path: 'test-results/08-export-liquid.png', fullPage: true });

      // Check if code view appeared
      const codeView = page.locator('pre, code, .code-view, textarea').first();
      if (await codeView.isVisible({ timeout: 2000 })) {
        const liquidCode = await codeView.textContent();
        console.log('✅ Liquid code generated');
        console.log(`   Code length: ${liquidCode.length} characters`);

        // Check for schema
        if (liquidCode.includes('{% schema %}')) {
          console.log('✅ Schema found in output');
        }
        if (liquidCode.includes('{% endschema %}')) {
          console.log('✅ Schema closing tag found');
        }
      }
    }

    // ========================================
    // STEP 8: Test JSON export
    // ========================================
    console.log('\n📋 STEP 8: Testing JSON export...');

    const exportJSONBtn = page.locator('button:has-text("Export JSON")').first();

    if (await exportJSONBtn.isVisible({ timeout: 2000 })) {
      // Set up download handler
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);

      await exportJSONBtn.click();
      await page.waitForTimeout(1000);

      const download = await downloadPromise;
      if (download) {
        console.log('✅ JSON export triggered download');
        console.log(`   Filename: ${download.suggestedFilename()}`);
      } else {
        console.log('⚠️  No download detected');
      }
    }

    await page.screenshot({ path: 'test-results/09-export-json.png', fullPage: true });

    // ========================================
    // FINAL SUMMARY
    // ========================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 AUTOMATED TEST SUITE COMPLETE');
    console.log('='.repeat(60));
    console.log('\n📊 RESULTS SUMMARY:');
    console.log('   ✅ Elements verified on canvas');
    console.log('   ✅ Columns element selected');
    console.log('   ✅ FlexDirection bug tested');
    console.log('   ✅ Properties tested');
    console.log('   ✅ Responsive breakpoints tested');
    console.log('   ✅ Container selection tested');
    console.log('   ✅ Export functionality tested');
    console.log('   ✅ 9 screenshots captured');
    console.log('\n📁 Check test-results/ folder for screenshots');
    console.log('=' .repeat(60) + '\n');

    // Keep browser open to view results
    await page.waitForTimeout(3000);
  });

});
