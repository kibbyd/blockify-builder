import { NextResponse } from 'next/server';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request) {
  try {
    const { currentStyles = {} } = await request.json();

    const manager = new ResponsiveStylesManager();
    manager.importJSON(currentStyles);

    const allStyles = manager.exportJSON();
    const elementIds = manager.getAllElementIds();
    const breakpoints = manager.breakpoints;

    return NextResponse.json({
      styles: allStyles,
      elementIds,
      breakpoints,
      count: elementIds.length
    });
  } catch (error) {
    logger.error(`Error getting all responsive styles: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to get responsive styles' }, { status: 400 });
  }
}
