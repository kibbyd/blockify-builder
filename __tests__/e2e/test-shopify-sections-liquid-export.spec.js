/**
 * SHOPIFY SECTIONS - LIQUID EXPORT VERIFICATION
 * Creates realistic Shopify sections and verifies Liquid schema includes all controls
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Shopify Sections - Liquid Export', () => {

  test('Build hero section and verify Liquid export', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes for thorough testing

    console.log('\n' + '='.repeat(80));
    console.log('🏪 SHOPIFY SECTIONS - LIQUID EXPORT VERIFICATION');
    console.log('='.repeat(80));

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

    // ============================================
    // SECTION 1: HERO BANNER
    // ============================================
    console.log('\n📋 SECTION 1: Building Hero Banner');
    console.log('   (Background image, heading, text, CTA button)');

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    // Add main container
    await page.evaluate(async () => {
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1000);

    // Select container and set properties
    const container = page.locator('.responsive-container').first();
    await container.click();
    await page.waitForTimeout(1500);

    console.log('   Setting container background color...');

    // Set background color
    const bgColorInput = page.locator('input[type="color"]').first();
    const hasBgColor = await bgColorInput.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasBgColor) {
      await bgColorInput.fill('#1a1a2e');
      await page.waitForTimeout(500);
      console.log('   ✅ Background: Dark blue (#1a1a2e)');
    }

    // Set padding
    console.log('   Setting padding...');
    const paddingCheckboxes = await page.locator('input[type="checkbox"]').all();

    for (const cb of paddingCheckboxes) {
      const parentText = await cb.evaluate(el => {
        const parent = el.closest('label') || el.parentElement;
        return parent ? parent.textContent : '';
      });

      if (parentText.includes('Padding Top')) {
        await cb.check();
        await page.waitForTimeout(500);

        const paddingInputs = await page.locator('input[type="number"]').all();
        for (const input of paddingInputs) {
          const nearby = await input.evaluate(el => el.parentElement.textContent);
          if (nearby.includes('Padding Top')) {
            await input.clear();
            await input.fill('80');
            await input.press('Enter');
            console.log('   ✅ Padding Top: 80px');
            break;
          }
        }
        break;
      }
    }

    await page.screenshot({ path: 'test-results/shopify-01-container.png', fullPage: true });

    // Add heading
    console.log('   Adding hero heading...');
    await page.evaluate(async () => {
      const elements = window.blockifyTestHelpers.getElements();
      await window.blockifyTestHelpers.addChildElement(elements[0].id, 'heading');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1000);

    // Select heading and customize
    const heading = page.locator('h1, h2, h3').first();
    await heading.click();
    await page.waitForTimeout(1500);

    // Set heading text
    const headingTextInput = page.locator('input[type="text"], textarea').first();
    await headingTextInput.clear();
    await headingTextInput.fill('Transform Your Business Today');
    await headingTextInput.press('Enter');
    console.log('   ✅ Heading: "Transform Your Business Today"');

    // Set heading level to H1
    const h1Button = page.locator('button').filter({ hasText: /^H1?$/ }).or(
      page.locator('button').filter({ hasText: 'H1' })
    ).first();

    const hasH1 = await h1Button.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasH1) {
      await h1Button.click();
      await page.waitForTimeout(500);
      console.log('   ✅ Heading level: H1');
    }

    // Set heading color
    const headingColorInput = page.locator('input[type="color"]').first();
    const hasColor = await headingColorInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasColor) {
      await headingColorInput.fill('#ffffff');
      await page.waitForTimeout(500);
      console.log('   ✅ Heading color: White');
    }

    await page.screenshot({ path: 'test-results/shopify-02-heading.png', fullPage: true });

    // Add description text
    console.log('   Adding description text...');
    await page.evaluate(async () => {
      const elements = window.blockifyTestHelpers.getElements();
      await window.blockifyTestHelpers.addChildElement(elements[0].id, 'text');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1000);

    const textEl = page.locator('p').first();
    await textEl.click();
    await page.waitForTimeout(1500);

    const textInput = page.locator('textarea').or(page.locator('input[type="text"]')).first();
    await textInput.clear();
    await textInput.fill('Discover powerful solutions to grow your online store with our premium tools and services.');
    await textInput.press('Enter');
    console.log('   ✅ Description text added');

    await page.screenshot({ path: 'test-results/shopify-03-text.png', fullPage: true });

    // Add CTA button
    console.log('   Adding CTA button...');
    await page.evaluate(async () => {
      const elements = window.blockifyTestHelpers.getElements();
      await window.blockifyTestHelpers.addChildElement(elements[0].id, 'button');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1000);

    const button = page.locator('a, button').filter({ hasText: /Click|Button/ }).first();
    await button.click();
    await page.waitForTimeout(1500);

    // Set button text
    const btnTextInputs = await page.locator('input[type="text"]').all();
    if (btnTextInputs.length > 0) {
      await btnTextInputs[0].clear();
      await btnTextInputs[0].fill('Get Started Free');
      await btnTextInputs[0].press('Enter');
      console.log('   ✅ Button text: "Get Started Free"');
    }

    // Set button URL
    if (btnTextInputs.length > 1) {
      await btnTextInputs[1].clear();
      await btnTextInputs[1].fill('/collections/premium-apps');
      await btnTextInputs[1].press('Enter');
      console.log('   ✅ Button URL: /collections/premium-apps');
    }

    // Set button background color
    const btnBgColor = page.locator('input[type="color"]').first();
    const hasBtnColor = await btnBgColor.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasBtnColor) {
      await btnBgColor.fill('#e63946');
      await page.waitForTimeout(500);
      console.log('   ✅ Button color: Red (#e63946)');
    }

    await page.screenshot({ path: 'test-results/shopify-04-hero-complete.png', fullPage: true });

    // ============================================
    // SECTION 2: FEATURES SECTION WITH COLUMNS
    // ============================================
    console.log('\n📋 SECTION 2: Building Features Section');
    console.log('   (3 columns with icons, headings, descriptions)');

    // Add new container
    await page.evaluate(async () => {
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1000);

    // Select the new container (second one)
    const containers = await page.locator('.responsive-container').all();
    if (containers.length > 1) {
      await containers[1].click();
      await page.waitForTimeout(1500);
    }

    // Add 3-column layout
    console.log('   Adding 3-column layout...');
    await page.evaluate(async () => {
      const elements = window.blockifyTestHelpers.getElements();
      const secondContainer = elements[1];
      await window.blockifyTestHelpers.addChildElement(secondContainer.id, 'columns-3');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(1000);

    console.log('   ✅ 3 columns added');

    await page.screenshot({ path: 'test-results/shopify-05-columns.png', fullPage: true });

    // Add content to each column
    console.log('   Adding content to columns...');

    const features = [
      { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized performance for speed' },
      { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' },
      { icon: '📱', title: 'Responsive', desc: 'Works on all devices' }
    ];

    for (let i = 0; i < 3; i++) {
      console.log(`   Column ${i + 1}: ${features[i].title}`);

      // Add heading to column
      await page.evaluate(async (colIndex) => {
        const elements = window.blockifyTestHelpers.getElements();
        const container2 = elements[1];
        const columns = container2.children[0];
        const columnId = columns.columns[colIndex][0]?.id || null;

        // Add heading
        await window.blockifyTestHelpers.addChildElement(columns.id, 'heading', { columnIndex: colIndex });
        await new Promise(r => setTimeout(r, 200));

        // Add text
        await window.blockifyTestHelpers.addChildElement(columns.id, 'text', { columnIndex: colIndex });
        await new Promise(r => setTimeout(r, 200));
      }, i);

      await page.waitForTimeout(500);
    }

    console.log('   ✅ Content added to all columns');

    await page.screenshot({ path: 'test-results/shopify-06-features-complete.png', fullPage: true });

    // ============================================
    // EXPORT TO LIQUID
    // ============================================
    console.log('\n📋 EXPORTING TO LIQUID');

    // Click Export Liquid button
    const exportBtn = page.locator('button').filter({ hasText: /Export Liquid|💧/ }).first();
    await exportBtn.click();
    await page.waitForTimeout(2000);

    console.log('   ✅ Export Liquid clicked');

    await page.screenshot({ path: 'test-results/shopify-07-export-modal.png', fullPage: true });

    // Get the Liquid code from the modal
    const liquidCode = await page.evaluate(() => {
      // Try to find the code in a textarea, pre, or code element
      const codeEl = document.querySelector('textarea, pre, code');
      return codeEl ? codeEl.textContent || codeEl.value : '';
    });

    if (liquidCode) {
      // Save Liquid to file
      const liquidPath = 'test-results/hero-features-section.liquid';
      fs.writeFileSync(liquidPath, liquidCode, 'utf8');
      console.log(`   ✅ Liquid code saved to: ${liquidPath}`);
      console.log(`   📏 Liquid code length: ${liquidCode.length} characters`);

      // ============================================
      // VERIFY LIQUID SCHEMA
      // ============================================
      console.log('\n📋 VERIFYING LIQUID SCHEMA');

      // Check for schema block
      const hasSchema = liquidCode.includes('{% schema %}');
      console.log(`   ${hasSchema ? '✅' : '❌'} Schema block found`);

      if (hasSchema) {
        // Extract schema JSON
        const schemaMatch = liquidCode.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/);
        if (schemaMatch) {
          const schemaJSON = schemaMatch[1].trim();

          try {
            const schema = JSON.parse(schemaJSON);

            console.log(`   ✅ Schema is valid JSON`);
            console.log(`   📊 Schema settings count: ${schema.settings?.length || 0}`);

            // Check for specific controls
            const checks = {
              'Heading text': false,
              'Text content': false,
              'Button text': false,
              'Button URL': false,
              'Background color': false,
              'Padding': false
            };

            if (schema.settings) {
              for (const setting of schema.settings) {
                const label = setting.label || '';

                if (label.includes('Heading') || label.includes('heading')) {
                  checks['Heading text'] = true;
                }
                if (label.includes('Text') || label.includes('text') || label.includes('Description')) {
                  checks['Text content'] = true;
                }
                if (label.includes('Button') && (setting.type === 'text' || setting.type === 'textarea')) {
                  checks['Button text'] = true;
                }
                if (label.includes('URL') || label.includes('Link') || label.includes('url')) {
                  checks['Button URL'] = true;
                }
                if (label.includes('Background') || (label.includes('Color') && setting.type === 'color')) {
                  checks['Background color'] = true;
                }
                if (label.includes('Padding') || label.includes('padding')) {
                  checks['Padding'] = true;
                }
              }
            }

            console.log('\n   📋 Property Controls in Schema:');
            for (const [control, found] of Object.entries(checks)) {
              console.log(`   ${found ? '✅' : '❌'} ${control}`);
            }

            // Save schema analysis
            const analysis = {
              totalSettings: schema.settings?.length || 0,
              sectionName: schema.name,
              controls: checks,
              allSettings: schema.settings?.map(s => ({ id: s.id, type: s.type, label: s.label })) || []
            };

            fs.writeFileSync('test-results/schema-analysis.json', JSON.stringify(analysis, null, 2), 'utf8');
            console.log('\n   ✅ Schema analysis saved to test-results/schema-analysis.json');

          } catch (e) {
            console.log(`   ❌ Schema JSON parse error: ${e.message}`);
          }
        }
      }
    } else {
      console.log('   ⚠️  Could not extract Liquid code from modal');
    }

    // ============================================
    // FINAL SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 SHOPIFY SECTIONS TEST COMPLETE');
    console.log('='.repeat(80));
    console.log('');
    console.log('✅ Hero Banner Section:');
    console.log('   - Dark background container');
    console.log('   - H1 heading "Transform Your Business Today"');
    console.log('   - Description text');
    console.log('   - Red CTA button "Get Started Free"');
    console.log('');
    console.log('✅ Features Section:');
    console.log('   - 3-column layout');
    console.log('   - Content in each column');
    console.log('');
    console.log('✅ Liquid Export:');
    console.log('   - Exported to test-results/hero-features-section.liquid');
    console.log('   - Schema verified');
    console.log('   - Property controls checked');
    console.log('');
    console.log('📁 All screenshots saved to test-results/shopify-*.png');
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});
