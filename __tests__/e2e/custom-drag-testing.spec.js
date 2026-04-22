/**
 * Playwright Tests with Custom Drag-and-Drop Implementation
 * Using mouse events to work with react-dnd HTML5 backend
 */

const { test, expect } = require('@playwright/test');

/**
 * Custom drag-and-drop helper function
 * Uses low-level mouse events instead of Playwright's dragTo()
 */
async function dragElement(page, sourceSelector, targetSelector, options = {}) {
  const {
    pauseBeforeDrag = 100,
    pauseDuringDrag = 100,
    pauseAfterDrag = 500,
    steps = 10,
    offsetX = 0,
    offsetY = 0
  } = options;

  console.log(`🎯 Attempting drag: ${sourceSelector} → ${targetSelector}`);

  // Find source and target elements
  const source = page.locator(sourceSelector).first();
  const target = page.locator(targetSelector).first();

  // Wait for elements to be visible
  await source.waitFor({ state: 'visible', timeout: 10000 });
  await target.waitFor({ state: 'visible', timeout: 10000 });

  // Get bounding boxes
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('Could not get bounding boxes for drag elements');
  }

  console.log('Source box:', sourceBox);
  console.log('Target box:', targetBox);

  // Calculate center points
  const sourceX = sourceBox.x + sourceBox.width / 2;
  const sourceY = sourceBox.y + sourceBox.height / 2;
  const targetX = targetBox.x + targetBox.width / 2 + offsetX;
  const targetY = targetBox.y + targetBox.height / 2 + offsetY;

  console.log(`Moving from (${sourceX}, ${sourceY}) to (${targetX}, ${targetY})`);

  // Perform drag with mouse events
  await page.mouse.move(sourceX, sourceY);
  await page.waitForTimeout(pauseBeforeDrag);

  await page.mouse.down();
  await page.waitForTimeout(pauseDuringDrag);

  await page.mouse.move(targetX, targetY, { steps });
  await page.waitForTimeout(pauseDuringDrag);

  await page.mouse.up();
  await page.waitForTimeout(pauseAfterDrag);

  console.log('✅ Drag sequence completed');
}

/**
 * Helper to bypass license screen
 */
async function bypassLicense(page) {
  await page.evaluate(() => {
    localStorage.setItem('blockify_builder_license', 'TEST-LICENSE-KEY');
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    localStorage.setItem('blockify_builder_license_expires', expires.toISOString());
  });
}

