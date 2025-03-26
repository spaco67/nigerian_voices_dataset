import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { isValid } = await request.json();

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid recording ID format' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const recordingId = new ObjectId(id);

    // Check if user has already validated this recording
    const existingValidation = await db.collection('validations').findOne({
      recordingId,
      userId: session.user.id,
    });

    if (existingValidation) {
      return NextResponse.json(
        { error: 'You have already validated this recording' },
        { status: 400 }
      );
    }

    // Create validation record
    await db.collection('validations').insertOne({
      recordingId,
      userId: session.user.id,
      isValid,
      createdAt: new Date(),
    });

    // Update recording validation counts
    const result = await db.collection('recordings').findOneAndUpdate(
      { _id: recordingId },
      {
        $inc: {
          validations: 1,
          positiveValidations: isValid ? 1 : 0,
        },
        $set: {
          // Auto-approve or reject based on validation threshold
          status: await determineStatus(db, recordingId),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Error validating recording:', error);
    return NextResponse.json(
      { error: 'Failed to validate recording' },
      { status: 500 }
    );
  }
}

async function determineStatus(db: any, recordingId: ObjectId) {
  const recording = await db.collection('recordings').findOne({ _id: recordingId });
  
  // If we have at least 3 validations, make a decision
  if (recording.validations >= 3) {
    // If more than 66% positive validations, approve
    const approvalRate = recording.positiveValidations / recording.validations;
    return approvalRate > 0.66 ? 'approved' : 'rejected';
  }
  
  return 'pending';
} 