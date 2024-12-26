import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    // Validate or transform the uploaded audio using Cloudinary's API
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'auto',
      folder: 'voice-recordings',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 