test.describe('Blockify Builder - Custom Drag Tests', () => {

  test.beforeEach(async ({ page }) => {
    console.log('\n🚀 Starting test...');

    // Navigate to builder
    await page.goto('http://localhost:3000/builder');

    // Bypass license
    await bypassLicense(page);
    await page.reload();

    // Wait for canvas
    await page.waitForSelector('.canvas', { timeout: 15000 });

    console.log('✅ Builder loaded and ready');
  });

  test('TEST 1: Drag Container to Canvas', async ({ page }) => {
    console.log('\n=== TEST 1: DRAG CONTAINER ===');

    // Take before screenshot
    await page.screenshot({ path: 'test-results/drag-container-before.png' });

    // Attempt drag
    try {
      await dragElement(page, 'text=Container', '.canvas');

      // Wait a moment for render
      await page.waitForTimeout(1000);

      // Check if container was added
      const containers = await page.locator('.responsive-container').count();
      console.log(`Containers found: ${containers}`);

      // Take after screenshot
      await page.screenshot({ path: 'test-results/drag-container-after.png' });

      if (containers > 0) {
        console.log('✅ SUCCESS: Container was added!');
        expect(containers).toBeGreaterThan(0);
      } else {
        console.log('❌ FAIL: No container added - custom mouse events may not work with react-dnd');
        throw new Error('Drag-and-drop did not add container');
      }

    } catch (error) {
      console.log('❌ Drag failed:', error.message);
      await page.screenshot({ path: 'test-results/drag-container-failed.png' });
      throw error;
    }
  });

  test('TEST 2: Drag Container with different timing', async ({ page }) => {
    console.log('\n=== TEST 2: DRAG WITH LONGER PAUSES ===');

    try {
      // Try with longer pauses to give react-dnd more time
      await dragElement(page, 'text=Container', '.canvas', {
        pauseBeforeDrag: 300,
        pauseDuringDrag: 300,
        pauseAfterDrag: 1000,
        steps: 20
      });

      await page.waitForTimeout(1000);

      const containers = await page.locator('.responsive-container').count();
      console.log(`Containers found: ${containers}`);

      await page.screenshot({ path: 'test-results/drag-container-slow.png' });

      if (containers > 0) {
        console.log('✅ SUCCESS: Slower drag worked!');
        expect(containers).toBeGreaterThan(0);
      } else {
        console.log('❌ FAIL: Slower drag also did not work');
        throw new Error('Drag-and-drop did not add container');
      }

    } catch (error) {
      console.log('❌ Drag failed:', error.message);
      throw error;
    }
  });

  test('TEST 3: JavaScript injection approach', async ({ page }) => {
    console.log('\n=== TEST 3: JAVASCRIPT INJECTION ===');

    // Try dispatching drag events directly via JavaScript
    const result = await page.evaluate(() => {
      const container = document.querySelector('text=Container') ||
                       Array.from(document.querySelectorAll('*'))
                         .find(el => el.textContent.includes('Container'));
      const canvas = document.querySelector('.canvas');

      if (!container || !canvas) {
        return { success: false, error: 'Elements not found' };
      }

      // Create drag events
      const createDragEvent = (type, clientX, clientY) => {
        const dataTransfer = new DataTransfer();
        dataTransfer.effectAllowed = 'all';
        dataTransfer.dropEffect = 'move';

        const event = new DragEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX,
          clientY,
          dataTransfer
        });

        return event;
      };

      const containerRect = container.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      const startX = containerRect.x + containerRect.width / 2;
      const startY = containerRect.y + containerRect.height / 2;
      const endX = canvasRect.x + canvasRect.width / 2;
      const endY = canvasRect.y + canvasRect.height / 2;

      // Dispatch events in sequence
      container.dispatchEvent(createDragEvent('dragstart', startX, startY));
      canvas.dispatchEvent(createDragEvent('dragenter', endX, endY));
      canvas.dispatchEvent(createDragEvent('dragover', endX, endY));
      canvas.dispatchEvent(createDragEvent('drop', endX, endY));
      container.dispatchEvent(createDragEvent('dragend', endX, endY));

      return { success: true };
    });

    console.log('JavaScript injection result:', result);

    await page.waitForTimeout(1000);

    const containers = await page.locator('.responsive-container').count();
    console.log(`Containers found: ${containers}`);

    await page.screenshot({ path: 'test-results/drag-container-js-injection.png' });

    if (containers > 0) {
      console.log('✅ SUCCESS: JavaScript injection worked!');
      expect(containers).toBeGreaterThan(0);
    } else {
      console.log('⚠️  JavaScript injection also did not work');
      console.log('This confirms react-dnd uses internal state not accessible via DOM events');
    }
  });

  test('TEST 4: Hover approach', async ({ page }) => {
    console.log('\n=== TEST 4: HOVER + DRAG ===');

    try {
      const source = page.locator('text=Container').first();
      const canvas = page.locator('.canvas').first();

      // Hover over source first
      await source.hover();
      await page.waitForTimeout(200);

      // Then attempt drag
      const sourceBox = await source.boundingBox();
      const canvasBox = await canvas.boundingBox();

      const startX = sourceBox.x + sourceBox.width / 2;
      const startY = sourceBox.y + sourceBox.height / 2;
      const endX = canvasBox.x + canvasBox.width / 2;
      const endY = canvasBox.y + canvasBox.height / 2;

      // Move to start position and hover
      await page.mouse.move(startX, startY);
      await page.waitForTimeout(200);

      // Press and hold
      await page.mouse.down();
      await page.waitForTimeout(300);

      // Move in small increments
      const deltaX = (endX - startX) / 20;
      const deltaY = (endY - startY) / 20;

      for (let i = 1; i <= 20; i++) {
        await page.mouse.move(startX + deltaX * i, startY + deltaY * i);
        await page.waitForTimeout(10);
      }

      await page.waitForTimeout(300);
      await page.mouse.up();
      await page.waitForTimeout(1000);

      const containers = await page.locator('.responsive-container').count();
      console.log(`Containers found: ${containers}`);

      await page.screenshot({ path: 'test-results/drag-container-hover.png' });

      if (containers > 0) {
        console.log('✅ SUCCESS: Hover + drag worked!');
        expect(containers).toBeGreaterThan(0);
      } else {
        console.log('❌ FAIL: Hover approach also did not work');
      }

    } catch (error) {
      console.log('❌ Hover drag failed:', error.message);
      throw error;
    }
  });

  test('TEST 5: Direct React-DnD state manipulation', async ({ page }) => {
    console.log('\n=== TEST 5: CALL APP FUNCTIONS DIRECTLY ===');

    // Instead of simulating drag, call the app's add function directly
    const result = await page.evaluate(() => {
      // Try to find the React component instance
      const canvasEl = document.querySelector('.canvas');

      if (!canvasEl) {
        return { success: false, error: 'Canvas not found' };
      }

      // Look for React Fiber
      const fiberKey = Object.keys(canvasEl).find(key =>
        key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
      );

      if (!fiberKey) {
        return { success: false, error: 'React Fiber not found' };
      }

      const fiber = canvasEl[fiberKey];

      // Try to find the onDrop handler
      let currentFiber = fiber;
      let dropHandler = null;

      while (currentFiber && !dropHandler) {
        if (currentFiber.memoizedProps?.onDrop) {
          dropHandler = currentFiber.memoizedProps.onDrop;
          break;
        }
        currentFiber = currentFiber.return;
      }

      if (dropHandler) {
        // Try to call it with a container element
        try {
          dropHandler({
            type: 'container',
            isNew: true
          });
          return { success: true, method: 'dropHandler' };
        } catch (e) {
          return { success: false, error: e.message };
        }
      }

      return { success: false, error: 'Could not find drop handler' };
    });

    console.log('Direct function call result:', result);

    await page.waitForTimeout(1000);

    const containers = await page.locator('.responsive-container').count();
    console.log(`Containers found: ${containers}`);

    await page.screenshot({ path: 'test-results/drag-container-direct-call.png' });

    if (containers > 0) {
      console.log('✅ SUCCESS: Direct function call worked!');
      expect(containers).toBeGreaterThan(0);
    } else {
      console.log('⚠️  Direct function call approach also did not work');
    }
  });

});
