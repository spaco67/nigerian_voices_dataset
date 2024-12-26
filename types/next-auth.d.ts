import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      points: number;
    }
  }

  interface User {
    role: string;
    points: number;
  }
}