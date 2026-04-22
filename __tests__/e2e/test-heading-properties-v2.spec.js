/**
 * HEADING ELEMENT - ALL PROPERTIES TEST V2
 * Fixed selectors based on actual PropertyPanel UI
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');

test.describe('Heading - All Properties Test V2', () => {

  test('Test every property on heading element with correct selectors', async ({ page }) => {
    test.setTimeout(180000);

    console.log('\n' + '='.repeat(80));
    console.log('📝 HEADING ELEMENT - COMPLETE PROPERTY TEST V2');
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

    // Select heading (click on the h2 in canvas)
    const heading = page.locator('h2').filter({ hasText: 'New Heading' }).first();
    await heading.click();
    await page.waitForTimeout(1500);

    console.log('\n✅ Heading selected');
    await page.screenshot({ path: 'test-results/heading-v2-01-selected.png', fullPage: true });

    // ===========================================
    // TEST 1: Text Content
    // ===========================================
    console.log('\n📝 TEST 1: Text Content');
    results.tested.push('text content');

    const textInput = page.locator('textarea').first();
    if (await textInput.isVisible({ timeout: 2000 })) {
      await textInput.clear();
      await textInput.fill('Custom Heading Text');
      await textInput.blur();
      await page.waitForTimeout(1000);

      // Query the heading element again with new text
      const updatedHeading = page.locator('h2').filter({ hasText: 'Custom Heading Text' }).first();
      const headingText = await updatedHeading.textContent();
      if (headingText.includes('Custom Heading Text')) {
        console.log('   ✅ Text content updates correctly');
        results.working.push('text content');
      } else {
        console.log(`   ❌ Text content failed: got "${headingText}"`);
        results.broken.push({ property: 'text content', issue: `Expected "Custom Heading Text", got "${headingText}"` });
      }
    } else {
      console.log('   ❌ Text input not found');
      results.broken.push({ property: 'text content', issue: 'Textarea not found' });
    }

    await page.screenshot({ path: 'test-results/heading-v2-02-text.png', fullPage: true });

    // ===========================================
    // TEST 2: Heading Level (H1-H6)
    // ===========================================
    console.log('\n📝 TEST 2: Heading Level (H1-H6)');
    results.tested.push('heading level');

    // Look for buttons in the Heading Level section
    const levelButtons = await page.locator('button').filter({ hasText: /^H$/ }).all();
    console.log(`   Found ${levelButtons.length} heading level buttons`);

    if (levelButtons.length >= 6) {
      // Click first button (should be H1)
      await levelButtons[0].click();
      await page.waitForTimeout(1500);

      const h1Count = await page.locator('h1').filter({ hasText: 'Custom Heading Text' }).count();
      if (h1Count > 0) {
        console.log('   ✅ Heading level changes (H2 → H1)');
        results.working.push('heading level');

        // Update heading reference for future tests
        const newHeading = page.locator('h1').filter({ hasText: 'Custom Heading Text' }).first();

        // Test font size with H1
        await testFontSize(page, newHeading, results);
        await testFontWeight(page, newHeading, results);
        await testTextColor(page, newHeading, results);
        await testTextAlign(page, newHeading, results);

        // Skip remaining tests - run them separately
        await page.screenshot({ path: 'test-results/heading-v2-03-level.png', fullPage: true });

        // Early return to avoid duplicate tests
        await generateReport(page, results);
        return;
      } else {
        console.log('   ❌ Heading level did not change to H1');
        results.broken.push({ property: 'heading level', issue: 'Button clicked but tag did not change' });
      }

      await page.screenshot({ path: 'test-results/heading-v2-03-level.png', fullPage: true });
    } else {
      console.log('   ❌ Not enough heading level buttons found');
      results.broken.push({ property: 'heading level', issue: `Only found ${levelButtons.length} buttons, need 6` });
    }

    // ===========================================
    // TEST 3: Font Size
    // ===========================================
    console.log('\n📝 TEST 3: Font Size');
    results.tested.push('font size');

    // Scroll to Typography section
    await page.evaluate(() => {
      const panel = document.querySelector('.property-panel, [class*="property"], [class*="panel"]');
      if (panel) panel.scrollTop = 300;
    });
    await page.waitForTimeout(500);

    // Find Font Size checkbox
    const fontSizeCheckbox = await findCheckboxByLabel(page, 'Font Size');
    if (fontSizeCheckbox) {
      const isChecked = await fontSizeCheckbox.isChecked();
      if (!isChecked) {
        await fontSizeCheckbox.check();
        await page.waitForTimeout(1000);
        console.log('   Enabled Font Size property');
      }

      // Look for number input near Font Size
      const fontSizeInput = await page.locator('input[type="number"]').first();
      if (await fontSizeInput.isVisible({ timeout: 2000 })) {
        const beforeSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);

        await fontSizeInput.clear();
        await fontSizeInput.fill('48');
        await fontSizeInput.blur();
        await page.waitForTimeout(1500);

        const afterSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);

        if (afterSize.includes('48') || parseFloat(afterSize) === 48) {
          console.log(`   ✅ Font Size: ${beforeSize} → ${afterSize}`);
          results.working.push('font size');
        } else {
          console.log(`   ❌ Font Size: Expected 48px, got ${afterSize}`);
          results.broken.push({ property: 'font size', issue: `Expected 48px, got ${afterSize}` });
        }

        await page.screenshot({ path: 'test-results/heading-v2-04-fontsize.png', fullPage: true });
      } else {
        console.log('   ❌ Font Size number input not found after checkbox');
        results.broken.push({ property: 'font size', issue: 'Number input not found after enabling checkbox' });
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

      // Scroll down a bit to see controls
      await page.evaluate(() => {
        const panel = document.querySelector('.property-panel, [class*="property"], [class*="panel"]');
        if (panel) panel.scrollTop += 100;
      });
      await page.waitForTimeout(500);

      // Look for weight selector/buttons
      const weightSelect = await page.locator('select').first();
      const hasSelect = await weightSelect.isVisible({ timeout: 1000 }).catch(() => false);

      if (hasSelect) {
        const beforeWeight = await heading.evaluate(el => window.getComputedStyle(el).fontWeight);

        await weightSelect.selectOption('700'); // bold
        await page.waitForTimeout(1500);

        const afterWeight = await heading.evaluate(el => window.getComputedStyle(el).fontWeight);

        if (beforeWeight !== afterWeight) {
          console.log(`   ✅ Font Weight: ${beforeWeight} → ${afterWeight}`);
          results.working.push('font weight');
        } else {
          console.log(`   ❌ Font Weight: No change (${afterWeight})`);
          results.broken.push({ property: 'font weight', issue: 'Selected bold but weight did not change' });
        }

        await page.screenshot({ path: 'test-results/heading-v2-05-fontweight.png', fullPage: true });
      } else {
        console.log('   ❌ Font Weight control not found');
        results.broken.push({ property: 'font weight', issue: 'Select/input not found after checkbox' });
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

    // Scroll to find color picker
    await page.evaluate(() => {
      const panel = document.querySelector('.property-panel, [class*="property"], [class*="panel"]');
      if (panel) panel.scrollTop = 200;
    });
    await page.waitForTimeout(500);

    const colorInput = page.locator('input[type="color"]').first();
    if (await colorInput.isVisible({ timeout: 2000 })) {
      const beforeColor = await heading.evaluate(el => window.getComputedStyle(el).color);

      await colorInput.fill('#FF5733');
      await page.waitForTimeout(1500);

      const afterColor = await heading.evaluate(el => window.getComputedStyle(el).color);

      if (beforeColor !== afterColor) {
        console.log(`   ✅ Text Color: ${beforeColor} → ${afterColor}`);
        results.working.push('text color');
      } else {
        console.log(`   ❌ Text Color: No change (${afterColor})`);
        results.broken.push({ property: 'text color', issue: 'Color picker changed but computed color did not' });
      }

      await page.screenshot({ path: 'test-results/heading-v2-06-color.png', fullPage: true });
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

      // Look for alignment buttons (usually icons or text)
      const alignButtons = await page.locator('button[value="center"]').all();

      if (alignButtons.length > 0) {
        const beforeAlign = await heading.evaluate(el => window.getComputedStyle(el).textAlign);

        await alignButtons[0].click();
        await page.waitForTimeout(1500);

        const afterAlign = await heading.evaluate(el => window.getComputedStyle(el).textAlign);

        if (afterAlign.includes('center')) {
          console.log(`   ✅ Text Align: ${beforeAlign} → ${afterAlign}`);
          results.working.push('text align');
        } else {
          console.log(`   ❌ Text Align: Expected center, got ${afterAlign}`);
          results.broken.push({ property: 'text align', issue: `Expected center, got ${afterAlign}` });
        }

        await page.screenshot({ path: 'test-results/heading-v2-07-textalign.png', fullPage: true });
      } else {
        console.log('   ❌ Text Align buttons not found');
        results.broken.push({ property: 'text align', issue: 'Buttons not found after checkbox' });
      }
    } else {
      console.log('   ⚠️  Text Align checkbox not found');
      results.missing.push('text align checkbox');
    }

    // ===========================================
    // DISCOVER ALL AVAILABLE PROPERTIES
    // ===========================================
    console.log('\n📋 Discovering ALL Available Properties...');

    await page.evaluate(() => {
      const panel = document.querySelector('.property-panel, [class*="property"], [class*="panel"]');
      if (panel) panel.scrollTop = 0;
    });
    await page.waitForTimeout(500);

    const allCheckboxLabels = await page.evaluate(() => {
      const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
      return checkboxes.map(cb => {
        const label = cb.closest('label') || cb.parentElement;
        return label ? label.textContent.trim().split('Responsive')[0].trim() : '';
      }).filter(text => text && !text.includes('Schema-editable'));
    });

    console.log(`   Found ${allCheckboxLabels.length} properties available:`);
    allCheckboxLabels.forEach(label => console.log(`      - ${label}`));
    results.notes.push(`Available properties: ${allCheckboxLabels.join(', ')}`);

    // ===========================================
    // GENERATE REPORT
    // ===========================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 HEADING PROPERTIES REPORT V2');
    console.log('='.repeat(80));

    const report = {
      element: 'heading',
      testDate: new Date().toISOString(),
      tested: results.tested,
      working: results.working,
      broken: results.broken,
      missing: results.missing,
      notes: results.notes,
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
      'test-results/heading-properties-v2-report.json',
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

    console.log('\n✅ Report saved to: test-results/heading-properties-v2-report.json');
    console.log('📁 Screenshots saved to: test-results/heading-v2-*.png');
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});

// Helper function to find checkbox by nearby label text
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
