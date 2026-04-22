/**
 * HEADING ELEMENT - ALL PROPERTIES TEST V3
 * Simplified with generic selectors that don't depend on text content
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');

test.describe('Heading Properties Test V3', () => {

  test('Test all heading properties', async ({ page }) => {
    test.setTimeout(180000);

    console.log('\n' + '='.repeat(80));
    console.log('📝 HEADING ELEMENT - PROPERTY TEST V3');
    console.log('='.repeat(80));

    const results = {
      elementType: 'heading',
      tested: [],
      working: [],
      broken: [],
      missing: [],
      notes: []
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

    // Clear and add heading
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

    // Select heading - use generic selector that works regardless of tag
    await page.locator('h1, h2, h3, h4, h5, h6').first().click();
    await page.waitForTimeout(1500);

    console.log('\n✅ Heading selected');
    await page.screenshot({ path: 'test-results/heading-v3-01-selected.png', fullPage: true });

    // Helper function to get current heading element
    const getHeading = () => page.locator('h1, h2, h3, h4, h5, h6').first();

    // ===========================================
    // TEST 1: Text Content
    // ===========================================
    console.log('\n📝 TEST 1: Text Content');
    results.tested.push('text content');

    const textInput = page.locator('textarea').first();
    if (await textInput.isVisible({ timeout: 2000 })) {
      await textInput.clear();
      await textInput.fill('Property Test Heading');
      await textInput.blur();
      await page.waitForTimeout(1000);

      const headingText = await getHeading().textContent();
      if (headingText.includes('Property Test Heading')) {
        console.log('   ✅ Text content updates correctly');
        results.working.push('text content');
      } else {
        console.log(`   ❌ Text content failed: got "${headingText}"`);
        results.broken.push({ property: 'text content', issue: `Expected "Property Test Heading", got "${headingText}"` });
      }
    } else {
      console.log('   ❌ Text input not found');
      results.broken.push({ property: 'text content', issue: 'Textarea not found' });
    }

    await page.screenshot({ path: 'test-results/heading-v3-02-text.png', fullPage: true });

    // ===========================================
    // TEST 2: Heading Level (H1-H6)
    // ===========================================
    console.log('\n📝 TEST 2: Heading Level (H1-H6)');
    results.tested.push('heading level');

    const levelButtons = await page.locator('button').filter({ hasText: /^H$/ }).all();
    console.log(`   Found ${levelButtons.length} heading level buttons`);

    if (levelButtons.length >= 6) {
      const beforeTag = await getHeading().evaluate(el => el.tagName);

      // Click first button (H1)
      await levelButtons[0].click();
      await page.waitForTimeout(1500);

      const afterTag = await getHeading().evaluate(el => el.tagName);

      if (afterTag === 'H1') {
        console.log(`   ✅ Heading level changes (${beforeTag} → ${afterTag})`);
        results.working.push('heading level');
      } else {
        console.log(`   ❌ Heading level: Expected H1, got ${afterTag}`);
        results.broken.push({ property: 'heading level', issue: `Expected H1, got ${afterTag}` });
      }

      await page.screenshot({ path: 'test-results/heading-v3-03-level.png', fullPage: true });
    } else {
      console.log('   ❌ Not enough heading level buttons found');
      results.broken.push({ property: 'heading level', issue: `Only found ${levelButtons.length} buttons, need 6` });
    }

    // ===========================================
    // TEST 3: Font Size
    // ===========================================
    console.log('\n📝 TEST 3: Font Size');
    results.tested.push('font size');

    const fontSizeCheckbox = await findCheckboxByLabel(page, 'Font Size');
    if (fontSizeCheckbox) {
      const isChecked = await fontSizeCheckbox.isChecked();
      if (!isChecked) {
        await fontSizeCheckbox.check();
        await page.waitForTimeout(1000);
        console.log('   Enabled Font Size property');
      }

      const fontSizeInput = page.locator('input[type="number"]').first();
      if (await fontSizeInput.isVisible({ timeout: 2000 })) {
        const beforeSize = await getHeading().evaluate(el => window.getComputedStyle(el).fontSize);

        await fontSizeInput.clear();
        await fontSizeInput.fill('48');
        await fontSizeInput.blur();
        await page.waitForTimeout(1500);

        const afterSize = await getHeading().evaluate(el => window.getComputedStyle(el).fontSize);

        if (afterSize.includes('48') || parseFloat(afterSize) === 48) {
          console.log(`   ✅ Font Size: ${beforeSize} → ${afterSize}`);
          results.working.push('font size');
        } else {
          console.log(`   ❌ Font Size: Expected 48px, got ${afterSize}`);
          results.broken.push({ property: 'font size', issue: `Expected 48px, got ${afterSize}` });
        }

        await page.screenshot({ path: 'test-results/heading-v3-04-fontsize.png', fullPage: true });
      } else {
        console.log('   ❌ Font Size input not found after checkbox');
        results.broken.push({ property: 'font size', issue: 'Number input not visible' });
      }
    } else {
      console.log('   ⚠️  Font Size checkbox not found');
      results.missing.push('font size checkbox');
    }

    // ===========================================
    // TEST 4: Font Weight
    // ===========================================
    console.log('\n📝 TEST 4: Font Weight');
    results.tested.push('font weight');

    const fontWeightCheckbox = await findCheckboxByLabel(page, 'Font Weight');
    if (fontWeightCheckbox) {
      const isChecked = await fontWeightCheckbox.isChecked();
      if (!isChecked) {
        await fontWeightCheckbox.check();
        await page.waitForTimeout(1000);
      }

      // Try to find select dropdown
      const weightSelect = page.locator('select').first();
      const hasSelect = await weightSelect.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasSelect) {
        const beforeWeight = await getHeading().evaluate(el => window.getComputedStyle(el).fontWeight);

        await weightSelect.selectOption('700'); // bold
        await page.waitForTimeout(1500);

        const afterWeight = await getHeading().evaluate(el => window.getComputedStyle(el).fontWeight);

        if (beforeWeight !== afterWeight) {
          console.log(`   ✅ Font Weight: ${beforeWeight} → ${afterWeight}`);
          results.working.push('font weight');
        } else {
          console.log(`   ❌ Font Weight: No change (${afterWeight})`);
          results.broken.push({ property: 'font weight', issue: 'Selected bold but weight did not change' });
        }

        await page.screenshot({ path: 'test-results/heading-v3-05-fontweight.png', fullPage: true });
      } else {
        console.log('   ❌ Font Weight control not found');
        results.broken.push({ property: 'font weight', issue: 'Select not visible' });
      }
    } else {
      console.log('   ⚠️  Font Weight checkbox not found');
      results.missing.push('font weight checkbox');
    }

    // ===========================================
    // TEST 5: Text Color
    // ===========================================
    console.log('\n📝 TEST 5: Text Color');
    results.tested.push('text color');

    const colorInput = page.locator('input[type="color"]').first();
    if (await colorInput.isVisible({ timeout: 2000 })) {
      const beforeColor = await getHeading().evaluate(el => window.getComputedStyle(el).color);

      await colorInput.fill('#FF5733');
      await page.waitForTimeout(1500);

      const afterColor = await getHeading().evaluate(el => window.getComputedStyle(el).color);

      if (beforeColor !== afterColor) {
        console.log(`   ✅ Text Color: ${beforeColor} → ${afterColor}`);
        results.working.push('text color');
      } else {
        console.log(`   ❌ Text Color: No change (${afterColor})`);
        results.broken.push({ property: 'text color', issue: 'Color did not change' });
      }

      await page.screenshot({ path: 'test-results/heading-v3-06-color.png', fullPage: true });
    } else {
      console.log('   ⚠️  Color picker not found');
      results.missing.push('color picker');
    }

    // ===========================================
    // TEST 6: Text Align
    // ===========================================
    console.log('\n📝 TEST 6: Text Align');
    results.tested.push('text align');

    const textAlignCheckbox = await findCheckboxByLabel(page, 'Text Align');
    if (textAlignCheckbox) {
      const isChecked = await textAlignCheckbox.isChecked();
      if (!isChecked) {
        await textAlignCheckbox.check();
        await page.waitForTimeout(1000);
      }

      const centerButton = page.locator('button[value="center"]').first();
      if (await centerButton.isVisible({ timeout: 2000 })) {
        const beforeAlign = await getHeading().evaluate(el => window.getComputedStyle(el).textAlign);

        await centerButton.click();
        await page.waitForTimeout(1500);

        const afterAlign = await getHeading().evaluate(el => window.getComputedStyle(el).textAlign);

        if (afterAlign.includes('center')) {
          console.log(`   ✅ Text Align: ${beforeAlign} → ${afterAlign}`);
          results.working.push('text align');
        } else {
          console.log(`   ❌ Text Align: Expected center, got ${afterAlign}`);
          results.broken.push({ property: 'text align', issue: `Expected center, got ${afterAlign}` });
        }

        await page.screenshot({ path: 'test-results/heading-v3-07-textalign.png', fullPage: true });
      } else {
        console.log('   ❌ Text Align center button not found');
        results.broken.push({ property: 'text align', issue: 'Center button not visible' });
      }
    } else {
      console.log('   ⚠️  Text Align checkbox not found');
      results.missing.push('text align checkbox');
    }

    // ===========================================
    // DISCOVER ALL AVAILABLE PROPERTIES
    // ===========================================
    console.log('\n📋 Discovering ALL Available Properties...');

    const allCheckboxLabels = await page.evaluate(() => {
      const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
      return checkboxes.map(cb => {
        const label = cb.closest('label') || cb.parentElement;
        return label ? label.textContent.trim().split('Responsive')[0].trim() : '';
      }).filter(text => text && !text.includes('Schema-editable'));
    });

    console.log(`   Found ${allCheckboxLabels.length} properties available:`);
    allCheckboxLabels.forEach(label => console.log(`      - ${label}`));

    // ===========================================
    // GENERATE REPORT
    // ===========================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 HEADING PROPERTIES REPORT V3');
    console.log('='.repeat(80));

    const report = {
      element: 'heading',
      testDate: new Date().toISOString(),
      tested: results.tested,
      working: results.working,
      broken: results.broken,
      missing: results.missing,
      availableProperties: allCheckboxLabels,
      stats: {
        totalTested: results.tested.length,
        totalWorking: results.working.length,
        totalBroken: results.broken.length,
        totalMissing: results.missing.length,
        totalAvailable: allCheckboxLabels.length,
        successRate: `${Math.round((results.working.length / results.tested.length) * 100)}%`
      }
    };

    fs.writeFileSync(
      'test-results/heading-properties-v3-report.json',
      JSON.stringify(report, null, 2),
      'utf8'
    );

    console.log(`\n✅ Tested: ${results.tested.length} properties`);
    console.log(`✅ Working: ${results.working.length} (${report.stats.successRate})`);
    console.log(`❌ Broken: ${results.broken.length}`);
    console.log(`⚠️  Missing: ${results.missing.length}`);
    console.log(`📋 Available: ${allCheckboxLabels.length} properties total`);

    if (results.working.length > 0) {
      console.log('\n✅ Working Properties:');
      results.working.forEach(prop => console.log(`   ✅ ${prop}`));
    }

    if (results.broken.length > 0) {
      console.log('\n❌ Broken Properties:');
      results.broken.forEach(b => {
        console.log(`   ❌ ${b.property}: ${b.issue}`);
      });
    }

    if (results.missing.length > 0) {
      console.log('\n⚠️  Missing Properties:');
      results.missing.forEach(m => console.log(`   ⚠️  ${m}`));
    }

    console.log('\n✅ Report saved to: test-results/heading-properties-v3-report.json');
    console.log('📁 Screenshots saved to: test-results/heading-v3-*.png');
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});

// Helper function
async function findCheckboxByLabel(page, labelText) {
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  for (const cb of checkboxes) {
    const label = await cb.evaluate(el => {
      const parent = el.closest('label') || el.parentElement;
      return parent ? parent.textContent : '';
    });
    if (label.includes(labelText)) {
      return cb;
    }
  }
  return null;
}
