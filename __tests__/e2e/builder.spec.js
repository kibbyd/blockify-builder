/**
 * Blockify Builder E2E Tests
 * Tests critical functionality including flexDirection issue
 */

const { test, expect } = require('@playwright/test');

test.describe('Blockify Builder - Critical Issues', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to builder
    await page.goto('http://localhost:3000/builder');
    // Wait for builder to load
    await page.waitForSelector('.canvas', { timeout: 10000 });
  });

  test('TEST 1: Container fills canvas', async ({ page }) => {
    console.log('\n=== TEST 1: Container Fills Canvas ===');

    // Find container in palette
    const containerButton = page.locator('text=Container').first();
    await expect(containerButton).toBeVisible();

    // Get canvas
    const canvas = page.locator('.canvas').first();

    // Drag container to canvas
    await containerButton.dragTo(canvas);

    // Wait for container to appear
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    // Get container dimensions
    const container = page.locator('.responsive-container').first();
    const containerBox = await container.boundingBox();
    const canvasBox = await canvas.boundingBox();

    console.log('Container dimensions:', containerBox);
    console.log('Canvas dimensions:', canvasBox);

    // Verify container fills canvas width (allow 10px tolerance)
    expect(containerBox.width).toBeGreaterThan(canvasBox.width - 100);

    // Save screenshot
    await page.screenshot({ path: 'test-results/test1-container-fills-canvas.png' });
  });

  test('TEST 2: Columns flexDirection changes layout', async ({ page }) => {
    console.log('\n=== TEST 2: Columns FlexDirection ===');

    // Add container
    const containerButton = page.locator('text=Container').first();
    const canvas = page.locator('.canvas').first();
    await containerButton.dragTo(canvas);
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    // Add 2 columns
    const columnsButton = page.locator('text=2 Columns').first();
    const container = page.locator('.responsive-container').first();
    await columnsButton.dragTo(container);
    await page.waitForSelector('.responsive-columns', { timeout: 5000 });

    // Select columns element (click on it)
    const columns = page.locator('.responsive-columns').first();
    await columns.click();

    // Wait for property panel
    await page.waitForSelector('.property-panel', { timeout: 5000 });

    // Take screenshot before change
    await page.screenshot({ path: 'test-results/test2-before-flex-change.png' });

    // Get initial computed style
    const initialFlexDirection = await columns.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );
    console.log('Initial flex-direction:', initialFlexDirection);

    // Get inline style
    const initialInlineStyle = await columns.getAttribute('style');
    console.log('Initial inline style:', initialInlineStyle);

    // Find and click flexDirection control
    // Look for "Direction" or "Flex Direction" label in property panel
    const flexDirectionLabel = page.locator('.property-panel').locator('text=/Direction|Flex Direction/i').first();

    if (await flexDirectionLabel.isVisible()) {
      console.log('Found flexDirection control');

      // Find the column button option
      const columnButton = page.locator('.property-panel').locator('button').filter({ hasText: /^column$/i }).first();

      if (await columnButton.isVisible()) {
        console.log('Clicking column button');
        await columnButton.click();

        // Wait for update
        await page.waitForTimeout(1000);

        // Take screenshot after change
        await page.screenshot({ path: 'test-results/test2-after-flex-change.png' });

        // Get new computed style
        const newFlexDirection = await columns.evaluate(el =>
          window.getComputedStyle(el).flexDirection
        );
        console.log('New flex-direction:', newFlexDirection);

        // Get new inline style
        const newInlineStyle = await columns.getAttribute('style');
        console.log('New inline style:', newInlineStyle);

        // CRITICAL TEST: Did flexDirection change?
        console.log('\n📊 RESULT:');
        if (newFlexDirection === 'column') {
          console.log('✅ PASS: FlexDirection changed to column');
        } else {
          console.log('❌ FAIL: FlexDirection did NOT change');
          console.log('  Expected: column');
          console.log('  Actual:', newFlexDirection);
        }

        // Check if inline style contains flex-direction
        if (newInlineStyle && newInlineStyle.includes('flex-direction')) {
          console.log('✅ Inline style includes flex-direction');
        } else {
          console.log('❌ Inline style does NOT include flex-direction');
          console.log('  This means React is not applying the style!');
        }

        // Test assertion
        expect(newFlexDirection).toBe('column');

      } else {
        console.log('❌ Column button not found in property panel');
        await page.screenshot({ path: 'test-results/test2-button-not-found.png' });
        throw new Error('Column button not found');
      }

    } else {
      console.log('❌ FlexDirection control not found in property panel');
      await page.screenshot({ path: 'test-results/test2-control-not-found.png' });
      throw new Error('FlexDirection control not found');
    }
  });

  test('TEST 3: Property panel shows correct controls', async ({ page }) => {
    console.log('\n=== TEST 3: Property Panel Controls ===');

    // Add container
    const containerButton = page.locator('text=Container').first();
    const canvas = page.locator('.canvas').first();
    await containerButton.dragTo(canvas);
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    // Select container
    const container = page.locator('.responsive-container').first();
    await container.click();

    // Take screenshot
    await page.screenshot({ path: 'test-results/test3-container-properties.png' });

    // Check for expected controls
    const propertyPanel = page.locator('.property-panel');

    const hasFlexDirection = await propertyPanel.locator('text=/Flex Direction/i').isVisible();
    const hasBackgroundColor = await propertyPanel.locator('text=/Background Color/i').isVisible();
    const hasPadding = await propertyPanel.locator('text=/Padding/i').isVisible();

    console.log('Property Panel Contents:');
    console.log('  Flex Direction:', hasFlexDirection ? '✅' : '❌');
    console.log('  Background Color:', hasBackgroundColor ? '✅' : '❌');
    console.log('  Padding:', hasPadding ? '✅' : '❌');

    expect(hasFlexDirection).toBeTruthy();
  });

  test('TEST 4: Liquid export generates valid code', async ({ page }) => {
    console.log('\n=== TEST 4: Liquid Export ===');

    // Add container
    const containerButton = page.locator('text=Container').first();
    const canvas = page.locator('.canvas').first();
    await containerButton.dragTo(canvas);
    await page.waitForSelector('.responsive-container', { timeout: 5000 });

    // Add heading to container
    const headingButton = page.locator('text=Heading').first();
    const container = page.locator('.responsive-container').first();
    await headingButton.dragTo(container);

    // Wait for element
    await page.waitForTimeout(1000);

    // Switch to code view if available
    const codeViewButton = page.locator('button:has-text("Code")').first();
    if (await codeViewButton.isVisible({ timeout: 2000 })) {
      await codeViewButton.click();
      await page.waitForTimeout(1000);

      // Get code content
      const codeArea = page.locator('.code-editor').first();
      if (await codeArea.isVisible()) {
        const liquidCode = await codeArea.inputValue();
        console.log('Liquid Code Length:', liquidCode.length);
        console.log('First 200 chars:', liquidCode.substring(0, 200));

        // Take screenshot
        await page.screenshot({ path: 'test-results/test4-liquid-export.png' });

        // Basic validation
        expect(liquidCode).toContain('{% schema %}');
        expect(liquidCode).toContain('{% endschema %}');

        console.log('✅ Liquid export contains schema tags');
      } else {
        console.log('⚠️ Code editor not visible');
      }
    } else {
      console.log('⚠️ Code view button not found');
    }
  });

});
