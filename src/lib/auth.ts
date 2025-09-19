/**
 * NextAuth Configuration with Credit System Integration
 */

import { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { UserTier, TransactionType } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Check if this is a new user
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        // New user - create with signup bonus
        const newUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            avatarUrl: user.image,
            githubUsername: profile?.login as string | undefined,
            tier: UserTier.FREE,
            credits: 10, // 10 free credits on signup
            preferredModel: 'OPUS_4',
          },
        })

        // Record signup bonus transaction
        await prisma.creditTransaction.create({
          data: {
            userId: newUser.id,
            type: TransactionType.SIGNUP_BONUS,
            amount: 10,
            balance: 10,
            description: 'Welcome bonus - 10 free credits',
          },
        })
      }

      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
}