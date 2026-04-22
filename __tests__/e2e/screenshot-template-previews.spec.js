// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '..', '..', 'template-screenshots');

test.describe('Template Liquid Preview Screenshots', () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('screenshot all templates at 3 viewports', async ({ browser }) => {
    test.setTimeout(300000);

    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await context.newPage();

    await page.goto('http://localhost:3000/test/templates', { waitUntil: 'networkidle' });

    // Wait for run button, then click it
    await page.waitForSelector('[data-id="template-test--button--run"]', { timeout: 10000 });
    await page.click('[data-id="template-test--button--run"]');

    // Wait for preview buttons to appear (tests are done)
    await page.waitForSelector('[data-id^="template-test--button--preview-"]', { timeout: 30000 });
    await page.waitForTimeout(1000);

    // Count total preview buttons
    const previewBtns = await page.locator('[data-id^="template-test--button--preview-"]').all();
    const templateCount = previewBtns.length;
    console.log(`Found ${templateCount} templates with preview buttons`);

    const viewports = [
      { name: 'mobile', label: 'Mobile' },
      { name: 'tablet', label: 'Tablet' },
      { name: 'desktop', label: 'Desktop' },
    ];

    const issues = [];

    for (let i = 0; i < templateCount; i++) {
      const btnSelector = `[data-id="template-test--button--preview-${i}"]`;
      const btn = page.locator(btnSelector);

      if (await btn.count() === 0) {
        console.log(`  Skipping index ${i} — button not found`);
        continue;
      }

      // Get template name from the row
      const templateName = await btn.evaluate(el => {
        const row = el.closest('tr');
        return row?.querySelector('td div')?.textContent?.trim() || `template-${i}`;
      });
      const templateSlug = templateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      console.log(`\n[${i + 1}/${templateCount}] ${templateName} (${templateSlug})`);

      await btn.scrollIntoViewIfNeeded();
      await btn.click();

      // Wait for modal
      const modal = page.locator('[data-id="template-test--modal--preview"]');
      await modal.waitFor({ state: 'visible', timeout: 10000 });
      await page.waitForTimeout(600);

      for (const vp of viewports) {
        const vpBtn = page.locator(`[data-id="template-test--button--viewport-${vp.name}"]`);
        await vpBtn.click();
        await page.waitForTimeout(400);

        const iframe = page.locator('[data-id="template-test--iframe--preview"]');
        const screenshotPath = path.join(SCREENSHOT_DIR, `${templateSlug}--${vp.name}.png`);

        try {
          await iframe.screenshot({ path: screenshotPath });
          console.log(`  ✓ ${vp.name}`);
        } catch (e) {
          console.log(`  ✗ ${vp.name}: ${e.message}`);
        }
      }

      // Check for visual issues inside the iframe via page.evaluate
      try {
        const frameProblems = await page.evaluate(() => {
          const iframeEl = document.querySelector('[data-id="template-test--iframe--preview"]');
          if (!iframeEl) return [];
          const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
          if (!doc) return [];

          const problems = [];
          const els = doc.querySelectorAll('h1, h2, h3, h4, p, a, button, span, div[data-element-id]');

          els.forEach(el => {
            const rect = el.getBoundingClientRect();
            const computed = iframeEl.contentWindow.getComputedStyle(el);
            const text = el.textContent?.trim();
            const tag = el.tagName;
            const elId = el.getAttribute('data-element-id') || '';

            // Zero height with content
            if (rect.height < 2 && text && text.length > 0 && text.length < 100) {
              problems.push({ tag, elId, text: text.substring(0, 60), height: Math.round(rect.height * 10) / 10, issue: 'zero-height' });
            }

            // Tiny font
            const fs = parseFloat(computed.fontSize);
            if (text && text.length > 0 && text.length < 200 && fs < 8 && fs > 0) {
              problems.push({ tag, elId, text: text.substring(0, 60), fontSize: computed.fontSize, issue: 'tiny-font' });
            }

            // Buttons/links with no padding
            if ((tag === 'A' || tag === 'BUTTON') && text && text.length > 0 && text.length < 100) {
              const pt = parseFloat(computed.paddingTop);
              const pb = parseFloat(computed.paddingBottom);
              const pl = parseFloat(computed.paddingLeft);
              const pr = parseFloat(computed.paddingRight);
              if (pt === 0 && pb === 0 && pl === 0 && pr === 0) {
                problems.push({ tag, elId, text: text.substring(0, 60), issue: 'no-padding' });
              }
            }

            // Missing image src
            if (tag === 'IMG') {
              const src = el.getAttribute('src') || '';
              if (!src) {
                problems.push({ tag, elId, issue: 'missing-image-src' });
              }
            }
          });

          return problems;
        });

        if (frameProblems && frameProblems.length > 0) {
          console.log(`  ⚠ Visual issues:`);
          frameProblems.forEach(p => {
            console.log(`    - [${p.issue}] <${p.tag}>${p.elId ? ` #${p.elId}` : ''} "${p.text || ''}"${p.fontSize ? ` fontSize=${p.fontSize}` : ''}${p.height !== undefined ? ` h=${p.height}` : ''}`);
          });
          issues.push({ template: templateSlug, name: templateName, index: i, problems: frameProblems });
        }
      } catch (e) {
        console.log(`  ⚠ Could not inspect iframe: ${e.message}`);
      }

      // Close modal
      await page.click('[data-id="template-test--button--close-preview"]');
      await page.waitForTimeout(300);
    }

    // Write report
    const reportPath = path.join(SCREENSHOT_DIR, 'visual-issues-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Done! ${templateCount} templates screenshotted.`);
    console.log(`${issues.length} templates with visual issues.`);
    console.log(`Screenshots: ${SCREENSHOT_DIR}`);
    console.log(`Report: ${reportPath}`);

    await context.close();
  });
});
