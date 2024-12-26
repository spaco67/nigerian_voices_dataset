'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { languages } from '@/lib/languages';
import { Language } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

export function LanguageSelector() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (language: Language) => {
    router.push(`/contribute/${language.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search languages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLanguages.map((language) => (
          <Card
            key={language.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleLanguageSelect(language)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {language.name}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {language.region}
                </span>
              </div>
              <p className="text-muted-foreground">
                {language.nativeName}
              </p>
              <Button
                variant="ghost"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Contribute
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 