import { ObjectId } from 'mongodb';
import { getDb } from '../mongodb';
import { Validation } from '@/lib/types/schema';

export async function createValidation(data: Omit<Validation, '_id' | 'createdAt' | 'updatedAt'>): Promise<Validation> {
  const db = await getDb();
  const collection = db.collection('validations');
  
  const now = new Date();
  const validation: Validation = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(validation);

  // Update recording validation counts
  const recordingsCollection = db.collection('recordings');
  await recordingsCollection.updateOne(
    { _id: new ObjectId(data.recordingId) },
    {
      $inc: {
        validations: 1,
        positiveValidations: data.isPositive ? 1 : 0,
      }
    }
  );

  return { ...validation, _id: result.insertedId };
}

export async function getValidationsByRecording(recordingId: string): Promise<Validation[]> {
  const db = await getDb();
  const collection = db.collection('validations');
  
  return collection
    .find({ recordingId })
    .sort({ createdAt: -1 })
    .toArray() as Promise<Validation[]>;
} 