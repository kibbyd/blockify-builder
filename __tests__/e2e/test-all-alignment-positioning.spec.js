/**
 * COMPREHENSIVE ALIGNMENT & POSITIONING TEST
 * Tests ALL alignment, positioning, flex, and layout properties
 * Documents what works and what needs fixing
 */

const { test } = require('@playwright/test');
const fs = require('fs');

test.describe('Alignment & Positioning Comprehensive Test', () => {

  test('Test all alignment and positioning properties', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes for thorough testing

    console.log('\n' + '='.repeat(80));
    console.log('🎯 COMPREHENSIVE ALIGNMENT & POSITIONING TEST');
    console.log('='.repeat(80));

    const results = {
      container: { tested: [], working: [], broken: [] },
      columns: { tested: [], working: [], broken: [] },
      elements: { tested: [], working: [], broken: [] }
    };

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

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    // ============================================
    // TEST 1: CONTAINER ALIGNMENT PROPERTIES
    // ============================================
    console.log('\n📋 TEST 1: Container Alignment Properties');

    await page.evaluate(async () => {
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 500));

      const elements = window.blockifyTestHelpers.getElements();
      const container = elements[0];

      // Add a heading to see alignment effects
      await window.blockifyTestHelpers.addChildElement(container.id, 'heading');
      await new Promise(r => setTimeout(r, 300));

      // Add an image
      await window.blockifyTestHelpers.addChildElement(container.id, 'image');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1500);

    // Select container
    const container = page.locator('.responsive-container').first();
    await container.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'test-results/align-01-container-selected.png', fullPage: true });

    // Test Justify Content
    console.log('\n   Testing: Justify Content');
    results.container.tested.push('justifyContent');

    const justifyCheckbox = await findCheckboxByText(page, 'Justify Content');
    if (justifyCheckbox) {
      await justifyCheckbox.check();
      await page.waitForTimeout(1000);

      const centerBtn = await findButtonByText(page, 'center');
      if (centerBtn) {
        const beforeStyle = await container.evaluate(el => window.getComputedStyle(el).justifyContent);
        await centerBtn.click();
        await page.waitForTimeout(1500);
        const afterStyle = await container.evaluate(el => window.getComputedStyle(el).justifyContent);

        if (beforeStyle !== afterStyle && afterStyle.includes('center')) {
          console.log(`   ✅ Justify Content: ${beforeStyle} → ${afterStyle}`);
          results.container.working.push('justifyContent');
        } else {
          console.log(`   ❌ Justify Content: No change (${afterStyle})`);
          results.container.broken.push({ property: 'justifyContent', issue: 'Value did not change' });
        }

        await page.screenshot({ path: 'test-results/align-02-container-justify.png', fullPage: true });
      } else {
        console.log('   ⚠️  Justify Content buttons not found');
        results.container.broken.push({ property: 'justifyContent', issue: 'Buttons not found' });
      }
    } else {
      console.log('   ⚠️  Justify Content checkbox not found');
      results.container.broken.push({ property: 'justifyContent', issue: 'Checkbox not found' });
    }

    // Test Align Items
    console.log('\n   Testing: Align Items');
    results.container.tested.push('alignItems');

    const alignCheckbox = await findCheckboxByText(page, 'Align Items');
    if (alignCheckbox) {
      await alignCheckbox.check();
      await page.waitForTimeout(1000);

      const centerAlignBtn = await findButtonByText(page, 'center');
      if (centerAlignBtn) {
        const beforeStyle = await container.evaluate(el => window.getComputedStyle(el).alignItems);
        await centerAlignBtn.click();
        await page.waitForTimeout(1500);
        const afterStyle = await container.evaluate(el => window.getComputedStyle(el).alignItems);

        if (beforeStyle !== afterStyle && afterStyle.includes('center')) {
          console.log(`   ✅ Align Items: ${beforeStyle} → ${afterStyle}`);
          results.container.working.push('alignItems');
        } else {
          console.log(`   ❌ Align Items: No change (${afterStyle})`);
          results.container.broken.push({ property: 'alignItems', issue: 'Value did not change' });
        }

        await page.screenshot({ path: 'test-results/align-03-container-alignitems.png', fullPage: true });
      } else {
        console.log('   ⚠️  Align Items buttons not found');
        results.container.broken.push({ property: 'alignItems', issue: 'Buttons not found' });
      }
    } else {
      console.log('   ⚠️  Align Items checkbox not found');
      results.container.broken.push({ property: 'alignItems', issue: 'Checkbox not found' });
    }

    // Test Gap
    console.log('\n   Testing: Gap');
    results.container.tested.push('gap');

    const gapCheckbox = await findCheckboxByText(page, 'Gap');
    if (gapCheckbox) {
      await gapCheckbox.check();
      await page.waitForTimeout(1000);

      // Find gap input
      const gapInput = await findNumberInputNear(page, 'Gap');
      if (gapInput) {
        const beforeStyle = await container.evaluate(el => window.getComputedStyle(el).gap);
        await gapInput.clear();
        await gapInput.fill('30');
        await gapInput.press('Enter');
        await page.waitForTimeout(1500);
        const afterStyle = await container.evaluate(el => window.getComputedStyle(el).gap);

        if (afterStyle.includes('30')) {
          console.log(`   ✅ Gap: ${beforeStyle} → ${afterStyle}`);
          results.container.working.push('gap');
        } else {
          console.log(`   ❌ Gap: Expected 30px, got ${afterStyle}`);
          results.container.broken.push({ property: 'gap', issue: `Expected 30px, got ${afterStyle}` });
        }

        await page.screenshot({ path: 'test-results/align-04-container-gap.png', fullPage: true });
      } else {
        console.log('   ⚠️  Gap input not found');
        results.container.broken.push({ property: 'gap', issue: 'Input not found' });
      }
    } else {
      console.log('   ⚠️  Gap checkbox not found');
      results.container.broken.push({ property: 'gap', issue: 'Checkbox not found' });
    }

    // ============================================
    // TEST 2: COLUMNS ALIGNMENT PROPERTIES
    // ============================================
    console.log('\n📋 TEST 2: Columns Alignment Properties');

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    await page.evaluate(async () => {
      return await window.blockifyTestHelpers.setupContainerWithColumns(2);
    });

    await page.waitForTimeout(1500);

    // Select columns
    const columns = page.locator('.responsive-columns').first();
    await columns.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'test-results/align-05-columns-selected.png', fullPage: true });

    // Test Direction
    console.log('\n   Testing: Direction (FlexDirection)');
    results.columns.tested.push('flexDirection');

    const dirCheckbox = await findCheckboxByText(page, 'Direction');
    if (dirCheckbox) {
      await dirCheckbox.check();
      await page.waitForTimeout(1000);

      const columnBtn = page.locator('button').filter({ hasText: '↓' }).first();
      if (await columnBtn.isVisible({ timeout: 1000 })) {
        const beforeStyle = await columns.evaluate(el => window.getComputedStyle(el).flexDirection);
        await columnBtn.click();
        await page.waitForTimeout(1500);
        const afterStyle = await columns.evaluate(el => window.getComputedStyle(el).flexDirection);

        if (beforeStyle === 'row' && afterStyle === 'column') {
          console.log(`   ✅ FlexDirection: ${beforeStyle} → ${afterStyle}`);
          results.columns.working.push('flexDirection');
        } else {
          console.log(`   ❌ FlexDirection: ${beforeStyle} → ${afterStyle} (expected column)`);
          results.columns.broken.push({ property: 'flexDirection', issue: `Expected column, got ${afterStyle}` });
        }

        await page.screenshot({ path: 'test-results/align-06-columns-direction.png', fullPage: true });
      } else {
        console.log('   ⚠️  Direction buttons not found');
        results.columns.broken.push({ property: 'flexDirection', issue: 'Buttons not found' });
      }
    } else {
      console.log('   ⚠️  Direction checkbox not found');
      results.columns.broken.push({ property: 'flexDirection', issue: 'Checkbox not found' });
    }

    // Test Columns Justify Content
    console.log('\n   Testing: Columns Justify Content');
    results.columns.tested.push('justifyContent');

    const colJustifyCheckbox = await findCheckboxByText(page, 'Justify Content');
    if (colJustifyCheckbox) {
      await colJustifyCheckbox.check();
      await page.waitForTimeout(1000);

      // Find space-between button
      const spaceBetweenBtn = await findButtonByText(page, 'space-between');
      if (spaceBetweenBtn) {
        const beforeStyle = await columns.evaluate(el => window.getComputedStyle(el).justifyContent);
        await spaceBetweenBtn.click();
        await page.waitForTimeout(1500);
        const afterStyle = await columns.evaluate(el => window.getComputedStyle(el).justifyContent);

        if (afterStyle.includes('space-between')) {
          console.log(`   ✅ Justify Content: ${beforeStyle} → ${afterStyle}`);
          results.columns.working.push('justifyContent');
        } else {
          console.log(`   ❌ Justify Content: ${beforeStyle} → ${afterStyle}`);
          results.columns.broken.push({ property: 'justifyContent', issue: `Expected space-between, got ${afterStyle}` });
        }

        await page.screenshot({ path: 'test-results/align-07-columns-justify.png', fullPage: true });
      } else {
        console.log('   ⚠️  Justify Content buttons not found');
        results.columns.broken.push({ property: 'justifyContent', issue: 'Buttons not found' });
      }
    } else {
      console.log('   ⚠️  Justify Content checkbox not found');
      results.columns.broken.push({ property: 'justifyContent', issue: 'Checkbox not found' });
    }

    // Test Columns Align Items
    console.log('\n   Testing: Columns Align Items');
    results.columns.tested.push('alignItems');

    const colAlignCheckbox = await findCheckboxByText(page, 'Align Items');
    if (colAlignCheckbox) {
      await colAlignCheckbox.check();
      await page.waitForTimeout(1000);

      const flexStartBtn = await findButtonByText(page, 'flex-start');
      if (flexStartBtn) {
        const beforeStyle = await columns.evaluate(el => window.getComputedStyle(el).alignItems);
        await flexStartBtn.click();
        await page.waitForTimeout(1500);
        const afterStyle = await columns.evaluate(el => window.getComputedStyle(el).alignItems);

        if (afterStyle.includes('flex-start') || afterStyle.includes('start')) {
          console.log(`   ✅ Align Items: ${beforeStyle} → ${afterStyle}`);
          results.columns.working.push('alignItems');
        } else {
          console.log(`   ❌ Align Items: ${beforeStyle} → ${afterStyle}`);
          results.columns.broken.push({ property: 'alignItems', issue: `Expected flex-start, got ${afterStyle}` });
        }

        await page.screenshot({ path: 'test-results/align-08-columns-alignitems.png', fullPage: true });
      } else {
        console.log('   ⚠️  Align Items buttons not found');
        results.columns.broken.push({ property: 'alignItems', issue: 'Buttons not found' });
      }
    } else {
      console.log('   ⚠️  Align Items checkbox not found');
      results.columns.broken.push({ property: 'alignItems', issue: 'Checkbox not found' });
    }

    // ============================================
    // TEST 3: ELEMENT ALIGNMENT (AlignSelf)
    // ============================================
    console.log('\n📋 TEST 3: Element AlignSelf Property');

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    await page.evaluate(async () => {
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 500));

      const elements = window.blockifyTestHelpers.getElements();
      const container = elements[0];

      // Add an image to test alignSelf
      await window.blockifyTestHelpers.addChildElement(container.id, 'image');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1500);

    // Select the image
    const image = page.locator('.element-wrapper').filter({ has: page.locator('img') }).first();
    await image.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'test-results/align-09-image-selected.png', fullPage: true });

    console.log('\n   Testing: Image AlignSelf');
    results.elements.tested.push('alignSelf');

    const alignSelfCheckbox = await findCheckboxByText(page, 'Align Self');
    if (alignSelfCheckbox) {
      await alignSelfCheckbox.check();
      await page.waitForTimeout(1000);

      const centerSelfBtn = await findButtonByText(page, 'center');
      if (centerSelfBtn) {
        const beforeStyle = await image.evaluate(el => window.getComputedStyle(el).alignSelf);
        await centerSelfBtn.click();
        await page.waitForTimeout(1500);
        const afterStyle = await image.evaluate(el => window.getComputedStyle(el).alignSelf);

        if (afterStyle.includes('center')) {
          console.log(`   ✅ AlignSelf: ${beforeStyle} → ${afterStyle}`);
          results.elements.working.push('alignSelf');
        } else {
          console.log(`   ❌ AlignSelf: ${beforeStyle} → ${afterStyle}`);
          results.elements.broken.push({ property: 'alignSelf', issue: `Expected center, got ${afterStyle}` });
        }

        await page.screenshot({ path: 'test-results/align-10-image-alignself.png', fullPage: true });
      } else {
        console.log('   ⚠️  AlignSelf buttons not found');
        results.elements.broken.push({ property: 'alignSelf', issue: 'Buttons not found' });
      }
    } else {
      console.log('   ⚠️  AlignSelf checkbox not found');
      results.elements.broken.push({ property: 'alignSelf', issue: 'Checkbox not found' });
    }

    // ============================================
    // TEST 4: POSITION PROPERTY
    // ============================================
    console.log('\n📋 TEST 4: Position Property');

    console.log('\n   Testing: Position (absolute/relative)');
    results.elements.tested.push('position');

    // Try to find position property
    const positionProp = await page.locator('label').filter({ hasText: /^Position$/ }).first().isVisible({ timeout: 2000 }).catch(() => false);

    if (positionProp) {
      console.log('   ✅ Position property found in panel');
      results.elements.working.push('position (UI exists)');
      await page.screenshot({ path: 'test-results/align-11-position-property.png', fullPage: true });
    } else {
      console.log('   ⚠️  Position property not found');
      results.elements.broken.push({ property: 'position', issue: 'Property not in panel' });
    }

    // ============================================
    // GENERATE REPORT
    // ============================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 GENERATING ALIGNMENT & POSITIONING REPORT');
    console.log('='.repeat(80));

    const report = {
      testDate: new Date().toISOString(),
      summary: {
        containerProperties: {
          tested: results.container.tested.length,
          working: results.container.working.length,
          broken: results.container.broken.length
        },
        columnsProperties: {
          tested: results.columns.tested.length,
          working: results.columns.working.length,
          broken: results.columns.broken.length
        },
        elementProperties: {
          tested: results.elements.tested.length,
          working: results.elements.working.length,
          broken: results.elements.broken.length
        }
      },
      details: results
    };

    // Save JSON report
    fs.writeFileSync(
      'test-results/alignment-positioning-report.json',
      JSON.stringify(report, null, 2),
      'utf8'
    );

    console.log('\n✅ Report saved to: test-results/alignment-positioning-report.json');

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));

    console.log('\n🔸 Container Properties:');
    console.log(`   Tested: ${results.container.tested.join(', ')}`);
    console.log(`   ✅ Working: ${results.container.working.length}/${results.container.tested.length}`);
    if (results.container.broken.length > 0) {
      console.log(`   ❌ Broken: ${results.container.broken.length}`);
      results.container.broken.forEach(b => {
        console.log(`      - ${b.property}: ${b.issue}`);
      });
    }

    console.log('\n🔸 Columns Properties:');
    console.log(`   Tested: ${results.columns.tested.join(', ')}`);
    console.log(`   ✅ Working: ${results.columns.working.length}/${results.columns.tested.length}`);
    if (results.columns.broken.length > 0) {
      console.log(`   ❌ Broken: ${results.columns.broken.length}`);
      results.columns.broken.forEach(b => {
        console.log(`      - ${b.property}: ${b.issue}`);
      });
    }

    console.log('\n🔸 Element Properties:');
    console.log(`   Tested: ${results.elements.tested.join(', ')}`);
    console.log(`   ✅ Working: ${results.elements.working.length}/${results.elements.tested.length}`);
    if (results.elements.broken.length > 0) {
      console.log(`   ❌ Broken: ${results.elements.broken.length}`);
      results.elements.broken.forEach(b => {
        console.log(`      - ${b.property}: ${b.issue}`);
      });
    }

    const totalTested = results.container.tested.length + results.columns.tested.length + results.elements.tested.length;
    const totalWorking = results.container.working.length + results.columns.working.length + results.elements.working.length;
    const totalBroken = results.container.broken.length + results.columns.broken.length + results.elements.broken.length;

    console.log('\n' + '='.repeat(80));
    console.log(`📊 OVERALL: ${totalWorking}/${totalTested} properties working`);
    console.log(`   ✅ Working: ${totalWorking}`);
    console.log(`   ❌ Broken: ${totalBroken}`);
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});

// Helper functions
async function findCheckboxByText(page, text) {
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  for (const cb of checkboxes) {
    const parentText = await cb.evaluate(el => {
      const parent = el.closest('label') || el.parentElement;
      return parent ? parent.textContent : '';
    });
    if (parentText.includes(text)) {
      return cb;
    }
  }
  return null;
}

async function findButtonByText(page, text) {
  const buttons = await page.locator('button').all();
  for (const btn of buttons) {
    const btnText = await btn.textContent().catch(() => '');
    const value = await btn.getAttribute('value').catch(() => '');
    if (btnText === text || value === text || btnText.toLowerCase().includes(text.toLowerCase())) {
      return btn;
    }
  }
  return null;
}

async function findNumberInputNear(page, labelText) {
  const inputs = await page.locator('input[type="number"]').all();
  for (const input of inputs) {
    const nearby = await input.evaluate(el => {
      const parent = el.closest('div');
      return parent ? parent.textContent : '';
    });
    if (nearby.includes(labelText)) {
      return input;
    }
  }
  return null;
}
