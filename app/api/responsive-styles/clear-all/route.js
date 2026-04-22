import { NextResponse } from 'next/server';
import logger from '@/app/api/_lib/logger';

export async function POST() {
  try {
    // In serverless, there's no persistent state to clear.
    // Client should clear its own state.
    logger.info('All responsive styles cleared (client-side)');
    return NextResponse.json({ success: true, message: 'All responsive styles cleared' });
  } catch (error) {
    logger.error(`Error clearing responsive styles: ${error.message}`, error);
    return NextResponse.json({ error: 'Failed to clear responsive styles' }, { status: 400 });
  }
}
