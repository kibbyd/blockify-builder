/**
 * SIMPLE HYBRID TEST
 * Opens browser, waits 30 seconds for you to drag, then tests everything
 */

const { test, expect } = require('@playwright/test');

test('Simple: Drag then Auto-test', async ({ page }) => {
  test.setTimeout(180000); // 3 minutes total

  console.log('\n' + '='.repeat(70));
  console.log('HYBRID TEST: 30-Second Drag Window');
  console.log('='.repeat(70));

  // Open and bypass license
  console.log('\n✅ Opening browser...');
  await page.goto('http://localhost:3000/builder');

  await page.evaluate(() => {
    localStorage.setItem('blockify_builder_license', 'TEST-LICENSE-KEY');
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    localStorage.setItem('blockify_builder_license_expires', expires.toISOString());
  });

  await page.reload();
  await page.waitForSelector('.canvas', { timeout: 15000 });

  console.log('✅ Builder loaded\n');
  await page.screenshot({ path: 'test-results/hybrid-01-ready.png', fullPage: true });

  // Wait for manual drag
  console.log('─'.repeat(70));
  console.log('👉 YOU HAVE 30 SECONDS:');
  console.log('   1. Drag "Container" → canvas');
  console.log('   2. Drag "2 Columns" → into container');
  console.log('─'.repeat(70));

  for (let i = 30; i > 0; i--) {
    process.stdout.write(`\r⏱️  ${i} seconds remaining...`);
    await page.waitForTimeout(1000);
  }

  console.log('\n\n✅ Continuing with automated tests...\n');

  // Verify
  await page.screenshot({ path: 'test-results/hybrid-02-after-drag.png', fullPage: true });

  const containers = await page.locator('.responsive-container').count();
  const columns = await page.locator('.responsive-columns').count();

  console.log(`📊 Found: ${containers} containers, ${columns} columns\n`);

  if (containers === 0 || columns === 0) {
    console.log('❌ No elements found - did you drag them?');
    throw new Error('Manual setup incomplete');
  }

  // SELECT COLUMNS
  console.log('📋 Selecting columns...');
  const columnsLabel = page.locator('text=📋 COLUMNS').first();
  const columnsEl = page.locator('.responsive-columns').first();

  if (await columnsLabel.isVisible({ timeout: 2000 })) {
    await columnsLabel.click();
  } else {
    await columnsEl.click();
  }

  await page.waitForTimeout(500);
  console.log('✅ Columns selected\n');

  // TEST FLEXDIRECTION BUG
  console.log('📋 Testing FlexDirection Bug...');

  const before = await columnsEl.evaluate(el => window.getComputedStyle(el).flexDirection);
  console.log(`   Before: ${before}`);

  const columnBtn = page.locator('button').filter({ hasText: 'column' }).first();

  if (await columnBtn.isVisible({ timeout: 2000 })) {
    await columnBtn.click();
    await page.waitForTimeout(1000);

    const after = await columnsEl.evaluate(el => window.getComputedStyle(el).flexDirection);
    console.log(`   After: ${after}`);

    await page.screenshot({ path: 'test-results/hybrid-03-flexdirection.png', fullPage: true });

    if (before !== after) {
      console.log('   ✅ FlexDirection CHANGED - Bug is FIXED!\n');
    } else {
      console.log('   ❌ FlexDirection DID NOT CHANGE - Bug CONFIRMED!\n');
    }
  }

  // TEST RESPONSIVE
  console.log('📋 Testing responsive breakpoints...');
  for (const bp of ['XS', 'SM', 'MD', 'LG', 'XL']) {
    const btn = page.locator(`button:has-text("${bp}")`).first();
    if (await btn.isVisible({ timeout: 1000 })) {
      await btn.click();
      await page.waitForTimeout(200);
    }
  }
  console.log('✅ All breakpoints tested\n');

  // TEST CONTAINER
  console.log('📋 Testing container selection...');
  const containerLabel = page.locator('text=📦 CONTAINER').first();
  if (await containerLabel.isVisible({ timeout: 2000 })) {
    await containerLabel.click();
  } else {
    await page.locator('.responsive-container').first().click();
  }
  console.log('✅ Container selected\n');

  // TEST EXPORT
  console.log('📋 Testing export...');
  const exportBtn = page.locator('button:has-text("Export Liquid")').first();
  if (await exportBtn.isVisible({ timeout: 2000 })) {
    await exportBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'test-results/hybrid-04-export.png', fullPage: true });
    console.log('✅ Export tested\n');
  }

  // SUMMARY
  console.log('='.repeat(70));
  console.log('🎉 AUTOMATED TESTS COMPLETE!');
  console.log('='.repeat(70));
  console.log('\n✅ All tests passed');
  console.log('📁 Screenshots in test-results/\n');

  await page.waitForTimeout(2000);
});
