/**
 * ALIGNMENT PROPERTIES - QUICK TEST
 * Tests key alignment properties with correct selectors from code analysis
 */

const { test } = require('@playwright/test');

test.describe('Alignment Properties Test', () => {

  test('Test textAlign, alignItems, justifyContent', async ({ page }) => {
    test.setTimeout(60000);

    console.log('\n🎯 ALIGNMENT PROPERTIES QUICK TEST');

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

    // Select heading (inside canvas only)
    const heading = page.locator('.canvas h1, .canvas h2, .canvas h3').first();
    await heading.click();
    await page.waitForTimeout(1500);

    console.log('\n1️⃣ Testing textAlign...');

    // Find Text Align checkbox by label
    const textAlignCheckbox = await page.locator('input[type="checkbox"]').evaluateAll((checkboxes) => {
      for (const cb of checkboxes) {
        const label = cb.closest('label') || cb.parentElement;
        if (label && label.textContent.includes('Text Align')) {
          return cb;
        }
      }
      return null;
    });

    if (textAlignCheckbox) {
      // Enable Text Align
      await page.locator('input[type="checkbox"]').evaluateAll((checkboxes) => {
        for (const cb of checkboxes) {
          const label = cb.closest('label') || cb.parentElement;
          if (label && label.textContent.includes('Text Align')) {
            cb.click();
          }
        }
      });

      await page.waitForTimeout(1000);

      // Click center button (using title attribute)
      const centerBtn = page.locator('button[title="center"]');
      if (await centerBtn.isVisible({ timeout: 2000 })) {
        await centerBtn.click();
        await page.waitForTimeout(1500);

        const textAlign = await heading.evaluate(el => window.getComputedStyle(el).textAlign);
        console.log(`   Result: ${textAlign}`);
        console.log(textAlign === 'center' ? '   ✅ WORKING' : '   ❌ BROKEN');
      } else {
        console.log('   ❌ Center button not found');
      }
    } else {
      console.log('   ⚠️  Text Align checkbox not found');
    }

    await page.screenshot({ path: 'test-results/alignment-quick-01.png', fullPage: true });

    console.log('\n2️⃣ Testing container alignItems...');

    // Select container - click on the CONTAINER label, not the div itself
    const containerLabel = page.locator('.canvas').locator('text=CONTAINER').first();
    await containerLabel.click();
    await page.waitForTimeout(1500);

    // Verify container is selected by checking property panel title
    const panelTitle = await page.locator('h3, h4').filter({ hasText: 'Container' }).first().isVisible({ timeout: 2000 });
    if (!panelTitle) {
      console.log('   ⚠️  Container not selected, trying alternative selector...');
      const container = page.locator('.canvas > div').first();
      await container.click({ position: { x: 5, y: 5 } }); // Click top-left corner
      await page.waitForTimeout(1500);
    }

    // Find Align Items checkbox
    await page.locator('input[type="checkbox"]').evaluateAll((checkboxes) => {
      for (const cb of checkboxes) {
        const label = cb.closest('label') || cb.parentElement;
        if (label && label.textContent.includes('Align Items')) {
          cb.click();
        }
      }
    });

    await page.waitForTimeout(1000);

    // Click center button
    const centerAlignBtn = page.locator('button[title="center"]');
    if (await centerAlignBtn.isVisible({ timeout: 2000 })) {
      await centerAlignBtn.click();
      await page.waitForTimeout(1500);

      const alignItems = await container.evaluate(el => window.getComputedStyle(el).alignItems);
      console.log(`   Result: ${alignItems}`);
      console.log(alignItems === 'center' ? '   ✅ WORKING' : '   ❌ BROKEN');
    } else {
      console.log('   ❌ Center button not found');
    }

    await page.screenshot({ path: 'test-results/alignment-quick-02.png', fullPage: true });

    console.log('\n✅ Alignment test complete\n');
  });

});
