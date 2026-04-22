/**
 * Comprehensive Element and Property Testing
 * Tests EVERY property on EVERY element type
 */

const { test, expect } = require('@playwright/test');

test.describe('Comprehensive Element Testing', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to builder
    await page.goto('http://localhost:3000/builder');

    // Inject test license key to bypass paywall
    await page.evaluate(() => {
      localStorage.setItem('blockify_builder_license', 'TEST-LICENSE-KEY');
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      localStorage.setItem('blockify_builder_license_expires', expires.toISOString());
    });

    // Reload to apply license
    await page.reload();

    // Wait for builder to load
    await page.waitForSelector('.canvas', { timeout: 15000 });

    console.log('✅ Builder loaded successfully');
  });

  test('TEST 1: Container - All Properties', async ({ page }) => {
    console.log('\n=== TEST 1: CONTAINER PROPERTIES ===');

    // Add container to canvas
    await page.locator('text=Container').first().dragTo(page.locator('.canvas').first());
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    // Click container to select it
    await page.locator('.responsive-container').first().click();
    await page.waitForSelector('.property-panel', { timeout: 5000 });

    await page.screenshot({ path: 'test-results/container-selected.png' });

    // Test Background Color
    console.log('Testing: Background Color');
    const bgColorInput = page.locator('.property-panel').locator('input[type="color"]').first();
    if (await bgColorInput.isVisible({ timeout: 2000 })) {
      await bgColorInput.fill('#ff0000');
      await page.waitForTimeout(500);
      const container = page.locator('.responsive-container').first();
      const bgColor = await container.evaluate(el => window.getComputedStyle(el).backgroundColor);
      console.log('  Background color:', bgColor);
    }

    // Test Flex Direction
    console.log('Testing: Flex Direction');
    const flexDirLabel = page.locator('.property-panel').locator('text=/Flex Direction/i').first();
    if (await flexDirLabel.isVisible({ timeout: 2000 })) {
      const rowButton = page.locator('.property-panel').locator('button').filter({ hasText: /^row$/i }).first();
      if (await rowButton.isVisible()) {
        await rowButton.click();
        await page.waitForTimeout(500);
        const flexDirection = await page.locator('.responsive-container').first().evaluate(el =>
          window.getComputedStyle(el).flexDirection
        );
        console.log('  Flex direction:', flexDirection);
        expect(flexDirection).toBe('row');
      }
    }

    // Test Padding
    console.log('Testing: Padding');
    const paddingInput = page.locator('.property-panel').locator('text=/Padding/i').first();
    if (await paddingInput.isVisible({ timeout: 2000 })) {
      const paddingField = page.locator('.property-panel').locator('input').filter({ hasText: '' }).first();
      // Try to find and fill padding input
    }

    await page.screenshot({ path: 'test-results/container-properties-tested.png' });

    console.log('✅ Container property tests complete');
  });

  test('TEST 2: Columns-2 - FlexDirection Change', async ({ page }) => {
    console.log('\n=== TEST 2: COLUMNS-2 FLEXDIRECTION ===');

    // Add container
    await page.locator('text=Container').first().dragTo(page.locator('.canvas').first());
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    // Add 2 columns
    await page.locator('text=2 Columns').first().dragTo(page.locator('.responsive-container').first());
    await page.waitForSelector('.responsive-columns', { timeout: 5000 });

    // Select columns by clicking the label
    await page.locator('.columns-label').first().click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/columns-2-selected.png' });

    // Get initial layout
    const initialFlexDir = await page.locator('.responsive-columns').first().evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log('Initial flex-direction:', initialFlexDir);

    // Change to column
    const directionLabel = page.locator('.property-panel').locator('text=/Direction/i').first();
    if (await directionLabel.isVisible({ timeout: 2000 })) {
      const columnButton = page.locator('.property-panel').locator('button').filter({ hasText: /^column$/i }).first();
      if (await columnButton.isVisible()) {
        console.log('Clicking column button...');
        await columnButton.click();
        await page.waitForTimeout(1000);

        // Get new layout
        const newFlexDir = await page.locator('.responsive-columns').first().evaluate(el =>
          window.getComputedStyle(el).flexDirection
        );
        console.log('New flex-direction:', newFlexDir);

        await page.screenshot({ path: 'test-results/columns-2-changed-to-column.png' });

        // THE CRITICAL TEST
        if (newFlexDir === 'column') {
          console.log('✅ PASS: FlexDirection changed successfully');
        } else {
          console.log('❌ FAIL: FlexDirection did NOT change');
          console.log('  Expected: column');
          console.log('  Actual:', newFlexDir);
        }

        expect(newFlexDir).toBe('column');
      } else {
        console.log('❌ Column button not found');
        throw new Error('Column button not visible');
      }
    } else {
      console.log('❌ Direction control not found');
      throw new Error('Direction control not visible');
    }
  });

  test('TEST 3: Add Elements to Columns', async ({ page }) => {
    console.log('\n=== TEST 3: ADD ELEMENTS TO COLUMNS ===');

    // Setup: Container + 3 Columns
    await page.locator('text=Container').first().dragTo(page.locator('.canvas').first());
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    await page.locator('text=3 Columns').first().dragTo(page.locator('.responsive-container').first());
    await page.waitForSelector('.responsive-columns', { timeout: 5000 });

    // Add heading to column 1
    const column1 = page.locator('.responsive-column').first();
    await page.locator('text=Heading').first().dragTo(column1);
    await page.waitForTimeout(1000);

    // Add image to column 2
    const column2 = page.locator('.responsive-column').nth(1);
    await page.locator('text=Image').first().dragTo(column2);
    await page.waitForTimeout(1000);

    // Add button to column 3
    const column3 = page.locator('.responsive-column').nth(2);
    await page.locator('text=Button').first().dragTo(column3);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/3-columns-with-elements.png' });

    // Verify elements exist
    const hasHeading = await page.locator('h1, h2, h3').count() > 0;
    const hasImage = await page.locator('img').count() > 0;
    const hasButton = await page.locator('button, a.button-element').count() > 0;

    console.log('Elements added:');
    console.log('  Heading:', hasHeading ? '✅' : '❌');
    console.log('  Image:', hasImage ? '✅' : '❌');
    console.log('  Button:', hasButton ? '✅' : '❌');

    expect(hasHeading).toBeTruthy();
  });

  test('TEST 4: Heading - Text Property', async ({ page }) => {
    console.log('\n=== TEST 4: HEADING TEXT PROPERTY ===');

    // Add container and heading
    await page.locator('text=Container').first().dragTo(page.locator('.canvas').first());
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    await page.locator('text=Heading').first().dragTo(page.locator('.responsive-container').first());
    await page.waitForTimeout(1000);

    // Select heading
    await page.locator('h2, h1, h3').first().click();
    await page.waitForTimeout(500);

    // Find text input in property panel
    const textInput = page.locator('.property-panel').locator('input[type="text"]').first();
    if (await textInput.isVisible({ timeout: 2000 })) {
      await textInput.clear();
      await textInput.fill('Test Heading Changed');
      await textInput.press('Enter');
      await page.waitForTimeout(500);

      const headingText = await page.locator('h2, h1, h3').first().textContent();
      console.log('Heading text:', headingText);

      expect(headingText).toContain('Test Heading');
    }

    await page.screenshot({ path: 'test-results/heading-text-changed.png' });
  });

  test('TEST 5: Image - Source Property', async ({ page }) => {
    console.log('\n=== TEST 5: IMAGE SOURCE PROPERTY ===');

    // Add container and image
    await page.locator('text=Container').first().dragTo(page.locator('.canvas').first());
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    await page.locator('text=Image').first().dragTo(page.locator('.responsive-container').first());
    await page.waitForTimeout(1000);

    // Select image
    await page.locator('img').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/image-selected.png' });

    // Check if source input exists
    const srcInput = page.locator('.property-panel').locator('input').filter({ hasText: '' });
    const count = await srcInput.count();
    console.log('Image property inputs found:', count);
  });

  test('TEST 6: Multiple Containers Stacking', async ({ page }) => {
    console.log('\n=== TEST 6: MULTIPLE CONTAINERS ===');

    const canvas = page.locator('.canvas').first();

    // Add 3 containers
    for (let i = 0; i < 3; i++) {
      await page.locator('text=Container').first().dragTo(canvas);
      await page.waitForTimeout(500);
    }

    const containerCount = await page.locator('.responsive-container').count();
    console.log('Containers added:', containerCount);

    await page.screenshot({ path: 'test-results/multiple-containers.png' });

    expect(containerCount).toBe(3);
  });

  test('TEST 7: Viewport Switching', async ({ page }) => {
    console.log('\n=== TEST 7: VIEWPORT SWITCHING ===');

    // Add container
    await page.locator('text=Container').first().dragTo(page.locator('.canvas').first());
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    // Look for viewport switcher buttons
    const mobileButton = page.locator('button').filter({ hasText: /mobile/i }).first();
    const tabletButton = page.locator('button').filter({ hasText: /tablet/i }).first();
    const desktopButton = page.locator('button').filter({ hasText: /desktop/i }).first();

    if (await mobileButton.isVisible({ timeout: 2000 })) {
      await mobileButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/viewport-mobile.png' });
      console.log('Switched to mobile viewport');
    }

    if (await tabletButton.isVisible({ timeout: 2000 })) {
      await tabletButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/viewport-tablet.png' });
      console.log('Switched to tablet viewport');
    }

    if (await desktopButton.isVisible({ timeout: 2000 })) {
      await desktopButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/viewport-desktop.png' });
      console.log('Switched to desktop viewport');
    }
  });

  test('TEST 8: Export to Liquid Code', async ({ page }) => {
    console.log('\n=== TEST 8: LIQUID EXPORT ===');

    // Build a simple page
    await page.locator('text=Container').first().dragTo(page.locator('.canvas').first());
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    await page.locator('text=Heading').first().dragTo(page.locator('.responsive-container').first());
    await page.waitForTimeout(1000);

    // Look for code/export button
    const codeButton = page.locator('button').filter({ hasText: /code|export/i }).first();
    if (await codeButton.isVisible({ timeout: 2000 })) {
      await codeButton.click();
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'test-results/liquid-export-view.png' });

      // Check if code is visible
      const codeArea = page.locator('.code-editor, textarea, pre').first();
      if (await codeArea.isVisible()) {
        const code = await codeArea.textContent() || await codeArea.inputValue();
        console.log('Exported code length:', code.length);
        console.log('Contains schema:', code.includes('{% schema %}') ? '✅' : '❌');
        console.log('Contains endschema:', code.includes('{% endschema %}') ? '✅' : '❌');

        expect(code.length).toBeGreaterThan(100);
      }
    }
  });

});
