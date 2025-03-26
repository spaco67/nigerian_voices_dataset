import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getDb();

    // Get recordings that:
    // 1. Are pending
    // 2. Have less than 3 validations
    // 3. Haven't been validated by the current user
    const recordings = await db.collection('recordings')
      .aggregate([
        {
          $match: {
            status: 'pending',
            validations: { $lt: 3 }
          }
        },
        {
          $lookup: {
            from: 'validations',
            let: { recordingId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$recordingId', '$$recordingId'] },
                      { $eq: ['$userId', session.user.id] }
                    ]
                  }
                }
              }
            ],
            as: 'userValidations'
          }
        },
        {
          $match: {
            userValidations: { $size: 0 }
          }
        },
        {
          $project: {
            userValidations: 0
          }
        },
        {
          $limit: 10 // Limit to 10 recordings at a time
        }
      ])
      .toArray();

    return NextResponse.json(recordings);
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}