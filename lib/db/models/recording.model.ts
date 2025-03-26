import { db } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function updateRecordingStatus(id: string, status: string) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid recording ID format');
    }

    const result = await db.recordings.update({
      where: {
        id: id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error('Error updating recording status:', error);
    throw error;
  }
}

export async function getRecordingsByLanguage(languageId: string) {
  return db.recordings.findMany({
    where: {
      languageId,
      status: 'approved',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getPendingRecordings() {
  return db.recordings.findMany({
    where: {
      status: 'pending',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createRecording(data: any) {
  return db.recordings.create({
    data: {
      ...data,
      validations: 0,
      positiveValidations: 0,
      duration: 0,
      sampleRate: 44100,
      category: 'general',
      metadata: {
        device: 'web',
        isGuest: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}