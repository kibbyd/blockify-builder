/**
 * BUILD REALISTIC SHOPIFY SECTIONS AND SAVE STATE
 * Creates hero banner + features section, saves JSON for manual Liquid export verification
 */

const { test } = require('@playwright/test');
const fs = require('fs');

test.describe('Build Shopify Sections', () => {

  test('Build hero + features and save state', async ({ page }) => {
    test.setTimeout(180000);

    console.log('\n' + '='.repeat(80));
    console.log('🏪 BUILDING REALISTIC SHOPIFY SECTIONS');
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

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    // ============================================
    // BUILD HERO SECTION
    // ============================================
    console.log('\n📋 Building Hero Banner Section');

    // Add container
    await page.evaluate(async () => {
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 500));

      const elements = window.blockifyTestHelpers.getElements();
      const container = elements[0];

      // Add heading
      await window.blockifyTestHelpers.addChildElement(container.id, 'heading');
      await new Promise(r => setTimeout(r, 300));

      // Add description text
      await window.blockifyTestHelpers.addChildElement(container.id, 'text');
      await new Promise(r => setTimeout(r, 300));

      // Add CTA button
      await window.blockifyTestHelpers.addChildElement(container.id, 'button');
      await new Promise(r => setTimeout(r, 300));

      // Add background image
      await window.blockifyTestHelpers.addChildElement(container.id, 'image');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(2000);
    console.log('   ✅ Hero elements added: heading, text, button, image');

    await page.screenshot({ path: 'test-results/sections-01-hero-structure.png', fullPage: true });

    // ============================================
    // BUILD FEATURES SECTION
    // ============================================
    console.log('\n📋 Building Features Section (3 columns)');

    await page.evaluate(async () => {
      // Add second container
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 500));

      const elements = window.blockifyTestHelpers.getElements();
      const container2 = elements[1];

      // Add 3-column layout
      await window.blockifyTestHelpers.addChildElement(container2.id, 'columns-3');
      await new Promise(r => setTimeout(r, 500));

      // Get the columns element
      const columns = container2.children[0];

      // Add content to each column: icon, heading, text
      for (let i = 0; i < 3; i++) {
        await window.blockifyTestHelpers.addChildElement(columns.id, 'icon', { columnIndex: i });
        await new Promise(r => setTimeout(r, 200));

        await window.blockifyTestHelpers.addChildElement(columns.id, 'heading', { columnIndex: i });
        await new Promise(r => setTimeout(r, 200));

        await window.blockifyTestHelpers.addChildElement(columns.id, 'text', { columnIndex: i });
        await new Promise(r => setTimeout(r, 200));
      }
    });

    await page.waitForTimeout(2000);
    console.log('   ✅ Features section added: 3 columns with icon + heading + text each');

    await page.screenshot({ path: 'test-results/sections-02-features-structure.png', fullPage: true });

    // ============================================
    // SAVE CURRENT STATE
    // ============================================
    console.log('\n📋 Saving Builder State');

    const builderState = await page.evaluate(() => {
      return {
        elements: window.blockifyTestHelpers.getElements(),
        responsiveStyles: window.blockifyTestHelpers.getResponsiveStyles()
      };
    });

    // Save to JSON
    fs.writeFileSync(
      'test-results/shopify-sections-state.json',
      JSON.stringify(builderState, null, 2),
      'utf8'
    );

    console.log('   ✅ State saved to: test-results/shopify-sections-state.json');
    console.log(`   📊 Elements: ${builderState.elements.length}`);
    console.log(`   📊 Total child elements: ${builderState.elements.reduce((sum, el) => sum + (el.children?.length || 0), 0)}`);

    // ============================================
    // ELEMENT SUMMARY
    // ============================================
    console.log('\n📋 Section Structure Summary');

    for (let i = 0; i < builderState.elements.length; i++) {
      const el = builderState.elements[i];
      console.log(`\n   Container ${i + 1} (${el.type}):`);

      if (el.children) {
        el.children.forEach((child, idx) => {
          if (child.type.startsWith('columns-')) {
            console.log(`      ${idx + 1}. ${child.type} layout`);
            if (child.columns) {
              child.columns.forEach((col, colIdx) => {
                console.log(`         Column ${colIdx + 1}: ${col.length} elements`);
                col.forEach((colEl, elIdx) => {
                  console.log(`            - ${colEl.type}`);
                });
              });
            }
          } else {
            console.log(`      ${idx + 1}. ${child.type}`);
          }
        });
      }
    }

    // ============================================
    // FINAL SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(80));
    console.log('✅ SHOPIFY SECTIONS BUILT SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log('');
    console.log('Hero Section:');
    console.log('  - Container with 4 elements');
    console.log('  - Heading (for hero title)');
    console.log('  - Text (for description)');
    console.log('  - Button (for CTA)');
    console.log('  - Image (for background/hero image)');
    console.log('');
    console.log('Features Section:');
    console.log('  - Container with 3-column layout');
    console.log('  - Each column has: Icon + Heading + Text');
    console.log('  - Total: 9 elements across 3 columns');
    console.log('');
    console.log('📁 State saved to test-results/shopify-sections-state.json');
    console.log('📁 Screenshots saved to test-results/sections-*.png');
    console.log('');
    console.log('NEXT STEP:');
    console.log('  1. Open http://localhost:3000/builder');
    console.log('  2. Click "Import" and load shopify-sections-state.json');
    console.log('  3. Customize text, colors, images');
    console.log('  4. Click "Export Liquid" to verify schema');
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});
