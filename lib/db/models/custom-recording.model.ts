import { CustomRecording } from '@/lib/types';
import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';

export async function createCustomRecording(
  recording: Omit<CustomRecording, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CustomRecording> {
  const client = await clientPromise;
  const collection = client.db().collection('custom_recordings');
  
  const now = new Date();
  const newRecording = {
    ...recording,
    id: new ObjectId().toString(),
    createdAt: now,
    updatedAt: now,
  };
  
  await collection.insertOne(newRecording);
  return newRecording;
}

export async function getCustomRecordings(languageId: string): Promise<CustomRecording[]> {
  const client = await clientPromise;
  const collection = client.db().collection('custom_recordings');
  return collection
    .find({ languageId, status: 'approved' })
    .toArray() as Promise<CustomRecording[]>;
}