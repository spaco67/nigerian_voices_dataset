import { getDb } from './mongodb';
import { initializeDatabase } from './init-db';
import { Language } from '@/lib/types/schema';

const initialLanguages: Omit<Language, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    code: 'hau',
    name: 'Hausa',
    nativeName: 'Hausa',
    region: 'Northern Nigeria',
    dialects: ['Kano', 'Kaduna', 'Sokoto'],
    contributors: 0,
    recordingsCount: 0,
    validatedCount: 0,
  },
  {
    code: 'yor',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    region: 'Western Nigeria',
    dialects: ['Oyo', 'Lagos', 'Ibadan', 'Ekiti'],
    contributors: 0,
    recordingsCount: 0,
    validatedCount: 0,
  },
  {
    code: 'ibo',
    name: 'Igbo',
    nativeName: 'Igbo',
    region: 'Eastern Nigeria',
    dialects: ['Owerri', 'Onitsha', 'Umuahia'],
    contributors: 0,
    recordingsCount: 0,
    validatedCount: 0,
  },
  // Add more languages as needed
];

export async function seedDatabase() {
  try {
    const db = await getDb();
    
    // Initialize database indexes
    await initializeDatabase();
    
    // Insert languages if they don't exist
    const languagesCollection = db.collection('languages');
    for (const language of initialLanguages) {
      await languagesCollection.updateOne(
        { code: language.code },
        { 
          $setOnInsert: {
            ...language,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        },
        { upsert: true }
      );
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 