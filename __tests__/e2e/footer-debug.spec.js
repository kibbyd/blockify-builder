const { test } = require('@playwright/test');

test('screenshot footer templates across viewports', async ({ page }) => {
  await page.goto('http://localhost:3000/test/templates', { waitUntil: 'networkidle', timeout: 30000 });

  // Run tests
  await page.click('[data-id="template-test--button--run"]');
  await page.waitForTimeout(3000);

  // Find footer preview button indices
  const indices = await page.evaluate(() => {
    const result = {};
    document.querySelectorAll('tr').forEach(row => {
      const text = row.textContent;
      const btn = row.querySelector('button[data-id*="preview"]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const idx = id.match(/preview-(\d+)/)?.[1];
      if (text.includes('Simple Footer')) result.simple = idx;
      if (text.includes('Multi-Column Footer')) result.multi = idx;
    });
    return result;
  });

  console.log('Indices:', indices);

  const viewports = ['mobile', 'tablet', 'desktop'];

  for (const [name, idx] of Object.entries(indices)) {
    if (!idx) continue;

    await page.click(`[data-id="template-test--button--preview-${idx}"]`);
    await page.waitForTimeout(1000);

    for (const vp of viewports) {
      await page.click(`[data-id="template-test--button--viewport-${vp}"]`);
      await page.waitForTimeout(800);

      const modal = await page.$('[data-id="template-test--modal--preview"]');
      if (modal) {
        await modal.screenshot({ path: `template-screenshots/footer-${name}-${vp}.png` });
        console.log(`Captured: ${name} @ ${vp}`);
      }
    }

    // Get iframe HTML
    const iframe = await page.$('[data-id="template-test--iframe--preview"]');
    if (iframe) {
      const frame = await iframe.contentFrame();
      if (frame) {
        const html = await frame.content();
        const fs = require('fs');
        fs.writeFileSync(`template-screenshots/footer-${name}-html.txt`, html);
        console.log(`Saved ${name} HTML`);
      }
    }

    await page.click('[data-id="template-test--button--close-preview"]');
    await page.waitForTimeout(500);
  }
});
