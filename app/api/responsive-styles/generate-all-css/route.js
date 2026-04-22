import { NextResponse } from 'next/server';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request) {
  try {
    const { currentStyles = {} } = await request.json();

    const manager = new ResponsiveStylesManager();
    manager.importJSON(currentStyles);
    const css = manager.generateAllCSS();

    return new NextResponse(css, {
      status: 200,
      headers: { 'Content-Type': 'text/css' },
    });
  } catch (error) {
    logger.error(`Error generating all CSS: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to generate CSS' }, { status: 400 });
  }
}
