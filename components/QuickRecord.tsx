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
import { Mic, ChevronDown } from "lucide-react";
import { languages } from "@/lib/languages";
import { useRouter } from "next/navigation";

export function QuickRecord() {
  const router = useRouter();

  // Group languages by region for better organization
  const groupedLanguages = languages.reduce((acc, lang) => {
    const region = lang.region || 'Other';
    if (!acc[region]) acc[region] = [];
    acc[region].push(lang);
    return acc;
  }, {} as Record<string, typeof languages>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Mic className="h-4 w-4 text-red-500" />
          Record Voice
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Quick Record</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(groupedLanguages).map(([region, langs]) => (
          <div key={region}>
            <DropdownMenuLabel className="text-xs text-muted-foreground pt-2">
              {region}
            </DropdownMenuLabel>
            {langs.map((lang) => (
              <DropdownMenuItem
                key={lang.id}
                onClick={() => router.push(`/record/${lang.id}`)}
                className="cursor-pointer"
              >
                <span>{lang.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {lang.nativeName}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 