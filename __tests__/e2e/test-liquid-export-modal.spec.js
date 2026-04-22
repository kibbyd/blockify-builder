const { test, expect } = require('@playwright/test');

test.describe('Liquid Export Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the builder
    await page.goto('http://localhost:3000/builder');

    // Wait for builder to load
    await page.waitForSelector('.block-builder', { timeout: 10000 });

    // Wait a bit for everything to initialize
    await page.waitForTimeout(1000);
  });

  test('should show export options dialog when Export Liquid button is clicked', async ({ page }) => {
    // Click Export Liquid button
    await page.click('button:has-text("Export Liquid")');

    // Should show section name prompt
    await page.waitForTimeout(500);

    // Check that dialog appears (browser prompt)
    // Note: We'll handle the prompt by accepting it
  });

  test('should display Liquid code modal when choosing option 1', async ({ page }) => {
    // Add a test element first
    await page.evaluate(() => {
      window.blockifyTestHelpers.addElement('heading');
    });

    await page.waitForTimeout(500);

    // Set up dialog handlers
    let dialogCount = 0;
    page.on('dialog', async dialog => {
      console.log(`Dialog ${dialogCount}: ${dialog.message()}`);

      if (dialogCount === 0) {
        // First dialog: section name
        await dialog.accept('test-section');
      } else if (dialogCount === 1) {
        // Second dialog: export options
        await dialog.accept('1'); // Choose "View/Copy Code"
      }
      dialogCount++;
    });

    // Click Export Liquid button
    await page.click('button:has-text("Export Liquid")');

    // Wait for modal to appear
    await page.waitForSelector('div:has-text("💧 Exported Liquid Code")', { timeout: 5000 });

    // Verify modal is visible
    const modal = await page.$('div:has-text("💧 Exported Liquid Code")');
    expect(modal).toBeTruthy();

    // Verify code is displayed in pre tag
    const codeBlock = await page.$('pre');
    expect(codeBlock).toBeTruthy();

    // Get the code content
    const codeContent = await codeBlock.textContent();

    // Verify it contains Liquid syntax
    expect(codeContent).toContain('<style>');
    expect(codeContent).toContain('{% schema %}');
    expect(codeContent).toContain('section.settings');

    console.log('✅ Modal displayed with Liquid code');
    console.log(`Code length: ${codeContent.length} characters`);
  });

  test('should copy code to clipboard when copy button is clicked', async ({ page }) => {
    // Add a test element
    await page.evaluate(() => {
      window.blockifyTestHelpers.addElement('heading');
    });

    await page.waitForTimeout(500);

    // Set up dialog handlers
    let dialogCount = 0;
    page.on('dialog', async dialog => {
      if (dialogCount === 0) {
        await dialog.accept('test-section');
      } else if (dialogCount === 1) {
        await dialog.accept('1'); // View/Copy
      } else if (dialogCount === 2) {
        // Success alert
        console.log('Copy success alert:', dialog.message());
        await dialog.accept();
      }
      dialogCount++;
    });

    // Click Export Liquid button
    await page.click('button:has-text("Export Liquid")');

    // Wait for modal
    await page.waitForSelector('button:has-text("Copy to Clipboard")', { timeout: 5000 });

    // Click copy button
    await page.click('button:has-text("Copy to Clipboard")');

    // Verify clipboard contains Liquid code
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboardText).toContain('<style>');
    expect(clipboardText).toContain('{% schema %}');

    console.log('✅ Code copied to clipboard successfully');
    console.log(`Clipboard length: ${clipboardText.length} characters`);
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    // Add a test element
    await page.evaluate(() => {
      window.blockifyTestHelpers.addElement('heading');
    });

    await page.waitForTimeout(500);

    // Set up dialog handlers
    let dialogCount = 0;
    page.on('dialog', async dialog => {
      if (dialogCount === 0) {
        await dialog.accept('test-section');
      } else if (dialogCount === 1) {
        await dialog.accept('1');
      }
      dialogCount++;
    });

    // Open modal
    await page.click('button:has-text("Export Liquid")');
    await page.waitForSelector('button:has-text("Close")', { timeout: 5000 });

    // Click close button
    await page.click('button:has-text("Close")');

    // Wait a bit
    await page.waitForTimeout(300);

    // Verify modal is gone
    const modal = await page.$('div:has-text("💧 Exported Liquid Code")');
    expect(modal).toBeNull();

    console.log('✅ Modal closed successfully');
  });

  test('should close modal when clicking outside', async ({ page }) => {
    // Add a test element
    await page.evaluate(() => {
      window.blockifyTestHelpers.addElement('heading');
    });

    await page.waitForTimeout(500);

    // Set up dialog handlers
    let dialogCount = 0;
    page.on('dialog', async dialog => {
      if (dialogCount === 0) {
        await dialog.accept('test-section');
      } else if (dialogCount === 1) {
        await dialog.accept('1');
      }
      dialogCount++;
    });

    // Open modal
    await page.click('button:has-text("Export Liquid")');
    await page.waitForSelector('div:has-text("💧 Exported Liquid Code")', { timeout: 5000 });

    // Click on the backdrop (outside modal)
    await page.click('body', { position: { x: 10, y: 10 } });

    // Wait a bit
    await page.waitForTimeout(300);

    // Verify modal is gone
    const modal = await page.$('div:has-text("💧 Exported Liquid Code")');
    expect(modal).toBeNull();

    console.log('✅ Modal closed by clicking outside');
  });

  test('should export correct Liquid code for different element types', async ({ page }) => {
    // Add multiple element types
    await page.evaluate(() => {
      window.blockifyTestHelpers.addElement('heading');
      window.blockifyTestHelpers.addElement('text');
      window.blockifyTestHelpers.addElement('button');
    });

    await page.waitForTimeout(500);

    // Set up dialog handlers
    let dialogCount = 0;
    let liquidCode = '';

    page.on('dialog', async dialog => {
      if (dialogCount === 0) {
        await dialog.accept('multi-element-test');
      } else if (dialogCount === 1) {
        await dialog.accept('1');
      }
      dialogCount++;
    });

    // Export
    await page.click('button:has-text("Export Liquid")');
    await page.waitForSelector('pre', { timeout: 5000 });

    // Get code
    const codeBlock = await page.$('pre');
    liquidCode = await codeBlock.textContent();

    // Verify all elements are present
    expect(liquidCode).toContain('h2'); // Heading
    expect(liquidCode).toContain('data-element-id'); // All elements should have this

    // Verify schema has settings
    expect(liquidCode).toContain('"settings"');
    expect(liquidCode).toContain('"type"');

    // Verify responsive styles
    expect(liquidCode).toContain('@media');

    console.log('✅ Multi-element export successful');
    console.log(`Total elements in export: ${(liquidCode.match(/data-element-id/g) || []).length}`);
  });

  test('should handle export with no elements gracefully', async ({ page }) => {
    // Don't add any elements

    // Set up dialog handlers
    let dialogCount = 0;
    page.on('dialog', async dialog => {
      if (dialogCount === 0) {
        await dialog.accept('empty-section');
      } else if (dialogCount === 1) {
        await dialog.accept('1');
      }
      dialogCount++;
    });

    // Export empty canvas
    await page.click('button:has-text("Export Liquid")');
    await page.waitForSelector('div:has-text("💧 Exported Liquid Code")', { timeout: 5000 });

    // Get code
    const codeBlock = await page.$('pre');
    const liquidCode = await codeBlock.textContent();

    // Should still have schema structure even with no elements
    expect(liquidCode).toContain('{% schema %}');
    expect(liquidCode).toContain('"name"');

    console.log('✅ Empty section export handled correctly');
  });

  test('should include responsive styles in exported code', async ({ page }) => {
    // Add element and set responsive styles
    await page.evaluate(() => {
      const helpers = window.blockifyTestHelpers;
      helpers.addElement('heading');

      // Get the added element
      const elements = helpers.getElements();
      const headingId = elements[0].id;

      // Set different font sizes for different breakpoints
      const responsiveStyles = {
        [headingId]: {
          xs: { fontSize: '20px' },
          sm: { fontSize: '24px' },
          md: { fontSize: '32px' },
          lg: { fontSize: '40px' },
          xl: { fontSize: '48px' }
        }
      };

      // Update responsive styles
      window.blockifyTestHelpers.setResponsiveStyles(responsiveStyles);
    });

    await page.waitForTimeout(500);

    // Set up dialog handlers
    let dialogCount = 0;
    page.on('dialog', async dialog => {
      if (dialogCount === 0) {
        await dialog.accept('responsive-test');
      } else if (dialogCount === 1) {
        await dialog.accept('1');
      }
      dialogCount++;
    });

    // Export
    await page.click('button:has-text("Export Liquid")');
    await page.waitForSelector('pre', { timeout: 5000 });

    // Get code
    const codeBlock = await page.$('pre');
    const liquidCode = await codeBlock.textContent();

    // Verify responsive breakpoints
    expect(liquidCode).toContain('@media');
    expect(liquidCode).toContain('section.settings');

    // Should have mobile, desktop, and fullscreen variants
    expect(liquidCode).toContain('_mobile');
    expect(liquidCode).toContain('_desktop');

    console.log('✅ Responsive styles included in export');
  });
});

