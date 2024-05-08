/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  DefaultUser,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";

import { SiweMessage } from "siwe";
import { getCsrfToken } from "next-auth/react";

import { env } from "@/env";
import { db } from "@/server/db";
import { client } from "@/lib/tonApiClient";
import {
  ConvertTonProofMessage,
  CreateMessage,
  SignatureVerify,
} from "@/lib/tonProof";
import {
  type TonProofItemReplySuccess,
  type Wallet,
} from "@tonconnect/ui-react";

import { type User as PrismaUser } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      address?: string;
      ton_addres?: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends PrismaUser {
    id: string;
    address?: string | null;
    tonAddress?: string | null;
    discordHandle?: string | null;
    twitterHandle?: string | null;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    session: ({ session, token }) => {
      console.log("token", token);
      console.log("token.sub", token.sub);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          // id: user.id
        },
      };
    },
    jwt: async ({ token, user }) => {
      console.log("user in jwt", user);
      const isSignIn = user ? true : false;

      if (isSignIn) {
        token.user = {
          id: user.id,
          address: user.address,
          tonAddress: user.tonAddress,
        };
      }

      return Promise.resolve(token);
    },
  },
  events: {
    linkAccount: async ({ user, account, profile }) => {
      let updateUserData = {};
      if (!user.image && profile.image) {
        updateUserData = {
          ...updateUserData,
          image: profile.image,
        };
      }
      if (user.name === user.address && profile.name) {
        updateUserData = {
          ...updateUserData,
          name: profile.name,
        };
      }

      if (!user.discordHandle && account.provider === "discord") {
        updateUserData = {
          ...updateUserData,
          discordHandle: profile.name,
        };
      }

      if (!user.twitterHandle && account.provider === "twitter") {
        updateUserData = {
          ...updateUserData,
          twitterHandle: profile.name,
        };
      }

      if (updateUserData) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: updateUserData,
        });
      }
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),

    TwitterProvider({
      clientId: env.TWITTER_ID,
      clientSecret: env.TWITTER_SECRET,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),

    CredentialsProvider({
      name: "Ethereum",
      type: "credentials",
      id: "evm",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        currentUser: {
          type: "text",
          placeholder: "0x0",
        },
      },
      authorize: async (credentials, req) => {
        try {
          const currentUser: PrismaUser = JSON.parse(
            credentials?.currentUser ?? "{}",
          );
          const currentMessage: SiweMessage = JSON.parse(
            credentials?.message ?? "{}",
          );

          const siwe = new SiweMessage(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            JSON.parse(credentials?.message ?? "{}"),
          );

          const result = await siwe.verify({
            signature: credentials?.signature ?? "",
            nonce: await getCsrfToken({ req }),
          });

          const isExistingUser = await db.user.findFirst({
            where: {
              address: currentMessage?.address,
            },
          });

          if (result.success && isExistingUser) {
            console.log("User already exist with this address");
            return isExistingUser;
          }

          if (result.success && !currentUser && !isExistingUser) {
            console.log("User doesn't exist");

            const newUserModel = await db.user.create({
              data: {
                address: currentMessage?.address,
                name: currentMessage?.address,
              },
            });
            await db.account.create({
              data: {
                userId: newUserModel.id,
                type: "credentials",
                provider: "Ethereum",
                providerAccountId: newUserModel.address ?? "",
              },
            });

            return newUserModel;
          } else if (result.success && currentUser && !currentUser.address) {
            console.log("currentUser", currentUser);
            console.log("User exist but doesn't have address");
            const updatedUser = await db.user.update({
              where: {
                id: currentUser.id,
              },
              data: {
                address: currentMessage?.address,
              },
            });

            await db.account.create({
              data: {
                userId: currentUser.id,
                type: "credentials",
                provider: "Ethereum",
                providerAccountId: currentMessage?.address ?? "",
              },
            });

            return updatedUser;
          }

          return null;
        } catch (error) {
          // Uncomment or add logging if needed
          console.error({ error });
          return null;
        }
      },
    }),

    CredentialsProvider({
      name: "TON",
      type: "credentials",
      id: "ton",
      credentials: {
        walletInfo: {
          label: "Message",
          type: "object",
        },
        currentUser: {
          type: "text",
          placeholder: "0x0",
        },
      },
      authorize: async (credentials) => {
        try {
          const currentUser: PrismaUser = JSON.parse(
            credentials?.currentUser ?? "{}",
          );
          const walletInfo: Wallet | null = JSON.parse(
            credentials?.walletInfo ?? "{}",
          );

          console.log("walletInfo in creds", walletInfo);

          if (!walletInfo) return null;

          const proof = walletInfo?.connectItems?.tonProof;

          const { public_key } = await client.accounts.getAccountPublicKey(
            walletInfo.account.address,
          );

          const pubKey = Buffer.from(public_key, "hex");

          const parsedMessage = ConvertTonProofMessage(
            walletInfo,
            proof as TonProofItemReplySuccess,
          );
          const checkMessage = await CreateMessage(parsedMessage);
          const verifyRes = SignatureVerify(
            pubKey,
            checkMessage,
            parsedMessage.Signature,
          );

          const isExistingUser = await db.user.findFirst({
            where: {
              ton_address: walletInfo.account.address,
            },
          });

          if (verifyRes && isExistingUser) {
            console.log("User already exist with this address");
            return isExistingUser;
          }

          if (verifyRes && !currentUser && !isExistingUser) {
            console.log("User doesn't exist");

            const newUserModel = await db.user.create({
              data: {
                ton_address: walletInfo.account.address,
                name: walletInfo.account.address,
              },
            });

            await db.account.create({
              data: {
                userId: newUserModel.id,
                type: "credentials",
                provider: "TON",
                providerAccountId: newUserModel.ton_address ?? "",
              },
            });

            return newUserModel;
          } else if (verifyRes && currentUser && !currentUser.ton_address) {
            console.log("currentUser", currentUser);
            console.log("User exist but doesn't have TON address");
            const updatedUser = await db.user.update({
              where: {
                id: currentUser.id,
              },
              data: {
                ton_address: walletInfo.account.address,
              },
            });

            await db.account.create({
              data: {
                userId: currentUser.id,
                type: "credentials",
                provider: "TON",
                providerAccountId: walletInfo.account.address ?? "",
              },
            });

            return updatedUser;
          }

          console.log("verifyRes", verifyRes);
          return null;
        } catch (error) {
          // Uncomment or add logging if needed
          console.error({ error });
          return null;
        }
      },
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
