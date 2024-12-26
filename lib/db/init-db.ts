import { getDb } from './mongodb';

export async function initializeDatabase() {
  const db = await getDb();

  // Recordings indexes
  await db.collection('recordings').createIndexes([
    { key: { languageId: 1 } },
    { key: { status: 1 } },
    { key: { userId: 1 } },
    { key: { category: 1 } },
  ]);

  // Validations indexes
  await db.collection('validations').createIndexes([
    { key: { recordingId: 1 } },
    { key: { userId: 1 } },
  ]);

  // Users indexes
  await db.collection('users').createIndexes([
    { key: { email: 1 }, unique: true },
  ]);

  // User profiles indexes
  await db.collection('user_profiles').createIndexes([
    { key: { userId: 1 }, unique: true },
    { key: { nativeLanguages: 1 } },
    { key: { region: 1 } },
  ]);

  // Datasets indexes
  await db.collection('datasets').createIndexes([
    { key: { languageId: 1 } },
    { key: { version: 1 } },
  ]);

  // Languages indexes
  await db.collection('languages').createIndexes([
    { key: { code: 1 }, unique: true },
  ]);
} 