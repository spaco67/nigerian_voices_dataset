import { LanguageSelector } from '@/components/LanguageSelector';

export default function ContributePage() {
  return (
    <div className="container py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Contribute Your Voice
        </h1>
        <p className="text-muted-foreground">
          Select a language to start contributing voice recordings
        </p>
      </div>
      <LanguageSelector />
    </div>
  );
} 