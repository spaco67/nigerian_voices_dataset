'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const routes = [
    {
      href: '/',
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/contribute/custom',
      label: 'Contribute',
      active: pathname === '/contribute/custom',
    },
    {
      href: '/downloads',
      label: 'Downloads',
      active: pathname === '/downloads',
    },
    session?.user && {
      href: '/dashboard',
      label: 'Dashboard',
      active: pathname === '/dashboard',
    },
  ].filter(Boolean);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center pl-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              NVD
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  route.active ? "text-foreground" : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user ? (
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="text-sm font-medium"
            >
              Sign Out
            </Button>
          ) : (
            <Link
              href="/auth/login"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                pathname === '/auth/login' ? "text-foreground" : "text-foreground/60"
              )}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}