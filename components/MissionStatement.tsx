import { BookHeart } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function MissionStatement() {
  return (
    <div className="relative py-24 bg-gradient-to-b from-white to-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <BookHeart className="w-16 h-16 mx-auto mb-8 text-primary animate-float" />
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Preserving Our Heritage
          </h2>
          
          <div className="mb-8">
            <p className="text-lg font-medium text-primary">By Timothy Dake</p>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Creator of the first Hausa-language ChatGPT model
              </p>
              <p className="text-sm">
                A Microsoft and{' '}
                <a
                  href="https://data.org/initiatives/ai-challenge/awardees/global-integrated-education-volunteers-gieva/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline underline-offset-2"
                >
                  data.org
                </a>
                {' '}backed initiative
              </p>
            </div>
          </div>
          
          <Card className="p-8 mb-12 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
            <div className="relative space-y-6 text-lg leading-relaxed">
              <p>
                As a pioneer in African language AI, I've led groundbreaking initiatives that merge
                technology with cultural preservation. Our Hausa-language ChatGPT project, backed by
                Microsoft and data.org, has already empowered over 1,400 historically marginalized
                women across Northern Nigeria, providing them with access to AI technology in their
                native language.
              </p>
              <p>
                This project is born from a deep-seated passion to preserve our languages for future 
                generations. Each voice recording captures not just words, but stories, wisdom, and 
                cultural nuances that deserve to be preserved and celebrated in the digital age.
              </p>
              <p className="font-medium text-primary">
                Together, we can ensure that our children and grandchildren will not just read about 
                these languages in history books, but experience them through modern technology,
                spoken with pride and authenticity.
              </p>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">1,400+</div>
              <div className="text-sm text-muted-foreground">Women Empowered</div>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <div className="text-3xl font-bold text-secondary mb-2">30M+</div>
              <div className="text-sm text-muted-foreground">Native Speakers</div>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <div className="text-3xl font-bold text-accent mb-2">2</div>
              <div className="text-sm text-muted-foreground">Major Partners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}