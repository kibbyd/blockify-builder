/**
 * COMPREHENSIVE QA TEST SUITE
 * Tests ALL functionality as a QA tester would
 * Documents: Working, Broken, Missing, Needs Improvement
 */

const { test } = require('@playwright/test');
const fs = require('fs');

// QA Report Data
const qaReport = {
  working: [],
  broken: [],
  missing: [],
  needsImprovement: [],
  tested: []
};

function logWorking(feature, details = '') {
  const entry = details ? `${feature}: ${details}` : feature;
  qaReport.working.push(entry);
  console.log(`   ✅ ${feature}${details ? ' - ' + details : ''}`);
}

function logBroken(feature, issue, severity = 'HIGH') {
  const entry = { feature, issue, severity };
  qaReport.broken.push(entry);
  console.log(`   ❌ ${feature} - ${issue} [${severity}]`);
}

function logMissing(feature, description) {
  const entry = { feature, description };
  qaReport.missing.push(entry);
  console.log(`   ⚠️  MISSING: ${feature} - ${description}`);
}

function logNeedsImprovement(feature, suggestion) {
  const entry = { feature, suggestion };
  qaReport.needsImprovement.push(entry);
  console.log(`   💡 ${feature} - ${suggestion}`);
}

function logTested(category) {
  qaReport.tested.push(category);
}

