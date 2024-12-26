import { ObjectId } from 'mongodb';
import { getDb } from '../mongodb';
import { Dataset } from '@/lib/types/schema';

export async function createDataset(data: Omit<Dataset, '_id' | 'createdAt' | 'updatedAt'>): Promise<Dataset> {
  const db = await getDb();
  const collection = db.collection('datasets');
  
  const now = new Date();
  const dataset: Dataset = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(dataset);
  return { ...dataset, _id: result.insertedId };
}

export async function getLatestDataset(languageId: string): Promise<Dataset | null> {
  const db = await getDb();
  const collection = db.collection('datasets');
  
  return collection
    .findOne({ languageId }, { sort: { createdAt: -1 } }) as Promise<Dataset | null>;
} 