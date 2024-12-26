import { NextResponse } from 'next/server';
import { getPendingRecordings } from '@/lib/db/models/recording.model';

export async function GET() {
  try {
    const recordings = await getPendingRecordings();
    return NextResponse.json(recordings);
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}