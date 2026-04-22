import { NextResponse } from 'next/server';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request) {
  try {
    const { elementId, styles, currentStyles = {} } = await request.json();

    if (!elementId) {
      return NextResponse.json({ error: 'elementId is required' }, { status: 400 });
    }
    if (!styles || typeof styles !== 'object') {
      return NextResponse.json({ error: 'styles object is required' }, { status: 400 });
    }

    const manager = new ResponsiveStylesManager();
    manager.importJSON(currentStyles);
    manager.registerStyles(elementId, styles);

    logger.debug(`Responsive styles registered for element: ${elementId}`);
    return NextResponse.json({ success: true, elementId, allStyles: manager.exportJSON() });
  } catch (error) {
    logger.error(`Error setting responsive styles: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to set responsive styles' }, { status: 400 });
  }
}
