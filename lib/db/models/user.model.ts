import { ObjectId } from 'mongodb';
import { getDb } from '../mongodb';

export interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  role: 'user' | 'admin';
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection('users');
  
  const user = await collection.findOne({ email });
  if (!user) return null;

  return {
    ...user,
    id: user._id.toString(),
  } as User;
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  const db = await getDb();
  const collection = db.collection('users');
  
  const now = new Date();
  const result = await collection.insertOne({
    ...userData,
    createdAt: now,
    updatedAt: now,
  });

  return {
    ...userData,
    id: result.insertedId.toString(),
    createdAt: now,
    updatedAt: now,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection('users');
  
  const user = await collection.findOne({ _id: new ObjectId(id) });
  if (!user) return null;

  return {
    ...user,
    id: user._id.toString(),
  } as User;
}