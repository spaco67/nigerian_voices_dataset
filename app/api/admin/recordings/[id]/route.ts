import { NextResponse } from 'next/server';
import { updateRecordingStatus } from '@/lib/db/models/recording.model';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid recording ID format' },
        { status: 400 }
      );
    }

    const updatedRecording = await updateRecordingStatus(id, status);
    return NextResponse.json(updatedRecording);
  } catch (error) {
    console.error('Error updating recording:', error);
    return NextResponse.json(
      { error: 'Failed to update recording' },
      { status: 500 }
    );
  }
}