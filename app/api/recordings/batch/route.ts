import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', { 
      userId: session?.user?.id,
      email: session?.user?.email 
    });
    
    if (!session?.user?.id) {
      console.error('No user session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { languageId, recordings } = await request.json();
    
    const db = await getDb();
    const userId = new ObjectId(session.user.id);

    // Create recordings with enhanced metadata
    const recordingsToInsert = recordings.map((rec: any) => ({
      _id: new ObjectId(),
      userId: userId,
      languageId,
      englishPhrase: rec.englishPhrase,
      translatedPhrase: rec.translatedPhrase,
      audioUrl: rec.audioUrl,
      status: 'pending',
      validations: 0,
      positiveValidations: 0,
      metadata: {
        recordedAt: new Date(),
        device: 'web',
        browser: navigator?.userAgent || 'unknown',
        duration: rec.duration || 0,
        phraseContext: rec.phrase?.context || null,
      },
      stats: {
        wordCount: rec.englishPhrase.split(' ').length,
        translatedWordCount: rec.translatedPhrase.split(' ').length,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert recordings
    const result = await db.collection('recordings').insertMany(recordingsToInsert);
    
    // Calculate points (10 points per recording)
    const pointsEarned = recordings.length * 10;

    // Update user stats and points
    await db.collection('users').updateOne(
      { _id: userId },
      {
        $inc: {
          points: pointsEarned,
          totalRecordings: recordings.length,
        },
        $set: {
          lastRecordingAt: new Date(),
          updatedAt: new Date()
        },
        $push: {
          recentActivity: {
            type: 'recording',
            count: recordings.length,
            points: pointsEarned,
            timestamp: new Date()
          }
        }
      }
    );

    // Update language stats
    await db.collection('languages').updateOne(
      { _id: languageId },
      {
        $inc: {
          recordingsCount: recordings.length,
          totalWords: recordings.reduce((acc, rec) => acc + rec.englishPhrase.split(' ').length, 0)
        },
        $set: { lastUpdated: new Date() }
      }
    );

    return NextResponse.json({
      success: true,
      recordingsCount: result.insertedCount,
      points: pointsEarned,
      totalPoints: (await db.collection('users').findOne({ _id: userId }))?.points || 0
    });

  } catch (error) {
    console.error('Recording batch error:', error);
    return NextResponse.json(
      { error: 'Failed to save recordings' },
      { status: 500 }
    );
  }
} 