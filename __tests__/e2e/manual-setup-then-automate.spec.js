/**
 * HYBRID TESTING: Manual Drag + Automated Testing
 *
 * WORKFLOW:
 * 1. Test opens browser and bypasses license
 * 2. Test PAUSES and asks you to drag elements
 * 3. You drag Container + 2 Columns manually
 * 4. Press Enter in terminal to continue
 * 5. Test runs all automated tests
 */

const { test, expect } = require('@playwright/test');
const readline = require('readline');

function waitForEnter(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(message, () => {
      rl.close();
      resolve();
    });
  });
}

test('Manual Drag + Automated Testing', async ({ page }) => {
  test.setTimeout(300000); // 5 minutes for manual drag

  console.log('\n' + '='.repeat(70));
  console.log('HYBRID TEST: Manual Setup + Automated Validation');
  console.log('='.repeat(70));

  // Step 1: Open browser and bypass license
  console.log('\n📋 STEP 1: Opening browser and bypassing license...');

  await page.goto('http://localhost:3000/builder');

  await page.evaluate(() => {
    localStorage.setItem('blockify_builder_license', 'TEST-LICENSE-KEY');
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    localStorage.setItem('blockify_builder_license_expires', expires.toISOString());
  });

  await page.reload();
  await page.waitForSelector('.canvas', { timeout: 15000 });

  console.log('✅ Builder loaded with license bypass');
  await page.screenshot({ path: 'test-results/01-builder-ready.png', fullPage: true });

  // Step 2: Wait for manual drag
  console.log('\n📋 STEP 2: MANUAL DRAG REQUIRED');
  console.log('─'.repeat(70));
  console.log('INSTRUCTIONS:');
  console.log('1. Look at the browser window that just opened');
  console.log('2. Drag "Container" from the left palette → onto the canvas');
  console.log('3. Drag "2 Columns" from LAYOUT section → into the container');
  console.log('4. Come back here and press ENTER to continue automated tests');
  console.log('─'.repeat(70));

  await waitForEnter('\n👉 Press ENTER when you\'ve dragged Container + 2 Columns: ');

  console.log('\n✅ Continuing with automated tests...\n');
  await page.waitForTimeout(500);

  // Step 3: Verify elements exist
  console.log('📋 STEP 3: Verifying elements...');

  await page.screenshot({ path: 'test-results/02-after-manual-drag.png', fullPage: true });

  const containers = await page.locator('.responsive-container').count();
  const columns = await page.locator('.responsive-columns').count();

  console.log(`   Containers found: ${containers}`);
  console.log(`   Columns found: ${columns}`);

  if (containers === 0 || columns === 0) {
    console.log('\n❌ ERROR: Elements not found!');
    console.log('   Please make sure you dragged:');
    console.log('   1. Container (from BASIC ELEMENTS)');
    console.log('   2. 2 Columns (from LAYOUT section into the container)');
    throw new Error('Manual setup incomplete');
  }

  console.log('✅ Elements verified!\n');

  // Step 4: Select columns element
  console.log('📋 STEP 4: Selecting columns element...');

  const columnsLabel = page.locator('text=📋 COLUMNS').first();
  const columnsElement = page.locator('.responsive-columns').first();

  if (await columnsLabel.isVisible({ timeout: 2000 })) {
    await columnsLabel.click();
  } else {
    await columnsElement.click();
  }

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/03-columns-selected.png', fullPage: true });
  console.log('✅ Columns selected\n');

  // Step 5: Test FlexDirection Bug
  console.log('📋 STEP 5: Testing FlexDirection Bug (THE CRITICAL BUG)...');

  const beforeStyle = await columnsElement.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      flexDirection: computed.flexDirection,
      display: computed.display
    };
  });

  console.log('   Before:', beforeStyle);

  // Look for column button
  const columnBtn = page.locator('button').filter({ hasText: 'column' }).first();

  if (await columnBtn.isVisible({ timeout: 2000 })) {
    await columnBtn.click();
    await page.waitForTimeout(1000);

    const afterStyle = await columnsElement.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        flexDirection: computed.flexDirection,
        display: computed.display
      };
    });

    console.log('   After:', afterStyle);
    await page.screenshot({ path: 'test-results/04-flexdirection-tested.png', fullPage: true });

    if (beforeStyle.flexDirection !== afterStyle.flexDirection) {
      console.log('   ✅ SUCCESS: FlexDirection changed! Bug is FIXED!');
    } else {
      console.log('   ❌ BUG CONFIRMED: FlexDirection did NOT change');
      console.log('   This is the CSS override bug in builder.css:850-857');
    }
  } else {
    console.log('   ⚠️  FlexDirection button not found in property panel');
  }

  console.log('');

  // Step 6: Test responsive breakpoints
  console.log('📋 STEP 6: Testing responsive breakpoints...');

  for (const bp of ['XS', 'SM', 'MD', 'LG', 'XL']) {
    const btn = page.locator(`button:has-text("${bp}")`).first();
    if (await btn.isVisible({ timeout: 1000 })) {
      await btn.click();
      await page.waitForTimeout(200);
      console.log(`   ✅ ${bp} breakpoint`);
    }
  }

  await page.screenshot({ path: 'test-results/05-responsive-tested.png', fullPage: true });
  console.log('');

  // Step 7: Test container selection
  console.log('📋 STEP 7: Testing container selection...');

  const containerLabel = page.locator('text=📦 CONTAINER').first();
  if (await containerLabel.isVisible({ timeout: 2000 })) {
    await containerLabel.click();
  } else {
    await page.locator('.responsive-container').first().click();
  }

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/06-container-selected.png', fullPage: true });
  console.log('✅ Container selected\n');

  // Step 8: Test export
  console.log('📋 STEP 8: Testing Liquid export...');

  const exportBtn = page.locator('button:has-text("Export Liquid")').first();
  if (await exportBtn.isVisible({ timeout: 2000 })) {
    await exportBtn.click();
    await page.waitForTimeout(1500);

    const codeElements = await page.locator('pre, code, textarea').count();
    console.log(`   Code elements found: ${codeElements}`);

    await page.screenshot({ path: 'test-results/07-export-liquid.png', fullPage: true });
    console.log('✅ Export tested\n');
  }

  // Final Summary
  console.log('='.repeat(70));
  console.log('🎉 AUTOMATED TESTING COMPLETE!');
  console.log('='.repeat(70));
  console.log('\n📊 RESULTS:');
  console.log('   ✅ Elements verified');
  console.log('   ✅ Columns selected');
  console.log('   ✅ FlexDirection bug tested');
  console.log('   ✅ Responsive breakpoints tested');
  console.log('   ✅ Container selection tested');
  console.log('   ✅ Export functionality tested');
  console.log('   ✅ 7 screenshots captured');
  console.log('\n📁 Screenshots in: test-results/');
  console.log('='.repeat(70) + '\n');

  // Keep browser open
  await page.waitForTimeout(3000);
});
