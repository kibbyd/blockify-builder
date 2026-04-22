import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import logger from '@/app/api/_lib/logger';

// Read build-time manifest if available
let manifest = null;
const manifestPath = path.join(process.cwd(), 'public', 'icons', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

export async function GET() {
  try {
    // Use manifest if available (production / after build)
    if (manifest) {
      return NextResponse.json({ icons: manifest });
    }

    // Fallback: read directory at runtime (dev mode)
    const iconsPath = path.join(process.cwd(), 'public', 'icons');
    const files = await fs.promises.readdir(iconsPath);

    const icons = files
      .filter(file => file.endsWith('.svg') || file.endsWith('.png'))
      .map(file => {
        const name = file.replace(/\.(svg|png)$/, '');
        const extension = file.split('.').pop();
        return { name, path: `/icons/${file}`, extension };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ icons });
  } catch (error) {
    logger.error(`Error listing icons: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to list icons' }, { status: 500 });
  }
}
