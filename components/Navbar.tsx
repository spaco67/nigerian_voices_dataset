import { ContributeDropdown } from "@/components/ContributeDropdown";
import { LanguageSelector } from "@/components/LanguageSelector";
import { QuickRecord } from "@/components/QuickRecord";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <QuickRecord />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-4">
            <LanguageSelector />
            <ContributeDropdown />
          </nav>
        </div>
      </div>
    </header>
  );
} 