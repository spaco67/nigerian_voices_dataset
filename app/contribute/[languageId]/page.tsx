"use client";

import { RecordingSession } from "@/components/RecordingSession";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { languages } from "@/lib/languages";
import { Mic } from "lucide-react";

export default function ContributePage({
  params,
}: {
  params: { languageId: string };
}) {
  const router = useRouter();
  const language = languages.find((l) => l.id === params.languageId);

  if (!language) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Language not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              {language.flag} Contributing to {language.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              Record your voice to help preserve and digitize {language.name}
            </p>
          </div>

          <Card className="overflow-hidden border-t-4 border-t-primary shadow-2xl">
            <div className="p-8">
              <RecordingSession
                languageId={params.languageId}
                onComplete={() => router.push("/dashboard")}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
