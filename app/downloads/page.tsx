'use client';

import { useState } from 'react';
import { languages } from '@/lib/languages';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DownloadsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDownload = async (languageId: string) => {
    setDownloading(languageId);
    setProgress(0);
    
    try {
      const response = await fetch(`/api/datasets/${languageId}`);
      if (!response.ok) throw new Error('Download failed');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const contentLength = response.headers.get('Content-Length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let received = 0;

      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        if (total) setProgress((received / total) * 100);
      }

      const blob = new Blob(chunks, { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${languageId}-dataset.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(null);
      setProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Download Voice Datasets
          </h1>
          <p className="text-lg text-muted-foreground">
            Access our curated collection of approved voice recordings for AI training
          </p>
        </div>

        <div className="grid gap-6">
          {languages.map((language) => (
            <Card key={language.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <span>{language.flag}</span>
                    {language.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">{language.region}</p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handleDownload(language.id)}
                  disabled={downloading === language.id}
                  className="min-w-[120px]"
                >
                  {downloading === language.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {progress.toFixed(0)}%
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </div>
              
              {downloading === language.id && (
                <Progress value={progress} className="mt-4" />
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Dataset Information</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Each dataset includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Approved voice recordings in WAV format</li>
              <li>Transcriptions in JSON format</li>
              <li>Metadata including speaker information</li>
              <li>Dataset statistics and documentation</li>
            </ul>
            <p className="text-xs mt-4">
              All datasets are released under CC BY-NC-SA 4.0 license
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}