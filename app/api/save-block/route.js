import { NextResponse } from 'next/server';
import logger from '@/app/api/_lib/logger';

export async function POST(request) {
  try {
    let { filename, content } = await request.json();

    if (!filename || !content) {
      logger.warn('Save block request missing filename or content');
      return NextResponse.json({ error: 'Filename and content are required' }, { status: 400 });
    }

    // Extract the name from filename (without .liquid extension)
    const nameFromFile = filename.replace('.liquid', '');

    // Update schema name and preset name to match filename
    content = content.replace(
      /"name":\s*"[^"]*"/,
      `"name": "${nameFromFile}"`
    );

    // Update preset name if it exists
    const presetMatch = content.match(/"presets":\s*\[\s*{[^}]*"name":\s*"[^"]*"/);
    if (presetMatch) {
      content = content.replace(
        /("presets":\s*\[\s*{\s*)"name":\s*"[^"]*"/,
        `$1"name": "${nameFromFile}"`
      );
    }

    // Return as file download (Vercel has no persistent filesystem)
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    logger.error(`Error saving block: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to save block. Please try again.' }, { status: 500 });
  }
}
