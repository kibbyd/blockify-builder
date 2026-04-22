import { NextResponse } from 'next/server';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request, { params }) {
  try {
    const { elementId } = await params;
    const { currentStyles = {} } = await request.json();

    const manager = new ResponsiveStylesManager();
    manager.importJSON(currentStyles);
    manager.deleteStyles(elementId);

    return NextResponse.json({ success: true, elementId, allStyles: manager.exportJSON() });
  } catch (error) {
    logger.error(`Error deleting responsive styles: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to delete responsive styles' }, { status: 400 });
  }
}
