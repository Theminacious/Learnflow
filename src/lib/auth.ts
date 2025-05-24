import { getServerSession, NextAuthOptions } from "next-auth";
import { prisma } from "./db";
import { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            credits: number;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        credits: number;
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // JWT Callback: Add user id and credits to the token
        jwt: async ({ token, user }) => {
            if (user) {
                // Only query the database if a user has logged in
                const db_user = await prisma.user.findUnique({
                    where: {
                        email: user.email, // Find by email
                    },
                });

                if (db_user) {
                    token.id = db_user.id;
                    token.credits = db_user.credits;
                }
            }
            return token;
        },

        // Session Callback: Attach token data to session
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.credits = token.credits;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET as string,
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
};


export const getAuthSession=()=>{
    return getServerSession(authOptions);
}