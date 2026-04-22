/**
 * HEADING ELEMENT - ALL PROPERTIES TEST
 * Tests EVERY property on heading element
 * Documents what works and what doesn't
 */

const { test } = require('@playwright/test');
const fs = require('fs');

test.describe('Heading - All Properties Test', () => {

  test('Test every property on heading element', async ({ page }) => {
    test.setTimeout(180000);

    console.log('\n' + '='.repeat(80));
    console.log('📝 HEADING ELEMENT - COMPLETE PROPERTY TEST');
    console.log('='.repeat(80));

    const results = {
      elementType: 'heading',
      tested: [],
      working: [],
      broken: [],
      missing: []
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

    // Select heading (click on the text, not container)
    const heading = page.locator('h1, h2, h3').first();
    await heading.click();
    await page.waitForTimeout(1500);

    // Verify heading is selected
    const panelTitle = await page.locator('h3, h2').filter({ hasText: /Heading|heading/i }).first().textContent().catch(() => '');
    console.log(`\n✅ Property Panel: "${panelTitle}"`);

    if (!panelTitle.toLowerCase().includes('heading')) {
      console.log('❌ ERROR: Heading not selected properly!');
      await page.screenshot({ path: 'test-results/heading-00-error.png', fullPage: true });
      return;
    }

    await page.screenshot({ path: 'test-results/heading-01-selected.png', fullPage: true });

    // Get all visible checkboxes in property panel
    console.log('\n📋 Discovering Available Properties...');

    const allCheckboxes = await page.locator('input[type="checkbox"]').all();
    const availableProps = [];

    for (const cb of allCheckboxes) {
      const label = await cb.evaluate(el => {
        const parent = el.closest('label') || el.parentElement;
        return parent ? parent.textContent.trim() : '';
      });
      if (label && !label.includes('Schema-editable')) {
        availableProps.push(label.split('Responsive')[0].trim());
      }
    }

    console.log(`   Found ${availableProps.length} properties: ${availableProps.join(', ')}`);

    // TEST 1: Heading Text
    console.log('\n📝 TEST 1: Heading Text');
    results.tested.push('text content');

    const textInput = page.locator('textarea, input[type="text"]').first();
    if (await textInput.isVisible({ timeout: 2000 })) {
      await textInput.clear();
      await textInput.fill('Test Heading - All Properties Working');
      await textInput.press('Enter');
      await page.waitForTimeout(1000);

      const headingText = await heading.textContent();
      if (headingText.includes('Test Heading')) {
        console.log('   ✅ Text content updates correctly');
        results.working.push('text content');
      } else {
        console.log(`   ❌ Text content failed: got "${headingText}"`);
        results.broken.push({ property: 'text content', issue: 'Text did not update' });
      }
    } else {
      console.log('   ❌ Text input not found');
      results.broken.push({ property: 'text content', issue: 'Input not found' });
    }

    await page.screenshot({ path: 'test-results/heading-02-text.png', fullPage: true });

    // TEST 2: Heading Level (H1-H6)
    console.log('\n📝 TEST 2: Heading Level (H1-H6)');
    results.tested.push('heading level');

    const h1Button = page.locator('button').filter({ hasText: /^H1$/i }).first();
    if (await h1Button.isVisible({ timeout: 2000 })) {
      await h1Button.click();
      await page.waitForTimeout(1000);

      const isH1 = await page.locator('h1').count() > 0;
      if (isH1) {
        console.log('   ✅ Heading level changes (H2 → H1)');
        results.working.push('heading level');
      } else {
        console.log('   ❌ Heading level did not change');
        results.broken.push({ property: 'heading level', issue: 'Level did not change to H1' });
      }

      await page.screenshot({ path: 'test-results/heading-03-level.png', fullPage: true });
    } else {
      console.log('   ⚠️  Heading level buttons not found');
      results.missing.push('heading level buttons');
    }

    // TEST 3: Font Size
    console.log('\n📝 TEST 3: Font Size');
    results.tested.push('font size');

    const fontSizeCheckbox = await findCheckbox(page, 'Font Size');
    if (fontSizeCheckbox) {
      await fontSizeCheckbox.check();
      await page.waitForTimeout(1000);

      const fontSizeInput = await findNumberInputNear(page, 'Font Size');
      if (fontSizeInput) {
        const beforeSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
        await fontSizeInput.clear();
        await fontSizeInput.fill('48');
        await fontSizeInput.press('Enter');
        await page.waitForTimeout(1500);
        const afterSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);

        if (afterSize.includes('48')) {
          console.log(`   ✅ Font Size: ${beforeSize} → ${afterSize}`);
          results.working.push('font size');
        } else {
          console.log(`   ❌ Font Size: Expected 48px, got ${afterSize}`);
          results.broken.push({ property: 'font size', issue: `Expected 48px, got ${afterSize}` });
        }

        await page.screenshot({ path: 'test-results/heading-04-fontsize.png', fullPage: true });
      } else {
        console.log('   ❌ Font Size input not found');
        results.broken.push({ property: 'font size', issue: 'Input not found after checkbox' });
      }
    } else {
      console.log('   ⚠️  Font Size property not available');
      results.missing.push('font size');
    }

    // TEST 4: Font Weight
    console.log('\n📝 TEST 4: Font Weight');
    results.tested.push('font weight');

    const fontWeightCheckbox = await findCheckbox(page, 'Font Weight');
    if (fontWeightCheckbox) {
      await fontWeightCheckbox.check();
      await page.waitForTimeout(1000);

      // Look for font weight buttons (bold, normal, etc.)
      const boldBtn = await findButton(page, 'bold');
      if (boldBtn) {
        const beforeWeight = await heading.evaluate(el => window.getComputedStyle(el).fontWeight);
        await boldBtn.click();
        await page.waitForTimeout(1500);
        const afterWeight = await heading.evaluate(el => window.getComputedStyle(el).fontWeight);

        if (beforeWeight !== afterWeight) {
          console.log(`   ✅ Font Weight: ${beforeWeight} → ${afterWeight}`);
          results.working.push('font weight');
        } else {
          console.log(`   ❌ Font Weight: No change (${afterWeight})`);
          results.broken.push({ property: 'font weight', issue: 'Value did not change' });
        }

        await page.screenshot({ path: 'test-results/heading-05-fontweight.png', fullPage: true });
      } else {
        console.log('   ❌ Font Weight controls not found');
        results.broken.push({ property: 'font weight', issue: 'Controls not found' });
      }
    } else {
      console.log('   ⚠️  Font Weight property not available');
      results.missing.push('font weight');
    }

    // TEST 5: Color
    console.log('\n📝 TEST 5: Color');
    results.tested.push('color');

    const colorInput = page.locator('input[type="color"]').first();
    if (await colorInput.isVisible({ timeout: 2000 })) {
      const beforeColor = await heading.evaluate(el => window.getComputedStyle(el).color);
      await colorInput.fill('#FF5733');
      await page.waitForTimeout(1500);
      const afterColor = await heading.evaluate(el => window.getComputedStyle(el).color);

      if (beforeColor !== afterColor) {
        console.log(`   ✅ Color: ${beforeColor} → ${afterColor}`);
        results.working.push('color');
      } else {
        console.log(`   ❌ Color: No change (${afterColor})`);
        results.broken.push({ property: 'color', issue: 'Color did not change' });
      }

      await page.screenshot({ path: 'test-results/heading-06-color.png', fullPage: true });
    } else {
      console.log('   ⚠️  Color picker not found');
      results.missing.push('color');
    }

    // TEST 6: Text Align
    console.log('\n📝 TEST 6: Text Align');
    results.tested.push('text align');

    const textAlignCheckbox = await findCheckbox(page, 'Text Align');
    if (textAlignCheckbox) {
      await textAlignCheckbox.check();
      await page.waitForTimeout(1000);

      const centerAlignBtn = await findButton(page, 'center');
      if (centerAlignBtn) {
        const beforeAlign = await heading.evaluate(el => window.getComputedStyle(el).textAlign);
        await centerAlignBtn.click();
        await page.waitForTimeout(1500);
        const afterAlign = await heading.evaluate(el => window.getComputedStyle(el).textAlign);

        if (afterAlign.includes('center')) {
          console.log(`   ✅ Text Align: ${beforeAlign} → ${afterAlign}`);
          results.working.push('text align');
        } else {
          console.log(`   ❌ Text Align: Expected center, got ${afterAlign}`);
          results.broken.push({ property: 'text align', issue: `Expected center, got ${afterAlign}` });
        }

        await page.screenshot({ path: 'test-results/heading-07-textalign.png', fullPage: true });
      } else {
        console.log('   ❌ Text Align buttons not found');
        results.broken.push({ property: 'text align', issue: 'Buttons not found' });
      }
    } else {
      console.log('   ⚠️  Text Align property not available');
      results.missing.push('text align');
    }

    // GENERATE REPORT
    console.log('\n' + '='.repeat(80));
    console.log('📊 HEADING PROPERTIES REPORT');
    console.log('='.repeat(80));

    const report = {
      element: 'heading',
      testDate: new Date().toISOString(),
      tested: results.tested,
      working: results.working,
      broken: results.broken,
      missing: results.missing,
      stats: {
        totalTested: results.tested.length,
        totalWorking: results.working.length,
        totalBroken: results.broken.length,
        totalMissing: results.missing.length,
        successRate: `${Math.round((results.working.length / results.tested.length) * 100)}%`
      }
    };

    fs.writeFileSync(
      'test-results/heading-properties-report.json',
      JSON.stringify(report, null, 2),
      'utf8'
    );

    console.log(`\n✅ Tested: ${results.tested.length} properties`);
    console.log(`✅ Working: ${results.working.length} (${report.stats.successRate})`);
    console.log(`❌ Broken: ${results.broken.length}`);
    console.log(`⚠️  Missing: ${results.missing.length}`);

    if (results.broken.length > 0) {
      console.log('\n❌ Broken Properties:');
      results.broken.forEach(b => {
        console.log(`   - ${b.property}: ${b.issue}`);
      });
    }

    if (results.missing.length > 0) {
      console.log('\n⚠️  Missing Properties:');
      results.missing.forEach(m => console.log(`   - ${m}`));
    }

    console.log('\n✅ Report saved to: test-results/heading-properties-report.json');
    console.log('📁 Screenshots saved to: test-results/heading-*.png');
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});

// Helper functions
async function findCheckbox(page, labelText) {
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

async function findButton(page, text) {
  const buttons = await page.locator('button').all();
  for (const btn of buttons) {
    const btnText = await btn.textContent().catch(() => '');
    const value = await btn.getAttribute('value').catch(() => '');
    if (btnText.toLowerCase().includes(text.toLowerCase()) || value === text) {
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
