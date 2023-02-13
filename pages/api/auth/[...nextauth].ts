import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@models/index';
import 'db/index';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Användarnamn', type: 'text' },
        password: { label: 'Lösenord', type: 'password' },
      },
      async authorize(credentials, req) {
        const user = await User.findOne({
          username: credentials.username,
        }).exec();

        if (user.password === credentials.password) {
          return user.toObject();
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  theme: {
    colorScheme: 'light',
    brandColor: '#ff0000',
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
