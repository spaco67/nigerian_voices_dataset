import { db } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function updateRecordingStatus(id: string, status: string) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid recording ID format');
    }

    const result = await db.recording.update({
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
  return db.recording.findMany({
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
  return db.recording.findMany({
    where: {
      status: 'pending',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createRecording(data: any) {
  return db.recording.create({
    data: {
      ...data,
      validations: 0,
      positiveValidations: 0,
    },
  });
}