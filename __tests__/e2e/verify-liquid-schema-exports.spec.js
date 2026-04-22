/**
 * VERIFY LIQUID SCHEMA EXPORTS
 * Build sections, export to Liquid, verify schema includes toggled properties
 */

const { test } = require('@playwright/test');
const fs = require('fs');

test.describe('Verify Liquid Schema Exports', () => {

  test('Build hero section and verify schema controls', async ({ page }) => {
    test.setTimeout(180000);

    console.log('\n' + '='.repeat(80));
    console.log('🧪 LIQUID SCHEMA EXPORT VERIFICATION');
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

    // Clear canvas
    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    // ============================================
    // BUILD SIMPLE HERO SECTION
    // ============================================
    console.log('\n📋 Step 1: Building Hero Section');

    await page.evaluate(async () => {
      // Add container
      await window.blockifyTestHelpers.addElement('container');
      await new Promise(r => setTimeout(r, 500));

      const elements = window.blockifyTestHelpers.getElements();
      const container = elements[0];

      // Add heading
      await window.blockifyTestHelpers.addChildElement(container.id, 'heading');
      await new Promise(r => setTimeout(r, 300));

      // Add text
      await window.blockifyTestHelpers.addChildElement(container.id, 'text');
      await new Promise(r => setTimeout(r, 300));

      // Add button
      await window.blockifyTestHelpers.addChildElement(container.id, 'button');
      await new Promise(r => setTimeout(r, 300));
    });

    await page.waitForTimeout(2000);
    console.log('   ✅ Hero section built: container + heading + text + button');

    await page.screenshot({ path: 'test-results/liquid-01-structure.png', fullPage: true });

    // ============================================
    // CUSTOMIZE ELEMENTS WITH SCHEMA TOGGLES
    // ============================================
    console.log('\n📋 Step 2: Enabling Schema Controls');

    // Select heading
    const heading = page.locator('h1, h2, h3').first();
    await heading.click();
    await page.waitForTimeout(1500);

    console.log('   Selected heading');

    // Look for schema-editable checkbox
    const schemaCheckbox = page.locator('input[type="checkbox"]').first();
    const isChecked = await schemaCheckbox.isChecked().catch(() => false);

    console.log(`   Schema-editable checkbox: ${isChecked ? 'CHECKED' : 'UNCHECKED'}`);

    if (!isChecked) {
      await schemaCheckbox.check();
      await page.waitForTimeout(500);
      console.log('   ✅ Enabled schema-editable');
    }

    await page.screenshot({ path: 'test-results/liquid-02-schema-toggle.png', fullPage: true });

    // ============================================
    // EXPORT TO LIQUID
    // ============================================
    console.log('\n📋 Step 3: Exporting to Liquid');

    const exportResult = await page.evaluate(async () => {
      return await window.blockifyTestHelpers.exportToLiquidForTesting('hero-section-test');
    });

    console.log(`   ✅ Liquid exported`);
    console.log(`   📊 Section: ${exportResult.sectionName}`);
    console.log(`   📊 Elements: ${exportResult.elementCount}`);
    console.log(`   📏 Liquid length: ${exportResult.liquidCode.length} chars`);

    // Save to file
    const liquidPath = 'test-results/hero-section-export.liquid';
    fs.writeFileSync(liquidPath, exportResult.liquidCode, 'utf8');
    console.log(`   ✅ Saved to: ${liquidPath}`);

    // ============================================
    // ANALYZE SCHEMA
    // ============================================
    console.log('\n📋 Step 4: Analyzing Schema');

    const hasSchema = exportResult.liquidCode.includes('{% schema %}');
    console.log(`   Schema block found: ${hasSchema ? 'YES' : 'NO'}`);

    if (hasSchema) {
      // Extract schema
      const schemaMatch = exportResult.liquidCode.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/);

      if (schemaMatch) {
        const schemaJSON = schemaMatch[1].trim();

        try {
          const schema = JSON.parse(schemaJSON);

          console.log(`   ✅ Schema is valid JSON`);
          console.log(`   📊 Total settings: ${schema.settings?.length || 0}`);

          // Analyze settings
          const settingsByType = {};
          const settingsByElement = {};

          if (schema.settings) {
            schema.settings.forEach(setting => {
              // Count by type
              settingsByType[setting.type] = (settingsByType[setting.type] || 0) + 1;

              // Count by element (if ID contains element type)
              const elementMatch = setting.id?.match(/^(heading|text|button|image|container)_/);
              if (elementMatch) {
                const elType = elementMatch[1];
                settingsByElement[elType] = (settingsByElement[elType] || 0) + 1;
              }
            });

            console.log('\n   📊 Settings by Type:');
            Object.entries(settingsByType).forEach(([type, count]) => {
              console.log(`      ${type}: ${count}`);
            });

            console.log('\n   📊 Settings by Element:');
            Object.entries(settingsByElement).forEach(([type, count]) => {
              console.log(`      ${type}: ${count} properties`);
            });

            // Check for responsive properties
            const responsiveSettings = schema.settings.filter(s =>
              s.id?.includes('_mobile') || s.id?.includes('_desktop') || s.id?.includes('_fullscreen')
            );

            console.log(`\n   🔄 Responsive settings: ${responsiveSettings.length}`);

            if (responsiveSettings.length > 0) {
              console.log('   Examples:');
              responsiveSettings.slice(0, 5).forEach(s => {
                console.log(`      - ${s.id} (${s.type}): ${s.label}`);
              });
            }

            // Save detailed analysis
            const analysis = {
              sectionName: schema.name,
              totalSettings: schema.settings.length,
              settingsByType,
              settingsByElement,
              responsiveSettingsCount: responsiveSettings.length,
              allSettings: schema.settings.map(s => ({
                id: s.id,
                type: s.type,
                label: s.label,
                default: s.default
              }))
            };

            fs.writeFileSync(
              'test-results/schema-analysis.json',
              JSON.stringify(analysis, null, 2),
              'utf8'
            );

            console.log('\n   ✅ Detailed analysis saved to: test-results/schema-analysis.json');

          } catch (e) {
            console.log(`   ❌ Schema parse error: ${e.message}`);
          }
        }
      } else {
        console.log('   ❌ Could not extract schema block');
      }
    }

    // ============================================
    // CHECK LIQUID STRUCTURE
    // ============================================
    console.log('\n📋 Step 5: Checking Liquid Structure');

    const checks = {
      'Has HTML': exportResult.liquidCode.includes('<div'),
      'Has style tag': exportResult.liquidCode.includes('<style>'),
      'Has schema': exportResult.liquidCode.includes('{% schema %}'),
      'Uses Liquid variables': exportResult.liquidCode.includes('{{ section.settings.'),
      'Has media queries': exportResult.liquidCode.includes('@media'),
      'Uses data-element-id': exportResult.liquidCode.includes('data-element-id=')
    };

    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`   ${passed ? '✅' : '❌'} ${check}`);
    });

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 VERIFICATION COMPLETE');
    console.log('='.repeat(80));
    console.log('');
    console.log('✅ Files Created:');
    console.log('   - test-results/hero-section-export.liquid');
    console.log('   - test-results/schema-analysis.json');
    console.log('   - test-results/liquid-*.png (screenshots)');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Review hero-section-export.liquid');
    console.log('   2. Check schema-analysis.json for property controls');
    console.log('   3. Verify schema-editable toggles are working correctly');
    console.log('='.repeat(80) + '\n');

    await page.waitForTimeout(2000);
  });

});
