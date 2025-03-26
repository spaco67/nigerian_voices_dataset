'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, ChevronDown } from "lucide-react";
import { languages } from "@/lib/languages";
import { useRouter } from "next/navigation";

export function LanguageDropdown() {
  const router = useRouter();

  // Group languages by region
  const groupedLanguages = languages.reduce((acc, lang) => {
    const region = lang.region || 'Other';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(lang);
    return acc;
  }, {} as Record<string, typeof languages>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Languages className="h-4 w-4" />
          Languages
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(groupedLanguages).map(([region, langs]) => (
          <div key={region}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {region}
            </DropdownMenuLabel>
            {langs.map((language) => (
              <DropdownMenuItem
                key={language.id}
                className="cursor-pointer"
                onClick={() => router.push(`/languages/${language.id}`)}
              >
                {language.name}
                <span className="ml-auto text-xs text-muted-foreground">
                  {language.nativeName}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 