test.describe('Liquid Export - Property Coverage', () => {
  test('should export all heading properties', async ({ page }) => {
    await page.goto('http://localhost:3000/builder');
    await page.waitForSelector('.block-builder', { timeout: 10000 });

    // Add heading with properties
    await page.evaluate(() => {
      const helpers = window.blockifyTestHelpers;
      helpers.addElement('heading');

      const elements = helpers.getElements();
      const heading = elements[0];

      // Set various properties
      heading.props.text = 'Test Heading';
      heading.props.tag = 'h3';
      heading.style.fontSize = '36px';
      heading.style.color = '#ff0000';
      heading.style.textAlign = 'center';
      heading.style.fontWeight = 'bold';
    });

    await page.waitForTimeout(500);

    let dialogCount = 0;
    page.on('dialog', async dialog => {
      if (dialogCount === 0) {
        await dialog.accept('heading-test');
      } else if (dialogCount === 1) {
        await dialog.accept('1');
      }
      dialogCount++;
    });

    await page.click('button:has-text("Export Liquid")');
    await page.waitForSelector('pre', { timeout: 5000 });

    const codeBlock = await page.$('pre');
    const liquidCode = await codeBlock.textContent();

    // Verify heading properties in schema
    expect(liquidCode).toContain('fontSize');
    expect(liquidCode).toContain('color');
    expect(liquidCode).toContain('textAlign');
    expect(liquidCode).toContain('fontWeight');

    // Verify HTML structure
    expect(liquidCode).toContain('<h3');

    console.log('✅ All heading properties exported correctly');
  });
});
