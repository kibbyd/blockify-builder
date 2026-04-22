/**
 * VISUAL TEST - Text Align
 * Verify that textAlign actually centers text visually, not just in computed styles
 */

const { test, expect } = require('@playwright/test');

test.describe('Text Align Visual Test', () => {

  test('Verify textAlign center actually centers text visually', async ({ page }) => {
    test.setTimeout(60000);

    console.log('\n🎯 TEXT ALIGN VISUAL TEST');

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

    // Select heading
    const heading = page.locator('.canvas h1, .canvas h2, .canvas h3').first();
    await heading.click();
    await page.waitForTimeout(1500);

    console.log('\n1️⃣ Checking initial heading width and position...');

    const initialData = await heading.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      return {
        width: computed.width,
        display: computed.display,
        textAlign: computed.textAlign,
        elementWidth: rect.width,
        parentWidth: el.parentElement.getBoundingClientRect().width
      };
    });

    console.log(`   Width: ${initialData.width} (${initialData.elementWidth}px)`);
    console.log(`   Parent width: ${initialData.parentWidth}px`);
    console.log(`   Display: ${initialData.display}`);
    console.log(`   Text Align: ${initialData.textAlign}`);

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

    // Set to center
    const centerBtn = page.locator('button[title="center"]');
    await centerBtn.click();
    await page.waitForTimeout(1500);

    console.log('\n2️⃣ After setting textAlign center...');

    const afterData = await heading.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      const parentRect = el.parentElement.getBoundingClientRect();

      // Get the text content's bounding box
      const range = document.createRange();
      range.selectNodeContents(el);
      const textRect = range.getBoundingClientRect();

      return {
        width: computed.width,
        display: computed.display,
        textAlign: computed.textAlign,
        elementWidth: rect.width,
        elementLeft: rect.left,
        parentWidth: parentRect.width,
        parentLeft: parentRect.left,
        textWidth: textRect.width,
        textLeft: textRect.left,
        // Calculate if text is centered
        textOffsetFromElement: textRect.left - rect.left,
        elementOffsetFromParent: rect.left - parentRect.left
      };
    });

    console.log(`   Element width: ${afterData.elementWidth}px`);
    console.log(`   Parent width: ${afterData.parentWidth}px`);
    console.log(`   Text width: ${afterData.textWidth}px`);
    console.log(`   Text offset from element left: ${afterData.textOffsetFromElement}px`);
    console.log(`   Element offset from parent left: ${afterData.elementOffsetFromParent}px`);
    console.log(`   Computed textAlign: ${afterData.textAlign}`);

    // Check if text is approximately centered
    const expectedOffset = (afterData.elementWidth - afterData.textWidth) / 2;
    const actualOffset = afterData.textOffsetFromElement;
    const tolerance = 5; // pixels

    console.log(`   Expected text offset for centering: ${expectedOffset}px`);
    console.log(`   Actual text offset: ${actualOffset}px`);

    if (Math.abs(expectedOffset - actualOffset) < tolerance) {
      console.log('   ✅ TEXT IS VISUALLY CENTERED');
    } else {
      console.log('   ❌ TEXT IS NOT CENTERED (CSS applied but not working visually)');
    }

    await page.screenshot({ path: 'test-results/textalign-visual-test.png', fullPage: true });
  });

});