test.describe('Comprehensive QA Testing', () => {

  test('Complete app functionality test', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes

    console.log('\n' + '='.repeat(80));
    console.log('🔍 COMPREHENSIVE QA TESTING - BLOCKIFY BUILDER');
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

    await page.screenshot({ path: 'test-results/qa-00-start.png', fullPage: true });

    // ========================================
    // TEST 1: CANVAS & UI LOADING
    // ========================================
    console.log('\n📋 TEST 1: Canvas & UI Loading');
    logTested('Canvas & UI');

    const canvasExists = await page.locator('.canvas').isVisible();
    if (canvasExists) logWorking('Canvas renders');
    else logBroken('Canvas', 'Does not render', 'CRITICAL');

    const paletteExists = await page.locator('.component-palette').count() > 0;
    if (paletteExists) logWorking('Component palette visible');
    else logBroken('Component Palette', 'Not visible', 'CRITICAL');

    const propertiesExists = await page.locator('text=Properties').count() > 0;
    if (propertiesExists) logWorking('Properties panel visible');
    else logBroken('Properties Panel', 'Not visible', 'HIGH');

    const toolbarExists = await page.locator('.toolbar, [class*="toolbar"]').count() > 0;
    if (toolbarExists) logWorking('Toolbar visible');
    else logBroken('Toolbar', 'Not visible', 'MEDIUM');

    // ========================================
    // TEST 2: CONTAINER ELEMENT
    // ========================================
    console.log('\n📋 TEST 2: Container Element');
    logTested('Container Element');

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(500);

    await page.evaluate(() => window.blockifyTestHelpers.addElement('container'));
    await page.waitForTimeout(1000);

    const containerCount = await page.locator('.responsive-container').count();
    if (containerCount > 0) {
      logWorking('Container can be added');

      // Click container to select it
      await page.locator('.responsive-container').first().click();
      await page.waitForTimeout(500);

      // Check if properties panel shows controls
      const hasProperties = await page.locator('input, select, button').count() > 0;
      if (hasProperties) logWorking('Container properties panel loads');
      else logBroken('Container Properties', 'No controls visible', 'HIGH');

      await page.screenshot({ path: 'test-results/qa-01-container.png', fullPage: true });
    } else {
      logBroken('Container', 'Cannot be added', 'CRITICAL');
    }

    // ========================================
    // TEST 3: COLUMNS LAYOUTS
    // ========================================
    console.log('\n📋 TEST 3: Columns Layouts (1-6 columns)');
    logTested('Columns Layouts');

    for (let colCount = 1; colCount <= 6; colCount++) {
      await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
      await page.waitForTimeout(300);

      const result = await page.evaluate(async (count) => {
        await window.blockifyTestHelpers.addElement('container');
        await new Promise(r => setTimeout(r, 200));
        const elements = window.blockifyTestHelpers.getElements();
        const containerId = elements[0].id;
        await window.blockifyTestHelpers.addChildElement(containerId, `columns-${count}`);
        await new Promise(r => setTimeout(r, 200));
        return { success: true };
      }, colCount);

      await page.waitForTimeout(500);

      const columnsExist = await page.locator('.responsive-columns').count() > 0;
      if (columnsExist) {
        logWorking(`${colCount} Column layout`);
      } else {
        logBroken(`Columns-${colCount}`, 'Layout not rendering', 'HIGH');
      }
    }

    await page.screenshot({ path: 'test-results/qa-02-columns.png', fullPage: true });

    // ========================================
    // TEST 4: COLUMNS FLEXDIRECTION BUG
    // ========================================
    console.log('\n📋 TEST 4: Columns FlexDirection (THE CRITICAL BUG)');
    logTested('FlexDirection Property');

    await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
    await page.waitForTimeout(300);

    await page.evaluate(async () => {
      await window.blockifyTestHelpers.setupContainerWithColumns(2);
    });
    await page.waitForTimeout(1000);

    // Select columns
    const columnsLabel = page.locator('text=📋 COLUMNS').first();
    if (await columnsLabel.isVisible({ timeout: 2000 })) {
      await columnsLabel.click();
      await page.waitForTimeout(500);

      const columnsEl = page.locator('.responsive-columns').first();
      const beforeStyle = await columnsEl.evaluate(el =>
        window.getComputedStyle(el).flexDirection
      );

      // Look for Direction controls
      const directionControls = await page.locator('text=Direction').count();
      if (directionControls > 0) {
        logWorking('Direction property exists');

        // Try to find column button
        const columnBtn = page.locator('button').filter({ hasText: 'column' }).first();
        if (await columnBtn.isVisible({ timeout: 2000 })) {
          await columnBtn.click();
          await page.waitForTimeout(1000);

          const afterStyle = await columnsEl.evaluate(el =>
            window.getComputedStyle(el).flexDirection
          );

          if (beforeStyle !== afterStyle) {
            logWorking('FlexDirection changes when button clicked');
          } else {
            logBroken(
              'FlexDirection Property',
              `CSS hardcoded as 'row' - does not respond to user selection (builder.css:850-857)`,
              'CRITICAL'
            );
          }
        } else {
          logNeedsImprovement('Direction buttons', 'Button selectors not accessible in test');
        }
      } else {
        logBroken('Direction Property', 'Not found in property panel', 'HIGH');
      }

      await page.screenshot({ path: 'test-results/qa-03-flexdirection.png', fullPage: true });
    }

    // ========================================
    // TEST 5: BASIC ELEMENTS
    // ========================================
    console.log('\n📋 TEST 5: Basic Elements (Heading, Text, Image, Button)');
    logTested('Basic Elements');

    const basicElements = ['heading', 'text', 'image', 'button'];

    for (const elType of basicElements) {
      await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
      await page.waitForTimeout(300);

      await page.evaluate(async (type) => {
        await window.blockifyTestHelpers.addElement('container');
        await new Promise(r => setTimeout(r, 200));
        const elements = window.blockifyTestHelpers.getElements();
        const containerId = elements[0].id;
        await window.blockifyTestHelpers.addChildElement(containerId, type);
        await new Promise(r => setTimeout(r, 200));
      }, elType);

      await page.waitForTimeout(500);

      const elementExists = await page.locator(`[class*="${elType}"], h1, h2, h3, p, img, button`).count() > 0;
      if (elementExists) {
        logWorking(`${elType.charAt(0).toUpperCase() + elType.slice(1)} element renders`);
      } else {
        logBroken(`${elType} Element`, 'Does not render', 'HIGH');
      }
    }

    await page.screenshot({ path: 'test-results/qa-04-basic-elements.png', fullPage: true });

    // ========================================
    // TEST 6: ADVANCED ELEMENTS
    // ========================================
    console.log('\n📋 TEST 6: Advanced Elements (Icon, Video, List, Table, Map)');
    logTested('Advanced Elements');

    const advancedElements = [
      { type: 'icon', selector: '.icon-element, [class*="icon"]' },
      { type: 'video', selector: 'iframe, video' },
      { type: 'ordered-list', selector: 'ol' },
      { type: 'unordered-list', selector: 'ul' },
      { type: 'table', selector: 'table' },
      { type: 'map', selector: 'iframe' }
    ];

    for (const { type, selector } of advancedElements) {
      await page.evaluate(() => window.blockifyTestHelpers.clearCanvas());
      await page.waitForTimeout(300);

      await page.evaluate(async (elType) => {
        await window.blockifyTestHelpers.addElement('container');
        await new Promise(r => setTimeout(r, 200));
        const elements = window.blockifyTestHelpers.getElements();
        const containerId = elements[0].id;
        await window.blockifyTestHelpers.addChildElement(containerId, elType);
        await new Promise(r => setTimeout(r, 300));
      }, type);

      await page.waitForTimeout(500);

      const elementExists = await page.locator(selector).count() > 0;
      if (elementExists) {
        logWorking(`${type} element renders`);
      } else {
        logNeedsImprovement(`${type} Element`, 'May not be rendering or selector needs update');
      }
    }

    await page.screenshot({ path: 'test-results/qa-05-advanced-elements.png', fullPage: true });

    // ========================================
    // TEST 7: RESPONSIVE BREAKPOINTS
    // ========================================
    console.log('\n📋 TEST 7: Responsive Breakpoints');
    logTested('Responsive System');

    const breakpoints = [
      { name: 'XS', label: 'XS' },
      { name: 'SM', label: 'SM' },
      { name: 'MD', label: 'MD' },
      { name: 'LG', label: 'LG' },
      { name: 'XL', label: 'XL' }
    ];

    let breakpointsWorking = 0;
    for (const bp of breakpoints) {
      const btn = page.locator(`button:has-text("${bp.label}")`).first();
      if (await btn.isVisible({ timeout: 1000 })) {
        await btn.click();
        await page.waitForTimeout(200);
        breakpointsWorking++;
        logWorking(`${bp.name} breakpoint button`);
      } else {
        logBroken(`${bp.name} Breakpoint`, 'Button not found', 'MEDIUM');
      }
    }

    if (breakpointsWorking === 5) {
      logWorking('All 5 breakpoints accessible');
    } else {
      logNeedsImprovement('Breakpoints', `Only ${breakpointsWorking}/5 found`);
    }

    await page.screenshot({ path: 'test-results/qa-06-responsive.png', fullPage: true });

    // ========================================
    // TEST 8: EXPORT FUNCTIONALITY
    // ========================================
    console.log('\n📋 TEST 8: Export Functionality');
    logTested('Export System');

    // Test Liquid Export
    const liquidBtn = page.locator('button:has-text("Export Liquid")').first();
    if (await liquidBtn.isVisible({ timeout: 2000 })) {
      logWorking('Export Liquid button exists');
      await liquidBtn.click();
      await page.waitForTimeout(1500);

      const codeVisible = await page.locator('pre, code, textarea').count() > 0;
      if (codeVisible) {
        logWorking('Liquid export generates code');
      } else {
        logBroken('Liquid Export', 'No code output visible', 'HIGH');
      }

      await page.screenshot({ path: 'test-results/qa-07-liquid-export.png', fullPage: true });

      // Close modal if there is one
      const closeBtn = page.locator('button:has-text("Close"), button:has-text("✕")').first();
      if (await closeBtn.isVisible({ timeout: 1000 })) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    } else {
      logBroken('Export Liquid', 'Button not found', 'CRITICAL');
    }

    // Test JSON Export
    const jsonBtn = page.locator('button:has-text("Export JSON")').first();
    if (await jsonBtn.isVisible({ timeout: 2000 })) {
      logWorking('Export JSON button exists');
    } else {
      logBroken('Export JSON', 'Button not found', 'HIGH');
    }

    // ========================================
    // TEST 9: IMPORT FUNCTIONALITY
    // ========================================
    console.log('\n📋 TEST 9: Import Functionality');
    logTested('Import System');

    const importBtn = page.locator('button:has-text("Import")').first();
    if (await importBtn.isVisible({ timeout: 2000 })) {
      logWorking('Import button exists');
    } else {
      logMissing('Import Functionality', 'No import button found - users cannot restore saved designs');
    }

    // ========================================
    // TEST 10: NAVIGATOR
    // ========================================
    console.log('\n📋 TEST 10: Navigator/Tree View');
    logTested('Navigator');

    const navBtn = page.locator('button:has-text("Navigator")').first();
    if (await navBtn.isVisible({ timeout: 2000 })) {
      logWorking('Navigator button exists');
      await navBtn.click();
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'test-results/qa-08-navigator.png', fullPage: true });
    } else {
      logMissing('Navigator', 'No element tree/hierarchy view');
    }

    // ========================================
    // TEST 11: CLEAR CANVAS
    // ========================================
    console.log('\n📋 TEST 11: Clear Canvas');
    logTested('Clear Functionality');

    const clearBtn = page.locator('button:has-text("Clear")').first();
    if (await clearBtn.isVisible({ timeout: 2000 })) {
      logWorking('Clear button exists');
    } else {
      logMissing('Clear Canvas', 'No way to clear/reset canvas');
    }

    // ========================================
    // TEST 12: UNDO/REDO
    // ========================================
    console.log('\n📋 TEST 12: Undo/Redo');
    logTested('Undo/Redo');

    const undoBtn = await page.locator('button:has-text("Undo"), button[title*="Undo"]').count();
    const redoBtn = await page.locator('button:has-text("Redo"), button[title*="Redo"]').count();

    if (undoBtn > 0 && redoBtn > 0) {
      logWorking('Undo/Redo buttons exist');
    } else {
      logMissing('Undo/Redo', 'No history management - users cannot undo mistakes');
    }

    // ========================================
    // TEST 13: SAVE/LOAD
    // ========================================
    console.log('\n📋 TEST 13: Save/Load State');
    logTested('State Persistence');

    // Check if state persists in localStorage
    const hasLocalStorage = await page.evaluate(() => {
      return localStorage.getItem('blockify_progress') !== null;
    });

    if (hasLocalStorage) {
      logWorking('Auto-save to localStorage');
    } else {
      logNeedsImprovement('State Persistence', 'No auto-save detected');
    }

    // Final screenshot
    await page.screenshot({ path: 'test-results/qa-09-final.png', fullPage: true });

    // ========================================
    // GENERATE QA REPORT
    // ========================================
    console.log('\n' + '='.repeat(80));
    console.log('📊 QA TESTING COMPLETE - GENERATING REPORT');
    console.log('='.repeat(80));

    const report = generateQAReport();
    fs.writeFileSync('QA_TEST_REPORT.md', report);

    console.log('\n✅ QA Report saved to: QA_TEST_REPORT.md');
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Working: ${qaReport.working.length}`);
    console.log(`   ❌ Broken: ${qaReport.broken.length}`);
    console.log(`   ⚠️  Missing: ${qaReport.missing.length}`);
    console.log(`   💡 Needs Improvement: ${qaReport.needsImprovement.length}`);
    console.log(`   📋 Categories Tested: ${qaReport.tested.length}`);

    await page.waitForTimeout(2000);
  });

});

function generateQAReport() {
  const date = new Date().toISOString().split('T')[0];

  return `# QA TEST REPORT
## Blockify Builder - Comprehensive Functionality Test
## Date: ${date}

---

## EXECUTIVE SUMMARY

**Test Categories:** ${qaReport.tested.length}
**Features Working:** ${qaReport.working.length}
**Features Broken:** ${qaReport.broken.length}
**Features Missing:** ${qaReport.missing.length}
**Needs Improvement:** ${qaReport.needsImprovement.length}

---

## ✅ WORKING FEATURES (${qaReport.working.length})

${qaReport.working.map(item => `- ${item}`).join('\n')}

---

## ❌ BROKEN FEATURES (${qaReport.broken.length})

${qaReport.broken.length === 0 ? '*No broken features found*' :
  qaReport.broken.map(item =>
    `### ${item.feature} [${item.severity}]
**Issue:** ${item.issue}
`).join('\n')}

---

## ⚠️ MISSING FEATURES (${qaReport.missing.length})

${qaReport.missing.length === 0 ? '*No missing features noted*' :
  qaReport.missing.map(item =>
    `### ${item.feature}
**Description:** ${item.description}
`).join('\n')}

---

## 💡 NEEDS IMPROVEMENT (${qaReport.needsImprovement.length})

${qaReport.needsImprovement.length === 0 ? '*No improvements suggested*' :
  qaReport.needsImprovement.map(item =>
    `### ${item.feature}
**Suggestion:** ${item.suggestion}
`).join('\n')}

---

## TEST CATEGORIES COVERED

${qaReport.tested.map((cat, i) => `${i + 1}. ${cat}`).join('\n')}

---

## SCREENSHOTS

All test screenshots saved to \`test-results/\`:
- qa-00-start.png - Initial state
- qa-01-container.png - Container element
- qa-02-columns.png - Column layouts
- qa-03-flexdirection.png - FlexDirection test
- qa-04-basic-elements.png - Basic elements
- qa-05-advanced-elements.png - Advanced elements
- qa-06-responsive.png - Responsive breakpoints
- qa-07-liquid-export.png - Export functionality
- qa-08-navigator.png - Navigator view
- qa-09-final.png - Final state

---

## PRIORITY RECOMMENDATIONS

### CRITICAL (Fix Immediately)
${qaReport.broken.filter(b => b.severity === 'CRITICAL').map(b => `- ${b.feature}: ${b.issue}`).join('\n') || '*None*'}

### HIGH (Fix Soon)
${qaReport.broken.filter(b => b.severity === 'HIGH').map(b => `- ${b.feature}: ${b.issue}`).join('\n') || '*None*'}

### MEDIUM (Schedule for Future)
${qaReport.broken.filter(b => b.severity === 'MEDIUM').map(b => `- ${b.feature}: ${b.issue}`).join('\n') || '*None*'}

---

**QA Testing Complete**
**Report Generated:** ${new Date().toISOString()}
`;
}
