import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

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
    const validations = await db
      .collection('validations')
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Found ${validations.length} validations for user ${session.user.id}`);
    return NextResponse.json(validations);
  } catch (error) {
    console.error('Error fetching validations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch validations' },
      { status: 500 }
    );
  }
} 