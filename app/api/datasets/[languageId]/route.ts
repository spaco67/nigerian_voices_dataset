import { NextResponse } from 'next/server';
import { getApprovedRecordings } from '@/lib/db/models/recording.model';
import { getCustomRecordings } from '@/lib/db/models/custom-recording.model';
import JSZip from 'jszip';

export async function GET(
  request: Request,
  { params }: { params: { languageId: string } }
) {
  try {
    // Fetch all approved recordings for the language
    const [standardRecordings, customRecordings] = await Promise.all([
      getApprovedRecordings(params.languageId),
      getCustomRecordings(params.languageId),
    ]);

    // Create a new ZIP file
    const zip = new JSZip();

    // Add standard recordings
    const standardFolder = zip.folder('standard');
    standardRecordings.forEach((recording, index) => {
      standardFolder?.file(
        `recording_${index + 1}.json`,
        JSON.stringify({
          id: recording.id,
          english: recording.englishPhrase,
          translated: recording.translatedPhrase,
          audioUrl: recording.audioUrl,
          createdAt: recording.createdAt,
        }, null, 2)
      );
    });

    // Add custom recordings
    const customFolder = zip.folder('custom');
    customRecordings.forEach((recording, index) => {
      customFolder?.file(
        `recording_${index + 1}.json`,
        JSON.stringify({
          id: recording.id,
          english: recording.englishPhrase,
          translated: recording.translatedPhrase,
          context: recording.context,
          audioUrl: recording.audioUrl,
          createdAt: recording.createdAt,
        }, null, 2)
      );
    });

    // Add metadata
    zip.file('metadata.json', JSON.stringify({
      language: params.languageId,
      totalRecordings: standardRecordings.length + customRecordings.length,
      standardRecordings: standardRecordings.length,
      customRecordings: customRecordings.length,
      generatedAt: new Date().toISOString(),
      license: 'CC BY-NC-SA 4.0',
    }, null, 2));

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${params.languageId}-dataset.zip`,
      },
    });
  } catch (error) {
    console.error('Error generating dataset:', error);
    return NextResponse.json(
      { error: 'Failed to generate dataset' },
      { status: 500 }
    );
  }
}