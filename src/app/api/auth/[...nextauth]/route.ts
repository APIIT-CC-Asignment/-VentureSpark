import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions, Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.email = token.email || null;
        session.user.name = token.name || null;
        session.user.image = token.picture || null;
      }
      return session;
    },
  
  
    async redirect({ url, baseUrl }) {
      return baseUrl; 
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/', 
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };