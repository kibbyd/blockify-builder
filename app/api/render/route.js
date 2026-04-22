import { NextResponse } from 'next/server';
import engine, { mockShopifyData, fixLiquidSyntax } from '@/app/api/_lib/liquid-engine';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request) {
  try {
    const body = await request.json();
    let { template, customData = {}, sectionId = 'default-section', enableResponsive = true, responsiveStyles: clientStyles = null } = body;

    if (!template) {
      logger.warn('Render request missing template');
      return NextResponse.json({ error: 'Template is required' }, { status: 400 });
    }

    // Extract and remove schema block
    const schemaRegex = /\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/g;
    let schemaMatch = template.match(schemaRegex);
    let schema = null;

    if (schemaMatch) {
      const schemaContent = schemaMatch[0]
        .replace(/\{%\s*schema\s*%\}/g, '')
        .replace(/\{%\s*endschema\s*%\}/g, '')
        .trim();
      try {
        schema = JSON.parse(schemaContent);
      } catch (e) {
        logger.warn(`Could not parse schema: ${e.message}`);
      }
      template = template.replace(schemaRegex, '');
    }

    template = fixLiquidSyntax(template);

    const data = {
      ...mockShopifyData,
      ...customData,
      section: {
        settings: schema?.settings?.reduce((acc, setting) => {
          acc[setting.id] = setting.default || null;
          return acc;
        }, {}) || {}
      }
    };

    let html = await engine.parseAndRender(template, data);

    // Inject responsive styles if enabled (per-request manager from client state)
    if (enableResponsive && clientStyles) {
      const manager = new ResponsiveStylesManager();
      manager.importJSON(clientStyles);
      html = manager.processRenderedHTML(html, sectionId);
    }

    return NextResponse.json({ html, schema, sectionId });
  } catch (error) {
    logger.error(`Render error: ${error.message}`, error);
    return NextResponse.json({
      error: 'Failed to render template. Please check your Liquid syntax.',
      details: {
        message: error.message,
        line: error.line,
        col: error.col,
        token: error.token
      }
    }, { status: 400 });
  }
}
