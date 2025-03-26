import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { ObjectId } from "mongodb";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Invalid credentials');
        }

        try {
          const mongoClient = await clientPromise;
          const db = mongoClient.db();

          const user = await db.collection('users').findOne({
            email: credentials.email.toLowerCase()
          });

          console.log('Found user:', user ? 'yes' : 'no');

          if (!user) {
            console.log('User not found');
            throw new Error('Invalid credentials');
          }

          if (!user.hashedPassword) {
            console.log('No password set for user');
            throw new Error('Invalid credentials');
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.hashedPassword
          );

          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password');
            throw new Error('Invalid credentials');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role || 'user',
            image: user.image || null
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Handle user updates
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      try {
        const mongoClient = await clientPromise;
        const db = mongoClient.db();
        
        await db.collection('users').updateOne(
          { _id: new ObjectId(user.id) },
          { 
            $set: { 
              lastLogin: new Date(),
              updatedAt: new Date()
            },
            $inc: { loginCount: 1 }
          }
        );
      } catch (error) {
        console.error('Error updating user login info:', error);
      }
    }
  }
};