import { Phrase } from '@/lib/types';
import clientPromise from '../mongodb';

export async function getPhrasesByCategory(category: string): Promise<Phrase[]> {
  const client = await clientPromise;
  const collection = client.db().collection('phrases');
  return collection.find({ category }).toArray() as Promise<Phrase[]>;
}

export async function createPhrase(phrase: Omit<Phrase, 'id'>): Promise<Phrase> {
  const client = await clientPromise;
  const collection = client.db().collection('phrases');
  const result = await collection.insertOne({ ...phrase, id: new Date().toISOString() });
  return { ...phrase, id: result.insertedId.toString() } as Phrase;
}