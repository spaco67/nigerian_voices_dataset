import { languages } from '@/lib/languages';
import { Card } from '@/components/ui/card';
import { Map, Download } from 'lucide-react';
import Link from 'next/link';
import { MissionStatement } from '@/components/MissionStatement';

export default function Home() {
  return (
    <div
      className="min-h-screen wave-background relative"
    >
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-32">
          <div className="text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl" />
            <Map className="mx-auto w-16 h-16 mb-6 text-primary animate-float transform rotate-12" />
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Nigerian Languages
              <br />
              Voice Dataset
            </h1>
            <div className="mb-8">
              <p className="text-lg font-medium text-primary">A project by Timothy Dake</p>
              <p className="text-muted-foreground">
                Dedicated to preserving Nigeria's linguistic heritage through technology
              </p>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our mission to preserve and digitize Nigerian languages.
              Your voice can help bridge the gap between tradition and technology.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Link
                href="/contribute/custom"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Add Custom Phrase
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 rounded-full border border-primary/20 hover:border-primary/40 font-medium hover:shadow-lg transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{languages.length} Languages</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </div>

        <MissionStatement />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold mb-4">Speak</h2>
            <p className="text-lg mb-4">Donate your voice</p>
            <p className="text-muted-foreground mb-6">
              Recording voice clips is an integral part of building our open dataset.
            </p>
            <Link
              href="/contribute/hausa"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Start Recording
            </Link>
          </div>

          <div className="p-8 bg-white rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold mb-4">Listen</h2>
            <p className="text-lg mb-4">Help us validate voices</p>
            <p className="text-muted-foreground mb-6">
              Listen to voice clips and help us ensure their quality.
            </p>
            <Link
              href="/admin/recordings"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Start Listening
            </Link>
          </div>
        </div>
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Available Languages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.map((language) => (
              <Link
                key={language.id}
                href={`/contribute/${language.id}`}
                className="block group"
              >
                <Card className="p-6 h-full flex flex-col items-center justify-center text-center hover:shadow-lg">
                  <div className="relative">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                      {language.flag}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 rounded-full blur-xl transition-opacity duration-300" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent group-hover:scale-105 transition-transform duration-300">
                    {language.name}
                  </h2>
                  <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {language.region}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 py-24 bg-gradient-to-b from-white to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Download Voice Datasets
            </h2>
            <p className="text-lg text-muted-foreground">
              Access our curated collection of high-quality voice recordings for AI training
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Languages Available</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-secondary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Voice Recordings</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-accent mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </Card>
          </div>
          
          <div className="text-center">
            <Link
              href="/downloads"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              Access Datasets
            </Link>
          </div>
        </div>
      </div>
      
      <div className="wave-animation" />
      
      <div className="relative z-10 py-24 bg-gradient-to-b from-muted to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                Support Our Mission
              </h2>
              <p className="text-lg text-muted-foreground">
                Help us keep this project running and accessible to everyone
              </p>
            </div>
            
            <Card className="p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
              <div className="relative">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Why Support Us?</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Server Costs</p>
                          <p className="text-sm text-muted-foreground">Help cover our cloud hosting and storage expenses</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">Data Processing</p>
                          <p className="text-sm text-muted-foreground">Support audio processing and dataset generation</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Future Development</p>
                          <p className="text-sm text-muted-foreground">Enable new features and language additions</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        "Your support helps preserve Nigerian languages for future generations. Every contribution makes a difference."
                      </p>
                      <p className="text-sm font-medium">- Timothy Dake, Project Lead</p>
                    </div>
                    
                    <div className="space-y-4">
                      <a
                        href="https://www.buymeacoffee.com/timothydake"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-white text-center font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        Support the Project
                      </a>
                      <p className="text-xs text-center text-muted-foreground">
                        Secure payments processed via Buy Me a Coffee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Why Contribute?</h2>
            <p className="text-muted-foreground">
              "Every voice adds to the tapestry of Nigeria's cultural heritage. Your contribution
              helps preserve our languages for future generations." - Timothy Dake
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Preserve Culture</h3>
              <p className="text-muted-foreground">Help preserve Nigerian languages for future generations</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Advance AI</h3>
              <p className="text-muted-foreground">Enable AI systems to better understand Nigerian languages</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Build Community</h3>
              <p className="text-muted-foreground">Join a community of language preservation enthusiasts</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
