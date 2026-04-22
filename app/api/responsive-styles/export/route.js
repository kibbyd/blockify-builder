import { NextResponse } from 'next/server';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request) {
  try {
    const { currentStyles = {} } = await request.json();

    const manager = new ResponsiveStylesManager();
    manager.importJSON(currentStyles);
    const styles = manager.exportJSON();

    return NextResponse.json(styles);
  } catch (error) {
    logger.error(`Error exporting responsive styles: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to export responsive styles' }, { status: 400 });
  }
}
