/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import {
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
import { client } from "@/lib/ton-api-client";
import {
  ConvertTonProofMessage,
  CreateMessage,
  SignatureVerify,
} from "@/lib/ton-proof";
import {
  type TonProofItemReplySuccess,
  type Wallet,
} from "@tonconnect/ui-react";

import { type User as PrismaUser } from "@prisma/client";
import { generate } from "referral-codes";
import { objectToAuthDataMap, AuthDataValidator } from "@telegram-auth/server";

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
      address?: string | null;
      discord?: string | null;
      twitter?: string | null;
      tonAddress?: string | null;
      telegramUsername?: string | null;
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

  interface Profile {
    username: string;
    data: {
      username: string;
      name: string;
    };
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
    jwt: async ({ token, user, profile, account, session, trigger }) => {
      const isSignIn = user ? true : false;

      if (isSignIn) {
        let twitterHandle, discordHandle;
        account?.provider === "discord"
          ? (discordHandle = profile?.username)
          : (discordHandle = user.discordHandle);
        account?.provider === "twitter"
          ? (twitterHandle = profile?.data.name)
          : (twitterHandle = user.twitterHandle);

        return {
          ...token,
          id: user.id,
          address: user.address,
          tonAddress: user.ton_address,
          discord: discordHandle,
          twitter: twitterHandle,
          telegramUsername: user.telegramUsername,
        };
      }

      if (
        trigger === "update" &&
        (session as Record<string, string>)?.discord !== undefined
      ) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.discord = (session as Record<string, string>).discord;
      }

      if (
        trigger === "update" &&
        (session as Record<string, string>)?.twitter !== undefined
      ) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.twitter = (session as Record<string, string>)?.twitter;
      }

      if (
        trigger === "update" &&
        (session as Record<string, string>)?.address !== undefined
      ) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.address = (session as Record<string, string>)?.address;
      }

      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          address: token.address,
          discord: token.discord,
          twitter: token.twitter,
          tonAddress: token.tonAddress,
          telegramUsername: token.telegramUsername,
        },
      };
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

          // if (result.success && !currentUser && !isExistingUser) {
          //   console.log("User doesn't exist");

          //   const newUserModel = await db.user.create({
          //     data: {
          //       address: currentMessage?.address,
          //       name: currentMessage?.address,
          //     },
          //   });
          //   await db.account.create({
          //     data: {
          //       userId: newUserModel.id,
          //       type: "credentials",
          //       provider: "Ethereum",
          //       providerAccountId: newUserModel.address ?? "",
          //     },
          //   });

          //   return newUserModel;
          // } else
          if (result.success && currentUser && !currentUser.address) {
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
        refferedBy: {
          label: "refferedBy",
          type: "string",
        },
      },
      authorize: async (credentials) => {
        try {
          const walletInfo: Wallet | null = JSON.parse(
            credentials?.walletInfo ?? "{}",
          );

          const refferedBy: string = credentials?.refferedBy ?? "";
          const referralCode = generate({
            length: 8,
            count: 1,
          });

          if (!walletInfo) return null;

          const proof = walletInfo?.connectItems?.tonProof;

          if (walletInfo.account.publicKey)
            await client.wallet.getWalletsByPublicKey(
              walletInfo.account.publicKey,
            );

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

          if (verifyRes && !isExistingUser) {
            console.log("User doesn't exist");

            const newUserModel = await db.user.create({
              data: {
                ton_address: walletInfo.account.address,
                name: walletInfo.account.address,
                refferalCode: referralCode[0] ?? "",
                refferedBy: refferedBy,
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
      id: "telegram-login",
      name: "Telegram",
      credentials: {
        telegramData: {
          label: "telegramData",
          type: "text",
        },
        currentUser: {
          type: "text",
          placeholder: "0x0",
        },
      },
      authorize: async (credentials, req) => {
        console.log("credentials", credentials);
        const telegramInfo: Record<string, string | number> = JSON.parse(
          credentials?.telegramData ?? "{}",
        );

        console.log("telegramInfo", telegramInfo);
        const currentUser: PrismaUser = JSON.parse(
          credentials?.currentUser ?? "{}",
        );

        const validator = new AuthDataValidator({
          botToken: `${env.BOT_TOKEN}`,
        });

        const data = objectToAuthDataMap(telegramInfo);
        const user = await validator.validate(data);

        if (user.id && user.first_name) {
          const returned = {
            id: user.id,
            email: user.id.toString(),
            name: [user.first_name, user.last_name ?? ""].join(" "),
            image: user.photo_url,
          };

          try {
            console.log("user", user);

            const isExistingUser = await db.user.findFirst({
              where: {
                telegramUsername: user.username,
              },
            });

            if (isExistingUser) return isExistingUser;

            console.log("User exist but doesn't have telegram id");
            const updatedUser = await db.user.update({
              where: {
                id: currentUser.id,
              },
              data: {
                telegramUsername: user.username,
              },
            });

            await db.account.create({
              data: {
                userId: currentUser.id,
                type: "credentials",
                provider: "telegram",
                providerAccountId: user.id.toString(),
              },
            });

            return updatedUser;
          } catch {
            console.log("Something went wrong while creating the user.");
          }
        }
        return null;
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
  pages: {
    signIn: "/profile",
    error: "/",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
