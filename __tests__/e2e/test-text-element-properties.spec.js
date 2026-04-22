/**
 * TEXT/PARAGRAPH ELEMENT - PROPERTY DISCOVERY TEST
 * Simplified approach: document what's available and take screenshots
 */

const { test } = require('@playwright/test');
const fs = require('fs');

test.describe('Text Element Properties', () => {

  test('Discover and document text element properties', async ({ page }) => {
    test.setTimeout(120000);

    console.log('\n' + '='.repeat(80));
    console.log('📝 TEXT/PARAGRAPH ELEMENT - PROPERTY DISCOVERY');
    console.log('='.repeat(80));

    const results = {
      elementType: 'text',
      availableProperties: [],
      testedProperties: [],
      workingProperties: [],
      brokenProperties: [],
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

    // Clear and add text element
    await page.evaluate(async () => {
      await window.blockifyTestHelpers.clearCanvas();
      await new Promise(r => setTimeout(r, 300));
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 500));

      const elements = window.blockifyTestHelpers.getElements();
      await window.blockifyTestHelpers.addChildElement(elements[0].id, 'text');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(2000);

    // Select text element (paragraph tag)
    await page.locator('p').first().click();
    await page.waitForTimeout(1500);

    console.log('\n✅ Text element selected');
    await page.screenshot({ path: 'test-results/text-01-selected.png', fullPage: true });

    // ===========================================
    // DISCOVER AVAILABLE PROPERTIES
    // ===========================================
    console.log('\n📋 Step 1: Discovering Available Properties...');

    const allCheckboxLabels = await page.evaluate(() => {
      const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
      return checkboxes.map(cb => {
        const label = cb.closest('label') || cb.parentElement;
        const text = label ? label.textContent.trim() : '';
        const isChecked = cb.checked;
        return { text: text.split('Responsive')[0].trim(), checked: isChecked };
      }).filter(item => item.text && !item.text.includes('Schema-editable'));
    });

    results.availableProperties = allCheckboxLabels;

    console.log(`   Found ${allCheckboxLabels.length} properties:`);
    allCheckboxLabels.forEach(prop => {
      const status = prop.checked ? '✓' : '○';
      console.log(`      ${status} ${prop.text}`);
    });

    results.notes.push(`Total properties available: ${allCheckboxLabels.length}`);
    results.notes.push(`Properties enabled by default: ${allCheckboxLabels.filter(p => p.checked).length}`);

    // ===========================================
    // TEST 1: Text Content
    // ===========================================
    console.log('\n📝 TEST 1: Text Content');
    results.testedProperties.push('text content');

    const textInput = page.locator('textarea').first();
    if (await textInput.isVisible({ timeout: 2000 })) {
      await textInput.clear();
      await textInput.fill('This is test paragraph text for property testing.');
      await textInput.blur();
      await page.waitForTimeout(1000);

      const paragraphText = await page.locator('p').first().textContent();
      if (paragraphText.includes('test paragraph text')) {
        console.log('   ✅ Text content updates correctly');
        results.workingProperties.push('text content');
      } else {
        console.log(`   ❌ Text content failed: got "${paragraphText}"`);
        results.brokenProperties.push({ property: 'text content', issue: `Expected test text, got "${paragraphText}"` });
      }
    } else {
      console.log('   ❌ Text input not found');
      results.brokenProperties.push({ property: 'text content', issue: 'Textarea not found' });
    }

    await page.screenshot({ path: 'test-results/text-02-content.png', fullPage: true });

    // ===========================================
    // TEST 2: Font Size (if available)
    // ===========================================
    console.log('\n📝 TEST 2: Font Size (if enabled by default)');

    const fontSizeProp = allCheckboxLabels.find(p => p.text.includes('Font Size'));
    if (fontSizeProp && fontSizeProp.checked) {
      console.log('   Font Size is enabled by default');

      // Just document that it's enabled, don't try to interact
      await page.screenshot({ path: 'test-results/text-03-fontsize-visible.png', fullPage: true });
      results.notes.push('Font Size property enabled by default');
    } else if (fontSizeProp) {
      console.log('   Font Size is available but not enabled');
      results.notes.push('Font Size property requires checkbox enable');
    } else {
      console.log('   ⚠️  Font Size property not found');
      results.notes.push('Font Size property not available for text element');
    }

    // ===========================================
    // SCROLL AND CAPTURE FULL PROPERTY PANEL
    // ===========================================
    console.log('\n📋 Step 2: Capturing Property Panel (scrolled views)...');

    // Scroll to top
    await page.evaluate(() => {
      const panel = document.querySelector('.property-panel, [class*="property"], [class*="panel"]');
      if (panel) panel.scrollTop = 0;
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/text-04-panel-top.png', fullPage: true });

    // Scroll to middle
    await page.evaluate(() => {
      const panel = document.querySelector('.property-panel, [class*="property"], [class*="panel"]');
      if (panel) panel.scrollTop = panel.scrollHeight / 2;
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/text-05-panel-middle.png', fullPage: true });

    // Scroll to bottom
    await page.evaluate(() => {
      const panel = document.querySelector('.property-panel, [class*="property"], [class*="panel"]');
      if (panel) panel.scrollTop = panel.scrollHeight;
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/text-06-panel-bottom.png', fullPage: true });

    // ===========================================
    // CHECK FOR COLOR PICKER
    // ===========================================
    console.log('\n📝 TEST 3: Text Color');

    const colorInputs = await page.locator('input[type="color"]').count();
    if (colorInputs > 0) {
      console.log(`   ✅ Found ${colorInputs} color picker(s)`);
      results.workingProperties.push('text color (picker exists)');
    } else {
      console.log('   ⚠️  No color pickers found');
      results.notes.push('No color pickers visible in property panel');
    }

    // ===========================================
    // GENERATE REPORT
    // ===========================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEXT ELEMENT PROPERTIES REPORT');
    console.log('='.repeat(80));

    const report = {
      element: 'text',
      testDate: new Date().toISOString(),
      availableProperties: results.availableProperties,
      testedProperties: results.testedProperties,
      workingProperties: results.workingProperties,
      brokenProperties: results.brokenProperties,
      notes: results.notes,
      stats: {
        totalAvailable: results.availableProperties.length,
        totalTested: results.testedProperties.length,
        totalWorking: results.workingProperties.length,
        totalBroken: results.brokenProperties.length,
        enabledByDefault: results.availableProperties.filter(p => p.checked).length
      }
    };

    fs.writeFileSync(
      'test-results/text-element-report.json',
      JSON.stringify(report, null, 2),
      'utf8'
    );

    console.log(`\n✅ Available Properties: ${report.stats.totalAvailable}`);
    console.log(`✅ Enabled by Default: ${report.stats.enabledByDefault}`);
    console.log(`✅ Tested: ${report.stats.totalTested}`);
    console.log(`✅ Working: ${report.stats.totalWorking}`);
    console.log(`❌ Broken: ${report.stats.totalBroken}`);

    if (results.workingProperties.length > 0) {
      console.log('\n✅ Working:');
      results.workingProperties.forEach(prop => console.log(`   ✅ ${prop}`));
    }

    if (results.brokenProperties.length > 0) {
      console.log('\n❌ Broken:');
      results.brokenProperties.forEach(b => {
        console.log(`   ❌ ${b.property}: ${b.issue}`);
      });
    }

    if (results.notes.length > 0) {
      console.log('\n📋 Notes:');
      results.notes.forEach(note => console.log(`   • ${note}`));
    }

    console.log('\n✅ Report saved to: test-results/text-element-report.json');
    console.log('📁 Screenshots saved to: test-results/text-*.png');
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});
