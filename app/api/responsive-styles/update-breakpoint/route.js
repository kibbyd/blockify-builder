import { NextResponse } from 'next/server';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request) {
  try {
    const { elementId, breakpoint, styles, currentStyles = {} } = await request.json();

    if (!elementId || !breakpoint || !styles) {
      return NextResponse.json({ error: 'elementId, breakpoint, and styles are required' }, { status: 400 });
    }

    const manager = new ResponsiveStylesManager();
    manager.importJSON(currentStyles);
    manager.updateBreakpointStyles(elementId, breakpoint, styles);

    return NextResponse.json({ success: true, elementId, breakpoint, allStyles: manager.exportJSON() });
  } catch (error) {
    logger.error(`Error updating breakpoint styles: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to update breakpoint styles' }, { status: 400 });
  }
}
