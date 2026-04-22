import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from './prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!valid) return null;

        // Generate and store a unique session token
        const sessionToken = crypto.randomUUID();
        await prisma.user.update({
          where: { id: user.id },
          data: { activeSessionToken: sessionToken },
        });

        return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, sessionToken };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.sessionToken = user.sessionToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Check if this session token is still the active one
      const user = await prisma.user.findUnique({
        where: { id: token.id },
        select: { activeSessionToken: true },
      });

      if (!user || user.activeSessionToken !== token.sessionToken) {
        // Another login has taken over — invalidate this session
        return null;
      }

      session.user.id = token.id;
      session.user.firstName = token.firstName;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
