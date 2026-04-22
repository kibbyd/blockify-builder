import { NextResponse } from 'next/server';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request, { params }) {
  try {
    const { elementId } = await params;
    const { currentStyles = {} } = await request.json();

    const manager = new ResponsiveStylesManager();
    manager.importJSON(currentStyles);
    const styles = manager.getStyles(elementId);

    return NextResponse.json({ elementId, styles });
  } catch (error) {
    logger.error(`Error getting responsive styles: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to get responsive styles' }, { status: 400 });
  }
}
