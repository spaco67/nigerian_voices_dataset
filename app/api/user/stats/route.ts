import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const userId = new ObjectId(session.user.id);

    // Get user stats
    const user = await db.collection('users').findOne(
      { _id: userId },
      { 
        projection: {
          points: 1,
          totalRecordings: 1,
          lastRecordingAt: 1,
          recentActivity: 1
        }
      }
    );

    // Get recent recordings
    const recentRecordings = await db.collection('recordings')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get language contributions
    const languageStats = await db.collection('recordings').aggregate([
      { $match: { userId } },
      { 
        $group: {
          _id: '$languageId',
          count: { $sum: 1 },
          totalWords: { $sum: { $size: { $split: ['$englishPhrase', ' '] } } }
        }
      },
      {
        $lookup: {
          from: 'languages',
          localField: '_id',
          foreignField: '_id',
          as: 'language'
        }
      },
      { $unwind: '$language' }
    ]).toArray();

    return NextResponse.json({
      success: true,
      stats: {
        points: user?.points || 0,
        totalRecordings: user?.totalRecordings || 0,
        lastRecordingAt: user?.lastRecordingAt,
        recentActivity: user?.recentActivity || []
      },
      recentRecordings,
      languageContributions: languageStats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
} 