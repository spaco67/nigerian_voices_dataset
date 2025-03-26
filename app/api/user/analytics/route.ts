import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { startOfDay, subDays } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const userId = new ObjectId(session.user.id);

    // Get user's total recordings and points
    const userStats = await db.collection('users').findOne(
      { _id: userId },
      { projection: { points: 1, totalRecordings: 1 } }
    );

    // Get recent recordings
    const recentRecordings = await db.collection('recordings')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get language contributions
    const languageContributions = await db.collection('recordings').aggregate([
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
      { $unwind: '$language' },
      {
        $project: {
          languageId: '$_id',
          name: '$language.name',
          count: 1,
          totalWords: 1
        }
      }
    ]).toArray();

    // Get activity timeline for the last 30 days
    const thirtyDaysAgo = subDays(new Date(), 30);
    const activityTimeline = await db.collection('recordings').aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1
        }
      },
      { $sort: { date: 1 } }
    ]).toArray();

    return NextResponse.json({
      totalRecordings: userStats?.totalRecordings || 0,
      totalPoints: userStats?.points || 0,
      recentRecordings,
      languageContributions,
      activityTimeline
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 