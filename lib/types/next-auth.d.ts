import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    points: number;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      points: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    points?: number;
  }
} 