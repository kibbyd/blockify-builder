import { NextResponse } from 'next/server';
import ResponsiveStylesManager from '@/app/api/_lib/responsive-styles-manager';
import logger from '@/app/api/_lib/logger';

export async function POST(request) {
  try {
    const { styles } = await request.json();

    if (!styles || typeof styles !== 'object') {
      return NextResponse.json({ error: 'styles object is required' }, { status: 400 });
    }

    const manager = new ResponsiveStylesManager();
    manager.importJSON(styles);

    logger.info(`Imported ${Object.keys(styles).length} responsive styles`);
    return NextResponse.json({ success: true, imported: Object.keys(styles).length, allStyles: manager.exportJSON() });
  } catch (error) {
    logger.error(`Error importing responsive styles: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to import responsive styles' }, { status: 400 });
  }
}
